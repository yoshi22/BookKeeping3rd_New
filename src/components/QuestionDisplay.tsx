// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * 問題表示コンポーネント
 * Step 2.2: 解答記録機能実装統合
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { logger } from "../utils/logger";
import {
  useTheme,
  useThemedStyles,
  useColors,
  useDynamicColors,
  type Theme,
} from "../context/ThemeContext";
import AnswerForm from "./AnswerForm";
import UnifiedLedgerEntryForm from "./unified/LedgerEntryForm";
import LedgerEntryFormWithDropdown from "./LedgerEntryFormWithDropdown";
import UnifiedJournalEntryForm from "./unified/JournalEntryForm";
import ChoiceAnswerForm from "./ChoiceAnswerForm";
import MultipleBlankChoiceForm from "./MultipleBlankChoiceForm";
import VoucherEntryForm from "./VoucherEntryForm";
import TrialBalanceForm, { TrialBalanceEntry } from "./cbt/TrialBalanceForm";
import FinancialStatementForm from "./FinancialStatementForm";
import VocabularyForm from "./VocabularyForm";
import FillInLedgerForm from "./FillInLedgerForm";
import AuxiliaryBookForm from "./AuxiliaryBookForm";
import FillInTrialBalanceForm from "./cbt/FillInTrialBalanceForm";
import FillInComprehensiveTrialBalanceForm from "./cbt/FillInComprehensiveTrialBalanceForm";
import FillInFinancialStatementForm from "./cbt/FillInFinancialStatementForm";
import QuestionText from "./QuestionText";
import { UnifiedExplanation } from "./unified/UnifiedExplanation";
import {
  answerService,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from "../services/answer-service";
import { reviewService } from "../services/review-service";
import { SessionType } from "../types/database";

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
  questions?: {
    id: string;
    label: string;
    options: string[];
  }[];
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
  answerTemplate?: AnswerTemplate;
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
      logger.error("[TrialBalanceFormWrapper] 解答送信エラー:", error as Error);
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
      logger.error(
        "[FinancialStatementFormWrapper] 解答送信エラー:",
        error as Error,
      );
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

// Wrapper for FillInTrialBalanceForm
interface FillInTrialBalanceFormWrapperProps {
  questionId: string;
  question: {
    id: string;
    question_text: string;
    answer_template_json: string;
    correct_answer_json: string;
  };
  sessionType?: SessionType;
  sessionId?: string;
  startTime?: number;
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void;
}

function FillInTrialBalanceFormWrapper({
  questionId,
  question,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
}: FillInTrialBalanceFormWrapperProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number | string, number>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // questionIdが変更された時にselectedAnswersをリセット
  useEffect(() => {
    setSelectedAnswers({});
  }, [questionId]);

  const handleAnswerChange = (answers: Record<number | string, number>) => {
    setSelectedAnswers(answers);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const submitRequest: SubmitAnswerRequest = {
        questionId,
        answerData: { blanks: selectedAnswers },
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
        );
      }
    } catch (error) {
      logger.error(
        "[FillInTrialBalanceFormWrapper] 解答送信エラー:",
        error as Error,
      );
      Alert.alert("エラー", "解答の送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FillInTrialBalanceForm
        question={question}
        initialAnswer={selectedAnswers}
        onAnswerChange={handleAnswerChange}
        disabled={isSubmitting}
      />
      <TouchableOpacity
        style={{
          backgroundColor: "#007AFF",
          padding: 16,
          margin: 16,
          borderRadius: 8,
          alignItems: "center",
        }}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}>
          {isSubmitting ? "送信中..." : "解答を送信"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Wrapper for FillInComprehensiveTrialBalanceForm
interface FillInComprehensiveTrialBalanceFormWrapperProps {
  questionId: string;
  question: {
    id: string;
    question_text: string;
    answer_template_json: string;
    correct_answer_json: string;
  };
  sessionType?: SessionType;
  sessionId?: string;
  startTime?: number;
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void;
}

function FillInComprehensiveTrialBalanceFormWrapper({
  questionId,
  question,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
}: FillInComprehensiveTrialBalanceFormWrapperProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number | string, number>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (answers: Record<number | string, number>) => {
    setSelectedAnswers(answers);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const submitRequest: SubmitAnswerRequest = {
        questionId,
        answerData: { blanks: selectedAnswers },
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
        );
      }
    } catch (error) {
      logger.error(
        "[FillInComprehensiveTrialBalanceFormWrapper] 解答送信エラー:",
        error as Error,
      );
      Alert.alert("エラー", "解答の送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FillInComprehensiveTrialBalanceForm
        question={question}
        initialAnswer={selectedAnswers}
        onAnswerChange={handleAnswerChange}
        disabled={isSubmitting}
      />
      <TouchableOpacity
        style={{
          backgroundColor: "#007AFF",
          padding: 16,
          margin: 16,
          borderRadius: 8,
          alignItems: "center",
        }}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}>
          {isSubmitting ? "送信中..." : "解答を送信"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Wrapper for FillInFinancialStatementForm
interface FillInFinancialStatementFormWrapperProps {
  questionId: string;
  question: {
    id: string;
    question_text: string;
    answer_template_json: string;
    correct_answer_json: string;
  };
  sessionType?: SessionType;
  sessionId?: string;
  startTime?: number;
  onSubmitAnswer?: (response: SubmitAnswerResponse) => void;
}

function FillInFinancialStatementFormWrapper({
  questionId,
  question,
  sessionType = "learning",
  sessionId,
  startTime = Date.now(),
  onSubmitAnswer,
}: FillInFinancialStatementFormWrapperProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number | string, number>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // questionIdが変更された時にselectedAnswersをリセット
  useEffect(() => {
    setSelectedAnswers({});
    console.log(
      `[FillInFinancialStatementFormWrapper] Answer reset for question ${questionId}`,
    );
  }, [questionId]);

  const handleAnswerChange = (answers: Record<number | string, number>) => {
    setSelectedAnswers(answers);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const submitRequest: SubmitAnswerRequest = {
        questionId,
        answerData: { blanks: selectedAnswers },
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
        );
      }
    } catch (error) {
      logger.error(
        "[FillInFinancialStatementFormWrapper] 解答送信エラー:",
        error as Error,
      );
      Alert.alert("エラー", "解答の送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FillInFinancialStatementForm
        question={question}
        initialAnswer={selectedAnswers}
        onAnswerChange={handleAnswerChange}
        disabled={isSubmitting}
      />
      <TouchableOpacity
        style={{
          backgroundColor: "#007AFF",
          padding: 16,
          margin: 16,
          borderRadius: 8,
          alignItems: "center",
        }}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "bold" }}>
          {isSubmitting ? "送信中..." : "解答を送信"}
        </Text>
      </TouchableOpacity>
    </View>
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
  // Theme system integration for dark mode support
  const { theme, isDark, getStatusBarStyle } = useTheme();
  const colors = useColors();
  const dynamicColors = useDynamicColors();
  const styles = useThemedStyles(createStyles);
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

  // Q_L_001〜Q_L_010（勘定記入問題）は新しいプルダウン対応フォームを使用
  const shouldUseLedgerEntryFormWithDropdown =
    answerTemplate?.type === "ledger_account" ||
    (questionId.startsWith("Q_L_") &&
      parseInt(questionId.split("_")[2]) >= 1 &&
      parseInt(questionId.split("_")[2]) <= 10);

  // Q_L_011〜Q_L_020（現金出納帳等の補助簿問題）は統合フォームを使用
  const shouldUseSubsidiaryBookForm =
    answerTemplate?.type === "subsidiary_book" ||
    (questionId.startsWith("Q_L_") &&
      parseInt(questionId.split("_")[2]) >= 11 &&
      parseInt(questionId.split("_")[2]) <= 20);

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

  // Determine if should use VocabularyForm for vocabulary questions
  const shouldUseVocabularyForm = answerTemplate?.type === "vocabulary";

  // Determine if should use FillInLedgerForm for fill-in ledger questions (Q2_L_)
  const shouldUseFillInLedgerForm = answerTemplate?.type === "fill_in_ledger";

  // Determine if should use AuxiliaryBookForm for auxiliary book questions (Q2_B_)
  const shouldUseAuxiliaryBookForm = answerTemplate?.type === "auxiliary_book";

  // Determine if should use VoucherEntryForm for voucher entry questions
  const shouldUseVoucherEntryForm = answerTemplate?.type === "voucher_entry";

  // Determine if should use FinancialStatementForm for financial statement questions
  const shouldUseFinancialStatementForm =
    answerTemplate?.type === "financial_statement";

  // Determine if should use TrialBalanceForm for trial balance questions
  const shouldUseTrialBalanceForm =
    answerTemplate?.type === "trial_balance" ||
    (questionId.startsWith("Q_T_") &&
      answerTemplate?.type !== "financial_statement");

  // Determine if should use fill-in trial balance form (Q3_TB problems)
  const shouldUseFillInTrialBalanceForm =
    answerTemplate?.type === "fill_in_trial_balance";

  // Determine if should use fill-in comprehensive trial balance form (Q3_CTB problems)
  const shouldUseFillInComprehensiveTrialBalanceForm =
    answerTemplate?.type === "fill_in_comprehensive_trial_balance";

  // Determine if should use fill-in financial statement form (Q3_FS problems)
  const shouldUseFillInFinancialStatementForm =
    answerTemplate?.type === "fill_in_financial_statement";

  // Determine if should use enhanced journal entry form for journal entries
  // UnifiedJournalEntryForm now supports horizontal layout and NumericPad (restored 2025-08-22)
  const shouldUseJournalEntryForm = answerTemplate?.type === "journal_entry";
  // Original condition restored after horizontal layout fix

  // レンダリング判定ログ（デバッグ用に一時有効化）
  if (process.env.NODE_ENV === "development") {
    console.log(`[QuestionDisplay] レンダリング判定: ${questionId}`, {
      answerTemplateType: answerTemplate?.type,
      allowMultipleEntries: answerTemplate?.allowMultipleEntries,
      shouldUseJournalEntryForm,
      shouldUseTrialBalanceForm,
      shouldUseFillInTrialBalanceForm,
      shouldUseFillInComprehensiveTrialBalanceForm,
      shouldUseFillInFinancialStatementForm,
      shouldUseSubsidiaryBookForm,
      shouldUseLedgerEntryFormWithDropdown,
      shouldUseLedgerEntryForm,
      shouldUseChoiceForm,
      shouldUseVocabularyForm,
      shouldUseFillInLedgerForm,
      shouldUseAuxiliaryBookForm,
      answerFieldsLength: answerFields.length,
      hasOnAnswerChange: !!onAnswerChange,
    });
  }

  // 解説展開時のハンドラー（復習対象追加）
  const handleExplanationExpand = useCallback(
    async (expanded: boolean) => {
      if (expanded && sessionType !== "mock_exam" && questionId) {
        try {
          await reviewService.forceAddToReview(questionId, "解説を見た");
          logger.debug(
            `[QuestionDisplay] 解説展開で復習対象に追加: ${questionId}`,
          );
        } catch (error) {
          logger.warn(`[QuestionDisplay] 復習対象追加エラー: ${error}`);
          // エラーでもUIには影響させない
        }
      }
    },
    [questionId, sessionType],
  );

  return (
    <View style={styles.container} testID="question-screen">
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          testID="question-back-button"
        >
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        <View style={styles.questionInfo}>
          <Text style={styles.questionId} testID="question-id">
            {questionId}
          </Text>
          <Text style={styles.categoryName}>{categoryName}</Text>
        </View>
        <Text style={styles.difficulty}>難易度: {difficulty}</Text>
      </View>

      {/* 問題文 - VocabularyForm, FillInLedgerForm, AuxiliaryBookForm, Q3問題フォームは自己完結型なので除外 */}
      {!shouldUseVocabularyForm &&
        !shouldUseFillInLedgerForm &&
        !shouldUseAuxiliaryBookForm &&
        !shouldUseFillInTrialBalanceForm &&
        !shouldUseFillInComprehensiveTrialBalanceForm &&
        !shouldUseFillInFinancialStatementForm && (
          <QuestionText
            key={`question-text-${questionId}`}
            questionText={questionText}
            questionId={questionId}
            difficulty={difficulty}
          />
        )}

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
      ) : shouldUseVocabularyForm ? (
        <VocabularyForm
          questionId={questionId}
          answerTemplate={answerTemplate as any}
          sessionType={sessionType}
          sessionId={sessionId}
          startTime={startTime}
          onSubmitAnswer={onSubmitAnswer}
          showSubmitButton={true}
        />
      ) : shouldUseFillInLedgerForm ? (
        <FillInLedgerForm
          questionId={questionId}
          answerTemplate={answerTemplate as any}
          sessionType={sessionType}
          sessionId={sessionId}
          startTime={startTime}
          onSubmitAnswer={onSubmitAnswer}
          showSubmitButton={true}
        />
      ) : shouldUseAuxiliaryBookForm ? (
        <AuxiliaryBookForm
          questionId={questionId}
          answerTemplate={answerTemplate as any}
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
      ) : shouldUseFillInTrialBalanceForm ? (
        <FillInTrialBalanceFormWrapper
          questionId={questionId}
          question={{
            id: questionId,
            question_text: questionText,
            answer_template_json: answerTemplate
              ? JSON.stringify(answerTemplate)
              : "{}",
            correct_answer_json: correctAnswer
              ? JSON.stringify(correctAnswer)
              : "{}",
          }}
          sessionType={sessionType}
          sessionId={sessionId}
          startTime={startTime}
          onSubmitAnswer={onSubmitAnswer}
        />
      ) : shouldUseFillInComprehensiveTrialBalanceForm ? (
        <FillInComprehensiveTrialBalanceFormWrapper
          questionId={questionId}
          question={{
            id: questionId,
            question_text: questionText,
            answer_template_json: answerTemplate
              ? JSON.stringify(answerTemplate)
              : "{}",
            correct_answer_json: correctAnswer
              ? JSON.stringify(correctAnswer)
              : "{}",
          }}
          sessionType={sessionType}
          sessionId={sessionId}
          startTime={startTime}
          onSubmitAnswer={onSubmitAnswer}
        />
      ) : shouldUseFillInFinancialStatementForm ? (
        <FillInFinancialStatementFormWrapper
          questionId={questionId}
          question={{
            id: questionId,
            question_text: questionText,
            answer_template_json: answerTemplate
              ? JSON.stringify(answerTemplate)
              : "{}",
            correct_answer_json: correctAnswer
              ? JSON.stringify(correctAnswer)
              : "{}",
          }}
          sessionType={sessionType}
          sessionId={sessionId}
          startTime={startTime}
          onSubmitAnswer={onSubmitAnswer}
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
      ) : shouldUseJournalEntryForm ? (
        <UnifiedJournalEntryForm
          questionId={questionId}
          questionText={questionText}
          sessionType={sessionType}
          sessionId={sessionId}
          startTime={startTime}
          onSubmitAnswer={onSubmitAnswer}
          showSubmitButton={true}
          mode="learning"
          answerTemplate={answerTemplate}
        />
      ) : shouldUseSubsidiaryBookForm ? (
        <UnifiedLedgerEntryForm
          questionId={questionId}
          questionText={questionText}
          sessionType={sessionType}
          sessionId={sessionId}
          startTime={startTime}
          onSubmitAnswer={onSubmitAnswer}
          showSubmitButton={true}
          expectedEntries={getExpectedEntryCount(questionText)}
          mode="learning"
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
        <UnifiedLedgerEntryForm
          questionId={questionId}
          questionText={questionText}
          sessionType={sessionType}
          sessionId={sessionId}
          startTime={startTime}
          onSubmitAnswer={onSubmitAnswer}
          showSubmitButton={true}
          expectedEntries={getExpectedEntryCount(questionText)}
          mode="learning"
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
      {(() => {
        const determinedQuestionType =
          answerTemplate?.type === "fill_in_ledger" ||
          answerTemplate?.type === "vocabulary"
            ? "ledger"
            : answerTemplate?.type === "fill_in_trial_balance" ||
                answerTemplate?.type ===
                  "fill_in_comprehensive_trial_balance" ||
                answerTemplate?.type === "fill_in_financial_statement"
              ? "trial_balance"
              : "journal";

        console.log("[QuestionDisplay] UnifiedExplanation Props:", {
          questionId,
          answerTemplateType: answerTemplate?.type,
          determinedQuestionType,
          hasAnswerTemplate: !!answerTemplate,
        });

        return (
          <UnifiedExplanation
            explanation={explanation || ""}
            mode="panel"
            isVisible={showExplanation}
            isCorrect={isCorrect}
            userAnswer={answers}
            correctAnswer={correctAnswer}
            showAnswerComparison={
              showExplanation && Object.keys(answers).length > 0
            }
            questionType={determinedQuestionType}
            questionTemplate={answerTemplate}
            sessionMode={sessionType}
            expandable={true}
            defaultExpanded={false}
            questionId={questionId}
            onExpand={handleExplanationExpand}
          />
        );
      })()}
    </View>
  );
}

// Theme-aware styles function for dark mode support
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.surface,
      padding: 15,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
    },
    backButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    backButtonText: {
      color: theme.colors.primary,
      fontSize: 16,
    },
    questionInfo: {
      alignItems: "center",
    },
    questionId: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    difficulty: {
      fontSize: 12,
      color: theme.colors.warning, // Theme orange for difficulty
    },
    answerSection: {
      backgroundColor: theme.colors.surface,
      margin: 15,
      padding: 20,
      borderRadius: 10,
      ...theme.shadows.medium,
    },
    answerTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 15,
      color: theme.colors.text,
    },
    answerPlaceholder: {
      padding: 20,
      borderWidth: 2,
      borderColor: theme.colors.borderLight,
      borderStyle: "dashed",
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 120,
    },
    placeholderText: {
      fontSize: 16,
      color: theme.colors.textDisabled,
      textAlign: "center",
      lineHeight: 24,
    },
    actionSection: {
      padding: 15,
      marginTop: "auto",
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
    },
    submitButtonText: {
      color: theme.colors.surface,
      fontSize: 16,
      fontWeight: "bold",
    },
  });
