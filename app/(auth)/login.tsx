import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await login({ email, password });

      switch (response.user.role) {
        case "admin":
          router.replace("/(admin)/all-students");
          break;
        case "teacher":
          router.replace("/(teacher)/schedule");
          break;
        case "student":
          router.replace("/(student)/schedule");
          break;
        default:
          console.error("Unknown user role");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Login failed. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ThemedView style={styles.content}>
        <Image
          source={require("@/assets/images/default-avatar.png")}
          style={styles.avatar}
        />

        <ThemedText type="title" style={styles.title}>
          Welcome Back!
        </ThemedText>

        <ThemedText style={styles.subtitle}>Sign in to continue</ThemedText>

        <ThemedView style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholderTextColor="#666"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#666"
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <ThemedText style={styles.forgotPasswordText}>
              Forgot Password?
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <ThemedText style={styles.buttonText}>LOGIN</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    // color: "#ddd",
  },
  subtitle: {
    fontSize: 16,
    // color: "#ddd",
    marginBottom: 40,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#ddd",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    // color: "#666",
    fontSize: 14,
  },
  button: {
    backgroundColor: Colors.dark.card,
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  buttonText: {
    // color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
