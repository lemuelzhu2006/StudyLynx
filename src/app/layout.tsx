import type { Metadata } from "next"
import "./globals.css"
import { MobileFrame } from "@/components/MobileFrame"
import { AppStoreProvider } from "@/context/AppStoreContext"
import { GoogleOAuthWrapper } from "@/components/GoogleOAuthWrapper"
import { RouteGuard } from "@/components/RouteGuard"

export const metadata: Metadata = {
  title: "StudyLynx — Find compatible study partners",
  description:
    "Find compatible study partners by course, goals, and study style.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthWrapper>
          <AppStoreProvider>
            <MobileFrame>
              <RouteGuard>{children}</RouteGuard>
            </MobileFrame>
          </AppStoreProvider>
        </GoogleOAuthWrapper>
      </body>
    </html>
  )
}
