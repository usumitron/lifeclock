// hooks/useEvents.ts
import { useState } from "react";

export interface EventConfig {
  id: string;
  label: string;
  targetDate: string;
}

export function useEvents() {
  const [events, setEvents] = useState<EventConfig[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  const handleSaveEvent = (label: string, targetDate: string) => {
    const newEvent = { id: Date.now().toString(), label, targetDate };
    setEvents((prev) => [...prev, newEvent]);
    setIsAddingEvent(false);
  };

  return { events, setEvents, isAddingEvent, setIsAddingEvent, handleSaveEvent };
}