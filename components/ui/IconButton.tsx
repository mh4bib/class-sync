import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { IconSymbol } from "./IconSymbol";

interface IconButtonProps {
  onPress: () => void;
  icon: string;
  size: number;
  color: string;
  style?: object;
}

export function IconButton({
  onPress,
  icon,
  size,
  color,
  style,
}: IconButtonProps) {
  return (
    <Pressable onPress={onPress} style={[styles.button, style]}>
      <IconSymbol name={icon} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
});
