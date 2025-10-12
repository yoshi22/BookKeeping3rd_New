/**
 * 穴埋め問題用選択肢セレクター
 * CBT形式の試算表・財務諸表穴埋め問題で使用
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";
import {
  useTheme,
  useThemedStyles,
  useColors,
  useDynamicColors,
  type Theme,
} from "../../context/ThemeContext";

export interface BlankSelectorProps {
  /** 穴埋め箇所のインデックス */
  blankIndex: number;
  /** 選択肢の配列 */
  choices: (string | number)[];
  /** 現在選択されている選択肢のインデックス（未選択時はnull） */
  selectedIndex: number | null;
  /** 選択肢が選択されたときのコールバック */
  onSelect: (blankIndex: number, choiceIndex: number) => void;
  /** ヒントテキスト（オプション） */
  hint?: string;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** 選択ボタンのスタイル（オプション） */
  buttonStyle?: any;
  /** 無効化フラグ */
  disabled?: boolean;
}

export default function BlankSelector({
  blankIndex,
  choices,
  selectedIndex,
  onSelect,
  hint,
  placeholder = "選択してください",
  buttonStyle,
  disabled = false,
}: BlankSelectorProps) {
  const { theme } = useTheme();
  const colors = useColors();
  const dynamicColors = useDynamicColors();
  const styles = useThemedStyles(createStyles);

  const [modalVisible, setModalVisible] = useState(false);

  // 選択されている選択肢のテキストを取得
  const getSelectedText = () => {
    if (selectedIndex === null || selectedIndex === undefined) {
      return placeholder;
    }
    const choice = choices[selectedIndex];
    if (typeof choice === "number") {
      return choice.toLocaleString("ja-JP");
    }
    return choice;
  };

  // 選択肢をタップしたときの処理
  const handleChoicePress = (choiceIndex: number) => {
    onSelect(blankIndex, choiceIndex);
    setModalVisible(false);
  };

  // 選択ボタンを表示
  const renderButton = () => {
    const isSelected = selectedIndex !== null && selectedIndex !== undefined;

    return (
      <TouchableOpacity
        style={[
          styles.button,
          isSelected && styles.buttonSelected,
          disabled && styles.buttonDisabled,
          buttonStyle,
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.buttonText,
            isSelected && styles.buttonTextSelected,
            disabled && styles.buttonTextDisabled,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {getSelectedText()}
        </Text>
        <Text style={styles.buttonIcon}>▼</Text>
      </TouchableOpacity>
    );
  };

  // 選択肢モーダルを表示
  const renderModal = () => {
    return (
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            {/* ヘッダー */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>選択肢</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* ヒント表示 */}
            {hint && (
              <View style={styles.hintContainer}>
                <Text style={styles.hintIcon}>💡</Text>
                <Text style={styles.hintText}>{hint}</Text>
              </View>
            )}

            {/* 選択肢リスト */}
            <ScrollView style={styles.choicesContainer}>
              {choices.map((choice, index) => {
                const isCurrentSelection = index === selectedIndex;
                const choiceText =
                  typeof choice === "number"
                    ? choice.toLocaleString("ja-JP")
                    : choice;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.choiceItem,
                      isCurrentSelection && styles.choiceItemSelected,
                    ]}
                    onPress={() => handleChoicePress(index)}
                  >
                    <Text
                      style={[
                        styles.choiceText,
                        isCurrentSelection && styles.choiceTextSelected,
                      ]}
                    >
                      {choiceText}
                    </Text>
                    {isCurrentSelection && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {renderButton()}
      {renderModal()}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surface,
      borderWidth: 1.5,
      borderColor: theme.colors.borderLight,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      minHeight: 44,
    },
    buttonSelected: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    buttonDisabled: {
      backgroundColor: theme.colors.disabled,
      borderColor: theme.colors.borderLight,
    },
    buttonText: {
      flex: 1,
      fontSize: 15,
      color: theme.colors.textSecondary,
    },
    buttonTextSelected: {
      color: theme.colors.text,
      fontWeight: "700",
    },
    buttonTextDisabled: {
      color: theme.colors.textDisabled,
    },
    buttonIcon: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginLeft: 8,
    },

    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      width: "100%",
      maxWidth: 400,
      maxHeight: "80%",
      ...theme.shadows.large,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    closeButton: {
      padding: 4,
    },
    closeButtonText: {
      fontSize: 24,
      color: theme.colors.textSecondary,
    },

    // Hint styles
    hintContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: theme.colors.warningLight,
      padding: 12,
      margin: 12,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.warning,
    },
    hintIcon: {
      fontSize: 16,
      marginRight: 8,
    },
    hintText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
    },

    // Choices styles
    choicesContainer: {
      maxHeight: 400,
    },
    choiceItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    choiceItemSelected: {
      backgroundColor: theme.colors.infoBackground, // #E3F2FD - 淡い青色でテキストの可読性向上
    },
    choiceText: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
    },
    choiceTextSelected: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
    checkmark: {
      fontSize: 20,
      color: theme.colors.success,
      marginLeft: 8,
    },
  });
