"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, User, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()

  if (["/login", "/new-session", "/chat", "/match-found", "/matching"].includes(pathname)) {
    return null
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-3.5 py-1 pb-3 z-40">
      <div className="flex items-end justify-between gap-2">
        <Link 
          href="/saved-partners"
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-2xl px-2.5 py-1.5 min-w-[84px] transition-all",
            pathname === "/saved-partners"
              ? "bg-sky-50 text-sky-600 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <Users className={cn("h-7 w-7", pathname === "/saved-partners" && "text-sky-600")} />
          <span className="text-xs font-semibold">Partners</span>
        </Link>

        <Link 
          href="/new-session"
          className="flex flex-col items-center gap-1.5 min-w-[88px] -mt-8 group"
        >
          <div className="bg-sky-600 text-white rounded-full p-3.5 shadow-md shadow-sky-600/20 group-hover:bg-sky-700 transition-colors">
            <PlusCircle className="h-8 w-8" />
          </div>
          <span className="text-sm font-semibold text-slate-800 tracking-wide">Study</span>
        </Link>

        <Link 
          href="/profile"
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-2xl px-2.5 py-1.5 min-w-[84px] transition-all",
            pathname === "/profile"
              ? "bg-sky-50 text-sky-600 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <User className={cn("h-7 w-7", pathname === "/profile" && "text-sky-600")} />
          <span className="text-xs font-semibold">Profile</span>
        </Link>
      </div>
    </div>
  )
}
