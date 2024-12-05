export interface User {
  id: string;
  email: string;
  role: string;
  isSuspended: boolean;
  studentId?: string;
  studentName?: string;
  studentSession?: string;
}

export interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  upVotes: number;
  downVotes: number;
  comments: Comment[];
  userId: number;
  user?: User;
}

export interface Comment {
  id: number;
  content: string;
  author: string;
  date: string;
  upVotes: number;
  downVotes: number;
  userId: number;
  user?: User;
}
