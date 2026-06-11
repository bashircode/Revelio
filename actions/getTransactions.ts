"use server"

import { connection } from "@/lib/rpc-endpoints"
import { classifyTransaction, type ClassifiedTransaction } from "@/lib/utils"
import { resolveTokens, generateFallbackToken } from "@/lib/jupiter"
import { calculatePNL, calculateWalletStats, type TokenPnL, type WalletStats } from "@/lib/analytics"
import { PublicKey } from "@solana/web3.js"

export interface TransactionInfo {
  signature: string
  type: ClassifiedTransaction["type"]
  amountSol: number
  tokenAmount: number
  fee: number
  timestamp: number | null
  status: "success" | "failed"
  token: any | null
}

export interface TransactionsResponse {
  transactions: TransactionInfo[]
  tokenPnls: TokenPnL[]
  stats: WalletStats
}

export const getTransactions = async (address: string): Promise<TransactionsResponse> => {
  const pubkey = new PublicKey(address)

  const signatures = await connection.getSignaturesForAddress(pubkey, { limit: 100 })

  if (signatures.length === 0) {
    return {
      transactions: [],
      tokenPnls: [],
      stats: { winRate: 0, avgHoldTimeHours: 0, totalPnl: 0, biggestLoss: 0 },
    }
  }

  const chunkrate = 10;

  const allTransactions = [];

  for(let i = 0; i<signatures.length; i+= chunkrate){
    const chunk = signatures.slice(i, i+ chunkrate)
    
    const parsedTxs = await connection.getParsedTransactions(
      chunk.map((s) => s.signature),
      {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      }
    );

    allTransactions.push(...parsedTxs);

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // First pass: classify and collect unique mints
  const classified: Array<{
    sig: (typeof signatures)[number]
    classified: ClassifiedTransaction
    status: "success" | "failed"
  }> = []
  const mintSet = new Set<string>()

  for (let i = 0; i < signatures.length; i++) {
    const sig = signatures[i]
    const tx = allTransactions[i]
    if (!tx) continue

    const status: "success" | "failed" = tx.meta?.err ? "failed" : "success"
    const c = classifyTransaction(tx)

    if (c.tokenMint) mintSet.add(c.tokenMint)
    classified.push({ sig, classified: c, status })
  }

  // Resolve token info (name, symbol, icon, usdPrice) from Jupiter
  const tokenMap = await resolveTokens([...mintSet])

  // Second pass: build transaction list
  const transactions: TransactionInfo[] = []

  for (const { sig, classified: c, status } of classified) {
    let token: any = null
    if (c.tokenMint) {
      token = tokenMap.get(c.tokenMint) ?? generateFallbackToken(c.tokenMint)
    }

    transactions.push({
      signature: sig.signature,
      type: c.type,
      amountSol: c.amountSol,
      tokenAmount: c.tokenAmount,
      fee: c.fee,
      timestamp: c.timestamp,
      status,
      token,
    })
  }

  // Compute analytics
  const tokenPnls = calculatePNL(transactions)
  const stats = calculateWalletStats(tokenPnls)

  return { transactions, tokenPnls, stats }
}

