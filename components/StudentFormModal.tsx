import { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { User } from "@/types/auth";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (user: Partial<User>) => void;
  onDelete?: () => void;
  user?: User | null;
}

export function StudentFormModal({
  visible,
  onClose,
  onSubmit,
  onDelete,
  user,
}: Props) {
  const [formData, setFormData] = useState<Partial<User>>({
    email: "",
    role: "student",
    isSuspended: false,
    studentId: "",
    studentName: "",
    studentSession: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({ email: "", role: "student", isSuspended: false, studentId: "", studentName: "", studentSession: "" });
    }
  }, [user]);

  const handleSubmit = () => {
    if (!formData.email) {
      Alert.alert("Error", "Email is required");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            {user ? "Edit Student" : "Add New Student"}
          </ThemedText>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, email: text }))
            }
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Student ID"
            value={formData.studentId}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, studentId: text }))
            }
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Student Name"
            value={formData.studentName}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, studentName: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Session"
            value={formData.studentSession}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, studentSession: text }))
            }
          />

          {user && (
            <TouchableOpacity
              style={styles.suspendButton}
              onPress={() =>
                setFormData((prev) => ({
                  ...prev,
                  isSuspended: !prev.isSuspended,
                }))
              }
            >
              <ThemedText style={styles.buttonText}>
                {formData.isSuspended ? "Unsuspend Student" : "Suspend Student"}
              </ThemedText>
            </TouchableOpacity>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <ThemedText style={styles.buttonText}>
                {user ? "Save" : "Create"}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {user && onDelete && (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <ThemedText style={styles.buttonText}>Delete Student</ThemedText>
            </TouchableOpacity>
          )}
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
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ddd",
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
  suspendButton: {
    backgroundColor: "#FF9500",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
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
