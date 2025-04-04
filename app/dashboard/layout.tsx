"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Calendar, FileText, Home, LogOut, Menu, MessageSquare, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { MessagesProvider } from "@/contexts/message-context"
import { TasksProvider } from "@/contexts/task-context"
import { CalendarProvider } from "@/contexts/calendar-context"
import { DocumentProvider } from "@/contexts/document-context"
import { VideoCallProvider } from "@/contexts/video-call-context"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sidebar } from "@/components/sidebar"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
}

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        active
          ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-50"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </Link>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      router.push("/")
    }
  }, [user, router])

  // If no user, show loading or nothing
  if (!user) {
    return null
  }

  const navItems = [
    { href: "/dashboard", icon: <Home className="h-5 w-5" />, label: "Dashboard" },
    { href: "/dashboard/messages", icon: <MessageSquare className="h-5 w-5" />, label: "Messages" },
    { href: "/dashboard/tasks", icon: <FileText className="h-5 w-5" />, label: "Tasks" },
    { href: "/dashboard/calendar", icon: <Calendar className="h-5 w-5" />, label: "Calendar" },
    { href: "/dashboard/documents", icon: <FileText className="h-5 w-5" />, label: "Documents" },
  ]

  const handleSignOut = () => {
    signOut()
  }

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <MessagesProvider>
        <TasksProvider>
          <CalendarProvider>
            <DocumentProvider>
              <VideoCallProvider>
                <div className="flex h-screen">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto">
                    {children}
                  </main>
                </div>
              </VideoCallProvider>
            </DocumentProvider>
          </CalendarProvider>
        </TasksProvider>
      </MessagesProvider>
    </ThemeProvider>
  )
}

