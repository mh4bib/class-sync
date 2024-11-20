import { Course, Schedule } from "@/types/schedule";
import { api } from "./api";

class ScheduleService {
  // Current mock implementation using JSON
  async getSchedules(): Promise<Schedule[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    const schedulesData = require("@/data/schedules.json");
    return schedulesData.schedules;
  }

  // Removed getCourses() method since course data is included in schedules

  // Future implementation using real API
  async getSchedulesApi(): Promise<Schedule[]> {
    try {
      const response = await api.get<Schedule[]>("/schedules");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCoursesApi(): Promise<Course[]> {
    try {
      const response = await api.get<Course[]>("/courses");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any) {
    return error;
  }
}

export const scheduleService = new ScheduleService();
