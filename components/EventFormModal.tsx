import { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { ThemedButton } from "./ThemedButton";
import { Event, EventType, EVENT_TYPES } from "@/types/event";
import { Course } from "@/types/schedule";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";
import { Colors } from "@/constants/Colors";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (event: Partial<Event>) => void;
  onDelete?: (id: string) => void;
  event?: Event | null;
  courses: Course[];
}

export function EventFormModal({
  visible,
  onClose,
  onSubmit,
  onDelete,
  event,
  courses,
}: Props) {
  const [formData, setFormData] = useState<Partial<Event>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData(event);
    } else {
      setFormData({});
    }
  }, [event]);

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleDelete = () => {
    if (event?.id && onDelete) {
      onDelete(event.id);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        date: format(selectedDate, "yyyy-MM-dd"),
      }));
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            {event ? "Edit Event" : "New Event"}
          </ThemedText>

          <ScrollView style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={formData.title}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, title: text }))
              }
              placeholderTextColor={Colors.dark.textSecondary}
            />

            <TextInput
              style={[
                styles.input,
                { height: 100 },
                { textAlignVertical: "top" },
              ]}
              placeholder="Description"
              value={formData.description}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, description: text }))
              }
              multiline
              placeholderTextColor={Colors.dark.textSecondary}
            />

            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <ThemedText>Date: {formData.date || "Select"}</ThemedText>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={formData.date ? new Date(formData.date) : new Date()}
                mode="date"
                onChange={handleDateChange}
              />
            )}

            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={formData.course}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, course: value }))
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
                    key={course.courseCode}
                    label={`${course.courseCode} - ${course.courseTitle}`}
                    value={course.courseCode}
                    color={Colors.dark.black}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                style={styles.picker}
                selectedValue={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
                dropdownIconColor={Colors.dark.text}
              >
                <Picker.Item
                  label="Select Type"
                  value=""
                  color={Colors.dark.black}
                />
                {EVENT_TYPES.map((type) => (
                  <Picker.Item
                    key={type}
                    label={type}
                    value={type}
                    color={Colors.dark.black}
                  />
                ))}
              </Picker>
            </View>
          </ScrollView>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <ThemedText style={styles.buttonText}>
                {event ? "Update" : "Create"}
              </ThemedText>
            </TouchableOpacity>
            {event && onDelete && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <ThemedText style={styles.buttonText}>Delete</ThemedText>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
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
    flex: 1,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: Colors.dark.card,
    padding: 12,
    flex: 1,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: Colors.dark.dangerColor,
    padding: 12,
    flex: 1,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
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
