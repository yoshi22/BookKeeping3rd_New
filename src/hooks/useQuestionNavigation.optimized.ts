/**
 * 最適化版問題ナビゲーション管理カスタムフック
 * Step 2.1.7: パフォーマンス最適化実装例
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

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

// サンプル問題データ（カテゴリ別） - 最適化のためWeakMapキャッシュを使用
const SAMPLE_QUESTIONS: Record<string, Question[]> = {
  journal: [
    {
      id: 'Q_J_001',
      category_id: 'journal',
      question_text: '商品200,000円を現金で仕入れた。',
      explanation: '商品を仕入れたときは「仕入」勘定で処理します。現金で支払っているので、現金が減少します。',
      difficulty: 1,
    },
    {
      id: 'Q_J_002',
      category_id: 'journal',
      question_text: '商品300,000円を売り上げ、代金は掛けとした。',
      explanation: '商品を販売したときは「売上」勘定に記録します。代金が掛けの場合は「売掛金」勘定を使用します。',
      difficulty: 1,
    },
    {
      id: 'Q_J_003',
      category_id: 'journal',
      question_text: '売掛金150,000円を現金で回収した。',
      explanation: '売掛金を現金で回収したときは、現金が増加し、売掛金が減少します。',
      difficulty: 1,
    },
  ],
  ledger: [
    {
      id: 'Q_L_001',
      category_id: 'ledger',
      question_text: '以下の取引を現金出納帳に記入してください。\n4月1日 商品100,000円を現金で仕入れた。\n4月3日 売上200,000円を現金で受け取った。\n4月1日の現金残高は50,000円でした。',
      explanation: '現金出納帳では、期首残高50,000円から仕入で100,000円減少（残高-50,000円）、その後売上で200,000円増加して最終残高150,000円となります。',
      difficulty: 2,
    },
  ],
  trial_balance: [
    {
      id: 'Q_T_001',
      category_id: 'trial_balance',
      question_text: '以下の残高から試算表を作成してください。\n現金: 100,000円\n売掛金: 200,000円\n商品: 150,000円\n買掛金: 80,000円\n資本金: 370,000円\n\n借方合計を求めてください。',
      explanation: '借方科目（現金100,000円 + 売掛金200,000円 + 商品150,000円）の合計は450,000円です。試算表では借方合計と貸方合計が一致する必要があります。',
      difficulty: 2,
    },
  ],
};

// 問題検索のキャッシュ（パフォーマンス最適化）
const questionIndexCache = new Map<string, number>();

export function useQuestionNavigationOptimized({
  category,
  questions = [],
  initialQuestionId,
}: UseQuestionNavigationProps): UseQuestionNavigationReturn {
  
  // 問題リストの取得（useMemoで最適化）
  const questionList = useMemo(() => {
    const list = questions.length > 0 ? questions : (SAMPLE_QUESTIONS[category] || []);
    
    // インデックスキャッシュを更新
    questionIndexCache.clear();
    list.forEach((question, index) => {
      questionIndexCache.set(question.id, index);
    });
    
    return list;
  }, [questions, category]);
  
  const [currentIndex, setCurrentIndex] = useState(0);

  // 初期問題の設定（最適化：キャッシュを使用）
  useEffect(() => {
    if (initialQuestionId) {
      const cachedIndex = questionIndexCache.get(initialQuestionId);
      if (cachedIndex !== undefined) {
        setCurrentIndex(cachedIndex);
      } else {
        // フォールバック: 線形検索
        const index = questionList.findIndex(q => q.id === initialQuestionId);
        if (index !== -1) {
          setCurrentIndex(index);
        }
      }
    }
  }, [initialQuestionId, questionList]);

  // 現在の問題（useMemoで最適化）
  const currentQuestion = useMemo(() => {
    return questionList[currentIndex] || null;
  }, [questionList, currentIndex]);

  // ナビゲーション制御（useMemoで最適化）
  const navigationState = useMemo(() => ({
    canGoPrevious: currentIndex > 0,
    canGoNext: currentIndex < questionList.length - 1,
    totalQuestions: questionList.length,
  }), [currentIndex, questionList.length]);

  // 前の問題に移動（useCallbackで最適化）
  const goToPrevious = useCallback(() => {
    if (navigationState.canGoPrevious) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [navigationState.canGoPrevious]);

  // 次の問題に移動（useCallbackで最適化）
  const goToNext = useCallback(() => {
    if (navigationState.canGoNext) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [navigationState.canGoNext]);

  // 指定のインデックスの問題に移動（useCallbackで最適化）
  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questionList.length) {
      setCurrentIndex(index);
    }
  }, [questionList.length]);

  // 指定のIDの問題に移動（useCallback + キャッシュで最適化）
  const goToQuestionById = useCallback((questionId: string) => {
    const cachedIndex = questionIndexCache.get(questionId);
    if (cachedIndex !== undefined) {
      setCurrentIndex(cachedIndex);
    } else {
      // フォールバック: 線形検索
      const index = questionList.findIndex(q => q.id === questionId);
      if (index !== -1) {
        setCurrentIndex(index);
        questionIndexCache.set(questionId, index); // キャッシュに追加
      }
    }
  }, [questionList]);

  // カテゴリ名を取得（useCallbackで最適化）
  const getCategoryName = useCallback(() => {
    switch (category) {
      case 'journal': return '仕訳';
      case 'ledger': return '帳簿';
      case 'trial_balance': return '試算表';
      default: return '';
    }
  }, [category]);

  // 進捗情報を取得（useMemoで最適化）
  const getProgress = useCallback(() => {
    const current = currentIndex + 1;
    const total = questionList.length;
    const percentage = total > 0 ? (current / total) * 100 : 0;
    
    return { current, total, percentage };
  }, [currentIndex, questionList.length]);

  return {
    currentQuestion,
    currentIndex,
    totalQuestions: navigationState.totalQuestions,
    canGoPrevious: navigationState.canGoPrevious,
    canGoNext: navigationState.canGoNext,
    goToPrevious,
    goToNext,
    goToQuestion,
    goToQuestionById,
    getCategoryName,
    getProgress,
  };
}

// デバウンス関数（入力処理の最適化用）
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 仮想化リスト用のフック（大量データ表示の最適化）
export function useVirtualizedList<T>(
  items: T[],
  containerHeight: number,
  itemHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2; // 2つ余分にレンダリング
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount, items.length);
    
    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [items, containerHeight, itemHeight, scrollTop]);
  
  const handleScroll = useCallback((event: any) => {
    setScrollTop(event.nativeEvent.contentOffset.y);
  }, []);
  
  return {
    visibleItems,
    handleScroll,
  };
}