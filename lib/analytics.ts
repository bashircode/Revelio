import type { TransactionInfo } from "@/actions/getTransactions"

// ── Per-token PnL breakdown ──

export interface TokenPnL {
  mint: string
  symbol: string | undefined
  tokenName: string | undefined
  tokenIcon: string | undefined
  currentUsdPrice: number | null
  pnl: number
  totalBought: number          // SOL spent buying
  totalSold: number            // SOL received selling
  totalTokensBought: number    // raw token amount purchased
  totalTokensSold: number      // raw token amount sold
  buys: number
  sells: number
  firstBuyTime: number
  lastSellTime: number | null
  holdTimeHours: number | null
  result: "OPEN" | "GAIN" | "LOSS"
  pnlPercent: number | null    // % profit/loss for display
}

export function calculatePNL(transactions: TransactionInfo[]): TokenPnL[] {
  const grouped: Record<string, TransactionInfo[]> = {}

  for (const tx of transactions) {
    const mint = tx.token?.mint
    if (!mint) continue
    if (!grouped[mint]) grouped[mint] = []
    grouped[mint].push(tx)
  }

  return Object.entries(grouped).map(([mint, txs]) => {
    // Sort chronologically so sells only close buys that came before them
    const sorted = [...txs].sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0))

    // FIFO lot queue: each buy adds a lot; sells drain from the front
    interface Lot { solSpent: number; tokenAmount: number }
    const buyQueue: Lot[] = []

    let realizedPnl = 0
    let closedCostBasis = 0
    let totalBought = 0
    let totalSold = 0
    let totalTokensBought = 0
    let totalTokensSold = 0
    let buyCount = 0
    let sellCount = 0
    let firstBuyTime = Infinity
    let lastSellTime: number | null = null

    for (const tx of sorted) {
      if (tx.type === "buy") {
        buyCount++
        totalBought += tx.amountSol
        totalTokensBought += tx.tokenAmount
        firstBuyTime = Math.min(firstBuyTime, tx.timestamp ?? Infinity)
        buyQueue.push({ solSpent: tx.amountSol, tokenAmount: tx.tokenAmount })
      } else if (tx.type === "sell") {
        sellCount++
        totalSold += tx.amountSol
        totalTokensSold += tx.tokenAmount
        if (tx.timestamp != null) {
          lastSellTime = Math.max(lastSellTime ?? 0, tx.timestamp)
        }

        // Drain buy lots FIFO to cover the tokens being sold
        let tokensToCover = tx.tokenAmount
        let costBasis = 0

        while (tokensToCover > 0 && buyQueue.length > 0) {
          const lot = buyQueue[0]
          if (lot.tokenAmount <= tokensToCover) {
            costBasis += lot.solSpent
            tokensToCover -= lot.tokenAmount
            buyQueue.shift()
          } else {
            const usedSol = lot.solSpent * (tokensToCover / lot.tokenAmount)
            costBasis += usedSol
            lot.solSpent -= usedSol
            lot.tokenAmount -= tokensToCover
            tokensToCover = 0
          }
        }

        // Any unmatched tokens (missing buy data) are treated as zero cost
        closedCostBasis += costBasis
        realizedPnl += tx.amountSol - costBasis
      }
    }

    // OPEN = no sells at all, OR the last chronological action was a buy
    // (e.g. BUY→SELL→BUY: the trailing buy is still an open position)
    // A partial sell followed by no further buys means the trader has exited;
    // unsold tokens are treated as worthless dust for PnL purposes.
    const lastTx = sorted[sorted.length - 1]
    const isOpen = sellCount === 0 || lastTx?.type === "buy"

    // For closed positions use total in/out so unsold dust doesn't inflate PnL
    const pnl = isOpen ? realizedPnl : totalSold - totalBought

    const result: TokenPnL["result"] =
      isOpen ? "OPEN" : pnl > 0 ? "GAIN" : "LOSS"

    const holdTimeHours =
      result !== "OPEN" && lastSellTime && firstBuyTime !== Infinity
        ? (lastSellTime - firstBuyTime) / 3600
        : null

    const currentUsdPrice: number | null = txs[0].token?.usdPrice ?? null

    const pnlPercent =
      result !== "OPEN" && totalBought > 0
        ? (pnl / totalBought) * 100
        : null

    return {
      mint,
      symbol: txs[0].token?.symbol,
      tokenName: txs[0].token?.name,
      tokenIcon: txs[0].token?.icon,
      currentUsdPrice,
      pnl,
      totalBought,
      totalSold,
      totalTokensBought,
      totalTokensSold,
      buys: buyCount,
      sells: sellCount,
      firstBuyTime: firstBuyTime === Infinity ? 0 : firstBuyTime,
      lastSellTime,
      holdTimeHours,
      result,
      pnlPercent,
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

  const totalPnl = tokenPnls.reduce((acc, t) => {
    if (t.result === "OPEN") return acc
    return acc + t.pnl
  }, 0)

  const losses = tokenPnls.filter((t) => t.result === "LOSS" && t.pnl < 0)
  const biggestLoss =
    losses.length > 0 ? Math.min(...losses.map((t) => t.pnl)) : 0

  return {
    winRate,
    avgHoldTimeHours,
    totalPnl,
    biggestLoss,
  }
}
