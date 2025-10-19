import React, { useMemo } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import {
  Screen,
  Container,
  Flex,
} from "../../src/components/layout/ResponsiveLayout";
import {
  useTheme,
  useThemedStyles,
  type Theme,
} from "../../src/context/ThemeContext";
import { TypographyUtils } from "../../src/theme/typography";
import QuickActionIcon from "../../src/components/ui/QuickActionIcon";

type QuickAction = {
  key: string;
  title: string;
  description: string;
  icon: "learning" | "review" | "statistics";
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  route: string;
  testID: string;
};

const hexToRgb = (hex: string) => {
  const value = hex.replace("#", "");
  const normalized =
    value.length === 3
      ? value
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : value.substring(0, 6);
  const parsed = parseInt(normalized, 16);
  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
};

const withOpacity = (hex: string, alphaHex: string) => {
  const { r, g, b } = hexToRgb(hex);
  const alpha = parseInt(alphaHex, 16) / 255;
  return `rgba(${r}, ${g}, ${b}, ${Number.isFinite(alpha) ? alpha.toFixed(3) : "1"})`;
};

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const quickActions = useMemo<QuickAction[]>(
    () => [
      {
        key: "learning",
        title: "学習モード",
        description: "カテゴリー別に基礎から実戦まで体系的に学習",
        icon: "learning",
        primaryColor: theme.colors.primary,
        secondaryColor: theme.colors.secondary,
        backgroundColor: withOpacity(theme.colors.primary, "12"),
        route: "/learning",
        testID: "home-learning-button",
      },
      {
        key: "review",
        title: "重点復習",
        description: "復習リストから弱点問題をピックアップ",
        icon: "review",
        primaryColor: theme.colors.secondary,
        secondaryColor: theme.colors.primary,
        backgroundColor: withOpacity(theme.colors.secondary, "12"),
        route: "/review",
        testID: "home-review-button",
      },
      {
        key: "statistics",
        title: "統計・進捗",
        description: "正答率や学習時間の推移をダッシュボードで確認",
        icon: "statistics",
        primaryColor: theme.colors.primary,
        secondaryColor: theme.colors.secondary,
        backgroundColor: withOpacity(theme.colors.primary, "12"),
        route: "/review",
        testID: "home-statistics-button",
      },
    ],
    [theme.colors.primary, theme.colors.secondary],
  );

  return (
    <Screen
      safeArea={true}
      statusBarStyle="dark-content"
      scrollable={true}
      testID="home-screen"
    >
      <Container style={styles.container}>
        <Flex style={styles.mainContent} gap={theme.spacing["3xl"]}>
          <View style={styles.heroCard}>
            <View style={styles.heroHeader}>
              <View style={styles.heroIconWrapper}>
                <QuickActionIcon
                  type="learning"
                  primaryColor={theme.colors.surface}
                  secondaryColor={theme.colors.secondary}
                  backgroundColor={withOpacity(theme.colors.surface, "12")}
                  size={56}
                />
              </View>
              <View style={styles.heroTextGroup}>
                <Text
                  style={styles.heroTitle}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.8}
                >
                  簿記3級「確実復習」
                </Text>
                <Text
                  style={styles.heroSubtitle}
                  numberOfLines={2}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.85}
                >
                  間違えた問題を記録しながら、スキマ時間でも合格力を高める学習アプリ
                </Text>
              </View>
            </View>
            <View style={styles.heroFooter}>
              <View style={styles.heroChip}>
                <Text style={styles.heroChipText}>
                  学習370問 / 復習リスト自動更新
                </Text>
              </View>
            </View>
          </View>

          <Flex gap={theme.spacing.lg} style={styles.menuContainer}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.key}
                style={styles.menuButton}
                onPress={() => router.push(action.route)}
                accessibilityLabel={action.title}
                testID={action.testID}
              >
                <QuickActionIcon
                  type={action.icon}
                  primaryColor={action.primaryColor}
                  secondaryColor={action.secondaryColor}
                  backgroundColor={action.backgroundColor}
                  size={48}
                />
                <View style={styles.menuTextGroup}>
                  <Text style={styles.menuTitle}>{action.title}</Text>
                  <Text style={styles.menuDescription}>
                    {action.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </Flex>
        </Flex>
      </Container>
    </Screen>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
    },
    mainContent: {
      width: "100%",
      maxWidth: 420,
      paddingVertical: theme.spacing.xl,
      paddingBottom: theme.spacing["4xl"],
    },
    heroCard: {
      width: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.spacing["2xl"],
      padding: theme.spacing["2xl"],
      gap: theme.spacing.xl,
    },
    heroHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.spacing.lg,
    },
    heroIconWrapper: {
      width: 56,
      height: 56,
      borderRadius: theme.spacing.lg,
      alignItems: "center",
      justifyContent: "center",
    },
    heroTextGroup: {
      flex: 1,
      gap: theme.spacing.sm,
    },
    heroTitle: {
      ...TypographyUtils.getTextStyle("h3"),
      color: theme.colors.surface,
    },
    heroSubtitle: {
      ...TypographyUtils.getTextStyle("body2"),
      color: withOpacity(theme.colors.surface, "CC"),
    },
    heroFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.md,
    },
    heroChip: {
      backgroundColor: withOpacity(theme.colors.surface, "1A"),
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.spacing.lg,
    },
    heroChipText: {
      ...TypographyUtils.getTextStyle("caption"),
      color: theme.colors.surface,
      fontWeight: "600",
    },
    heroButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.spacing.lg,
      backgroundColor: theme.colors.secondary,
      shadowColor: "rgba(0, 0, 0, 0.15)",
      shadowOpacity: 0.6,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 16,
      elevation: 8,
    },
    heroButtonIcon: {
      marginRight: theme.spacing.xs,
    },
    heroButtonText: {
      ...TypographyUtils.getTextStyle("button"),
      color: theme.colors.surface,
    },
    menuContainer: {
      width: "100%",
      gap: theme.spacing.lg,
    },
    menuButton: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.spacing["2xl"],
      paddingHorizontal: theme.spacing["2xl"],
      paddingVertical: theme.spacing.xl,
      borderWidth: 1,
      borderColor: withOpacity(theme.colors.border, "33"),
      shadowColor: "rgba(17, 24, 28, 0.08)",
      shadowOpacity: 1,
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 24,
      elevation: 6,
    },
    menuTextGroup: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    menuTitle: {
      ...TypographyUtils.getTextStyle("h6"),
      color: theme.colors.text,
    },
    menuDescription: {
      ...TypographyUtils.getTextStyle("body2"),
      color: theme.colors.textSecondary,
    },
  });
