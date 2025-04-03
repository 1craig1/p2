"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Email {
  id: string
  from: string
  subject: string
  preview: string
  date: string
  read: boolean
  important: boolean
}

interface EmailContextType {
  emails: Email[]
  unreadCount: number
  markAsRead: (id: string) => void
  deleteEmail: (id: string) => void
}

const EmailContext = createContext<EmailContextType | undefined>(undefined)

// Mock data for demonstration
const defaultEmails: Email[] = [
  {
    id: "1",
    from: "university@student.sydney.edu.au",
    subject: "Important: Semester 2 Enrollment Information",
    preview: "Dear students, please review the following information about your upcoming semester enrollment...",
    date: "2024-03-28T10:30:00",
    read: false,
    important: true,
  },
  {
    id: "2",
    from: "info2222@edstem.org",
    subject: "Assignment 2 Submission Reminder",
    preview: "This is a reminder that Assignment 2 is due next week. Please ensure you submit on time...",
    date: "2024-03-27T14:15:00",
    read: false,
    important: true,
  },
  {
    id: "3",
    from: "library@sydney.edu.au",
    subject: "Your requested book is available",
    preview: "The book you requested is now available for pickup at Fisher Library...",
    date: "2024-03-26T09:00:00",
    read: true,
    important: false,
  },
  {
    id: "4",
    from: "careers@sydney.edu.au",
    subject: "Upcoming Career Fair",
    preview: "Join us for the annual Career Fair next month. Register now to secure your spot...",
    date: "2024-03-25T16:45:00",
    read: true,
    important: false,
  },
]

export function EmailProvider({ children }: { children: ReactNode }) {
  const [emails, setEmails] = useState<Email[]>(defaultEmails)

  const unreadCount = emails.filter((email) => !email.read).length

  const markAsRead = (id: string) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) => (email.id === id ? { ...email, read: true } : email)),
    )
  }

  const deleteEmail = (id: string) => {
    setEmails((prevEmails) => prevEmails.filter((email) => email.id !== id))
  }

  return (
    <EmailContext.Provider
      value={{
        emails,
        unreadCount,
        markAsRead,
        deleteEmail,
      }}
    >
      {children}
    </EmailContext.Provider>
  )
}

export function useEmail() {
  const context = useContext(EmailContext)
  if (context === undefined) {
    throw new Error("useEmail must be used within an EmailProvider")
  }
  return context
} 