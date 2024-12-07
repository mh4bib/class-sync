export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  role: "admin" | "teacher" | "student";
  isSuspended: boolean;
  studentId?: string;
  name?: string;
  studentSession?: string;
}

export interface LoginResponse {
  user: User;
  token?: string; // For future use with real API
}

export interface ApiError {
  message: string;
  status?: number;
}
