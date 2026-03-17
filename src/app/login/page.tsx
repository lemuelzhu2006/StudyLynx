"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { InputField } from "@/components/InputField"
import { Mail } from "lucide-react"
import { useAppStore } from "@/context/AppStoreContext"
import { authenticate, loadUsers } from "@/lib/auth"
import { getStudentByName } from "@/lib/mock-data"

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, store } = useAppStore()

  useEffect(() => {
    if (store.isLoggedIn && store.profileComplete) router.replace("/home")
    if (store.isLoggedIn && !store.profileComplete) router.replace("/profile?new=1")
  }, [store.isLoggedIn, store.profileComplete, router])

  const handleContinue = async () => {
    setError("")
    if (!email.trim()) {
      setError("Please enter your email")
      return
    }
    if (!password.trim()) {
      setError("Please enter your password")
      return
    }
    if (isSignUp && password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    setLoading(true)
    try {
      if (isSignUp) {
        const users = await loadUsers()
        const emails = users.map((u) => u.email)
        const isNew = !emails.some((e) => e.toLowerCase() === email.trim().toLowerCase())
        if (!isNew) {
          setError("Email already registered. Sign in instead.")
          setLoading(false)
          return
        }
        const name = displayName.trim() || email.split("@")[0] || "New User"
        login({
          name,
          email: email.trim(),
          avatar: (name || "?").slice(0, 2).toUpperCase(),
          profileComplete: false,
        })
        router.push("/profile?new=1")
        return
      }
      const authUser = await authenticate(email.trim(), password)
      if (authUser) {
        const mockStudent = getStudentByName(authUser.name)
        login({
          name: authUser.name,
          email: authUser.email,
          avatar: mockStudent?.avatar ?? authUser.name.slice(0, 2).toUpperCase(),
          profileComplete: true,
          ...(mockStudent && {
            courses: mockStudent.courses.join(", "),
            habits: mockStudent.habits ?? "",
            defaultLocation: mockStudent.defaultLocation ?? "Robarts Library",
            subject: mockStudent.subject,
            programType: mockStudent.programType,
            year: mockStudent.year,
            studentId: mockStudent.studentId,
          }),
        })
        router.push("/home")
      } else {
        setError("Invalid email or password")
      }
    } catch {
      setError("Something went wrong. Try again.")
    }
    setLoading(false)
  }

  const handleDemoLogin = () => {
    const mockStudent = getStudentByName("Diego Zhu")
    login({
      name: "Demo User",
      email: "demo@utoronto.ca",
      avatar: "DU",
      profileComplete: true,
      ...(mockStudent && {
        courses: mockStudent.courses.join(", "),
        habits: mockStudent.habits ?? "",
        defaultLocation: mockStudent.defaultLocation ?? "Robarts Library",
        subject: mockStudent.subject,
        programType: mockStudent.programType,
        year: mockStudent.year,
      }),
    })
    router.push("/home")
  }

  return (
    <div className="flex flex-col h-full px-6 py-8">
      <div className="flex-1 overflow-y-auto">
        <h1 className="text-2xl font-bold text-slate-900 mt-4">Study Buddy</h1>
        <p className="text-slate-600 mt-2 text-sm max-w-xs">
          Find compatible study partners by course, goals, and study style.
        </p>

        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <div className="mt-10 space-y-4">
          {isSignUp && (
            <InputField
              label="Display Name"
              placeholder="How others will see you"
              value={displayName}
              onChange={setDisplayName}
              id="displayName"
            />
          )}
          <InputField
            label="University Email"
            helperText="Use your @mail.utoronto.ca or university email"
            placeholder="name@mail.utoronto.ca"
            type="email"
            value={email}
            onChange={setEmail}
            icon={Mail}
            id="email"
          />
          <InputField
            label="Password"
            helperText={!isSignUp ? "Enter your password" : "At least 8 characters"}
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={setPassword}
            id="password"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp)
            setError("")
          }}
          className="mt-4 text-sm text-sky-600 hover:text-sky-700 font-medium"
        >
          {isSignUp ? "Already have an account? Sign in" : "Create account instead"}
        </button>
      </div>

      <div className="space-y-3 mt-8 pt-6 border-t border-slate-200 flex-shrink-0">
        <button
          type="button"
          onClick={handleContinue}
          disabled={loading}
          className="block w-full py-3 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition-colors disabled:opacity-70"
        >
          {loading ? "..." : "Continue"}
        </button>
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-3 rounded-lg border border-slate-200 font-medium flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google (Demo)
        </button>
        <button
          type="button"
          className="w-full py-3 rounded-lg border border-slate-200 font-medium hover:bg-slate-50 transition-colors"
        >
          University SSO
        </button>
      </div>
    </div>
  )
}
