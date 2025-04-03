"use client"

import { format } from "date-fns"
import { Mail, Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEmail } from "@/contexts/email-context"

export function Inbox() {
  const { emails, unreadCount, markAsRead, deleteEmail } = useEmail()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Inbox</CardTitle>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{unreadCount} unread</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {emails.map((email) => (
            <div
              key={email.id}
              className={`p-3 border rounded-lg transition-colors ${
                !email.read ? "bg-blue-50 border-blue-200" : "hover:bg-muted/50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-medium truncate ${!email.read ? "text-blue-800" : ""}`}>
                      {email.from}
                    </p>
                    {email.important && (
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                  <p className={`text-sm truncate ${!email.read ? "font-medium" : "text-muted-foreground"}`}>
                    {email.subject}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {email.preview}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(email.date), "MMM d, h:mm a")}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => markAsRead(email.id)}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => deleteEmail(email.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 