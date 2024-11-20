import { LoginCredentials, LoginResponse, ApiError } from "@/types/auth";
import users from "@/data/users.json";
import { api } from "./api";

class AuthService {
  // Current mock implementation using JSON
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const user = users.users.find(
        (u) =>
          u.email === credentials.email && u.password === credentials.password
      );

      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword as LoginResponse["user"],
        token: "mock-jwt-token", // Mock token for future use
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Future implementation using real API
  async loginWithApi(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      // Real API error
      return {
        message: error.response.data.message || "An error occurred",
        status: error.response.status,
      };
    }
    // Local error
    return {
      message: error.message || "An error occurred",
      status: 400,
    };
  }
}

export const authService = new AuthService();
