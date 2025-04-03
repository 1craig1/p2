"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, addMonths, subMonths, isSameDay, addDays, parseISO } from "date-fns"
import { ChevronLeft, ChevronRight, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCalendar, type CalendarEvent } from "@/contexts/calendar-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function MiniCalendar() {
  const { events, selectedDate, setSelectedDate } = useCalendar()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(parseISO(event.date), day))
  }

  const handleDayClick = (day: Date) => {
    const dayEvents = getEventsForDay(day)
    if (dayEvents.length > 0) {
      setSelectedDayEvents(dayEvents)
      setIsDialogOpen(true)
    }
    setSelectedDate(day)
  }

  const renderCalendarDays = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const dateFormat = "d"
    const rows = []
    let days = []
    let day = startDate
    let formattedDate = ""

    // Add day names row
    const dayNames = ["S", "M", "T", "W", "T", "F", "S"]
    const daysRow = dayNames.map((dayName) => (
      <div key={dayName} className="text-center text-xs font-medium text-muted-foreground">
        {dayName}
      </div>
    ))
    rows.push(
      <div key="day-names" className="grid grid-cols-7 gap-1">
        {daysRow}
      </div>,
    )

    // Add date cells
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat)
        const cloneDay = day
        const dayEvents = getEventsForDay(day)
        const hasEvents = dayEvents.length > 0

        days.push(
          <div
            key={day.toString()}
            className={`text-center text-xs p-1 cursor-pointer ${
              !isSameMonth(day, monthStart)
                ? "text-muted-foreground/30"
                : isSameDay(day, new Date())
                  ? "bg-blue-100 rounded-full text-blue-800"
                  : hasEvents
                    ? "bg-blue-50 rounded-full text-blue-800 hover:bg-blue-100"
                    : "hover:bg-muted/50"
            }`}
            onClick={() => handleDayClick(cloneDay)}
          >
            {formattedDate}
            {hasEvents && (
              <div className="w-1 h-1 mx-auto mt-1 rounded-full bg-blue-500" />
            )}
          </div>,
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>,
      )
      days = []
    }

    return rows
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{format(currentDate, "MMMM yyyy")}</CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handlePrevMonth}>
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleNextMonth}>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">{renderCalendarDays()}</div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Events for {selectedDate && format(selectedDate, "MMMM d, yyyy")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedDayEvents.map((event) => (
              <div key={event.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    {event.time && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Time: {event.time}
                      </p>
                    )}
                    {event.description && (
                      <p className="text-sm mt-2">{event.description}</p>
                    )}
                  </div>
                  {event.reminder && (
                    <div className="text-yellow-500">
                      <Bell className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 