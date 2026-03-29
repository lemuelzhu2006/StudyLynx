"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { TopBar } from "@/components/TopBar"
import { useAppStore } from "@/context/AppStoreContext"
import { ProfileInfoCard } from "@/components/ProfileInfoCard"
import { SessionCardExpanded } from "@/components/SessionCardExpanded"
import { Avatar } from "@/components/Avatar"
import { STUDY_STYLES, formatSessionDate } from "@/lib/mock-data"
import { BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"

function MatchFoundContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { store, addSavedPartner, isPartnerSaved, setMatchedPartner, updateSessionStatus, getSessionById, addSession } = useAppStore()
  const [saved, setSaved] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const sessionId = searchParams.get("sessionId")
  const userSession = sessionId ? getSessionById(sessionId) : null
  const matches = store.matchedPartners ?? []
  const match = store.matchedPartner

  useEffect(() => {
    if (!match && matches.length === 0) router.replace("/home")
  }, [match, matches, router])

  if (!match && matches.length === 0) return null

  const allMatches = matches.length > 0 ? matches : (match ? [match] : [])
  const selected = allMatches[selectedIndex] ?? allMatches[0]
  if (!selected) return null

  const { student, session } = selected
  const isSaved = saved || isPartnerSaved(student.id)
  const programDisplay = `${student.subject} ${student.programType}`

  const handleSave = () => {
    addSavedPartner({ ...student, sharedCourses: [session.course], fitSummary: `Good fit for ${session.course}` })
    setSaved(true)
  }

  const handleAccept = () => {
    setMatchedPartner(selected)
    if (sessionId && userSession) {
      updateSessionStatus(sessionId, "confirmed")
    } else {
      const timeParts = session.time?.split(/\s*[–\-]\s*/) ?? []
      addSession({
        date: session.date || new Date().toISOString().split("T")[0],
        startTime: timeParts[0]?.trim() || "14:00",
        endTime: timeParts[1]?.trim() || "16:00",
        location: session.location,
        subject: session.course,
        studyStyle: STUDY_STYLES.find((s) => s.id === session.studyStyle)?.label ?? "Quiet study",
        goals: session.goal,
        status: "confirmed",
        matchedWith: { studentId: student.id, sessionId: session.id },
      })
    }
    router.push(`/chat?partner=${student.id}`)
  }

  const handlePass = () => {
    if (sessionId) updateSessionStatus(sessionId, "upcoming", null)
    setMatchedPartner(null)
    router.push("/home")
  }

  return (
    <div className="flex flex-col min-h-[780px]">
      <TopBar title="Match Found" showBack backHref="/home" />

      <main className="flex-1 overflow-y-auto px-4 pb-8">
        {allMatches.length > 1 && (
          <div className="mt-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Top {allMatches.length} Matches
            </h3>
            <div className="space-y-2">
              {allMatches.map((m, i) => (
                <button
                  key={m.session.id}
                  type="button"
                  onClick={() => { setSelectedIndex(i); setSaved(false) }}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all",
                    i === selectedIndex
                      ? "border-sky-300 bg-sky-50 ring-2 ring-sky-200/60 shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={m.student.avatar} size="md" className={cn(
                      "flex-shrink-0",
                      i === selectedIndex ? "ring-2 ring-sky-300" : ""
                    )} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={cn(
                          "font-medium truncate text-sm",
                          i === selectedIndex ? "text-sky-900" : "text-slate-800"
                        )}>
                          {m.student.name}
                        </span>
                        {m.student.verified && (
                          <BadgeCheck className="h-3.5 w-3.5 text-sky-500 flex-shrink-0" />
                        )}
                        <span className={cn(
                          "ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0",
                          i === 0 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                        )}>
                          #{i + 1}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {m.session.location} · {m.session.course}
                        {m.session.date && <> · {formatSessionDate(m.session.date)}</>}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <ProfileInfoCard
          name={student.name}
          avatar={student.avatar}
          verified={student.verified}
          academicSummary={`${student.verified ? "Verified " : ""}undergraduate · ${programDisplay} · ${session.course}`}
          className="mt-4"
        />

        <div className="mt-4">
          <h3 className="text-sm font-medium text-slate-500 mb-2">Session compatibility</h3>
          <SessionCardExpanded session={session} hideActions />
        </div>
      </main>

      <div className="mt-auto border-t border-slate-200 bg-white px-4 py-4">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleAccept}
            className="flex-1 min-w-[110px] py-3 rounded-xl bg-sky-600 text-white font-semibold text-center hover:bg-sky-700"
          >
            Accept Match
          </button>
          <button type="button" onClick={handlePass} className="flex-1 min-w-[90px] py-3 rounded-xl border border-slate-200 font-medium text-center hover:bg-slate-50">
            Pass
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaved}
            className={`py-3 px-4 rounded-xl border font-medium ${isSaved ? "border-slate-100 bg-slate-50 text-slate-400" : "border-slate-200 hover:bg-slate-50"}`}
          >
            {isSaved ? "Saved" : "Save Partner"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MatchFoundPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><p className="text-slate-500">Loading...</p></div>}>
      <MatchFoundContent />
    </Suspense>
  )
}
