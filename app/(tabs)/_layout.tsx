import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { ThemeProvider, useTheme } from '../../src/context/ThemeContext';

function TabLayout() {
  const { theme } = useTheme();

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
          paddingBottom: theme.spacing.sm,
          height: 60,
          ...theme.shadows.small,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.caption.fontSize,
          fontWeight: '600',
          marginTop: theme.spacing.xs,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
          shadowColor: theme.colors.primary,
          elevation: 4,
        },
        headerTintColor: theme.colors.background,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: theme.typography.h5.fontSize,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'ホーム',
          headerTitle: '簿記3級 確実復習',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="learning"
        options={{
          title: '学習',
          headerTitle: '学習',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="book" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: '復習',
          headerTitle: '復習',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="refresh" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: '統計',
          headerTitle: '学習統計',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="bar-chart" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabBarIcon(props: {
  name: string;
  color: string;
  focused: boolean;
}) {
  const { theme } = useTheme();
  
  const iconMap: { [key: string]: string } = {
    home: '🏠',
    book: '📚',
    refresh: '🔄',
    'bar-chart': '📊',
  };

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 44,
        minHeight: 32,
        borderRadius: theme.spacing.sm,
        backgroundColor: props.focused 
          ? `${theme.colors.primary}20` 
          : 'transparent',
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
        {iconMap[props.name] || '📱'}
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