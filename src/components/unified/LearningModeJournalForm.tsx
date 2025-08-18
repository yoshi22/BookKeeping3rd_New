/**
 * 学習モード仕訳エントリフォーム
 * JournalEntryForm分割 - Phase 3
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  useTheme,
  useThemedStyles,
  type Theme,
} from "../../context/ThemeContext";
import NumericPad from "../ui/NumericPad";
import { AccountPickerButton } from "./JournalAccountSelector";
import { LearningModeJournalProps, JournalEntry } from "./JournalFormTypes";
import { confirmAmountFromPad, formatAmountDisplay } from "./JournalFormUtils";

export const LearningModeJournalForm: React.FC<LearningModeJournalProps> = ({
  debits,
  credits,
  onAddDebit,
  onRemoveDebit,
  onUpdateDebit,
  onAddCredit,
  onRemoveCredit,
  onUpdateCredit,
  onAccountSelect,
  onSubmit,
  isSubmitting,
  showSubmitButton,
}) => {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  // Numeric pad state
  const [numericPadVisible, setNumericPadVisible] = useState(false);
  const [currentAmountEdit, setCurrentAmountEdit] = useState<{
    type: "debit" | "credit";
    index: number;
  } | null>(null);
  const [tempAmount, setTempAmount] = useState("");

  // Numeric pad functions
  const openNumericPad = (type: "debit" | "credit", index: number) => {
    const currentValue =
      type === "debit"
        ? debits[index].amount.toString()
        : credits[index].amount.toString();
    setTempAmount(currentValue === "0" ? "" : currentValue);
    setCurrentAmountEdit({ type, index });
    setNumericPadVisible(true);
  };

  const confirmAmount = () => {
    if (currentAmountEdit) {
      confirmAmountFromPad(
        tempAmount,
        currentAmountEdit.type,
        currentAmountEdit.index,
        onUpdateDebit,
        onUpdateCredit,
      );
    }
    setNumericPadVisible(false);
    setCurrentAmountEdit(null);
    setTempAmount("");
  };

  // Amount input component for learning mode
  const renderAmountInput = (
    type: "debit" | "credit",
    entry: JournalEntry,
    index: number,
  ) => {
    const entries = type === "debit" ? debits : credits;

    return (
      <TouchableOpacity
        style={[
          styles.amountInput,
          entries.length > 1 ? styles.amountInputWithButton : {},
        ]}
        onPress={() => openNumericPad(type, index)}
        testID={
          index === 0 ? `${type}-amount-input` : `${type}-amount-input-${index}`
        }
        accessibilityLabel={`${type === "debit" ? "借方" : "貸方"}金額入力 ${index + 1}`}
      >
        <Text style={styles.amountText}>
          {entry.amount > 0 ? entry.amount.toLocaleString() : "金額を入力"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} testID="learning-mode-journal-form">
      {/* Journal table */}
      <View style={styles.journalTable}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.debitHeader]}>借方</Text>
          <Text style={[styles.headerText, styles.creditHeader]}>貸方</Text>
        </View>

        <View style={styles.tableContent}>
          {/* Debit section */}
          <View style={styles.debitSection}>
            <Text style={styles.sectionLabel}>借方</Text>
            {debits.map((debit, index) => (
              <View key={index} style={styles.entryRow}>
                <AccountPickerButton
                  account={debit.account}
                  onPress={() => onAccountSelect("debit", index)}
                  testID={
                    index === 0
                      ? "debit-account-dropdown"
                      : `debit-account-dropdown-${index}`
                  }
                  accessibilityLabel={`借方勘定科目選択 ${index + 1}`}
                />

                <View style={styles.amountRow}>
                  {renderAmountInput("debit", debit, index)}

                  {debits.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => onRemoveDebit(index)}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            {debits.length < 4 && (
              <TouchableOpacity style={styles.addButton} onPress={onAddDebit}>
                <Text style={styles.addButtonText}>+ 借方を追加</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Credit section */}
          <View style={styles.creditSection}>
            <Text style={styles.sectionLabel}>貸方</Text>
            {credits.map((credit, index) => (
              <View key={index} style={styles.entryRow}>
                <AccountPickerButton
                  account={credit.account}
                  onPress={() => onAccountSelect("credit", index)}
                  testID={
                    index === 0
                      ? "credit-account-dropdown"
                      : `credit-account-dropdown-${index}`
                  }
                  accessibilityLabel={`貸方勘定科目選択 ${index + 1}`}
                />

                <View style={styles.amountRow}>
                  {renderAmountInput("credit", credit, index)}

                  {credits.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => onRemoveCredit(index)}
                    >
                      <Text style={styles.removeButtonText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            {credits.length < 4 && (
              <TouchableOpacity style={styles.addButton} onPress={onAddCredit}>
                <Text style={styles.addButtonText}>+ 貸方を追加</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Totals */}
      <View style={styles.totalContainer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>借方合計:</Text>
          <Text style={styles.totalAmount}>
            {formatAmountDisplay(
              debits.reduce((sum, entry) => sum + (entry.amount || 0), 0),
            )}
            円
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>貸方合計:</Text>
          <Text style={styles.totalAmount}>
            {formatAmountDisplay(
              credits.reduce((sum, entry) => sum + (entry.amount || 0), 0),
            )}
            円
          </Text>
        </View>
      </View>

      {/* Submit button */}
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
        </View>
      )}

      {/* Numeric pad */}
      <NumericPad
        visible={numericPadVisible}
        value={tempAmount}
        onValueChange={setTempAmount}
        onClose={confirmAmount}
        placeholder="金額を入力"
        label="金額入力"
        maxLength={10}
      />
    </ScrollView>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    journalTable: {
      margin: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      overflow: "hidden",
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
    },
    headerText: {
      flex: 1,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.background,
    },
    debitHeader: {
      borderRightWidth: 1,
      borderRightColor: theme.colors.background,
    },
    creditHeader: {},
    tableContent: {
      flexDirection: "row",
      minHeight: 200,
    },
    debitSection: {
      flex: 1,
      padding: 12,
      borderRightWidth: 1,
      borderRightColor: theme.colors.border,
    },
    creditSection: {
      flex: 1,
      padding: 12,
    },
    sectionLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 12,
      textAlign: "center",
    },
    entryRow: {
      flexDirection: "column",
      marginBottom: 12,
      gap: 8,
    },
    amountRow: {
      flexDirection: "row",
      width: "100%",
      gap: 8,
      alignItems: "center",
    },
    amountInput: {
      flex: 1,
      height: 50,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 4,
      paddingHorizontal: 12,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "flex-end",
    },
    amountText: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "600",
    },
    amountInputWithButton: {},
    removeButton: {
      width: 36,
      height: 36,
      backgroundColor: theme.colors.error,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    removeButtonText: {
      color: theme.colors.background,
      fontSize: 18,
      fontWeight: "bold",
    },
    addButton: {
      padding: 8,
      backgroundColor: theme.colors.primary + "20",
      borderRadius: 4,
      alignItems: "center",
      marginTop: 8,
    },
    addButtonText: {
      color: theme.colors.primary,
      fontSize: 14,
      fontWeight: "600",
    },
    totalContainer: {
      margin: 16,
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      ...theme.shadows.medium,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    totalAmount: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    submitContainer: {
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    submitButton: {
      padding: 15,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 50,
    },
    submitButtonDisabled: {
      backgroundColor: theme.colors.border,
    },
    submitButtonText: {
      fontSize: 16,
      color: theme.colors.background,
      fontWeight: "bold",
    },
  });
