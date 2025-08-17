/**
 * 複数帳簿エントリ対応フォームコンポーネント（プルダウン対応版）
 * answer_template_jsonのcolumn定義に基づいて動的にフォームを生成
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { useTheme, useThemedStyles, useColors, useDynamicColors, type Theme } from "../context/ThemeContext";
import NumberInput from "./NumberInput";
import AnswerGuide from "./AnswerGuide";
import {
  answerService,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from "../services/answer-service";
import { SessionType } from "../types/database";

interface LedgerEntry {
  date: string;
  description: string;
  ref?: string;
  receipt: number;
  payment: number;
  balance?: number;
}

interface ColumnDefinition {
  name: string;
  label: string;
  type: "text" | "dropdown" | "number";
  width?: string;
  options?: string[];
}

interface LedgerEntryFormProps {
  questionId: string;
  sessionType?: SessionType;
  sessionId?: string;
  startTime?: number;
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void;
  showSubmitButton?: boolean;
  expectedEntries?: number;
  answerTemplate?: any;
}

// プルダウン選択コンポーネント
const DropdownSelector = ({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}) => {
  const [showModal, setShowModal] = useState(false);
  const styles = useThemedStyles(createStyles);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setShowModal(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={[styles.dropdownButtonText, !value && styles.placeholder]}>
          {value || placeholder || "選択してください"}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>摘要を選択</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    value === item && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === item && styles.selectedOptionText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default function LedgerEntryFormWithDropdown({
  questionId,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
  showSubmitButton = true,
  expectedEntries = 1,
  answerTemplate,
}: LedgerEntryFormProps) {
  // Theme system integration for dark mode support
  const { theme, isDark, getStatusBarStyle } = useTheme();
  const colors = useColors();
  const dynamicColors = useDynamicColors();
  const styles = useThemedStyles(createStyles);
  // answer_templateからcolumn定義を取得
  const columns: ColumnDefinition[] = answerTemplate?.columns || [
    { name: "date", label: "日付", type: "text" },
    { name: "description", label: "摘要", type: "text" },
    { name: "ref", label: "元丁", type: "text" },
    { name: "debit", label: "借方", type: "number" },
    { name: "credit", label: "貸方", type: "number" },
    { name: "balance", label: "残高", type: "number" },
  ];

  const [entries, setEntries] = useState<LedgerEntry[]>([
    { date: "", description: "", ref: "", receipt: 0, payment: 0, balance: 0 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // エントリを追加
  const addEntry = () => {
    setEntries([
      ...entries,
      {
        date: "",
        description: "",
        ref: "",
        receipt: 0,
        payment: 0,
        balance: 0,
      },
    ]);
  };

  // エントリを削除
  const removeEntry = (index: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== index));
    }
  };

  // エントリ値を更新
  const updateEntry = (index: number, field: keyof LedgerEntry, value: any) => {
    setEntries((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  // 解答送信処理
  const handleSubmitAnswer = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // 空のエントリを除外
      const validEntries = entries.filter(
        (entry) =>
          entry.date.trim() ||
          entry.description.trim() ||
          entry.receipt > 0 ||
          entry.payment > 0,
      );

      if (validEntries.length === 0) {
        Alert.alert("入力エラー", "少なくとも1つのエントリを入力してください");
        return;
      }

      // 必須フィールドチェック
      const incompleteEntries = validEntries.filter(
        (entry) => !entry.date.trim() || !entry.description.trim(),
      );

      if (incompleteEntries.length > 0) {
        Alert.alert(
          "入力エラー",
          "全てのエントリに日付と摘要を入力してください",
        );
        return;
      }

      // 金額チェック（収入または支出のどちらかは必須）
      const invalidEntries = validEntries.filter(
        (entry) => entry.receipt === 0 && entry.payment === 0,
      );

      if (invalidEntries.length > 0) {
        Alert.alert(
          "入力エラー",
          "各エントリで収入金額または支出金額のいずれかを入力してください",
        );
        return;
      }

      // 複数エントリ形式で解答データを構築
      const answerData = {
        questionType: "ledger" as const,
        ledgerEntry: {
          entries: validEntries,
        },
      };

      const request: SubmitAnswerRequest = {
        questionId,
        answerData,
        sessionType,
        sessionId,
        startTime,
      };

      const response = await answerService.submitAnswer(request);

      if (onSubmitAnswer) {
        onSubmitAnswer(response);
      } else {
        // デフォルトの結果表示
        Alert.alert(
          response.isCorrect ? "正解！" : "不正解",
          response.isCorrect
            ? "素晴らしい！正解です。"
            : "不正解です。解説を確認して復習しましょう。",
          [{ text: "OK" }],
        );
      }
    } catch (error) {
      console.error("[LedgerEntryFormWithDropdown] 解答送信エラー:", error);
      Alert.alert("エラー", "解答の送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  // カラムに基づいてフィールドをレンダリング
  const renderField = (column: ColumnDefinition, entry: any, index: number) => {
    switch (column.type) {
      case "dropdown":
        return (
          <View key={column.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {column.label} <Text style={styles.required}>*</Text>
            </Text>
            <DropdownSelector
              value={entry[column.name] || ""}
              options={column.options || []}
              onChange={(value) =>
                updateEntry(index, column.name as keyof LedgerEntry, value)
              }
              placeholder={`${column.label}を選択`}
            />
          </View>
        );

      case "number":
        return (
          <View key={column.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{column.label}</Text>
            <NumberInput
              label=""
              value={entry[column.name] || 0}
              onChange={(value) =>
                updateEntry(index, column.name as keyof LedgerEntry, value || 0)
              }
              required={false}
              format="currency"
              placeholder={`${column.label}を入力`}
            />
          </View>
        );

      case "text":
      default:
        // 元丁は省略可能なのでスキップ
        if (column.name === "ref") {
          return null;
        }
        return (
          <View key={column.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {column.label}
              {column.name === "date" && <Text style={styles.required}>*</Text>}
            </Text>
            <TextInput
              style={styles.textInput}
              value={entry[column.name] || ""}
              onChangeText={(value) =>
                updateEntry(index, column.name as keyof LedgerEntry, value)
              }
              placeholder={
                column.name === "date" ? "例: 4/8" : `${column.label}を入力`
              }
              placeholderTextColor={theme.colors.textDisabled}
            />
            {column.name === "date" && (
              <Text style={styles.helpText}>
                「月/日」の形式で入力してください
              </Text>
            )}
          </View>
        );
    }
  };

  // 各エントリのレンダリング
  const renderEntry = (entry: LedgerEntry, index: number) => {
    return (
      <View key={index} style={styles.entryContainer}>
        {/* エントリヘッダー */}
        <View style={styles.entryHeader}>
          <Text style={styles.entryTitle}>エントリ {index + 1}</Text>
          {entries.length > 1 && (
            <TouchableOpacity onPress={() => removeEntry(index)}>
              <Text style={styles.removeButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 各フィールドを動的にレンダリング */}
        {columns.map((column) => renderField(column, entry, index))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>帳簿転記</Text>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setShowGuide(true)}
        >
          <Text style={styles.helpButtonText}>❓</Text>
        </TouchableOpacity>
      </View>

      {entries.map((entry, index) => renderEntry(entry, index))}

      {/* エントリ追加ボタン */}
      <TouchableOpacity style={styles.addEntryButton} onPress={addEntry}>
        <Text style={styles.addEntryButtonText}>+ エントリを追加</Text>
      </TouchableOpacity>

      {/* 期待エントリ数のヒント */}
      {expectedEntries > 1 && (
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>
            💡 この問題は{expectedEntries}つの取引の転記が必要です
          </Text>
        </View>
      )}

      {/* 解答送信ボタン */}
      {showSubmitButton && (
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmitAnswer}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <View style={styles.submitButtonContent}>
              <ActivityIndicator
                size="small"
                color={theme.colors.surface}
                style={styles.loader}
              />
              <Text style={styles.submitButtonText}>送信中...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>解答を送信</Text>
          )}
        </TouchableOpacity>
      )}

      {/* ガイドモーダル */}
      <AnswerGuide
        questionType="ledger"
        visible={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    titleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    helpButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.infoBackground,
      justifyContent: "center",
      alignItems: "center",
    },
    helpButtonText: {
      fontSize: 16,
    },
    entryContainer: {
      backgroundColor: theme.colors.backgroundSecondary,
      marginHorizontal: 15,
      marginTop: 10,
      padding: 15,
      borderRadius: 10,
    },
    entryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    entryTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    removeButton: {
      fontSize: 20,
      color: theme.colors.error,
      padding: 5,
    },
    fieldContainer: {
      marginBottom: 15,
    },
    fieldLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 5,
    },
    required: {
      color: theme.colors.error,
    },
    textInput: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      borderRadius: 5,
      padding: 12,
      fontSize: 16,
      color: theme.colors.text,
    },
    helpText: {
      fontSize: 12,
      color: theme.colors.textDisabled,
      marginTop: 5,
    },
    dropdownButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      borderRadius: 5,
      padding: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dropdownButtonText: {
      fontSize: 16,
      color: theme.colors.text,
      flex: 1,
    },
    placeholder: {
      color: theme.colors.textDisabled,
    },
    dropdownArrow: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginLeft: 5,
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
      maxHeight: "70%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    closeButton: {
      fontSize: 24,
      color: theme.colors.textSecondary,
      padding: 5,
    },
    optionItem: {
      padding: 15,
      backgroundColor: theme.colors.surface,
    },
    selectedOption: {
      backgroundColor: theme.colors.infoBackground,
    },
    optionText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    selectedOptionText: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
    separator: {
      height: 1,
      backgroundColor: theme.colors.borderLight,
    },
    addEntryButton: {
      marginHorizontal: 15,
      marginTop: 15,
      padding: 15,
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: 8,
      alignItems: "center",
    },
    addEntryButtonText: {
      fontSize: 16,
      color: theme.colors.primary,
      fontWeight: "600",
    },
    hintContainer: {
      marginHorizontal: 15,
      marginTop: 15,
      padding: 10,
      backgroundColor: theme.colors.infoBackground,
      borderRadius: 5,
    },
    hintText: {
      fontSize: 14,
      color: theme.colors.text,
    },
    submitButton: {
      margin: 15,
      padding: 15,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      alignItems: "center",
    },
    submitButtonDisabled: {
      opacity: 0.5,
    },
    submitButtonContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    submitButtonText: {
      fontSize: 16,
      color: theme.colors.surface,
      fontWeight: "bold",
    },
    loader: {
      marginRight: 10,
    },
  });
