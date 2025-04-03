import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { CalendarProvider } from "@/contexts/calendar-context"
import { EmailProvider } from "@/contexts/email-context"
import { GroupsProvider } from "@/contexts/groups-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "A comprehensive dashboard for university students",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CalendarProvider>
            <EmailProvider>
              <GroupsProvider>
                {children}
              </GroupsProvider>
            </EmailProvider>
          </CalendarProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'