import { Stack } from "expo-router";
import React from "react";
import { useTheme } from "../../../src/context/ThemeContext";

export default function ReviewLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.background,
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
        },
        headerShadowVisible: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false, // 復習メイン画面はヘッダーなし（タブ内）
        }}
      />
      <Stack.Screen
        name="question/[id]"
        options={{
          title: "復習問題",
          headerShown: true,
          headerBackTitle: "戻る",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
