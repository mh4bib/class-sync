import { Tabs } from "expo-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function StudentTabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
        }}
      >
        <Tabs.Screen
          name="courses"
          options={{
            title: "My Courses",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="book" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="grades"
          options={{
            title: "My Grades",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="list.bullet" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.circle" color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
