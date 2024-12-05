import React from "react";
import { Image, StyleSheet, ImageSourcePropType } from "react-native";

interface AvatarProps {
  source: ImageSourcePropType;
  size?: number;
}

export function Avatar({ source, size = 50 }: AvatarProps) {
  return (
    <Image
      source={source}
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  avatar: {
    // backgroundColor: "#e1e1e1",
  },
});
