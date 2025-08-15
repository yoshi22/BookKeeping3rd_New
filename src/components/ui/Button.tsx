/**
 * 統一ボタンコンポーネント
 * 簿記3級問題集アプリ - Step 5.1: UIコンポーネント改善
 *
 * レスポンシブ・アクセシブル・テーマ対応・ハプティック対応のボタン
 */

import React from "react";
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
  // アクセシビリティ設定（Phase 1）
  accessibilityHint?: string;
  focusable?: boolean;
  elementId?: string; // フォーカス管理用
}

export function Button({
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
}: ButtonProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { learningFeedback } = useHapticFeedback();
  const { useScaleAnimation } = useAnimations();
  const { scale, pulseScale } = useScaleAnimation();

  // アクセシビリティフック（Phase 1）
  const {
    isScreenReaderEnabled,
    isReduceMotionEnabled,
    getAccessibilityProps,
    announceForScreenReader,
  } = useAccessibility();

  const { getFocusStyle, setFocus, clearFocus } = useFocusManagement();

  const isDisabled = disabled || loading;

  const handlePress = async (event: any) => {
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
  };

  // フォーカス管理
  const handleFocus = () => {
    if (elementId) {
      setFocus(elementId);
    }
  };

  const handleBlur = () => {
    if (elementId) {
      clearFocus();
    }
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = [
      styles.button,
      styles[`button_${variant}`],
      styles[`button_${size}`],
      fullWidth && styles.fullWidth,
      isDisabled && styles.disabled,
    ];

    // フォーカス状態の追加（Phase 1アクセシビリティ）
    const focusStyle = elementId ? getFocusStyle(elementId) : {};

    return StyleSheet.flatten([baseStyle, focusStyle, style]);
  };

  const getTextStyle = (): any => {
    const baseStyle = [
      styles.text,
      styles[`text_${variant}`],
      styles[`text_${size}`],
      isDisabled && styles.textDisabled,
    ];

    return StyleSheet.flatten([baseStyle, textStyle as any]);
  };

  const renderContent = () => {
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
          <Text style={[getTextStyle(), styles.loadingText]}>{title}</Text>
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
          <Text style={getTextStyle()}>{title}</Text>
        </View>
      );
    }

    return <Text style={getTextStyle()}>{title}</Text>;
  };

  // アクセシビリティプロパティの生成（Phase 1）
  const accessibilityProps = getAccessibilityProps(
    title,
    accessibilityHint || (loading ? "読み込み中" : undefined),
    "button",
  );

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={getButtonStyle()}
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
        {renderContent()}
      </TouchableOpacity>
    </Animated.View>
  );
}

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
 * 特定用途向けのボタンコンポーネント（ハプティック対応）
 */

// 解答送信ボタン
export function SubmitButton(
  props: Omit<ButtonProps, "variant" | "hapticFeedback">,
) {
  return (
    <Button
      variant="primary"
      size="large"
      fullWidth
      hapticFeedback="question_submit"
      accessibilityHint="解答を送信します"
      elementId="submit-button"
      {...props}
    />
  );
}

// 次の問題ボタン
export function NextQuestionButton(
  props: Omit<ButtonProps, "variant" | "hapticFeedback">,
) {
  return (
    <Button
      variant="secondary"
      hapticFeedback="navigation"
      accessibilityHint="次の問題に進みます"
      elementId="next-question-button"
      {...props}
    />
  );
}

// 復習開始ボタン
export function ReviewButton(
  props: Omit<ButtonProps, "variant" | "hapticFeedback">,
) {
  return (
    <Button
      variant="outline"
      hapticFeedback="navigation"
      accessibilityHint="復習を開始します"
      elementId="review-button"
      {...props}
    />
  );
}

// 模試開始ボタン
export function MockExamButton(
  props: Omit<ButtonProps, "variant" | "hapticFeedback">,
) {
  return (
    <Button
      variant="primary"
      size="large"
      hapticFeedback="navigation"
      accessibilityHint="模擬試験を開始します"
      elementId="mock-exam-button"
      {...props}
    />
  );
}

// キャンセルボタン
export function CancelButton(
  props: Omit<ButtonProps, "variant" | "hapticFeedback">,
) {
  return (
    <Button
      variant="ghost"
      hapticFeedback={false} // キャンセルボタンはハプティック無効
      accessibilityHint="操作をキャンセルします"
      elementId="cancel-button"
      {...props}
    />
  );
}

// 削除ボタン
export function DeleteButton(
  props: Omit<ButtonProps, "variant" | "hapticFeedback">,
) {
  return (
    <Button
      variant="danger"
      hapticFeedback="form_validation" // 警告的なフィードバック
      accessibilityHint="注意: このアクションは元に戻せません"
      elementId="delete-button"
      {...props}
    />
  );
}
