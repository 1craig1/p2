"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageSquare, FileText, Calendar, Users, FolderKanban } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Tasks", href: "/dashboard/tasks", icon: FileText },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Groups", href: "/dashboard/groups", icon: Users },
  { name: "Documents", href: "/dashboard/documents", icon: FolderKanban },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 border-r bg-gray-50/40">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-semibold tracking-tight">WorkSpace</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
} 