"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropdownFieldProps {
  label?: string
  helperText?: string
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  options?: string[]
  onClick?: () => void
  className?: string
}

export function DropdownField({
  label,
  helperText,
  value,
  placeholder = "Select...",
  onChange,
  options = [],
  onClick,
  className,
}: DropdownFieldProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className={cn("space-y-1.5 relative", className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">{label}</label>
      )}
      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition-shadow focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400",
          isOpen ? "ring-2 ring-sky-500/25 border-sky-400" : "",
          !value ? "text-slate-400" : "text-slate-900"
        )}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 flex-shrink-0 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && options.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          <ul className="p-1">
            {options.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => {
                    onChange?.(opt)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors",
                    value === opt ? "bg-sky-50 text-sky-700 font-medium" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
