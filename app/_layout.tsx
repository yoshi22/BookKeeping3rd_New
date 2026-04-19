import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../src/context/ThemeContext";
import { PurchaseProvider } from "../src/context/PurchaseContext";
import { AdProvider } from "../src/context/AdContext";
import "expo-dev-client";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <PurchaseProvider>
          <AdProvider>
            <StatusBar style="auto" />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="category/[categoryId]"
                options={{ headerShown: false }}
              />
            </Stack>
          </AdProvider>
        </PurchaseProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
