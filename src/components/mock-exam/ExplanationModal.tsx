import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

export interface ExplanationModalProps {
  visible: boolean;
  onClose: () => void;
  explanation: string;
  questionText: string;
  correctAnswer?: any;
  userAnswer?: any;
  isCorrect?: boolean;
}

export default function ExplanationModal({
  visible,
  onClose,
  explanation,
  questionText,
  correctAnswer,
  userAnswer,
  isCorrect,
}: ExplanationModalProps) {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Header */}
        <View
          style={[styles.header, { backgroundColor: theme.colors.primary }]}
        >
          <Text
            style={[styles.headerTitle, { color: theme.colors.background }]}
          >
            解説
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text
              style={[
                styles.closeButtonText,
                { color: theme.colors.background },
              ]}
            >
              閉じる
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Question Text */}
          <View
            style={[styles.section, { backgroundColor: theme.colors.surface }]}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              問題
            </Text>
            <Text style={[styles.questionText, { color: theme.colors.text }]}>
              {questionText}
            </Text>
          </View>

          {/* Result Status */}
          {isCorrect !== undefined && (
            <View
              style={[
                styles.resultSection,
                {
                  backgroundColor: isCorrect
                    ? theme.colors.success + "20"
                    : theme.colors.error + "20",
                  borderColor: isCorrect
                    ? theme.colors.success
                    : theme.colors.error,
                },
              ]}
            >
              <Text
                style={[
                  styles.resultText,
                  {
                    color: isCorrect
                      ? theme.colors.success
                      : theme.colors.error,
                  },
                ]}
              >
                {isCorrect ? "✅ 正解" : "❌ 不正解"}
              </Text>
            </View>
          )}

          {/* Explanation */}
          <View
            style={[styles.section, { backgroundColor: theme.colors.surface }]}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              解説
            </Text>
            <Text
              style={[styles.explanationText, { color: theme.colors.text }]}
            >
              {explanation}
            </Text>
          </View>

          {/* Correct Answer */}
          {correctAnswer && (
            <View
              style={[
                styles.section,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                正解
              </Text>
              <Text
                style={[styles.answerText, { color: theme.colors.success }]}
              >
                {formatAnswer(correctAnswer)}
              </Text>
            </View>
          )}

          {/* User Answer */}
          {userAnswer && (
            <View
              style={[
                styles.section,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                あなたの解答
              </Text>
              <Text
                style={[
                  styles.answerText,
                  {
                    color: isCorrect
                      ? theme.colors.success
                      : theme.colors.error,
                  },
                ]}
              >
                {formatAnswer(userAnswer)}
              </Text>
            </View>
          )}

          {/* Learning Tips */}
          <View
            style={[styles.section, { backgroundColor: theme.colors.surface }]}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              💡 学習のポイント
            </Text>
            <Text
              style={[styles.tipText, { color: theme.colors.textSecondary }]}
            >
              この問題のポイントを復習し、類似問題でも正解できるようにしましょう。
              間違えた場合は、解説をよく読んで理解を深めてください。
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.confirmButton,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <Text
              style={[
                styles.confirmButtonText,
                { color: theme.colors.background },
              ]}
            >
              理解しました
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Helper function to format answer data
function formatAnswer(answer: any): string {
  if (!answer) return "";

  if (typeof answer === "string") {
    return answer;
  }

  if (typeof answer === "object") {
    try {
      // For journal entries
      if (answer.debits && answer.credits) {
        const debitText = answer.debits
          .map((d: any) => `借方: ${d.account} ${d.amount}円`)
          .join(", ");
        const creditText = answer.credits
          .map((c: any) => `貸方: ${c.account} ${c.amount}円`)
          .join(", ");
        return `${debitText} / ${creditText}`;
      }

      // For ledger entries
      if (answer.entries && Array.isArray(answer.entries)) {
        return answer.entries
          .map(
            (entry: any) =>
              `${entry.date} ${entry.description} 借方:${entry.debitAccount} ${entry.debitAmount}円 貸方:${entry.creditAccount} ${entry.creditAmount}円`,
          )
          .join("\n");
      }

      // For trial balance
      if (answer.entries && answer.entries[0]?.accountName) {
        return answer.entries
          .map(
            (entry: any) =>
              `${entry.accountName}: 借方${entry.debitAmount}円 貸方${entry.creditAmount}円`,
          )
          .join("\n");
      }

      // Fallback to JSON
      return JSON.stringify(answer, null, 2);
    } catch (e) {
      return String(answer);
    }
  }

  return String(answer);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  resultSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  explanationText: {
    fontSize: 16,
    lineHeight: 24,
  },
  answerText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "monospace",
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: "italic",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  confirmButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
