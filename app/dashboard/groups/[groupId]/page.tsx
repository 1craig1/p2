"use client"

import { useParams } from "next/navigation"
import { Users, FileText, Calendar, CheckSquare, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useGroups } from "@/contexts/groups-context"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AddMembersDialog } from "@/components/add-members-dialog"

export default function GroupPage() {
  const { groupId } = useParams()
  const { getGroupById } = useGroups()
  const group = getGroupById(groupId as string)

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h1 className="text-2xl font-bold">Group not found</h1>
        <Link href="/dashboard/groups" className="text-blue-600 hover:underline">
          Back to Groups
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
          <p className="text-muted-foreground">{group.description}</p>
        </div>
        <AddMembersDialog groupId={group.id} groupName={group.name} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Group tasks and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {group.tasks.map((task) => (
                <div key={task.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            task.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : task.status === "in-progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                    <CheckSquare className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Shared files and resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {group.documents.map((doc) => (
                <div key={doc.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          Modified by {doc.modifiedBy}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(doc.lastModified), "MMM d, h:mm a")}
                        </span>
                      </div>
                    </div>
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meetings</CardTitle>
            <CardDescription>Upcoming and past meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {group.meetings.map((meeting) => (
                <div key={meeting.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{meeting.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(meeting.date), "MMM d, yyyy")} at {meeting.time}
                        </span>
                        <span className="text-xs text-muted-foreground">{meeting.location}</span>
                      </div>
                    </div>
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>Group participants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {group.members.map((member) => (
                <div key={member} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      {member
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="font-medium">{member}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 