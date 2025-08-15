import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Screen } from "../../src/components/layout/ResponsiveLayout";
import { AppIcon, IconContextSizes } from "../../src/theme/icons";
import {
  useTheme,
  useThemedStyles,
  useColors,
  useDynamicColors,
  ThemeMode,
  CustomThemeVariant,
} from "../../src/context/ThemeContext";
import { confirmResetDatabase } from "../../src/utils/reset-database";
import { customThemeVariants } from "../../src/theme/colors";

export default function SettingsScreen() {
  // Phase 4: ダークモード対応のテーマシステム
  const { theme, isDark, getStatusBarStyle, themeMode, setThemeMode } =
    useTheme();
  const colors = useColors();
  const dynamicColors = useDynamicColors();
  const styles = useThemedStyles(createStyles);

  // カスタムテーマ選択モーダル状態
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(themeMode);

  // テーマ情報
  const themeOptions: Array<{
    key: ThemeMode;
    label: string;
    description: string;
  }> = [
    { key: "light", label: "ライトモード", description: "明るい背景のテーマ" },
    { key: "dark", label: "ダークモード", description: "暗い背景のテーマ" },
    { key: "system", label: "システム設定", description: "端末の設定に従う" },
  ];

  const customThemeOptions: Array<{
    key: keyof typeof customThemeVariants;
    label: string;
    description: string;
  }> = [
    {
      key: "oceanic",
      label: "オーシャニック",
      description: "海の青を基調とした爽やかなテーマ",
    },
    {
      key: "forest",
      label: "フォレスト",
      description: "森の緑を基調とした自然なテーマ",
    },
    {
      key: "sunset",
      label: "サンセット",
      description: "夕焼けの暖色を基調とした温かいテーマ",
    },
    {
      key: "professional",
      label: "プロフェッショナル",
      description: "落ち着いたグレーの洗練されたテーマ",
    },
    {
      key: "high-contrast",
      label: "ハイコントラスト",
      description: "高コントラストなアクセシブルテーマ",
    },
  ];

  const handleThemeChange = (mode: ThemeMode) => {
    setSelectedTheme(mode);
    setThemeMode(mode);
    setShowThemeModal(false);
  };

  return (
    <Screen
      safeArea={true}
      scrollable={true}
      statusBarStyle={getStatusBarStyle()}
      testID="settings-screen"
    >
      {/* アプリタイトル（ヘッダー代替） */}
      <View style={styles.headerSection}>
        <Text style={styles.appTitle}>設定</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* 復習システムの説明セクション */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppIcon
              name="learning"
              size={IconContextSizes.listItem}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>復習システムについて</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>効率的な学習のための仕組み</Text>
            <Text style={styles.description}>
              このアプリは、間違えた問題を効率的に復習できるよう設計されています。
            </Text>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>📝 復習対象になる条件</Text>
              <Text style={styles.infoText}>
                学習タブで問題に不正解した場合のみ、その問題が復習リストに追加されます。
                初回で正解した問題は復習対象になりません。
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>🎯 復習から外れる条件</Text>
              <Text style={styles.infoText}>
                復習タブで連続2回正解すると、その問題は「克服済み」となり、
                復習リストから自動的に削除されます。
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>⚡ 優先度の仕組み</Text>
              <Text style={styles.infoText}>
                誤答回数が多い問題ほど優先的に出題されます。 また、試算表 → 仕訳
                → 帳簿の順で重要度が設定されています。
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>📊 復習ステータス</Text>
              <Text style={styles.infoText}>
                • 通常復習：1回間違えた問題{"\n"}• 重点復習：2回以上間違えた問題
                {"\n"}• 克服済み：連続2回正解した問題（リストから削除）
              </Text>
            </View>
          </View>
        </View>

        {/* アプリ情報セクション */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppIcon
              name="info"
              size={IconContextSizes.listItem}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>アプリ情報</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>アプリ名</Text>
              <Text style={styles.infoValue}>簿記3級問題集「確実復習」</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>バージョン</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>データ保存</Text>
              <Text style={styles.infoValue}>端末内のみ（完全オフライン）</Text>
            </View>
          </View>
        </View>

        {/* データベース管理セクション */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppIcon
              name="debug"
              size={IconContextSizes.listItem}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>データベース管理</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>問題データのリセット</Text>
            <Text style={styles.description}>
              問題データを最新の状態にリセットします。
              全ての学習履歴も削除されますのでご注意ください。
            </Text>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={confirmResetDatabase}
              testID="settings-reset-database-button"
              accessibilityLabel="データベースをリセット"
            >
              <AppIcon
                name="reset"
                size={IconContextSizes.button}
                color="white"
              />
              <Text style={styles.resetButtonText}>データベースをリセット</Text>
            </TouchableOpacity>

            <Text style={styles.warningText}>⚠️ この操作は取り消せません</Text>
          </View>
        </View>

        {/* 学習のコツセクション */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppIcon
              name="help"
              size={IconContextSizes.listItem}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>効果的な学習のコツ</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>1.</Text>
              <Text style={styles.tipText}>
                まずは学習タブで新しい問題に挑戦し、基礎知識を身につけましょう。
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>2.</Text>
              <Text style={styles.tipText}>
                間違えた問題は自動的に復習リストに追加されるので、定期的に復習タブをチェックしましょう。
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>3.</Text>
              <Text style={styles.tipText}>
                復習で2回連続正解できたら、その問題は理解できたと判断されます。
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipNumber}>4.</Text>
              <Text style={styles.tipText}>
                模試機能で実力を確認し、本番に備えましょう。
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const createStyles = (
  theme: typeof import("../../src/context/ThemeContext").Theme,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      paddingBottom: 40,
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
      color: theme.colors.primary,
      textAlign: "center",
    },
    section: {
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
      paddingTop: 40, // 最初のセクションのみヘッダー分の余白
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      marginLeft: 10,
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 10,
      padding: 20,
      marginBottom: 20,
      ...theme.shadows.medium,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 10,
    },
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      marginBottom: 15,
    },
    infoItem: {
      marginVertical: 10,
    },
    infoLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 5,
    },
    infoText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      paddingLeft: 20,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    infoValue: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    tipItem: {
      flexDirection: "row",
      marginVertical: 8,
    },
    tipNumber: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginRight: 10,
      minWidth: 20,
    },
    tipText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      flex: 1,
    },
    resetButton: {
      backgroundColor: theme.colors.error,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 15,
      borderRadius: 8,
      marginTop: 20,
      marginBottom: 10,
    },
    resetButtonText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 8,
    },
    warningText: {
      fontSize: 12,
      color: theme.colors.error,
      textAlign: "center",
      marginTop: 5,
    },
  });
