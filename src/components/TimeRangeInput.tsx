"use client"

import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

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
  value,
  onChange,
  placeholder = "e.g. 1:30 PM – 4:45 PM",
  className,
}: TimeRangeInputProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">{label}</label>
      )}
      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Clock className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
        />
      </div>
    </div>
  )
}
