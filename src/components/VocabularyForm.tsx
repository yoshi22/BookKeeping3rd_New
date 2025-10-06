/**
 * 用語穴埋め問題フォームコンポーネント
 * 第二問（Q2_V_）の用語問題に対応
 */

import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useTheme, useThemedStyles, type Theme } from "../context/ThemeContext";
import {
  answerService,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from "../services/answer-service";
import { SessionType } from "../types/database";
import { logger } from "../utils/logger";

interface VocabularyBlank {
  index: number;
  choices: string[];
}

interface VocabularyAnswerTemplate {
  id: string;
  type: "vocabulary";
  questionText: string;
  blanks: VocabularyBlank[];
}

interface VocabularyFormProps {
  questionId: string;
  answerTemplate: VocabularyAnswerTemplate;
  sessionType?: SessionType;
  sessionId?: string;
  startTime?: number;
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void;
  showSubmitButton?: boolean;
}

export default function VocabularyForm({
  questionId,
  answerTemplate,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
  showSubmitButton = true,
}: VocabularyFormProps) {
  // デバッグログ
  console.log("[VocabularyForm] レンダリング開始", {
    questionId,
    blanksCount: answerTemplate?.blanks?.length,
    hasAnswerTemplate: !!answerTemplate,
  });

  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  // 各空欄の選択状態を管理（indexをキーとする）
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // questionIdが変わった時にselectedAnswersをリセット
  useEffect(() => {
    setSelectedAnswers({});
  }, [questionId]);

  // 空欄に対する選択肢を選択
  const handleSelectChoice = useCallback(
    (blankIndex: number, choiceIndex: number) => {
      setSelectedAnswers((prev) => ({
        ...prev,
        [blankIndex]: choiceIndex,
      }));
    },
    [],
  );

  // 解答送信
  const handleSubmit = async () => {
    console.log("[VocabularyForm] handleSubmit開始", {
      isSubmitting,
      selectedAnswers,
    });

    if (isSubmitting) return;

    // すべての空欄に解答が入力されているかチェック
    const allBlanks = answerTemplate.blanks.map((b) => b.index);
    const unansweredBlanks = allBlanks.filter(
      (index) => selectedAnswers[index] === undefined,
    );

    console.log("[VocabularyForm] 空欄チェック", {
      allBlanks,
      unansweredBlanks,
    });

    if (unansweredBlanks.length > 0) {
      Alert.alert(
        "未回答の空欄があります",
        `空欄 ${unansweredBlanks.map((i) => `(${i})`).join(", ")} に解答を選択してください`,
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // 解答データを構築
      const answerData = {
        questionType: "ledger" as const, // vocabularyはledgerカテゴリ
        blanks: Object.entries(selectedAnswers).map(([index, choiceIndex]) => ({
          index: parseInt(index) - 1, // 1-basedから0-basedに変換
          selectedIndex: choiceIndex,
        })),
      };

      const submitRequest: SubmitAnswerRequest = {
        questionId,
        answerData,
        sessionType,
        sessionId,
        startTime,
      };

      const response = await answerService.submitAnswer(submitRequest);

      if (onSubmitAnswer) {
        onSubmitAnswer(response);
      }
    } catch (error) {
      logger.error("[VocabularyForm] 解答送信エラー:", error as Error);
      Alert.alert("エラー", "解答の送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 問題文を空欄番号ごとに分割（重複key修正済み: match.index追加）
  const renderQuestionText = () => {
    const { questionText } = answerTemplate;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // （①）、（②）、（③）などの空欄を検出
    const blankPattern = /（([①②③④⑤⑥⑦⑧⑨⑩])）/g;
    let match;

    while ((match = blankPattern.exec(questionText)) !== null) {
      // 空欄の前のテキストを追加
      if (match.index > lastIndex) {
        parts.push(
          <Text key={`text-${lastIndex}`} style={styles.questionTextNormal}>
            {questionText.substring(lastIndex, match.index)}
          </Text>,
        );
      }

      // 空欄番号を数値に変換
      const blankNumber = "①②③④⑤⑥⑦⑧⑨⑩".indexOf(match[1]) + 1;

      // 空欄部分を強調表示
      parts.push(
        <Text
          key={`blank-${blankNumber}-${match.index}`}
          style={styles.blankPlaceholder}
        >
          （{match[1]}）
        </Text>,
      );

      lastIndex = match.index + match[0].length;
    }

    // 残りのテキストを追加
    if (lastIndex < questionText.length) {
      parts.push(
        <Text key={`text-${lastIndex}`} style={styles.questionTextNormal}>
          {questionText.substring(lastIndex)}
        </Text>,
      );
    }

    return parts;
  };

  return (
    <View style={styles.container}>
      {/* 問題文表示（空欄を強調） */}
      <View style={styles.questionTextContainer}>
        <Text style={styles.questionText}>{renderQuestionText()}</Text>
      </View>

      {/* 各空欄の選択肢 */}
      <ScrollView style={styles.answersContainer}>
        {answerTemplate.blanks.map((blank) => {
          const blankSymbol = "①②③④⑤⑥⑦⑧⑨⑩"[blank.index - 1];
          return (
            <View key={blank.index} style={styles.blankSection}>
              <Text style={styles.blankLabel}>空欄（{blankSymbol}）</Text>
              <View style={styles.choicesContainer}>
                {blank.choices.map((choice, choiceIndex) => {
                  const isSelected =
                    selectedAnswers[blank.index] === choiceIndex;
                  return (
                    <TouchableOpacity
                      key={choiceIndex}
                      style={[
                        styles.choiceButton,
                        isSelected && styles.choiceButtonSelected,
                      ]}
                      onPress={() =>
                        handleSelectChoice(blank.index, choiceIndex)
                      }
                      testID={`vocabulary-choice-${blank.index}-${choiceIndex}`}
                    >
                      <Text
                        style={[
                          styles.choiceText,
                          isSelected && styles.choiceTextSelected,
                        ]}
                      >
                        {choice}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* 解答送信ボタン */}
      {showSubmitButton && (
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          testID="submit-answer-button"
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "送信中..." : "解答を送信"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 15,
    },
    questionTextContainer: {
      backgroundColor: theme.colors.surface,
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
      ...theme.shadows.medium,
    },
    questionText: {
      fontSize: 16,
      lineHeight: 26,
      color: theme.colors.text,
    },
    questionTextNormal: {
      color: theme.colors.text,
    },
    blankPlaceholder: {
      color: theme.colors.primary,
      fontWeight: "bold",
      fontSize: 18,
    },
    answersContainer: {
      flex: 1,
      marginBottom: 15,
    },
    blankSection: {
      marginBottom: 20,
    },
    blankLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 10,
    },
    choicesContainer: {
      gap: 10,
    },
    choiceButton: {
      backgroundColor: theme.colors.surface,
      padding: 15,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: theme.colors.borderLight,
      ...theme.shadows.small,
    },
    choiceButtonSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primaryLight,
    },
    choiceText: {
      fontSize: 16,
      color: theme.colors.text,
      textAlign: "center",
    },
    choiceTextSelected: {
      color: theme.colors.primary,
      fontWeight: "bold",
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      ...theme.shadows.medium,
    },
    submitButtonDisabled: {
      backgroundColor: theme.colors.textDisabled,
    },
    submitButtonText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "bold",
    },
  });
