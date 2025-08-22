/**
 * 最適化版数字パッド - Phase 10: パフォーマンス最適化
 *
 * 最適化内容:
 * - React.memo でコンポーネントメモ化
 * - useCallback でイベントハンドラーメモ化
 * - useMemo でスタイル計算メモ化
 * - 不要な再レンダリングの削減
 */

import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { useTheme, type Theme } from "../../context/ThemeContext";

interface NumericPadProps {
  visible: boolean;
  value: string;
  onValueChange: (value: string) => void;
  onClose: () => void;
  placeholder?: string;
  label?: string;
  maxLength?: number;
}

// 数字ボタンデータのメモ化
const NUMERIC_BUTTONS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["0", ".", "delete"],
] as const;

const NumericPadOptimized = React.memo<NumericPadProps>(
  ({
    visible,
    value,
    onValueChange,
    onClose,
    placeholder = "金額を入力",
    label = "金額入力",
    maxLength = 10,
  }) => {
    const { theme } = useTheme();
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();

    // イベントハンドラーのメモ化
    const handleNumberPress = useCallback(
      (num: string) => {
        if (value.length < maxLength) {
          onValueChange(value + num);
        }
      },
      [value, maxLength, onValueChange],
    );

    const handleDelete = useCallback(() => {
      if (value.length > 0) {
        onValueChange(value.slice(0, -1));
      }
    }, [value, onValueChange]);

    const handleClear = useCallback(() => {
      onValueChange("");
    }, [onValueChange]);

    const handleDone = useCallback(() => {
      onClose();
    }, [onClose]);

    // スタイルのメモ化
    const styles = useMemo(
      () => createStyles(theme, screenWidth, screenHeight),
      [theme, screenWidth, screenHeight],
    );

    // 数字ボタンコンポーネントのメモ化
    const NumberButton = React.memo<{
      number: string;
      onPress: (num: string) => void;
    }>(({ number, onPress }) => {
      const handlePress = useCallback(() => {
        if (number === "delete") {
          handleDelete();
        } else if (number === ".") {
          if (!value.includes(".")) {
            onPress(number);
          }
        } else {
          onPress(number);
        }
      }, [number, onPress]);

      return (
        <TouchableOpacity
          style={[
            styles.numberButton,
            number === "delete" && styles.actionButton,
          ]}
          onPress={handlePress}
          activeOpacity={0.7}
          accessible
          accessibilityRole="button"
          accessibilityLabel={
            number === "delete"
              ? "削除"
              : number === "."
                ? "小数点"
                : `数字 ${number}`
          }
        >
          <Text
            style={[
              styles.numberText,
              number === "delete" && styles.actionText,
            ]}
          >
            {number === "delete" ? "←" : number}
          </Text>
        </TouchableOpacity>
      );
    });

    // 表示値のメモ化
    const displayValue = useMemo(
      () => value || placeholder,
      [value, placeholder],
    );

    // モーダルが非表示の場合は null を返してレンダリングをスキップ
    if (!visible) {
      return null;
    }

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.container}>
            {/* ヘッダー */}
            <View style={styles.header}>
              <Text style={styles.label}>{label}</Text>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                accessible
                accessibilityRole="button"
                accessibilityLabel="閉じる"
              >
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* 表示値 */}
            <View style={styles.displayContainer}>
              <Text
                style={[styles.displayText, !value && styles.placeholderText]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {displayValue}
              </Text>
            </View>

            {/* 数字パッド */}
            <View style={styles.padContainer}>
              {NUMERIC_BUTTONS.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {row.map((number) => (
                    <NumberButton
                      key={number}
                      number={number}
                      onPress={handleNumberPress}
                    />
                  ))}
                </View>
              ))}

              {/* アクションボタン */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.numberButton, styles.clearButton]}
                  onPress={handleClear}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="クリア"
                >
                  <Text style={[styles.numberText, styles.clearText]}>C</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.numberButton, styles.doneButton]}
                  onPress={handleDone}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="完了"
                >
                  <Text style={[styles.numberText, styles.doneText]}>完了</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    );
  },
);

NumericPadOptimized.displayName = "NumericPadOptimized";

// スタイル作成関数のメモ化
const createStyles = (
  theme: Theme,
  screenWidth: number,
  screenHeight: number,
) => {
  const buttonSize = Math.min(screenWidth / 4, 80);
  const isTablet = screenWidth > 768;

  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 20,
      maxHeight: screenHeight * 0.6,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    label: {
      fontSize: isTablet ? 20 : 18,
      fontWeight: "600",
      color: theme.colors.text,
    },
    closeButton: {
      padding: 8,
    },
    closeText: {
      fontSize: 24,
      color: theme.colors.textSecondary,
    },
    displayContainer: {
      padding: 20,
      alignItems: "center",
    },
    displayText: {
      fontSize: isTablet ? 32 : 28,
      fontWeight: "500",
      color: theme.colors.text,
      textAlign: "center",
      minHeight: 40,
    },
    placeholderText: {
      color: theme.colors.textSecondary,
    },
    padContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    actionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
    numberButton: {
      width: buttonSize,
      height: buttonSize,
      borderRadius: buttonSize / 2,
      backgroundColor: theme.colors.surface,
      borderWidth: 2,
      borderColor: theme.colors.border,
      justifyContent: "center",
      alignItems: "center",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    numberText: {
      fontSize: isTablet ? 24 : 20,
      fontWeight: "600",
      color: theme.colors.text,
    },
    actionButton: {
      backgroundColor: theme.colors.error,
      borderColor: theme.colors.error,
    },
    actionText: {
      color: theme.colors.onError,
    },
    clearButton: {
      backgroundColor: theme.colors.warning,
      borderColor: theme.colors.warning,
      flex: 0.4,
      width: "auto",
    },
    clearText: {
      color: theme.colors.onWarning,
    },
    doneButton: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      flex: 0.55,
      width: "auto",
    },
    doneText: {
      color: theme.colors.onPrimary,
    },
  });
};

export default NumericPadOptimized;
