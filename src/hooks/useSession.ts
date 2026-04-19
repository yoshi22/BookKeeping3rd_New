/**
 * セッション管理フック
 * 10問バッチのセッション状態を管理
 */

import { useState, useCallback, useEffect } from "react";
import { sessionService } from "@/services/session-service";
import type { SessionState, SessionResult } from "@/types/monetization";

/**
 * useSessionフックの戻り値
 */
export interface UseSessionReturn {
  /** 現在のセッション状態 */
  session: SessionState | null;
  /** セッションが進行中かどうか */
  hasActiveSession: boolean;
  /** 現在の問題インデックス (0-based) */
  currentQuestionIndex: number;
  /** セッションが完了したかどうか（10問解答済み） */
  isSessionComplete: boolean;
  /** 残りの問題数 */
  remainingQuestions: number;
  /** 進捗率 (0-100) */
  progressPercentage: number;
  /** 新しいセッションを開始 */
  startSession: (
    sessionType: "learning" | "review",
    questionIds: string[],
  ) => SessionState;
  /** 解答を記録 */
  recordAnswer: (isCorrect: boolean) => void;
  /** セッションを完了 */
  completeSession: () => Promise<SessionResult | null>;
  /** セッションをキャンセル */
  cancelSession: () => void;
  /** 現在の問題ID */
  currentQuestionId: string | null;
}

/**
 * セッション管理フック
 * 10問のセッションを管理し、進捗を追跡
 */
export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<SessionState | null>(
    sessionService.getCurrentSession(),
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    sessionService.getCurrentQuestionIndex(),
  );

  // セッション状態を同期
  const syncSessionState = useCallback(() => {
    const currentSession = sessionService.getCurrentSession();
    setSession(currentSession);
    setCurrentQuestionIndex(sessionService.getCurrentQuestionIndex());
  }, []);

  /**
   * 新しいセッションを開始
   */
  const startSession = useCallback(
    (
      sessionType: "learning" | "review",
      questionIds: string[],
    ): SessionState => {
      const newSession = sessionService.startSession(sessionType, questionIds);
      setSession(newSession);
      setCurrentQuestionIndex(0);
      return newSession;
    },
    [],
  );

  /**
   * 解答を記録
   */
  const recordAnswer = useCallback((isCorrect: boolean) => {
    const updatedSession = sessionService.recordAnswer(isCorrect);
    if (updatedSession) {
      setSession({ ...updatedSession });
      setCurrentQuestionIndex(sessionService.getCurrentQuestionIndex());
    }
  }, []);

  /**
   * セッションを完了
   */
  const completeSession =
    useCallback(async (): Promise<SessionResult | null> => {
      const result = await sessionService.completeSession();
      setSession(null);
      setCurrentQuestionIndex(0);
      return result;
    }, []);

  /**
   * セッションをキャンセル
   */
  const cancelSession = useCallback(() => {
    sessionService.cancelSession();
    setSession(null);
    setCurrentQuestionIndex(0);
  }, []);

  // 派生状態
  const hasActiveSession = sessionService.hasActiveSession();
  const isSessionComplete = sessionService.isSessionComplete();
  const remainingQuestions = sessionService.getRemainingQuestions();
  const progressPercentage = sessionService.getProgressPercentage();
  const currentQuestionId = sessionService.getCurrentQuestionId();

  // マウント時に既存のセッション状態を同期
  useEffect(() => {
    syncSessionState();
  }, [syncSessionState]);

  return {
    session,
    hasActiveSession,
    currentQuestionIndex,
    isSessionComplete,
    remainingQuestions,
    progressPercentage,
    startSession,
    recordAnswer,
    completeSession,
    cancelSession,
    currentQuestionId,
  };
}

export default useSession;
