"use client"

import { Suspense, useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Camera } from "lucide-react"
import { TopBar } from "@/components/TopBar"
import { ProfileInfoCard } from "@/components/ProfileInfoCard"
import { InputField } from "@/components/InputField"
import { DropdownField } from "@/components/DropdownField"
import { BottomSheet } from "@/components/BottomSheet"
import { WeeklyAvailabilityEditor } from "@/components/WeeklyAvailabilityEditor"
import { SUBJECTS, PROGRAM_TYPES, ACADEMIC_LEVELS, YEARS } from "@/lib/mock-data"
import { useAppStore } from "@/context/AppStoreContext"
import { compressImageToBase64 } from "@/lib/image-utils"
import { DEFAULT_WEEKLY, summarizeAvailability } from "@/lib/store-types"
import type { WeeklyAvailability } from "@/lib/store-types"

function ProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isNewUser = searchParams.get("new") === "1"
  const { store, updateProfile, logout } = useAppStore()
  const [subject, setSubject] = useState(store.user.subject || "CS")
  const [programType, setProgramType] = useState(store.user.programType || "Major")
  const [level, setLevel] = useState(store.user.level)
  const [year, setYear] = useState(store.user.year)
  const [courses, setCourses] = useState(store.user.courses)
  const [weeklyAvailability, setWeeklyAvailability] = useState<WeeklyAvailability>(
    store.user.weeklyAvailability ?? DEFAULT_WEEKLY
  )
  const [habits, setHabits] = useState(store.user.habits)
  const [bio, setBio] = useState(store.user.bio)
  const [defaultLocation, setDefaultLocation] = useState(store.user.defaultLocation)
  const [showSubjectSheet, setShowSubjectSheet] = useState(false)
  const [showProgramTypeSheet, setShowProgramTypeSheet] = useState(false)
  const [showYearSheet, setShowYearSheet] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const base64 = await compressImageToBase64(file)
      updateProfile({ avatar: base64 })
    } catch {
      /* ignore failed uploads */
    }
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  useEffect(() => {
    setSubject(store.user.subject || "CS")
    setProgramType(store.user.programType || "Major")
    setLevel(store.user.level)
    setYear(store.user.year)
    setCourses(store.user.courses)
    setWeeklyAvailability(store.user.weeklyAvailability ?? DEFAULT_WEEKLY)
    setHabits(store.user.habits)
    setBio(store.user.bio)
    setDefaultLocation(store.user.defaultLocation)
  }, [store.user])

  const requiredFieldsFilled = !!(subject && programType && courses.trim() && year)

  const handleSave = () => {
    if (isNewUser) {
      const errors: string[] = []
      if (!subject) errors.push("Subject")
      if (!programType) errors.push("Program type")
      if (!courses.trim()) errors.push("Courses")
      if (!year) errors.push("Year")
      if (errors.length > 0) {
        setValidationErrors(errors)
        return
      }
    }
    setValidationErrors([])
    updateProfile({
      subject,
      programType,
      level,
      year,
      courses,
      preferredTime: summarizeAvailability(weeklyAvailability),
      weeklyAvailability,
      habits,
      bio,
      defaultLocation,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    if (isNewUser) router.push("/home")
  }

  const verified = !!store.user.studentId
  const academicSummary = verified
    ? `Verified undergraduate · ${subject} ${programType} · Year ${year}`
    : `${subject} ${programType} · Year ${year}`

  return (
    <div className="flex flex-col min-h-[780px]">
      <TopBar
        title={isNewUser ? "Complete your profile" : "My Profile"}
        showBack={!isNewUser}
        backHref="/home"
      />

      <main className="flex-1 overflow-y-auto px-4 pb-32">
        {isNewUser && (
          <div className="mt-4 p-4 rounded-xl bg-sky-50 border border-sky-100">
            <p className="text-sm font-semibold text-sky-800">Welcome to StudyLynx!</p>
            <p className="text-xs text-sky-700 mt-1">
              Please fill in the required fields below to start finding study partners.
            </p>
            <div className="flex gap-1.5 mt-3">
              {[subject, programType, courses.trim(), year].map((v, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${v ? "bg-sky-500" : "bg-sky-200"}`}
                />
              ))}
            </div>
            <p className="text-xs text-sky-600 mt-1.5">
              {[subject, programType, courses.trim(), year].filter(Boolean).length} / 4 required fields completed
            </p>
          </div>
        )}

        <ProfileInfoCard
          name={store.user.name || "New User"}
          avatar={store.user.avatar || "?"}
          verified={verified}
          academicSummary={academicSummary}
          className="mt-4"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 flex items-center gap-1.5 text-sm text-sky-600 hover:text-sky-700 font-medium"
        >
          <Camera className="h-4 w-4" />
          Upload photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
        />

        {saved && (
          <p className="mt-3 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">Saved</p>
        )}

        {validationErrors.length > 0 && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            Please fill in: {validationErrors.join(", ")}
          </p>
        )}

        <div className="space-y-5 mt-6">
          <DropdownField
            label={isNewUser ? "Subject *" : "Subject"}
            helperText="Your field of study (CS, Math, etc.)"
            value={subject}
            placeholder="Select subject"
            onClick={() => setShowSubjectSheet(true)}
          />

          <DropdownField
            label={isNewUser ? "Program type *" : "Program type"}
            helperText="Specialist, Major, or Minor"
            value={programType}
            placeholder="Select type"
            onClick={() => setShowProgramTypeSheet(true)}
          />

          <div className="flex gap-4">
            <div className="flex-1">
              <DropdownField
                label="Level"
                value={level}
                placeholder="Select"
                onClick={() => setShowYearSheet(true)}
              />
            </div>
            <div className="flex-1">
              <DropdownField
                label={isNewUser ? "Year *" : "Year"}
                value={String(year)}
                placeholder="Select"
                onClick={() => setShowYearSheet(true)}
              />
            </div>
          </div>

          <InputField
            label={isNewUser ? "Courses *" : "Courses"}
            helperText="Courses you're currently taking"
            value={courses}
            onChange={setCourses}
            placeholder="CSC343, CSC165"
          />

          <WeeklyAvailabilityEditor
            value={weeklyAvailability}
            onChange={setWeeklyAvailability}
          />

          <InputField
            label="Study habits / preferences"
            value={habits}
            onChange={setHabits}
            placeholder="e.g. Quiet study, 1.5 hr sessions"
          />

          <InputField
            label="Bio / goals"
            value={bio}
            onChange={setBio}
            placeholder="Optional"
          />

          <InputField
            label="Default location"
            helperText="Your usual study spot for recommendations"
            value={defaultLocation}
            onChange={setDefaultLocation}
          />

          <div>
            <button
              type="button"
              onClick={() => setShowCredentials(!showCredentials)}
              className="text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              {showCredentials ? "Hide credentials" : "View credentials"}
            </button>
            {showCredentials && (
              <div className="mt-2 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm">
                <p className="text-slate-600">
                  Student ID: {store.user.studentId || "— (not set)"}
                </p>
                <p className="text-slate-600 mt-1">
                  Email: {store.user.email || "—"}
                </p>
                <p className="text-slate-500 text-xs mt-2">
                  Verified status is displayed on your profile card.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={handleSave}
            disabled={isNewUser && !requiredFieldsFilled}
            className="flex-1 py-3 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saved ? "Saved" : isNewUser ? "Save and continue" : "Save Changes"}
          </button>
          {!isNewUser && (
            <Link
              href="/home"
              className="flex-1 py-3 rounded-lg border border-slate-200 font-medium text-center hover:bg-slate-50"
            >
              Cancel
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            logout()
            router.push("/login")
          }}
          className="mt-4 w-full py-2 text-sm text-slate-500 hover:text-slate-700"
        >
          Sign out
        </button>
      </main>

      <BottomSheet
        isOpen={showSubjectSheet}
        onClose={() => setShowSubjectSheet(false)}
        title="Subject"
      >
        <ul className="p-4 space-y-1">
          {SUBJECTS.map((p) => (
            <li key={p}>
              <button
                type="button"
                onClick={() => {
                  setSubject(p)
                  setShowSubjectSheet(false)
                }}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50"
              >
                {p}
              </button>
            </li>
          ))}
        </ul>
      </BottomSheet>

      <BottomSheet
        isOpen={showProgramTypeSheet}
        onClose={() => setShowProgramTypeSheet(false)}
        title="Program type"
      >
        <ul className="p-4 space-y-1">
          {PROGRAM_TYPES.map((p) => (
            <li key={p}>
              <button
                type="button"
                onClick={() => {
                  setProgramType(p)
                  setShowProgramTypeSheet(false)
                }}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-50"
              >
                {p}
              </button>
            </li>
          ))}
        </ul>
      </BottomSheet>

      <BottomSheet
        isOpen={showYearSheet}
        onClose={() => setShowYearSheet(false)}
        title="Academic level and year"
      >
        <div className="p-4">
          <p className="text-sm font-medium text-slate-700 mb-2">Level</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {ACADEMIC_LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={`px-3 py-2 rounded-lg ${level === l ? "bg-sky-100 text-sky-800" : "bg-slate-100"}`}
              >
                {l}
              </button>
            ))}
          </div>
          <p className="text-sm font-medium text-slate-700 mb-2">Year</p>
          <div className="flex flex-wrap gap-2">
            {YEARS.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => {
                  setYear(y)
                  setShowYearSheet(false)
                }}
                className={`px-3 py-2 rounded-lg ${year === y ? "bg-sky-100 text-sky-800" : "bg-slate-100"}`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><p className="text-slate-500">Loading...</p></div>}>
      <ProfileContent />
    </Suspense>
  )
}
