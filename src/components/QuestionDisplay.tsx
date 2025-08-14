/**
 * 問題表示コンポーネント
 * Step 2.2: 解答記録機能実装統合
 */

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AnswerForm from "./AnswerForm";
import LedgerEntryForm from "./LedgerEntryForm";
import LedgerEntryFormWithDropdown from "./LedgerEntryFormWithDropdown";
import JournalEntryForm from "./JournalEntryForm";
import ChoiceAnswerForm from "./ChoiceAnswerForm";
import MultipleBlankChoiceForm from "./MultipleBlankChoiceForm";
import VoucherEntryForm from "./VoucherEntryForm";
import TrialBalanceForm, {
  TrialBalanceEntry,
} from "./mock-exam/TrialBalanceForm";
import FinancialStatementForm from "./FinancialStatementForm";
import QuestionText from "./QuestionText";
import ExplanationPanel from "./ExplanationPanel";
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

interface AnswerField {
  label: string;
  type: "dropdown" | "number" | "text";
  name: string;
  required: boolean;
  format?: "currency" | "percentage";
  options?: string[];
}

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

interface AnswerTemplate {
  type?: string;
  voucher_type?: string;
  allowMultipleEntries?: boolean;
  maxEntries?: number;
  fields?: AnswerField[];
  options?: string[];
  vouchers?: VoucherType[];
  questions?: Array<{
    id: string;
    label: string;
    options: string[];
  }>;
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
  answerTemplate?: AnswerTemplate; // Add answer template prop
}

// Wrapper component for TrialBalanceForm to integrate with answer service
interface TrialBalanceFormWrapperProps {
  questionId: string;
  questionText: string;
  sessionType?: SessionType;
  sessionId?: string;
  startTime?: number;
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void;
  explanation?: string;
  correctAnswer?: Record<string, any>;
}

interface FinancialStatementFormWrapperProps {
  questionId: string;
  sessionType?: SessionType;
  sessionId?: string;
  startTime?: number;
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void;
  explanation?: string;
  correctAnswer?: Record<string, any>;
}

function TrialBalanceFormWrapper({
  questionId,
  questionText,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
  explanation,
  correctAnswer,
}: TrialBalanceFormWrapperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (entries: TrialBalanceEntry[]) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Convert TrialBalanceEntry[] to the format expected by answer service
      const answerData = {
        questionType: "trial_balance" as const,
        entries: entries.map((entry) => ({
          accountName: entry.accountName,
          debitAmount: entry.debitAmount,
          creditAmount: entry.creditAmount,
        })),
      };

      // Create and send the answer request
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
      console.error("[TrialBalanceFormWrapper] 解答送信エラー:", error);
      Alert.alert("エラー", "解答の送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TrialBalanceForm
      questionText={questionText}
      onSubmit={handleSubmit}
      questionNumber={1}
      totalQuestions={1}
      timeRemaining="--:--"
      explanation={explanation}
      correctAnswer={correctAnswer}
    />
  );
}

function FinancialStatementFormWrapper({
  questionId,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
  explanation,
  correctAnswer,
}: FinancialStatementFormWrapperProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: {
    balanceSheet: {
      assets: any[];
      liabilities: any[];
      equity: any[];
    };
    incomeStatement: {
      revenues: any[];
      expenses: any[];
      netIncome: number;
    };
  }) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Convert financial statement data to the format expected by answer service
      const answerData = {
        questionType: "financial_statement" as const,
        financialStatements: {
          balanceSheet: {
            assets: data.balanceSheet.assets.map((entry) => ({
              accountName: entry.accountName,
              amount: entry.amount,
            })),
            liabilities: data.balanceSheet.liabilities.map((entry) => ({
              accountName: entry.accountName,
              amount: entry.amount,
            })),
            equity: data.balanceSheet.equity.map((entry) => ({
              accountName: entry.accountName,
              amount: entry.amount,
            })),
          },
          incomeStatement: {
            revenues: data.incomeStatement.revenues.map((entry) => ({
              accountName: entry.accountName,
              amount: entry.amount,
            })),
            expenses: data.incomeStatement.expenses.map((entry) => ({
              accountName: entry.accountName,
              amount: entry.amount,
            })),
            netIncome: data.incomeStatement.netIncome,
          },
        },
      };

      // Create and send the answer request
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
      } else {
        Alert.alert(
          response.isCorrect ? "正解！" : "不正解",
          response.isCorrect
            ? "正解です。よくできました！"
            : "不正解です。解説を確認して復習しましょう。",
          [{ text: "OK" }],
        );
      }
    } catch (error) {
      console.error("[FinancialStatementFormWrapper] 解答送信エラー:", error);
      Alert.alert("エラー", "解答の送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FinancialStatementForm
      onSubmit={handleSubmit}
      questionNumber={1}
      totalQuestions={1}
      timeRemaining="--:--"
      explanation={explanation}
      correctAnswer={correctAnswer}
    />
  );
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
  answerTemplate,
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

  // Determine if should use LedgerEntryForm based on answer template type or question ID patterns
  const shouldUseLedgerEntryForm =
    answerTemplate?.type === "ledger_entry" ||
    (questionId.startsWith("Q_L_") &&
      isMultiEntryLedgerQuestion(questionId, questionText));

  // Q_L_001〜Q_L_020は新しいプルダウン対応フォームを使用
  const shouldUseLedgerEntryFormWithDropdown =
    answerTemplate?.type === "ledger_account" ||
    (questionId.startsWith("Q_L_") &&
      parseInt(questionId.split("_")[2]) >= 1 &&
      parseInt(questionId.split("_")[2]) <= 20);

  // Determine if should use enhanced journal entry form for complex journal entries
  const shouldUseJournalEntryForm =
    (answerTemplate?.type === "journal_entry" &&
      answerTemplate?.allowMultipleEntries) ||
    (questionId.startsWith("Q_J_") && answerTemplate?.type === "journal_entry");

  // Determine if should use ChoiceAnswerForm for choice questions (traditional single dropdown)
  const shouldUseChoiceForm =
    (answerTemplate?.type === "single_choice" ||
      answerTemplate?.type === "multiple_choice") &&
    !answerTemplate?.questions; // No questions array means traditional choice

  // Determine if should use MultipleBlankChoiceForm for multiple blank questions
  const shouldUseMultipleBlankChoiceForm =
    answerTemplate?.type === "multiple_choice" &&
    answerTemplate?.questions && // Has questions array
    Array.isArray(answerTemplate.questions);

  // Determine if should use VoucherEntryForm for voucher entry questions
  const shouldUseVoucherEntryForm = answerTemplate?.type === "voucher_entry";

  // Debug: Log answerTemplate for voucher questions
  if (questionId.startsWith("Q_L_02") && answerTemplate) {
    console.log(
      "[QuestionDisplay] answerTemplate for voucher:",
      answerTemplate,
    );
  }

  // Determine if should use FinancialStatementForm for financial statement questions
  const shouldUseFinancialStatementForm =
    answerTemplate?.type === "financial_statement";

  // Determine if should use TrialBalanceForm for trial balance questions
  const shouldUseTrialBalanceForm =
    answerTemplate?.type === "trial_balance" ||
    (questionId.startsWith("Q_T_") &&
      answerTemplate?.type !== "financial_statement");

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
      {shouldUseChoiceForm ? (
        <ChoiceAnswerForm
          questionId={questionId}
          type={answerTemplate?.type as "single_choice" | "multiple_choice"}
          options={answerTemplate?.options || []}
          sessionType={sessionType}
          sessionId={sessionId}
          startTime={startTime}
          onSubmitAnswer={onSubmitAnswer}
          showSubmitButton={true}
        />
      ) : shouldUseMultipleBlankChoiceForm ? (
        <MultipleBlankChoiceForm
          questionId={questionId}
          questions={answerTemplate?.questions || []}
          options={answerTemplate?.options || []}
          sessionType={sessionType}
          sessionId={sessionId}
          startTime={startTime}
          onSubmitAnswer={onSubmitAnswer}
          showSubmitButton={true}
        />
      ) : shouldUseVoucherEntryForm ? (
        <VoucherEntryForm
          questionId={questionId}
          voucherTypes={
            answerTemplate?.fields
              ? [
                  {
                    type: answerTemplate.voucher_type || "伝票",
                    fields: answerTemplate.fields.map((field) => ({
                      name: field.name,
                      label: field.label,
                      type:
                        field.type === "dropdown"
                          ? ("select" as const)
                          : (field.type as
                              | "date"
                              | "text"
                              | "number"
                              | "select"),
                      required: field.required || false,
                      options: field.options,
                    })),
                  },
                ]
              : []
          }
          sessionType={sessionType}
          sessionId={sessionId}
          startTime={startTime}
          onSubmitAnswer={onSubmitAnswer}
          showSubmitButton={true}
        />
      ) : shouldUseFinancialStatementForm ? (
        <FinancialStatementFormWrapper
          questionId={questionId}
          sessionType={sessionType}
          sessionId={sessionId}
          startTime={startTime}
          onSubmitAnswer={onSubmitAnswer}
          explanation={explanation}
          correctAnswer={correctAnswer}
        />
      ) : shouldUseTrialBalanceForm ? (
        <TrialBalanceFormWrapper
          questionId={questionId}
          questionText={questionText}
          sessionType={sessionType}
          sessionId={sessionId}
          startTime={startTime}
          onSubmitAnswer={onSubmitAnswer}
          explanation={explanation}
          correctAnswer={correctAnswer}
        />
      ) : shouldUseLedgerEntryFormWithDropdown ? (
        <LedgerEntryFormWithDropdown
          questionId={questionId}
          sessionType={sessionType}
          sessionId={sessionId}
          startTime={startTime}
          onSubmitAnswer={onSubmitAnswer}
          showSubmitButton={true}
          expectedEntries={getExpectedEntryCount(questionText)}
          answerTemplate={answerTemplate}
        />
      ) : shouldUseLedgerEntryForm ? (
        <LedgerEntryForm
          questionId={questionId}
          sessionType={sessionType}
          sessionId={sessionId}
          startTime={startTime}
          onSubmitAnswer={onSubmitAnswer}
          showSubmitButton={true}
          expectedEntries={getExpectedEntryCount(questionText)}
        />
      ) : shouldUseJournalEntryForm ? (
        <JournalEntryForm
          questionId={questionId}
          questionText={questionText}
          sessionType={sessionType}
          sessionId={sessionId}
          startTime={startTime}
          onSubmitAnswer={onSubmitAnswer}
          showSubmitButton={true}
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
