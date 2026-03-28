"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { TopBar } from "@/components/TopBar"
import { InputField } from "@/components/InputField"
import { TimeRangeInput } from "@/components/TimeRangeInput"
import { DropdownField } from "@/components/DropdownField"
import { SearchableDropdown } from "@/components/SearchableDropdown"
import { COURSES, STUDY_STYLES } from "@/lib/mock-data"
import { useAppStore } from "@/context/AppStoreContext"

function NewSessionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { store, createActiveSession } = useAppStore()

  const [location, setLocation] = useState(store.defaultLocation)
  const [time, setTime] = useState(store.user.preferredTime)
  const [subject, setSubject] = useState("")
  const [rules, setRules] = useState("")
  const [goals, setGoals] = useState("")

  useEffect(() => {
    setLocation(store.defaultLocation)
    setTime(store.user.preferredTime)
  }, [store.defaultLocation, store.user.preferredTime])

  const handleConfirm = () => {
    if (!subject.trim()) {
      return
    }
    createActiveSession({
      location,
      time,
      subject,
      rules,
      goals,
    })
    router.push("/matching")
  }

  return (
    <div className="flex flex-col min-h-[780px]">
      <TopBar title="Create a New Session" showBack backHref="/home" rightIcons="none" />

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
            <Link
              href="/locations"
              className="text-sm text-sky-600 hover:text-sky-700 mt-1 inline-block"
            >
              Choose from map or history
            </Link>
          </div>

          <TimeRangeInput
            label="Time"
            helperText="When you want to study"
            value={time}
            onChange={setTime}
            placeholder="e.g. 1:30 PM – 4:45 PM"
          />

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
            label="Study style / rules"
            helperText="How you prefer to study (quiet, discussion, etc.)"
            value={rules}
            onChange={setRules}
            options={STUDY_STYLES.map(s => s.label)}
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
        <Link
          href="/home"
          className="flex-1 py-3 rounded-xl border border-slate-200 font-medium text-center hover:bg-slate-50"
        >
          Cancel
        </Link>
        <button
          onClick={handleConfirm}
          disabled={!subject.trim()}
          className="flex-1 py-3 rounded-xl bg-sky-600 text-white font-semibold hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm
        </button>
      </div>
    </div>
  )
}

export default function NewSessionPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><p className="text-slate-500">Loading...</p></div>}>
      <NewSessionContent />
    </Suspense>
  )
}
