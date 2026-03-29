"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/components/TopBar"
import { InputField } from "@/components/InputField"
import { Search } from "lucide-react"
import { LOCATIONS } from "@/lib/mock-data"
import { useAppStore } from "@/context/AppStoreContext"

export default function LocationsPage() {
  const router = useRouter()
  const { store, setDefaultLocation, setShareLiveLocation } = useAppStore()
  const [search, setSearch] = useState("")

  const filteredQuick = LOCATIONS.filter(
    (loc) =>
      !search || loc.toLowerCase().includes(search.toLowerCase())
  )
  const filteredRecent = store.recentLocations.filter(
    (loc) =>
      !search || loc.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelectLocation = (loc: string) => {
    setDefaultLocation(loc)
    router.back()
  }

  return (
    <div className="flex flex-col min-h-[780px]">
      <TopBar title="Location" showBack backHref="/home" />

      <main className="flex-1 overflow-y-auto px-4 pb-8">
        <InputField
          placeholder="Search for a location..."
          value={search}
          onChange={setSearch}
          icon={Search}
          className="mt-4"
        />

        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            Quick choices
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tap to set as default location for recommendations and new sessions
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {filteredQuick.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => handleSelectLocation(loc)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  store.defaultLocation === loc
                    ? "bg-sky-100 text-sky-800 border border-sky-200"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            Recent Locations
          </h3>
          <ul className="mt-2 space-y-1">
            {filteredRecent.map((loc) => (
              <li key={loc}>
                <button
                  type="button"
                  onClick={() => handleSelectLocation(loc)}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors text-slate-800 flex justify-between items-center"
                >
                  {loc}
                  {store.defaultLocation === loc && (
                    <span className="text-xs text-sky-600 font-medium">Default</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={store.shareLiveLocation}
              onChange={(e) => setShareLiveLocation(e.target.checked)}
              className="rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">
              Share live location during active session only
            </span>
          </label>
          <p className="text-xs text-slate-500 mt-2">
            Your default location helps us recommend nearby sessions. Live location is optional and only shared when you have an active study session.
          </p>
        </div>
      </main>
    </div>
  )
}
