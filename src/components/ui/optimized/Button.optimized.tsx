/**
 * 最適化版統一ボタンコンポーネント - Phase 10: パフォーマンス最適化
 *
 * 最適化内容:
 * - React.memo でコンポーネントメモ化
 * - useCallback でイベントハンドラーメモ化
 * - useMemo でスタイル計算メモ化
 * - 不要な再レンダリングの削減
 * - 条件付き処理の最適化
 */

import React, { useCallback, useMemo } from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
  Animated,
} from "react-native";
import { useTheme, useThemedStyles } from "../../context/ThemeContext";
import {
  useHapticFeedback,
  LearningHapticContext,
} from "../../hooks/useHapticFeedback";
import { useAnimations } from "../../hooks/useAnimations";
import {
  useAccessibility,
  useFocusManagement,
} from "../../hooks/useAccessibility";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends Omit<TouchableOpacityProps, "style"> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  style?: ViewStyle;
  textStyle?: TextStyle;
  // ハプティックフィードバック設定
  hapticFeedback?: LearningHapticContext | false;
  enableHaptics?: boolean;
  // アニメーション設定
  enableAnimations?: boolean;
  animatePress?: boolean;
  // アクセシビリティ設定
  accessibilityHint?: string;
  focusable?: boolean;
  elementId?: string;
}

// 特定用途向けボタンのメモ化コンポーネント
const MemoizedSubmitButton = React.memo<
  Omit<ButtonProps, "variant" | "hapticFeedback">
>((props) => (
  <ButtonOptimized
    variant="primary"
    size="large"
    fullWidth
    hapticFeedback="question_submit"
    accessibilityHint="解答を送信します"
    elementId="submit-button"
    {...props}
  />
));

const MemoizedNextQuestionButton = React.memo<
  Omit<ButtonProps, "variant" | "hapticFeedback">
>((props) => (
  <ButtonOptimized
    variant="secondary"
    hapticFeedback="navigation"
    accessibilityHint="次の問題に進みます"
    elementId="next-question-button"
    {...props}
  />
));

const MemoizedReviewButton = React.memo<
  Omit<ButtonProps, "variant" | "hapticFeedback">
>((props) => (
  <ButtonOptimized
    variant="outline"
    hapticFeedback="navigation"
    accessibilityHint="復習を開始します"
    elementId="review-button"
    {...props}
  />
));

const MemoizedMockExamButton = React.memo<
  Omit<ButtonProps, "variant" | "hapticFeedback">
>((props) => (
  <ButtonOptimized
    variant="primary"
    size="large"
    hapticFeedback="navigation"
    accessibilityHint="模擬試験を開始します"
    elementId="mock-exam-button"
    {...props}
  />
));

const MemoizedCancelButton = React.memo<
  Omit<ButtonProps, "variant" | "hapticFeedback">
>((props) => (
  <ButtonOptimized
    variant="ghost"
    hapticFeedback={false}
    accessibilityHint="操作をキャンセルします"
    elementId="cancel-button"
    {...props}
  />
));

const MemoizedDeleteButton = React.memo<
  Omit<ButtonProps, "variant" | "hapticFeedback">
>((props) => (
  <ButtonOptimized
    variant="danger"
    hapticFeedback="form_validation"
    accessibilityHint="注意: このアクションは元に戻せません"
    elementId="delete-button"
    {...props}
  />
));

const ButtonOptimized = React.memo<ButtonProps>(
  ({
    title,
    variant = "primary",
    size = "medium",
    loading = false,
    disabled = false,
    fullWidth = false,
    icon,
    iconPosition = "left",
    style,
    textStyle,
    onPress,
    hapticFeedback = "button_press",
    enableHaptics = true,
    enableAnimations = true,
    animatePress = true,
    accessibilityHint,
    focusable = true,
    elementId,
    ...props
  }) => {
    const { theme } = useTheme();
    const styles = useThemedStyles(createStyles);
    const { learningFeedback } = useHapticFeedback();
    const { useScaleAnimation } = useAnimations();
    const { scale, pulseScale } = useScaleAnimation();

    // アクセシビリティフック
    const {
      isScreenReaderEnabled,
      isReduceMotionEnabled,
      getAccessibilityProps,
      announceForScreenReader,
    } = useAccessibility();

    const { getFocusStyle, setFocus, clearFocus } = useFocusManagement();

    // 状態の計算をメモ化
    const isDisabled = useMemo(() => disabled || loading, [disabled, loading]);

    // イベントハンドラーのメモ化
    const handlePress = useCallback(
      async (event: any) => {
        if (!isDisabled && onPress) {
          // アニメーション実行（Reduce Motion対応）
          if (enableAnimations && animatePress && !isReduceMotionEnabled) {
            pulseScale().start();
          }

          // ハプティックフィードバック実行
          if (enableHaptics && hapticFeedback !== false) {
            await learningFeedback(hapticFeedback);
          }

          // スクリーンリーダー用フィードバック
          if (isScreenReaderEnabled && variant === "primary") {
            announceForScreenReader(`${title}ボタンを押しました`);
          }

          onPress(event);
        }
      },
      [
        isDisabled,
        onPress,
        enableAnimations,
        animatePress,
        isReduceMotionEnabled,
        pulseScale,
        enableHaptics,
        hapticFeedback,
        learningFeedback,
        isScreenReaderEnabled,
        variant,
        title,
        announceForScreenReader,
      ],
    );

    // フォーカス管理のメモ化
    const handleFocus = useCallback(() => {
      if (elementId) {
        setFocus(elementId);
      }
    }, [elementId, setFocus]);

    const handleBlur = useCallback(() => {
      if (elementId) {
        clearFocus();
      }
    }, [elementId, clearFocus]);

    // スタイルの計算をメモ化
    const buttonStyle = useMemo((): ViewStyle => {
      const baseStyle = [
        styles.button,
        styles[`button_${variant}`],
        styles[`button_${size}`],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
      ];

      // フォーカス状態の追加
      const focusStyle = elementId ? getFocusStyle(elementId) : {};

      return StyleSheet.flatten([baseStyle, focusStyle, style]);
    }, [
      styles,
      variant,
      size,
      fullWidth,
      isDisabled,
      elementId,
      getFocusStyle,
      style,
    ]);

    const textStyleComputed = useMemo(() => {
      const baseStyle = [
        styles.text,
        styles[`text_${variant}`],
        styles[`text_${size}`],
        isDisabled && styles.textDisabled,
      ];

      return StyleSheet.flatten([baseStyle, textStyle]);
    }, [styles, variant, size, isDisabled, textStyle]);

    // コンテンツレンダリングのメモ化
    const renderedContent = useMemo(() => {
      if (loading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={
                variant === "primary"
                  ? theme.colors.background
                  : theme.colors.primary
              }
            />
            <Text style={[textStyleComputed, styles.loadingText]}>{title}</Text>
          </View>
        );
      }

      if (icon) {
        return (
          <View
            style={[
              styles.contentContainer,
              iconPosition === "right" && styles.contentReverse,
            ]}
          >
            {icon}
            <Text style={textStyleComputed}>{title}</Text>
          </View>
        );
      }

      return <Text style={textStyleComputed}>{title}</Text>;
    }, [
      loading,
      icon,
      iconPosition,
      title,
      styles,
      textStyleComputed,
      variant,
      theme.colors,
    ]);

    // アクセシビリティプロパティのメモ化
    const accessibilityProps = useMemo(
      () =>
        getAccessibilityProps(
          title,
          accessibilityHint || (loading ? "読み込み中" : undefined),
          "button",
        ),
      [getAccessibilityProps, title, accessibilityHint, loading],
    );

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={buttonStyle}
          onPress={handlePress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={isDisabled}
          focusable={focusable && !isDisabled}
          accessibilityState={{
            disabled: isDisabled,
            busy: loading,
            selected: false,
          }}
          {...accessibilityProps}
          {...props}
        >
          {renderedContent}
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

ButtonOptimized.displayName = "ButtonOptimized";

// スタイル作成関数のメモ化
const createStyles = (theme: any) =>
  StyleSheet.create({
    button: {
      borderRadius: theme.spacing.sm,
      justifyContent: "center",
      alignItems: "center",
      minHeight: 44, // アクセシビリティ対応
      ...theme.shadows.small,
    },

    // サイズバリエーション
    button_small: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    button_medium: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
    },
    button_large: {
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.xl,
    },

    // バリアントスタイル
    button_primary: {
      backgroundColor: theme.colors.primary,
      borderWidth: 0,
    },
    button_secondary: {
      backgroundColor: theme.colors.secondary,
      borderWidth: 0,
    },
    button_outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    button_ghost: {
      backgroundColor: "transparent",
      borderWidth: 0,
    },
    button_danger: {
      backgroundColor: theme.colors.error,
      borderWidth: 0,
    },

    // テキストスタイル
    text: {
      fontWeight: "600",
      textAlign: "center",
    },

    text_small: {
      fontSize: theme.typography.button.fontSize,
      lineHeight: theme.typography.button.lineHeight,
    },
    text_medium: {
      fontSize: theme.typography.button.fontSize,
      lineHeight: theme.typography.button.lineHeight,
    },
    text_large: {
      fontSize: theme.typography.buttonLarge.fontSize,
      lineHeight: theme.typography.buttonLarge.lineHeight,
    },

    // テキストカラーバリエーション
    text_primary: {
      color: theme.colors.background,
    },
    text_secondary: {
      color: theme.colors.background,
    },
    text_outline: {
      color: theme.colors.primary,
    },
    text_ghost: {
      color: theme.colors.primary,
    },
    text_danger: {
      color: theme.colors.background,
    },

    // 状態スタイル
    disabled: {
      opacity: 0.6,
      backgroundColor: theme.colors.textDisabled,
      borderColor: theme.colors.textDisabled,
    },
    textDisabled: {
      color: theme.colors.textSecondary,
    },

    // レイアウト
    fullWidth: {
      width: "100%",
    },

    // アイコン付きボタン
    contentContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    contentReverse: {
      flexDirection: "row-reverse",
    },

    // ローディング状態
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    loadingText: {
      opacity: 0.7,
    },
  });

/**
 * エクスポート用の最適化されたボタンコンポーネント
 */

// 解答送信ボタン
export const SubmitButton = MemoizedSubmitButton;
SubmitButton.displayName = "SubmitButton";

// 次の問題ボタン
export const NextQuestionButton = MemoizedNextQuestionButton;
NextQuestionButton.displayName = "NextQuestionButton";

// 復習開始ボタン
export const ReviewButton = MemoizedReviewButton;
ReviewButton.displayName = "ReviewButton";

// 模試開始ボタン
export const MockExamButton = MemoizedMockExamButton;
MockExamButton.displayName = "MockExamButton";

// キャンセルボタン
export const CancelButton = MemoizedCancelButton;
CancelButton.displayName = "CancelButton";

// 削除ボタン
export const DeleteButton = MemoizedDeleteButton;
DeleteButton.displayName = "DeleteButton";

export default ButtonOptimized;
