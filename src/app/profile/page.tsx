"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { TopBar } from "@/components/TopBar"
import { ProfileInfoCard } from "@/components/ProfileInfoCard"
import { InputField } from "@/components/InputField"
import { DropdownField } from "@/components/DropdownField"
import { PROGRAMS, ACADEMIC_LEVELS, YEARS } from "@/lib/mock-data"
import { useAppStore } from "@/context/AppStoreContext"

export default function ProfilePage() {
  const router = useRouter()
  const { store, updateProfile, logout } = useAppStore()
  const [program, setProgram] = useState(store.user.program)
  const [level, setLevel] = useState(store.user.level)
  const [year, setYear] = useState(store.user.year)
  const [courses, setCourses] = useState(store.user.courses)
  const [preferredTime, setPreferredTime] = useState(store.user.preferredTime)
  const [habits, setHabits] = useState(store.user.habits)
  const [bio, setBio] = useState(store.user.bio)
  const [defaultLocation, setDefaultLocation] = useState(store.user.defaultLocation)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setProgram(store.user.program)
    setLevel(store.user.level)
    setYear(store.user.year)
    setCourses(store.user.courses)
    setPreferredTime(store.user.preferredTime)
    setHabits(store.user.habits)
    setBio(store.user.bio)
    setDefaultLocation(store.user.defaultLocation)
  }, [store.user])

  const handleSave = () => {
    updateProfile({
      program,
      level,
      year,
      courses,
      preferredTime,
      habits,
      bio,
      defaultLocation,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const academicSummary = `Verified undergraduate · ${program} · Year ${year}`

  return (
    <div className="flex flex-col min-h-[780px]">
      <TopBar title="My Profile" showBack backHref="/home" rightIcons="none" />

      <main className="flex-1 overflow-y-auto px-4 pb-32">
        <ProfileInfoCard
          name={store.user.name}
          avatar={store.user.avatar}
          verified
          academicSummary={academicSummary}
          className="mt-4"
        />

        {saved && (
          <p className="mt-3 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            Saved
          </p>
        )}

        <div className="space-y-5 mt-6">
          <DropdownField
            label="Program"
            value={program}
            onChange={setProgram}
            options={[...PROGRAMS]}
            placeholder="Select program"
          />

          <div className="flex gap-4">
            <div className="flex-1">
              <DropdownField
                label="Level"
                value={level}
                onChange={setLevel}
                options={[...ACADEMIC_LEVELS]}
                placeholder="Select"
              />
            </div>
            <div className="flex-1">
              <DropdownField
                label="Year"
                value={String(year)}
                onChange={(val) => setYear(Number(val))}
                options={YEARS.map(String)}
                placeholder="Select"
              />
            </div>
          </div>

          <InputField
            label="Courses"
            helperText="Courses you're currently taking"
            value={courses}
            onChange={setCourses}
            placeholder="CSC343, CSC165"
          />

          <InputField
            label="Preferred time"
            helperText="When you usually prefer to study"
            value={preferredTime}
            onChange={setPreferredTime}
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
        </div>

        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700"
          >
            {saved ? "Saved" : "Save Changes"}
          </button>
          <Link
            href="/home"
            className="flex-1 py-3 rounded-lg border border-slate-200 font-medium text-center hover:bg-slate-50"
          >
            Cancel
          </Link>
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
    </div>
  )
}
