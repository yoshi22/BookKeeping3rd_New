/**
 * 複数帳簿エントリ対応フォームコンポーネント
 * 複数の取引を一つの帳簿勘定に転記する問題に対応
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
} from "react-native";
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
  debit_amount: number;
  credit_amount: number;
}

interface LedgerEntryFormProps {
  questionId: string;
  sessionType?: SessionType;
  sessionId?: string;
  startTime?: number;
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void;
  showSubmitButton?: boolean;
  expectedEntries?: number; // 期待されるエントリ数
}

export default function LedgerEntryForm({
  questionId,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
  showSubmitButton = true,
  expectedEntries = 1,
}: LedgerEntryFormProps) {
  const [entries, setEntries] = useState<LedgerEntry[]>([
    { date: "", description: "", debit_amount: 0, credit_amount: 0 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // エントリを追加
  const addEntry = () => {
    setEntries([
      ...entries,
      { date: "", description: "", debit_amount: 0, credit_amount: 0 },
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
          entry.debit_amount > 0 ||
          entry.credit_amount > 0,
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

      // 金額チェック（借方または貸方のどちらかは必須）
      const invalidEntries = validEntries.filter(
        (entry) => entry.debit_amount === 0 && entry.credit_amount === 0,
      );

      if (invalidEntries.length > 0) {
        Alert.alert(
          "入力エラー",
          "各エントリで借方金額または貸方金額のいずれかを入力してください",
        );
        return;
      }

      // 複数エントリ形式で解答データを構築
      const answerData = {
        questionType: "ledger" as const,
        entries: validEntries,
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
            ? "正解です。よくできました！"
            : "不正解です。解説を確認して復習しましょう。",
          [{ text: "OK" }],
        );
      }
    } catch (error) {
      console.error("[LedgerEntryForm] 解答送信エラー:", error);
      Alert.alert(
        "エラー",
        "解答の送信に失敗しました。もう一度お試しください。",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderEntry = (entry: LedgerEntry, index: number) => {
    return (
      <View key={index} style={styles.entryContainer}>
        <View style={styles.entryHeader}>
          <Text style={styles.entryTitle}>エントリ {index + 1}</Text>
          {entries.length > 1 && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeEntry(index)}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 日付フィールド */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            日付 <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.textInput}
            value={entry.date}
            onChangeText={(value) => updateEntry(index, "date", value)}
            placeholder="例: 4/8"
            placeholderTextColor="#999"
          />
          <Text style={styles.hintText}>「月/日」の形式で入力してください</Text>
        </View>

        {/* 摘要フィールド */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>
            摘要 <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.textInput}
            value={entry.description}
            onChangeText={(value) => updateEntry(index, "description", value)}
            placeholder="例: 売掛金回収"
            placeholderTextColor="#999"
          />
        </View>

        {/* 借方金額フィールド */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>借方金額</Text>
          <NumberInput
            label=""
            value={entry.debit_amount}
            onChange={(value) => updateEntry(index, "debit_amount", value || 0)}
            required={false}
            format="currency"
            placeholder="借方の場合のみ入力"
          />
        </View>

        {/* 貸方金額フィールド */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>貸方金額</Text>
          <NumberInput
            label=""
            value={entry.credit_amount}
            onChange={(value) =>
              updateEntry(index, "credit_amount", value || 0)
            }
            required={false}
            format="currency"
            placeholder="貸方の場合のみ入力"
          />
        </View>
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

      {/* ガイドモーダル */}
      <AnswerGuide
        questionType="ledger"
        visible={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </ScrollView>
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
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  helpButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
  },
  helpButtonText: {
    fontSize: 16,
  },
  entryContainer: {
    backgroundColor: "#f8f9fa",
    margin: 15,
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
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
    color: "#495057",
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#dc3545",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  required: {
    color: "#d32f2f",
  },
  textInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    backgroundColor: "white",
    minHeight: 44,
    fontSize: 16,
    color: "#333",
  },
  hintText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  addEntryButton: {
    backgroundColor: "#28a745",
    margin: 15,
    marginTop: 5,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  addEntryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  hintContainer: {
    backgroundColor: "#e7f3ff",
    margin: 15,
    marginTop: 5,
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  submitButton: {
    backgroundColor: "#2196F3",
    margin: 15,
    padding: 15,
    borderRadius: 8,
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
});
