/**
 * 補助簿記入問題フォームコンポーネント
 * 第二問（Q2_B_）の補助簿記入問題に対応
 * 各取引について、記入すべき補助簿を複数選択する形式
 */

import React, { useState, useCallback } from "react";
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
import { Ionicons } from "@expo/vector-icons";

interface Transaction {
  index: number;
  description: string;
}

interface Book {
  id: string;
  name: string;
}

interface AuxiliaryBookAnswerTemplate {
  id: string;
  type: "auxiliary_book";
  transactions: Transaction[];
  books: Book[];
  correctAnswers?: Array<{
    transactionIndex: number;
    bookIds: string[];
  }>;
}

interface AuxiliaryBookFormProps {
  questionId: string;
  answerTemplate: AuxiliaryBookAnswerTemplate;
  sessionType?: SessionType;
  sessionId?: string;
  startTime?: number;
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void;
  showSubmitButton?: boolean;
}

export default function AuxiliaryBookForm({
  questionId,
  answerTemplate,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
  showSubmitButton = true,
}: AuxiliaryBookFormProps) {
  logger.debug("[AuxiliaryBookForm] レンダリング開始", {
    questionId,
    transactionsCount: answerTemplate?.transactions?.length,
    booksCount: answerTemplate?.books?.length,
  });

  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  // 各取引に対して選択された補助簿を管理
  // { transactionIndex: bookIds[] }
  const [selectedBooks, setSelectedBooks] = useState<Record<number, string[]>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 補助簿の選択/解除
  const handleToggleBook = useCallback(
    (transactionIndex: number, bookId: string) => {
      setSelectedBooks((prev) => {
        const currentBooks = prev[transactionIndex] || [];
        const isSelected = currentBooks.includes(bookId);

        if (isSelected) {
          // 既に選択されている場合は解除
          return {
            ...prev,
            [transactionIndex]: currentBooks.filter((id) => id !== bookId),
          };
        } else {
          // 選択されていない場合は追加
          return {
            ...prev,
            [transactionIndex]: [...currentBooks, bookId],
          };
        }
      });
    },
    [],
  );

  // 解答送信
  const handleSubmit = async () => {
    if (isSubmitting) return;

    // すべての取引に対して補助簿が選択されているかチェック
    const allTransactionIndices = answerTemplate.transactions.map(
      (t) => t.index,
    );
    const unansweredTransactions = allTransactionIndices.filter(
      (index) => !selectedBooks[index] || selectedBooks[index].length === 0,
    );

    if (unansweredTransactions.length > 0) {
      Alert.alert(
        "未回答の取引があります",
        `取引 ${unansweredTransactions.join(", ")} について補助簿を選択してください`,
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // 解答データを構築
      const answerData = {
        questionType: "ledger" as const,
        auxiliaryBookSelections: Object.entries(selectedBooks).map(
          ([transactionIndex, bookIds]) => ({
            transactionIndex: parseInt(transactionIndex),
            bookIds,
          }),
        ),
      };

      logger.debug("[AuxiliaryBookForm] 解答送信", answerData);

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
      logger.error("[AuxiliaryBookForm] 解答送信エラー:", error as Error);
      Alert.alert("エラー", "解答の送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} testID="auxiliary-book-form">
      {/* 説明 */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          各取引について、記入すべき補助簿をすべて選択してください
        </Text>
      </View>

      {/* 取引ごとに補助簿選択 */}
      {answerTemplate.transactions.map((transaction) => (
        <View key={transaction.index} style={styles.transactionContainer}>
          <View style={styles.transactionHeader}>
            <Text style={styles.transactionTitle}>取引{transaction.index}</Text>
          </View>
          <Text style={styles.transactionDescription}>
            {transaction.description}
          </Text>

          {/* 補助簿選択肢 */}
          <View style={styles.booksContainer}>
            {answerTemplate.books.map((book) => {
              const isSelected =
                selectedBooks[transaction.index]?.includes(book.id) || false;

              return (
                <TouchableOpacity
                  key={book.id}
                  style={[
                    styles.bookButton,
                    isSelected && styles.bookButtonSelected,
                  ]}
                  onPress={() => handleToggleBook(transaction.index, book.id)}
                >
                  <Ionicons
                    name={isSelected ? "checkbox" : "square-outline"}
                    size={24}
                    color={
                      isSelected
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                    style={styles.checkboxIcon}
                  />
                  <Text
                    style={[
                      styles.bookButtonText,
                      isSelected && styles.bookButtonTextSelected,
                    ]}
                  >
                    {book.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 選択された補助簿の表示 */}
          {selectedBooks[transaction.index] &&
            selectedBooks[transaction.index].length > 0 && (
              <View style={styles.selectedBooksContainer}>
                <Text style={styles.selectedBooksLabel}>選択中：</Text>
                <Text style={styles.selectedBooksText}>
                  {selectedBooks[transaction.index]
                    .map(
                      (bookId) =>
                        answerTemplate.books.find((b) => b.id === bookId)?.name,
                    )
                    .join(", ")}
                </Text>
              </View>
            )}
        </View>
      ))}

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
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    instructionsContainer: {
      padding: 16,
      backgroundColor: theme.colors.surfaceLight,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    instructionsText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    transactionContainer: {
      margin: 16,
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      ...theme.shadows.small,
    },
    transactionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    transactionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    transactionDescription: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 16,
      lineHeight: 24,
    },
    booksContainer: {
      marginTop: 8,
    },
    bookButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      marginVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      backgroundColor: theme.colors.background,
    },
    bookButtonSelected: {
      backgroundColor: theme.colors.primaryLight,
      borderColor: theme.colors.primary,
    },
    checkboxIcon: {
      marginRight: 12,
    },
    bookButtonText: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
    },
    bookButtonTextSelected: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
    selectedBooksContainer: {
      marginTop: 12,
      padding: 12,
      backgroundColor: theme.colors.successLight,
      borderRadius: 6,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.success,
    },
    selectedBooksLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.success,
      marginBottom: 4,
    },
    selectedBooksText: {
      fontSize: 14,
      color: theme.colors.text,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 8,
      margin: 16,
      alignItems: "center",
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
  });
