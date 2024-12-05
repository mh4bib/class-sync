import { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import {
  attendanceService,
  GroupedAttendance,
} from "@/services/attendance.service";
import { useLocalSearchParams } from "expo-router";

export default function ViewAttendanceScreen() {
  const [attendanceData, setAttendanceData] = useState<GroupedAttendance[]>([]);
  const { courseId, courseTitle } = useLocalSearchParams<{
    courseId: string;
    courseTitle: string;
  }>();

  useEffect(() => {
    loadAttendanceData();
  }, [courseId]);

  const loadAttendanceData = async () => {
    if (!courseId) return;
    try {
      const data = await attendanceService.getGroupedAttendanceByCourse(
        parseInt(courseId)
      );
      setAttendanceData(data);
    } catch (error) {
      console.error("Error loading attendance data:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        {courseTitle}
      </ThemedText>
      <ScrollView horizontal>
        <ScrollView>
          {/* Header Row */}
          <ThemedView style={styles.row}>
            <ThemedText style={[styles.cell, styles.headerCell]}>
              Student
            </ThemedText>
            <ThemedText style={[styles.cell, styles.headerCell]}>
              Present
            </ThemedText>
            <ThemedText style={[styles.cell, styles.headerCell]}>
              Total
            </ThemedText>
            <ThemedText style={[styles.cell, styles.headerCell]}>
              Percentage
            </ThemedText>
          </ThemedView>

          {/* Data Rows */}
          {attendanceData.map((student) => (
            <ThemedView key={student.studentId} style={styles.row}>
              <ThemedText style={styles.cell}>{student.studentName}</ThemedText>
              <ThemedText style={styles.cell}>
                {student.totalPresent}
              </ThemedText>
              <ThemedText style={styles.cell}>
                {student.totalClasses}
              </ThemedText>
              <ThemedText style={styles.cell}>
                {((student.totalPresent / student.totalClasses) * 100).toFixed(
                  1
                )}
                %
              </ThemedText>
            </ThemedView>
          ))}
        </ScrollView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#526D82",
  },
  cell: {
    padding: 10,
    width: 100,
    textAlign: "center",
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#526D82",
  },
});
