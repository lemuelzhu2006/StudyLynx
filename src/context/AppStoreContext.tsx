"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import type { SavedPartner } from "@/lib/mock-data"
import type {
  AppStore,
  UserProfile,
  UserSession,
  ChatMessage,
} from "@/lib/store-types"
import {
  loadStore,
  saveStore,
  DEFAULT_USER,
} from "@/lib/store-types"
import { savedPartners as initialSavedPartners } from "@/lib/mock-data"

const defaultStore: AppStore = {
  isLoggedIn: false,
  user: DEFAULT_USER,
  profileComplete: false,
  defaultLocation: "Robarts Library",
  recentLocations: ["Robarts Library", "Bahen Centre for Information Technology", "Kelly Library"],
  shareLiveLocation: false,
  sessions: [],
  matchedPartner: null,
  matchedPartners: [],
  savedPartners: [],
  chatMessages: {},
}

type MatchedPartnerPayload = { student: import("@/lib/mock-data").Student; session: import("@/lib/mock-data").Session } | null
type MatchedPartnersPayload = { student: import("@/lib/mock-data").Student; session: import("@/lib/mock-data").Session }[]

const AppStoreContext = createContext<{
  store: AppStore
  setDefaultLocation: (loc: string) => void
  addRecentLocation: (loc: string) => void
  setShareLiveLocation: (v: boolean) => void
  login: (profile: Partial<UserProfile> & { profileComplete?: boolean }) => void
  logout: () => void
  updateProfile: (profile: Partial<UserProfile>) => void
  addSession: (session: Omit<UserSession, "id">) => string
  updateSessionStatus: (id: string, status: UserSession["status"], matchedWith?: UserSession["matchedWith"]) => void
  removeSession: (id: string) => void
  getSessionById: (id: string) => UserSession | undefined
  setMatchedPartner: (partner: MatchedPartnerPayload) => void
  setMatchedPartners: (partners: MatchedPartnersPayload) => void
  addSavedPartner: (partner: SavedPartner) => void
  removeSavedPartner: (id: string) => void
  isPartnerSaved: (id: string) => boolean
  getChatMessages: (partnerId: string) => ChatMessage[]
  addChatMessage: (partnerId: string, message: ChatMessage) => void
  resetStore: () => void
} | null>(null)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<AppStore>(defaultStore)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const loaded = loadStore()
      if (!loaded || Object.keys(loaded).length === 0) {
        setHydrated(true)
        return
      }
      const loadedUser = loaded.user as (Partial<UserProfile> & { program?: string }) | undefined
      const mergedUser = { ...DEFAULT_USER, ...loadedUser }
      if (loadedUser?.program && !loadedUser.subject) {
        const [subject, programType] = (loadedUser.program as string).split(" ")
        mergedUser.subject = subject || "CS"
        mergedUser.programType = programType || "Major"
      }
      const loadedAny = loaded as Record<string, unknown>
      delete loadedAny.activeSession
      delete loadedAny._version
      setStore((prev) => ({
        ...prev,
        ...loaded,
        user: mergedUser,
        profileComplete: loaded.profileComplete ?? !!loadedUser?.courses,
        savedPartners: loaded.savedPartners ?? initialSavedPartners,
        sessions: Array.isArray(loaded.sessions) ? loaded.sessions : [],
      }))
    } catch {
      /* corrupted store — start fresh */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveStore(store)
  }, [store, hydrated])

  const setDefaultLocation = useCallback((loc: string) => {
    setStore((s) => ({
      ...s,
      defaultLocation: loc,
      recentLocations: [loc, ...s.recentLocations.filter((x) => x !== loc)].slice(0, 10),
    }))
  }, [])

  const addRecentLocation = useCallback((loc: string) => {
    setStore((s) => ({
      ...s,
      recentLocations: [loc, ...s.recentLocations.filter((x) => x !== loc)].slice(0, 10),
    }))
  }, [])

  const setShareLiveLocation = useCallback((v: boolean) => {
    setStore((s) => ({ ...s, shareLiveLocation: v }))
  }, [])

  const login = useCallback((profile: Partial<UserProfile> & { profileComplete?: boolean }) => {
    const name = profile.name || profile.email?.split("@")[0] || "You"
    const avatar = (profile.avatar || name.slice(0, 2)).toUpperCase()
    setStore((s) => {
      const next = {
        ...s,
        isLoggedIn: true,
        profileComplete: profile.profileComplete ?? s.profileComplete,
        user: { ...s.user, ...profile, name: profile.name || name, avatar: profile.avatar || avatar },
      }
      if (profile.defaultLocation !== undefined) next.defaultLocation = profile.defaultLocation
      return next
    })
  }, [])

  const logout = useCallback(() => {
    setStore((s) => ({
      ...s,
      isLoggedIn: false,
      user: DEFAULT_USER,
      profileComplete: false,
      sessions: [],
      matchedPartner: null,
      chatMessages: {},
    }))
  }, [])

  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    setStore((s) => {
      const next = { ...s, user: { ...s.user, ...profile }, profileComplete: true }
      if (profile.defaultLocation !== undefined) next.defaultLocation = profile.defaultLocation
      return next
    })
  }, [])

  const addSession = useCallback((session: Omit<UserSession, "id">): string => {
    const id = `us-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    setStore((s) => ({ ...s, sessions: [...s.sessions, { ...session, id }] }))
    return id
  }, [])

  const updateSessionStatus = useCallback(
    (id: string, status: UserSession["status"], matchedWith?: UserSession["matchedWith"]) => {
      setStore((s) => ({
        ...s,
        sessions: s.sessions.map((ses) =>
          ses.id === id ? { ...ses, status, ...(matchedWith !== undefined ? { matchedWith } : {}) } : ses
        ),
      }))
    },
    []
  )

  const removeSession = useCallback((id: string) => {
    setStore((s) => ({ ...s, sessions: s.sessions.filter((ses) => ses.id !== id) }))
  }, [])

  const getSessionById = useCallback(
    (id: string): UserSession | undefined => store.sessions.find((s) => s.id === id),
    [store.sessions]
  )

  const setMatchedPartner = useCallback((partner: MatchedPartnerPayload) => {
    setStore((s) => ({ ...s, matchedPartner: partner }))
  }, [])

  const setMatchedPartners = useCallback((partners: MatchedPartnersPayload) => {
    setStore((s) => ({ ...s, matchedPartners: partners }))
  }, [])

  const addSavedPartner = useCallback((partner: SavedPartner) => {
    setStore((s) => {
      if (s.savedPartners.some((p) => p.id === partner.id)) return s
      return { ...s, savedPartners: [...s.savedPartners, partner] }
    })
  }, [])

  const removeSavedPartner = useCallback((id: string) => {
    setStore((s) => ({ ...s, savedPartners: s.savedPartners.filter((p) => p.id !== id) }))
  }, [])

  const isPartnerSaved = useCallback(
    (id: string) => store.savedPartners.some((p) => p.id === id),
    [store.savedPartners]
  )

  const getChatMessages = useCallback(
    (partnerId: string): ChatMessage[] => store.chatMessages[partnerId] ?? [],
    [store.chatMessages]
  )

  const addChatMessage = useCallback((partnerId: string, message: ChatMessage) => {
    setStore((s) => ({
      ...s,
      chatMessages: { ...s.chatMessages, [partnerId]: [...(s.chatMessages[partnerId] ?? []), message] },
    }))
  }, [])

  const resetStore = useCallback(() => {
    setStore(defaultStore)
    saveStore(defaultStore)
  }, [])

  const value = {
    store,
    setDefaultLocation,
    addRecentLocation,
    setShareLiveLocation,
    login,
    logout,
    updateProfile,
    addSession,
    updateSessionStatus,
    removeSession,
    getSessionById,
    setMatchedPartner,
    setMatchedPartners,
    addSavedPartner,
    removeSavedPartner,
    isPartnerSaved,
    getChatMessages,
    addChatMessage,
    resetStore,
  }

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider")
  return ctx
}
