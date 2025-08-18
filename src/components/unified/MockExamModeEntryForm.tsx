/**
 * 模試モード帳簿エントリフォーム
 * LedgerEntryForm分割 - Phase 2
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import {
  useTheme,
  useThemedStyles,
  type Theme,
} from "../../context/ThemeContext";
import ExplanationModal from "../mock-exam/ExplanationModal";
import { MockExamModeProps, MockExamLedgerEntry } from "./LedgerFormTypes";
import { AccountPicker } from "./AccountSelector";
import { formatCurrency, parseNumericInput } from "./LedgerFormUtils";

export const MockExamModeEntryForm: React.FC<MockExamModeProps> = ({
  entries,
  onAddEntry,
  onRemoveEntry,
  onUpdateEntry,
  onAccountSelect,
  onSubmit,
  onNext,
  onPrevious,
  explanation,
  questionText,
  onShowExplanation,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [explanationModalVisible, setExplanationModalVisible] = useState(false);

  const handleShowExplanation = () => {
    if (onShowExplanation) {
      onShowExplanation();
    } else {
      setExplanationModalVisible(true);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>総勘定元帳記入</Text>

        {entries.map((entry, index) => (
          <MockExamEntryItem
            key={index}
            entry={entry}
            index={index}
            onUpdate={onUpdateEntry}
            onRemove={onRemoveEntry}
            onAccountSelect={onAccountSelect}
            canRemove={entries.length > 1}
          />
        ))}

        {/* Add entry button */}
        <TouchableOpacity style={styles.addButton} onPress={onAddEntry}>
          <Text style={styles.addButtonText}>+ エントリーを追加</Text>
        </TouchableOpacity>

        {/* Summary section */}
        <MockExamSummarySection entries={entries} />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={onSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>解答確認</Text>
        </TouchableOpacity>

        {explanation && (
          <TouchableOpacity
            onPress={handleShowExplanation}
            style={styles.explanationButton}
          >
            <Text style={styles.explanationButtonText}>📖 解説を見る</Text>
          </TouchableOpacity>
        )}

        {/* Navigation */}
        {(onPrevious || onNext) && (
          <View style={styles.navigationContainer}>
            {onPrevious && (
              <TouchableOpacity onPress={onPrevious} style={styles.navButton}>
                <Text style={styles.navButtonText}>← 前の問題</Text>
              </TouchableOpacity>
            )}
            {onNext && (
              <TouchableOpacity onPress={onNext} style={styles.navButton}>
                <Text style={styles.navButtonText}>次の問題 →</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Explanation Modal */}
      {explanation && (
        <ExplanationModal
          visible={explanationModalVisible}
          explanation={explanation}
          questionText={questionText || ""}
          onClose={() => setExplanationModalVisible(false)}
        />
      )}
    </ScrollView>
  );
};

/**
 * 模試モード個別エントリーアイテム
 */
interface MockExamEntryItemProps {
  entry: MockExamLedgerEntry;
  index: number;
  onUpdate: (
    index: number,
    field: keyof MockExamLedgerEntry,
    value: any,
  ) => void;
  onRemove: (index: number) => void;
  onAccountSelect: (
    type: "debitAccount" | "creditAccount",
    index: number,
  ) => void;
  canRemove: boolean;
}

const MockExamEntryItem: React.FC<MockExamEntryItemProps> = ({
  entry,
  index,
  onUpdate,
  onRemove,
  onAccountSelect,
  canRemove,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryLabel}>エントリー {index + 1}</Text>
        {canRemove && (
          <TouchableOpacity
            onPress={() => onRemove(index)}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>削除</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Date input */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>日付</Text>
        <TextInput
          style={styles.textInput}
          value={entry.date}
          onChangeText={(value) => onUpdate(index, "date", value)}
          placeholder="例: 4/1"
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>

      {/* Description input */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>摘要</Text>
        <TextInput
          style={styles.textInput}
          value={entry.description}
          onChangeText={(value) => onUpdate(index, "description", value)}
          placeholder="取引内容を入力"
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>

      {/* Debit and Credit entries */}
      <View style={styles.entryRow}>
        {/* Debit column */}
        <View style={styles.entryColumn}>
          <Text style={styles.columnTitle}>借方</Text>
          <View style={styles.accountGroup}>
            <Text style={styles.inputLabel}>勘定科目</Text>
            <AccountPicker
              value={entry.debitAccount}
              onPress={() => onAccountSelect("debitAccount", index)}
              placeholder="勘定科目を選択"
            />
          </View>
          <View style={styles.accountGroup}>
            <Text style={styles.inputLabel}>金額</Text>
            <TextInput
              style={styles.numberInput}
              value={entry.debitAmount > 0 ? entry.debitAmount.toString() : ""}
              onChangeText={(value) => {
                const numValue = parseNumericInput(value);
                onUpdate(index, "debitAmount", numValue);
              }}
              placeholder="金額"
              keyboardType="numeric"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
        </View>

        {/* Credit column */}
        <View style={styles.entryColumn}>
          <Text style={styles.columnTitle}>貸方</Text>
          <View style={styles.accountGroup}>
            <Text style={styles.inputLabel}>勘定科目</Text>
            <AccountPicker
              value={entry.creditAccount}
              onPress={() => onAccountSelect("creditAccount", index)}
              placeholder="勘定科目を選択"
            />
          </View>
          <View style={styles.accountGroup}>
            <Text style={styles.inputLabel}>金額</Text>
            <TextInput
              style={styles.numberInput}
              value={
                entry.creditAmount > 0 ? entry.creditAmount.toString() : ""
              }
              onChangeText={(value) => {
                const numValue = parseNumericInput(value);
                onUpdate(index, "creditAmount", numValue);
              }}
              placeholder="金額"
              keyboardType="numeric"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

/**
 * 模試モード合計セクション
 */
interface MockExamSummarySectionProps {
  entries: MockExamLedgerEntry[];
}

const MockExamSummarySection: React.FC<MockExamSummarySectionProps> = ({
  entries,
}) => {
  const styles = useThemedStyles(createStyles);

  const debitTotal = entries.reduce((sum, entry) => sum + entry.debitAmount, 0);
  const creditTotal = entries.reduce(
    (sum, entry) => sum + entry.creditAmount,
    0,
  );
  const isBalanced = debitTotal === creditTotal && debitTotal > 0;

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>貸借対照表</Text>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>借方合計:</Text>
        <Text style={[styles.totalAmount, !isBalanced && styles.errorAmount]}>
          {formatCurrency(debitTotal)}円
        </Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>貸方合計:</Text>
        <Text style={[styles.totalAmount, !isBalanced && styles.errorAmount]}>
          {formatCurrency(creditTotal)}円
        </Text>
      </View>
      {!isBalanced && debitTotal > 0 && creditTotal > 0 && (
        <Text style={styles.balanceWarning}>
          ⚠️ 借方と貸方の金額が一致していません
        </Text>
      )}
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    formCard: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 20,
      textAlign: "center",
      color: theme.colors.text,
    },
    entryCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    entryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    entryLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    removeButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      backgroundColor: theme.colors.error,
    },
    removeButtonText: {
      color: theme.colors.surface,
      fontSize: 12,
      fontWeight: "600",
    },
    inputGroup: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 14,
      marginBottom: 8,
      fontWeight: "500",
      color: theme.colors.text,
    },
    textInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
    },
    entryRow: {
      flexDirection: "row",
      gap: 16,
    },
    entryColumn: {
      flex: 1,
    },
    columnTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 12,
      textAlign: "center",
      paddingBottom: 8,
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.primary,
      color: theme.colors.text,
    },
    accountGroup: {
      marginBottom: 12,
    },
    numberInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      textAlign: "right",
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
    },
    addButton: {
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 20,
      backgroundColor: theme.colors.primary,
    },
    addButtonText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "600",
    },
    summaryCard: {
      backgroundColor: theme.colors.primaryLight,
      borderRadius: 8,
      padding: 16,
      marginTop: 10,
    },
    summaryTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 12,
      textAlign: "center",
      color: theme.colors.text,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    totalLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.text,
    },
    totalAmount: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.primary,
    },
    errorAmount: {
      color: theme.colors.error,
    },
    balanceWarning: {
      fontSize: 12,
      color: theme.colors.error,
      textAlign: "center",
      marginTop: 8,
      fontWeight: "500",
    },
    buttonContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginBottom: 12,
    },
    submitButtonText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "600",
    },
    explanationButton: {
      backgroundColor: theme.colors.secondary,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
      marginBottom: 16,
    },
    explanationButtonText: {
      color: theme.colors.surface,
      fontSize: 14,
      fontWeight: "500",
    },
    navigationContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
    },
    navButton: {
      flex: 1,
      backgroundColor: theme.colors.border,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
    },
    navButtonText: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: "500",
    },
  });
