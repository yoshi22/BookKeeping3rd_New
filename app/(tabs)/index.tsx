import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {
  Screen,
  Container,
} from "../../src/components/layout/ResponsiveLayout";
import { useTheme } from "../../src/context/ThemeContext";

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <Screen safeArea={true} statusBarStyle="dark-content">
      <Container style={styles.container}>
        {/* アプリタイトル（ヘッダー代替） */}
        <View style={styles.headerSection}>
          <Text style={styles.appTitle}>簿記3級 確実復習</Text>
        </View>

        <Text style={styles.title}>簿記3級問題集「確実復習」</Text>
        <Text style={styles.subtitle}>間違えた問題を確実に潰す学習アプリ</Text>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push("/learning")}
          >
            <Text style={styles.menuIcon}>📚</Text>
            <Text style={styles.menuTitle}>学習開始</Text>
            <Text style={styles.menuSubtitle}>問題を解いて基礎力アップ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push("/review")}
          >
            <Text style={styles.menuIcon}>🔄</Text>
            <Text style={styles.menuTitle}>復習</Text>
            <Text style={styles.menuSubtitle}>間違えた問題を重点的に</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push("/stats")}
          >
            <Text style={styles.menuIcon}>📊</Text>
            <Text style={styles.menuTitle}>学習統計</Text>
            <Text style={styles.menuSubtitle}>進捗状況を確認</Text>
          </TouchableOpacity>
        </View>
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  headerSection: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 1,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2f95dc",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2f95dc",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 40,
  },
  menuContainer: {
    width: "100%",
    maxWidth: 400,
  },
  menuButton: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
