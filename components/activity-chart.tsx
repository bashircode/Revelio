"use client"

import { useEffect, useState } from "react"

interface HourData {
  hour: number
  count: number
}

interface ActivityChartProps {
  data: HourData[]
}

export function ActivityChart({ data }: ActivityChartProps) {
  const [mounted, setMounted] = useState(false)
  const maxCount = Math.max(...data.map((d) => d.count))

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="stat-card border border-[var(--wm-border)] opacity-0 animate-fade-in-up stagger-8">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-[var(--wm-border)]">
        <h3
          className="text-sm font-semibold text-[var(--wm-text-bright)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Hourly Activity
        </h3>
        <span
          className="text-[10px] text-[var(--wm-text-dim)] uppercase tracking-wider"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          24h Distribution
        </span>
      </div>

      {/* Chart */}
      <div className="p-5 pt-6">
        <div className="flex items-end gap-[3px] h-36">
          {data.map((item, i) => {
            const heightPercent = (item.count / maxCount) * 100
            const isPeak = item.count === maxCount
            const isHighActivity = heightPercent > 60

            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1 group relative"
              >
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div
                    className="px-2 py-1 text-[9px] whitespace-nowrap bg-[var(--wm-bg-card)] border border-[var(--wm-border-bright)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <span className="text-[var(--wm-text-bright)]">
                      {item.count}
                    </span>
                    <span className="text-[var(--wm-text-dim)]"> txns</span>
                  </div>
                </div>

                {/* Bar */}
                <div
                  className="w-full relative overflow-hidden"
                  style={{
                    height: mounted ? `${heightPercent}%` : "0%",
                    transition: `height 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.03}s`,
                    background: isPeak
                      ? "var(--wm-green)"
                      : isHighActivity
                        ? "linear-gradient(to top, var(--wm-green)40, var(--wm-green)80)"
                        : "var(--wm-green)25",
                    boxShadow: isPeak
                      ? "0 0 12px var(--wm-green-glow)"
                      : "none",
                  }}
                >
                  {isPeak && (
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
                      }}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* X-axis Labels */}
        <div className="flex mt-2.5 gap-[3px]">
          {data.map((item, i) => (
            <div key={i} className="flex-1 text-center">
              {i % 3 === 0 && (
                <span
                  className="text-[8px] text-[var(--wm-text-dim)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {String(item.hour).padStart(2, "0")}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div
          className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--wm-border)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[var(--wm-green)]" />
            <span className="text-[9px] text-[var(--wm-text-dim)] uppercase tracking-wider">
              Peak Hour
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2" style={{ background: "var(--wm-green)40" }} />
            <span className="text-[9px] text-[var(--wm-text-dim)] uppercase tracking-wider">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
