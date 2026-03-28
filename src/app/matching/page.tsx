"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { TopBar } from "@/components/TopBar"
import { Loader2 } from "lucide-react"
import { getMatchingSessions, getSessionById, STUDY_STYLES } from "@/lib/mock-data"
import { useAppStore } from "@/context/AppStoreContext"

function MatchingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { store, setMatchedPartner } = useAppStore()
  const fromSessionId = searchParams.get("from")

  useEffect(() => {
    const runMatching = () => {
      let course: string
      let location: string
      let studyStyle: string
      let goal: string

      if (fromSessionId) {
        const session = getSessionById(fromSessionId)
        if (!session) {
          router.replace("/home")
          return
        }
        course = session.course
        location = session.location
        studyStyle = STUDY_STYLES.find((s) => s.id === session.studyStyle)?.label ?? "Quiet study"
        goal = session.goal
      } else {
        const active = store.activeSession
        if (!active) {
          router.replace("/home")
          return
        }
        course = active.subject
        location = active.location
        studyStyle = active.rules || "Quiet study"
        goal = active.goals || ""
      }

      const matches = getMatchingSessions(course, location, studyStyle, goal)
      const picked = matches[0]
      if (picked) {
        setMatchedPartner({ student: picked.student, session: picked })
        router.replace("/match-found")
      } else {
        router.replace("/home")
      }
    }

    const t = setTimeout(runMatching, 1500)
    return () => clearTimeout(t)
  }, [fromSessionId, store.activeSession, router, setMatchedPartner])

  return (
    <div className="flex flex-col min-h-[780px]">
      <TopBar showBack backHref="/home" rightIcons="none" />

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
