"use client"

import { cn } from "@/lib/utils"
import { BottomNav } from "@/components/BottomNav"

interface MobileFrameProps {
  children: React.ReactNode
  className?: string
}

export function MobileFrame({ children, className }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4 md:p-8">
      <div
        className={cn(
          "w-full max-w-[420px] h-[780px] max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-slate-300 bg-white relative",
          className
        )}
      >
        <div className="h-full overflow-y-auto overflow-x-hidden">{children}</div>
        <BottomNav />
      </div>
    </div>
  )
}
