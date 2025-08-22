/**
 * 統合版仕訳入力フォーム - 復旧版
 * リファクタリング前の機能を復旧（水平レイアウト、NumericPad、貸借合計表示）
 * 2025-08-22 復旧実施
 */

import React, { useState } from "react";
import { logger } from "../../utils/logger";
import {
  View,
  Text,
  Alert,
  ActionSheetIOS,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Button } from "../ui/Button";
import {
  useTheme,
  useThemedStyles,
  type Theme,
} from "../../context/ThemeContext";
import { STANDARD_ACCOUNT_OPTIONS } from "../shared/AccountOptions";
import { SessionType } from "../../types/database";
import NumericPad from "../ui/NumericPad";
import { answerService } from "../../services/answer-service";

// 統合されたコンポーネントのインポート
import { UnifiedAccountSelector } from "./UnifiedAccountSelector";

// 型定義とユーティリティのインポート
import {
  JournalEntry,
  JournalFormState,
  JournalSelectionState,
  UnifiedJournalEntryFormProps,
} from "./JournalFormTypes";
import {
  createInitialFormState as createInitialJournalFormState,
  createInitialJournalEntry,
  validateJournalEntries,
  createJournalAnswerRequest as createLearningJournalAnswerRequest,
  submitLearningAnswer as submitLearningJournalAnswer,
  showValidationErrors as showJournalValidationErrors,
} from "./UnifiedFormUtils";

const UnifiedJournalEntryForm = React.memo(function UnifiedJournalEntryForm({
  questionId,
  questionText,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
  showSubmitButton = true,

  // 模試モード固有プロパティ
  questionNumber,
  totalQuestions,
  timeRemaining,
  explanation,
  correctAnswer,
  userAnswer,
  isCorrect,
  showExplanation,
  onNext,
  onPrevious,

  // 統合モード制御
  mode = "learning",
  onDirectSubmit,
  onSubmit,
}: UnifiedJournalEntryFormProps) {
  // Theme system integration
  const { theme } = useTheme();
  const styles = useThemedStyles(createThemedStyles);

  // Form state
  const [formState, setFormState] = useState<JournalFormState>(
    createInitialJournalFormState(),
  );

  // Journal entry state
  const [debits, setDebits] = useState<JournalEntry[]>([
    createInitialJournalEntry(),
  ]);
  const [credits, setCredits] = useState<JournalEntry[]>([
    createInitialJournalEntry(),
  ]);

  // Account selection state
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelection, setCurrentSelection] =
    useState<JournalSelectionState | null>(null);

  // Numeric pad state
  const [numericPadVisible, setNumericPadVisible] = useState(false);
  const [currentAmountEdit, setCurrentAmountEdit] = useState<{
    type: "debit" | "credit";
    index: number;
  } | null>(null);
  const [tempAmount, setTempAmount] = useState("");

  // Entry management functions
  const addDebitRow = () => {
    if (debits.length < 4) {
      setDebits([...debits, createInitialJournalEntry()]);
    }
  };

  const addCreditRow = () => {
    if (credits.length < 4) {
      setCredits([...credits, createInitialJournalEntry()]);
    }
  };

  const removeDebitRow = (index: number) => {
    if (debits.length > 1) {
      setDebits(debits.filter((_, i) => i !== index));
    }
  };

  const removeCreditRow = (index: number) => {
    if (credits.length > 1) {
      setCredits(credits.filter((_, i) => i !== index));
    }
  };

  const updateDebit = (
    index: number,
    field: keyof JournalEntry,
    value: string | number,
  ) => {
    const newDebits = [...debits];
    if (field === "amount") {
      newDebits[index].amount =
        typeof value === "string" ? parseInt(value) || 0 : value;
    } else {
      newDebits[index].account = value as string;
    }
    setDebits(newDebits);
  };

  const updateCredit = (
    index: number,
    field: keyof JournalEntry,
    value: string | number,
  ) => {
    const newCredits = [...credits];
    if (field === "amount") {
      newCredits[index].amount =
        typeof value === "string" ? parseInt(value) || 0 : value;
    } else {
      newCredits[index].account = value as string;
    }
    setCredits(newCredits);
  };

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
    if (currentAmountEdit && tempAmount) {
      const numericAmount = parseInt(tempAmount) || 0;
      if (currentAmountEdit.type === "debit") {
        updateDebit(currentAmountEdit.index, "amount", numericAmount);
      } else {
        updateCredit(currentAmountEdit.index, "amount", numericAmount);
      }
    }
    setNumericPadVisible(false);
    setCurrentAmountEdit(null);
    setTempAmount("");
  };

  // Amount formatting helper
  const formatAmountDisplay = (amount: number): string => {
    return amount > 0 ? amount.toLocaleString() : "";
  };

  // Account selection
  const showAccountSelector = (type: "debit" | "credit", index: number) => {
    if (Platform.OS === "ios") {
      const options = STANDARD_ACCOUNT_OPTIONS.map((option) => option.label);
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: "勘定科目を選択",
          options: ["キャンセル", ...options],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            const selectedAccount = STANDARD_ACCOUNT_OPTIONS[buttonIndex - 1];
            if (type === "debit") {
              updateDebit(index, "account", selectedAccount.value);
            } else {
              updateCredit(index, "account", selectedAccount.value);
            }
          }
        },
      );
    } else {
      setCurrentSelection({ type, index });
      setModalVisible(true);
    }
  };

  const selectAccountFromModal = (account: {
    label: string;
    value: string;
  }) => {
    if (currentSelection) {
      if (currentSelection.type === "debit") {
        updateDebit(currentSelection.index, "account", account.value);
      } else {
        updateCredit(currentSelection.index, "account", account.value);
      }
    }
    setModalVisible(false);
    setCurrentSelection(null);
  };

  // Validation and submission
  const validateAndSubmit = async () => {
    logger.debug("[JournalEntryForm] validateAndSubmit called");
    logger.debug("[JournalEntryForm] Current form state:", formState);
    logger.debug("[JournalEntryForm] Current debits:", debits);
    logger.debug("[JournalEntryForm] Current credits:", credits);

    if (formState.isSubmitting) {
      logger.debug("[JournalEntryForm] Already submitting, returning");
      return;
    }

    // Validate entries - combine debits and credits into single array
    const allEntries = [
      ...debits.map((d) => ({
        account: d.account,
        amount: d.amount,
        type: "debit" as const,
      })),
      ...credits.map((c) => ({
        account: c.account,
        amount: c.amount,
        type: "credit" as const,
      })),
    ];
    logger.debug(
      "[JournalEntryForm] Combined entries for validation:",
      allEntries,
    );

    const validation = validateJournalEntries(allEntries);
    logger.debug("[JournalEntryForm] Validation result:", validation);

    if (!validation.isValid) {
      logger.warn("[JournalEntryForm] Validation failed:", validation.errors);
      showJournalValidationErrors(validation.errors);
      return;
    }

    try {
      setFormState({ ...formState, isSubmitting: true });

      // Handle submission based on mode
      if (mode === "mock_exam" && (onDirectSubmit || onSubmit)) {
        // 模試モード: 直接コールバック実行
        const validDebits = debits.filter(
          (entry) => entry.account && entry.amount > 0,
        );
        const validCredits = credits.filter(
          (entry) => entry.account && entry.amount > 0,
        );

        if (onDirectSubmit) {
          onDirectSubmit({ debits: validDebits, credits: validCredits });
        } else if (onSubmit) {
          onSubmit(validDebits, validCredits);
        }
      } else {
        // 学習モード: answerService経由
        const request = createLearningJournalAnswerRequest(
          questionId,
          allEntries,
          sessionType as SessionType,
          sessionId,
          startTime,
        );

        await submitLearningJournalAnswer(request, onSubmitAnswer);
      }
    } catch (error) {
      logger.error("[UnifiedJournalEntryForm] 解答送信エラー:", error as Error);
      Alert.alert("エラー", "解答の送信に失敗しました");
    } finally {
      setFormState({ ...formState, isSubmitting: false });
    }
  };

  return (
    <View style={{ flex: 1 }} testID="unified-journal-entry-form">
      {/* Header for mock exam mode */}
      {mode === "mock_exam" && questionNumber && totalQuestions && (
        <View style={headerStyles.header}>
          <Text style={headerStyles.questionInfo}>
            問{questionNumber} / {totalQuestions}
          </Text>
          {timeRemaining && (
            <Text style={headerStyles.timeRemaining}>残り {timeRemaining}</Text>
          )}
        </View>
      )}

      {/* 統合されたフォーム表示 - テーブル形式 */}
      <ScrollView
        style={styles.container}
        testID="unified-journal-entry-form-content"
      >
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
                  <TouchableOpacity
                    style={styles.accountButton}
                    onPress={() => showAccountSelector("debit", index)}
                    testID={
                      index === 0
                        ? "debit-account-dropdown"
                        : `debit-account-dropdown-${index}`
                    }
                    accessibilityLabel={`借方勘定科目選択 ${index + 1}`}
                  >
                    <Text style={styles.accountButtonText}>
                      {debit.account || "勘定科目を選択"}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.amountRow}>
                    <TouchableOpacity
                      style={[
                        styles.amountInput,
                        debits.length > 1 ? styles.amountInputWithButton : {},
                      ]}
                      onPress={() => openNumericPad("debit", index)}
                      testID={
                        index === 0
                          ? "debit-amount-input"
                          : `debit-amount-input-${index}`
                      }
                      accessibilityLabel={`借方金額入力 ${index + 1}`}
                    >
                      <Text style={styles.amountText}>
                        {debit.amount > 0
                          ? formatAmountDisplay(debit.amount)
                          : "金額を入力"}
                      </Text>
                    </TouchableOpacity>

                    {debits.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeDebitRow(index)}
                      >
                        <Text style={styles.removeButtonText}>×</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}

              {debits.length < 4 && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addDebitRow}
                >
                  <Text style={styles.addButtonText}>+ 借方を追加</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Credit section */}
            <View style={styles.creditSection}>
              <Text style={styles.sectionLabel}>貸方</Text>
              {credits.map((credit, index) => (
                <View key={index} style={styles.entryRow}>
                  <TouchableOpacity
                    style={styles.accountButton}
                    onPress={() => showAccountSelector("credit", index)}
                    testID={
                      index === 0
                        ? "credit-account-dropdown"
                        : `credit-account-dropdown-${index}`
                    }
                    accessibilityLabel={`貸方勘定科目選択 ${index + 1}`}
                  >
                    <Text style={styles.accountButtonText}>
                      {credit.account || "勘定科目を選択"}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.amountRow}>
                    <TouchableOpacity
                      style={[
                        styles.amountInput,
                        credits.length > 1 ? styles.amountInputWithButton : {},
                      ]}
                      onPress={() => openNumericPad("credit", index)}
                      testID={
                        index === 0
                          ? "credit-amount-input"
                          : `credit-amount-input-${index}`
                      }
                      accessibilityLabel={`貸方金額入力 ${index + 1}`}
                    >
                      <Text style={styles.amountText}>
                        {credit.amount > 0
                          ? formatAmountDisplay(credit.amount)
                          : "金額を入力"}
                      </Text>
                    </TouchableOpacity>

                    {credits.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeCreditRow(index)}
                      >
                        <Text style={styles.removeButtonText}>×</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}

              {credits.length < 4 && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addCreditRow}
                >
                  <Text style={styles.addButtonText}>+ 貸方を追加</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Totals - 貸借合計表示 */}
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
                formState.isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={() => {
                logger.debug("[JournalEntryForm] Submit button pressed");
                validateAndSubmit();
              }}
              disabled={formState.isSubmitting}
              testID="submit-answer-button"
              accessibilityLabel="解答を送信"
            >
              {formState.isSubmitting ? (
                <ActivityIndicator color={theme.colors.surface} />
              ) : (
                <Text style={styles.submitButtonText}>解答を送信</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* 模試モードのナビゲーションボタン */}
        {mode === "mock_exam" && (onPrevious || onNext) && (
          <View style={styles.navButtonContainer}>
            {onPrevious && (
              <Button
                title="前の問題"
                onPress={onPrevious}
                variant="secondary"
                style={styles.navButton}
              />
            )}
            {onNext && (
              <Button
                title="次の問題"
                onPress={onNext}
                variant="secondary"
                style={styles.navButton}
                testID="next-question-button"
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* Account selection modal */}
      <UnifiedAccountSelector
        mode="modal"
        visible={modalVisible}
        onSelect={selectAccountFromModal}
        onClose={() => setModalVisible(false)}
        questionType="journal"
        label="勘定科目を選択"
      />

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
    </View>
  );
});

export default UnifiedJournalEntryForm;

// Header styles
const headerStyles = {
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  questionInfo: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#333",
  },
  timeRemaining: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600" as const,
  },
};

// テーマ統合スタイル
const createThemedStyles = (theme: Theme) =>
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
      ...theme.shadows.medium,
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
    accountButton: {
      width: "100%",
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 6,
      padding: 12,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
    },
    accountButtonText: {
      color: theme.colors.text,
      fontSize: 14,
      textAlign: "center",
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
      fontSize: 16,
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
    navButtonContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    navButton: {
      flex: 0.4,
      marginHorizontal: 8,
    },
  });
