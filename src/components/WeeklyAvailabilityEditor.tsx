"use client"

import { useCallback } from "react"
import type { WeeklyAvailability, DayKey } from "@/lib/store-types"
import { DAY_KEYS, DAY_LABELS, DEFAULT_WEEKLY } from "@/lib/store-types"

interface Props {
  value: WeeklyAvailability
  onChange: (v: WeeklyAvailability) => void
}

export function WeeklyAvailabilityEditor({ value, onChange }: Props) {
  const toggle = useCallback(
    (day: DayKey) => {
      onChange({ ...value, [day]: { ...value[day], enabled: !value[day].enabled } })
    },
    [value, onChange]
  )

  const setTime = useCallback(
    (day: DayKey, field: "start" | "end", t: string) => {
      onChange({ ...value, [day]: { ...value[day], [field]: t } })
    },
    [value, onChange]
  )

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Weekly Availability</label>
      <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
        {DAY_KEYS.map((day) => {
          const d = value?.[day] ?? DEFAULT_WEEKLY[day]
          return (
            <div key={day} className="flex items-center gap-3 px-3 py-2.5">
              <button
                type="button"
                onClick={() => toggle(day)}
                className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center text-xs transition-colors ${
                  d.enabled
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-gray-300 text-transparent"
                }`}
                aria-label={`Toggle ${DAY_LABELS[day]}`}
              >
                ✓
              </button>

              <span className={`w-8 text-sm font-medium ${d.enabled ? "text-gray-900" : "text-gray-400"}`}>
                {DAY_LABELS[day]}
              </span>

              <input
                type="time"
                value={d.start}
                onChange={(e) => setTime(day, "start", e.target.value)}
                disabled={!d.enabled}
                className="flex-1 min-w-0 text-sm px-2 py-1 rounded-lg border border-gray-200 bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-xs text-gray-400">to</span>
              <input
                type="time"
                value={d.end}
                onChange={(e) => setTime(day, "end", e.target.value)}
                disabled={!d.enabled}
                className="flex-1 min-w-0 text-sm px-2 py-1 rounded-lg border border-gray-200 bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
