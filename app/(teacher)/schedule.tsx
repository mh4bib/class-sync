import { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Modal,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
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

export default function TeacherScheduleScreen() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [groupedSchedules, setGroupedSchedules] = useState<GroupedSchedules>(
    {}
  );
  const { user } = useAuth();
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const allSchedules = await scheduleService.getSchedules();
      // Filter schedules for the logged-in teacher
      const teacherSchedules = allSchedules.filter(
        (schedule) => schedule.teacherId === user?.id
      );
      setSchedules(teacherSchedules);
      groupSchedules(teacherSchedules);
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

  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsModalVisible(true);
  };

  const handleTakeAttendance = () => {
    Alert.alert(
      "Take Attendance",
      "Taking attendance for " + selectedSchedule?.course.courseTitle
    );
    setIsModalVisible(false);
  };

  const handleViewAttendance = () => {
    Alert.alert(
      "View Attendance",
      "Viewing attendance for " + selectedSchedule?.course.courseTitle
    );
    setIsModalVisible(false);
  };

  const renderScheduleItem = (schedule: Schedule) => {
    const course = schedule.course;

    return (
      <TouchableOpacity
        key={schedule.id}
        onPress={() => handleScheduleClick(schedule)}
      >
        <ThemedView style={styles.scheduleItem}>
          <ThemedText type="subtitle">
            {course?.courseCode} - {course?.courseTitle}
          </ThemedText>
          <ThemedText>
            {schedule.startTime} - {schedule.endTime}
          </ThemedText>
          <ThemedText>Venue: {schedule.venue}</ThemedText>
        </ThemedView>
      </TouchableOpacity>
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

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ThemedText type="title" style={styles.modalTitle}>
              {selectedSchedule?.course.courseTitle}
            </ThemedText>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleTakeAttendance}
            >
              <ThemedText style={styles.modalButtonText}>
                Take Attendance
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleViewAttendance}
            >
              <ThemedText style={styles.modalButtonText}>
                View Attendance
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsModalVisible(false)}
            >
              <ThemedText style={styles.modalButtonText}>Close</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#27374D",
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
    marginBottom: 8,
    backgroundColor: "#526D82",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalButton: {
    width: "100%",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#526D82",
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
