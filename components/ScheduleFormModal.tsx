
import { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Schedule } from "@/types/schedule";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (schedule: Schedule) => void;
  schedule: Schedule | null;
}

export function ScheduleFormModal({ visible, onClose, onSubmit, schedule }: Props) {
  const [formData, setFormData] = useState<Partial<Schedule>>({});

  useEffect(() => {
    if (schedule) {
      setFormData(schedule);
    }
  }, [schedule]);

  const handleSubmit = () => {
    if (formData && schedule) {
      onSubmit({ ...schedule, ...formData });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            Edit Schedule
          </ThemedText>

          <ScrollView style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Start Time (HH:mm)"
              value={formData.startTime}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, startTime: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="End Time (HH:mm)"
              value={formData.endTime}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, endTime: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Venue"
              value={formData.venue}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, venue: text }))
              }
            />
          </ScrollView>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <ThemedText style={styles.buttonText}>Save</ThemedText>
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
    padding: 20,
  },
  container: {
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});