"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { TopBar } from "@/components/TopBar"
import { InputField } from "@/components/InputField"
import { TimeRangeInput } from "@/components/TimeRangeInput"
import { DropdownField } from "@/components/DropdownField"
import { BottomSheet } from "@/components/BottomSheet"
import { COURSES, STUDY_STYLES, GOALS } from "@/lib/mock-data"
import { useAppStore } from "@/context/AppStoreContext"

function NewSessionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { store, createActiveSession } = useAppStore()
  const subjectOpen = searchParams.get("subject") === "open"
  const rulesOpen = searchParams.get("rules") === "open"

  const [location, setLocation] = useState(store.defaultLocation)
  const [time, setTime] = useState(store.user.preferredTime)
  const [subject, setSubject] = useState("")
  const [rules, setRules] = useState("")
  const [goals, setGoals] = useState("")
  const [showSubjectSheet, setShowSubjectSheet] = useState(subjectOpen)
  const [showRulesSheet, setShowRulesSheet] = useState(rulesOpen)

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
    <div className="flex flex-col h-full">
      <TopBar title="Create a New Session" showBack backHref="/home" />

      <main className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
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

          <div onClick={() => setShowSubjectSheet(true)}>
            <DropdownField
              label="Subject"
              helperText="Course or topic for this session"
              value={subject}
              placeholder="Select course"
              onClick={() => setShowSubjectSheet(true)}
            />
          </div>

          <div onClick={() => setShowRulesSheet(true)}>
            <DropdownField
              label="Study style / rules"
              helperText="How you prefer to study (quiet, discussion, etc.)"
              value={rules}
              placeholder="Select study style"
              onClick={() => setShowRulesSheet(true)}
            />
          </div>

          <InputField
            label="Goals"
            helperText="What you want to accomplish"
            placeholder="e.g. Prepare for midterm, review proofs"
            value={goals}
            onChange={setGoals}
          />
        </div>
      </main>

      <BottomSheet
        isOpen={showSubjectSheet}
        onClose={() => setShowSubjectSheet(false)}
        title="Select course"
      >
        <ul className="p-4 space-y-1">
          {COURSES.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => {
                  setSubject(c)
                  setShowSubjectSheet(false)
                }}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-800"
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </BottomSheet>

      <BottomSheet
        isOpen={showRulesSheet}
        onClose={() => setShowRulesSheet(false)}
        title="Study style"
      >
        <ul className="p-4 space-y-1">
          {STUDY_STYLES.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  setRules(s.label)
                  setShowRulesSheet(false)
                }}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-800"
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="px-4 pb-4">
          <p className="text-xs text-slate-500 mb-2">Common goals</p>
          <div className="flex flex-wrap gap-2">
            {GOALS.slice(0, 4).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGoals(g)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm hover:bg-slate-200"
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>

      <div className="flex-shrink-0 p-4 bg-white border-t border-slate-200 flex gap-3">
        <Link
          href="/home"
          className="flex-1 py-3 rounded-lg border border-slate-200 font-medium text-center hover:bg-slate-50"
        >
          Cancel
        </Link>
        <button
          onClick={handleConfirm}
          disabled={!subject.trim()}
          className="flex-1 py-3 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
