/**
 * 解答処理サービス
 * Step 2.2: 解答記録機能実装
 * CBT形式解答の送信・判定・記録を統合管理
 */

import { CBTAnswerData, SessionType } from "../types/database";
import { Question, QuestionCorrectAnswer } from "../types/models";
import {
  learningHistoryRepository,
  CBTAnswerRecord,
} from "../data/repositories/learning-history-repository";
import { questionRepository } from "../data/repositories/question-repository";
import { reviewService, ReviewUpdateResult } from "./review-service";
import { statisticsCache } from "./statistics-cache";
import { v4 as uuidv4 } from "uuid";

/**
 * 解答送信リクエスト
 */
export interface SubmitAnswerRequest {
  questionId: string;
  answerData: CBTAnswerData;
  sessionType: SessionType;
  sessionId?: string;
  startTime: number; // タイムスタンプ（ミリ秒）
}

/**
 * 解答送信レスポンス
 */
export interface SubmitAnswerResponse {
  success: boolean;
  isCorrect: boolean;
  answerTimeMs: number;
  explanation: string;
  correctAnswer: QuestionCorrectAnswer;
  validationErrors?: string[];
  sessionId: string;
  historyId: number;
  reviewUpdate?: ReviewUpdateResult; // 復習状況更新結果
}

/**
 * 解答処理サービスクラス
 */
export class AnswerService {
  /**
   * 解答送信処理
   */
  public async submitAnswer(
    request: SubmitAnswerRequest,
  ): Promise<SubmitAnswerResponse> {
    const startProcessTime = Date.now();

    try {
      console.log(`[AnswerService] 解答送信開始: ${request.questionId}`);

      // 1. 問題データ取得
      const question = await questionRepository.findById(request.questionId);
      if (!question) {
        throw new Error(`問題が見つかりません: ${request.questionId}`);
      }

      // 2. 解答時間計算
      const answerTimeMs = Date.now() - request.startTime;

      // 3. バリデーション実行
      const validationErrors = this.validateAnswer(
        request.answerData,
        question,
      );

      // 4. 正解判定
      const isCorrect =
        validationErrors.length === 0 &&
        this.isAnswerCorrect(request.answerData, question);

      // 5. セッションID生成（未提供の場合）
      const sessionId = request.sessionId || uuidv4();

      // 6. 学習履歴記録
      const answerRecord: CBTAnswerRecord = {
        questionId: request.questionId,
        answerData: request.answerData,
        isCorrect,
        answerTimeMs,
        sessionId,
        sessionType: request.sessionType,
        validationErrors:
          validationErrors.length > 0 ? validationErrors : undefined,
      };

      const historyRecord =
        await learningHistoryRepository.recordAnswer(answerRecord);

      // 7. 統計キャッシュ無効化
      statisticsCache.invalidateOnAnswerSubmit();

      // 8. 復習状況更新（学習・復習セッションのみ）
      let reviewUpdate: ReviewUpdateResult | undefined;
      if (
        request.sessionType === "learning" ||
        request.sessionType === "review"
      ) {
        try {
          reviewUpdate = await reviewService.updateReviewStatus(
            request.questionId,
            isCorrect,
            answerTimeMs,
          );
          console.log(
            `[AnswerService] 復習状況更新: ${reviewUpdate.action} - ${reviewUpdate.message}`,
          );
        } catch (reviewError) {
          console.error("[AnswerService] 復習状況更新エラー:", reviewError);
          // 復習状況更新エラーは致命的ではないため、処理を継続
        }
      }

      // 9. 正解データ取得
      const correctAnswer = JSON.parse(
        question.correct_answer_json,
      ) as QuestionCorrectAnswer;

      const response: SubmitAnswerResponse = {
        success: true,
        isCorrect,
        answerTimeMs,
        explanation: question.explanation,
        correctAnswer,
        validationErrors:
          validationErrors.length > 0 ? validationErrors : undefined,
        sessionId,
        historyId: historyRecord.id,
        reviewUpdate,
      };

      const processTime = Date.now() - startProcessTime;
      console.log(
        `[AnswerService] 解答送信完了: ${request.questionId}, 正解=${isCorrect}, 処理時間=${processTime}ms`,
      );

      return response;
    } catch (error) {
      console.error(`[AnswerService] 解答送信エラー:`, error);
      throw error;
    }
  }

  /**
   * 解答バリデーション
   */
  private validateAnswer(
    answerData: CBTAnswerData,
    question: Question,
  ): string[] {
    const errors: string[] = [];

    try {
      const template = JSON.parse(question.answer_template_json);

      // 必須フィールドチェック
      template.fields?.forEach((field: any) => {
        if (field.required && !(answerData as any)[field.name]) {
          errors.push(`${field.label}は必須項目です`);
        }
      });

      // 数値フィールドチェック
      Object.entries(answerData).forEach(([key, value]) => {
        const field = template.fields?.find((f: any) => f.name === key);
        if (field?.type === "number" && value !== null && value !== undefined) {
          if (typeof value !== "number" || isNaN(value)) {
            errors.push(`${field.label}は有効な数値を入力してください`);
          } else if (value < 0) {
            errors.push(`${field.label}は0以上の値を入力してください`);
          }
        }
      });

      // 勘定科目重複チェック（仕訳問題）
      if (question.category_id === "journal") {
        const accounts = Object.entries(answerData)
          .filter(([key, value]) => key.includes("account") && value)
          .map(([key, value]) => value);

        const uniqueAccounts = new Set(accounts);
        if (accounts.length !== uniqueAccounts.size) {
          errors.push("同じ勘定科目を複数回選択することはできません");
        }
      }
    } catch (parseError) {
      console.error("[AnswerService] テンプレート解析エラー:", parseError);
      errors.push("問題データの解析に失敗しました");
    }

    return errors;
  }

  /**
   * 正解判定ロジック
   */
  private isAnswerCorrect(
    answerData: CBTAnswerData,
    question: Question,
  ): boolean {
    try {
      const correctAnswer = JSON.parse(
        question.correct_answer_json,
      ) as QuestionCorrectAnswer;

      switch (question.category_id) {
        case "journal":
          return this.isJournalAnswerCorrect(answerData, correctAnswer);
        case "ledger":
          return this.isLedgerAnswerCorrect(answerData, correctAnswer);
        case "trial_balance":
          return this.isTrialBalanceAnswerCorrect(answerData, correctAnswer);
        default:
          console.error(
            `[AnswerService] 未対応のカテゴリ: ${question.category_id}`,
          );
          return false;
      }
    } catch (error) {
      console.error("[AnswerService] 正解判定エラー:", error);
      return false;
    }
  }

  /**
   * 仕訳問題の正解判定
   */
  private isJournalAnswerCorrect(
    answerData: CBTAnswerData,
    correctAnswer: QuestionCorrectAnswer,
  ): boolean {
    const entry = correctAnswer.journalEntry;
    if (!entry) return false;

    // 借方・貸方の勘定科目と金額を厳密に比較
    const data = answerData as any;
    return (
      data.debit_account === entry.debit_account &&
      data.debit_amount === entry.debit_amount &&
      data.credit_account === entry.credit_account &&
      data.credit_amount === entry.credit_amount
    );
  }

  /**
   * 帳簿問題の正解判定
   */
  private isLedgerAnswerCorrect(
    answerData: CBTAnswerData,
    correctAnswer: QuestionCorrectAnswer,
  ): boolean {
    const entry = correctAnswer.ledgerEntry;
    if (!entry?.entries) return false;

    // 複数エントリの場合は部分一致も考慮
    const data = answerData as any;
    return entry.entries.every((correct, index) => {
      const answerKey = `entry_${index}`;
      const userEntry = data[answerKey];

      if (!userEntry) return false;

      return (
        (!correct.account || userEntry.account === correct.account) &&
        (!correct.amount || userEntry.amount === correct.amount) &&
        (!correct.description || userEntry.description === correct.description)
      );
    });
  }

  /**
   * 試算表問題の正解判定
   */
  private isTrialBalanceAnswerCorrect(
    answerData: CBTAnswerData,
    correctAnswer: QuestionCorrectAnswer,
  ): boolean {
    const balances = correctAnswer.trialBalance?.balances;
    if (!balances) return false;

    // 各勘定科目の残高を比較
    const data = answerData as any;
    return Object.entries(balances).every(([account, amount]) => {
      return data[account] === amount;
    });
  }

  /**
   * 複数解答バッチ送信（模試用）
   */
  public async submitBatchAnswers(
    answers: SubmitAnswerRequest[],
    examId?: string,
  ): Promise<SubmitAnswerResponse[]> {
    const startTime = Date.now();
    const results: SubmitAnswerResponse[] = [];

    try {
      console.log(`[AnswerService] バッチ解答送信開始: ${answers.length}件`);

      // 同一セッションIDを使用
      const sessionId = examId || uuidv4();

      for (const answer of answers) {
        const result = await this.submitAnswer({
          ...answer,
          sessionId,
        });
        results.push(result);
      }

      const processTime = Date.now() - startTime;
      console.log(
        `[AnswerService] バッチ解答送信完了: ${answers.length}件, 処理時間=${processTime}ms`,
      );

      return results;
    } catch (error) {
      console.error("[AnswerService] バッチ解答送信エラー:", error);
      throw error;
    }
  }

  /**
   * セッション統計取得
   */
  public async getSessionStatistics(sessionId: string): Promise<{
    totalQuestions: number;
    correctAnswers: number;
    accuracyRate: number;
    totalTime: number;
    averageTime: number;
  }> {
    try {
      const history =
        await learningHistoryRepository.findBySessionId(sessionId);

      const totalQuestions = history.length;
      const correctAnswers = history.filter((h) => h.is_correct).length;
      const accuracyRate =
        totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
      const totalTime = history.reduce((sum, h) => sum + h.answer_time_ms, 0);
      const averageTime = totalQuestions > 0 ? totalTime / totalQuestions : 0;

      return {
        totalQuestions,
        correctAnswers,
        accuracyRate,
        totalTime,
        averageTime,
      };
    } catch (error) {
      console.error("[AnswerService] セッション統計取得エラー:", error);
      throw error;
    }
  }
}

/**
 * 解答処理サービスのシングルトンインスタンス
 */
export const answerService = new AnswerService();
