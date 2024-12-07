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
import { Colors } from "@/constants/Colors";

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
            placeholderTextColor={Colors.dark.textSecondary}
          />

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <ThemedText style={styles.buttonText}>
                {user ? "Save" : "Create"}
              </ThemedText>
            </TouchableOpacity>

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
                  {formData.isSuspended ? "Unsuspend" : "Suspend"}
                </ThemedText>
              </TouchableOpacity>
            )}

            {user && onDelete && (
              <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
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
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: Colors.dark.gray,
    padding: 12,
    width: "48%",
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
  },
  submitButton: {
    backgroundColor: Colors.dark.card,
    padding: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
    marginVertical: 5,
  },
  suspendButton: {
    backgroundColor: Colors.dark.warningColor,
    padding: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
    marginVertical: 5,
  },
  deleteButton: {
    backgroundColor: Colors.dark.dangerColor,
    padding: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
    marginVertical: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
