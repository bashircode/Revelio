"use client"

import type { TokenPnL } from "@/lib/analytics"

interface TradesTableProps {
  trades: TokenPnL[]
}

export function TradesTable({ trades }: TradesTableProps) {
  if (trades.length === 0) {
    return (
      <div className="stat-card border border-[var(--wm-border)] opacity-0 animate-fade-in-up stagger-5 p-8 text-center">
        <span
          className="text-sm text-[var(--wm-text-dim)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          No token trades found
        </span>
      </div>
    )
  }

  return (
    <div className="stat-card border border-[var(--wm-border)] opacity-0 animate-fade-in-up stagger-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-[var(--wm-border)]">
        <h3
          className="text-sm font-semibold text-[var(--wm-text-bright)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Token Trades
        </h3>
        <span
          className="text-[10px] text-[var(--wm-text-dim)] uppercase tracking-wider"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {trades.length} trades
        </span>
      </div>

      {/* Table Header */}
      <div
        className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 px-5 py-2.5 text-[9px] uppercase tracking-[0.15em] text-[var(--wm-text-dim)] border-b border-[var(--wm-border)] bg-[var(--wm-bg)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span>Token</span>
        <span className="text-center">Status</span>
        <span className="text-right">Invested</span>
        <span className="text-right">Sells</span>
        <span className="text-right">PnL</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[var(--wm-border)]">
        {trades.map((trade, i) => {
          const statusConfig = {
            OPEN: {
              color: "var(--wm-blue)",
              bg: "var(--wm-blue-dim)",
              label: "OPEN",
            },
            GAIN: {
              color: "var(--wm-green)",
              bg: "var(--wm-green-dim)",
              label: "GAIN",
            },
            LOSS: {
              color: "var(--wm-red)",
              bg: "var(--wm-red-dim)",
              label: "LOSS",
            },
          }[trade.result]

          const isPositive = trade.pnl >= 0
          const pnlColor = trade.result === "OPEN"
            ? "var(--wm-text-dim)"
            : isPositive
              ? "var(--wm-green)"
              : "var(--wm-red)"

          const pnlPrefix = trade.result === "OPEN" ? "" : isPositive ? "+" : ""

          return (
            <div
              key={trade.mint}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 px-5 py-3.5 hover:bg-[var(--wm-bg-card-hover)] transition-colors"
              style={{ animationDelay: `${0.3 + i * 0.03}s` }}
            >
              {/* Token */}
              <div className="flex items-center gap-2.5 min-w-0">
                {trade.tokenIcon ? (
                  <img
                    src={trade.tokenIcon}
                    alt={trade.symbol ?? ""}
                    className="w-7 h-7 flex-shrink-0"
                    style={{ borderRadius: "2px" }}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                ) : (
                  <div
                    className="w-7 h-7 flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                    style={{
                      fontFamily: "var(--font-mono)",
                      background: statusConfig.bg,
                      color: statusConfig.color,
                    }}
                  >
                    {(trade.symbol ?? "?").slice(0, 2)}
                  </div>
                )}
                <div className="min-w-0">
                  <span
                    className="text-xs text-[var(--wm-text-bright)] font-medium block truncate"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {trade.symbol ?? "Unknown"}
                  </span>
                  <span className="block text-[9px] text-[var(--wm-text-dim)] truncate">
                    {trade.tokenName ?? trade.mint.slice(0, 8) + "…"}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-center">
                <span
                  className="px-2 py-1 text-[9px] uppercase tracking-[0.15em] font-bold"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background: statusConfig.bg,
                    color: statusConfig.color,
                    border: `1px solid ${statusConfig.color}20`,
                  }}
                >
                  {statusConfig.label}
                </span>
              </div>

              {/* Invested */}
              <span
                className="text-xs text-[var(--wm-text)] text-right self-center"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {trade.totalBought.toFixed(3)}
                <span className="text-[9px] text-[var(--wm-text-dim)] ml-0.5">SOL</span>
              </span>

              {/* Sells */}
              <span
                className="text-xs text-[var(--wm-text)] text-right self-center"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {trade.sells}
              </span>

              {/* PnL */}
              <div className="flex flex-col items-end justify-center">
                <span
                  className="text-xs font-bold"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: pnlColor,
                  }}
                >
                  {trade.result === "OPEN" ? (
                    <span className="text-[var(--wm-text-dim)]">—</span>
                  ) : (
                    <>
                      {pnlPrefix}{trade.pnl.toFixed(3)}
                      <span className="text-[9px] ml-0.5" style={{ color: pnlColor }}>SOL</span>
                    </>
                  )}
                </span>
                {trade.pnlPercent !== null && (
                  <span
                    className="text-[9px]"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: pnlColor,
                    }}
                  >
                    {trade.pnlPercent >= 0 ? "+" : ""}{trade.pnlPercent.toFixed(1)}%
                  </span>
                )}
              </div>

            </div>
          )
        })}
      </div>

      {/* Footer Summary */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--wm-border)] bg-[var(--wm-bg)]">
        <span
          className="text-[9px] text-[var(--wm-text-dim)] uppercase tracking-wider"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {trades.filter((t) => t.result === "OPEN").length} open ·{" "}
          {trades.filter((t) => t.result === "GAIN").length} gains ·{" "}
          {trades.filter((t) => t.result === "LOSS").length} losses
        </span>
        <span
          className="text-[10px] font-bold"
          style={{
            fontFamily: "var(--font-mono)",
            color: trades.reduce((sum, t) => sum + (t.result !== "OPEN" ? t.pnl : 0), 0) >= 0
              ? "var(--wm-green)"
              : "var(--wm-red)",
          }}
        >
          Net:{" "}
          {trades.reduce((sum, t) => sum + (t.result !== "OPEN" ? t.pnl : 0), 0) >= 0 ? "+" : ""}
          {trades.reduce((sum, t) => sum + (t.result !== "OPEN" ? t.pnl : 0), 0).toFixed(3)} SOL
        </span>
      </div>
    </div>
  )
}
