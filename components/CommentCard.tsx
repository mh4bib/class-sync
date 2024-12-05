import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Comment } from "@/types/forum";
import { Avatar } from "./Avatar";

interface CommentCardProps {
  comment: Comment;
}

export function CommentCard({ comment }: CommentCardProps) {
  return (
    <ThemedView style={styles.card}>
      <View style={styles.header}>
        <Avatar
          size={36}
          source={require("@/assets/images/default-avatar.png")}
        />
        <View style={styles.headerText}>
          <ThemedText style={styles.author}>
            {comment.author}{" "}
            {comment.user?.studentId ? `(${comment.user.studentId})` : ""} •{" "}
            {new Date(comment.date).toLocaleDateString()}
          </ThemedText>
          <ThemedText style={styles.content}>{comment.content}</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  headerText: {
    marginLeft: 8,
    flex: 1,
  },
  author: {
    fontSize: 14,
    marginBottom: 4,
  },
  content: {
    fontSize: 14,
  },
});
