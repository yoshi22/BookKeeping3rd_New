/**
 * 解答結果ダイアログコンポーネント
 * Step 2.2: 解説表示機能実装
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useTheme, useThemedStyles, type Theme } from "../context/ThemeContext";
import { SubmitAnswerResponse } from "../services/answer-service";
import { UnifiedExplanation } from "./unified/UnifiedExplanation";

interface AnswerResultDialogProps {
  visible: boolean;
  result: SubmitAnswerResponse | null;
  onClose: () => void;
  showNextButton?: boolean;
  onNextQuestion?: () => void;
  questionId?: string;
  onAddToReview?: (questionId: string) => void;
  answerTemplate?: any; // Q2 vocabulary/fill_in_ledger形式の正解表示に必要
}

export default function AnswerResultDialog({
  visible,
  result,
  onClose,
  onNextQuestion,
  showNextButton = true,
  questionId,
  onAddToReview,
  answerTemplate,
}: AnswerResultDialogProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  if (!result) return null;

  const formatAnswerTime = (timeMs: number): string => {
    const seconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}分${remainingSeconds}秒`;
    }
    return `${remainingSeconds}秒`;
  };

  const formatCorrectAnswer = (correctAnswer: any): any => {
    // 新形式：journalEntries配列（複合仕訳対応）- 2列形式で返す
    if (
      correctAnswer.journalEntries &&
      Array.isArray(correctAnswer.journalEntries)
    ) {
      return correctAnswer; // ExplanationPanelで2列表示するため、そのまま返す
    }

    // journalEntry形式（配列または単一オブジェクト）
    if (correctAnswer.journalEntry) {
      // journalEntryが配列の場合（複合仕訳）- そのままjournalEntriesに変換
      if (Array.isArray(correctAnswer.journalEntry)) {
        return {
          journalEntries: correctAnswer.journalEntry,
        };
      }
      // journalEntryが単一オブジェクトの場合（旧形式・後方互換性）
      return {
        journalEntries: [
          {
            debit_account: correctAnswer.journalEntry.debit_account,
            debit_amount: correctAnswer.journalEntry.debit_amount,
            credit_account: correctAnswer.journalEntry.credit_account,
            credit_amount: correctAnswer.journalEntry.credit_amount,
          },
        ],
      };
    }

    // 帳簿問題の処理
    if (correctAnswer.ledgerEntry) {
      return correctAnswer; // ExplanationPanelで適切に処理されるため、そのまま返す
    }

    // entries直接配列形式の帳簿問題・試算表問題（新形式）
    if (correctAnswer.entries && Array.isArray(correctAnswer.entries)) {
      return correctAnswer; // ExplanationPanelで適切に処理されるため、そのまま返す
    }

    // financialStatements形式（Q_T_001のような財務諸表問題）
    if (correctAnswer.financialStatements) {
      // ExplanationPanelで適切に処理されるよう、そのまま返す
      return correctAnswer;
    }

    // 古い形式（後方互換性のため残す）
    if (correctAnswer.trialBalance) {
      const formatted: Record<string, any> = {};
      Object.entries(correctAnswer.trialBalance.balances || {}).forEach(
        ([account, amount]) => {
          formatted[account] = (amount as number).toLocaleString();
        },
      );
      return formatted;
    }

    return correctAnswer;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* ヘッダー */}
        <View
          style={[
            styles.header,
            result.isCorrect ? styles.correctHeader : styles.incorrectHeader,
          ]}
        >
          <View style={styles.headerContent}>
            <View
              style={[
                styles.resultIcon,
                result.isCorrect ? styles.correctIcon : styles.incorrectIcon,
              ]}
            >
              <Text style={styles.resultIconText}>
                {result.isCorrect ? "✓" : "✗"}
              </Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.resultTitle}>
                {result.isCorrect ? "正解！" : "不正解"}
              </Text>
              <Text style={styles.resultSubtitle}>
                解答時間: {formatAnswerTime(result.answerTimeMs)}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* バリデーションエラー表示 */}
          {result.validationErrors && result.validationErrors.length > 0 && (
            <View style={styles.errorSection}>
              <Text style={styles.errorTitle}>入力エラー</Text>
              {result.validationErrors.map((error, index) => (
                <Text key={index} style={styles.errorText}>
                  • {error}
                </Text>
              ))}
            </View>
          )}

          {/* 解説パネル */}
          {(() => {
            const determinedQuestionType =
              answerTemplate?.type === "fill_in_ledger" ||
              answerTemplate?.type === "vocabulary"
                ? "ledger"
                : answerTemplate?.type === "auxiliary_book"
                  ? "auxiliary_book"
                  : answerTemplate?.type === "fill_in_trial_balance" ||
                      answerTemplate?.type ===
                        "fill_in_comprehensive_trial_balance" ||
                      answerTemplate?.type === "fill_in_financial_statement"
                    ? "trial_balance"
                    : "journal";

            console.log("[AnswerResultDialog] Debug Info:", {
              answerTemplateType: answerTemplate?.type,
              determinedQuestionType,
              hasAnswerTemplate: !!answerTemplate,
              hasTransactions: !!answerTemplate?.transactions,
              correctAnswerKeys: result.correctAnswer
                ? Object.keys(result.correctAnswer)
                : [],
            });

            return (
              <UnifiedExplanation
                explanation={result.explanation}
                mode="panel"
                isVisible={true}
                isCorrect={result.isCorrect}
                correctAnswer={formatCorrectAnswer(result.correctAnswer)}
                showAnswerComparison={true}
                questionType={determinedQuestionType}
                questionTemplate={answerTemplate}
                sessionMode="learning"
              />
            );
          })()}
        </ScrollView>

        {/* アクションボタン */}
        <View style={styles.actionButtons}>
          {/* 正解時のみ復習対象追加ボタンを表示 */}
          {result.isCorrect && questionId && onAddToReview && (
            <TouchableOpacity
              style={[styles.actionButton, styles.reviewButton]}
              onPress={() => onAddToReview(questionId)}
            >
              <Text style={styles.reviewButtonText}>復習対象に追加</Text>
            </TouchableOpacity>
          )}
          {showNextButton && (
            <TouchableOpacity
              style={[styles.actionButton, styles.nextButton]}
              onPress={onNextQuestion}
            >
              <Text style={styles.nextButtonText}>次の問題へ</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const { height: screenHeight } = Dimensions.get("window");

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingTop: 50,
      paddingBottom: 20,
      paddingHorizontal: 20,
    },
    correctHeader: {
      backgroundColor: theme.colors.success,
    },
    incorrectHeader: {
      backgroundColor: theme.colors.error,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    resultIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
    },
    correctIcon: {
      backgroundColor: theme.colors.surface + "40",
    },
    incorrectIcon: {
      backgroundColor: theme.colors.surface + "40",
    },
    resultIconText: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.surface,
    },
    headerTextContainer: {
      flex: 1,
    },
    resultTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.surface,
      marginBottom: 4,
    },
    resultSubtitle: {
      fontSize: 14,
      color: theme.colors.surface + "CC",
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.surface + "40",
      justifyContent: "center",
      alignItems: "center",
    },
    closeButtonText: {
      fontSize: 18,
      color: theme.colors.surface,
      fontWeight: "bold",
    },
    content: {
      flex: 1,
      paddingTop: 10,
    },
    errorSection: {
      backgroundColor: theme.colors.warningBackground,
      margin: 15,
      padding: 15,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.warning,
    },
    errorTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 8,
    },
    errorText: {
      fontSize: 14,
      color: theme.colors.text,
      marginBottom: 4,
    },
    actionButtons: {
      flexDirection: "row",
      padding: 20,
      paddingBottom: 40,
      gap: 12,
    },
    actionButton: {
      flex: 1,
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
    },
    nextButton: {
      backgroundColor: theme.colors.primary,
    },
    nextButtonText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "bold",
    },
    reviewButton: {
      backgroundColor: theme.colors.warning,
      borderWidth: 1,
      borderColor: theme.colors.warning,
    },
    reviewButtonText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "bold",
    },
  });
