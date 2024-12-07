import React, { useState } from "react";
import { StyleSheet, View, Pressable, Button, TextInput } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { IconSymbol } from "./ui/IconSymbol";
import { ForumPost, Comment } from "@/types/forum";
import { forumService } from "@/services/forum.service";
import { useAuth } from "@/context/AuthContext";
import { ThemedTextInput } from "./ThemedTextInput";
import { CommentCard } from "./CommentCard";
import { Avatar } from "./Avatar";
import { Colors } from "@/constants/Colors";
import { IconButton } from "./ui/IconButton";

interface ForumCardProps {
  post: ForumPost;
  onVoteChange?: () => void;
}

export function ForumCard({ post, onVoteChange }: ForumCardProps) {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState("");
  const { user } = useAuth();

  const handleUpvote = async () => {
    await forumService.addUpVote(post.id);
    onVoteChange?.();
  };

  const handleDownvote = async () => {
    await forumService.addDownVote(post.id);
    onVoteChange?.();
  };

  const handleAddComment = async () => {
    if (!comment.trim() || !user) return;

    await forumService.addComment(post.id, {
      content: comment,
      author: user.name || user.email,
      date: new Date().toISOString(),
      userId: Number(user.id),
    });
    setComment("");
    setShowCommentInput(false);
    onVoteChange?.();
  };

  return (
    <ThemedView style={styles.card}>
      <View
        style={{
          backgroundColor: Colors.dark.card,
          padding: 10,
          borderRadius: 10,
        }}
      >
        <View style={{ ...styles.header }}>
          <Avatar
            size={50}
            source={require("@/assets/images/default-avatar.png")}
          />
          <View style={styles.headerText}>
            <ThemedText type="title" style={{ ...styles.title }}>
              {post.title}
            </ThemedText>
            <ThemedText style={{ color: Colors.dark.gray }}>
              {post.author}{" "}
              {post.user?.studentId ? `(${post.user.studentId})` : ""} •{" "}
              {new Date(post.date).toLocaleDateString()}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.content}>{post.content}</ThemedText>

        <View style={styles.actions}>
          <Pressable onPress={handleUpvote} style={styles.voteButton}>
            <IconSymbol name="arrow.up" size={20} color="#fff" />
            <ThemedText>{post.upVotes}</ThemedText>
          </Pressable>

          <Pressable onPress={handleDownvote} style={styles.voteButton}>
            <IconSymbol name="arrow.down" size={20} color="#fff" />
            <ThemedText>{post.downVotes}</ThemedText>
          </Pressable>

          <Pressable
            onPress={() => setShowCommentInput(!showCommentInput)}
            style={styles.commentButton}
          >
            <IconSymbol name="bubble.left" size={20} color="#fff" />
            <ThemedText style={{ marginLeft: 2 }}>Answer this post</ThemedText>
          </Pressable>
        </View>
      </View>

      {showCommentInput && (
        <View style={styles.commentInput}>
          <TextInput
            value={comment}
            style={{
              color: Colors.dark.text,
              borderColor: Colors.dark.text,
              borderWidth: 1,
              padding: 10,
              height: 60,
              textAlignVertical: "top",
              borderRadius: 10,
            }}
            placeholderTextColor={Colors.dark.textSecondary}
            onChangeText={setComment}
            placeholder="Write a comment..."
            multiline
          />
          <IconButton
            onPress={handleAddComment}
            icon="send"
            size={24}
            color={Colors.dark.card}
            style={styles.submitButton}
          />
        </View>
      )}

      <View style={styles.comments}>
        {post.comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
  },
  content: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  voteButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  commentButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentInput: {
    marginTop: 12,
    gap: 8,
    position: "relative",
  },
  submitButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  comments: {
    marginTop: 16,
    marginLeft: 16,
  },
});
