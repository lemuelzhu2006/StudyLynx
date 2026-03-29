"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface MultiSelectDropdownProps {
  label?: string
  helperText?: string
  value: string[]
  onChange: (value: string[]) => void
  options: string[]
  placeholder?: string
  className?: string
}

export function MultiSelectDropdown({
  label,
  helperText,
  value,
  onChange,
  options,
  placeholder = "Select...",
  className,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredOptions = options.filter(
    (opt) => opt.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleOption = (opt: string) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt))
    } else {
      onChange([...value, opt])
    }
  }

  const removeOption = (opt: string) => {
    onChange(value.filter((v) => v !== opt))
  }

  return (
    <div className={cn("space-y-1.5 relative", className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">{label}</label>
      )}
      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition-shadow focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400",
          isOpen ? "ring-2 ring-sky-500/25 border-sky-400" : "",
          value.length === 0 ? "text-slate-400" : "text-slate-900"
        )}
      >
        <span className="truncate">
          {value.length > 0 ? value.join(", ") : placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-slate-400 flex-shrink-0 transition-transform", isOpen && "rotate-180")} />
      </button>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {value.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 text-xs font-medium border border-sky-100"
            >
              {v}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeOption(v)
                }}
                className="hover:bg-sky-100 rounded p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-hidden flex flex-col">
          <div className="px-3 py-2 border-b border-slate-100">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full text-sm bg-transparent outline-none placeholder:text-slate-400"
              autoFocus
            />
          </div>
          <ul className="p-1 overflow-y-auto flex-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => toggleOption(opt)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2",
                      value.includes(opt) ? "bg-sky-50 text-sky-700 font-medium" : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <span className={cn(
                      "w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-[10px]",
                      value.includes(opt) ? "bg-sky-600 border-sky-600 text-white" : "border-slate-300"
                    )}>
                      {value.includes(opt) && "✓"}
                    </span>
                    {opt}
                  </button>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-sm text-slate-500">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
