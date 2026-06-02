"use client"

import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { AiBrain01Icon } from "@hugeicons/core-free-icons"

interface AiVerdictProps {
  copyScore: number
  summary: string
}

export function AiVerdict({ copyScore, summary }: AiVerdictProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const maxScore = 10
  const percentage = (copyScore / maxScore) * 100

  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = copyScore / steps
    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= copyScore) {
        setAnimatedScore(copyScore)
        clearInterval(interval)
      } else {
        setAnimatedScore(Math.round(current * 10) / 10)
      }
    }, duration / steps)

    return () => clearInterval(interval)
  }, [copyScore])

  const getScoreColor = (score: number) => {
    if (score >= 8) return "var(--wm-green)"
    if (score >= 6) return "var(--wm-blue)"
    if (score >= 4) return "var(--wm-yellow)"
    return "var(--wm-red)"
  }

  const scoreColor = getScoreColor(copyScore)

  return (
    <div className="stat-card border border-[var(--wm-border)] opacity-0 animate-fade-in-up stagger-5">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b border-[var(--wm-border)]">
        <div
          className="flex items-center justify-center w-8 h-8"
          style={{ background: "var(--wm-green-dim)" }}
        >
          <HugeiconsIcon icon={AiBrain01Icon} size={16} color="var(--wm-green)" />
        </div>
        <div>
          <h3
            className="text-sm font-semibold text-[var(--wm-text-bright)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            AI Verdict
          </h3>
          <p
            className="text-[10px] text-[var(--wm-text-dim)] uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Copy-worthiness analysis
          </p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Score Display */}
        <div className="flex items-center gap-6">
          {/* Score Number */}
          <div className="flex items-baseline gap-1 shrink-0">
            <span
              className="text-4xl font-bold"
              style={{
                fontFamily: "var(--font-mono)",
                color: scoreColor,
              }}
            >
              {animatedScore.toFixed(1)}
            </span>
            <span
              className="text-sm text-[var(--wm-text-dim)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              /10
            </span>
          </div>

          {/* Score Bar */}
          <div className="flex-1">
            <div className="relative h-2 bg-[var(--wm-bg)] overflow-hidden">
              {/* Track marks */}
              <div className="absolute inset-0 flex">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 border-r border-[var(--wm-border)]"
                  />
                ))}
              </div>
              {/* Fill */}
              <div
                className="absolute inset-y-0 left-0 score-bar-fill"
                style={{
                  "--score-width": `${percentage}%`,
                  background: `linear-gradient(90deg, ${scoreColor}80, ${scoreColor})`,
                  boxShadow: `0 0 12px ${scoreColor}40`,
                } as React.CSSProperties}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span
                className="text-[9px] text-[var(--wm-text-dim)] uppercase tracking-wider"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Avoid
              </span>
              <span
                className="text-[9px] text-[var(--wm-text-dim)] uppercase tracking-wider"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Copy Trade
              </span>
            </div>
          </div>
        </div>

        {/* Copy Score Label */}
        <div className="flex items-center gap-2">
          <span
            className="inline-flex px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] font-bold"
            style={{
              fontFamily: "var(--font-mono)",
              background: `${scoreColor}15`,
              color: scoreColor,
              border: `1px solid ${scoreColor}30`,
            }}
          >
            Copy Score
          </span>
          <span
            className="text-[10px] text-[var(--wm-text-dim)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Based on 847 transactions
          </span>
        </div>

        {/* AI Summary */}
        <p
          className="text-sm leading-relaxed text-[var(--wm-text)] border-l-2 border-[var(--wm-green)]/30 pl-4"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {summary}
        </p>
      </div>
    </div>
  )
}
