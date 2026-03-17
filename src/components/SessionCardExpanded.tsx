"use client"

import { useState } from "react"
import Link from "next/link"
import { Session, STUDY_STYLES } from "@/lib/mock-data"
import type { SavedPartner } from "@/lib/mock-data"
import { RecommendationReasonChips } from "./RecommendationReasonChips"
import { BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface SessionCardExpandedProps {
  session: Session
  hideActions?: boolean
  onSavePartner?: (partner: SavedPartner) => void
  isSaved?: boolean
  className?: string
}

const studyStyleLabel = (id: string) =>
  STUDY_STYLES.find((s) => s.id === id)?.label ?? id

export function SessionCardExpanded({ session, hideActions, onSavePartner, isSaved, className }: SessionCardExpandedProps) {
  const { student, location, course, goal, studyStyle, duration, recommendationReasons } =
    session

  return (
    <div
      className={cn(
        "rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden",
        className
      )}
    >
      <div className="p-4">
        <div className="flex gap-3 mb-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-base font-semibold text-slate-600 ring-2 ring-white shadow-inner">
            {student.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900">{student.name}</span>
              {student.verified && (
                <BadgeCheck className="h-4 w-4 text-sky-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-slate-600">
              {student.verified ? "Verified " : ""}undergraduate · {student.subject} {student.programType} · Year {student.year}
            </p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium text-slate-700">Location:</span>{" "}
            <span className="text-slate-600">{location}</span>
          </p>
          <p>
            <span className="font-medium text-slate-700">Course:</span>{" "}
            <span className="text-slate-600">{course}</span>
          </p>
          <p>
            <span className="font-medium text-slate-700">Style:</span>{" "}
            <span className="text-slate-600">{studyStyleLabel(studyStyle)}</span>
          </p>
          <p>
            <span className="font-medium text-slate-700">Duration:</span>{" "}
            <span className="text-slate-600">{duration}</span>
          </p>
          <p>
            <span className="font-medium text-slate-700">Goal:</span>{" "}
            <span className="text-slate-600">{goal}</span>
          </p>
        </div>
        {recommendationReasons.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-slate-500 mb-1.5">
              Why this is a good fit
            </p>
            <RecommendationReasonChips reasons={recommendationReasons} />
          </div>
        )}
      </div>
      {!hideActions && (
      <div className="flex gap-2 p-3 bg-slate-50 border-t border-slate-100">
        <Link
          href={`/matching?from=${session.id}`}
          className="flex-1 py-2.5 rounded-lg bg-sky-600 text-white font-medium text-center hover:bg-sky-700 transition-colors"
        >
          Match
        </Link>
        <Link
          href={`/profile/${student.id}`}
          className="flex-1 py-2.5 rounded-lg border border-slate-200 bg-white font-medium text-center hover:bg-slate-50 transition-colors"
        >
          View Profile
        </Link>
        <button
          type="button"
          onClick={() =>
            onSavePartner?.({
              ...student,
              sharedCourses: [course],
              fitSummary: `Good fit for ${course}`,
            })
          }
          disabled={isSaved}
          className={`px-4 py-2.5 rounded-lg border font-medium transition-colors ${
            isSaved
              ? "border-slate-100 bg-slate-50 text-slate-400 cursor-default"
              : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
        >
          {isSaved ? "Saved" : "Save for Later"}
        </button>
      </div>
      )}
    </div>
  )
}
