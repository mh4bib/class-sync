import { Event } from "@/types/event";
import { Schedule } from "@/types/schedule";
import { api } from "./api";

class EventService {
  private mockEvents: Event[] = require("@/data/events.json").events;

  // Current mock implementation
  async getEvents(): Promise<Event[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const eventsData = require("@/data/events.json");
    return eventsData.events;
  }

  // Get student specific events based on their session's courses
  async getStudentEvents(studentSession: string): Promise<Event[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Get schedules for student's session
    const schedulesData = require("@/data/schedules.json");
    const studentSchedules = schedulesData.schedules.filter(
      (schedule: Schedule) => schedule.session === studentSession
    );

    // Get course codes for student's session
    const courseCodes = studentSchedules.map(
      (schedule: Schedule) => schedule.course.courseCode
    );

    // Filter events for student's courses
    const eventsData = require("@/data/events.json");
    return eventsData.events.filter((event: Event) => 
      courseCodes.includes(event.course)
    );
  }

  // Future API implementation
  async getEventsApi(): Promise<Event[]> {
    try {
      const response = await api.get<Event[]>("/events");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getStudentEventsApi(studentSession: string): Promise<Event[]> {
    try {
      const response = await api.get<Event[]>(`/events/student/${studentSession}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createEvent(newEvent: Partial<Event>): Promise<Event> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const event: Event = {
      id: Math.random().toString(36).substr(2, 9),
      ...newEvent,
    } as Event;

    this.mockEvents.push(event);
    return event;
  }

  async updateEvent(event: Partial<Event>): Promise<Event> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = this.mockEvents.findIndex((e) => e.id === event.id);
    if (index !== -1) {
      this.mockEvents[index] = { ...this.mockEvents[index], ...event };
      return this.mockEvents[index];
    }
    throw new Error("Event not found");
  }

  async deleteEvent(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = this.mockEvents.findIndex((e) => e.id === id);
    if (index !== -1) {
      this.mockEvents.splice(index, 1);
    }
  }

  private handleError(error: any) {
    return error;
  }
}

export const eventService = new EventService();
