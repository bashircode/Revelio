"use client"

import { useState } from "react"
import { getTransactions } from "@/actions/getTransactions"
import { useQuery } from "@tanstack/react-query"
import { Navbar } from "@/components/navbar"

export default function TransactionsPage() {
  const [address, setAddress] = useState("")
  const [searchAddress, setSearchAddress] = useState("")

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["transactions", searchAddress],
    queryFn: () => getTransactions(searchAddress),
    enabled: !!searchAddress,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (address.trim()) {
      setSearchAddress(address.trim())
    }
  }

  const formatTime = (timestamp: number | null | undefined) => {
    if (!timestamp) return "—"
    return new Date(timestamp * 1000).toLocaleString()
  }

  const truncateSig = (sig: string) => {
    return `${sig.slice(0, 12)}…${sig.slice(-12)}`
  }

  return (
    <div className="relative min-h-screen grid-bg">
      {/* Scan Line Effect */}
      <div className="scan-line" />

      {/* Glowing Orbs */}
      <div className="orb-green" style={{ top: "-200px", left: "-200px" }} />
      <div className="orb-blue" style={{ bottom: "-150px", right: "-150px" }} />

      {/* Nav */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        {/* Page Header */}
        <div className="mb-10">
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--wm-text-bright)",
            }}
          >
            Transaction{" "}
            <span style={{ color: "var(--wm-green)" }}>Explorer</span>
          </h1>
          <p
            className="mt-2 text-sm"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--wm-text-dim)",
            }}
          >
            Look up recent transactions for any Solana wallet on devnet
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div
            className="flex gap-3 items-center p-1 rounded"
            style={{
              background: "var(--wm-bg-card)",
              border: "1px solid var(--wm-border)",
            }}
          >
            <input
              id="wallet-address-input"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Solana wallet address…"
              className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--wm-text)",
              }}
            />
            <button
              id="search-transactions-btn"
              type="submit"
              disabled={!address.trim() || isLoading}
              className="px-6 py-3 rounded text-sm font-semibold transition-all duration-200 disabled:opacity-40"
              style={{
                fontFamily: "var(--font-mono)",
                background: "var(--wm-green)",
                color: "var(--wm-bg)",
              }}
            >
              {isLoading || isFetching ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="31.4 31.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  Fetching…
                </span>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div
            className="mb-6 px-4 py-3 rounded text-sm"
            style={{
              background: "var(--wm-red-dim)",
              border: "1px solid var(--wm-red)",
              color: "var(--wm-red)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Error: {(error as Error).message}
          </div>
        )}

        {/* Results */}
        {data && data.length > 0 && (
          <div
            className="rounded overflow-hidden animate-fade-in-up"
            style={{
              background: "var(--wm-bg-card)",
              border: "1px solid var(--wm-border)",
            }}
          >
            {/* Table Header */}
            <div
              className="grid gap-4 px-5 py-3 text-[10px] uppercase tracking-widest"
              style={{
                gridTemplateColumns: "1fr 180px 100px",
                fontFamily: "var(--font-mono)",
                color: "var(--wm-text-dim)",
                borderBottom: "1px solid var(--wm-border)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <span>Signature</span>
              <span>Time</span>
              <span className="text-right">Status</span>
            </div>

            {/* Rows */}
            {data.map((tx, i) => (
              <div
                key={tx.signature}
                className={`grid gap-4 px-5 py-4 transition-colors duration-150 stagger-${i + 1}`}
                style={{
                  gridTemplateColumns: "1fr 180px 100px",
                  borderBottom:
                    i < data.length - 1
                      ? "1px solid var(--wm-border)"
                      : "none",
                  cursor: "pointer",
                  animationFillMode: "backwards",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "var(--wm-bg-card-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
                onClick={() =>
                  window.open(
                    `https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`,
                    "_blank"
                  )
                }
              >
                {/* Signature */}
                <span
                  className="text-sm truncate"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--wm-blue)",
                  }}
                  title={tx.signature}
                >
                  {truncateSig(tx.signature)}
                </span>

                {/* Time */}
                <span
                  className="text-xs self-center"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "var(--wm-text-dim)",
                  }}
                >
                  {formatTime(tx.blockTime)}
                </span>

                {/* Status */}
                <span className="text-right self-center">
                  {tx.confirmationStatus === "finalized" ? (
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{
                        fontFamily: "var(--font-mono)",
                        background: "var(--wm-green-dim)",
                        color: "var(--wm-green)",
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current pulse-dot" />
                      Finalized
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{
                        fontFamily: "var(--font-mono)",
                        background: "var(--wm-yellow-dim)",
                        color: "var(--wm-yellow)",
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current pulse-dot" />
                      {tx.confirmationStatus ?? "Pending"}
                    </span>
                  )}
                </span>
              </div>
            ))}

            {/* Footer */}
            <div
              className="px-5 py-3 text-[10px] uppercase tracking-widest text-right"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--wm-text-dim)",
                borderTop: "1px solid var(--wm-border)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              Showing {data.length} transactions · Devnet
            </div>
          </div>
        )}

        {/* Empty State */}
        {data && data.length === 0 && (
          <div
            className="text-center py-16 rounded animate-fade-in-up"
            style={{
              background: "var(--wm-bg-card)",
              border: "1px solid var(--wm-border)",
            }}
          >
            <div className="text-4xl mb-4">🔍</div>
            <p
              className="text-sm"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--wm-text-dim)",
              }}
            >
              No transactions found for this wallet
            </p>
          </div>
        )}

        {/* Initial State */}
        {!data && !isLoading && !error && (
          <div
            className="text-center py-16 rounded"
            style={{
              background: "var(--wm-bg-card)",
              border: "1px solid var(--wm-border)",
            }}
          >
            <div className="text-4xl mb-4">⚡</div>
            <p
              className="text-sm"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--wm-text-dim)",
              }}
            >
              Enter a wallet address to view recent transactions
            </p>
          </div>
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
            Solana Devnet · {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  )
}
