"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { TopBar } from "@/components/TopBar"
import { MapPreviewCard } from "@/components/MapPreviewCard"
import { SessionCardCollapsed } from "@/components/SessionCardCollapsed"
import { SessionCardExpanded } from "@/components/SessionCardExpanded"
import { ActiveSessionBar } from "@/components/ActiveSessionBar"
import { getRecommendedSessions } from "@/lib/mock-data"
import { useAppStore } from "@/context/AppStoreContext"

function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { store, clearActiveSession, addSavedPartner, isPartnerSaved } = useAppStore()
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null)

  const demoActive = searchParams.get("active") === "1"
  const hasActiveSession = !!store.activeSession || demoActive
  const hasMatchedPartner = !!store.matchedPartner

  const recommendedSessions = getRecommendedSessions(
    store.user.courses,
    store.defaultLocation,
    store.user.habits
  )

  const toggleExpand = (id: string) => {
    setExpandedSessionId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar locationChip={store.defaultLocation} />

      <main className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
        {hasActiveSession && (
          <ActiveSessionBar
            location={store.activeSession?.location ?? "Robarts Library"}
            time={store.activeSession?.time ?? "1:30 PM – 4:45 PM"}
            status={store.activeSession?.status ?? "waiting"}
            onCancel={
              store.activeSession
                ? () => {
                    clearActiveSession()
                    router.refresh()
                  }
                : undefined
            }
          />
        )}

        {hasMatchedPartner && store.matchedPartner && (
          <div className="my-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">My match</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center text-sm font-semibold text-emerald-800">
                {store.matchedPartner.student.avatar}
              </div>
              <div>
                <p className="font-medium text-slate-800">{store.matchedPartner.student.name}</p>
                <p className="text-sm text-slate-600">
                  {store.matchedPartner.session.location} · {store.matchedPartner.session.course}
                </p>
              </div>
              <Link
                href={`/chat?partner=${store.matchedPartner.student.id}`}
                className="ml-auto py-2 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
              >
                Chat
              </Link>
            </div>
          </div>
        )}

        <MapPreviewCard className="my-4" sessions={recommendedSessions} />

        {!hasActiveSession && (
          <Link
            href="/home?active=1"
            className="block mt-2 text-xs text-sky-600 hover:text-sky-700"
          >
            Demo: view with active session
          </Link>
        )}
        <div className="flex items-center justify-between mt-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recommended Sessions</h2>
            <p className="text-sm text-slate-600 mt-1">
              Based on your course, study preferences, and default location
            </p>
          </div>
          <Link
            href="/browse"
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            Browse all
          </Link>
        </div>

        <div className="space-y-3 mt-4">
          {recommendedSessions.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">
              Complete your profile and preferences to see recommended sessions.
            </p>
          ) : (
            recommendedSessions.map((session) => (
              <div key={session.id}>
                {expandedSessionId === session.id ? (
                  <SessionCardExpanded
                    session={session}
                    onSavePartner={addSavedPartner}
                    isSaved={isPartnerSaved(session.student.id)}
                  />
                ) : (
                  <SessionCardCollapsed
                    session={session}
                    expanded={false}
                    onClick={() => toggleExpand(session.id)}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </main>

      <div className="flex-shrink-0 p-4 bg-white/95 backdrop-blur-sm border-t border-slate-200">
        <Link
          href="/new-session"
          className="block w-full py-4 rounded-xl bg-sky-600 text-white font-semibold text-center hover:bg-sky-700 active:bg-sky-800 transition-colors shadow-lg shadow-sky-600/25"
        >
          New Session
        </Link>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><p className="text-slate-500">Loading...</p></div>}>
      <HomeContent />
    </Suspense>
  )
}
