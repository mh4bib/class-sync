// app/(teacher)/_layout.tsx
import { Tabs } from "expo-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TeacherTabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
        }}
      >
        <Tabs.Screen
          name="schedule"
          options={{
            title: "Schedule",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="calendar" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: "Events",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="star" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="attendance"
          options={{
            title: "Attendance", 
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.badge.check" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="forum"
          options={{
            title: "Forum",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="bubble.left.and.bubble.right" color={color} />
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
