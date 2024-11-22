import { Event } from "@/types/event";
import { api } from "./api";

class EventService {
  private mockEvents: Event[] = require("@/data/events.json").events;

  async getEvents(): Promise<Event[]> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return this.mockEvents;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async createEvent(newEvent: Partial<Event>): Promise<Event> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const event: Event = {
      id: Math.random().toString(36).substr(2, 9),
      ...newEvent
    } as Event;

    this.mockEvents.push(event);
    return event;
  }

  async updateEvent(event: Partial<Event>): Promise<Event> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const index = this.mockEvents.findIndex(e => e.id === event.id);
    if (index !== -1) {
      this.mockEvents[index] = { ...this.mockEvents[index], ...event };
      return this.mockEvents[index];
    }
    throw new Error("Event not found");
  }

  async deleteEvent(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const index = this.mockEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      this.mockEvents.splice(index, 1);
    }
  }

  private handleError(error: any) {
    console.error("Event service error:", error);
    throw error;
  }
}

export const eventService = new EventService();
