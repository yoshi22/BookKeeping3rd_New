/**
 * 複数空欄選択問題用解答フォーム
 * Q_L_031-040などの複数の穴埋めがある問題に対応
 */

import React, { useState } from "react";
import { logger } from "../utils/logger";
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

interface BlankQuestion {
  id: string;
  label: string;
  options: string[];
}

interface MultipleBlankChoiceFormProps {
  questionId: string;
  questions: BlankQuestion[];
  options: string[];
  sessionType?: SessionType;
  sessionId?: string;
  startTime?: number;
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void;
  showSubmitButton?: boolean;
}

export default function MultipleBlankChoiceForm({
  questionId,
  questions,
  options,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
  showSubmitButton = true,
}: MultipleBlankChoiceFormProps) {
  // Theme system integration for dark mode support
  const { theme, isDark, getStatusBarStyle } = useTheme();
  const colors = useColors();
  const dynamicColors = useDynamicColors();
  const styles = useThemedStyles(createStyles);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  // 空欄に対する解答を設定
  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    setShowDropdown(null);
  };

  // 解答送信処理
  const handleSubmitAnswer = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // すべての空欄が回答されているかチェック
      const unansweredQuestions = questions.filter((q) => !answers[q.id]);

      if (unansweredQuestions.length > 0) {
        Alert.alert(
          "入力エラー",
          `以下の空欄を回答してください：\n${unansweredQuestions.map((q) => q.label).join(", ")}`,
        );
        return;
      }

      // 解答データを構築
      const userAnswer = {
        questionType: "multiple_blank_choice" as const,
        answers: answers,
      };

      const request: SubmitAnswerRequest = {
        questionId,
        sessionType,
        sessionId,
        answerData: userAnswer,
        startTime,
      };

      logger.debug("[MultipleBlankChoiceForm] 解答送信:", { details: request });

      const response = await answerService.submitAnswer(request);
      logger.debug("[MultipleBlankChoiceForm] 解答送信完了:", { details: response });

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
      logger.error("[MultipleBlankChoiceForm] 解答送信エラー:", error  as Error);
      Alert.alert("エラー", "解答の送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 選択肢のレンダリング
  const renderBlankQuestion = (question: BlankQuestion) => {
    const selectedAnswer = answers[question.id];
    const selectedOptionText = selectedAnswer
      ? `${selectedAnswer}. ${options[selectedAnswer.charCodeAt(0) - 65]}`
      : "選択してください";

    return (
      <View key={question.id} style={styles.questionContainer}>
        <Text style={styles.questionLabel}>{question.label}</Text>
        <TouchableOpacity
          style={[
            styles.dropdownButton,
            !selectedAnswer && styles.dropdownButtonEmpty,
          ]}
          onPress={() => setShowDropdown(question.id)}
        >
          <Text
            style={[
              styles.dropdownButtonText,
              selectedAnswer && styles.dropdownButtonTextSelected,
            ]}
          >
            {selectedOptionText}
          </Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // 選択モーダルのレンダリング
  const renderSelectionModal = () => {
    if (!showDropdown) return null;

    const currentQuestion = questions.find((q) => q.id === showDropdown);
    if (!currentQuestion) return null;

    return (
      <Modal
        visible={true}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowDropdown(null)}
          activeOpacity={1}
        >
          <View style={styles.dropdownModal}>
            <Text style={styles.modalTitle}>
              {currentQuestion.label}の選択肢
            </Text>
            <ScrollView style={styles.modalOptionsContainer}>
              {options.map((option, index) => {
                const optionKey = String.fromCharCode(65 + index); // A, B, C, D
                const isSelected = answers[currentQuestion.id] === optionKey;

                return (
                  <TouchableOpacity
                    key={optionKey}
                    style={[
                      styles.modalOptionButton,
                      isSelected && styles.modalOptionButtonSelected,
                    ]}
                    onPress={() =>
                      handleAnswerSelect(currentQuestion.id, optionKey)
                    }
                  >
                    <View style={styles.modalOptionContent}>
                      <View
                        style={[
                          styles.checkbox,
                          styles.checkboxRadio,
                          isSelected && styles.checkboxSelected,
                        ]}
                      >
                        {isSelected && <Text style={styles.checkmark}>●</Text>}
                      </View>
                      <Text style={styles.modalOptionNumber}>{optionKey}.</Text>
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
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDropdown(null)}
            >
              <Text style={styles.modalCloseButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>各空欄に最も適切な選択肢を選択</Text>

      <ScrollView style={styles.questionsContainer}>
        {questions.map((question) => renderBlankQuestion(question))}
      </ScrollView>

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

      {renderSelectionModal()}
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
    questionsContainer: {
      maxHeight: 400,
      marginBottom: 20,
    },
    questionContainer: {
      marginBottom: 20,
    },
    questionLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 8,
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
      minHeight: 48,
    },
    dropdownButtonEmpty: {
      borderColor: theme.colors.borderLight,
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
