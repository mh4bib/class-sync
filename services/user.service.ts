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

  // Add new method to get teachers
  async getAllTeachers(): Promise<User[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Filter only teachers from the JSON file
    return users.users
      .filter((user) => user.role === "teacher")
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

  // Future implementation
  async getAllTeachersApi(): Promise<User[]> {
    try {
      const response = await api.get<User[]>("/users/teachers");
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser = {
      id: (Math.max(...users.users.map(u => parseInt(u.id))) + 1).toString(),
      email: userData.email!,
      password: userData.email!, // Using email as default password
      role: userData.role!,
      isSuspended: false
    };

    // In a real app, we would make an API call here
    // For now, we'll just update our in-memory data
    users.users.push(newUser);

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  }

  async updateUser(userData: Partial<User>): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = users.users.findIndex(u => u.id === userData.id);
    if (index === -1) throw new Error("User not found");

    // Update user data
    users.users[index] = {
      ...users.users[index],
      ...userData,
    };

    const { password, ...userWithoutPassword } = users.users[index];
    return userWithoutPassword as User;
  }

  async deleteUser(userId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = users.users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error("User not found");

    users.users.splice(index, 1);
  }

  private handleError(error: any) {
    return error;
  }
}

export const userService = new UserService();
