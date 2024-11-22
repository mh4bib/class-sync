import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";

interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  type?: "primary" | "secondary" | "danger";
  style?: any;
}

export function ThemedButton({
  title,
  onPress,
  type = "primary",
  style,
}: ThemedButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        type === "primary" && styles.primaryButton,
        type === "secondary" && styles.secondaryButton,
        type === "danger" && styles.dangerButton,
        style,
      ]}
      onPress={onPress}
    >
      <ThemedText style={styles.buttonText}>{title}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 100,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    backgroundColor: "#999",
  },
  dangerButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
