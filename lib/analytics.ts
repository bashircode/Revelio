import type { TransactionInfo } from "@/actions/getTransactions"

// ── Per-token PnL breakdown ──

export interface TokenPnL {
  mint: string
  symbol: string | undefined
  pnl: number
  totalBought: number
  totalSold: number
  buys: number
  sells: number
  firstBuyTime: number
  lastSellTime: number | null
  holdTimeHours: number | null
  result: "OPEN" | "GAIN" | "LOSS"
}

export function calculatePNL(transactions: TransactionInfo[]): TokenPnL[] {
  // Group transactions by token mint
  const grouped: Record<string, TransactionInfo[]> = {}

  for (const tx of transactions) {
    const mint = tx.token?.mint
    if (!mint) continue
    if (!grouped[mint]) grouped[mint] = []
    grouped[mint].push(tx)
  }

  return Object.entries(grouped).map(([mint, txs]) => {
    const buys = txs.filter((tx) => tx.type === "buy")
    const sells = txs.filter((tx) => tx.type === "sell")

    const totalBought = buys.reduce((acc, tx) => acc + tx.amountSol, 0)
    const totalSold = sells.reduce((acc, tx) => acc + tx.amountSol, 0)
    const pnl = totalSold - totalBought

    const firstBuyTime = Math.min(...buys.map((tx) => tx.timestamp ?? Infinity))
    const lastSellTime =
      sells.length > 0
        ? Math.max(...sells.map((tx) => tx.timestamp ?? 0))
        : null

    // Hold time in hours between first buy and last sell
    const holdTimeHours =
      lastSellTime && firstBuyTime !== Infinity
        ? (lastSellTime - firstBuyTime) / 3600
        : null

    const result: TokenPnL["result"] =
      sells.length === 0 ? "OPEN" : pnl > 0 ? "GAIN" : "LOSS"

    return {
      mint,
      symbol: txs[0].token?.symbol,
      pnl,
      totalBought,
      totalSold,
      buys: buys.length,
      sells: sells.length,
      firstBuyTime,
      lastSellTime,
      holdTimeHours,
      result,
    }
  })
}

// ── Aggregate wallet stats ──

export interface WalletStats {
  winRate: number          // percentage 0–100
  avgHoldTimeHours: number // average across closed positions
  totalPnl: number         // total SOL gained/lost
  biggestLoss: number      // most negative single-token PnL
}

export function calculateWalletStats(tokenPnls: TokenPnL[]): WalletStats {
  const closed = tokenPnls.filter((t) => t.result !== "OPEN")
  const wins = closed.filter((t) => t.result === "GAIN")

  const winRate = closed.length > 0 ? (wins.length / closed.length) * 100 : 0

  const holdTimes = closed
    .map((t) => t.holdTimeHours)
    .filter((h): h is number => h !== null && h > 0)
  const avgHoldTimeHours =
    holdTimes.length > 0
      ? holdTimes.reduce((a, b) => a + b, 0) / holdTimes.length
      : 0

  const totalPnl = tokenPnls.reduce((acc, t) => acc + t.pnl, 0)

  const losses = tokenPnls.filter((t) => t.pnl < 0)
  const biggestLoss =
    losses.length > 0 ? Math.min(...losses.map((t) => t.pnl)) : 0

  return {
    winRate,
    avgHoldTimeHours,
    totalPnl,
    biggestLoss,
  }
}
