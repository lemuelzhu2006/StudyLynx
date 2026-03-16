"use client"

import { Clock, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface TimeRangeInputProps {
  label?: string
  helperText?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function TimeRangeInput({
  label = "Time",
  helperText,
  value = "",
  onChange,
  className,
}: TimeRangeInputProps) {
  // Parse initial value like "1:30 PM - 4:45 PM" or "13:30 - 16:45" to standard "HH:mm" format for input
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  // Only run once on mount to populate initial value
  useEffect(() => {
    if (value && value.includes("–") || value.includes("-")) {
      const parts = value.split(/–|-/).map(p => p.trim());
      if (parts.length === 2) {
        // Simple extraction if it's already HH:mm, or leave it to user
        // We'll just let the user set it fresh if the string doesn't match perfectly
      }
    }
  }, []);

  const handleTimeChange = (start: string, end: string) => {
    setStartTime(start)
    setEndTime(end)
    
    // Format for display string (e.g. "13:30 - 15:45")
    if (start && end) {
      onChange?.(`${start} – ${end}`)
    } else if (start) {
      onChange?.(`${start} – ?`)
    } else {
      onChange?.("")
    }
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">{label}</label>
      )}
      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Clock className="h-4 w-4" />
          </div>
          <input
            type="time"
            value={startTime}
            onChange={(e) => handleTimeChange(e.target.value, endTime)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400"
          />
        </div>
        <div className="text-slate-400">
          <ArrowRight className="h-4 w-4" />
        </div>
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Clock className="h-4 w-4" />
          </div>
          <input
            type="time"
            value={endTime}
            onChange={(e) => handleTimeChange(startTime, e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400"
          />
        </div>
      </div>
    </div>
  )
}
