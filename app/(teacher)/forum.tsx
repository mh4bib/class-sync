import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Modal,
  View,
  TextInput,
  Button,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ForumPost } from "@/types/forum";
import { forumService } from "@/services/forum.service";
import { ForumCard } from "@/components/ForumCard";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";

export default function ForumScreen() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const loadPosts = async () => {
    const data = await forumService.getAllPosts();
    setPosts(data);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const handleAddPost = async () => {
    await forumService.addPost({
      title: newPost.title,
      content: newPost.content,
      author: "Teacher", // Replace with actual user data
      date: new Date().toISOString(),
      userId: 1, // Replace with actual user ID
    });
    setNewPost({ title: "", content: "" });
    setIsModalVisible(false);
    loadPosts();
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <FlatList
        style={{ marginTop: 20 }}
        data={posts}
        renderItem={({ item }) => (
          <ForumCard post={item} onVoteChange={loadPosts} />
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
      >
        <IconSymbol name="plus" size={24} color="#fff" />
      </TouchableOpacity>
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContainer}>
            <ThemedText type="title" style={styles.modalTitle}>
              Add New Post
            </ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newPost.title}
              onChangeText={(text) =>
                setNewPost((prev) => ({ ...prev, title: text }))
              }
              placeholderTextColor={Colors.dark.textSecondary}
            />
            <TextInput
              style={{ ...styles.input, height: 100, textAlignVertical: "top" }}
              placeholder="Content"
              value={newPost.content}
              onChangeText={(text) =>
                setNewPost((prev) => ({ ...prev, content: text }))
              }
              placeholderTextColor={Colors.dark.textSecondary}
              multiline
            />
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddPost}
              >
                <ThemedText style={styles.buttonText}>ADD POST</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <ThemedText style={styles.buttonText}>CANCEL</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: Colors.dark.fabIcon,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
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
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: Colors.dark.gray,
    padding: 10,
    width: "48%",
    borderRadius: 8,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: Colors.dark.card,
    padding: 10,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
