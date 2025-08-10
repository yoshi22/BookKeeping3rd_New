/**
 * 統一ボタンコンポーネント
 * 簿記3級問題集アプリ - Step 5.1: UIコンポーネント改善
 *
 * レスポンシブ・アクセシブル・テーマ対応のボタン
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
} from "react-native";
import { useTheme, useThemedStyles } from "../../context/ThemeContext";

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
  ...props
}: ButtonProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const isDisabled = disabled || loading;

  const handlePress = (event: any) => {
    if (!isDisabled && onPress) {
      onPress(event);
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

    return StyleSheet.flatten([baseStyle, style]);
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

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={handlePress}
      disabled={isDisabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={loading ? "読み込み中" : undefined}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
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
 * 特定用途向けのボタンコンポーネント
 */

// 解答送信ボタン
export function SubmitButton(props: Omit<ButtonProps, "variant">) {
  return <Button variant="primary" size="large" fullWidth {...props} />;
}

// 次の問題ボタン
export function NextQuestionButton(props: Omit<ButtonProps, "variant">) {
  return <Button variant="secondary" {...props} />;
}

// 復習開始ボタン
export function ReviewButton(props: Omit<ButtonProps, "variant">) {
  return <Button variant="outline" {...props} />;
}

// 模試開始ボタン
export function MockExamButton(props: Omit<ButtonProps, "variant">) {
  return <Button variant="primary" size="large" {...props} />;
}

// キャンセルボタン
export function CancelButton(props: Omit<ButtonProps, "variant">) {
  return <Button variant="ghost" {...props} />;
}

// 削除ボタン
export function DeleteButton(props: Omit<ButtonProps, "variant">) {
  return <Button variant="danger" {...props} />;
}
