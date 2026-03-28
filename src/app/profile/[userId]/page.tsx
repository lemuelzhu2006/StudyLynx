"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { TopBar } from "@/components/TopBar"
import { ProfileInfoCard } from "@/components/ProfileInfoCard"
import { getStudentById } from "@/lib/mock-data"

export default function OtherProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string
  const student = getStudentById(userId)

  if (!student) {
    return (
      <div className="flex flex-col min-h-[780px]">
        <TopBar title="Profile" showBack backHref="/home" />
        <main className="flex-1 flex items-center justify-center p-6">
          <p className="text-slate-600">User not found</p>
          <Link href="/home" className="mt-4 text-sky-600 font-medium">
            Back to home
          </Link>
        </main>
      </div>
    )
  }

  const programDisplay = `${student.subject} ${student.programType}`

  return (
    <div className="flex flex-col min-h-[780px]">
      <TopBar title="Profile" showBack backHref="/home" />

      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <ProfileInfoCard
          name={student.name}
          avatar={student.avatar}
          verified={student.verified}
          academicSummary={`${student.verified ? "Verified " : ""}undergraduate · ${programDisplay} · Year ${student.year}`}
          className="mt-4"
        />

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase">Courses</p>
            <p className="text-slate-800 mt-1">{student.courses.join(", ")}</p>
          </div>
          {student.preferredTime && (
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Preferred time</p>
              <p className="text-slate-800 mt-1">{student.preferredTime}</p>
            </div>
          )}
          {student.defaultLocation && (
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Default location</p>
              <p className="text-slate-800 mt-1">{student.defaultLocation}</p>
            </div>
          )}
          {student.habits && (
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Study habits</p>
              <p className="text-slate-800 mt-1">{student.habits}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          <Link
            href={`/chat?partner=${student.id}`}
            className="flex-1 py-3 rounded-xl bg-sky-600 text-white font-semibold text-center hover:bg-sky-700"
          >
            Message
          </Link>
          <Link
            href="/home"
            className="flex-1 py-3 rounded-xl border border-slate-200 font-medium text-center hover:bg-slate-50"
          >
            Back
          </Link>
        </div>
      </main>
    </div>
  )
}
