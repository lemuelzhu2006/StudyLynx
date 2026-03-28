"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TopBar } from "@/components/TopBar"
import { useAppStore } from "@/context/AppStoreContext"
import { ProfileInfoCard } from "@/components/ProfileInfoCard"
import { SessionCardExpanded } from "@/components/SessionCardExpanded"

export default function MatchFoundPage() {
  const router = useRouter()
  const { store, addSavedPartner, isPartnerSaved, setMatchedPartner } = useAppStore()
  const [saved, setSaved] = useState(false)

  const match = store.matchedPartner

  useEffect(() => {
    if (!match) router.replace("/home")
  }, [match, router])

  if (!match) return null

  const { student, session } = match
  const isSaved = saved || isPartnerSaved(student.id)
  const programDisplay = `${student.subject} ${student.programType}`

  const handleSave = () => {
    addSavedPartner({
      ...student,
      sharedCourses: [session.course],
      fitSummary: `Good fit for ${session.course}`,
    })
    setSaved(true)
  }

  const handlePass = () => {
    setMatchedPartner(null)
    router.push("/home")
  }

  return (
    <div className="flex flex-col min-h-[780px]">
      <TopBar title="Match Found" showBack backHref="/home" rightIcons="minimal" />

      <main className="flex-1 overflow-y-auto px-4 pb-8">
        <ProfileInfoCard
          name={student.name}
          avatar={student.avatar}
          verified={student.verified}
          academicSummary={`${student.verified ? "Verified " : ""}undergraduate · ${programDisplay} · ${session.course}`}
          className="mt-4"
        />

        <div className="mt-4">
          <h3 className="text-sm font-medium text-slate-500 mb-2">
            Session compatibility
          </h3>
          <SessionCardExpanded session={session} hideActions />
        </div>
      </main>

      <div className="mt-auto border-t border-slate-200 bg-white px-4 py-4">
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/chat?partner=${student.id}`}
            className="flex-1 min-w-[110px] py-3 rounded-xl bg-sky-600 text-white font-semibold text-center hover:bg-sky-700"
          >
            Accept Match
          </Link>
          <button
            type="button"
            onClick={handlePass}
            className="flex-1 min-w-[90px] py-3 rounded-xl border border-slate-200 font-medium text-center hover:bg-slate-50"
          >
            Pass
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaved}
            className={`py-3 px-4 rounded-xl border font-medium ${
              isSaved ? "border-slate-100 bg-slate-50 text-slate-400" : "border-slate-200 hover:bg-slate-50"
            }`}
          >
            {isSaved ? "Saved" : "Save Partner"}
          </button>
        </div>
      </div>
    </div>
  )
}
