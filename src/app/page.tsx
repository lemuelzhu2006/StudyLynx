"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

/**
 * Root URL: client-side navigation to login (static-export friendly).
 * Renders visible fallback so the mobile shell is never empty before JS runs
 * (fixes blank screen on localhost) without relying on server redirect() in `out/`.
 */
export default function RootPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/login")
  }, [router])

  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <p className="text-sm text-slate-600">Taking you to sign in…</p>
      <Link
        href="/login"
        className="text-sm font-semibold text-sky-600 hover:text-sky-700 underline underline-offset-2"
      >
        Continue to sign in
      </Link>
    </div>
  )
}
