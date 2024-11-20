import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

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
