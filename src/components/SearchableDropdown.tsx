"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchableDropdownProps {
  label?: string
  helperText?: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  className?: string
}

export function SearchableDropdown({
  label,
  helperText,
  value,
  onChange,
  options,
  placeholder = "Search...",
  className,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
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

  return (
    <div className={cn("space-y-1.5 relative", className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">{label}</label>
      )}
      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      
      <div 
        className={cn(
          "w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left focus-within:ring-2 focus-within:ring-sky-500/25 focus-within:border-sky-400 transition-shadow",
          isOpen ? "ring-2 ring-sky-500/25 border-sky-400" : ""
        )}
      >
        <input
          type="text"
          value={isOpen ? search : value}
          onChange={(e) => {
            setSearch(e.target.value)
            setIsOpen(true)
            if (!isOpen) {
              onChange("") // Clear actual value when starting new search
            }
          }}
          onFocus={() => {
            setIsOpen(true)
            setSearch("") // Clear search on focus to show all options
          }}
          placeholder={placeholder}
          className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none"
        />
        <ChevronDown className={cn("h-4 w-4 text-slate-400 flex-shrink-0 transition-transform", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto thin-scrollbar">
          {filteredOptions.length > 0 ? (
            <ul className="p-1">
              {filteredOptions.map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt)
                      setSearch(opt)
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
          ) : (
            <div className="p-4 text-center text-sm text-slate-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  )
}
