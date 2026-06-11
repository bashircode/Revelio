"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Blockchain01Icon } from "@hugeicons/core-free-icons"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-[var(--wm-border)] backdrop-blur-xl bg-[var(--wm-bg)]/80">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex items-center justify-center w-8 h-8">
          <img src="./icon.png" alt="" />
        </div>
        <span
          className="text-lg tracking-tight text-[var(--wm-text-bright)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Revelio
        </span>
      </div>

      {/* Badge */}
      <div
        className="flex items-center gap-2 px-3 py-1 text-[10px] tracking-[0.2em] uppercase border border-[var(--wm-border-bright)] bg-[var(--wm-bg-card)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span className="text-[var(--wm-green)]">Solana</span>
        <span className="text-[var(--wm-text-dim)]">·</span>
        <span className="text-[var(--wm-blue)]">Beta</span>
      </div>
    </nav>
  )
}
