"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, AiSearchIcon } from "@hugeicons/core-free-icons"

interface HeroSectionProps {
  onAnalyze: (address: string) => void
  isLoading: boolean
  progressLabel?: string
}

export function HeroSection({ onAnalyze, isLoading, progressLabel }: HeroSectionProps) {
  const [address, setAddress] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (address.trim()) {
      onAnalyze(address.trim())
    }
  }

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[70vh] px-6 pt-24 pb-16">
      {/* Heading */}
      <div className="text-center max-w-4xl mx-auto mb-10">
        <h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-[var(--wm-text-bright)] mb-6"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Know How Any
          <br />
          Wallet{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--wm-green)] to-[var(--wm-blue)]">
            Trades.
          </span>
        </h1>

        <p
          className="text-sm md:text-base text-[var(--wm-text-dim)] max-w-xl mx-auto leading-relaxed"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Paste any Solana wallet and get an AI breakdown of trading patterns,
          wins, losses and behavior.
        </p>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl mx-auto"
      >
        <div className="relative flex items-center w-full border border-[var(--wm-border-bright)] bg-[var(--wm-bg-card)] hover:border-[var(--wm-green)]/30 focus-within:border-[var(--wm-green)]/50 transition-colors group">
          <div className="flex items-center pl-4 pr-2">
            <HugeiconsIcon
              icon={AiSearchIcon}
              size={18}
              color="var(--wm-text-dim)"
              className="group-focus-within:!text-[var(--wm-green)] transition-colors"
            />
          </div>

          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Paste Solana wallet address..."
            className="flex-1 bg-transparent py-4 px-2 text-sm text-[var(--wm-text-bright)] placeholder:text-[var(--wm-text-dim)] focus:outline-none"
            style={{ fontFamily: "var(--font-mono)" }}
            id="wallet-input"
          />

          <button
            type="submit"
            disabled={isLoading || !address.trim()}
            className="flex items-center gap-2 px-6 py-2.5 m-1.5 text-xs font-bold uppercase tracking-wider bg-[var(--wm-green)] text-[var(--wm-bg)] hover:bg-[var(--wm-green)]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ fontFamily: "var(--font-mono)" }}
            id="analyze-button"
          >
            {isLoading ? (
              <>
                <span className="w-3 h-3 border-2 border-[var(--wm-bg)] border-t-transparent rounded-full animate-spin" />
                {progressLabel ?? "Scanning"}
              </>
            ) : (
              <>
                Analyze
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Hint */}
      <p
        className="mt-4 text-[10px] text-[var(--wm-text-dim)] tracking-wider uppercase"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Try: 5YqRx...dKpE · Works with any Solana wallet
      </p>
    </section>
  )
}
