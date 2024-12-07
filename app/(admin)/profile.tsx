import { StyleSheet, TouchableOpacity, Image, TextInput } from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Colors } from "@/constants/Colors";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    oldPassword: "",
    newPassword: "",
  });

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  const handleSubmit = async () => {
    // TODO: Implement profile update logic
    console.log("Profile update:", formData);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.infoContainer}>
        <Image
          source={require("../../assets/images/default-avatar.png")}
          style={styles.avatar}
        />

        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, name: text }))
          }
          placeholder="Name"
          placeholderTextColor={Colors.dark.textSecondary}
        />

        <TextInput
          style={[styles.input]}
          value={user?.email}
          editable={false}
          placeholderTextColor={Colors.dark.textSecondary}
        />

        <TextInput
          style={styles.input}
          value={formData.oldPassword}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, oldPassword: text }))
          }
          placeholder="Old Password"
          placeholderTextColor={Colors.dark.textSecondary}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          value={formData.newPassword}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, newPassword: text }))
          }
          placeholder="New Password"
          placeholderTextColor={Colors.dark.textSecondary}
          secureTextEntry
        />
      </ThemedView>

      <ThemedView style={styles.bottomSection}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <ThemedText style={styles.buttonText}>UPDATE PROFILE</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText style={styles.logoutText}>LOGOUT</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  infoContainer: {
    gap: 16,
    alignItems: "center",
    marginTop: 40,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  input: {
    height: 55,
    borderWidth: 1,
    width: "100%",
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#ddd",
  },
  submitButton: {
    backgroundColor: Colors.dark.card,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: "auto",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#AA0000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomSection: {
    display: "flex",
    flexDirection: "column",
    marginTop: "auto",
    gap: 16,
  },
});
