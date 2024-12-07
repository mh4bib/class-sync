import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Student } from "@/types/schedule";
import { attendanceService } from "@/services/attendance.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import Checkbox from "expo-checkbox";

interface AttendanceRecord {
  studentId: string;
  isPresent: boolean;
}

export default function TakeAttendanceScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const { courseId, session } = useLocalSearchParams<{
    courseId: string;
    session: string;
  }>();
  const router = useRouter();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const courseStudents = await attendanceService.getStudentsForCourse(
        parseInt(courseId),
        session
      );
      setStudents(courseStudents);
      setAttendance(
        courseStudents.map((student) => ({
          studentId: student.studentId,
          isPresent: true,
        }))
      );
    } catch (error) {
      console.error("Error loading students:", error);
    }
  };

  const toggleAttendance = (studentId: string) => {
    setAttendance((prev) =>
      prev.map((record) =>
        record.studentId === studentId
          ? { ...record, isPresent: !record.isPresent }
          : record
      )
    );
  };

  const handleSubmit = async () => {
    try {
      // Submit each attendance record
      const date = new Date().toISOString().split("T")[0];
      const promises = attendance.map((record) =>
        attendanceService.addAttendanceForACourse({
          studentId: parseInt(record.studentId),
          courseId: parseInt(courseId),
          date,
          isPresent: record.isPresent,
        })
      );

      await Promise.all(promises);
      router.back();
    } catch (error) {
      console.error("Error submitting attendance:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {students.map((student) => (
          <ThemedView key={student.id} style={styles.studentRow}>
            <ThemedText style={styles.studentInfo}>
              {student.name} ({student.studentId})
            </ThemedText>
            <Checkbox
              value={
                attendance.find((a) => a.studentId === student.studentId)
                  ?.isPresent
              }
              onValueChange={() => toggleAttendance(student.studentId)}
              color="#526D82"
            />
          </ThemedView>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <ThemedText style={styles.submitButtonText}>
          Submit Attendance
        </ThemedText>
      </TouchableOpacity>
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
  studentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#526D82",
  },
  studentInfo: {
    flex: 1,
    marginRight: 16,
  },
  submitButton: {
    backgroundColor: "#526D82",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
