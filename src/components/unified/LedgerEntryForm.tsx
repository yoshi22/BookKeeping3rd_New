/**
 * 統合版帳簿エントリフォーム
 * 学習モードと模試モードの両方をサポート
 */

import React, { useState } from "react";
import { logger } from "../../utils/logger";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActionSheetIOS,
  Platform,
  Modal,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import {
  useTheme,
  useThemedStyles,
  useColors,
  useDynamicColors,
  type Theme,
} from "../../context/ThemeContext";
import {
  answerService,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from "../../services/answer-service";
import ExplanationModal from "../mock-exam/ExplanationModal";
import NumberInput from "../NumberInput";
import AnswerGuide from "../AnswerGuide";
import { LedgerEntry, UnifiedFormProps, FormState } from "../shared/FormTypes";
import { STANDARD_ACCOUNT_OPTIONS } from "../shared/AccountOptions";
import {
  createInitialFormState,
  validateDate,
  validateDescription,
  createSubmitAnswerRequest,
  formatAmount,
} from "../shared/FormUtils";

// 模試モード用のLedgerEntry型定義（既存との互換性のため）
export interface MockExamLedgerEntry {
  date: string;
  description: string;
  debitAccount: string;
  debitAmount: number;
  creditAccount: string;
  creditAmount: number;
}

export interface UnifiedLedgerEntryFormProps extends UnifiedFormProps {
  expectedEntries?: number; // 期待されるエントリ数
  // 模試モード用のコールバック
  onSubmit?: (entries: MockExamLedgerEntry[]) => void;
}

const UnifiedLedgerEntryForm = React.memo(function UnifiedLedgerEntryForm({
  questionId,
  questionText,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
  showSubmitButton = true,
  expectedEntries = 1,

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
}: UnifiedLedgerEntryFormProps) {
  // Theme system integration
  const { theme } = useTheme();
  const colors = useColors();
  const dynamicColors = useDynamicColors();
  const styles = useThemedStyles(createStyles);

  // Form state
  const [formState, setFormState] = useState<FormState>(
    createInitialFormState(),
  );
  const [showGuide, setShowGuide] = useState(false);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<{
    type: "debitAccount" | "creditAccount";
    index: number;
  } | null>(null);

  // Explanation modal state (模試モード用)
  const [explanationModalVisible, setExplanationModalVisible] = useState(false);

  // Entry state - 学習モードと模試モードで異なる形式
  const [learningEntries, setLearningEntries] = useState<LedgerEntry[]>([
    { date: "", description: "", receipt_amount: 0, payment_amount: 0 },
  ]);

  const [mockExamEntries, setMockExamEntries] = useState<MockExamLedgerEntry[]>(
    [
      {
        date: "",
        description: "",
        debitAccount: "",
        debitAmount: 0,
        creditAccount: "",
        creditAmount: 0,
      },
    ],
  );

  // Entry management for learning mode
  const addLearningEntry = () => {
    setLearningEntries([
      ...learningEntries,
      { date: "", description: "", receipt_amount: 0, payment_amount: 0 },
    ]);
  };

  const removeLearningEntry = (index: number) => {
    if (learningEntries.length > 1) {
      setLearningEntries(learningEntries.filter((_, i) => i !== index));
    }
  };

  const updateLearningEntry = (
    index: number,
    field: keyof LedgerEntry,
    value: any,
  ) => {
    setLearningEntries((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  // Entry management for mock exam mode
  const addMockExamEntry = () => {
    setMockExamEntries([
      ...mockExamEntries,
      {
        date: "",
        description: "",
        debitAccount: "",
        debitAmount: 0,
        creditAccount: "",
        creditAmount: 0,
      },
    ]);
  };

  const removeMockExamEntry = (index: number) => {
    if (mockExamEntries.length > 1) {
      setMockExamEntries(mockExamEntries.filter((_, i) => i !== index));
    }
  };

  const updateMockExamEntry = (
    index: number,
    field: keyof MockExamLedgerEntry,
    value: any,
  ) => {
    const newEntries = [...mockExamEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setMockExamEntries(newEntries);
  };

  // Account selection for mock exam mode
  const showAccountSelector = (
    type: "debitAccount" | "creditAccount",
    index: number,
  ) => {
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
            updateMockExamEntry(index, type, selectedAccount.value);
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
      updateMockExamEntry(
        currentSelection.index,
        currentSelection.type,
        account.value,
      );
    }
    setModalVisible(false);
    setCurrentSelection(null);
  };

  // Validation and submission
  const validateAndSubmit = async () => {
    if (formState.isSubmitting) return;

    try {
      setFormState({ ...formState, isSubmitting: true });

      if (mode === "learning") {
        // 学習モード: LedgerEntry形式
        const validEntries = learningEntries.filter(
          (entry) =>
            entry.date.trim() ||
            entry.description.trim() ||
            entry.receipt_amount > 0 ||
            entry.payment_amount > 0,
        );

        if (validEntries.length === 0) {
          Alert.alert(
            "入力エラー",
            "少なくとも1つの有効なエントリを入力してください。",
          );
          return;
        }

        // answerService経由で送信
        const answerData = {
          questionType: "ledger" as const,
          ledgerEntry: {
            entries: validEntries,
          },
        };

        const request = createSubmitAnswerRequest(
          questionId,
          answerData,
          sessionType,
          sessionId,
          startTime,
        );

        const response = await answerService.submitAnswer(request);

        if (onSubmitAnswer) {
          onSubmitAnswer(response);
        }
      } else {
        // 模試モード: MockExamLedgerEntry形式
        const validEntries = mockExamEntries.filter(
          (entry) =>
            entry.description.trim() &&
            (entry.debitAmount > 0 || entry.creditAmount > 0),
        );

        if (validEntries.length === 0) {
          Alert.alert(
            "エラー",
            "少なくとも1つの有効なエントリーを入力してください",
          );
          return;
        }

        // 直接コールバック実行
        if (onDirectSubmit) {
          onDirectSubmit(validEntries);
        } else if (onSubmit) {
          onSubmit(validEntries);
        }
      }
    } catch (error) {
      logger.error("[UnifiedLedgerEntryForm] 解答送信エラー:", error as Error);
      Alert.alert("エラー", "解答の送信に失敗しました");
    } finally {
      setFormState({ ...formState, isSubmitting: false });
    }
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("ja-JP");
  };

  // Render learning mode form
  const renderLearningModeForm = () => (
    <View style={styles.formCard}>
      <Text style={styles.sectionTitle}>帳簿記入</Text>

      {learningEntries.map((entry, index) => (
        <View key={index} style={styles.entryCard}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryLabel}>エントリー {index + 1}</Text>
            {learningEntries.length > 1 && (
              <TouchableOpacity
                onPress={() => removeLearningEntry(index)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>削除</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>日付</Text>
            <TextInput
              style={styles.textInput}
              value={entry.date}
              onChangeText={(value) =>
                updateLearningEntry(index, "date", value)
              }
              placeholder="例: 4/1"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>摘要</Text>
            <TextInput
              style={styles.textInput}
              value={entry.description}
              onChangeText={(value) =>
                updateLearningEntry(index, "description", value)
              }
              placeholder="取引内容を入力"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.amountRow}>
            <View style={styles.amountColumn}>
              <Text style={styles.inputLabel}>入金額</Text>
              <NumberInput
                label="入金額"
                value={entry.receipt_amount}
                onChange={(value) =>
                  updateLearningEntry(index, "receipt_amount", value || 0)
                }
                placeholder="入金額"
              />
            </View>

            <View style={styles.amountColumn}>
              <Text style={styles.inputLabel}>出金額</Text>
              <NumberInput
                label="出金額"
                value={entry.payment_amount}
                onChange={(value) =>
                  updateLearningEntry(index, "payment_amount", value || 0)
                }
                placeholder="出金額"
              />
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addLearningEntry}>
        <Text style={styles.addButtonText}>+ エントリーを追加</Text>
      </TouchableOpacity>

      {/* 合計表示 */}
      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>入金合計:</Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(
              learningEntries.reduce(
                (sum, entry) => sum + entry.receipt_amount,
                0,
              ),
            )}
            円
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>出金合計:</Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(
              learningEntries.reduce(
                (sum, entry) => sum + entry.payment_amount,
                0,
              ),
            )}
            円
          </Text>
        </View>
      </View>
    </View>
  );

  // Render mock exam mode form
  const renderMockExamModeForm = () => (
    <View style={styles.formCard}>
      <Text style={styles.sectionTitle}>総勘定元帳記入</Text>

      {mockExamEntries.map((entry, index) => (
        <View key={index} style={styles.entryCard}>
          <View style={styles.entryHeader}>
            <Text style={styles.entryLabel}>エントリー {index + 1}</Text>
            {mockExamEntries.length > 1 && (
              <TouchableOpacity
                onPress={() => removeMockExamEntry(index)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>削除</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>日付</Text>
            <TextInput
              style={styles.textInput}
              value={entry.date}
              onChangeText={(value) =>
                updateMockExamEntry(index, "date", value)
              }
              placeholder="例: 4/1"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>摘要</Text>
            <TextInput
              style={styles.textInput}
              value={entry.description}
              onChangeText={(value) =>
                updateMockExamEntry(index, "description", value)
              }
              placeholder="取引内容を入力"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          {/* 借方・貸方エントリー */}
          <View style={styles.entryRow}>
            <View style={styles.entryColumn}>
              <Text style={styles.columnTitle}>借方</Text>
              <View style={styles.accountGroup}>
                <Text style={styles.inputLabel}>勘定科目</Text>
                <TouchableOpacity
                  style={styles.accountPickerContainer}
                  onPress={() => showAccountSelector("debitAccount", index)}
                >
                  <Text
                    style={[
                      styles.accountPickerText,
                      {
                        color: entry.debitAccount
                          ? theme.colors.text
                          : theme.colors.textSecondary,
                      },
                    ]}
                  >
                    {entry.debitAccount || "勘定科目を選択"}
                  </Text>
                  <Text style={styles.accountPickerArrow}>▼</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.accountGroup}>
                <Text style={styles.inputLabel}>金額</Text>
                <TextInput
                  style={styles.numberInput}
                  value={
                    entry.debitAmount > 0 ? entry.debitAmount.toString() : ""
                  }
                  onChangeText={(value) => {
                    const numValue = parseInt(value.replace(/,/g, "")) || 0;
                    updateMockExamEntry(index, "debitAmount", numValue);
                  }}
                  placeholder="金額"
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.entryColumn}>
              <Text style={styles.columnTitle}>貸方</Text>
              <View style={styles.accountGroup}>
                <Text style={styles.inputLabel}>勘定科目</Text>
                <TouchableOpacity
                  style={styles.accountPickerContainer}
                  onPress={() => showAccountSelector("creditAccount", index)}
                >
                  <Text
                    style={[
                      styles.accountPickerText,
                      {
                        color: entry.creditAccount
                          ? theme.colors.text
                          : theme.colors.textSecondary,
                      },
                    ]}
                  >
                    {entry.creditAccount || "勘定科目を選択"}
                  </Text>
                  <Text style={styles.accountPickerArrow}>▼</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.accountGroup}>
                <Text style={styles.inputLabel}>金額</Text>
                <TextInput
                  style={styles.numberInput}
                  value={
                    entry.creditAmount > 0 ? entry.creditAmount.toString() : ""
                  }
                  onChangeText={(value) => {
                    const numValue = parseInt(value.replace(/,/g, "")) || 0;
                    updateMockExamEntry(index, "creditAmount", numValue);
                  }}
                  placeholder="金額"
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addMockExamEntry}>
        <Text style={styles.addButtonText}>+ エントリーを追加</Text>
      </TouchableOpacity>

      {/* 合計表示 */}
      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>借方合計:</Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(
              mockExamEntries.reduce(
                (sum, entry) => sum + entry.debitAmount,
                0,
              ),
            )}
            円
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>貸方合計:</Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(
              mockExamEntries.reduce(
                (sum, entry) => sum + entry.creditAmount,
                0,
              ),
            )}
            円
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} testID="unified-ledger-entry-form">
      {/* Header for mock exam mode */}
      {mode === "mock_exam" && questionNumber && totalQuestions && (
        <View style={styles.header}>
          <Text style={styles.questionInfo}>
            問{questionNumber} / {totalQuestions}
          </Text>
          {timeRemaining && (
            <Text style={styles.timeRemaining}>残り {timeRemaining}</Text>
          )}
        </View>
      )}

      {/* Form content */}
      {mode === "learning"
        ? renderLearningModeForm()
        : renderMockExamModeForm()}

      {/* Buttons */}
      {mode === "mock_exam" ? (
        // 模試モード: ナビゲーションボタン
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={validateAndSubmit}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>解答確認</Text>
          </TouchableOpacity>

          {explanation && (
            <TouchableOpacity
              onPress={() => setExplanationModalVisible(true)}
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
      ) : (
        // 学習モード: 送信ボタンのみ
        showSubmitButton && (
          <View style={styles.submitContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                formState.isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={validateAndSubmit}
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
        )
      )}

      {/* Account selection modal (模試モード用) */}
      {mode === "mock_exam" && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>勘定科目を選択</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalCloseButton}
                >
                  <Text style={styles.modalCloseText}>×</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={STANDARD_ACCOUNT_OPTIONS.filter(
                  (account) => account.value !== "",
                )}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => selectAccountFromModal(item)}
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Explanation modal for mock exam mode */}
      {mode === "mock_exam" && (
        <ExplanationModal
          visible={explanationModalVisible}
          onClose={() => setExplanationModalVisible(false)}
          explanation={explanation || ""}
          questionText={questionText}
          correctAnswer={correctAnswer}
          userAnswer={userAnswer}
          isCorrect={isCorrect}
        />
      )}
    </ScrollView>
  );
});

export default UnifiedLedgerEntryForm;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      marginBottom: 16,
      borderRadius: 8,
    },
    questionInfo: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    timeRemaining: {
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    questionCard: {
      padding: 20,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      marginBottom: 20,
      ...theme.shadows.medium,
    },
    questionText: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.text,
    },
    formCard: {
      padding: 20,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      marginBottom: 20,
      ...theme.shadows.medium,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: theme.colors.text,
    },
    entryCard: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      backgroundColor: theme.colors.background,
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
    accountPickerContainer: {
      minHeight: 50,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 4,
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 12,
      flexDirection: "row",
      backgroundColor: theme.colors.background,
    },
    accountPickerText: {
      fontSize: 14,
      flex: 1,
    },
    accountPickerArrow: {
      fontSize: 12,
      marginLeft: 8,
      color: theme.colors.primary,
    },
    addButton: {
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 20,
      backgroundColor: theme.colors.primary,
    },
    addButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.background,
    },
    totalSection: {
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
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
      color: theme.colors.text,
    },
    buttonContainer: {
      gap: 12,
      marginBottom: 20,
    },
    submitContainer: {
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    submitButton: {
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 50,
      backgroundColor: theme.colors.primary,
    },
    submitButtonDisabled: {
      backgroundColor: theme.colors.border,
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.background,
    },
    guideButton: {
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 12,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    guideButtonText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: "500",
    },
    explanationButton: {
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 12,
      backgroundColor: theme.colors.success,
    },
    explanationButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.background,
    },
    navigationContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
    },
    navButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      backgroundColor: theme.colors.surface,
    },
    navButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.primary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.background + "80",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: "80%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
    },
    modalCloseButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.error,
    },
    modalCloseText: {
      color: theme.colors.surface,
      fontSize: 18,
      fontWeight: "bold",
    },
    modalItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + "30",
    },
    modalItemText: {
      fontSize: 16,
      color: theme.colors.text,
    },
  });
