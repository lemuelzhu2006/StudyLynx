"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { TopBar } from "@/components/TopBar"
import { MapPreviewCard } from "@/components/MapPreviewCard"
import { SessionCardCollapsed } from "@/components/SessionCardCollapsed"
import { SessionCardExpanded } from "@/components/SessionCardExpanded"
import { ActiveSessionBar } from "@/components/ActiveSessionBar"
import { recommendedSessions } from "@/lib/mock-data"
import { useAppStore } from "@/context/AppStoreContext"

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { store, clearActiveSession, addSavedPartner, isPartnerSaved } = useAppStore()
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null)

  const demoActive = searchParams.get("active") === "1"
  const hasActiveSession = !!store.activeSession || demoActive
  const toggleExpand = (id: string) => {
    setExpandedSessionId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="flex flex-col min-h-[780px]">
      <TopBar locationChip={store.defaultLocation} rightIcons="none" />

      <main className="flex-1 overflow-y-auto px-4 pb-24">
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

        <MapPreviewCard className="my-4" />

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
            <h2 className="text-lg font-semibold text-slate-900">
              Recommended Sessions
            </h2>
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
          {recommendedSessions.map((session) => (
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
          ))}
        </div>
      </main>
    </div>
  )
}
