import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { router } from "expo-router";

import { ThemedView } from "@/components/ThemedView";
import { UserCard } from "@/components/UserCard";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";
import { User } from "@/types/auth";

export default function AllStudentsScreen() {
  const [students, setStudents] = useState<User[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== "admin") {
      // router.replace("/unauthorized");
      return;
    }

    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const students = await userService.getAllStudents();
      setStudents(students);
    } catch (error) {
      console.error("Error loading students:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <UserCard user={item} />}
        contentContainerStyle={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingVertical: 16,
  },
});
