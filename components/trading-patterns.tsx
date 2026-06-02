"use client"

interface Pattern {
  emoji: string
  title: string
  description: string
}

interface TradingPatternsProps {
  patterns: Pattern[]
}

export function TradingPatterns({ patterns }: TradingPatternsProps) {
  return (
    <div className="stat-card border border-[var(--wm-border)] opacity-0 animate-fade-in-up stagger-7">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-[var(--wm-border)]">
        <h3
          className="text-sm font-semibold text-[var(--wm-text-bright)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Trading Patterns
        </h3>
        <span
          className="text-[10px] text-[var(--wm-text-dim)] uppercase tracking-wider"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          AI Detected
        </span>
      </div>

      {/* Patterns List */}
      <div className="divide-y divide-[var(--wm-border)]">
        {patterns.map((pattern, i) => (
          <div
            key={i}
            className="flex items-start gap-4 p-5 hover:bg-[var(--wm-bg-card-hover)] transition-colors group"
          >
            {/* Emoji Icon */}
            <div className="w-9 h-9 flex items-center justify-center text-lg bg-[var(--wm-bg)] border border-[var(--wm-border)] shrink-0 group-hover:border-[var(--wm-border-bright)] transition-colors">
              {pattern.emoji}
            </div>

            {/* Content */}
            <div className="min-w-0">
              <h4
                className="text-xs font-semibold text-[var(--wm-text-bright)] mb-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {pattern.title}
              </h4>
              <p
                className="text-[11px] text-[var(--wm-text-dim)] leading-relaxed"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {pattern.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
