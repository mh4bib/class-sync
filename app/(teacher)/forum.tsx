import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, RefreshControl, TouchableOpacity, Modal, View, TextInput, Button } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ForumPost } from "@/types/forum";
import { forumService } from "@/services/forum.service";
import { ForumCard } from "@/components/ForumCard";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";

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
            <ThemedText type="title" style={styles.modalTitle}>Add New Post</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newPost.title}
              onChangeText={(text) => setNewPost((prev) => ({ ...prev, title: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Content"
              value={newPost.content}
              onChangeText={(text) => setNewPost((prev) => ({ ...prev, content: text }))}
              multiline
            />
            <Button title="Submit" onPress={handleAddPost} />
            <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
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
    backgroundColor: "#6200ee",
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
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});
