"use client"

import dynamic from "next/dynamic"
import type { Session } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const CampusMap = dynamic(() => import("@/components/CampusMap").then((m) => m.CampusMap), {
  ssr: false,
  loading: () => (
    <div
      className={cn(
        "rounded-xl bg-slate-100 border border-slate-200 overflow-hidden h-[140px] flex items-center justify-center"
      )}
    >
      <p className="text-slate-400 text-sm">Loading map...</p>
    </div>
  ),
})

interface MapPreviewCardProps {
  className?: string
  sessions?: Session[]
}

export function MapPreviewCard({ className, sessions = [] }: MapPreviewCardProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-slate-200 shadow-sm", className)}>
      <CampusMap height="140px" className="w-full" sessions={sessions} />
      <p className="text-[10px] text-slate-400 px-2 py-1.5 bg-slate-50 border-t border-slate-100">
        Your location and session spots · OpenStreetMap
      </p>
    </div>
  )
}
