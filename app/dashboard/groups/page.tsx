"use client"

import Link from "next/link"
import { Users, FileText, Calendar, CheckSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useGroups } from "@/contexts/groups-context"

export default function GroupsPage() {
  const { groups } = useGroups()

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
        <p className="text-muted-foreground">Manage your study groups and project teams.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {groups.map((group) => (
          <Link key={group.id} href={`/dashboard/groups/${group.id}`}>
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {group.members.length} members
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <CheckSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{group.tasks.length}</span>
                      <span className="text-xs text-muted-foreground">Tasks</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{group.documents.length}</span>
                      <span className="text-xs text-muted-foreground">Documents</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{group.meetings.length}</span>
                      <span className="text-xs text-muted-foreground">Meetings</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
} 