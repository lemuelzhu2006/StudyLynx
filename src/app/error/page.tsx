"use client"

import { TopBar } from "@/components/TopBar"
import { ErrorStateCard } from "@/components/ErrorStateCard"

export default function ErrorPage() {
  return (
    <div className="flex flex-col min-h-[780px]">
      <TopBar title="Error" showBack backHref="/home" />

      <main className="flex-1">
        <ErrorStateCard
          title="Sorry! Something went wrong!"
          message="We couldn't load this page. Please try again."
        />
      </main>
    </div>
  )
}
