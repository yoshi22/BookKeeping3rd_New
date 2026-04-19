/**
 * セッション結果画面コンポーネント
 * 10問完了後に表示される結果サマリーと次のアクション
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme, useThemedStyles, type Theme } from "@/context/ThemeContext";
import { usePurchase } from "@/context/PurchaseContext";
import { AppIcon, IconContextSizes } from "@/theme/icons";
import type { SessionResult } from "@/types/monetization";
import { REMOVE_ADS_DISPLAY_PRICE } from "@/config/monetization";
import { logRemoveAdsCTAClicked } from "@/services/analytics-service";

/**
 * SessionResultScreenのProps
 */
interface SessionResultScreenProps {
  /** セッション結果 */
  result: SessionResult;
  /** 次のセッションへボタン押下時 */
  onNextSession: () => void;
  /** 終了ボタン押下時 */
  onFinish: () => void;
  /** 広告削除購入ボタン押下時 */
  onPurchaseRemoveAds?: () => void;
}

/**
 * 時間をフォーマット（分:秒）
 */
function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}分${seconds.toString().padStart(2, "0")}秒`;
}

/**
 * 正答率に応じたメッセージを取得
 */
function getResultMessage(accuracy: number): {
  title: string;
  message: string;
  icon: "trophy" | "medal" | "achievement" | "study";
} {
  if (accuracy >= 90) {
    return {
      title: "素晴らしい！",
      message: "完璧に近い成績です。この調子で続けましょう！",
      icon: "trophy",
    };
  } else if (accuracy >= 70) {
    return {
      title: "よくできました！",
      message: "しっかり理解できています。さらに練習を重ねましょう。",
      icon: "medal",
    };
  } else if (accuracy >= 50) {
    return {
      title: "まずまずです",
      message: "間違えた問題を復習して理解を深めましょう。",
      icon: "achievement",
    };
  } else {
    return {
      title: "もう少し頑張りましょう",
      message: "基礎から復習することをおすすめします。",
      icon: "study",
    };
  }
}

/**
 * セッション結果画面コンポーネント
 */
export function SessionResultScreen({
  result,
  onNextSession,
  onFinish,
  onPurchaseRemoveAds,
}: SessionResultScreenProps): React.ReactElement {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { isPremium } = usePurchase();

  const resultMessage = getResultMessage(result.accuracy);

  const handlePurchasePress = () => {
    logRemoveAdsCTAClicked("session_result");
    onPurchaseRemoveAds?.();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* 結果アイコンとメッセージ */}
      <View style={styles.headerSection}>
        <View style={styles.iconContainer}>
          <AppIcon
            name={resultMessage.icon}
            size={IconContextSizes.hero}
            color={theme.colors.primary}
          />
        </View>
        <Text style={styles.title}>{resultMessage.title}</Text>
        <Text style={styles.subtitle}>{resultMessage.message}</Text>
      </View>

      {/* 結果サマリー */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>解答数</Text>
          <Text style={styles.summaryValue}>{result.totalQuestions}問</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>正解数</Text>
          <Text style={[styles.summaryValue, styles.correctText]}>
            {result.correctAnswers}問
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>不正解数</Text>
          <Text style={[styles.summaryValue, styles.incorrectText]}>
            {result.incorrectAnswers}問
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>正答率</Text>
          <Text style={styles.accuracyValue}>{result.accuracy}%</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>所要時間</Text>
          <Text style={styles.summaryValue}>
            {formatTime(result.totalTimeMs)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>1問あたり平均</Text>
          <Text style={styles.summaryValue}>
            {Math.round(result.averageTimeMs / 1000)}秒
          </Text>
        </View>
      </View>

      {/* 広告削除カード（非プレミアムユーザーのみ） */}
      {!isPremium && onPurchaseRemoveAds && (
        <View style={styles.removeAdsCard}>
          <View style={styles.removeAdsHeader}>
            <AppIcon
              name="badge"
              size={IconContextSizes.listItem}
              color={theme.colors.primary}
            />
            <Text style={styles.removeAdsTitle}>集中モードで学習効率UP</Text>
          </View>
          <Text style={styles.removeAdsDescription}>
            広告を削除して、より集中して学習に取り組めます。
          </Text>
          <TouchableOpacity
            style={styles.removeAdsButton}
            onPress={handlePurchasePress}
            testID="session-result-purchase-button"
          >
            <Text style={styles.removeAdsButtonText}>
              広告を削除（{REMOVE_ADS_DISPLAY_PRICE}）
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* アクションボタン */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onNextSession}
          testID="session-result-next-button"
        >
          <AppIcon
            name="forward"
            size={IconContextSizes.button}
            color="white"
          />
          <Text style={styles.primaryButtonText}>次の10問へ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onFinish}
          testID="session-result-finish-button"
        >
          <Text style={styles.secondaryButtonText}>終了する</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      padding: 20,
      paddingBottom: 40,
    },
    headerSection: {
      alignItems: "center",
      marginBottom: 30,
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 24,
    },
    summaryCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
      ...theme.shadows.medium,
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
    },
    summaryLabel: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    summaryValue: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
    },
    correctText: {
      color: theme.colors.success,
    },
    incorrectText: {
      color: theme.colors.error,
    },
    accuracyValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.borderLight,
      marginVertical: 10,
    },
    removeAdsCard: {
      backgroundColor: theme.colors.primaryLight,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    removeAdsHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    removeAdsTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginLeft: 8,
    },
    removeAdsDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 12,
    },
    removeAdsButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
    },
    removeAdsButtonText: {
      color: theme.colors.surface,
      fontSize: 14,
      fontWeight: "600",
    },
    actionSection: {
      marginTop: 10,
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    primaryButtonText: {
      color: theme.colors.surface,
      fontSize: 18,
      fontWeight: "600",
      marginLeft: 8,
    },
    secondaryButton: {
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    },
    secondaryButtonText: {
      color: theme.colors.textSecondary,
      fontSize: 16,
    },
  });

export default SessionResultScreen;
