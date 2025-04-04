"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useGroups } from "@/contexts/groups-context"
import { useToast } from "@/components/ui/use-toast"
import { UserPlus } from "lucide-react"

interface AddMembersDialogProps {
  groupId: string
  groupName: string
}

export function AddMembersDialog({ groupId, groupName }: AddMembersDialogProps) {
  const [open, setOpen] = useState(false)
  const [members, setMembers] = useState("")
  const { addMembersToGroup } = useGroups()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!members.trim()) {
      toast({
        title: "Error",
        description: "Please enter at least one member name",
        variant: "destructive",
      })
      return
    }

    const memberList = members
      .split(",")
      .map((member) => member.trim())
      .filter((member) => member.length > 0)

    addMembersToGroup(groupId, memberList)
    setOpen(false)
    setMembers("")
    toast({
      title: "Success",
      description: "Members added successfully",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Members
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Members to {groupName}</DialogTitle>
            <DialogDescription>
              Add new members to the group. Enter names separated by commas.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="members">Members (comma-separated)</Label>
              <Input
                id="members"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
                placeholder="John Doe, Jane Smith"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Members</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 