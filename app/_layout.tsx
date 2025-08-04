import { Stack } from 'expo-router';
import React from 'react';
import 'expo-dev-client';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}