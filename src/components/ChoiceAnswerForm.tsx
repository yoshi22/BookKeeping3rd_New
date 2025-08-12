/**
 * 選択問題用解答フォーム
 * 単一選択(single_choice)と複数選択(multiple_choice)に対応
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

      console.log("[ChoiceAnswerForm] 解答送信:", request);

      const response = await answerService.submitAnswer(request);
      console.log("[ChoiceAnswerForm] 解答送信完了:", response);

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
      console.error("[ChoiceAnswerForm] 解答送信エラー:", error);
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
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "white",
    marginBottom: 20,
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
  optionsContainer: {
    maxHeight: 400,
  },
  optionButton: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    backgroundColor: "white",
  },
  optionButtonSelected: {
    borderColor: "#2196F3",
    backgroundColor: "#e3f2fd",
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
  optionNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginRight: 8,
    minWidth: 20,
  },
  optionNumberSelected: {
    color: "#2196F3",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    lineHeight: 22,
  },
  optionTextSelected: {
    color: "#1976D2",
    fontWeight: "500",
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
