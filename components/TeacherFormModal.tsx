
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
  onSubmit: (userData: Partial<User>) => void;
  onDelete?: () => void;
  user?: User | null;
}

export function TeacherFormModal({
  visible,
  onClose,
  onSubmit,
  onDelete,
  user,
}: Props) {
  const [formData, setFormData] = useState<Partial<User>>({
    email: "",
    role: "teacher",
    isSuspended: false,
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({ email: "", role: "teacher", isSuspended: false });
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
            {user ? "Edit Teacher" : "Add New Teacher"}
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
                {formData.isSuspended ? "Unsuspend Teacher" : "Suspend Teacher"}
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
              <ThemedText style={styles.buttonText}>Delete Teacher</ThemedText>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  suspendButton: {
    backgroundColor: "#FF9500",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});