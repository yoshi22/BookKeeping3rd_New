import { Tabs } from "expo-router";
import React from "react";
import { Text, View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../../src/context/ThemeContext";

function TabLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  // iOS下部SafeArea対応: 必要最小限の計算
  const tabBarBottomPadding =
    Platform.OS === "ios"
      ? Math.max(insets.bottom, 8) // 最小8pt、過剰な保証を削減
      : theme.spacing.xs;

  const tabBarHeight =
    Platform.OS === "ios"
      ? 60 + tabBarBottomPadding // 基本高さ + 最小SafeArea
      : 60;

  // デバッグログ
  if (__DEV__ && Platform.OS === "ios") {
    console.log("TabBar SafeArea Debug:", {
      insetsBottom: insets.bottom,
      tabBarBottomPadding,
      tabBarHeight,
    });
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingTop: theme.spacing.xs,
          paddingBottom: tabBarBottomPadding,
          height: tabBarHeight,
          ...theme.shadows.small,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.caption.fontSize,
          fontWeight: "600",
          marginTop: theme.spacing.xs,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
          shadowColor: theme.colors.primary,
          elevation: 4,
        },
        headerTintColor: theme.colors.background,
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: theme.typography.h5.fontSize,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "ホーム",
          headerShown: false, // ヘッダー非表示
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="learning"
        options={{
          title: "学習",
          headerShown: false, // ヘッダー非表示
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="book" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: "復習",
          headerShown: false, // ヘッダー非表示
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="refresh" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "統計",
          headerShown: false, // ヘッダー非表示
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="bar-chart" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "設定",
          headerShown: false, // ヘッダー非表示
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="settings" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabBarIcon(props: { name: string; color: string; focused: boolean }) {
  const { theme } = useTheme();

  const iconMap: { [key: string]: string } = {
    home: "🏠",
    book: "📚",
    refresh: "🔄",
    "bar-chart": "📊",
    settings: "⚙️",
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        minWidth: 44,
        minHeight: 32,
        borderRadius: theme.spacing.sm,
        backgroundColor: props.focused
          ? `${theme.colors.primary}20`
          : "transparent",
        paddingHorizontal: theme.spacing.sm,
      }}
      accessible={true}
      accessibilityRole="tab"
      accessibilityState={{ selected: props.focused }}
    >
      <Text
        style={{
          color: props.color,
          fontSize: 24,
          transform: props.focused ? [{ scale: 1.1 }] : [{ scale: 1 }],
        }}
      >
        {iconMap[props.name] || "📱"}
      </Text>
    </View>
  );
}

export default function TabLayoutWithTheme() {
  return (
    <ThemeProvider>
      <TabLayout />
    </ThemeProvider>
  );
}
