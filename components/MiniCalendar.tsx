'use client';

import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Event {
  id: string;
  title: string;
  date: Date;
  description?: string;
}

interface MiniCalendarProps {
  events?: Event[];
}

export function MiniCalendar({ events = [] }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    const eventForDate = events.find(
      (event) => format(event.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
    setSelectedEvent(eventForDate || null);
  };

  const hasEvent = (date: Date) => {
    return events.some(
      (event) => format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b">
        <button 
          onClick={prevMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-medium">
          {format(currentMonth, 'MMMM yyyy')}
        </div>
        <button 
          onClick={nextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 p-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
        
        {days.map((day, dayIdx) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isCurrentDay = isToday(day);
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const hasEventOnDay = hasEvent(day);
          
          return (
            <div
              key={day.toString()}
              className={cn(
                "text-center p-1 text-sm relative cursor-pointer",
                !isCurrentMonth && "text-gray-300",
                isCurrentDay && "font-bold",
                isSelected && "bg-blue-100 rounded-full",
                hasEventOnDay && "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-blue-500 after:rounded-full"
              )}
              onClick={() => handleDateClick(day)}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
      
      {selectedEvent && (
        <div className="p-3 border-t bg-gray-50">
          <div className="text-sm font-medium">{selectedEvent.title}</div>
          <div className="text-xs text-gray-500">
            {format(selectedEvent.date, 'EEEE, MMMM d, yyyy')}
          </div>
          {selectedEvent.description && (
            <div className="text-xs mt-1">{selectedEvent.description}</div>
          )}
        </div>
      )}
    </div>
  );
} 