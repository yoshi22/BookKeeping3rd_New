/**
 * セッションサービス
 * 10問バッチのセッション管理・結果計算
 */

import { settingsRepository } from "@/data/repositories/settings-repository";
import { SESSION_BATCH_SIZE } from "@/config/monetization";
import type { SessionState, SessionResult } from "@/types/monetization";
import { logSessionCompleted } from "@/services/analytics-service";
import { logger } from "@/utils/logger";

/**
 * セッションIDを生成
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * セッションサービスクラス
 * 10問のセッションを管理し、完了時に結果を計算
 */
export class SessionService {
  private static instance: SessionService;
  private currentSession: SessionState | null = null;

  private constructor() {}

  /**
   * シングルトンインスタンス取得
   */
  public static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  /**
   * 新しいセッションを開始
   * @param sessionType 学習または復習
   * @param questionIds セッションで出題する問題IDの配列
   * @returns 開始したセッションの状態
   */
  startSession(
    sessionType: "learning" | "review",
    questionIds: string[],
  ): SessionState {
    // 最大10問に制限
    const limitedQuestionIds = questionIds.slice(0, SESSION_BATCH_SIZE);

    this.currentSession = {
      sessionId: generateSessionId(),
      sessionType,
      questionIds: limitedQuestionIds,
      currentIndex: 0,
      answeredCount: 0,
      correctCount: 0,
      startedAt: Date.now(),
    };

    logger.info("セッション開始", {
      sessionId: this.currentSession.sessionId,
      sessionType,
      questionCount: limitedQuestionIds.length,
    });

    return this.currentSession;
  }

  /**
   * 現在のセッションを取得
   */
  getCurrentSession(): SessionState | null {
    return this.currentSession;
  }

  /**
   * セッションが進行中かどうか
   */
  hasActiveSession(): boolean {
    return this.currentSession !== null && !this.currentSession.completedAt;
  }

  /**
   * 解答を記録
   * @param isCorrect 正解かどうか
   * @returns 更新後のセッション状態
   */
  recordAnswer(isCorrect: boolean): SessionState | null {
    if (!this.currentSession) {
      logger.warn("セッションが存在しません");
      return null;
    }

    this.currentSession.answeredCount += 1;
    if (isCorrect) {
      this.currentSession.correctCount += 1;
    }
    this.currentSession.currentIndex += 1;

    logger.info("解答を記録", {
      sessionId: this.currentSession.sessionId,
      isCorrect,
      answeredCount: this.currentSession.answeredCount,
      correctCount: this.currentSession.correctCount,
    });

    return this.currentSession;
  }

  /**
   * セッションが完了したかどうか（10問解答済み）
   */
  isSessionComplete(): boolean {
    if (!this.currentSession) {
      return false;
    }
    return (
      this.currentSession.answeredCount >=
      this.currentSession.questionIds.length
    );
  }

  /**
   * 現在の問題インデックスを取得
   */
  getCurrentQuestionIndex(): number {
    return this.currentSession?.currentIndex ?? 0;
  }

  /**
   * 現在の問題IDを取得
   */
  getCurrentQuestionId(): string | null {
    if (!this.currentSession) {
      return null;
    }
    const index = this.currentSession.currentIndex;
    if (index >= this.currentSession.questionIds.length) {
      return null;
    }
    return this.currentSession.questionIds[index];
  }

  /**
   * セッションを完了し、結果を計算
   * @returns セッション結果
   */
  async completeSession(): Promise<SessionResult | null> {
    if (!this.currentSession) {
      logger.warn("完了するセッションがありません");
      return null;
    }

    const now = Date.now();
    this.currentSession.completedAt = now;

    const totalTimeMs = now - this.currentSession.startedAt;
    const totalQuestions = this.currentSession.answeredCount;
    const correctAnswers = this.currentSession.correctCount;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const accuracy =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;
    const averageTimeMs =
      totalQuestions > 0 ? Math.round(totalTimeMs / totalQuestions) : 0;

    const result: SessionResult = {
      sessionId: this.currentSession.sessionId,
      sessionType: this.currentSession.sessionType,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      accuracy,
      totalTimeMs,
      averageTimeMs,
    };

    // セッション完了回数をインクリメント
    const newSessionCount =
      await settingsRepository.incrementSessionCompletedCount();

    // アナリティクスにログ
    logSessionCompleted({
      sessionType: result.sessionType,
      accuracy: result.accuracy,
      totalQuestions: result.totalQuestions,
      correctAnswers: result.correctAnswers,
      totalTimeMs: result.totalTimeMs,
    });

    logger.info("セッション完了", {
      ...result,
      totalSessionCount: newSessionCount,
    });

    // セッションをリセット
    this.currentSession = null;

    return result;
  }

  /**
   * セッションをキャンセル（途中終了）
   */
  cancelSession(): void {
    if (this.currentSession) {
      logger.info("セッションキャンセル", {
        sessionId: this.currentSession.sessionId,
        answeredCount: this.currentSession.answeredCount,
      });
    }
    this.currentSession = null;
  }

  /**
   * セッション完了回数を取得
   */
  async getSessionCompletedCount(): Promise<number> {
    return settingsRepository.getSessionCompletedCount();
  }

  /**
   * 残りの問題数を取得
   */
  getRemainingQuestions(): number {
    if (!this.currentSession) {
      return 0;
    }
    return (
      this.currentSession.questionIds.length - this.currentSession.answeredCount
    );
  }

  /**
   * セッションの進捗率を取得（0-100）
   */
  getProgressPercentage(): number {
    if (!this.currentSession) {
      return 0;
    }
    const total = this.currentSession.questionIds.length;
    if (total === 0) return 0;
    return Math.round((this.currentSession.answeredCount / total) * 100);
  }
}

// シングルトンインスタンスをエクスポート
export const sessionService = SessionService.getInstance();
