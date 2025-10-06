/**
 * 問題ナビゲーション管理カスタムフック
 * Step 2.1.6: カテゴリ選択・問題ナビゲーション機能実装
 */

import { useState, useEffect, useCallback } from "react";

interface Question {
  id: string;
  category_id: string;
  question_text: string;
  explanation: string;
  difficulty: number;
  answer_template_json?: string;
}

interface UseQuestionNavigationProps {
  category: "journal" | "ledger" | "trial_balance";
  questions: Question[];
  initialQuestionId?: string;
}

interface UseQuestionNavigationReturn {
  currentQuestion: Question | null;
  currentIndex: number;
  totalQuestions: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  goToPrevious: () => void;
  goToNext: () => void;
  goToQuestion: (index: number) => void;
  goToQuestionById: (questionId: string) => void;
  getCategoryName: () => string;
  getProgress: () => { current: number; total: number; percentage: number };
}

// 以前のハードコーディングされたサンプルデータは削除
// 現在は問題画面から実際の問題配列が渡される

export function useQuestionNavigation({
  category,
  questions = [],
  initialQuestionId,
}: UseQuestionNavigationProps): UseQuestionNavigationReturn {
  // 問題リストの取得（渡された問題を使用）
  const questionList = questions;

  const [currentIndex, setCurrentIndex] = useState(0);

  // 初期問題の設定
  useEffect(() => {
    if (initialQuestionId) {
      const index = questionList.findIndex((q) => q.id === initialQuestionId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [initialQuestionId, questionList]);

  // 現在の問題
  const currentQuestion = questionList[currentIndex] || null;

  // ナビゲーション制御
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < questionList.length - 1;

  // 前の問題に移動
  const goToPrevious = useCallback(() => {
    if (canGoPrevious) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [canGoPrevious]);

  // 次の問題に移動
  const goToNext = useCallback(() => {
    if (canGoNext) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [canGoNext]);

  // 指定のインデックスの問題に移動
  const goToQuestion = useCallback(
    (index: number) => {
      if (index >= 0 && index < questionList.length) {
        setCurrentIndex(index);
      }
    },
    [questionList.length],
  );

  // 指定のIDの問題に移動
  const goToQuestionById = useCallback(
    (questionId: string) => {
      const index = questionList.findIndex((q) => q.id === questionId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    },
    [questionList],
  );

  // answer_template_jsonから問題タイプを抽出
  const getQuestionType = (question: Question | null): string | null => {
    if (!question?.answer_template_json) return null;

    try {
      const template = JSON.parse(question.answer_template_json);
      return template.type || null;
    } catch {
      return null;
    }
  };

  // 問題タイプから日本語表示名へのマッピング
  const getQuestionTypeLabel = (
    questionType: string | null,
    category: string,
  ): string => {
    if (!questionType) {
      // フォールバック: カテゴリ名のみ表示
      switch (category) {
        case "journal":
          return "仕訳";
        case "ledger":
          return "帳簿";
        case "trial_balance":
          return "試算表";
        default:
          return "";
      }
    }

    // 具体的な問題タイプのマッピング
    const typeMapping: { [key: string]: string } = {
      // Q1 (仕訳問題)
      journal_entry: "仕訳問題",
      compound_journal_entry: "複合仕訳問題",

      // Q2 (帳簿問題)
      vocabulary: "用語問題",
      fill_in_ledger: "勘定記入問題",
      auxiliary_book: "補助簿記入問題",
      ledger_account: "勘定記入問題",
      subsidiary_book: "補助簿問題",
      ledger_entry: "帳簿記入問題",

      // Q3 (試算表問題)
      trial_balance: "試算表作成問題",
      fill_in_trial_balance: "試算表穴埋め問題",
      fill_in_comprehensive_trial_balance: "精算表穴埋め問題",
      fill_in_financial_statement: "財務諸表穴埋め問題",
      financial_statement: "財務諸表問題",

      // その他
      voucher_entry: "伝票問題",
      single_choice: "選択問題",
      multiple_choice: "複数選択問題",
    };

    return typeMapping[questionType] || questionType;
  };

  // カテゴリ名を取得（問題タイプ込み）
  const getCategoryName = useCallback(() => {
    const questionType = getQuestionType(currentQuestion);
    return getQuestionTypeLabel(questionType, category);
  }, [category, currentQuestion]);

  // 進捗情報を取得
  const getProgress = useCallback(() => {
    const current = currentIndex + 1;
    const total = questionList.length;
    const percentage = total > 0 ? (current / total) * 100 : 0;

    return { current, total, percentage };
  }, [currentIndex, questionList.length]);

  return {
    currentQuestion,
    currentIndex,
    totalQuestions: questionList.length,
    canGoPrevious,
    canGoNext,
    goToPrevious,
    goToNext,
    goToQuestion,
    goToQuestionById,
    getCategoryName,
    getProgress,
  };
}
