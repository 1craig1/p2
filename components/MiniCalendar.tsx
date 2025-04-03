'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

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
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const eventForDate = events.find(
        (event) => format(event.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      );
      setSelectedEvent(eventForDate || null);
    }
  };

  // Get today's events
  const todayEvents = events.filter(
    (event) => format(event.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Calendar</h3>
        <div className="text-sm text-muted-foreground">
          {format(new Date(), 'MMMM d, yyyy')}
        </div>
      </div>
      
      <div className="flex gap-6">
        <div className="w-[280px]">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
            modifiers={{
              hasEvent: (date) =>
                events.some(
                  (event) => format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                ),
            }}
            modifiersStyles={{
              hasEvent: {
                backgroundColor: 'rgb(59, 130, 246)',
                color: 'white',
                borderRadius: '50%',
              },
            }}
          />
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Today's Events</h4>
            {todayEvents.length > 0 ? (
              todayEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-md border hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(event.date, 'h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No events scheduled for today</p>
            )}
          </div>
        </div>
      </div>

      {selectedEvent && (
        <Popover open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">{selectedEvent.title}</h4>
              <p className="text-sm text-muted-foreground">
                {format(selectedEvent.date, 'PPP')}
              </p>
              {selectedEvent.description && (
                <p className="text-sm">{selectedEvent.description}</p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
} 