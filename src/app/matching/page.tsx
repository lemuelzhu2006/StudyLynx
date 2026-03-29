"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { TopBar } from "@/components/TopBar"
import { Loader2 } from "lucide-react"
import { getMatchingSessions, getSessionById as getMockSession, STUDY_STYLES } from "@/lib/mock-data"
import { useAppStore } from "@/context/AppStoreContext"

function MatchingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { store, setMatchedPartner, setMatchedPartners, updateSessionStatus, getSessionById } = useAppStore()
  const sessionId = searchParams.get("sessionId") || searchParams.get("from")

  useEffect(() => {
    const runMatching = () => {
      let course: string
      let location: string
      let studyStyle: string
      let goal: string
      let date: string | undefined

      if (sessionId) {
        const userSession = getSessionById(sessionId)
        if (userSession) {
          course = userSession.subject
          location = userSession.location
          studyStyle = userSession.studyStyle
          goal = userSession.goals || ""
          date = userSession.date
        } else {
          const mockSes = getMockSession(sessionId)
          if (!mockSes) { router.replace("/home"); return }
          course = mockSes.course
          location = mockSes.location
          studyStyle = STUDY_STYLES.find((s) => s.id === mockSes.studyStyle)?.label ?? "Quiet study"
          goal = mockSes.goal
          date = mockSes.date
        }
      } else {
        router.replace("/home")
        return
      }

      let matches = getMatchingSessions(course, location, studyStyle, goal, date)
      if (matches.length === 0) {
        matches = getMatchingSessions(course, location, studyStyle, goal)
      }
      if (matches.length > 0) {
        const top3 = matches.slice(0, 3)
        const picked = top3[0]
        setMatchedPartner({ student: picked.student, session: picked })
        setMatchedPartners(top3.map((m) => ({ student: m.student, session: m })))
        if (sessionId) {
          updateSessionStatus(sessionId, "matched", { studentId: picked.student.id, sessionId: picked.id })
        }
        router.replace(`/match-found?sessionId=${sessionId}`)
      } else {
        router.replace("/home?no-match=1")
      }
    }

    const t = setTimeout(runMatching, 1500)
    return () => clearTimeout(t)
  }, [sessionId, router, setMatchedPartner, updateSessionStatus, getSessionById])

  return (
    <div className="flex flex-col min-h-[780px]">
      <TopBar showBack backHref="/home" />

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <Loader2 className="h-12 w-12 text-sky-500 animate-spin mb-6" />
        <h2 className="text-xl font-semibold text-slate-800">Finding a Match</h2>
        <p className="text-slate-600 text-center mt-2 max-w-xs">
          Looking for study partners who match your course, goals, and study style...
        </p>
      </main>
    </div>
  )
}

export default function MatchingPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><p className="text-slate-500">Loading...</p></div>}>
      <MatchingContent />
    </Suspense>
  )
}
