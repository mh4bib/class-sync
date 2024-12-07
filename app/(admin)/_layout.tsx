import { router, Tabs } from "expo-router";
import { Platform } from "react-native";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function AdminTabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
            borderTopColor: Colors[colorScheme ?? "light"].card,
          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="chart.bar" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="all-students"
          options={{
            title: "Students",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.3" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="all-teachers"
          options={{
            title: "Teachers",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.2" color={color} />
            ),
          }}
        />
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
