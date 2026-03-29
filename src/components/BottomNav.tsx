"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CalendarDays, PlusCircle, Users, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/context/AppStoreContext"

interface NavTab {
  key: string
  href: string
  icon: typeof Home
  label: string
  match: string[]
  raised?: boolean
}

const TABS: NavTab[] = [
  { key: "home", href: "/home", icon: Home, label: "Home", match: ["/home", "/browse"] },
  { key: "sessions", href: "/sessions", icon: CalendarDays, label: "Sessions", match: ["/sessions"] },
  { key: "new-session", href: "/new-session", icon: PlusCircle, label: "New Session", match: ["/new-session"], raised: true },
  { key: "partners", href: "/saved-partners", icon: Users, label: "Partners", match: ["/saved-partners"] },
  { key: "profile", href: "/profile", icon: User, label: "Profile", match: ["/profile"] },
]

function isActive(pathname: string, match: readonly string[]) {
  return match.some((m) => pathname === m || pathname.startsWith(m + "/"))
}

export function BottomNav() {
  const pathname = usePathname()
  const { store } = useAppStore()

  if (!store.isLoggedIn || !store.profileComplete) return null

  const hiddenPrefixes = ["/login", "/new-session", "/chat", "/match-found", "/matching", "/locations", "/error"]
  if (hiddenPrefixes.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-2 py-1 pb-3 z-40">
      <div className="flex items-end justify-around">
        {TABS.map((tab) => {
          const active = isActive(pathname, tab.match)
          const Icon = tab.icon

          if (tab.raised) {
            return (
              <Link key={tab.key} href={tab.href} className="flex flex-col items-center gap-1 -mt-8 group min-w-0">
                <div className="bg-sky-600 text-white rounded-full p-3.5 shadow-md shadow-sky-600/20 group-hover:bg-sky-700 transition-colors">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="text-[11px] font-semibold text-slate-800 tracking-wide">New Session</span>
              </Link>
            )
          }

          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 min-w-0 transition-all",
                active ? "text-sky-600" : "text-slate-400 hover:text-slate-700"
              )}
            >
              <Icon className={cn("h-6 w-6", active && "text-sky-600")} />
              <span
                className={cn(
                  "text-[10px] font-semibold transition-all overflow-hidden",
                  active ? "max-h-4 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
