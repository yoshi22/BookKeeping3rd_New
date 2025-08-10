import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";
import JournalEntryDemo from "../src/components/mock-exam/JournalEntryDemo";

export default function TestJournalScreen() {
  const { theme } = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          title: "仕訳入力フォームテスト",
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.background,
        }}
      />
      <JournalEntryDemo />
    </>
  );
}
