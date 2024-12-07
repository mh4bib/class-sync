export interface Schedule {
  id: string;
  courseId: number; // Changed from string to number
  teacherId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  venue: string;
  course: Course;
  session: string;
}

export interface Course {
  id: number;
  courseCode: string;
  courseTitle: string;
  creditHours: number;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  session: string;
}
