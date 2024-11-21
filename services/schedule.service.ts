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

  async getCourses(): Promise<Course[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    const coursesData = require("@/data/courses.json");
    return coursesData.courses;
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

  // Mock update implementation
  async updateSchedule(schedule: Schedule): Promise<Schedule> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // In a real app, this would update the backend
    // For now, just return the updated schedule
    return schedule;
  }

  async createSchedule(newSchedule: Partial<Schedule>): Promise<Schedule> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const schedule: Schedule = {
      id: Math.random().toString(36).substr(2, 9),
      ...newSchedule,
      course: (require("@/data/courses.json").courses)
        .find((c: Course) => c.id.toString() === newSchedule.courseId)
    } as Schedule;
    
    return schedule;
  }

  // Future API implementation
  async updateScheduleApi(schedule: Schedule): Promise<Schedule> {
    try {
      const response = await api.put<Schedule>(`/schedules/${schedule.id}`, schedule);
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
