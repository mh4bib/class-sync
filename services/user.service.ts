import { User } from "@/types/auth";
import { api } from "./api";
import users from "@/data/users.json";

class UserService {
  // Current mock implementation using JSON
  async getAllStudents(): Promise<User[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Filter only students from the JSON file
    return users.users
      .filter((user) => user.role === "student")
      .map(({ password, ...user }) => user) as User[];
  }

  // Future implementation using real API
  async getAllStudentsApi(): Promise<User[]> {
    try {
      const response = await api.get<User[]>("/users/students");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any) {
    return error;
  }
}

export const userService = new UserService();
