/**
 * CBT形式解答フォームコンポーネント
 * Step 2.2: 解答記録機能実装 - 解答送信処理追加
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
} from "react-native";
import AccountDropdown from "./AccountDropdown";
import NumberInput from "./NumberInput";
import AnswerGuide from "./AnswerGuide";
import {
  answerService,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from "../services/answer-service";
import { SessionType } from "../types/database";

interface AnswerField {
  label: string;
  type: "dropdown" | "number" | "text";
  name: string;
  required: boolean;
  format?: "currency" | "percentage";
  options?: string[];
}

interface AnswerFormProps {
  fields: AnswerField[];
  answers: Record<string, any>;
  onAnswerChange: (fieldName: string, value: any) => void;
  questionId: string;
  sessionType?: SessionType;
  sessionId?: string;
  startTime?: number;
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void;
  showSubmitButton?: boolean;
}

export default function AnswerForm({
  fields,
  answers,
  onAnswerChange,
  questionId,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
  showSubmitButton = true,
}: AnswerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // 問題タイプを推定
  const getQuestionType = (
    questionId: string,
  ): "journal" | "ledger" | "trial_balance" => {
    if (questionId.startsWith("Q_J_")) return "journal";
    if (questionId.startsWith("Q_L_")) return "ledger";
    if (questionId.startsWith("Q_T_")) return "trial_balance";
    return "journal";
  };

  // 解答送信処理
  const handleSubmitAnswer = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // 必須フィールドチェック
      const missingFields = fields
        .filter((field) => field.required && !answers[field.name])
        .map((field) => field.label);

      if (missingFields.length > 0) {
        Alert.alert(
          "入力エラー",
          `以下の項目は必須です：\n${missingFields.join("\n")}`,
        );
        return;
      }

      // 問題IDからカテゴリを推定
      const getCategoryFromId = (
        questionId: string,
      ): "journal" | "ledger" | "trial_balance" => {
        if (questionId.startsWith("Q_J_")) return "journal";
        if (questionId.startsWith("Q_L_")) return "ledger";
        if (questionId.startsWith("Q_T_")) return "trial_balance";
        return "journal"; // デフォルト
      };

      const request: SubmitAnswerRequest = {
        questionId,
        answerData: {
          questionType: getCategoryFromId(questionId),
          ...answers,
        },
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
      console.error("[AnswerForm] 解答送信エラー:", error);
      Alert.alert(
        "エラー",
        "解答の送信に失敗しました。もう一度お試しください。",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 重複使用防止のため、既に選択された勘定科目を取得
  const getSelectedAccounts = () => {
    return fields
      .filter((field) => field.type === "dropdown" && answers[field.name])
      .map((field) => answers[field.name])
      .filter(Boolean);
  };

  const renderField = (field: AnswerField) => {
    switch (field.type) {
      case "dropdown":
        return (
          <AccountDropdown
            key={field.name}
            label={field.label}
            value={answers[field.name]}
            onChange={(value) => onAnswerChange(field.name, value)}
            required={field.required}
            excludeAccounts={getSelectedAccounts().filter(
              (account) => account !== answers[field.name],
            )}
          />
        );

      case "number":
        return (
          <NumberInput
            key={field.name}
            label={field.label}
            value={answers[field.name]}
            onChange={(value) => onAnswerChange(field.name, value)}
            required={field.required}
            format={field.format}
            placeholder={
              field.format === "currency"
                ? "金額を入力してください"
                : "数値を入力してください"
            }
          />
        );

      case "text":
        // フィールド名に応じたプレースホルダー
        const getPlaceholder = (fieldName: string, fieldLabel: string) => {
          if (fieldName === "date" || fieldLabel.includes("日付"))
            return "例: 4/1";
          if (fieldName === "description" || fieldLabel.includes("摘要"))
            return "例: 商品仕入";
          return "テキストを入力";
        };

        return (
          <View key={field.name} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={styles.textInput}
              value={answers[field.name] || ""}
              onChangeText={(value) => onAnswerChange(field.name, value)}
              placeholder={getPlaceholder(field.name, field.label)}
              placeholderTextColor="#999"
            />
            {(field.name === "date" || field.label.includes("日付")) && (
              <Text style={styles.hintText}>
                「月/日」の形式で入力してください
              </Text>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>解答</Text>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => setShowGuide(true)}
        >
          <Text style={styles.helpButtonText}>❓</Text>
        </TouchableOpacity>
      </View>
      {fields.map(renderField)}

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

      <AnswerGuide
        questionType={getQuestionType(questionId)}
        visible={showGuide}
        onClose={() => setShowGuide(false)}
      />
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
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
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
  fieldContainer: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 16,
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
    borderRadius: 8,
    backgroundColor: "white",
    minHeight: 48,
    fontSize: 16,
    color: "#333",
  },
  hintText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    color: "#999",
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
});
