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
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  primaryButton: {
    backgroundColor: "#526D82",
  },
  secondaryButton: {
    backgroundColor: "#9DB2BF",
  },
  dangerButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "#DDE6ED",
    fontSize: 16,
    fontWeight: "bold",
  },
});
