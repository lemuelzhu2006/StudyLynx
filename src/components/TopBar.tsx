"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface TopBarProps {
  title?: string
  showBack?: boolean
  backHref?: string
  locationChip?: string
}

export function TopBar({
  title,
  showBack,
  backHref = "/home",
  locationChip,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 px-4 py-3 flex items-center gap-3">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {showBack ? (
          <Link
            href={backHref}
            className="flex-shrink-0 p-2 -ml-1 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-slate-600" />
          </Link>
        ) : null}
        {locationChip ? (
          <Link
            href="/locations"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/90 active:bg-slate-200 transition-colors min-w-0 border border-slate-200/60"
          >
            <span className="truncate text-sm font-medium text-slate-700">{locationChip}</span>
          </Link>
        ) : null}
        {title && !locationChip ? (
          <h1 className="text-lg font-semibold text-slate-900 truncate">{title}</h1>
        ) : null}
      </div>
    </header>
  )
}
