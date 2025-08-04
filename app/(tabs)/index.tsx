import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {
  Screen,
  Container,
  Flex,
} from "../../src/components/layout/ResponsiveLayout";
import { useTheme } from "../../src/context/ThemeContext";
import { TypographyUtils } from "../../src/theme/typography";

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <Screen safeArea={true} statusBarStyle="dark-content">
      <Container style={styles.container}>
        <Flex
          align="center"
          justify="center"
          gap={theme.spacing["4xl"]}
          style={styles.mainContent}
        >
          {/* アプリタイトルセクション */}
          <Flex align="center" gap={theme.spacing.md}>
            <Text
              style={[
                TypographyUtils.getTextStyle("h2"),
                { color: theme.colors.primary, textAlign: "center" },
              ]}
            >
              簿記3級問題集「確実復習」
            </Text>
            <Text
              style={[
                TypographyUtils.getTextStyle("subtitle1"),
                { color: theme.colors.textSecondary, textAlign: "center" },
              ]}
            >
              間違えた問題を確実に潰す学習アプリ
            </Text>
          </Flex>

          {/* メニューセクション */}
          <Flex gap={theme.spacing.lg} style={styles.menuContainer}>
            <TouchableOpacity
              style={[
                styles.menuButton,
                { backgroundColor: theme.colors.surface },
              ]}
              onPress={() => router.push("/learning")}
            >
              <Text style={styles.menuIcon}>📚</Text>
              <Text
                style={[
                  TypographyUtils.getTextStyle("h5"),
                  { color: theme.colors.text, marginBottom: theme.spacing.xs },
                ]}
              >
                学習開始
              </Text>
              <Text
                style={[
                  TypographyUtils.getTextStyle("body2"),
                  { color: theme.colors.textSecondary, textAlign: "center" },
                ]}
              >
                問題を解いて基礎力アップ
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuButton,
                { backgroundColor: theme.colors.surface },
              ]}
              onPress={() => router.push("/review")}
            >
              <Text style={styles.menuIcon}>🔄</Text>
              <Text
                style={[
                  TypographyUtils.getTextStyle("h5"),
                  { color: theme.colors.text, marginBottom: theme.spacing.xs },
                ]}
              >
                復習
              </Text>
              <Text
                style={[
                  TypographyUtils.getTextStyle("body2"),
                  { color: theme.colors.textSecondary, textAlign: "center" },
                ]}
              >
                間違えた問題を重点的に
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuButton,
                { backgroundColor: theme.colors.surface },
              ]}
              onPress={() => router.push("/stats")}
            >
              <Text style={styles.menuIcon}>📊</Text>
              <Text
                style={[
                  TypographyUtils.getTextStyle("h5"),
                  { color: theme.colors.text, marginBottom: theme.spacing.xs },
                ]}
              >
                学習統計
              </Text>
              <Text
                style={[
                  TypographyUtils.getTextStyle("body2"),
                  { color: theme.colors.textSecondary, textAlign: "center" },
                ]}
              >
                進捗状況を確認
              </Text>
            </TouchableOpacity>
          </Flex>
        </Flex>
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    paddingVertical: 20, // 垂直パディングを削減
  },
  menuContainer: {
    width: "100%",
    maxWidth: 400,
  },
  menuButton: {
    padding: 24,
    borderRadius: 12,
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
    marginBottom: 12,
  },
});
