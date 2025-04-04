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
import { Textarea } from "@/components/ui/textarea"
import { useGroups } from "@/contexts/groups-context"
import { useToast } from "@/components/ui/use-toast"
import { Plus } from "lucide-react"

export function CreateGroupDialog() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [members, setMembers] = useState("")
  const { createGroup } = useGroups()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a group name",
        variant: "destructive",
      })
      return
    }

    const memberList = members
      .split(",")
      .map((member) => member.trim())
      .filter((member) => member.length > 0)

    createGroup(name, description, memberList)
    setOpen(false)
    setName("")
    setDescription("")
    setMembers("")
    toast({
      title: "Success",
      description: "Group created successfully",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Create a new group and add members. Members can be added later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter group name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter group description"
              />
            </div>
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
            <Button type="submit">Create Group</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 