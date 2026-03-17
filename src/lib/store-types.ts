import type { SavedPartner, Session, Student } from "./mock-data"

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
  habits: string
  bio: string
  defaultLocation: string
  studentId?: string
}

export interface ActiveSession {
  id: string
  location: string
  time: string
  subject: string
  rules: string
  goals: string
  status: "waiting" | "matched" | "confirmed"
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
  activeSession: ActiveSession | null
  matchedPartner: { student: Student; session: Session } | null
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
  preferredTime: "1:30 PM – 4:45 PM",
  habits: "",
  bio: "",
  defaultLocation: "Robarts Library",
}

const STORAGE_KEY = "study-buddy-store"

export function loadStore(): Partial<AppStore> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Partial<AppStore>
  } catch {
    /* ignore */
  }
  return {}
}

export function saveStore(store: Partial<AppStore>) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    /* ignore */
  }
}
