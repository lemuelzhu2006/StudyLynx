"use client"

import { TopBar } from "@/components/TopBar"
import { ProfileInfoCard } from "@/components/ProfileInfoCard"
import { recommendedSessions } from "@/lib/mock-data"
import { notFound } from "next/navigation"

export default function ViewProfilePage({ params }: { params: { id: string } }) {
  // Find the student from our mock recommended sessions
  const session = recommendedSessions.find((s) => s.student.id === params.id)
  
  if (!session) {
    notFound()
  }

  const { student } = session
  const academicSummary = `${student.verified ? 'Verified undergraduate' : 'Student'} · ${student.program} · Year ${student.year}`

  return (
    <div className="flex flex-col min-h-[780px]">
      <TopBar title={`${student.name}'s Profile`} showBack backHref="/home" rightIcons="none" />

      <main className="flex-1 overflow-y-auto px-4 pb-8">
        <ProfileInfoCard
          name={student.name}
          avatar={student.avatar}
          verified={student.verified}
          academicSummary={academicSummary}
          className="mt-4"
        />

        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">
              Academic Info
            </h3>
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Program</p>
                <p className="text-sm font-medium text-slate-900">{student.program}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Courses</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {student.courses.map((course) => (
                    <span 
                      key={course} 
                      className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">
              Study Preferences
            </h3>
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Preferred Time</p>
                <p className="text-sm font-medium text-slate-900">{student.preferredTime || "Flexible"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Usual Location</p>
                <p className="text-sm font-medium text-slate-900">{student.defaultLocation || "Various campus libraries"}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
