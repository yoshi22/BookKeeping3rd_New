/**
 * 選択問題用解答フォーム
 * 単一選択(single_choice)と複数選択(multiple_choice)に対応
 */

import React, { useState } from "react";
import { logger } from "../../utils/logger";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";
import { useTheme, useThemedStyles, useColors, useDynamicColors, type Theme } from "../context/ThemeContext";
import {
  answerService,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from "../services/answer-service";
import { SessionType } from "../types/database";

interface ChoiceAnswerFormProps {
  questionId: string;
  type: "single_choice" | "multiple_choice";
  options: string[];
  sessionType?: SessionType;
  sessionId?: string;
  startTime?: number;
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void;
  showSubmitButton?: boolean;
}

export default function ChoiceAnswerForm({
  questionId,
  type,
  options,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
  showSubmitButton = true,
}: ChoiceAnswerFormProps) {
  // Theme system integration for dark mode support
  const { theme, isDark, getStatusBarStyle } = useTheme();
  const colors = useColors();
  const dynamicColors = useDynamicColors();
  const styles = useThemedStyles(createStyles);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // 単一選択の処理
  const handleSingleChoice = (optionIndex: string) => {
    setSelectedOption(optionIndex);
  };

  // 複数選択の処理
  const handleMultipleChoice = (optionIndex: string) => {
    if (selectedOptions.includes(optionIndex)) {
      setSelectedOptions(selectedOptions.filter((opt) => opt !== optionIndex));
    } else {
      setSelectedOptions([...selectedOptions, optionIndex]);
    }
  };

  // 解答送信処理
  const handleSubmitAnswer = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // 選択チェック
      if (type === "single_choice" && !selectedOption) {
        Alert.alert("入力エラー", "選択肢を選んでください");
        return;
      }

      if (type === "multiple_choice" && selectedOptions.length === 0) {
        Alert.alert("入力エラー", "少なくとも1つの選択肢を選んでください");
        return;
      }

      // 解答データを構築
      const userAnswer =
        type === "single_choice"
          ? { questionType: "journal" as const, selected: selectedOption }
          : {
              questionType: "journal" as const,
              selected_options: selectedOptions.sort(),
            };

      const timeTaken = Math.floor((Date.now() - startTime) / 1000);

      const request: SubmitAnswerRequest = {
        questionId,
        sessionType,
        sessionId,
        answerData: userAnswer,
        startTime,
      };

      logger.debug("[ChoiceAnswerForm] 解答送信:", { details: request });

      const response = await answerService.submitAnswer(request);
      logger.debug("[ChoiceAnswerForm] 解答送信完了:", { details: response });

      if (onSubmitAnswer) {
        onSubmitAnswer(response);
      }

      if (response.isCorrect) {
        Alert.alert("正解", "正解です！", [{ text: "OK", onPress: () => {} }]);
      } else {
        Alert.alert("不正解", "もう一度考えてみましょう", [
          { text: "OK", onPress: () => {} },
        ]);
      }
    } catch (error) {
      logger.error("[ChoiceAnswerForm] 解答送信エラー:", error);
      Alert.alert("エラー", "解答の送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOptionSelected = (index: string) => {
    if (type === "single_choice") {
      return selectedOption === index;
    }
    return selectedOptions.includes(index);
  };

  // ドロップダウン形式のレンダリング
  const renderDropdownChoice = () => {
    const selectedText =
      type === "single_choice"
        ? selectedOption
          ? `${selectedOption}. ${options[parseInt(selectedOption) - 1]}`
          : "選択してください"
        : selectedOptions.length > 0
          ? `${selectedOptions.length}項目選択済み`
          : "選択してください";

    return (
      <>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowDropdown(true)}
        >
          <Text
            style={[
              styles.dropdownButtonText,
              (selectedOption || selectedOptions.length > 0) &&
                styles.dropdownButtonTextSelected,
            ]}
          >
            {selectedText}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        <Modal
          visible={showDropdown}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDropdown(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowDropdown(false)}
            activeOpacity={1}
          >
            <View style={styles.dropdownModal}>
              <Text style={styles.modalTitle}>
                {type === "single_choice"
                  ? "選択してください"
                  : "該当するものをすべて選択"}
              </Text>
              <ScrollView style={styles.modalOptionsContainer}>
                {options.map((option, index) => {
                  const optionIndex = String(index + 1);
                  const isSelected = isOptionSelected(optionIndex);

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.modalOptionButton,
                        isSelected && styles.modalOptionButtonSelected,
                      ]}
                      onPress={() => {
                        if (type === "single_choice") {
                          handleSingleChoice(optionIndex);
                          setShowDropdown(false);
                        } else {
                          handleMultipleChoice(optionIndex);
                        }
                      }}
                    >
                      <View style={styles.modalOptionContent}>
                        <View
                          style={[
                            styles.checkbox,
                            type === "single_choice" && styles.checkboxRadio,
                            isSelected && styles.checkboxSelected,
                          ]}
                        >
                          {isSelected && (
                            <Text style={styles.checkmark}>
                              {type === "single_choice" ? "●" : "✓"}
                            </Text>
                          )}
                        </View>
                        <Text style={styles.modalOptionNumber}>
                          {optionIndex}.
                        </Text>
                        <Text
                          style={[
                            styles.modalOptionText,
                            isSelected && styles.modalOptionTextSelected,
                          ]}
                        >
                          {option}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {type === "multiple_choice" && (
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowDropdown(false)}
                >
                  <Text style={styles.modalCloseButtonText}>選択完了</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {type === "single_choice"
          ? "正しいものを選択"
          : "該当するものをすべて選択"}
      </Text>

      {renderDropdownChoice()}

      {showSubmitButton && (
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmitAnswer}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <View style={styles.submitButtonContent}>
              <ActivityIndicator
                size="small"
                color={theme.colors.surface}
                style={styles.loader}
              />
              <Text style={styles.submitButtonText}>送信中...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>解答を送信</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

// Theme-aware styles function for dark mode support
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      margin: 15,
      padding: 20,
      borderRadius: 10,
      ...theme.shadows.medium,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 15,
    },
    dropdownButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderWidth: 2,
      borderColor: theme.colors.borderLight,
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
      marginBottom: 20,
    },
    dropdownButtonText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      flex: 1,
    },
    dropdownButtonTextSelected: {
      color: theme.colors.primary,
      fontWeight: "500",
    },
    dropdownArrow: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.background + "80",
      justifyContent: "center",
      alignItems: "center",
    },
    dropdownModal: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 20,
      margin: 20,
      maxHeight: "70%",
      width: "90%",
      ...theme.shadows.medium,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 15,
      textAlign: "center",
    },
    modalOptionsContainer: {
      maxHeight: 300,
    },
    modalOptionButton: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    modalOptionButtonSelected: {
      backgroundColor: theme.colors.infoBackground,
    },
    modalOptionContent: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    modalOptionNumber: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      marginRight: 8,
      minWidth: 20,
    },
    modalOptionText: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
      lineHeight: 22,
    },
    modalOptionTextSelected: {
      color: theme.colors.primary,
      fontWeight: "500",
    },
    modalCloseButton: {
      backgroundColor: theme.colors.primary,
      padding: 15,
      borderRadius: 8,
      marginTop: 15,
      alignItems: "center",
    },
    modalCloseButtonText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "bold",
    },
    optionsContainer: {
      maxHeight: 400,
    },
    optionButton: {
      marginBottom: 12,
      padding: 16,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: theme.colors.borderLight,
      backgroundColor: theme.colors.surface,
    },
    optionButtonSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.infoBackground,
    },
    optionContent: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: theme.colors.textSecondary,
      marginRight: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxRadio: {
      borderRadius: 12,
    },
    checkboxSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },
    checkmark: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "bold",
    },
    optionNumber: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      marginRight: 8,
      minWidth: 20,
    },
    optionNumberSelected: {
      color: theme.colors.primary,
    },
    optionText: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
      lineHeight: 22,
    },
    optionTextSelected: {
      color: theme.colors.primary,
      fontWeight: "500",
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      padding: 15,
      borderRadius: 8,
      marginTop: 20,
      alignItems: "center",
    },
    submitButtonDisabled: {
      backgroundColor: theme.colors.textDisabled,
    },
    submitButtonContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    submitButtonText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "bold",
    },
    loader: {
      marginRight: 8,
    },
  });
