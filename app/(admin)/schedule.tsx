// app/(admin)/schedule.tsx
import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Schedule } from "@/types/schedule";
import { scheduleService } from "@/services/schedule.service";
import { ScheduleFormModal } from "@/components/ScheduleFormModal";
import { NewScheduleFormModal } from "@/components/NewScheduleFormModal";
import { Colors } from "@/constants/Colors";

interface GroupedSchedules {
  [key: string]: {
    [key: string]: Schedule[];
  };
}

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function ScheduleScreen() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [groupedSchedules, setGroupedSchedules] = useState<GroupedSchedules>(
    {}
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewModalVisible, setIsNewModalVisible] = useState(false);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const schedulesData = await scheduleService.getSchedules();
      setSchedules(schedulesData);
      groupSchedules(schedulesData);
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

  const handleEditSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedSchedule(null);
    setIsModalVisible(false);
  };

  const handleUpdateSchedule = async (updatedSchedule: Schedule) => {
    try {
      const result = await scheduleService.updateSchedule(updatedSchedule);

      // Update local state
      setSchedules((prev) =>
        prev.map((schedule) => (schedule.id === result.id ? result : schedule))
      );

      // Regroup schedules
      groupSchedules(
        schedules.map((schedule) =>
          schedule.id === result.id ? result : schedule
        )
      );

      handleCloseModal();
    } catch (error) {
      console.error("Error updating schedule:", error);
      Alert.alert("Error", "Failed to update schedule");
    }
  };

  const handleAddSchedule = () => {
    setIsNewModalVisible(true);
  };

  const handleCloseNewModal = () => {
    setIsNewModalVisible(false);
  };

  const handleCreateSchedule = async (newSchedule: Partial<Schedule>) => {
    try {
      const result = await scheduleService.createSchedule(newSchedule);
      setSchedules((prev) => [...prev, result]);
      groupSchedules([...schedules, result]);
      handleCloseNewModal();
    } catch (error) {
      console.error("Error creating schedule:", error);
      Alert.alert("Error", "Failed to create schedule");
    }
  };

  const renderScheduleItem = (schedule: Schedule) => {
    const course = schedule.course;

    return (
      <TouchableOpacity
        key={schedule.id}
        style={styles.scheduleItem}
        onPress={() => handleEditSchedule(schedule)}
      >
        <ThemedText type="subtitle">
          {course?.courseCode} - {course?.courseTitle}
        </ThemedText>
        <ThemedText>
          {schedule.startTime} - {schedule.endTime}
        </ThemedText>
        <ThemedText>Venue: {schedule.venue}</ThemedText>
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

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddSchedule}>
        <IconSymbol name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <ScheduleFormModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onSubmit={handleUpdateSchedule}
        schedule={selectedSchedule}
      />

      <NewScheduleFormModal
        visible={isNewModalVisible}
        onClose={handleCloseNewModal}
        onSubmit={handleCreateSchedule}
      />
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
    marginBottom: 8,
    backgroundColor: Colors.dark.card,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: Colors.dark.fabIcon,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#e8e8e8",
    borderRadius: 8,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#007AFF",
  },
});
