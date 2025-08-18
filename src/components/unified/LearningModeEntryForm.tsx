/**
 * 学習モード帳簿エントリフォーム
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
import AnswerGuide from "../AnswerGuide";
import { LearningModeProps, LedgerEntry } from "./LedgerFormTypes";
import { formatCurrency } from "./LedgerFormUtils";

export const LearningModeEntryForm: React.FC<LearningModeProps> = ({
  entries,
  onAddEntry,
  onRemoveEntry,
  onUpdateEntry,
  onSubmit,
  isSubmitting,
  showSubmitButton,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [showGuide, setShowGuide] = useState(false);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>総勘定元帳記入</Text>

        {entries.map((entry, index) => (
          <LearningEntryItem
            key={index}
            entry={entry}
            index={index}
            onUpdate={onUpdateEntry}
            onRemove={onRemoveEntry}
            canRemove={entries.length > 1}
          />
        ))}

        {/* Add entry button */}
        <TouchableOpacity style={styles.addButton} onPress={onAddEntry}>
          <Text style={styles.addButtonText}>+ エントリーを追加</Text>
        </TouchableOpacity>

        {/* Summary section */}
        <SummarySection entries={entries} />
      </View>

      {/* Submit section */}
      {showSubmitButton && (
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={onSubmit}
            disabled={isSubmitting}
            testID="submit-answer-button"
            accessibilityLabel="解答を送信"
          >
            {isSubmitting ? (
              <ActivityIndicator color={theme.colors.surface} />
            ) : (
              <Text style={styles.submitButtonText}>解答を送信</Text>
            )}
          </TouchableOpacity>

          {/* Answer guide */}
          <TouchableOpacity
            style={styles.guideButton}
            onPress={() => setShowGuide(!showGuide)}
          >
            <Text style={styles.guideButtonText}>
              {showGuide ? "ガイドを隠す" : "解答ガイドを表示"}
            </Text>
          </TouchableOpacity>

          <AnswerGuide
            questionType="ledger"
            visible={showGuide}
            onClose={() => setShowGuide(false)}
          />
        </View>
      )}
    </ScrollView>
  );
};

/**
 * 学習モード個別エントリーアイテム
 */
interface LearningEntryItemProps {
  entry: LedgerEntry;
  index: number;
  onUpdate: (index: number, field: keyof LedgerEntry, value: any) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const LearningEntryItem: React.FC<LearningEntryItemProps> = ({
  entry,
  index,
  onUpdate,
  onRemove,
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

      {/* Amount inputs */}
      <View style={styles.amountRow}>
        <View style={styles.amountColumn}>
          <Text style={styles.inputLabel}>入金額</Text>
          <TextInput
            style={styles.numberInput}
            value={
              entry.receipt_amount > 0 ? entry.receipt_amount.toString() : ""
            }
            onChangeText={(value) => {
              const numValue = parseInt(value.replace(/,/g, "")) || 0;
              onUpdate(index, "receipt_amount", numValue);
            }}
            placeholder="0"
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
        <View style={styles.amountColumn}>
          <Text style={styles.inputLabel}>出金額</Text>
          <TextInput
            style={styles.numberInput}
            value={
              entry.payment_amount > 0 ? entry.payment_amount.toString() : ""
            }
            onChangeText={(value) => {
              const numValue = parseInt(value.replace(/,/g, "")) || 0;
              onUpdate(index, "payment_amount", numValue);
            }}
            placeholder="0"
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
      </View>
    </View>
  );
};

/**
 * 合計セクション
 */
interface SummarySectionProps {
  entries: LedgerEntry[];
}

const SummarySection: React.FC<SummarySectionProps> = ({ entries }) => {
  const styles = useThemedStyles(createStyles);

  const receiptTotal = entries.reduce(
    (sum, entry) => sum + entry.receipt_amount,
    0,
  );
  const paymentTotal = entries.reduce(
    (sum, entry) => sum + entry.payment_amount,
    0,
  );

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>合計</Text>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>入金合計:</Text>
        <Text style={styles.totalAmount}>{formatCurrency(receiptTotal)}円</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>出金合計:</Text>
        <Text style={styles.totalAmount}>{formatCurrency(paymentTotal)}円</Text>
      </View>
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
    amountRow: {
      flexDirection: "row",
      gap: 16,
    },
    amountColumn: {
      flex: 1,
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
    submitContainer: {
      marginTop: 20,
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
    submitButtonDisabled: {
      opacity: 0.7,
    },
    submitButtonText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "600",
    },
    guideButton: {
      backgroundColor: theme.colors.secondary,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
    },
    guideButtonText: {
      color: theme.colors.surface,
      fontSize: 14,
      fontWeight: "500",
    },
  });
