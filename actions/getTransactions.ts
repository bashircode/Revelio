"use server"

import { connection } from "@/lib/rpc-endpoints"
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"

export interface TokenTransfer {
  mint: string
  amount: number
  decimals: number
  source: string
  destination: string
}

export interface TransactionInfo {
  signature: string
  blockTime: number | null | undefined
  confirmationStatus: string | null | undefined
  fee: number
  balanceChange: number // SOL change for the queried wallet
  status: "success" | "failed"
  tokenTransfers: TokenTransfer[]
}

export const getTransactions = async (address: string): Promise<TransactionInfo[]> => {
  const pubkey = new PublicKey(address)

  const signatures = await connection.getSignaturesForAddress(pubkey, {
    limit: 20,
  })

  if (signatures.length === 0) return []

  const transactions = await connection.getParsedTransactions(
    signatures.map((s) => s.signature),
    {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    }
  )

  const results: TransactionInfo[] = []

  for (let i = 0; i < signatures.length; i++) {
    const sig = signatures[i]
    const tx = transactions[i]

    let fee = 0
    let balanceChange = 0
    let status: "success" | "failed" = "success"
    const tokenTransfers: TokenTransfer[] = []

    if (tx) {
      fee = (tx.meta?.fee ?? 0) / LAMPORTS_PER_SOL

      // Check transaction status
      if (tx.meta?.err) {
        status = "failed"
      }

      // Calculate SOL balance change for the queried address
      const accountKeys = tx.transaction.message.accountKeys
      const accountIndex = accountKeys.findIndex(
        (key) => key.pubkey.toBase58() === address
      )

      if (accountIndex !== -1 && tx.meta) {
        const preBalance = tx.meta.preBalances[accountIndex] ?? 0
        const postBalance = tx.meta.postBalances[accountIndex] ?? 0
        balanceChange = (postBalance - preBalance) / LAMPORTS_PER_SOL
      }

      // Extract SPL token transfers from inner instructions + top-level
      const allInstructions = [
        ...tx.transaction.message.instructions,
        ...(tx.meta?.innerInstructions?.flatMap((ix) => ix.instructions) ?? []),
      ]

      for (const ix of allInstructions) {
        if ("parsed" in ix && ix.program === "spl-token") {
          const parsed = ix.parsed
          if (
            parsed.type === "transfer" ||
            parsed.type === "transferChecked"
          ) {
            const info = parsed.info
            tokenTransfers.push({
              mint: info.mint ?? "Unknown",
              amount:
                parsed.type === "transferChecked"
                  ? Number(info.tokenAmount?.uiAmount ?? info.amount ?? 0)
                  : Number(info.amount ?? 0),
              decimals:
                parsed.type === "transferChecked"
                  ? Number(info.tokenAmount?.decimals ?? 0)
                  : 0,
              source: info.source ?? info.authority ?? "",
              destination: info.destination ?? "",
            })
          }
        }
      }
    }

    results.push({
      signature: sig.signature,
      blockTime: sig.blockTime,
      confirmationStatus: sig.confirmationStatus,
      fee,
      balanceChange,
      status,
      tokenTransfers,
    })
  }

  return results
}
