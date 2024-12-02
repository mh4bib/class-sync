import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { UserCard } from "@/components/UserCard";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";
import { User } from "@/types/auth";
import { StudentFormModal } from "@/components/StudentFormModal";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function AllStudentsScreen() {
  const [students, setStudents] = useState<User[]>([]);
  const { user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

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

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsModalVisible(true);
  };

  const handleEditStudent = (student: User) => {
    setSelectedStudent(student);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
    setIsModalVisible(false);
  };

  const handleCreateStudent = async (userData: Partial<User>) => {
    try {
      const newStudent = await userService.createUser({
        ...userData,
        role: "student",
        isSuspended: false,
        studentId: userData.studentId,
        studentName: userData.studentName,
        studentSession: userData.studentSession,
      });
      setStudents((prev) => [...prev, newStudent]);
      handleCloseModal();
    } catch (error) {
      console.error("Error creating student:", error);
      Alert.alert("Error", "Failed to create student");
    }
  };

  const handleUpdateStudent = async (userData: Partial<User>) => {
    try {
      const updatedStudent = await userService.updateUser({
        ...userData,
        studentId: userData.studentId,
        studentName: userData.studentName,
        studentSession: userData.studentSession,
      });
      setStudents((prev) =>
        prev.map((student) =>
          student.id === updatedStudent.id ? updatedStudent : student
        )
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error updating student:", error);
      Alert.alert("Error", "Failed to update student");
    }
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this student?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await userService.deleteUser(selectedStudent.id);
              setStudents((prev) =>
                prev.filter((student) => student.id !== selectedStudent.id)
              );
              handleCloseModal();
            } catch (error) {
              console.error("Error deleting student:", error);
              Alert.alert("Error", "Failed to delete student");
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={students.filter((student) => !student.isSuspended)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEditStudent(item)}>
            <UserCard user={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddStudent}>
        <IconSymbol name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <StudentFormModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onSubmit={selectedStudent ? handleUpdateStudent : handleCreateStudent}
        onDelete={selectedStudent ? handleDeleteStudent : undefined}
        user={selectedStudent}
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
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
