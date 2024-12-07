import { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Schedule } from "@/types/schedule";
import { Colors } from "@/constants/Colors";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (schedule: Schedule) => void;
  schedule: Schedule | null;
}

export function ScheduleFormModal({ visible, onClose, onSubmit, schedule }: Props) {
  const [formData, setFormData] = useState<Partial<Schedule>>({});
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

  useEffect(() => {
    if (schedule) {
      setFormData(schedule);
    }
  }, [schedule]);

  const handleTimeChange = (isStart: boolean) => (event: any, selectedTime?: Date) => {
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
    marginBottom: 20,
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
});