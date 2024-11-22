
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { UserCard } from "@/components/UserCard";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user.service";
import { User } from "@/types/auth";
import { TeacherFormModal } from "@/components/TeacherFormModal";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function AllTeachersScreen() {
  const [teachers, setTeachers] = useState<User[]>([]);
  const { user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      return;
    }
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const teachers = await userService.getAllTeachers();
      setTeachers(teachers);
    } catch (error) {
      console.error("Error loading teachers:", error);
    }
  };

  const handleAddTeacher = () => {
    setSelectedTeacher(null);
    setIsModalVisible(true);
  };

  const handleEditTeacher = (teacher: User) => {
    setSelectedTeacher(teacher);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedTeacher(null);
    setIsModalVisible(false);
  };

  const handleCreateTeacher = async (userData: Partial<User>) => {
    try {
      const newTeacher = await userService.createUser({
        ...userData,
        role: "teacher",
        isSuspended: false,
      });
      setTeachers((prev) => [...prev, newTeacher]);
      handleCloseModal();
    } catch (error) {
      console.error("Error creating teacher:", error);
      Alert.alert("Error", "Failed to create teacher");
    }
  };

  const handleUpdateTeacher = async (userData: Partial<User>) => {
    try {
      const updatedTeacher = await userService.updateUser(userData);
      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher.id === updatedTeacher.id ? updatedTeacher : teacher
        )
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error updating teacher:", error);
      Alert.alert("Error", "Failed to update teacher");
    }
  };

  const handleDeleteTeacher = async () => {
    if (!selectedTeacher) return;

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this teacher?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await userService.deleteUser(selectedTeacher.id);
              setTeachers((prev) =>
                prev.filter((teacher) => teacher.id !== selectedTeacher.id)
              );
              handleCloseModal();
            } catch (error) {
              console.error("Error deleting teacher:", error);
              Alert.alert("Error", "Failed to delete teacher");
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={teachers.filter((teacher) => !teacher.isSuspended)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEditTeacher(item)}>
            <UserCard user={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddTeacher}>
        <IconSymbol name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <TeacherFormModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onSubmit={selectedTeacher ? handleUpdateTeacher : handleCreateTeacher}
        onDelete={selectedTeacher ? handleDeleteTeacher : undefined}
        user={selectedTeacher}
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