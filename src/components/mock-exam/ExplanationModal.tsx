import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { useTheme, type Theme } from "../../context/ThemeContext";
import CorrectAnswerExample from "../CorrectAnswerExample";

export interface ExplanationModalProps {
  visible: boolean;
  onClose: () => void;
  explanation: string;
  questionText: string;
  correctAnswer?: any;
  userAnswer?: any;
  isCorrect?: boolean;
  questionType?: "journal" | "ledger" | "trial_balance";
}

export default function ExplanationModal({
  visible,
  onClose,
  explanation,
  questionText,
  correctAnswer,
  userAnswer,
  isCorrect,
  questionType,
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
              {questionType ? (
                <CorrectAnswerExample
                  questionType={questionType}
                  correctAnswer={correctAnswer}
                  show={true}
                />
              ) : (
                <Text
                  style={[styles.answerText, { color: theme.colors.success }]}
                >
                  {formatAnswer(correctAnswer)}
                </Text>
              )}
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
      if (answer.journalEntry) {
        const entry = answer.journalEntry;
        return `借方: ${entry.debit_account} ${entry.debit_amount}円 / 貸方: ${entry.credit_account} ${entry.credit_amount}円`;
      }

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
      if (answer.ledgerEntry && answer.ledgerEntry.entries) {
        return answer.ledgerEntry.entries
          .map(
            (entry: any) =>
              `${entry.date || ""} ${entry.description || ""} 借方:${entry.debitAmount || 0}円 貸方:${entry.creditAmount || 0}円`,
          )
          .join("\n");
      }

      if (answer.entries && Array.isArray(answer.entries)) {
        // Check if it's a ledger entry format
        if (answer.entries[0]?.date !== undefined) {
          return answer.entries
            .map(
              (entry: any) =>
                `${entry.date} ${entry.description} 借方:${entry.debitAccount} ${entry.debitAmount}円 貸方:${entry.creditAccount} ${entry.creditAmount}円`,
            )
            .join("\n");
        }
        // Check if it's a trial balance entry format
        if (answer.entries[0]?.accountName) {
          return answer.entries
            .map(
              (entry: any) =>
                `${entry.accountName}: 借方${entry.debitAmount}円 貸方${entry.creditAmount}円`,
            )
            .join("\n");
        }
      }

      // For financial statements format (Q_T_001など)
      if (answer.financialStatements) {
        const entries = [];
        const fs = answer.financialStatements;

        // 貸借対照表の資産（借方）
        if (fs.balanceSheet?.assets) {
          for (const asset of fs.balanceSheet.assets) {
            if (asset.amount > 0) {
              entries.push(
                `${asset.accountName}: 借方${asset.amount.toLocaleString()}円`,
              );
            }
          }
        }

        // 貸借対照表の負債（貸方）
        if (fs.balanceSheet?.liabilities) {
          for (const liability of fs.balanceSheet.liabilities) {
            if (liability.amount > 0) {
              entries.push(
                `${liability.accountName}: 貸方${liability.amount.toLocaleString()}円`,
              );
            }
          }
        }

        // 貸借対照表の純資産（貸方、当期純損失は借方）
        if (fs.balanceSheet?.equity) {
          for (const equity of fs.balanceSheet.equity) {
            if (equity.amount > 0) {
              if (equity.accountName === "当期純損失") {
                entries.push(
                  `${equity.accountName}: 借方${equity.amount.toLocaleString()}円`,
                );
              } else {
                entries.push(
                  `${equity.accountName}: 貸方${equity.amount.toLocaleString()}円`,
                );
              }
            }
          }
        }

        // 損益計算書の収益（貸方）
        if (fs.incomeStatement?.revenues) {
          for (const revenue of fs.incomeStatement.revenues) {
            if (revenue.amount > 0) {
              const accountName =
                revenue.accountName === "売上高" ? "売上" : revenue.accountName;
              entries.push(
                `${accountName}: 貸方${revenue.amount.toLocaleString()}円`,
              );
            }
          }
        }

        // 損益計算書の費用（借方）
        if (fs.incomeStatement?.expenses) {
          for (const expense of fs.incomeStatement.expenses) {
            if (expense.amount > 0) {
              entries.push(
                `${expense.accountName}: 借方${expense.amount.toLocaleString()}円`,
              );
            }
          }
        }

        return entries.join("\n");
      }

      // For trial balance
      if (answer.trialBalance?.balances) {
        return Object.entries(answer.trialBalance.balances)
          .map(([account, amount]) => {
            const value = amount as number;
            if (value > 0) {
              return `${account}: 借方${value.toLocaleString()}円`;
            } else if (value < 0) {
              return `${account}: 貸方${Math.abs(value).toLocaleString()}円`;
            }
            return `${account}: 0円`;
          })
          .join("\n");
      }

      // Fallback - avoid showing [object Object]
      // Try to show a meaningful representation
      const keys = Object.keys(answer);
      if (keys.length > 0) {
        // Don't show raw object, return a message instead
        return "（詳細は解説をご確認ください）";
      }

      return JSON.stringify(answer, null, 2);
    } catch (e) {
      return "（表示エラー）";
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
