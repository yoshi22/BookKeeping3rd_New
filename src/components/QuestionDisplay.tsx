/**
 * 問題表示コンポーネント
 * Step 2.2: 解答記録機能実装統合
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AnswerForm from "./AnswerForm";
import LedgerEntryForm from "./LedgerEntryForm";
import QuestionText from "./QuestionText";
import ExplanationPanel from "./ExplanationPanel";
import { SubmitAnswerResponse } from "../services/answer-service";
import { SessionType } from "../types/database";

interface AnswerField {
  label: string;
  type: "dropdown" | "number" | "text";
  name: string;
  required: boolean;
  format?: "currency" | "percentage";
  options?: string[];
}

interface QuestionDisplayProps {
  questionId: string;
  categoryName: string;
  questionText: string;
  difficulty: number;
  answerFields?: AnswerField[];
  answers?: Record<string, any>;
  explanation?: string;
  showExplanation?: boolean;
  isCorrect?: boolean;
  correctAnswer?: Record<string, any>;
  onBack: () => void;
  onAnswerChange?: (fieldName: string, value: any) => void;
  sessionType?: SessionType;
  sessionId?: string;
  startTime?: number;
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void;
}

export default function QuestionDisplay({
  questionId,
  categoryName,
  questionText,
  difficulty,
  answerFields = [],
  answers = {},
  explanation,
  showExplanation = false,
  isCorrect,
  correctAnswer,
  onBack,
  onAnswerChange,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
}: QuestionDisplayProps) {
  // 複数エントリが必要な帳簿問題かどうか判定
  const isMultiEntryLedgerQuestion = (
    questionId: string,
    questionText: string,
  ) => {
    // Q_L_002 など特定のIDまたは問題文に複数の仕訳が含まれている場合
    if (questionId === "Q_L_002" || questionId === "Q_L_003") {
      return true;
    }

    // 問題文中に複数の日付や取引が含まれているかチェック
    const dateMatches = questionText.match(/\d+日/g);
    if (dateMatches && dateMatches.length > 1) {
      return true;
    }

    return false;
  };

  // 期待されるエントリ数を推定
  const getExpectedEntryCount = (questionText: string) => {
    const dateMatches = questionText.match(/\d+日/g);
    return dateMatches ? dateMatches.length : 1;
  };

  const shouldUseLedgerEntryForm =
    questionId.startsWith("Q_L_") &&
    isMultiEntryLedgerQuestion(questionId, questionText);

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        <View style={styles.questionInfo}>
          <Text style={styles.questionId}>{questionId}</Text>
          <Text style={styles.categoryName}>{categoryName}</Text>
        </View>
        <Text style={styles.difficulty}>難易度: {difficulty}</Text>
      </View>

      {/* 問題文 */}
      <QuestionText
        questionText={questionText}
        questionId={questionId}
        difficulty={difficulty}
      />

      {/* 解答エリア */}
      {shouldUseLedgerEntryForm ? (
        <LedgerEntryForm
          questionId={questionId}
          sessionType={sessionType}
          sessionId={sessionId}
          startTime={startTime}
          onSubmitAnswer={onSubmitAnswer}
          showSubmitButton={true}
          expectedEntries={getExpectedEntryCount(questionText)}
        />
      ) : answerFields.length > 0 && onAnswerChange ? (
        <AnswerForm
          fields={answerFields}
          answers={answers}
          onAnswerChange={onAnswerChange}
          questionId={questionId}
          sessionType={sessionType}
          sessionId={sessionId}
          startTime={startTime}
          onSubmitAnswer={onSubmitAnswer}
          showSubmitButton={true}
        />
      ) : (
        <View style={styles.answerSection}>
          <Text style={styles.answerTitle}>解答</Text>
          <View style={styles.answerPlaceholder}>
            <Text style={styles.placeholderText}>
              解答入力エリア
              {"\n"}(解答フィールドが設定されていません)
            </Text>
          </View>
        </View>
      )}

      {/* 解説パネル */}
      <ExplanationPanel
        explanation={explanation || ""}
        isVisible={showExplanation}
        isCorrect={isCorrect}
        userAnswer={answers}
        correctAnswer={correctAnswer}
        showAnswerComparison={
          showExplanation && Object.keys(answers).length > 0
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    color: "#2f95dc",
    fontSize: 16,
  },
  questionInfo: {
    alignItems: "center",
  },
  questionId: {
    fontSize: 14,
    color: "#666",
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  difficulty: {
    fontSize: 12,
    color: "#ff6b35",
  },
  answerSection: {
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
  answerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  answerPlaceholder: {
    padding: 20,
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  placeholderText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    lineHeight: 24,
  },
  actionSection: {
    padding: 15,
    marginTop: "auto",
  },
  submitButton: {
    backgroundColor: "#2f95dc",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
