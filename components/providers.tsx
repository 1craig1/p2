"use client"

import { type ReactNode } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { CalendarProvider } from "@/contexts/calendar-context"
import { EmailProvider } from "@/contexts/email-context"
import { GroupsProvider } from "@/contexts/groups-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <GroupsProvider>
        <CalendarProvider>
          <EmailProvider>
            {children}
          </EmailProvider>
        </CalendarProvider>
      </GroupsProvider>
    </AuthProvider>
  )
} 