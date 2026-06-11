"use client"

import { useState, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ResultHeader } from "@/components/result-header"
import { StatCards } from "@/components/stat-cards"
import { AiVerdict } from "@/components/ai-verdict"
import { CurrentHoldings } from "@/components/current-holdings"
import { TradesTable } from "@/components/trades-table"
import { useStreamAnalysis } from "@/hooks/useRPC"

/* ─── Mock Data (AI & Patterns – to be replaced later) ─── */
const MOCK_PATTERNS = [
  {
    emoji: "🎯",
    title: "Sniper Entry",
    description:
      "Consistently enters positions within 2 minutes of token listing. Likely using automated tools or bots for early entry.",
  },
  {
    emoji: "💎",
    title: "Diamond Hands on Winners",
    description:
      "Holds winning positions 3x longer than average. Takes partial profits at 2x and lets the rest ride.",
  },
  {
    emoji: "🔪",
    title: "Quick Cut Losses",
    description:
      "Cuts losing positions within 30 minutes on average. Strict stop-loss discipline at -15% to -20%.",
  },
  {
    emoji: "🌙",
    title: "Night Owl Trader",
    description:
      "78% of trades happen between 11 PM and 4 AM UTC. Most active during Asian market hours overlap.",
  },
  {
    emoji: "🐋",
    title: "Whale Follower",
    description:
      "Frequently copies positions from 3-4 known whale wallets within 5 minutes of their trades.",
  },
]

const MOCK_ACTIVITY = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  count:
    i >= 22 || i <= 4
      ? Math.floor(Math.random() * 40) + 25
      : i >= 10 && i <= 14
        ? Math.floor(Math.random() * 25) + 10
        : Math.floor(Math.random() * 15) + 3,
}))

// Make hour 1 the peak
MOCK_ACTIVITY[1] = { hour: 1, count: 62 }
MOCK_ACTIVITY[23] = { hour: 23, count: 55 }

const AI_SUMMARY =
  "This wallet exhibits the behavior of a seasoned degen trader with strong risk management. The operator uses sniping tools for early entries on new token launches, maintains strict stop-losses, and shows pattern of following 3 specific whale wallets. Win rate of 68% is significantly above average. Primary risk: high concentration in meme tokens with over 70% of portfolio in volatile small-caps. The trader's discipline in cutting losses quickly compensates for occasional large drawdowns. Overall, a high-conviction, high-frequency operator worth monitoring."

export default function Page() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [submittedAddress, setSubmittedAddress] = useState<string | null>(null)

  const { tokenPnls, stats, progress, isLoading, error, reset } = useStreamAnalysis(submittedAddress)

  const handleAnalyze = useCallback((address: string) => {
    reset()
    setWalletAddress(address)
    setSubmittedAddress(address)
  }, [reset])

  const showResults = tokenPnls.length > 0 || stats !== null

  const progressLabel = progress ? `Fetching ${progress.chunk}/${progress.total}` : undefined

  const realStats = stats
    ? {
        winRate: Math.round(stats.winRate),
        avgHoldTime: stats.avgHoldTimeHours > 0
          ? `${stats.avgHoldTimeHours.toFixed(1)}h`
          : "N/A",
        totalPnl: `${stats.totalPnl >= 0 ? "+" : ""}${stats.totalPnl.toFixed(2)}`,
        biggestLoss: stats.biggestLoss < 0
          ? stats.biggestLoss.toFixed(2)
          : "0",
      }
    : null

  const realHoldings = tokenPnls
    .filter((t) => t.result === "OPEN")
    .map((t) => ({
      token: t.tokenName ?? t.mint.slice(0, 8) + "…",
      symbol: t.symbol ?? "???",
      amount: `${t.totalTokensBought.toLocaleString()} tokens`,
      pnlPercent: t.pnlPercent ?? 0,
    }))

  return (
    <div className="relative min-h-screen grid-bg">
      {/* Scan Line Effect */}
      <div className="scan-line" />

      {/* Glowing Orbs */}
      <div className="orb-green" style={{ top: "-200px", left: "-200px" }} />
      <div className="orb-blue" style={{ bottom: "-150px", right: "-150px" }} />
      <div
        className="orb-green"
        style={{ top: "50%", right: "-300px", opacity: 0.5 }}
      />

      {/* Nav */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero */}
        <HeroSection onAnalyze={handleAnalyze} isLoading={isLoading} progressLabel={progressLabel} />

        {/* Error State */}
        {error && submittedAddress && (
          <section className="max-w-6xl mx-auto px-6 pb-8">
            <div className="stat-card border border-[var(--wm-red)]/30 p-5 opacity-0 animate-fade-in-up">
              <span
                className="text-sm text-[var(--wm-red)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                ⚠ Failed to analyze wallet. Please check the address and try again.
              </span>
            </div>
          </section>
        )}

        {/* Result Panel — visible as soon as first token streams in */}
        {showResults && (
          <section className="max-w-6xl mx-auto px-6 pb-24 space-y-[1px]">
            {/* Header — only once we have transactionCount from the stats event */}
            {stats && (
              <ResultHeader
                address={walletAddress ?? ""}
                txnCount={stats.transactionCount}
              />
            )}

            {/* Stat Cards — only after stats event */}
            {realStats && <StatCards data={realStats} />}

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-[1px] pt-[1px]">
              {/* Left Column - 3/5 */}
              <div className="lg:col-span-3 space-y-[1px]">
                <AiVerdict copyScore={8.2} summary={AI_SUMMARY} />
              </div>

              {/* Right Column - 2/5 */}
              <div className="lg:col-span-2 space-y-[1px]">
                <CurrentHoldings holdings={realHoldings} />
                {/* <TradingPatterns patterns={MOCK_PATTERNS} /> */}
              </div>
            </div>

            {/* Trades Table — fills progressively as token events arrive */}
            <div className="pt-[1px]">
              <TradesTable trades={tokenPnls} />
            </div>

          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--wm-border)] py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <span
            className="text-[10px] text-[var(--wm-text-dim)] uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            WalletMind v0.1.0
          </span>
          <span
            className="text-[10px] text-[var(--wm-text-dim)] uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Solana Mainnet · {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  )
}
