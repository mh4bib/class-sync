// import { useState } from "react";
// import { StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
// import { router } from "expo-router";
// import { ThemedText } from "@/components/ThemedText";
// import { ThemedView } from "@/components/ThemedView";
// import { useAuth } from "@/context/AuthContext";

// export default function LoginScreen() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { login, user } = useAuth();

//   const handleLogin = async () => {
//     try {
//       const response = await login({ email, password });
//       // Use the response.user.role directly to determine the route
//       switch (response.user.role) {
//         case "admin":
//           router.replace("/all-students");
//           break;
//         case "teacher":
//           router.replace("/(teacher)");
//           break;
//         case "student":
//           router.replace("/(student)");
//           break;
//         default:
//           console.error("Unknown user role");
//       }
//     } catch (error) {
//       console.error(error);
//       // Optionally show error to user
//       Alert.alert("Error", "Login failed. Please try again.");
//     }
//   };

//   return (
//     <ThemedView style={styles.container}>
//       <ThemedText type="title" style={styles.title}>
//         Welcome Back
//       </ThemedText>

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <ThemedText style={styles.buttonText}>Login</ThemedText>
//       </TouchableOpacity>
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 32,
//     marginBottom: 40,
//     textAlign: "center",
//   },
//   input: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     marginBottom: 16,
//     paddingHorizontal: 16,
//     backgroundColor: "#fff",
//   },
//   button: {
//     backgroundColor: "#007AFF",
//     height: 50,
//     borderRadius: 8,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });
