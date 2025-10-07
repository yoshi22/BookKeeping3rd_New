/**
 * 勘定記入空欄補充問題フォームコンポーネント
 * 第二問（Q2_L_）の勘定記入問題に対応
 * T勘定形式で空欄を選択肢から選ぶ形式
 */

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  Modal,
} from "react-native";
// Pickerは使用しない（カスタム実装）
import { useTheme, useThemedStyles, type Theme } from "../context/ThemeContext";
import {
  answerService,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from "../services/answer-service";
import { SessionType } from "../types/database";
import { logger } from "../utils/logger";

interface LedgerEntry {
  date: string;
  description: string;
  amount: number | null;
  side: "debit" | "credit";
}

interface LedgerBlank {
  index: number; // entries配列のindex
  choices: number[]; // 選択肢の金額
}

interface FillInLedgerAnswerTemplate {
  id: string;
  type: "fill_in_ledger";
  accountName: string; // 勘定科目名（「現金」など）
  problemStatement?: string; // 問題文（取引の詳細）
  entries: LedgerEntry[];
  blanks: LedgerBlank[];
  hints?: string[]; // ヒント（任意）
}

interface FillInLedgerFormProps {
  questionId: string;
  answerTemplate: FillInLedgerAnswerTemplate;
  sessionType?: SessionType;
  sessionId?: string;
  startTime?: number;
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void;
  showSubmitButton?: boolean;
}

export default function FillInLedgerForm({
  questionId,
  answerTemplate,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
  showSubmitButton = true,
}: FillInLedgerFormProps) {
  logger.debug("[FillInLedgerForm] レンダリング開始", {
    questionId,
    accountName: answerTemplate?.accountName,
    entriesCount: answerTemplate?.entries?.length,
    blanksCount: answerTemplate?.blanks?.length,
  });

  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  // 各空欄の選択状態を管理（entry indexをキー、選択した金額を値）
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // モーダルピッカー用のstate
  const [showPickerModal, setShowPickerModal] = useState<number | null>(null); // どの空欄のPickerを表示中か
  const [tempSelectedValue, setTempSelectedValue] = useState<number | string>(
    "",
  ); // モーダル内の一時選択値

  // questionIdが変わった時にselectedAnswersをリセット
  useEffect(() => {
    setSelectedAnswers({});
  }, [questionId]);

  // 借方エントリと貸方エントリに分割
  const { debitEntries, creditEntries } = useMemo(() => {
    const debit = answerTemplate.entries
      .map((entry, index) => ({ ...entry, originalIndex: index }))
      .filter((entry) => entry.side === "debit");
    const credit = answerTemplate.entries
      .map((entry, index) => ({ ...entry, originalIndex: index }))
      .filter((entry) => entry.side === "credit");
    return { debitEntries: debit, creditEntries: credit };
  }, [answerTemplate.entries]);

  // 空欄の選択肢を選択
  const handleSelectChoice = useCallback(
    (entryIndex: number, choiceValue: number) => {
      logger.debug(
        `[FillInLedgerForm] 選択: entry[${entryIndex}] = ${choiceValue}`,
      );
      setSelectedAnswers((prev) => ({
        ...prev,
        [entryIndex]: choiceValue,
      }));
    },
    [],
  );

  // モーダルを開く
  const handleOpenPicker = useCallback(
    (entryIndex: number) => {
      const currentValue = selectedAnswers[entryIndex];
      setTempSelectedValue(currentValue || "");
      setShowPickerModal(entryIndex);
    },
    [selectedAnswers],
  );

  // モーダルで選択を確定
  const handleConfirmSelection = useCallback(() => {
    if (showPickerModal !== null && tempSelectedValue !== "") {
      handleSelectChoice(showPickerModal, tempSelectedValue as number);
    }
    setShowPickerModal(null);
    setTempSelectedValue("");
  }, [showPickerModal, tempSelectedValue, handleSelectChoice]);

  // モーダルをキャンセル
  const handleCancelSelection = useCallback(() => {
    setShowPickerModal(null);
    setTempSelectedValue("");
  }, []);

  // 解答送信
  const handleSubmit = async () => {
    if (isSubmitting) return;

    // すべての空欄に解答が入力されているかチェック
    const allBlankIndices = answerTemplate.blanks.map((b) => b.index);
    const unansweredBlanks = allBlankIndices.filter(
      (index) => selectedAnswers[index] === undefined,
    );

    if (unansweredBlanks.length > 0) {
      Alert.alert(
        "未回答の空欄があります",
        `空欄 ${unansweredBlanks.map((i) => i + 1).join(", ")} に解答を選択してください`,
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // 解答データを構築
      const answerData = {
        questionType: "ledger" as const,
        blanks: answerTemplate.blanks.map((blank) => ({
          index: blank.index,
          selectedValue: selectedAnswers[blank.index],
          selectedIndex: blank.choices.indexOf(selectedAnswers[blank.index]), // 選択肢のインデックス
        })),
      };

      logger.debug("[FillInLedgerForm] 解答送信", answerData);

      const submitRequest: SubmitAnswerRequest = {
        questionId,
        answerData,
        sessionType,
        sessionId,
        startTime,
      };

      const response = await answerService.submitAnswer(submitRequest);

      if (onSubmitAnswer) {
        onSubmitAnswer(response);
      }
    } catch (error) {
      logger.error("[FillInLedgerForm] 解答送信エラー:", error as Error);
      Alert.alert("エラー", "解答の送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  // エントリを表示（空欄の場合は選択肢ボタンを表示）
  const renderEntry = (
    entry: LedgerEntry & { originalIndex: number },
    isDebit: boolean,
  ) => {
    const isBlank = entry.amount === null;
    const blank = answerTemplate.blanks.find(
      (b) => b.index === entry.originalIndex,
    );
    const selectedValue = selectedAnswers[entry.originalIndex];

    return (
      <View
        key={`${isDebit ? "debit" : "credit"}-${entry.originalIndex}`}
        style={styles.entryRow}
      >
        <Text style={styles.entryDate}>{entry.date}</Text>
        <Text style={styles.entryDescription}>{entry.description}</Text>
        {isBlank && blank ? (
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => handleOpenPicker(entry.originalIndex)}
            testID={`ledger-dropdown-button-${entry.originalIndex}`}
          >
            <Text style={styles.dropdownButtonText}>
              {selectedValue
                ? selectedValue.toLocaleString()
                : "選択してください"}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.entryAmount}>
            {entry.amount?.toLocaleString()}
          </Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} testID="fill-in-ledger-form">
      {/* 勘定科目名 */}
      <View style={styles.headerContainer}>
        <Text style={styles.accountName}>{answerTemplate.accountName}勘定</Text>
      </View>

      {/* 問題指示文 */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          以下のT勘定について、空欄に入る金額を選択肢から選んでください
        </Text>
      </View>

      {/* 問題文（取引の詳細） */}
      {answerTemplate.problemStatement && (
        <View style={styles.problemStatementContainer}>
          <Text style={styles.problemStatementText}>
            {answerTemplate.problemStatement}
          </Text>
        </View>
      )}

      {/* T勘定 */}
      <View style={styles.ledgerContainer}>
        {/* 借方（左側） */}
        <View style={styles.ledgerSide}>
          <View style={styles.sideHeader}>
            <Text style={styles.sideHeaderText}>借方</Text>
          </View>
          {debitEntries.map((entry) => renderEntry(entry, true))}
        </View>

        {/* 貸方（右側） */}
        <View style={styles.ledgerSide}>
          <View style={styles.sideHeader}>
            <Text style={styles.sideHeaderText}>貸方</Text>
          </View>
          {creditEntries.map((entry) => renderEntry(entry, false))}
        </View>
      </View>

      {/* 解答送信ボタン */}
      {showSubmitButton && (
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          testID="submit-answer-button"
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "送信中..." : "解答を送信"}
          </Text>
        </TouchableOpacity>
      )}

      {/* 選択肢Pickerモーダル */}
      <Modal
        visible={showPickerModal !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelSelection}
        testID="ledger-dropdown-modal"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>金額を選択</Text>
            </View>
            <ScrollView style={styles.optionsList} testID="ledger-options-list">
              <TouchableOpacity
                style={[
                  styles.optionItem,
                  tempSelectedValue === "" && styles.optionItemSelected,
                ]}
                onPress={() => setTempSelectedValue("")}
                testID="ledger-option-placeholder"
              >
                <Text
                  style={[
                    styles.optionText,
                    styles.optionTextPlaceholder,
                    tempSelectedValue === "" && styles.optionTextSelected,
                  ]}
                >
                  選択してください
                </Text>
              </TouchableOpacity>
              {showPickerModal !== null &&
                answerTemplate.blanks
                  .find((b) => b.index === showPickerModal)
                  ?.choices.map((choice) => (
                    <TouchableOpacity
                      key={choice}
                      style={[
                        styles.optionItem,
                        tempSelectedValue === choice &&
                          styles.optionItemSelected,
                      ]}
                      onPress={() => setTempSelectedValue(choice)}
                      testID={`ledger-option-${choice}`}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          tempSelectedValue === choice &&
                            styles.optionTextSelected,
                        ]}
                      >
                        {choice.toLocaleString()}円
                      </Text>
                    </TouchableOpacity>
                  ))}
            </ScrollView>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={handleCancelSelection}
                testID="ledger-modal-cancel-button"
              >
                <Text style={styles.modalButtonText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleConfirmSelection}
                testID="ledger-modal-confirm-button"
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    styles.modalButtonTextConfirm,
                  ]}
                >
                  完了
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerContainer: {
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    accountName: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
    },
    instructionsContainer: {
      padding: 16,
      backgroundColor: theme.colors.surfaceLight,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    instructionsText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    problemStatementContainer: {
      padding: 16,
      marginHorizontal: 8,
      marginTop: 8,
      backgroundColor: theme.colors.surfaceLight,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    problemStatementText: {
      fontSize: 15,
      color: theme.colors.text,
      lineHeight: 22,
    },
    ledgerContainer: {
      flexDirection: "row",
      marginTop: 16,
      marginHorizontal: 8,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      borderRadius: 8,
      overflow: "hidden",
    },
    ledgerSide: {
      flex: 1,
    },
    sideHeader: {
      backgroundColor: theme.colors.primary,
      padding: 12,
      alignItems: "center",
    },
    sideHeaderText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    entryRow: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
      minHeight: 60,
    },
    entryDate: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    entryDescription: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 4,
    },
    entryAmount: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "right",
    },
    dropdownButton: {
      marginTop: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
    },
    dropdownButtonText: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
    },
    dropdownArrow: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginLeft: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: Platform.OS === "ios" ? 34 : 20,
    },
    modalHeader: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    optionsList: {
      maxHeight: 300,
      paddingHorizontal: 16,
    },
    optionItem: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
      backgroundColor: theme.colors.surface,
    },
    optionItemSelected: {
      backgroundColor: "rgba(0, 0, 0, 0.05)", // 薄いグレー背景
      borderLeftWidth: 4, // 左側にアクセントボーダー
      borderLeftColor: theme.colors.primary, // 青色ボーダーで選択状態を明確に
    },
    optionText: {
      fontSize: 18,
      color: theme.colors.text,
      textAlign: "center",
    },
    optionTextSelected: {
      color: theme.colors.text, // 通常のテキスト色（読みやすさ優先）
      fontWeight: "600", // 太字は維持
    },
    optionTextPlaceholder: {
      color: theme.colors.textSecondary,
      fontStyle: "italic",
    },
    modalButtons: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingTop: 16,
      gap: 12,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
    },
    modalButtonCancel: {
      backgroundColor: theme.colors.surfaceLight,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    modalButtonConfirm: {
      backgroundColor: theme.colors.primary,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    modalButtonTextConfirm: {
      color: "#fff",
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: 8,
      margin: 16,
      alignItems: "center",
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
  });
