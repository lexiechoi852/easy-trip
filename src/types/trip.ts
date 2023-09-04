import { Attraction } from "./attraction";

export interface Trip {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  scheduleItems: CalendarEvent[];
}

export interface ScheduleItem {
  id: number;
  title: string;
  duration: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  attraction: Attraction;
  type: string;
  startTime: string;
  endTime: string;
}

export interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  overlap: boolean;
}
