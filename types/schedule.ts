export interface Schedule {
  id: string;
  courseId: string;
  teacherId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  venue: string;
  course: Course;
}

export interface Course {
  id: number;
  courseCode: string;
  courseTitle: string;
  creditHours: number;
}