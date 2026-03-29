import type { SavedPartner, Session, Student } from "./mock-data"

export interface DayAvailability {
  enabled: boolean
  start: string
  end: string
}

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"

export type WeeklyAvailability = Record<DayKey, DayAvailability>

export const DAY_LABELS: Record<DayKey, string> = {
  mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
}

export const DAY_KEYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

export const DEFAULT_WEEKLY: WeeklyAvailability = {
  mon: { enabled: false, start: "09:00", end: "12:00" },
  tue: { enabled: true, start: "14:00", end: "17:00" },
  wed: { enabled: true, start: "10:00", end: "13:00" },
  thu: { enabled: false, start: "09:00", end: "12:00" },
  fri: { enabled: true, start: "14:00", end: "17:00" },
  sat: { enabled: false, start: "10:00", end: "14:00" },
  sun: { enabled: false, start: "10:00", end: "14:00" },
}

export interface UserProfile {
  name: string
  avatar: string
  email: string
  subject: string
  programType: string
  level: string
  year: number
  courses: string
  preferredTime: string
  weeklyAvailability?: WeeklyAvailability
  habits: string
  bio: string
  defaultLocation: string
  studentId?: string
}

export interface UserSession {
  id: string
  date: string
  startTime: string
  endTime: string
  location: string
  subject: string
  studyStyle: string
  goals: string
  status: "upcoming" | "matched" | "confirmed" | "completed" | "cancelled"
  matchedWith?: {
    studentId: string
    sessionId: string
  } | null
}

export interface ChatMessage {
  text: string
  fromMe: boolean
}

export interface AppStore {
  isLoggedIn: boolean
  user: UserProfile
  profileComplete: boolean
  defaultLocation: string
  recentLocations: string[]
  shareLiveLocation: boolean
  sessions: UserSession[]
  matchedPartner: { student: Student; session: Session } | null
  matchedPartners?: { student: Student; session: Session }[]
  savedPartners: SavedPartner[]
  chatMessages: Record<string, ChatMessage[]>
}

export const DEFAULT_USER: UserProfile = {
  name: "",
  avatar: "?",
  email: "",
  subject: "",
  programType: "",
  level: "Undergraduate",
  year: 1,
  courses: "",
  preferredTime: "Tue, Wed, Fri afternoons",
  weeklyAvailability: DEFAULT_WEEKLY,
  habits: "",
  bio: "",
  defaultLocation: "Robarts Library",
}

const STORAGE_KEY = "study-buddy-store"
const STORE_VERSION = 2

export function loadStore(): Partial<AppStore> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed._version !== STORE_VERSION || parsed.activeSession !== undefined) {
      localStorage.removeItem(STORAGE_KEY)
      return {}
    }
    return parsed as Partial<AppStore>
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }
  return {}
}

export function saveStore(store: Partial<AppStore>) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...store, _version: STORE_VERSION }))
  } catch {
    /* ignore */
  }
}

export function summarizeAvailability(wa: WeeklyAvailability): string {
  const enabled = DAY_KEYS.filter((k) => wa[k].enabled)
  if (enabled.length === 0) return "Not set"
  const labels = enabled.map((k) => DAY_LABELS[k])
  const times = enabled.map((k) => {
    const h = parseInt(wa[k].start.split(":")[0], 10)
    if (h < 12) return "morning"
    if (h < 17) return "afternoon"
    return "evening"
  })
  const uniqueTimes = Array.from(new Set(times))
  return `${labels.join(", ")} ${uniqueTimes.join("/")}`
}
