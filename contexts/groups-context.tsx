"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Group {
  id: string
  name: string
  description: string
  members: string[]
  tasks: Task[]
  documents: Document[]
  meetings: Meeting[]
}

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  status: "todo" | "in-progress" | "completed"
  assignedTo: string[]
}

export interface Document {
  id: string
  title: string
  type: "pdf" | "doc" | "xls" | "ppt"
  lastModified: string
  modifiedBy: string
}

export interface Meeting {
  id: string
  title: string
  date: string
  time: string
  location: string
  attendees: string[]
}

interface GroupsContextType {
  groups: Group[]
  getGroupById: (id: string) => Group | undefined
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined)

// Mock data for demonstration
const defaultGroups: Group[] = [
  {
    id: "1",
    name: "INFO2222 Group 7",
    description: "Web Information Technologies Project Group",
    members: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"],
    tasks: [
      {
        id: "task1",
        title: "Complete Project Proposal",
        description: "Draft and submit the initial project proposal",
        dueDate: "2024-04-10",
        status: "in-progress",
        assignedTo: ["John Doe", "Jane Smith"],
      },
      {
        id: "task2",
        title: "Design Database Schema",
        description: "Create the database schema for the project",
        dueDate: "2024-04-15",
        status: "todo",
        assignedTo: ["Mike Johnson"],
      },
    ],
    documents: [
      {
        id: "doc1",
        title: "Project Requirements",
        type: "pdf",
        lastModified: "2024-03-28T10:30:00",
        modifiedBy: "John Doe",
      },
      {
        id: "doc2",
        title: "Meeting Minutes",
        type: "doc",
        lastModified: "2024-03-27T14:15:00",
        modifiedBy: "Sarah Wilson",
      },
    ],
    meetings: [
      {
        id: "meet1",
        title: "Weekly Progress Meeting",
        date: "2024-04-03",
        time: "14:00",
        location: "Zoom",
        attendees: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson"],
      },
    ],
  },
  {
    id: "2",
    name: "COMP2123 Study Group",
    description: "Data Structures and Algorithms Study Group",
    members: ["John Doe", "Alex Brown", "Emily Davis"],
    tasks: [
      {
        id: "task3",
        title: "Review Binary Trees",
        description: "Study and practice binary tree algorithms",
        dueDate: "2024-04-05",
        status: "todo",
        assignedTo: ["John Doe"],
      },
    ],
    documents: [
      {
        id: "doc3",
        title: "Binary Trees Notes",
        type: "pdf",
        lastModified: "2024-03-26T09:00:00",
        modifiedBy: "Alex Brown",
      },
    ],
    meetings: [
      {
        id: "meet2",
        title: "Study Session",
        date: "2024-04-02",
        time: "16:00",
        location: "Fisher Library",
        attendees: ["John Doe", "Alex Brown", "Emily Davis"],
      },
    ],
  },
]

export function GroupsProvider({ children }: { children: ReactNode }) {
  const [groups] = useState<Group[]>(defaultGroups)

  const getGroupById = (id: string) => {
    return groups.find((group) => group.id === id)
  }

  return (
    <GroupsContext.Provider
      value={{
        groups,
        getGroupById,
      }}
    >
      {children}
    </GroupsContext.Provider>
  )
}

export function useGroups() {
  const context = useContext(GroupsContext)
  if (context === undefined) {
    throw new Error("useGroups must be used within a GroupsProvider")
  }
  return context
} 