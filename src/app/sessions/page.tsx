"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CalendarPlus, MessageCircle, X, ChevronRight, CalendarDays } from "lucide-react"
import { TopBar } from "@/components/TopBar"
import { useAppStore } from "@/context/AppStoreContext"
import { formatSessionDate, formatTimeRange } from "@/lib/mock-data"
import { buildGoogleCalendarUrl } from "@/lib/calendar"
import type { UserSession } from "@/lib/store-types"
import { cn } from "@/lib/utils"

const STATUS_CONFIG: Record<UserSession["status"], { label: string; color: string }> = {
  upcoming: { label: "Upcoming", color: "bg-amber-100 text-amber-800" },
  matched: { label: "Matched", color: "bg-blue-100 text-blue-800" },
  confirmed: { label: "Confirmed", color: "bg-green-100 text-green-800" },
  completed: { label: "Completed", color: "bg-slate-100 text-slate-600" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
}

function SessionCard({ session, onCancel }: { session: UserSession; onCancel: (id: string) => void }) {
  const router = useRouter()
  const cfg = STATUS_CONFIG[session.status]
  const [showConfirm, setShowConfirm] = useState(false)

  const handlePrimary = () => {
    if (session.status === "upcoming") {
      router.push(`/matching?sessionId=${session.id}`)
    } else if (session.status === "matched") {
      router.push(`/match-found?sessionId=${session.id}`)
    } else if (session.status === "confirmed" && session.matchedWith) {
      router.push(`/chat?partner=${session.matchedWith.studentId}`)
    }
  }

  const calUrl =
    (session.status === "confirmed" || session.status === "matched") &&
    buildGoogleCalendarUrl({
      title: `Study: ${session.subject}`,
      location: session.location,
      time: `${session.startTime} – ${session.endTime}`,
      date: session.date,
    })

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 truncate">{session.subject}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {formatSessionDate(session.date)} · {formatTimeRange(session.startTime, session.endTime)}
          </p>
          <p className="text-xs text-slate-500 truncate">{session.location}</p>
          {session.goals && <p className="text-xs text-slate-400 mt-1 truncate">{session.goals}</p>}
        </div>
        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0", cfg.color)}>
          {cfg.label}
        </span>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex gap-2">
          {(session.status === "upcoming" || session.status === "matched" || session.status === "confirmed") && (
            <button
              onClick={handlePrimary}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-sky-50 text-sky-700 text-xs font-medium hover:bg-sky-100 transition-colors"
            >
              {session.status === "upcoming" && <><ChevronRight className="h-3.5 w-3.5" /> Find match</>}
              {session.status === "matched" && <><ChevronRight className="h-3.5 w-3.5" /> View match</>}
              {session.status === "confirmed" && <><MessageCircle className="h-3.5 w-3.5" /> Chat</>}
            </button>
          )}
          {calUrl && (
            <a
              href={calUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition-colors"
            >
              <CalendarPlus className="h-3.5 w-3.5" />
              Sync to Calendar
            </a>
          )}
        </div>
        {(session.status === "upcoming" || session.status === "matched" || session.status === "confirmed") && !showConfirm && (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full flex items-center justify-center gap-1 py-2 rounded-lg text-red-500 text-xs font-medium hover:bg-red-50 transition-colors"
          >
            <X className="h-3.5 w-3.5" /> Cancel session
          </button>
        )}
        {showConfirm && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-100">
            <p className="flex-1 text-xs text-red-700">Cancel this session?</p>
            <button
              onClick={() => { onCancel(session.id); setShowConfirm(false) }}
              className="px-3 py-1.5 rounded-md bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium hover:bg-slate-50 transition-colors"
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  if (count === 0) return null
  return (
    <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-5 mb-2 first:mt-0">
      {title} ({count})
    </h2>
  )
}

export default function SessionsPage() {
  const { store, updateSessionStatus } = useAppStore()
  const sessions = store.sessions

  const upcoming = sessions.filter((s) => s.status === "upcoming")
  const matched = sessions.filter((s) => s.status === "matched")
  const confirmed = sessions.filter((s) => s.status === "confirmed")
  const past = sessions.filter((s) => s.status === "completed" || s.status === "cancelled")

  const handleCancel = (id: string) => updateSessionStatus(id, "cancelled")

  const isEmpty = sessions.length === 0

  return (
    <div className="flex flex-col min-h-[780px]">
      <TopBar title="My Sessions" showBack backHref="/home" />

      <main className="flex-1 overflow-y-auto px-4 pb-28">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-80 text-center">
            <CalendarDays className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No sessions yet</p>
            <p className="text-xs text-slate-400 mt-1">Create a study session to get started</p>
            <Link
              href="/new-session"
              className="mt-4 px-5 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors"
            >
              New Session
            </Link>
          </div>
        ) : (
          <div className="mt-2">
            <SectionHeader title="Upcoming" count={upcoming.length} />
            <div className="space-y-2">
              {upcoming.map((s) => <SessionCard key={s.id} session={s} onCancel={handleCancel} />)}
            </div>

            <SectionHeader title="Matched" count={matched.length} />
            <div className="space-y-2">
              {matched.map((s) => <SessionCard key={s.id} session={s} onCancel={handleCancel} />)}
            </div>

            <SectionHeader title="Confirmed" count={confirmed.length} />
            <div className="space-y-2">
              {confirmed.map((s) => <SessionCard key={s.id} session={s} onCancel={handleCancel} />)}
            </div>

            <SectionHeader title="Past" count={past.length} />
            <div className="space-y-2">
              {past.map((s) => <SessionCard key={s.id} session={s} onCancel={handleCancel} />)}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
