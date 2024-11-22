import { useState, useEffect } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { ThemedTextInput } from "./ThemedTextInput";
import { ThemedButton } from "./ThemedButton";
import { Event, EventType, EVENT_TYPES } from "@/types/event";
import { Course } from "@/types/schedule";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";

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
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={styles.modalContent}>
          <ThemedText type="title" style={styles.modalTitle}>
            {event ? "Edit Event" : "New Event"}
          </ThemedText>

          <ThemedTextInput
            placeholder="Title"
            value={formData.title}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, title: text }))
            }
          />

          <ThemedTextInput
            placeholder="Description"
            value={formData.description}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, description: text }))
            }
            multiline
          />

          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <ThemedTextInput
              placeholder="Date"
              value={formData.date}
              editable={false}
            />
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
              selectedValue={formData.course}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, course: value }))
              }
            >
              <Picker.Item label="Select Course" value="" />
              {courses.map((course) => (
                <Picker.Item
                  key={course.courseCode}
                  label={`${course.courseCode} - ${course.courseTitle}`}
                  value={course.courseCode}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value }))
              }
            >
              <Picker.Item label="Select Type" value="" />
              {EVENT_TYPES.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>

          <View style={styles.buttonContainer}>
            <ThemedButton title="Cancel" onPress={onClose} type="secondary" />
            <ThemedButton
              title={event ? "Update" : "Create"}
              onPress={handleSubmit}
              type="primary"
            />
            {event && onDelete && (
              <ThemedButton
                title="Delete"
                onPress={handleDelete}
                type="danger"
              />
            )}
          </View>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});
