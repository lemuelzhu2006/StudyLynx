"use client"

import { Session, formatSessionDate } from "@/lib/mock-data"
import { RecommendationReasonChips } from "./RecommendationReasonChips"
import { Avatar } from "./Avatar"
import { BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface SessionCardCollapsedProps {
  session: Session
  expanded?: boolean
  onClick?: () => void
  className?: string
}

export function SessionCardCollapsed({
  session,
  expanded,
  onClick,
  className,
}: SessionCardCollapsedProps) {
  const { student, location, course, goal, recommendationReasons } = session

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 active:scale-[0.995] transition-all duration-200",
        expanded && "ring-2 ring-sky-300/60 border-sky-300 shadow-md",
        className
      )}
    >
      <div className="flex gap-3">
        <Avatar src={student.avatar} size="lg" className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 ring-2 ring-white shadow-inner" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-slate-900 truncate">{student.name}</span>
            {student.verified && (
              <BadgeCheck className="h-4 w-4 text-sky-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-slate-600 truncate">
            {session.date && <>{formatSessionDate(session.date)} · </>}{location} · {course}
          </p>
          <p className="text-xs text-slate-500 mt-1 truncate">{goal}</p>
          {recommendationReasons.length > 0 && (
            <RecommendationReasonChips
              reasons={recommendationReasons}
              className="mt-2"
            />
          )}
        </div>
        {!expanded && (
          <span className="flex-shrink-0 text-slate-400 text-sm">▼</span>
        )}
      </div>
    </button>
  )
}
