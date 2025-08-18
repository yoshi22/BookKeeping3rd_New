/**
 * 復習管理サービス
 * 簿記3級問題集アプリ - 復習システム統合管理
 * Step 2.3: 基本復習機能実装
 */

import {
  reviewItemRepository,
  ReviewFilter,
  ReviewStatistics,
  ReviewStatus,
} from "../data/repositories/review-item-repository";
import { learningHistoryRepository } from "../data/repositories/learning-history-repository";
import { questionRepository } from "../data/repositories/question-repository";
import { Question, QuestionCategory } from "../types/models";
import { logger } from "../utils/logger";

/**
 * 復習優先度アルゴリズム設定
 */
interface PriorityConfig {
  incorrectCountWeight: number; // 誤答回数の重み
  timeDecayWeight: number; // 時間経過による減衰
  consecutiveCorrectPenalty: number; // 連続正解による減点
  categoryBonus: Record<QuestionCategory, number>; // カテゴリ別ボーナス
  maxPriorityScore: number; // 最大優先度スコア
}

/**
 * 復習状況更新結果
 */
export interface ReviewUpdateResult {
  questionId: string;
  previousStatus: ReviewStatus;
  newStatus: ReviewStatus;
  previousPriority: number;
  newPriority: number;
  action: "created" | "updated" | "mastered" | "no_change";
  message: string;
}

/**
 * 復習セッション情報
 */
export interface ReviewSession {
  sessionId: string;
  category?: QuestionCategory;
  targetCount: number;
  completedCount: number;
  correctCount: number;
  averageTime: number;
  questionsReviewed: string[];
  startedAt: string;
  completedAt?: string;
}

/**
 * 復習リスト生成オプション
 */
export interface GenerateReviewListOptions {
  category?: QuestionCategory;
  priorityLevels?: ("critical" | "high" | "medium" | "low")[];
  maxCount?: number;
  excludeRecentlyReviewed?: boolean;
  recentlyReviewedHours?: number;
}

/**
 * 復習管理サービスクラス
 */
export class ReviewService {
  private readonly priorityConfig: PriorityConfig = {
    incorrectCountWeight: 25, // 20→25: 基本スコアを上げて重点復習対象に入りやすくする
    timeDecayWeight: 0.1,
    consecutiveCorrectPenalty: 15,
    categoryBonus: {
      journal: 10, // 仕訳は基本なので高めに調整
      ledger: 8, // 帳簿は中程度だが重要
      trial_balance: 15, // 試算表は重要なので高め
      financial_statement: 15, // 財務諸表は最重要
      voucher_entry: 8, // 伝票記入は中程度だが重要
      multiple_blank_choice: 12, // 複数空欄選択は高め
    } as Record<QuestionCategory, number>,
    maxPriorityScore: 100,
  };

  /**
   * 解答記録に基づく復習状況更新
   */
  public async updateReviewStatus(
    questionId: string,
    isCorrect: boolean,
    answerTime: number = 0,
  ): Promise<ReviewUpdateResult> {
    try {
      logger.debug(
        `[ReviewService] 復習状況更新開始: ${questionId}, 正解=${isCorrect}`,
      );

      const existing = await reviewItemRepository.findByQuestionId(questionId);
      const now = new Date().toISOString();

      let result: ReviewUpdateResult;

      if (isCorrect) {
        // 正解の場合
        if (existing) {
          const newConsecutiveCount = existing.consecutive_correct_count + 1;
          const isMastered = newConsecutiveCount >= 2; // 連続2回正解で克服

          if (isMastered) {
            // 克服済み → 復習リストから除外
            await reviewItemRepository.deleteByQuestionId(questionId);

            result = {
              questionId,
              previousStatus: existing.status as ReviewStatus,
              newStatus: "mastered",
              previousPriority: existing.priority_score,
              newPriority: 0,
              action: "mastered",
              message: `連続${newConsecutiveCount}回正解により克服完了`,
            };
          } else {
            // まだ克服していない → 優先度を下げて更新
            const newPriority = this.calculatePriority({
              incorrectCount: existing.incorrect_count,
              consecutiveCorrectCount: newConsecutiveCount,
              lastAnsweredAt: now,
              category: await this.getQuestionCategory(questionId),
            });

            const updatedItem = await reviewItemRepository.updateByQuestionId(
              questionId,
              {
                consecutiveCorrectCount: newConsecutiveCount,
                priorityScore: newPriority,
                lastAnsweredAt: now,
                lastReviewedAt: now,
              },
            );

            result = {
              questionId,
              previousStatus: existing.status as ReviewStatus,
              newStatus: updatedItem.status as ReviewStatus,
              previousPriority: existing.priority_score,
              newPriority: newPriority,
              action: "updated",
              message: `連続正解数: ${newConsecutiveCount}, 優先度更新`,
            };
          }
        } else {
          // 正解だが初回 → 復習対象にしない
          result = {
            questionId,
            previousStatus: "needs_review",
            newStatus: "needs_review",
            previousPriority: 0,
            newPriority: 0,
            action: "no_change",
            message: "初回正解のため復習対象外",
          };
        }
      } else {
        // 不正解の場合
        if (existing) {
          // 既存の復習アイテム更新
          const newIncorrectCount = existing.incorrect_count + 1;
          const newStatus: ReviewStatus =
            newIncorrectCount >= 2 ? "priority_review" : "needs_review";
          const newPriority = this.calculatePriority({
            incorrectCount: newIncorrectCount,
            consecutiveCorrectCount: 0, // 不正解により連続正解数リセット
            lastAnsweredAt: now,
            category: await this.getQuestionCategory(questionId),
          });

          const updatedItem = await reviewItemRepository.updateByQuestionId(
            questionId,
            {
              incorrectCount: newIncorrectCount,
              consecutiveCorrectCount: 0,
              status: newStatus,
              priorityScore: newPriority,
              lastAnsweredAt: now,
            },
          );

          result = {
            questionId,
            previousStatus: existing.status as ReviewStatus,
            newStatus: newStatus,
            previousPriority: existing.priority_score,
            newPriority: newPriority,
            action: "updated",
            message: `誤答回数: ${newIncorrectCount}, ステータス: ${newStatus}`,
          };
        } else {
          // 新規復習アイテム作成
          logger.debug(
            `[ReviewService] 新規復習アイテム作成開始: ${questionId}`,
          );

          const category = await this.getQuestionCategory(questionId);
          logger.debug("[ReviewService] 問題カテゴリ取得: ${category}");

          const initialPriority = this.calculatePriority({
            incorrectCount: 1,
            consecutiveCorrectCount: 0,
            lastAnsweredAt: now,
            category,
          });
          logger.debug("[ReviewService] 初期優先度計算: ${initialPriority}");

          const createData = {
            questionId,
            incorrectCount: 1,
            consecutiveCorrectCount: 0,
            status: "needs_review" as ReviewStatus,
            priorityScore: initialPriority,
            lastAnsweredAt: now,
          };
          logger.debug("[ReviewService] 復習アイテム作成データ:", {
            details: createData,
          });

          const newItem = await reviewItemRepository.createOrUpdate(createData);
          logger.debug("[ReviewService] 復習アイテム作成完了:", {
            details: newItem,
          });

          // 作成後の確認
          const verification =
            await reviewItemRepository.findByQuestionId(questionId);
          logger.debug("[ReviewService] 作成確認クエリ結果:", {
            details: verification,
          });

          result = {
            questionId,
            previousStatus: "needs_review",
            newStatus: "needs_review",
            previousPriority: 0,
            newPriority: initialPriority,
            action: "created",
            message: "新規復習アイテム作成",
          };
        }
      }

      // 復習アイテムが変更された場合は統計キャッシュをクリア
      if (result.action !== "no_change") {
        try {
          const { statisticsCache } = require("./statistics-cache");
          statisticsCache.clearAll();
          logger.debug(
            "[ReviewService] 復習アイテム変更により統計キャッシュをクリア",
          );
        } catch (error) {
          logger.warn("[ReviewService] 統計キャッシュクリアに失敗:", {
            details: error,
          });
        }
      }

      return result;
    } catch (error) {
      logger.error(
        "[ReviewService] updateReviewStatus エラー:",
        error as Error,
      );
      throw error;
    }
  }

  /**
   * 復習優先度計算
   */
  private calculatePriority(params: {
    incorrectCount: number;
    consecutiveCorrectCount: number;
    lastAnsweredAt: string;
    category: QuestionCategory;
  }): number {
    const {
      incorrectCount,
      consecutiveCorrectCount,
      lastAnsweredAt,
      category,
    } = params;
    const config = this.priorityConfig;

    // 基本スコア（誤答回数ベース）
    let score = incorrectCount * config.incorrectCountWeight;

    // 時間経過による減衰（古い間違いは優先度を下げる）
    const daysSinceLastAnswer = this.getDaysSince(lastAnsweredAt);
    const timeDecay = Math.min(
      daysSinceLastAnswer * config.timeDecayWeight,
      20,
    );
    score = Math.max(score - timeDecay, 10); // 最低10点は保持

    // 連続正解による減点
    const consecutivePenalty =
      consecutiveCorrectCount * config.consecutiveCorrectPenalty;
    score = Math.max(score - consecutivePenalty, 0);

    // カテゴリ別ボーナス
    score += config.categoryBonus[category] || 0;

    // 最終スコア調整
    return Math.min(Math.round(score), config.maxPriorityScore);
  }

  /**
   * 復習リスト生成
   */
  public async generateReviewList(
    options: GenerateReviewListOptions = {},
  ): Promise<Question[]> {
    try {
      logger.debug("[ReviewService] 復習リスト生成開始:", { details: options });

      const filter: ReviewFilter = {
        status: ["needs_review", "priority_review"], // 復習対象のみ
        category: options.category,
        limit: options.maxCount || 20,
      };

      // 優先度レベルフィルター
      if (options.priorityLevels && options.priorityLevels.length > 0) {
        const { min, max } = this.getPriorityRange(options.priorityLevels);
        filter.minPriorityScore = min;
        filter.maxPriorityScore = max;
      }

      // 最近復習したものを除外
      if (options.excludeRecentlyReviewed) {
        const hoursAgo = options.recentlyReviewedHours || 4; // デフォルト4時間
        const cutoff = new Date();
        cutoff.setHours(cutoff.getHours() - hoursAgo);
        filter.lastAnsweredBefore = cutoff.toISOString();
      }

      // 復習アイテム取得
      logger.debug("[ReviewService] 復習アイテム取得フィルター:", {
        details: filter,
      });
      const reviewItems = await reviewItemRepository.getReviewList(filter);
      logger.debug(
        `[ReviewService] 復習アイテム取得結果: ${reviewItems.length}件`,
        reviewItems,
      );

      if (reviewItems.length === 0) {
        logger.debug("[ReviewService] 復習対象の問題がありません");
        return [];
      }

      // 問題データ取得
      const questionIds = reviewItems.map((item) => item.question_id);
      const questions: Question[] = [];

      for (const questionId of questionIds) {
        const question = await questionRepository.findById(questionId);
        if (question) {
          questions.push(question);
        }
      }

      logger.debug("[ReviewService] 復習リスト生成完了: ${questions.length}件");
      return questions;
    } catch (error) {
      logger.error(
        "[ReviewService] generateReviewList エラー:",
        error as Error,
      );
      throw error;
    }
  }

  /**
   * 復習統計取得
   */
  public async getReviewStatistics(): Promise<ReviewStatistics> {
    try {
      logger.debug("[ReviewService] 復習統計取得開始");
      const result = await reviewItemRepository.getReviewStatistics();
      logger.debug("[ReviewService] 復習統計取得完了:", {
        component: "ReviewService",
        operation: "getReviewStatistics",
        data: result,
      });
      return result;
    } catch (error) {
      logger.error(
        "[ReviewService] getReviewStatistics エラー:",
        error as Error,
      );
      logger.error("[ReviewService] Error details:");
      throw error;
    }
  }

  /**
   * 復習セッション開始
   */
  public async startReviewSession(
    options: GenerateReviewListOptions = {},
  ): Promise<{
    sessionId: string;
    questions: Question[];
    totalCount: number;
  }> {
    try {
      const sessionId = `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const questions = await this.generateReviewList(options);

      logger.debug(
        `[ReviewService] 復習セッション開始: ${sessionId}, ${questions.length}問`,
      );

      return {
        sessionId,
        questions,
        totalCount: questions.length,
      };
    } catch (error) {
      logger.error(
        "[ReviewService] startReviewSession エラー:",
        error as Error,
      );
      throw error;
    }
  }

  /**
   * 弱点分野分析
   */
  public async analyzeWeakAreas(): Promise<
    {
      category: QuestionCategory;
      categoryName: string;
      reviewCount: number;
      averagePriority: number;
      lastReviewedAt?: string;
      recommendation: string;
    }[]
  > {
    try {
      logger.debug("[ReviewService] 弱点分野分析開始");
      const stats = await this.getReviewStatistics();
      logger.debug("[ReviewService] 統計データに基づく分析:");
      const analysis = [];

      const categoryNames: Record<QuestionCategory, string> = {
        journal: "仕訳",
        ledger: "帳簿",
        trial_balance: "試算表",
        financial_statement: "財務諸表",
        voucher_entry: "伝票記入",
        multiple_blank_choice: "複数空欄選択",
      };

      for (const [category, categoryStats] of Object.entries(
        stats.categoryBreakdown,
      )) {
        const categoryKey = category as QuestionCategory;

        // 復習対象の実際の件数（needs_review + priority_review のみ）
        const totalReview =
          categoryStats.needsReview + categoryStats.priorityReview;

        logger.debug(
          `[ReviewService] ${categoryKey}の復習対象件数: ${totalReview}`,
        );

        let recommendation = "";
        if (totalReview === 0) {
          recommendation = "復習対象なし - 良好な状態です";
        } else if (categoryStats.averagePriority >= 70) {
          recommendation = "重点的な復習が必要です";
        } else if (categoryStats.averagePriority >= 50) {
          recommendation = "定期的な復習を継続してください";
        } else {
          recommendation = "軽い復習で十分です";
        }

        analysis.push({
          category: categoryKey,
          categoryName: categoryNames[categoryKey],
          reviewCount: totalReview, // 統計と一致する件数を使用
          averagePriority: Math.round(categoryStats.averagePriority),
          recommendation,
        });
      }

      // 復習が必要な順でソート
      analysis.sort((a, b) => b.averagePriority - a.averagePriority);

      logger.debug("[ReviewService] 弱点分野分析完了:", {
        component: "ReviewService",
        operation: "analyzeWeakAreas",
        data: analysis,
      });
      return analysis;
    } catch (error) {
      logger.error("[ReviewService] analyzeWeakAreas エラー:", error as Error);
      logger.error("[ReviewService] Error details:");
      throw error;
    }
  }

  /**
   * 問題のカテゴリ取得
   */
  private async getQuestionCategory(
    questionId: string,
  ): Promise<QuestionCategory> {
    const question = await questionRepository.findById(questionId);
    return (question?.category_id as QuestionCategory) || "journal";
  }

  /**
   * 日数計算
   */
  private getDaysSince(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * 優先度レベルから範囲を取得
   */
  private getPriorityRange(
    levels: ("critical" | "high" | "medium" | "low")[],
  ): { min: number; max: number } {
    const ranges = {
      critical: { min: 80, max: 100 },
      high: { min: 60, max: 79 },
      medium: { min: 40, max: 59 },
      low: { min: 0, max: 39 },
    };

    let min = 100;
    let max = 0;

    levels.forEach((level) => {
      const range = ranges[level];
      min = Math.min(min, range.min);
      max = Math.max(max, range.max);
    });

    return { min, max };
  }

  /**
   * 復習アイテムクリーンアップ
   */
  public async cleanupReviewItems(): Promise<{
    masteredItemsDeleted: number;
    oldHistoryDeleted: number;
  }> {
    try {
      logger.debug("[ReviewService] 復習アイテムクリーンアップ開始");

      // 克服済みアイテムの削除（7日間保持）
      const masteredItemsDeleted =
        await reviewItemRepository.cleanupMasteredItems(7);

      // 古い学習履歴の削除（1年間保持）
      const oldHistoryDeleted =
        await learningHistoryRepository.cleanupOldHistory(365);

      logger.info(
        `[ReviewService] クリーンアップ完了: 克服済み${masteredItemsDeleted}件, 古い履歴${oldHistoryDeleted}件削除`,
      );

      return {
        masteredItemsDeleted,
        oldHistoryDeleted,
      };
    } catch (error) {
      logger.error(
        "[ReviewService] cleanupReviewItems エラー:",
        error as Error,
      );
      throw error;
    }
  }
}

/**
 * 復習管理サービスのシングルトンインスタンス
 */
export const reviewService = new ReviewService();
