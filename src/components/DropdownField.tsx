"use client"

import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropdownFieldProps {
  label?: string
  helperText?: string
  value?: string
  placeholder?: string
  onClick?: () => void
  className?: string
}

export function DropdownField({
  label,
  helperText,
  value,
  placeholder = "Select...",
  onClick,
  className,
}: DropdownFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">{label}</label>
      )}
      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "w-full flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-slate-900 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500",
          !value && "text-slate-400"
        )}
      >
        <span className={value ? "" : ""}>{value || placeholder}</span>
        <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
      </button>
    </div>
  )
}
