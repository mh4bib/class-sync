import { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Schedule, Course } from "@/types/schedule";
import { User } from "@/types/auth";
import { scheduleService } from "@/services/schedule.service";
import { userService } from "@/services/user.service";
import { Colors } from "@/constants/Colors";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (schedule: Partial<Schedule>) => void;
}

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function NewScheduleFormModal({ visible, onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState<Partial<Schedule>>({
    dayOfWeek: weekDays[0],
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursesData, teachersData] = await Promise.all([
        scheduleService.getCourses(),
        userService.getAllTeachers(),
      ]);
      setCourses(coursesData);
      setTeachers(teachersData);
    } catch (error) {
      console.error("Error loading form data:", error);
    }
  };

  const handleTimeChange =
    (isStart: boolean) => (event: any, selectedTime?: Date) => {
      if (Platform.OS === "android") {
        isStart ? setShowStartTime(false) : setShowEndTime(false);
      }

      if (selectedTime) {
        const timeString = selectedTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        setFormData((prev) => ({
          ...prev,
          [isStart ? "startTime" : "endTime"]: timeString,
        }));
      }
    };

  const handleSubmit = () => {
    if (
      !formData.courseId ||
      !formData.teacherId ||
      !formData.startTime ||
      !formData.endTime
    ) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            Add New Schedule
          </ThemedText>

          <ScrollView style={styles.form}>
            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={formData.courseId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, courseId: value }))
                }
                dropdownIconColor={Colors.dark.text}
              >
                <Picker.Item
                  label="Select Course"
                  value=""
                  color={Colors.dark.black}
                />
                {courses.map((course) => (
                  <Picker.Item
                    key={course.id}
                    label={`${course.courseCode} - ${course.courseTitle}`}
                    value={course.id.toString()}
                    color={Colors.dark.black}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={formData.teacherId}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, teacherId: value }))
                }
                dropdownIconColor={Colors.dark.text}
              >
                <Picker.Item
                  label="Select Teacher"
                  value=""
                  color={Colors.dark.black}
                />
                {teachers.map((teacher) => (
                  <Picker.Item
                    key={teacher.id}
                    label={teacher.email}
                    value={teacher.id}
                    color={Colors.dark.black}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={formData.dayOfWeek}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, dayOfWeek: value }))
                }
                dropdownIconColor={Colors.dark.text}
              >
                {weekDays.map((day) => (
                  <Picker.Item
                    key={day}
                    label={day}
                    value={day}
                    color={Colors.dark.black}
                  />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowStartTime(true)}
            >
              <ThemedText>
                Start Time: {formData.startTime || "Select"}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowEndTime(true)}
            >
              <ThemedText>End Time: {formData.endTime || "Select"}</ThemedText>
            </TouchableOpacity>

            {(showStartTime || showEndTime) && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange(showStartTime)}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Venue"
              value={formData.venue}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, venue: text }))
              }
              placeholderTextColor={Colors.dark.textSecondary}
            />
          </ScrollView>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <ThemedText style={styles.buttonText}>Create</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors.dark.text,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    color: Colors.dark.text,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: Colors.dark.gray,
    padding: 12,
    width: "48%",
    borderRadius: 8,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: Colors.dark.card,
    padding: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  timeButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.dark.text,
    borderRadius: 8,
    marginBottom: 16,
    color: Colors.dark.text,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.dark.text,
    borderRadius: 8,
    marginBottom: 16,
    height: 50,
    justifyContent: "center",
  },
  picker: {
    color: Colors.dark.text,
    height: 50,
  },
});
