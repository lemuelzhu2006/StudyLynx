"use client"

import { TopBar } from "@/components/TopBar"
import { SavedPartnerCard } from "@/components/SavedPartnerCard"
import { useAppStore } from "@/context/AppStoreContext"
import { EmptyStateCard } from "@/components/EmptyStateCard"

export default function SavedPartnersPage() {
  const { store, removeSavedPartner } = useAppStore()
  const partners = store.savedPartners

  return (
    <div className="flex flex-col min-h-[780px]">
      <TopBar title="Saved Partners" showBack backHref="/home" />

      <main className="flex-1 overflow-y-auto px-4 pb-8">
        <p className="text-sm text-slate-600 mt-4 mb-6">
          Partners you&apos;ve studied with before. Invite them again for a session.
        </p>
        {partners.length === 0 ? (
          <EmptyStateCard
            title="No saved partners yet"
            description="Save partners from session cards to quickly invite them again."
          />
        ) : (
          <div className="space-y-4">
            {partners.map((partner) => (
              <SavedPartnerCard
                key={partner.id}
                partner={partner}
                onRemove={(id) => removeSavedPartner(id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
