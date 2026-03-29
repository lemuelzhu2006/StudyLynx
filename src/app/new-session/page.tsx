"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { TopBar } from "@/components/TopBar"
import { InputField } from "@/components/InputField"
import { DropdownField } from "@/components/DropdownField"
import { SearchableDropdown } from "@/components/SearchableDropdown"
import { COURSES, STUDY_STYLES } from "@/lib/mock-data"
import { useAppStore } from "@/context/AppStoreContext"
import { DAY_KEYS } from "@/lib/store-types"
import type { WeeklyAvailability, DayKey } from "@/lib/store-types"

function todayStr(): string {
  return new Date().toISOString().split("T")[0]
}

function dateToDayKey(dateStr: string): DayKey {
  const d = new Date(dateStr + "T12:00:00")
  return DAY_KEYS[d.getDay() === 0 ? 6 : d.getDay() - 1]
}

function getNextAvailableDate(wa?: WeeklyAvailability): string {
  if (!wa) return todayStr()
  const now = new Date()
  for (let i = 0; i < 14; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() + i)
    const key = DAY_KEYS[d.getDay() === 0 ? 6 : d.getDay() - 1]
    if (wa[key]?.enabled) return d.toISOString().split("T")[0]
  }
  return todayStr()
}

export default function NewSessionPage() {
  const router = useRouter()
  const { store, addSession } = useAppStore()
  const wa = store.user.weeklyAvailability

  const defaultDate = useMemo(() => getNextAvailableDate(wa), [wa])

  const [location, setLocation] = useState(store.defaultLocation)
  const [date, setDate] = useState(defaultDate)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [subject, setSubject] = useState("")
  const [studyStyle, setStudyStyle] = useState("")
  const [goals, setGoals] = useState("")

  useEffect(() => { setLocation(store.defaultLocation) }, [store.defaultLocation])

  useEffect(() => {
    if (!wa || !date) return
    const dayKey = dateToDayKey(date)
    const daySlot = wa[dayKey]
    if (daySlot?.enabled) {
      setStartTime(daySlot.start)
      setEndTime(daySlot.end)
    }
  }, [date, wa])

  const handleConfirm = () => {
    if (!subject.trim() || !date) return
    const id = addSession({
      date,
      startTime: startTime || "14:00",
      endTime: endTime || "16:00",
      location,
      subject,
      studyStyle: studyStyle || "Quiet study",
      goals,
      status: "upcoming",
      matchedWith: null,
    })
    router.push(`/matching?sessionId=${id}`)
  }

  return (
    <div className="flex flex-col min-h-[780px]">
      <TopBar title="Create a New Session" showBack backHref="/home" />

      <main className="flex-1 overflow-y-auto px-4 pb-32">
        <div className="space-y-5 mt-4">
          <div>
            <InputField
              label="Location"
              helperText="Where you plan to study for this session"
              placeholder="e.g. Robarts Library"
              value={location}
              onChange={setLocation}
            />
            <Link href="/locations" className="text-sm text-sky-600 hover:text-sky-700 mt-1 inline-block">
              Choose from map or history
            </Link>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              min={todayStr()}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
            <p className="text-xs text-slate-500 mt-1">Select the day for this study session</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>

          <SearchableDropdown
            label="Subject"
            helperText="Course or topic for this session"
            value={subject}
            onChange={setSubject}
            options={[...COURSES]}
            placeholder="Search course... e.g. CSC3"
            className="z-20"
          />

          <DropdownField
            label="Study style"
            helperText="How you prefer to study (quiet, discussion, etc.)"
            value={studyStyle}
            onChange={setStudyStyle}
            options={STUDY_STYLES.map((s) => s.label)}
            placeholder="Select study style"
          />

          <InputField
            label="Goals"
            helperText="What you want to accomplish"
            placeholder="e.g. Prepare for midterm, review proofs"
            value={goals}
            onChange={setGoals}
          />
        </div>
      </main>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 flex gap-3">
        <Link href="/home" className="flex-1 py-3 rounded-xl border border-slate-200 font-medium text-center hover:bg-slate-50">
          Cancel
        </Link>
        <button
          onClick={handleConfirm}
          disabled={!subject.trim() || !date}
          className="flex-1 py-3 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm
        </button>
      </div>
    </div>
  )
}
