"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { TopBar } from "@/components/TopBar"
import { SessionSummaryBar } from "@/components/SessionSummaryBar"
import { ChatComposer } from "@/components/ChatComposer"
import { chatPrompts, getStudentById, STUDY_STYLES } from "@/lib/mock-data"
import { useAppStore } from "@/context/AppStoreContext"

const TABS = [
  { id: "opening", label: "Opening" },
  { id: "alignment", label: "Alignment" },
  { id: "time-setting", label: "Time-setting" },
  { id: "follow-up", label: "Follow-up" },
  { id: "refusal", label: "Refusal" },
] as const

const DEFAULT_CHAT_PARTNER = "1"

function ChatContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab") as string | null
  const partnerId = searchParams.get("partner") ?? DEFAULT_CHAT_PARTNER
  const activeTab = tabParam && TABS.some((t) => t.id === tabParam) ? tabParam : "opening"
  const [activeTabId, setActiveTabId] = useState(activeTab)

  const { store, getChatMessages, addChatMessage } = useAppStore()
  const [messages, setMessages] = useState<{ text: string; fromMe: boolean }[]>([])

  const partner = getStudentById(partnerId)
  const match = store.matchedPartner
  const isMatchWithPartner = match?.student.id === partnerId

  const location = isMatchWithPartner ? match.session.location : partner?.defaultLocation ?? "Robarts Library"
  const course = store.activeSession?.subject ?? match?.session.course ?? (partner?.courses[0] ?? "CSC343")
  const studyStyleId = isMatchWithPartner ? match.session.studyStyle : "quiet-study"
  const studyStyleLabel = STUDY_STYLES.find((s) => s.id === studyStyleId)?.label ?? "Quiet study"
  const goal = isMatchWithPartner ? match.session.goal : "Prepare for midterm"

  useEffect(() => {
    setMessages(getChatMessages(partnerId))
  }, [partnerId, getChatMessages])

  useEffect(() => {
    setActiveTabId(activeTab)
  }, [activeTab])

  const rawPrompts =
    chatPrompts[activeTabId as keyof typeof chatPrompts] ?? chatPrompts.opening
  const prompts = rawPrompts.map((p) => p.replace("[COURSE]", course))

  const handleSend = (message: string) => {
    const newMsg = { text: message, fromMe: true }
    addChatMessage(partnerId, newMsg)
    setMessages((prev) => [...prev, newMsg])
  }

  return (
    <div className="flex flex-col h-[780px]">
      <TopBar title="Study chat" showBack backHref="/home" rightIcons="minimal" />

      {partner && (
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border-b border-slate-200">
          <Link
            href={`/profile/${partner.id}`}
            className="flex items-center gap-3 flex-1 min-w-0 hover:bg-slate-100 rounded-lg p-1 -m-1 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center text-sm font-semibold text-sky-700 flex-shrink-0">
              {partner.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-800 truncate">{partner.name}</p>
              <p className="text-xs text-slate-500 truncate">
                Chatting about {course}
              </p>
            </div>
          </Link>
        </div>
      )}

      <SessionSummaryBar
        location={location}
        course={course}
        studyStyle={studyStyleLabel}
        goal={goal}
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                m.fromMe
                  ? "bg-sky-600 text-white rounded-br-md"
                  : "bg-slate-100 text-slate-800 rounded-bl-md"
              }`}
            >
              <p className="text-sm">{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 bg-white">
        <div className="flex gap-1 px-2 pt-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTabId(tab.id)
                router.push(`/chat?tab=${tab.id}&partner=${partnerId}`)
              }}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTabId === tab.id
                  ? "bg-sky-100 text-sky-800"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <ChatComposer
          onSend={handleSend}
          promptChips={prompts}
          placeholder="Type a message (prompts are editable)..."
        />
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><p className="text-slate-500">Loading...</p></div>}>
      <ChatContent />
    </Suspense>
  )
}
