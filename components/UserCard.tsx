import { Image, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type UserCardProps = {
  user: {
    id: string;
    email: string;
    role: string;
    name?: string;
    avatar?: string;
  };
};

export function UserCard({ user }: UserCardProps) {
  return (
    <ThemedView style={styles.card}>
      <Image
        source={
          user.avatar
            ? { uri: user.avatar }
            : require("@/assets/images/default-avatar.png")
        }
        style={styles.avatar}
      />
      <View style={styles.info}>
        <ThemedText type="subtitle">
          {user.name || user.email.split("@")[0]}
        </ThemedText>
        <ThemedText>{user.email}</ThemedText>
        <ThemedText style={styles.role}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: "#395B64",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  role: {
    opacity: 0.7,
    fontSize: 14,
  },
  text: {
    color: "#DDE6ED",
  },
});
