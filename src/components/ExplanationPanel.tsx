/**
 * 解説表示コンポーネント
 * Step 2.1.5: 問題文・解説表示コンポーネント実装
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";

interface ExplanationPanelProps {
  explanation: string;
  isVisible?: boolean;
  isCorrect?: boolean;
  userAnswer?: Record<string, any>;
  correctAnswer?: Record<string, any>;
  showAnswerComparison?: boolean;
}

export default function ExplanationPanel({
  explanation,
  isVisible = false,
  isCorrect,
  userAnswer,
  correctAnswer,
  showAnswerComparison = false,
}: ExplanationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // 解説文のフォーマット
  const formatExplanationText = (text: string): string => {
    return text.replace(/\\n/g, "\n").trim();
  };

  // 解答比較の表示
  const renderAnswerComparison = () => {
    if (!correctAnswer) {
      return null;
    }

    return (
      <View style={styles.comparisonSection}>
        <Text style={styles.comparisonTitle}>📋 正解</Text>

        {/* 正解の表示 */}
        {renderCorrectAnswer()}

        {/* ユーザーの解答がある場合は比較表示 */}
        {userAnswer && showAnswerComparison && renderUserAnswerComparison()}
      </View>
    );
  };

  // 正解の表示
  const renderCorrectAnswer = () => {
    if (!correctAnswer) return null;

    
    // 伝票問題の場合（vouchers配列）
    if (correctAnswer.vouchers && Array.isArray(correctAnswer.vouchers)) {
      const vouchers = correctAnswer.vouchers;
      return (
        <View style={styles.correctAnswerSection}>
          <Text style={styles.correctAnswerTitle}>正答</Text>
          {vouchers.map((voucher: any, vIndex: number) => (
            <View key={vIndex} style={styles.voucherBox}>
              <Text style={styles.voucherTitle}>{voucher.type}</Text>
              {voucher.entries && voucher.entries.map((entry: any, eIndex: number) => (
                <View key={eIndex} style={styles.voucherEntry}>
                  {entry.date && (
                    <Text style={styles.entryText}>日付: {entry.date}</Text>
                  )}
                  {entry.account && (
                    <Text style={styles.entryText}>勘定科目: {entry.account}</Text>
                  )}
                  {entry.amount !== undefined && (
                    <Text style={styles.entryText}>金額: {formatAnswerValue(entry.amount)}円</Text>
                  )}
                  {entry.debit_account && (
                    <Text style={styles.entryText}>借方科目: {entry.debit_account}</Text>
                  )}
                  {entry.debit_amount !== undefined && (
                    <Text style={styles.entryText}>借方金額: {formatAnswerValue(entry.debit_amount)}円</Text>
                  )}
                  {entry.credit_account && (
                    <Text style={styles.entryText}>貸方科目: {entry.credit_account}</Text>
                  )}
                  {entry.credit_amount !== undefined && (
                    <Text style={styles.entryText}>貸方金額: {formatAnswerValue(entry.credit_amount)}円</Text>
                  )}
                  {entry.description && (
                    <Text style={styles.entryText}>摘要: {entry.description}</Text>
                  )}
                  {entry.customer && (
                    <Text style={styles.entryText}>得意先: {entry.customer}</Text>
                  )}
                  {entry.supplier && (
                    <Text style={styles.entryText}>仕入先: {entry.supplier}</Text>
                  )}
                  {entry.payment_type && (
                    <Text style={styles.entryText}>取引区分: {entry.payment_type}</Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    }

    // 選択問題の場合（single_choice/multiple_choice）
    if (correctAnswer.selected !== undefined || correctAnswer.selected_options !== undefined) {
      return (
        <View style={styles.correctAnswerSection}>
          <Text style={styles.correctAnswerTitle}>正答</Text>
          <View style={styles.choiceAnswerBox}>
            {correctAnswer.selected !== undefined ? (
              <Text style={styles.selectedText}>
                正解: {correctAnswer.selected}番
              </Text>
            ) : correctAnswer.selected_options ? (
              <Text style={styles.selectedText}>
                正解: {correctAnswer.selected_options.join(", ")}
              </Text>
            ) : null}
          </View>
        </View>
      );
    }


    // 帳簿問題（複数エントリ）の場合
    if (correctAnswer.ledgerEntry?.entries) {
      const entries = correctAnswer.ledgerEntry.entries;
      return (
        <View style={styles.correctAnswerSection}>
          <Text style={styles.correctAnswerTitle}>正答</Text>
          {entries.map((entry: any, index: number) => (
            <View key={index} style={styles.ledgerEntryBox}>
              <Text style={styles.entryHeader}>エントリ {index + 1}</Text>
              <Text style={styles.entryText}>日付: {entry.date || "N/A"}</Text>
              <Text style={styles.entryText}>
                摘要: {entry.description || "N/A"}
              </Text>
              <Text style={styles.entryText}>
                借方金額:{" "}
                {formatAnswerValue(
                  entry.debitAmount || entry.debit_amount || entry.amount || 0,
                )}
                円
              </Text>
              <Text style={styles.entryText}>
                貸方金額:{" "}
                {formatAnswerValue(
                  entry.creditAmount || entry.credit_amount || 0,
                )}
                円
              </Text>
            </View>
          ))}
        </View>
      );
    }

    // 新形式の帳簿問題（entries直接配列）の場合
    if (correctAnswer.entries && Array.isArray(correctAnswer.entries)) {
      const entries = correctAnswer.entries;
      return (
        <View style={styles.correctAnswerSection}>
          <Text style={styles.correctAnswerTitle}>正答</Text>
          <View style={styles.ledgerTableBox}>
            <View style={styles.ledgerTableHeader}>
              <Text style={styles.ledgerHeaderText}>日付</Text>
              <Text style={styles.ledgerHeaderText}>摘要</Text>
              <Text style={styles.ledgerHeaderText}>借方</Text>
              <Text style={styles.ledgerHeaderText}>貸方</Text>
              <Text style={styles.ledgerHeaderText}>残高</Text>
            </View>
            {entries.map((entry: any, index: number) => {
              // debitとbalanceがネストされている場合の処理
              const debitValue =
                typeof entry.debit === "object" && entry.debit?.entries
                  ? entry.debit.entries[0]?.amount || 0
                  : entry.debit || 0;
              const creditValue = entry.credit || 0;
              const balanceValue =
                typeof entry.balance === "object" && entry.balance?.entries
                  ? entry.balance.entries[0]?.amount || 0
                  : entry.balance || 0;

              return (
                <View key={index} style={styles.ledgerTableRow}>
                  <Text style={styles.ledgerCellText}>{entry.date || ""}</Text>
                  <Text style={styles.ledgerCellText}>
                    {entry.description || ""}
                  </Text>
                  <Text style={styles.ledgerCellAmount}>
                    {debitValue > 0 ? formatAnswerValue(debitValue) : ""}
                  </Text>
                  <Text style={styles.ledgerCellAmount}>
                    {creditValue > 0 ? formatAnswerValue(creditValue) : ""}
                  </Text>
                  <Text style={styles.ledgerCellAmount}>
                    {balanceValue > 0 ? formatAnswerValue(balanceValue) : ""}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      );
    }

    // 仕訳問題の場合（新形式：journalEntries配列）
    if (
      correctAnswer.journalEntries &&
      Array.isArray(correctAnswer.journalEntries)
    ) {
      return (
        <View style={styles.correctAnswerSection}>
          <Text style={styles.correctAnswerTitle}>正答</Text>
          <View style={styles.journalEntryBox}>
            <View style={styles.journalRow}>
              <View style={styles.journalColumn}>
                <Text style={styles.journalHeader}>借方</Text>
                {correctAnswer.journalEntries.map(
                  (entry: any, index: number) => {
                    if (entry.debit_account && entry.debit_amount > 0) {
                      return (
                        <View key={`debit-${index}`} style={styles.entryRow}>
                          <Text style={styles.entryText}>
                            {entry.debit_account}
                          </Text>
                          <Text style={styles.entryAmount}>
                            {formatAnswerValue(entry.debit_amount)}円
                          </Text>
                        </View>
                      );
                    }
                    return null;
                  },
                )}
              </View>
              <View style={styles.journalDivider} />
              <View style={styles.journalColumn}>
                <Text style={styles.journalHeader}>貸方</Text>
                {correctAnswer.journalEntries.map(
                  (entry: any, index: number) => {
                    if (entry.credit_account && entry.credit_amount > 0) {
                      return (
                        <View key={`credit-${index}`} style={styles.entryRow}>
                          <Text style={styles.entryText}>
                            {entry.credit_account}
                          </Text>
                          <Text style={styles.entryAmount}>
                            {formatAnswerValue(entry.credit_amount)}円
                          </Text>
                        </View>
                      );
                    }
                    return null;
                  },
                )}
              </View>
            </View>
          </View>
        </View>
      );
    }

    // 仕訳問題の場合（旧形式：journalEntry単一オブジェクト - 後方互換性のため残す）
    if (correctAnswer.journalEntry) {
      const entry = correctAnswer.journalEntry;
      return (
        <View style={styles.correctAnswerSection}>
          <Text style={styles.correctAnswerTitle}>正答</Text>
          <View style={styles.journalEntryBox}>
            <Text style={styles.entryText}>
              借方科目: {entry.debit_account}
            </Text>
            <Text style={styles.entryText}>
              借方金額: {formatAnswerValue(entry.debit_amount)}円
            </Text>
            <Text style={styles.entryText}>
              貸方科目: {entry.credit_account}
            </Text>
            <Text style={styles.entryText}>
              貸方金額: {formatAnswerValue(entry.credit_amount)}円
            </Text>
          </View>
        </View>
      );
    }

    // その他の問題タイプ
    return (
      <View style={styles.correctAnswerSection}>
        <Text style={styles.correctAnswerTitle}>正答</Text>
        <View style={styles.answerBox}>
          {Object.entries(correctAnswer).map(([key, value]) => (
            <Text key={key} style={styles.answerText}>
              {key}: {formatAnswerValue(value)}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  // ユーザーの解答との比較表示
  const renderUserAnswerComparison = () => {
    if (!userAnswer) return null;

    return (
      <View style={styles.userAnswerSection}>
        <Text style={styles.userAnswerTitle}>あなたの解答</Text>
        <View
          style={[
            styles.answerBox,
            isCorrect ? styles.correctAnswerBox : styles.incorrectAnswerBox,
          ]}
        >
          {/* 複数エントリの場合 */}
          {userAnswer.entries && Array.isArray(userAnswer.entries)
            ? userAnswer.entries.map((entry: any, index: number) => (
                <View key={index} style={styles.userEntryBox}>
                  <Text style={styles.entryHeader}>エントリ {index + 1}</Text>
                  <Text style={styles.entryText}>
                    日付: {entry.date || "N/A"}
                  </Text>
                  <Text style={styles.entryText}>
                    摘要: {entry.description || "N/A"}
                  </Text>
                  <Text style={styles.entryText}>
                    借方金額: {formatAnswerValue(entry.debit_amount || 0)}円
                  </Text>
                  <Text style={styles.entryText}>
                    貸方金額: {formatAnswerValue(entry.credit_amount || 0)}円
                  </Text>
                </View>
              ))
            : Object.entries(userAnswer).map(([key, value]) => (
                <Text key={key} style={styles.answerText}>
                  {key}: {formatAnswerValue(value)}
                </Text>
              ))}
        </View>

        {/* 判定結果 */}
        <View
          style={[
            styles.resultBadge,
            isCorrect ? styles.correctBadge : styles.incorrectBadge,
          ]}
        >
          <Text style={styles.resultBadgeText}>
            {isCorrect ? "✓ 正解" : "✗ 不正解"}
          </Text>
        </View>
      </View>
    );
  };

  // 解答値のフォーマット
  const formatAnswerValue = (value: any): string => {
    if (typeof value === "number") {
      return value.toLocaleString();
    }
    return String(value || "");
  };

  // 結果アイコンの表示
  const renderResultIcon = () => {
    if (isCorrect === undefined) return null;

    return (
      <View
        style={[
          styles.resultIcon,
          isCorrect ? styles.correctIcon : styles.incorrectIcon,
        ]}
      >
        <Text style={styles.resultIconText}>{isCorrect ? "✓" : "✗"}</Text>
      </View>
    );
  };

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          {renderResultIcon()}
          <Text style={styles.title}>解説</Text>
          <Text style={styles.expandIcon}>{isExpanded ? "▲" : "▼"}</Text>
        </View>
      </TouchableOpacity>

      {/* 解説内容 */}
      {isExpanded && (
        <View style={styles.content}>
          {/* 解答比較 */}
          {renderAnswerComparison()}

          {/* 解説文 */}
          <View style={styles.explanationSection}>
            <Text style={styles.explanationTitle}>詳細解説</Text>
            <ScrollView
              style={styles.explanationContainer}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.explanationText}>
                {formatExplanationText(explanation)}
              </Text>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    margin: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#fff3e0",
    borderBottomWidth: 1,
    borderBottomColor: "#ffcc02",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  resultIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  correctIcon: {
    backgroundColor: "#4caf50",
  },
  incorrectIcon: {
    backgroundColor: "#f44336",
  },
  resultIconText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  expandIcon: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    padding: 16,
  },
  comparisonSection: {
    marginBottom: 20,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  comparisonContent: {
    gap: 12,
  },
  answerBlock: {
    marginBottom: 8,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 6,
  },
  answerBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  correctAnswerBox: {
    backgroundColor: "#e8f5e8",
    borderColor: "#4caf50",
  },
  incorrectAnswerBox: {
    backgroundColor: "#ffeaea",
    borderColor: "#f44336",
  },
  answerText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  explanationSection: {
    marginBottom: 20,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  explanationContainer: {
    maxHeight: 200,
  },
  explanationText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#444",
    textAlign: "left",
  },
  correctAnswerSection: {
    marginBottom: 16,
  },
  correctAnswerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4caf50",
    marginBottom: 12,
    textAlign: "center",
  },
  userAnswerSection: {
    marginTop: 16,
  },
  userAnswerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  ledgerEntryBox: {
    backgroundColor: "#e8f5e8",
    borderColor: "#4caf50",
    borderWidth: 2,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  journalEntryBox: {
    backgroundColor: "#e8f5e8",
    borderColor: "#4caf50",
    borderWidth: 2,
    padding: 12,
    borderRadius: 8,
  },
  userEntryBox: {
    padding: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  entryHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  entryText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
    lineHeight: 18,
  },
  resultBadge: {
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  correctBadge: {
    backgroundColor: "#4caf50",
  },
  incorrectBadge: {
    backgroundColor: "#f44336",
  },
  resultBadgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  journalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  journalColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  journalHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#4caf50",
    paddingBottom: 4,
  },
  journalDivider: {
    width: 1,
    backgroundColor: "#4caf50",
    marginHorizontal: 8,
  },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingVertical: 2,
  },
  entryAmount: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
    marginLeft: 8,
  },
  ledgerTableBox: {
    backgroundColor: "#e8f5e8",
    borderColor: "#4caf50",
    borderWidth: 2,
    borderRadius: 8,
    overflow: "hidden",
  },
  ledgerTableHeader: {
    flexDirection: "row",
    backgroundColor: "#4caf50",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  ledgerHeaderText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  ledgerTableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  ledgerCellText: {
    flex: 1,
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  ledgerCellAmount: {
    flex: 1,
    fontSize: 12,
    color: "#333",
    textAlign: "right",
    fontWeight: "500",
  },

  voucherBox: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  voucherTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 4,
  },
  voucherEntry: {
    paddingVertical: 4,
    paddingLeft: 8,
  },
  choiceAnswerBox: {
    backgroundColor: "#f0f8ff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4a90e2",
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
