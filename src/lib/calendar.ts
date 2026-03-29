function parseTimeString(raw: string): { startH: number; startM: number; endH: number; endM: number } | null {
  const parts = raw.split(/\s*[–\-]\s*/)
  if (parts.length !== 2) return null

  const parse12or24 = (s: string): { h: number; m: number } | null => {
    const m24 = s.match(/^(\d{1,2}):(\d{2})$/)
    if (m24) return { h: parseInt(m24[1], 10), m: parseInt(m24[2], 10) }

    const m12 = s.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
    if (!m12) return null
    let h = parseInt(m12[1], 10)
    const min = parseInt(m12[2], 10)
    const ampm = m12[3].toUpperCase()
    if (ampm === "PM" && h < 12) h += 12
    if (ampm === "AM" && h === 12) h = 0
    return { h, m: min }
  }

  const start = parse12or24(parts[0].trim())
  const end = parse12or24(parts[1].trim())
  if (!start || !end) return null

  return { startH: start.h, startM: start.m, endH: end.h, endM: end.m }
}

function toGCalDateStr(date: Date, h: number, m: number): string {
  const y = date.getFullYear()
  const mo = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}${mo}${d}T${String(h).padStart(2, "0")}${String(m).padStart(2, "0")}00`
}

interface CalendarEventInput {
  title: string
  location: string
  time: string
  date?: string
  details?: string
}

export function buildGoogleCalendarUrl({ title, location, time, date, details }: CalendarEventInput): string {
  const eventDate = date ? new Date(date + "T12:00:00") : new Date()
  const parsed = parseTimeString(time)

  const params = new URLSearchParams()
  params.set("text", title)
  params.set("location", location)
  if (details) params.set("details", details)

  if (parsed) {
    const start = toGCalDateStr(eventDate, parsed.startH, parsed.startM)
    const end = toGCalDateStr(eventDate, parsed.endH, parsed.endM)
    params.set("dates", `${start}/${end}`)
  }

  return `https://calendar.google.com/calendar/r/eventedit?${params.toString()}`
}
