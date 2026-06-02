"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Activity01Icon } from "@hugeicons/core-free-icons"

interface ResultHeaderProps {
  address: string
  txnCount: number
}

export function ResultHeader({ address, txnCount }: ResultHeaderProps) {
  const truncated = `${address.slice(0, 4)}...${address.slice(-4)}`

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border border-[var(--wm-border)] bg-[var(--wm-bg-card)] opacity-0 animate-fade-in-up">
      {/* Address */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center bg-[var(--wm-green-dim)]">
          <HugeiconsIcon icon={Activity01Icon} size={14} color="var(--wm-green)" />
        </div>
        <div>
          <span
            className="text-sm font-bold text-[var(--wm-text-bright)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {truncated}
          </span>
          <span className="block text-[10px] text-[var(--wm-text-dim)]">
            Solana Mainnet
          </span>
        </div>
      </div>

      {/* Txn Count Badge */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--wm-border-bright)] bg-[var(--wm-bg)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="w-1.5 h-1.5 bg-[var(--wm-green)] pulse-dot" />
          <span className="text-[10px] text-[var(--wm-text-dim)] uppercase tracking-wider">
            <span className="text-[var(--wm-text-bright)] font-bold">
              {txnCount}
            </span>{" "}
            txns scanned
          </span>
        </div>

        {/* Status Badge */}
        <div
          className="px-2.5 py-1.5 text-[9px] uppercase tracking-[0.2em] font-bold bg-[var(--wm-green-dim)] text-[var(--wm-green)] border border-[var(--wm-green)]/20"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Complete
        </div>
      </div>
    </div>
  )
}
