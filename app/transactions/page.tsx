"use client"

import { useState } from "react"
import { getTransactions } from "@/actions/getTransactions"
import type { TransactionInfo } from "@/actions/getTransactions"
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

  const formatTime = (timestamp: number | null) => {
    if (!timestamp) return "—"
    return new Date(timestamp * 1000).toLocaleString()
  }

  const truncate = (str: string, front = 6, back = 4) => {
    if (str.length <= front + back + 3) return str
    return `${str.slice(0, front)}…${str.slice(-back)}`
  }

  const formatSol = (value: number) => {
    if (value === 0) return "0 SOL"
    return `${value.toFixed(6)} SOL`
  }

  const typeLabel = (type: TransactionInfo["type"]) => {
    switch (type) {
      case "buy":
        return { text: "BUY", color: "var(--wm-green)", bg: "var(--wm-green-dim)" }
      case "sell":
        return { text: "SELL", color: "var(--wm-red, #ef4444)", bg: "var(--wm-red-dim, rgba(239,68,68,0.1))" }
      case "SOL_TRANSFER":
        return { text: "SOL TRANSFER", color: "var(--wm-blue)", bg: "rgba(59,130,246,0.1)" }
      case "TOKEN_TRANSFER":
        return { text: "TOKEN TRANSFER", color: "#a78bfa", bg: "rgba(139,92,246,0.12)" }
    }
  }

  const stats = data?.stats
  const transactions = data?.transactions

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
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-24">
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
            Look up recent transactions for any Solana wallet
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

        {/* Stats Cards */}
        {stats && transactions && transactions.length > 0 && (
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up"
          >
            {/* Win Rate */}
            <div
              className="rounded-lg p-4"
              style={{
                background: "var(--wm-bg-card)",
                border: "1px solid var(--wm-border)",
              }}
            >
              <p
                className="text-[10px] uppercase tracking-widest mb-2"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--wm-text-dim)",
                }}
              >
                Win Rate
              </p>
              <p
                className="text-2xl font-bold"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: stats.winRate >= 50 ? "var(--wm-green)" : "var(--wm-red, #ef4444)",
                }}
              >
                {stats.winRate.toFixed(0)}%
              </p>
            </div>

            {/* Avg Hold Time */}
            <div
              className="rounded-lg p-4"
              style={{
                background: "var(--wm-bg-card)",
                border: "1px solid var(--wm-border)",
              }}
            >
              <p
                className="text-[10px] uppercase tracking-widest mb-2"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--wm-text-dim)",
                }}
              >
                Avg Hold Time
              </p>
              <p
                className="text-2xl font-bold"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--wm-text-bright)",
                }}
              >
                {stats.avgHoldTimeHours < 1
                  ? `${(stats.avgHoldTimeHours * 60).toFixed(0)}m`
                  : `${stats.avgHoldTimeHours.toFixed(1)}h`}
              </p>
            </div>

            {/* Total PnL */}
            <div
              className="rounded-lg p-4"
              style={{
                background: "var(--wm-bg-card)",
                border: "1px solid var(--wm-border)",
              }}
            >
              <p
                className="text-[10px] uppercase tracking-widest mb-2"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--wm-text-dim)",
                }}
              >
                Total PnL
              </p>
              <p
                className="text-2xl font-bold"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: stats.totalPnl >= 0 ? "var(--wm-green)" : "var(--wm-red, #ef4444)",
                }}
              >
                {stats.totalPnl >= 0 ? "+" : ""}
                {stats.totalPnl.toFixed(2)}
                <span
                  className="text-sm font-normal ml-1"
                  style={{ color: "var(--wm-text-dim)" }}
                >
                  SOL
                </span>
              </p>
            </div>

            {/* Biggest Loss */}
            <div
              className="rounded-lg p-4"
              style={{
                background: "var(--wm-bg-card)",
                border: "1px solid var(--wm-border)",
              }}
            >
              <p
                className="text-[10px] uppercase tracking-widest mb-2"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--wm-text-dim)",
                }}
              >
                Biggest Loss
              </p>
              <p
                className="text-2xl font-bold"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: stats.biggestLoss < 0 ? "var(--wm-red, #ef4444)" : "var(--wm-text-dim)",
                }}
              >
                {stats.biggestLoss === 0
                  ? "—"
                  : `${stats.biggestLoss.toFixed(2)}`}
                {stats.biggestLoss !== 0 && (
                  <span
                    className="text-sm font-normal ml-1"
                    style={{ color: "var(--wm-text-dim)" }}
                  >
                    SOL
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {transactions && transactions.length > 0 && (
          <div
            className="rounded overflow-hidden animate-fade-in-up"
            style={{
              background: "var(--wm-bg-card)",
              border: "1px solid var(--wm-border)",
            }}
          >
            {/* Table Header */}
            <div
              className="grid gap-3 px-5 py-3 text-[10px] uppercase tracking-widest"
              style={{
                gridTemplateColumns: "90px 1fr 1fr 1fr 0.5fr 140px",
                fontFamily: "var(--font-mono)",
                color: "var(--wm-text-dim)",
                borderBottom: "1px solid var(--wm-border)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <span>Type</span>
              <span>Token</span>
              <span>Signature</span>
              <span>Amount (SOL)</span>
              <span>Fee</span>
              <span className="text-right">Time</span>
            </div>

            {/* Rows */}
            {transactions.map((tx: TransactionInfo, i: number) => {
              const label = typeLabel(tx.type)
              return (
                <div
                  key={tx.signature}
                  className={`stagger-${i + 1}`}
                  style={{
                    borderBottom:
                      i < transactions.length - 1
                        ? "1px solid var(--wm-border)"
                        : "none",
                    animationFillMode: "backwards",
                  }}
                >
                  <div
                    className="grid gap-3 px-5 py-4 transition-colors duration-150 items-center"
                    style={{
                      gridTemplateColumns: "90px 1fr 1fr 1fr 0.5fr 140px",
                      cursor: "pointer",
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
                        `https://explorer.solana.com/tx/${tx.signature}`,
                        "_blank"
                      )
                    }
                  >
                    {/* Type Badge */}
                    <span>
                      <span
                        className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-semibold"
                        style={{
                          fontFamily: "var(--font-mono)",
                          background: label.bg,
                          color: label.color,
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current pulse-dot" />
                        {label.text}
                      </span>
                    </span>

                    {/* Token Info */}
                    <span className="flex items-center gap-2 min-w-0">
                      {tx.token ? (
                        <>
                          {tx.token.icon && (
                            <img
                              src={tx.token.icon}
                              alt={tx.token.symbol}
                              className="w-5 h-5 rounded-full flex-shrink-0"
                              style={{
                                border: "1px solid var(--wm-border)",
                              }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none"
                              }}
                            />
                          )}
                          <span className="flex flex-col min-w-0">
                            <span
                              className="text-xs font-semibold truncate"
                              style={{
                                fontFamily: "var(--font-mono)",
                                color: "var(--wm-text-bright)",
                              }}
                            >
                              {tx.token.symbol}
                            </span>
                            <span
                              className="text-[10px] truncate"
                              style={{
                                fontFamily: "var(--font-mono)",
                                color: "var(--wm-text-dim)",
                              }}
                              title={tx.token.name}
                            >
                              {tx.token.name.length > 20
                                ? tx.token.name.slice(0, 18) + "…"
                                : tx.token.name}
                            </span>
                          </span>
                        </>
                      ) : (
                        <span
                          className="text-xs"
                          style={{
                            fontFamily: "var(--font-mono)",
                            color: "var(--wm-text-dim)",
                          }}
                        >
                          SOL
                        </span>
                      )}
                    </span>

                    {/* Signature */}
                    <span
                      className="text-sm truncate"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--wm-blue)",
                      }}
                      title={tx.signature}
                    >
                      {truncate(tx.signature, 10, 6)}
                    </span>

                    {/* Amount in SOL */}
                    <span
                      className="text-sm font-semibold"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color:
                          tx.type === "buy"
                            ? "var(--wm-green)"
                            : tx.type === "sell"
                              ? "var(--wm-red, #ef4444)"
                              : "var(--wm-text)",
                      }}
                    >
                      {tx.type === "buy" && "−"}
                      {tx.type === "sell" && "+"}
                      {formatSol(tx.amountSol)}
                    </span>

                    {/* Fee */}
                    <span
                      className="text-xs"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--wm-text-dim)",
                      }}
                    >
                      {tx.fee > 0 ? `${tx.fee.toFixed(6)}` : "—"}
                    </span>

                    {/* Timestamp */}
                    <span
                      className="text-xs text-right"
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--wm-text-dim)",
                      }}
                    >
                      {formatTime(tx.timestamp)}
                    </span>
                  </div>
                </div>
              )
            })}

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
              Showing {transactions.length} transactions · Mainnet
            </div>
          </div>
        )}

        {/* Empty State */}
        {transactions && transactions.length === 0 && (
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
            Revelio v0.1.0
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
