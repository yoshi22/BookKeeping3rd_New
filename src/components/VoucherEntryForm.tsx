/**
 * 伝票記入問題用解答フォーム
 * 3伝票制・5伝票制に対応した伝票入力システム
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import {
  answerService,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from "../services/answer-service";
import { SessionType } from "../types/database";

interface VoucherField {
  name: string;
  label: string;
  type: "date" | "text" | "number" | "select";
  required: boolean;
  options?: string[];
}

interface VoucherType {
  type: string;
  fields: VoucherField[];
}

interface VoucherEntry {
  type: string;
  date?: string;
  account?: string;
  amount?: number;
  description?: string;
  debit_account?: string;
  debit_amount?: number;
  credit_account?: string;
  credit_amount?: number;
}

interface VoucherEntryFormProps {
  questionId: string;
  voucherTypes: VoucherType[];
  sessionType?: SessionType;
  sessionId?: string;
  startTime?: number;
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void;
  showSubmitButton?: boolean;
}

export default function VoucherEntryForm({
  questionId,
  voucherTypes,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
  showSubmitButton = true,
}: VoucherEntryFormProps) {
  const [entries, setEntries] = useState<VoucherEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeVoucherType, setActiveVoucherType] = useState<string | null>(
    null,
  );

  // モーダル選択のための状態
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEntryIndex, setSelectedEntryIndex] = useState<number | null>(
    null,
  );
  const [selectedField, setSelectedField] = useState<VoucherField | null>(null);

  // デバッグ: voucherTypesの内容を確認
  console.log(
    "[VoucherEntryForm] voucherTypes received:",
    JSON.stringify(voucherTypes, null, 2),
  );

  // 新しい伝票エントリを追加
  const addVoucherEntry = (voucherType: string) => {
    const newEntry: VoucherEntry = { type: voucherType };
    setEntries([...entries, newEntry]);
    setActiveVoucherType(voucherType);
  };

  // 伝票エントリを更新
  const updateEntry = (index: number, field: string, value: any) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setEntries(updatedEntries);
  };

  // 伝票エントリを削除
  const removeEntry = (index: number) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
  };

  // 選択モーダルを開く
  const openSelectModal = (entryIndex: number, field: VoucherField) => {
    setSelectedEntryIndex(entryIndex);
    setSelectedField(field);
    setIsModalVisible(true);
  };

  // 選択モーダルで選択肢を選ぶ
  const handleOptionSelect = (option: string) => {
    if (selectedEntryIndex !== null && selectedField) {
      updateEntry(selectedEntryIndex, selectedField.name, option);
      setIsModalVisible(false);
      setSelectedEntryIndex(null);
      setSelectedField(null);
    }
  };

  // 解答送信処理
  const handleSubmitAnswer = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (entries.length === 0) {
        Alert.alert("入力エラー", "少なくとも1つの伝票を入力してください");
        return;
      }

      // 各伝票の必須フィールドチェック
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const voucherType = voucherTypes.find((v) => v.type === entry.type);

        if (voucherType) {
          const missingFields = voucherType.fields
            .filter(
              (field) =>
                field.required && !entry[field.name as keyof VoucherEntry],
            )
            .map((field) => field.label);

          if (missingFields.length > 0) {
            Alert.alert(
              "入力エラー",
              `${entry.type}の以下の項目は必須です：\n${missingFields.join("\n")}`,
            );
            return;
          }
        }
      }

      // 伝票タイプ別にグループ化
      const groupedVouchers: Record<string, VoucherEntry[]> = {};
      entries.forEach((entry) => {
        if (!groupedVouchers[entry.type]) {
          groupedVouchers[entry.type] = [];
        }
        groupedVouchers[entry.type].push(entry);
      });

      // 解答データを構築
      const voucherAnswer = {
        questionType: "ledger" as const,
        vouchers: Object.keys(groupedVouchers).map((type) => ({
          type,
          entries: groupedVouchers[type],
        })),
      };

      const timeTaken = Math.floor((Date.now() - startTime) / 1000);

      const request: SubmitAnswerRequest = {
        questionId,
        sessionType,
        sessionId,
        answerData: voucherAnswer,
        startTime,
      };

      console.log("[VoucherEntryForm] 解答送信:", request);

      const response = await answerService.submitAnswer(request);
      console.log("[VoucherEntryForm] 解答送信完了:", response);

      if (onSubmitAnswer) {
        onSubmitAnswer(response);
      }

      if (response.isCorrect) {
        Alert.alert("正解", "正解です！", [{ text: "OK", onPress: () => {} }]);
      } else {
        Alert.alert("不正解", "もう一度考えてみましょう", [
          { text: "OK", onPress: () => {} },
        ]);
      }
    } catch (error) {
      console.error("[VoucherEntryForm] 解答送信エラー:", error);
      Alert.alert("エラー", "解答の送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 伝票フィールドレンダリング
  const renderVoucherField = (
    entry: VoucherEntry,
    index: number,
    field: VoucherField,
  ) => {
    const value = entry[field.name as keyof VoucherEntry];

    // デバッグ: フィールド情報を確認
    console.log("[VoucherEntryForm] renderVoucherField:", {
      fieldName: field.name,
      fieldType: field.type,
      hasOptions: !!field.options,
      optionsCount: field.options?.length,
      options: field.options,
    });

    return (
      <View key={field.name} style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>
          {field.label}
          {field.required && <Text style={styles.required}> *</Text>}
        </Text>
        {field.type === "select" && field.options ? (
          <TouchableOpacity
            style={[styles.selectButton, !value && styles.selectButtonEmpty]}
            onPress={() => openSelectModal(index, field)}
          >
            <Text style={[styles.selectText, !value && styles.placeholderText]}>
              {value || "選択してください"}
            </Text>
            <Text style={styles.selectArrow}>▼</Text>
          </TouchableOpacity>
        ) : (
          <TextInput
            style={styles.textInput}
            value={String(value || "")}
            onChangeText={(text) => {
              const processedValue =
                field.type === "number"
                  ? text === ""
                    ? undefined
                    : parseFloat(text) || 0
                  : text;
              updateEntry(index, field.name, processedValue);
            }}
            placeholder={
              field.type === "date"
                ? "例: 2025-01-01"
                : field.type === "number"
                  ? "金額を入力"
                  : field.label
            }
            placeholderTextColor="#999"
            keyboardType={field.type === "number" ? "numeric" : "default"}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>伝票記入</Text>

      {/* 伝票タイプ選択ボタン */}
      <View style={styles.voucherTypeContainer}>
        <Text style={styles.sectionTitle}>伝票タイプを選択して追加:</Text>
        <ScrollView horizontal style={styles.voucherTypeButtons}>
          {voucherTypes.map((voucherType) => (
            <TouchableOpacity
              key={voucherType.type}
              style={styles.voucherTypeButton}
              onPress={() => addVoucherEntry(voucherType.type)}
            >
              <Text style={styles.voucherTypeButtonText}>
                + {voucherType.type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 入力された伝票 */}
      <ScrollView style={styles.entriesContainer}>
        {entries.map((entry, index) => {
          const voucherType = voucherTypes.find((v) => v.type === entry.type);
          if (!voucherType) return null;

          return (
            <View key={index} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{entry.type}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeEntry(index)}
                >
                  <Text style={styles.removeButtonText}>削除</Text>
                </TouchableOpacity>
              </View>

              {voucherType.fields.map((field) =>
                renderVoucherField(entry, index, field),
              )}
            </View>
          );
        })}
      </ScrollView>

      {entries.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            上記のボタンから伝票タイプを選択して{"\n"}
            伝票を追加してください
          </Text>
        </View>
      )}

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
                color="white"
                style={styles.loader}
              />
              <Text style={styles.submitButtonText}>送信中...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>解答を送信</Text>
          )}
        </TouchableOpacity>
      )}

      {/* 選択モーダル */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedField?.label}を選択
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {selectedField?.options?.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionItem,
                    selectedEntryIndex !== null &&
                      selectedField &&
                      entries[selectedEntryIndex]?.[
                        selectedField.name as keyof VoucherEntry
                      ] === option &&
                      styles.optionItemSelected,
                  ]}
                  onPress={() => handleOptionSelect(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedEntryIndex !== null &&
                        selectedField &&
                        entries[selectedEntryIndex]?.[
                          selectedField.name as keyof VoucherEntry
                        ] === option &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>キャンセル</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  voucherTypeContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  voucherTypeButtons: {
    flexDirection: "row",
  },
  voucherTypeButton: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  voucherTypeButtonText: {
    color: "#1976D2",
    fontSize: 14,
    fontWeight: "500",
  },
  entriesContainer: {
    maxHeight: 400,
    marginBottom: 10,
  },
  entryCard: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  removeButton: {
    backgroundColor: "#ffebee",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#f44336",
  },
  removeButtonText: {
    color: "#d32f2f",
    fontSize: 12,
    fontWeight: "500",
  },
  fieldContainer: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#333",
  },
  required: {
    color: "#d32f2f",
  },
  textInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    backgroundColor: "white",
    fontSize: 14,
    color: "#333",
  },
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "white",
    minHeight: 48,
  },
  selectButtonEmpty: {
    borderColor: "#ccc",
  },
  selectText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  placeholderText: {
    color: "#999",
  },
  selectArrow: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  submitButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#9E9E9E",
  },
  submitButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    marginRight: 8,
  },
  // モーダル関連のスタイル
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "90%",
    maxHeight: "70%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#666",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  optionItem: {
    padding: 15,
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: "#f8f9fa",
  },
  optionItemSelected: {
    backgroundColor: "#e3f2fd",
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  optionTextSelected: {
    fontWeight: "bold",
    color: "#2196F3",
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  cancelButton: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
  },
});
