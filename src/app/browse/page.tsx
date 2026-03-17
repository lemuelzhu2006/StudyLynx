"use client"

import { useState } from "react"
import { TopBar } from "@/components/TopBar"
import { SessionCardCollapsed } from "@/components/SessionCardCollapsed"
import { SessionCardExpanded } from "@/components/SessionCardExpanded"
import { getRecommendedSessions, ALL_SESSIONS } from "@/lib/mock-data"
import { useAppStore } from "@/context/AppStoreContext"

export default function BrowsePage() {
  const { store, addSavedPartner, isPartnerSaved } = useAppStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const recommended = getRecommendedSessions(
    store.user.courses,
    store.defaultLocation,
    store.user.habits
  )
  const recommendedIds = new Set(recommended.map((s) => s.id))
  const otherSessions = ALL_SESSIONS.filter((s) => !recommendedIds.has(s.id))
  const allWithReasons = [...recommended, ...otherSessions]

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Browse sessions" showBack backHref="/home" />

      <main className="flex-1 overflow-y-auto px-4 pb-8">
        <p className="text-sm text-slate-600 mt-4 mb-6">
          Browse all available study sessions
        </p>
        <div className="space-y-3">
          {allWithReasons.map((session) => (
            <div key={session.id}>
              {expandedId === session.id ? (
                <SessionCardExpanded
                  session={session}
                  onSavePartner={addSavedPartner}
                  isSaved={isPartnerSaved(session.student.id)}
                />
              ) : (
                <SessionCardCollapsed
                  session={session}
                  expanded={false}
                  onClick={() => setExpandedId((prev) => (prev === session.id ? null : session.id))}
                />
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
