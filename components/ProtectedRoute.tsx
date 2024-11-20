// components/ProtectedRoute.tsx
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

type Props = {
  children: React.ReactNode;
  allowedRoles: Array<"admin" | "teacher" | "student">;
};

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    switch (user.role) {
      case "admin":
        return <Redirect href="/(admin)/all-students" />;
      case "teacher":
        return <Redirect href="/(teacher)/schedule" />;
      case "student":
        return <Redirect href="/(student)/schedule" />;
      default:
        return <Redirect href="/(auth)/login" />;
    }
  }

  return <>{children}</>;
}
