import { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Schedule } from "@/types/schedule";
import { scheduleService } from "@/services/schedule.service";
import { useAuth } from "@/context/AuthContext";

interface GroupedSchedules {
  [key: string]: {
    [key: string]: Schedule[];
  };
}

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function StudentScheduleScreen() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [groupedSchedules, setGroupedSchedules] = useState<GroupedSchedules>(
    {}
  );
  const { user } = useAuth();

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const allSchedules = await scheduleService.getSchedules();
      // Filter schedules for the student's session
      const studentSchedules = allSchedules.filter(
        (schedule) => schedule.session === user?.session
      );
      setSchedules(studentSchedules);
      groupSchedules(studentSchedules);
    } catch (error) {
      console.error("Error loading data", error);
    }
  };

  const groupSchedules = (schedules: Schedule[]) => {
    const grouped = schedules.reduce((acc: GroupedSchedules, schedule) => {
      const day = schedule.dayOfWeek;
      const course = schedule.course;
      const semester = course ? getSemester(course.courseCode) : "Unknown";

      if (!acc[day]) acc[day] = {};
      if (!acc[day][semester]) acc[day][semester] = [];

      acc[day][semester].push(schedule);
      return acc;
    }, {});

    setGroupedSchedules(grouped);
  };

  const getSemester = (courseCode: string) => {
    const year = parseInt(courseCode.slice(3, 4));
    const sem = parseInt(courseCode.slice(4, 5));
    const yearSuffix = (year: number) => {
      switch (year) {
        case 1:
          return "1st";
        case 2:
          return "2nd";
        case 3:
          return "3rd";
        default:
          return `${year}th`;
      }
    };
    return `${yearSuffix(year)} Year ${sem === 1 ? "1st" : "2nd"} Semester`;
  };

  const renderScheduleItem = (schedule: Schedule) => {
    const course = schedule.course;

    return (
      <ThemedView key={schedule.id} style={styles.scheduleItem}>
        <ThemedText type="subtitle">
          {course?.courseCode} - {course?.courseTitle}
        </ThemedText>
        <ThemedText>
          {schedule.startTime} - {schedule.endTime}
        </ThemedText>
        <ThemedText>Venue: {schedule.venue}</ThemedText>
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {weekDays.map((day) => (
          <ThemedView key={day} style={styles.dayContainer}>
            <ThemedText type="title" style={styles.dayHeader}>
              {day}
            </ThemedText>
            {Object.keys(groupedSchedules[day] || {})
              .sort()
              .map((semester) => (
                <ThemedView key={semester} style={styles.semesterContainer}>
                  <ThemedText type="subtitle" style={styles.semesterHeader}>
                    {semester}
                  </ThemedText>
                  {groupedSchedules[day][semester].map((schedule) =>
                    renderScheduleItem(schedule)
                  )}
                </ThemedView>
              ))}
          </ThemedView>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  dayContainer: {
    marginBottom: 24,
  },
  dayHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  semesterContainer: {
    marginLeft: 16,
    marginBottom: 16,
  },
  semesterHeader: {
    fontSize: 16,
    marginBottom: 8,
  },
  scheduleItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 8,
  },
});
