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
import { SubmitAnswerResponse } from "../services/answer-service";
import ExplanationPanel from "./ExplanationPanel";

interface AnswerResultDialogProps {
  visible: boolean;
  result: SubmitAnswerResponse | null;
  onClose: () => void;
  onNextQuestion?: () => void;
  onReviewQuestion?: () => void;
  showNextButton?: boolean;
  showReviewButton?: boolean;
}

export default function AnswerResultDialog({
  visible,
  result,
  onClose,
  onNextQuestion,
  onReviewQuestion,
  showNextButton = true,
  showReviewButton = true,
}: AnswerResultDialogProps) {
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

    // 旧形式：journalEntry単一オブジェクト（後方互換性のため残す）- 2列形式に変換
    if (correctAnswer.journalEntry) {
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
          <ExplanationPanel
            explanation={result.explanation}
            isVisible={true}
            isCorrect={result.isCorrect}
            correctAnswer={formatCorrectAnswer(result.correctAnswer)}
            showAnswerComparison={true}
          />
        </ScrollView>

        {/* アクションボタン */}
        <View style={styles.actionButtons}>
          {showReviewButton && !result.isCorrect && (
            <TouchableOpacity
              style={[styles.actionButton, styles.reviewButton]}
              onPress={onReviewQuestion}
            >
              <Text style={styles.reviewButtonText}>復習リストに追加</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  correctHeader: {
    backgroundColor: "#4caf50",
  },
  incorrectHeader: {
    backgroundColor: "#f44336",
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  incorrectIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  resultIconText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  headerTextContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  errorSection: {
    backgroundColor: "#fff3cd",
    margin: 15,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: "#856404",
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
  reviewButton: {
    backgroundColor: "#ff9800",
  },
  nextButton: {
    backgroundColor: "#2196f3",
  },
  reviewButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
