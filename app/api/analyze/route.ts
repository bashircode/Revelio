import { NextRequest } from "next/server"
import { PublicKey } from "@solana/web3.js"
import { connection } from "@/lib/rpc-endpoints"
import { classifyTransaction } from "@/lib/utils"
import { resolveTokens, generateFallbackToken } from "@/lib/jupiter"
import { calculatePNL, calculateWalletStats } from "@/lib/analytics"
import type { TransactionInfo } from "@/actions/getTransactions"

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address")

  if (!address) {
    return new Response("Missing address", { status: 400 })
  }

  let pubkey: PublicKey
  try {
    pubkey = new PublicKey(address)
  } catch {
    return new Response("Invalid address", { status: 400 })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (payload: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))

      try {
        const signatures = await connection.getSignaturesForAddress(pubkey, { limit: 100 })

        if (signatures.length === 0) {
          emit({ type: "stats", data: { winRate: 0, avgHoldTimeHours: 0, totalPnl: 0, biggestLoss: 0, transactionCount: 0 } })
          emit({ type: "done" })
          controller.close()
          return
        }

        const chunkSize = 10
        const totalChunks = Math.ceil(signatures.length / chunkSize)
        const allParsed: any[] = []

        for (let i = 0; i < signatures.length; i += chunkSize) {
          const parsed = await connection.getParsedTransactions(
            signatures.slice(i, i + chunkSize).map((s) => s.signature),
            { commitment: "confirmed", maxSupportedTransactionVersion: 0 }
          )
          allParsed.push(...parsed)
          emit({ type: "progress", chunk: Math.floor(i / chunkSize) + 1, total: totalChunks })
          if (i + chunkSize < signatures.length) {
            await new Promise((r) => setTimeout(r, 1000))
          }
        }

        // Classify transactions and collect unique mints
        const classified: Array<{
          sig: (typeof signatures)[number]
          classified: ReturnType<typeof classifyTransaction>
          status: "success" | "failed"
        }> = []
        const mintSet = new Set<string>()

        for (let i = 0; i < signatures.length; i++) {
          const sig = signatures[i]
          const tx = allParsed[i]
          if (!tx) continue

          const status: "success" | "failed" = tx.meta?.err ? "failed" : "success"
          const c = classifyTransaction(tx)
          if (c.tokenMint) mintSet.add(c.tokenMint)
          classified.push({ sig, classified: c, status })
        }

        // Resolve token metadata from Jupiter
        const tokenMap = await resolveTokens([...mintSet])

        // Build full transaction list
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

        // Compute PnL (requires all transactions — FIFO lot matching)
        const tokenPnls = calculatePNL(transactions)
        const stats = calculateWalletStats(tokenPnls)

        // Stream each token position one-by-one
        for (const pnl of tokenPnls) {
          emit({ type: "token", data: pnl })
        }

        emit({ type: "stats", data: { ...stats, transactionCount: transactions.length } })
        emit({ type: "done" })
        controller.close()
      } catch (err) {
        emit({ type: "error", message: err instanceof Error ? err.message : "Unknown error" })
        controller.close()
      }
    },
    cancel() {},
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
