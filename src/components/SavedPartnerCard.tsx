"use client"

import Link from "next/link"
import { MessageCircle, User } from "lucide-react"
import { SavedPartner } from "@/lib/mock-data"
import { Avatar } from "./Avatar"
import { BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface SavedPartnerCardProps {
  partner: SavedPartner
  onRemove?: (id: string) => void
  className?: string
}

export function SavedPartnerCard({ partner, onRemove, className }: SavedPartnerCardProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl bg-white border border-slate-200 shadow-sm",
        className
      )}
    >
      <div className="flex gap-3">
        <Avatar src={partner.avatar} size="md" className="bg-slate-200 text-slate-600" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-slate-900">{partner.name}</span>
            {partner.verified && (
              <BadgeCheck className="h-4 w-4 text-sky-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-slate-600">
            {partner.sharedCourses.join(", ")}
          </p>
          <p className="text-xs text-slate-500 mt-1">{partner.fitSummary}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
        <Link
          href={`/chat?partner=${partner.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-sky-50 text-sky-700 text-xs font-medium hover:bg-sky-100 transition-colors"
        >
          <MessageCircle className="h-3.5 w-3.5" /> Chat
        </Link>
        <Link
          href={`/profile/${partner.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-slate-200 text-xs font-medium hover:bg-slate-50 transition-colors"
        >
          <User className="h-3.5 w-3.5" /> View Profile
        </Link>
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(partner.id)}
            className="flex items-center justify-center px-3 py-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-500 hover:bg-slate-50 transition-colors"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}
