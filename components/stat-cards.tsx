"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Analytics01Icon,
  AlarmClockIcon,
  BitcoinCircleIcon,
  AlertDiamondIcon,
} from "@hugeicons/core-free-icons"

interface StatCardProps {
  label: string
  value: string
  borderColor: string
  icon: typeof Analytics01Icon
  iconColor: string
  suffix?: string
  delay?: string
}

function StatCard({
  label,
  value,
  borderColor,
  icon,
  iconColor,
  suffix,
  delay = "0s",
}: StatCardProps) {
  return (
    <div
      className="stat-card relative overflow-hidden opacity-0 animate-fade-in-up"
      style={{
        borderTop: `2px solid ${borderColor}`,
        animationDelay: delay,
      }}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[10px] uppercase tracking-[0.15em] text-[var(--wm-text-dim)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {label}
          </span>
          <HugeiconsIcon icon={icon} size={14} color={iconColor} />
        </div>
        <div className="flex items-baseline gap-1">
          <span
            className="text-2xl font-bold text-[var(--wm-text-bright)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {value}
          </span>
          {suffix && (
            <span
              className="text-xs text-[var(--wm-text-dim)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {suffix}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

interface StatCardsProps {
  data: {
    winRate: number
    avgHoldTime: string
    totalPnl: string
    biggestLoss: string
  }
}

export function StatCards({ data }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[var(--wm-border)]">
      <StatCard
        label="Win Rate"
        value={`${data.winRate}%`}
        borderColor="var(--wm-green)"
        icon={Analytics01Icon}
        iconColor="var(--wm-green)"
        delay="0.1s"
      />
      <StatCard
        label="Avg Hold Time"
        value={data.avgHoldTime}
        borderColor="var(--wm-blue)"
        icon={AlarmClockIcon}
        iconColor="var(--wm-blue)"
        delay="0.15s"
      />
      <StatCard
        label="Total PnL"
        value={data.totalPnl}
        borderColor="var(--wm-green)"
        icon={BitcoinCircleIcon}
        iconColor="var(--wm-green)"
        suffix="SOL"
        delay="0.2s"
      />
      <StatCard
        label="Biggest Loss"
        value={data.biggestLoss}
        borderColor="var(--wm-red)"
        icon={AlertDiamondIcon}
        iconColor="var(--wm-red)"
        suffix="SOL"
        delay="0.25s"
      />
    </div>
  )
}
