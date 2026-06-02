"use client"

interface Holding {
  token: string
  symbol: string
  amount: string
  pnlPercent: number
}

interface CurrentHoldingsProps {
  holdings: Holding[]
}

export function CurrentHoldings({ holdings }: CurrentHoldingsProps) {
  return (
    <div className="stat-card border border-[var(--wm-border)] opacity-0 animate-fade-in-up stagger-6">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-[var(--wm-border)]">
        <h3
          className="text-sm font-semibold text-[var(--wm-text-bright)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Current Holdings
        </h3>
        <span
          className="text-[10px] text-[var(--wm-text-dim)] uppercase tracking-wider"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {holdings.length} tokens
        </span>
      </div>

      {/* Table Header */}
      <div
        className="grid grid-cols-3 gap-4 px-5 py-2.5 text-[9px] uppercase tracking-[0.15em] text-[var(--wm-text-dim)] border-b border-[var(--wm-border)] bg-[var(--wm-bg)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span>Token</span>
        <span className="text-right">Amount</span>
        <span className="text-right">PnL</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[var(--wm-border)]">
        {holdings.map((holding, i) => {
          const isPositive = holding.pnlPercent >= 0
          const pnlColor = isPositive ? "var(--wm-green)" : "var(--wm-red)"

          return (
            <div
              key={i}
              className="grid grid-cols-3 gap-4 px-5 py-3.5 hover:bg-[var(--wm-bg-card-hover)] transition-colors"
            >
              {/* Token */}
              <div className="flex items-center gap-2.5">
                <div
                  className="w-6 h-6 flex items-center justify-center text-[9px] font-bold"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background: isPositive
                      ? "var(--wm-green-dim)"
                      : "var(--wm-red-dim)",
                    color: pnlColor,
                  }}
                >
                  {holding.symbol.slice(0, 2)}
                </div>
                <div>
                  <span
                    className="text-xs text-[var(--wm-text-bright)] font-medium"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {holding.symbol}
                  </span>
                  <span className="block text-[9px] text-[var(--wm-text-dim)]">
                    {holding.token}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <span
                className="text-xs text-[var(--wm-text)] text-right self-center"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {holding.amount}
              </span>

              {/* PnL */}
              <div className="flex items-center justify-end gap-1.5">
                <span
                  className="text-xs font-bold"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: pnlColor,
                  }}
                >
                  {isPositive ? "+" : ""}
                  {holding.pnlPercent}%
                </span>
                <span
                  className="text-[9px] px-1.5 py-0.5"
                  style={{
                    background: isPositive
                      ? "var(--wm-green-dim)"
                      : "var(--wm-red-dim)",
                    color: pnlColor,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {isPositive ? "▲" : "▼"}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
