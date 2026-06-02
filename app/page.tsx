"use client"

import { useState, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ResultHeader } from "@/components/result-header"
import { StatCards } from "@/components/stat-cards"
import { AiVerdict } from "@/components/ai-verdict"
import { CurrentHoldings } from "@/components/current-holdings"
import { TradingPatterns } from "@/components/trading-patterns"
import { ActivityChart } from "@/components/activity-chart"
import { useRPC } from "@/hooks/useRPC"

/* ─── Mock Data ─── */
const MOCK_STATS = {
  winRate: 68,
  avgHoldTime: "4.2h",
  totalPnl: "+47.3",
  biggestLoss: "-8.2",
}

const MOCK_HOLDINGS = [
  { token: "Bonk Inu", symbol: "BONK", amount: "12,450,000", pnlPercent: 142.5 },
  { token: "Jupiter", symbol: "JUP", amount: "8,320", pnlPercent: 34.2 },
  { token: "Raydium", symbol: "RAY", amount: "1,240", pnlPercent: -12.8 },
  { token: "Marinade", symbol: "MNDE", amount: "45,600", pnlPercent: 8.4 },
  { token: "Orca", symbol: "ORCA", amount: "2,100", pnlPercent: -5.3 },
  { token: "Pyth Network", symbol: "PYTH", amount: "15,800", pnlPercent: 67.1 },
]

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
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const { data, error } = useRPC();


  const handleAnalyze = useCallback((address: string) => {
    setWalletAddress(address)
    setIsLoading(true)
    setShowResults(false)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowResults(true)
    }, 2200)
  }, []);



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
        <HeroSection onAnalyze={handleAnalyze} isLoading={isLoading} />

        {/* Result Panel */}
        {showResults && (
          <section className="max-w-6xl mx-auto px-6 pb-24 space-y-[1px]">
            {/* Header */}
            <ResultHeader address={walletAddress} txnCount={847} />

            {/* Stat Cards */}
            <StatCards data={MOCK_STATS} />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-[1px] pt-[1px]">
              {/* Left Column - 3/5 */}
              <div className="lg:col-span-3 space-y-[1px]">
                <AiVerdict copyScore={8.2} summary={AI_SUMMARY} />
                <ActivityChart data={MOCK_ACTIVITY} />
              </div>

              {/* Right Column - 2/5 */}
              <div className="lg:col-span-2 space-y-[1px]">
                <CurrentHoldings holdings={MOCK_HOLDINGS} />
                <TradingPatterns patterns={MOCK_PATTERNS} />
              </div>
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
