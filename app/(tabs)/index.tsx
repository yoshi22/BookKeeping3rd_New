import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
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
    <Screen
      safeArea={true}
      statusBarStyle="dark-content"
      scrollable={true}
      testID="home-screen"
    >
      <Container style={styles.container}>
        <Flex
          align="center"
          justify="flex-start"
          gap={theme.spacing["4xl"]}
          style={styles.mainContent}
        >
          {/* アプリタイトルセクション */}
          <Flex align="center" gap={theme.spacing.md}>
            <Text
              style={[
                TypographyUtils.getTextStyle("h3"),
                { color: theme.colors.primary, textAlign: "center" },
              ]}
            >
              簿記3級問題集「確実復習」
            </Text>
            <Text
              style={[
                TypographyUtils.getTextStyle("body1"),
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
              testID="home-learning-button"
              accessibilityLabel="学習を開始"
            >
              <Text style={styles.menuIcon}>📚</Text>
              <Text
                style={[
                  TypographyUtils.getTextStyle("h6"),
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
              testID="home-review-button"
              accessibilityLabel="復習を開始"
            >
              <Text style={styles.menuIcon}>🔄</Text>
              <Text
                style={[
                  TypographyUtils.getTextStyle("h6"),
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
              testID="home-stats-button"
              accessibilityLabel="学習統計を確認"
            >
              <Text style={styles.menuIcon}>📊</Text>
              <Text
                style={[
                  TypographyUtils.getTextStyle("h6"),
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

            <TouchableOpacity
              style={[
                styles.menuButton,
                { backgroundColor: theme.colors.surface },
              ]}
              onPress={() => router.push("/mock-exam")}
              testID="home-mock-exam-button"
              accessibilityLabel="CBT模擬試験を開始"
            >
              <Text style={styles.menuIcon}>🎯</Text>
              <Text
                style={[
                  TypographyUtils.getTextStyle("h6"),
                  { color: theme.colors.text, marginBottom: theme.spacing.xs },
                ]}
              >
                CBT模擬試験
              </Text>
              <Text
                style={[
                  TypographyUtils.getTextStyle("body2"),
                  { color: theme.colors.textSecondary, textAlign: "center" },
                ]}
              >
                本番形式で実力試験
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuButton,
                { backgroundColor: theme.colors.surface },
              ]}
              onPress={() => router.push("/test-journal")}
              testID="home-test-journal-button"
              accessibilityLabel="仕訳フォームテストを開始"
            >
              <Text style={styles.menuIcon}>🧪</Text>
              <Text
                style={[
                  TypographyUtils.getTextStyle("h6"),
                  { color: theme.colors.text, marginBottom: theme.spacing.xs },
                ]}
              >
                仕訳フォームテスト
              </Text>
              <Text
                style={[
                  TypographyUtils.getTextStyle("body2"),
                  { color: theme.colors.textSecondary, textAlign: "center" },
                ]}
              >
                複数借方・貸方UI確認
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
    paddingVertical: 20,
    paddingTop: 40, // 上部のマージンを調整
    paddingBottom: 100, // 下部に十分なパディングを追加（タブバーのため）
  },
  menuContainer: {
    width: "100%",
    maxWidth: 400,
    paddingBottom: 20, // 下部に追加のパディング
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
