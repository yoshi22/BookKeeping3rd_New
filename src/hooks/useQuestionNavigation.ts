/**
 * 問題ナビゲーション管理カスタムフック
 * Step 2.1.6: カテゴリ選択・問題ナビゲーション機能実装
 */

import { useState, useEffect, useCallback } from 'react';

interface Question {
  id: string;
  category_id: string;
  question_text: string;
  explanation: string;
  difficulty: number;
}

interface UseQuestionNavigationProps {
  category: 'journal' | 'ledger' | 'trial_balance';
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
      const index = questionList.findIndex(q => q.id === initialQuestionId);
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
      setCurrentIndex(prev => prev - 1);
    }
  }, [canGoPrevious]);

  // 次の問題に移動
  const goToNext = useCallback(() => {
    if (canGoNext) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [canGoNext]);

  // 指定のインデックスの問題に移動
  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questionList.length) {
      setCurrentIndex(index);
    }
  }, [questionList.length]);

  // 指定のIDの問題に移動
  const goToQuestionById = useCallback((questionId: string) => {
    const index = questionList.findIndex(q => q.id === questionId);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [questionList]);

  // カテゴリ名を取得
  const getCategoryName = useCallback(() => {
    switch (category) {
      case 'journal': return '仕訳';
      case 'ledger': return '帳簿';
      case 'trial_balance': return '試算表';
      default: return '';
    }
  }, [category]);

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