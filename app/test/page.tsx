"use client"

import { useState } from "react"
import { useSendSolana } from "@/hooks/useRPC"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, Blockchain01Icon } from "@hugeicons/core-free-icons"

export default function TestPage() {
  const [toAddress, setToAddress] = useState("")
  const [amount, setAmount] = useState("0.01")

  const { mutate: sendSol, isPending, isSuccess, isError, data, error } = useSendSolana()

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!toAddress.trim() || !amount.trim()) return
    sendSol({ amount, toAddress: toAddress.trim() })
  }

  return (
    <div className="relative min-h-screen grid-bg">
      {/* Orbs */}
      <div className="orb-green" style={{ top: "-200px", left: "-200px" }} />
      <div className="orb-blue" style={{ bottom: "-150px", right: "-150px" }} />

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[var(--wm-border)] backdrop-blur-xl bg-[var(--wm-bg)]/80">
        <div className="flex items-center gap-2.5">
          <HugeiconsIcon icon={Blockchain01Icon} size={20} color="var(--wm-green)" />
          <span className="text-lg tracking-tight text-[var(--wm-text-bright)]" style={{ fontFamily: "var(--font-heading)" }}>
            Revelio
          </span>
          <span className="text-[9px] ml-2 px-2 py-0.5 uppercase tracking-[0.2em] border border-[var(--wm-yellow)]/30 text-[var(--wm-yellow)] bg-[var(--wm-yellow-dim)]" style={{ fontFamily: "var(--font-mono)" }}>
            Test
          </span>
        </div>
        <a
          href="/"
          className="text-[10px] uppercase tracking-wider text-[var(--wm-text-dim)] hover:text-[var(--wm-green)] transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ← Back to Dashboard
        </a>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-xl mx-auto px-6 pt-20">
        <div className="text-center mb-10">
          <h1
            className="text-3xl font-bold text-[var(--wm-text-bright)] mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Send SOL
          </h1>
          <p
            className="text-xs text-[var(--wm-text-dim)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Devnet · Testing Only
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="space-y-[1px]">
          {/* To Address */}
          <div className="stat-card p-5">
            <label
              className="block text-[9px] uppercase tracking-[0.15em] text-[var(--wm-text-dim)] mb-2"
              style={{ fontFamily: "var(--font-mono)" }}
              htmlFor="to-address"
            >
              Recipient Wallet Address
            </label>
            <input
              id="to-address"
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="Paste Solana wallet address..."
              className="w-full bg-[var(--wm-bg)] border border-[var(--wm-border-bright)] px-4 py-3 text-sm text-[var(--wm-text-bright)] placeholder:text-[var(--wm-text-dim)] focus:outline-none focus:border-[var(--wm-green)]/50 transition-colors"
              style={{ fontFamily: "var(--font-mono)" }}
            />
          </div>

          {/* Amount */}
          <div className="stat-card p-5">
            <label
              className="block text-[9px] uppercase tracking-[0.15em] text-[var(--wm-text-dim)] mb-2"
              style={{ fontFamily: "var(--font-mono)" }}
              htmlFor="amount"
            >
              Amount (SOL)
            </label>
            <input
              id="amount"
              type="number"
              step="0.001"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.01"
              className="w-full bg-[var(--wm-bg)] border border-[var(--wm-border-bright)] px-4 py-3 text-sm text-[var(--wm-text-bright)] placeholder:text-[var(--wm-text-dim)] focus:outline-none focus:border-[var(--wm-green)]/50 transition-colors"
              style={{ fontFamily: "var(--font-mono)" }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending || !toAddress.trim() || !amount.trim()}
            className="w-full flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-wider bg-[var(--wm-green)] text-[var(--wm-bg)] hover:bg-[var(--wm-green)]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {isPending ? (
              <>
                <span className="w-3 h-3 border-2 border-[var(--wm-bg)] border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send SOL
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </>
            )}
          </button>
        </form>

        {/* Result */}
        {isSuccess && data && (
          <div className="mt-4 stat-card border-t-2 border-t-[var(--wm-green)] p-5 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-[var(--wm-green)] pulse-dot" />
              <span
                className="text-[10px] uppercase tracking-wider text-[var(--wm-green)] font-bold"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Transaction Confirmed
              </span>
            </div>
            <p
              className="text-[11px] text-[var(--wm-text-dim)] mb-1"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Signature:
            </p>
            <p
              className="text-xs text-[var(--wm-text-bright)] break-all"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {data}
            </p>
            <a
              href={`https://explorer.solana.com/tx/${data}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-[10px] uppercase tracking-wider text-[var(--wm-blue)] hover:text-[var(--wm-green)] transition-colors"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              View on Explorer →
            </a>
          </div>
        )}

        {isError && (
          <div className="mt-4 stat-card border-t-2 border-t-[var(--wm-red)] p-5 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-[var(--wm-red)]" />
              <span
                className="text-[10px] uppercase tracking-wider text-[var(--wm-red)] font-bold"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Transaction Failed
              </span>
            </div>
            <p
              className="text-xs text-[var(--wm-text-dim)] break-all"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
