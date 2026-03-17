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
  ActiveSession,
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
  activeSession: null,
  matchedPartner: null,
  savedPartners: initialSavedPartners,
  chatMessages: {},
}

const AppStoreContext = createContext<{
  store: AppStore
  setDefaultLocation: (loc: string) => void
  addRecentLocation: (loc: string) => void
  setShareLiveLocation: (v: boolean) => void
  login: (profile: Partial<UserProfile> & { profileComplete?: boolean }) => void
  logout: () => void
  updateProfile: (profile: Partial<UserProfile>) => void
  createActiveSession: (session: Omit<ActiveSession, "id" | "status">) => void
  clearActiveSession: () => void
  setMatchedPartner: (partner: { student: import("@/lib/mock-data").Student; session: import("@/lib/mock-data").Session } | null) => void
  addSavedPartner: (partner: SavedPartner) => void
  removeSavedPartner: (id: string) => void
  isPartnerSaved: (id: string) => boolean
  getChatMessages: (partnerId: string) => ChatMessage[]
  addChatMessage: (partnerId: string, message: ChatMessage) => void
} | null>(null)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<AppStore>(defaultStore)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const loaded = loadStore()
    const loadedUser = loaded.user as (Partial<UserProfile> & { program?: string }) | undefined
    const mergedUser = { ...DEFAULT_USER, ...loadedUser }
    if (loadedUser?.program && !loadedUser.subject) {
      const [subject, programType] = (loadedUser.program as string).split(" ")
      mergedUser.subject = subject || "CS"
      mergedUser.programType = programType || "Major"
    }
    setStore((prev) => ({
      ...prev,
      ...loaded,
      user: mergedUser,
      profileComplete: loaded.profileComplete ?? !!loadedUser?.courses,
      savedPartners: loaded.savedPartners ?? prev.savedPartners,
    }))
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
      recentLocations: [
        loc,
        ...s.recentLocations.filter((x) => x !== loc),
      ].slice(0, 10),
    }))
  }, [])

  const addRecentLocation = useCallback((loc: string) => {
    setStore((s) => ({
      ...s,
      recentLocations: [
        loc,
        ...s.recentLocations.filter((x) => x !== loc),
      ].slice(0, 10),
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
        user: {
          ...s.user,
          ...profile,
          name: profile.name || name,
          avatar: profile.avatar || avatar,
        },
      }
      if (profile.defaultLocation !== undefined) {
        next.defaultLocation = profile.defaultLocation
      }
      return next
    })
  }, [])

  const logout = useCallback(() => {
    setStore((s) => ({ ...s, isLoggedIn: false }))
  }, [])

  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    setStore((s) => {
      const next = { ...s, user: { ...s.user, ...profile }, profileComplete: true }
      if (profile.defaultLocation !== undefined) {
        next.defaultLocation = profile.defaultLocation
      }
      return next
    })
  }, [])

  const createActiveSession = useCallback(
    (session: Omit<ActiveSession, "id" | "status">) => {
      setStore((s) => ({
        ...s,
        activeSession: {
          ...session,
          id: `session-${Date.now()}`,
          status: "waiting",
        },
      }))
    },
    []
  )

  const clearActiveSession = useCallback(() => {
    setStore((s) => ({ ...s, activeSession: null }))
  }, [])

  const setMatchedPartner = useCallback(
    (partner: { student: import("@/lib/mock-data").Student; session: import("@/lib/mock-data").Session } | null) => {
      setStore((s) => ({ ...s, matchedPartner: partner }))
    },
    []
  )

  const addSavedPartner = useCallback((partner: SavedPartner) => {
    setStore((s) => {
      if (s.savedPartners.some((p) => p.id === partner.id)) return s
      return {
        ...s,
        savedPartners: [...s.savedPartners, partner],
      }
    })
  }, [])

  const removeSavedPartner = useCallback((id: string) => {
    setStore((s) => ({
      ...s,
      savedPartners: s.savedPartners.filter((p) => p.id !== id),
    }))
  }, [])

  const isPartnerSaved = useCallback(
    (id: string) => store.savedPartners.some((p) => p.id === id),
    [store.savedPartners]
  )

  const getChatMessages = useCallback(
    (partnerId: string): ChatMessage[] =>
      store.chatMessages[partnerId] ?? [
        { text: "Hi — want to study together for CSC343?", fromMe: false },
        { text: "Sure! I'm preparing for the midterm.", fromMe: true },
      ],
    [store.chatMessages]
  )

  const addChatMessage = useCallback((partnerId: string, message: ChatMessage) => {
    setStore((s) => ({
      ...s,
      chatMessages: {
        ...s.chatMessages,
        [partnerId]: [...(s.chatMessages[partnerId] ?? []), message],
      },
    }))
  }, [])

  const value = {
    store,
    setDefaultLocation,
    addRecentLocation,
    setShareLiveLocation,
    login,
    logout,
    updateProfile,
    createActiveSession,
    clearActiveSession,
    setMatchedPartner,
    addSavedPartner,
    removeSavedPartner,
    isPartnerSaved,
    getChatMessages,
    addChatMessage,
  }

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  )
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider")
  return ctx
}
