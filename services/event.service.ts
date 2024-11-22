import { Event } from "@/types/event";
import { api } from "./api";

class EventService {
  // Mock implementation using JSON
  async getEvents(): Promise<Event[]> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const eventsData = require("@/data/events.json");
      return eventsData.events;
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async createEvent(newEvent: Partial<Event>): Promise<Event> {
    // Mock implementation
    return {
      id: Math.random().toString(),
      ...newEvent,
    } as Event;
  }

  async updateEvent(event: Partial<Event>): Promise<Event> {
    // Mock implementation
    return event as Event;
  }

  async deleteEvent(id: string): Promise<void> {
    // Mock implementation
  }

  private handleError(error: any) {
    console.error("Event service error:", error);
    throw error;
  }
}

export const eventService = new EventService();
