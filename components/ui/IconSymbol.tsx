import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleProp, ViewStyle } from "react-native";

// Mapping SF Symbol names to MaterialIcons names
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chart.bar": "bar-chart",
  "person.3": "people",
  "person.2": "groups",
  calendar: "calendar-today",
  "person.circle": "account-circle",
  book: "book",
  "list.bullet": "list",
  star: "star",
  "person.badge.check": "how-to-reg",
  "bubble.left.and.bubble.right": "forum",
  "plus.circle": "add-circle",
  plus: "add",
  "arrow.up": "arrow-upward",
  "arrow.down": "arrow-downward",
  "bubble.left": "chat-bubble",
  send: "send",
} as const;

type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <MaterialIcons
      name={MAPPING[name] || "error"}
      size={size}
      color={color}
      style={style}
    />
  );
}

// // This file is a fallback for using MaterialIcons on Android and web.

// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import { SymbolWeight } from 'expo-symbols';
// import React from 'react';
// import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';

// // Add your SFSymbol to MaterialIcons mappings here.
// const MAPPING = {
//   // See MaterialIcons here: https://icons.expo.fyi
//   // See SF Symbols in the SF Symbols app on Mac.
//   'house.fill': 'home',
//   'paperplane.fill': 'send',
//   'chevron.left.forwardslash.chevron.right': 'code',
//   'chevron.right': 'chevron-right',
// } as Partial<
//   Record<
//     import('expo-symbols').SymbolViewProps['name'],
//     React.ComponentProps<typeof MaterialIcons>['name']
//   >
// >;

// export type IconSymbolName = keyof typeof MAPPING;

// /**
//  * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
//  *
//  * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
//  */
// export function IconSymbol({
//   name,
//   size = 24,
//   color,
//   style,
// }: {
//   name: IconSymbolName;
//   size?: number;
//   color: string | OpaqueColorValue;
//   style?: StyleProp<ViewStyle>;
//   weight?: SymbolWeight;
// }) {
//   return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
// }
