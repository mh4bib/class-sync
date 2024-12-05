import { api } from "./api";
import attendanceData from "@/data/attendance.json";
import userData from "@/data/users.json";
import { Student } from "@/types/schedule";

interface Attendance {
  id: number;
  studentId: number;
  courseId: number;
  date: string;
  isPresent: boolean;
}

export interface GroupedAttendance {
  studentId: number;
  studentName: string;
  attendanceRecords: Attendance[];
  totalPresent: number;
  totalClasses: number;
}

class AttendanceService {
  // Current mock implementation using JSON
  async getAllAttendanceByCourse(courseId: number): Promise<Attendance[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return attendanceData.attendance.filter(
      (attendance) => attendance.courseId === courseId
    );
  }

  async addAttendanceForACourse(
    attendanceRecord: Omit<Attendance, "id">
  ): Promise<Attendance> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newAttendance: Attendance = {
      id: Math.max(...attendanceData.attendance.map((a) => a.id)) + 1,
      ...attendanceRecord,
    };

    attendanceData.attendance.push(newAttendance);
    return newAttendance;
  }

  // Future implementation using real API
  async getAllAttendanceByCourseApi(courseId: number): Promise<Attendance[]> {
    try {
      const response = await api.get<Attendance[]>(
        `/attendance/course/${courseId}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addAttendanceForACourseApi(
    attendanceRecord: Omit<Attendance, "id">
  ): Promise<Attendance> {
    try {
      const response = await api.post<Attendance>(
        "/attendance",
        attendanceRecord
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getGroupedAttendanceByCourse(courseId: number): Promise<GroupedAttendance[]> {
    const attendances = await this.getAllAttendanceByCourse(courseId);
    
    // Group by studentId
    const groupedByStudent = attendances.reduce((acc: { [key: number]: Attendance[] }, curr) => {
      if (!acc[curr.studentId]) {
        acc[curr.studentId] = [];
      }
      acc[curr.studentId].push(curr);
      return acc;
    }, {});

    // Transform to final format
    return Object.entries(groupedByStudent).map(([studentId, records]) => ({
      studentId: parseInt(studentId),
      studentName: "Student " + studentId, // You'll need to get actual student names from your data
      attendanceRecords: records,
      totalPresent: records.filter(r => r.isPresent).length,
      totalClasses: records.length
    }));
  }

  async getStudentsForCourse(courseId: number, session: string): Promise<Student[]> {
    // In a real app, this would be an API call
    // For now, we'll filter students from users.json based on session
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return userData.users
      .filter(user => user.role === 'student' && user.studentSession === session)
      .map(user => ({
        id: user.id,
        studentId: user.studentId,
        studentName: user.studentName,
        session: user.studentSession
      }));
  }

  private handleError(error: any) {
    return error;
  }
}

export const attendanceService = new AttendanceService();
