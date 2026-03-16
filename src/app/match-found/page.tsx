"use client"

import { useState } from "react"
import Link from "next/link"
import { TopBar } from "@/components/TopBar"
import { useAppStore } from "@/context/AppStoreContext"
import { ProfileInfoCard } from "@/components/ProfileInfoCard"
import { SessionCardExpanded } from "@/components/SessionCardExpanded"
import { recommendedSessions } from "@/lib/mock-data"

export default function MatchFoundPage() {
  const session = recommendedSessions[0]
  const { addSavedPartner, isPartnerSaved } = useAppStore()
  const [saved, setSaved] = useState(false)
  const isSaved = saved || isPartnerSaved(session.student.id)

  const handleSave = () => {
    addSavedPartner({
      ...session.student,
      sharedCourses: [session.course],
      fitSummary: `Good fit for ${session.course}`,
    })
    setSaved(true)
  }

  return (
    <div className="flex flex-col min-h-[780px]">
      <TopBar title="Match Found" showBack backHref="/home" rightIcons="minimal" />

      <main className="flex-1 overflow-y-auto px-4 pb-8">
        <ProfileInfoCard
          name={session.student.name}
          avatar={session.student.avatar}
          verified={session.student.verified}
          academicSummary={`First-year CS Specialist · ${session.course}`}
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
            href={`/chat?partner=${session.student.id}`}
            className="flex-1 min-w-[110px] py-3 rounded-xl bg-sky-600 text-white font-semibold text-center hover:bg-sky-700"
          >
            Accept Match
          </Link>
          <Link
            href="/matching"
            className="flex-1 min-w-[90px] py-3 rounded-xl border border-slate-200 font-medium text-center hover:bg-slate-50"
          >
            Pass
          </Link>
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
