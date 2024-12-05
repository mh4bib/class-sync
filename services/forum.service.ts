import { Comment, ForumPost, User } from "@/types/forum";
import { api } from "./api";
import forumData from "@/data/forum.json";
import userData from "@/data/users.json";

class ForumService {
  // Posts CRUD operations
  async getAllPosts(): Promise<ForumPost[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return forumData.forum.map((post) => ({
      ...post,
      user: userData.users.find((user) => Number(user.id) === post.userId),
      comments: post.comments.map((comment) => ({
        ...comment,
        user: userData.users.find((user) => Number(user.id) === comment.userId),
      })),
    }));
  }

  async addPost(
    post: Omit<ForumPost, "id" | "comments" | "upVotes" | "downVotes">
  ): Promise<ForumPost> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newPost: ForumPost = {
      id: Math.max(...forumData.forum.map((p) => p.id)) + 1,
      ...post,
      upVotes: 0,
      downVotes: 0,
      comments: [],
    };

    forumData.forum.push(newPost);
    return newPost;
  }

  async editPost(id: number, updates: Partial<ForumPost>): Promise<ForumPost> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = forumData.forum.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Post not found");

    forumData.forum[index] = { ...forumData.forum[index], ...updates };
    return forumData.forum[index];
  }

  async removePost(id: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = forumData.forum.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Post not found");

    forumData.forum.splice(index, 1);
  }

  // Comments CRUD operations
  async addComment(
    postId: number,
    comment: Omit<Comment, "id" | "upVotes" | "downVotes">
  ): Promise<Comment> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const post = forumData.forum.find((p) => p.id === postId);
    if (!post) throw new Error("Post not found");

    const newComment: Comment = {
      id: Math.max(...post.comments.map((c) => c.id), 0) + 1,
      ...comment,
      upVotes: 0,
      downVotes: 0,
    };

    post.comments.push(newComment);
    return newComment;
  }

  async editComment(
    postId: number,
    commentId: number,
    updates: Partial<Comment>
  ): Promise<Comment> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const post = forumData.forum.find((p) => p.id === postId);
    if (!post) throw new Error("Post not found");

    const commentIndex = post.comments.findIndex((c) => c.id === commentId);
    if (commentIndex === -1) throw new Error("Comment not found");

    post.comments[commentIndex] = {
      ...post.comments[commentIndex],
      ...updates,
    };
    return post.comments[commentIndex];
  }

  async removeComment(postId: number, commentId: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const post = forumData.forum.find((p) => p.id === postId);
    if (!post) throw new Error("Post not found");

    const commentIndex = post.comments.findIndex((c) => c.id === commentId);
    if (commentIndex === -1) throw new Error("Comment not found");

    post.comments.splice(commentIndex, 1);
  }

  // Voting operations
  async addUpVote(postId: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const post = forumData.forum.find((p) => p.id === postId);
    if (!post) throw new Error("Post not found");

    post.upVotes += 1;
  }

  async removeUpVote(postId: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const post = forumData.forum.find((p) => p.id === postId);
    if (!post) throw new Error("Post not found");

    post.upVotes = Math.max(0, post.upVotes - 1);
  }

  async addDownVote(postId: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const post = forumData.forum.find((p) => p.id === postId);
    if (!post) throw new Error("Post not found");

    post.downVotes += 1;
  }

  async removeDownVote(postId: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const post = forumData.forum.find((p) => p.id === postId);
    if (!post) throw new Error("Post not found");

    post.downVotes = Math.max(0, post.downVotes - 1);
  }

  // Future API implementations
  async getAllPostsApi(): Promise<ForumPost[]> {
    try {
      const response = await api.get<ForumPost[]>("/forum");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any) {
    return error;
  }
}

export const forumService = new ForumService();
