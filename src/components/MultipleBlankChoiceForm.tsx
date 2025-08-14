/**
 * 複数空欄選択問題用解答フォーム
 * Q_L_031-040などの複数の穴埋めがある問題に対応
 */

import React, { useState } from "react";
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

      console.log("[MultipleBlankChoiceForm] 解答送信:", request);

      const response = await answerService.submitAnswer(request);
      console.log("[MultipleBlankChoiceForm] 解答送信完了:", response);

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
      console.error("[MultipleBlankChoiceForm] 解答送信エラー:", error);
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
                color="white"
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
    color: "#333",
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "white",
    minHeight: 48,
  },
  dropdownButtonEmpty: {
    borderColor: "#ccc",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  dropdownButtonTextSelected: {
    color: "#2196F3",
    fontWeight: "500",
  },
  dropdownArrow: {
    fontSize: 16,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownModal: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxHeight: "70%",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  modalOptionsContainer: {
    maxHeight: 300,
  },
  modalOptionButton: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalOptionButtonSelected: {
    backgroundColor: "#e3f2fd",
  },
  modalOptionContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  modalOptionNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginRight: 8,
    minWidth: 20,
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    lineHeight: 22,
  },
  modalOptionTextSelected: {
    color: "#1976D2",
    fontWeight: "500",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#999",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxRadio: {
    borderRadius: 12,
  },
  checkboxSelected: {
    borderColor: "#2196F3",
    backgroundColor: "#2196F3",
  },
  checkmark: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalCloseButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#9E9E9E",
  },
  submitButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    marginRight: 8,
  },
});
