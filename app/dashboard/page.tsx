"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MiniCalendar } from "@/components/mini-calendar"
import { Inbox } from "@/components/inbox"
import { Users } from "lucide-react"
import { useGroups } from "@/contexts/groups-context"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const { groups } = useGroups()
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}! Here's an overview of your workspace.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <Link key={group.id} href={`/dashboard/groups/${group.id}`}>
            <Card className="transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">{group.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {group.tasks.length} Assignments, {group.meetings.length} Meetings
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Inbox />
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Tasks due soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Finalize project proposal", due: "Today", priority: "High" },
                  { title: "Review marketing materials", due: "Tomorrow", priority: "Medium" },
                  { title: "Team meeting preparation", due: "Apr 3", priority: "Medium" },
                  { title: "Client presentation", due: "Apr 5", priority: "High" },
                ].map((task, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        task.priority === "High"
                          ? "bg-red-500"
                          : task.priority === "Medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">Due: {task.due}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <MiniCalendar />
        </div>
      </div>
    </div>
  )
}

