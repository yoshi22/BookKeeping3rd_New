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
    incorrectCountWeight: 20,
    timeDecayWeight: 0.1,
    consecutiveCorrectPenalty: 15,
    categoryBonus: {
      journal: 5, // 仕訳は基本なので少し高め
      ledger: 3, // 帳簿は中程度
      trial_balance: 8, // 試算表は重要なので高め
    },
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
      console.log(
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
          console.log(
            `[ReviewService] 新規復習アイテム作成開始: ${questionId}`,
          );

          const category = await this.getQuestionCategory(questionId);
          console.log(`[ReviewService] 問題カテゴリ取得: ${category}`);

          const initialPriority = this.calculatePriority({
            incorrectCount: 1,
            consecutiveCorrectCount: 0,
            lastAnsweredAt: now,
            category,
          });
          console.log(`[ReviewService] 初期優先度計算: ${initialPriority}`);

          const createData = {
            questionId,
            incorrectCount: 1,
            consecutiveCorrectCount: 0,
            status: "needs_review" as ReviewStatus,
            priorityScore: initialPriority,
            lastAnsweredAt: now,
          };
          console.log(`[ReviewService] 復習アイテム作成データ:`, createData);

          const newItem = await reviewItemRepository.createOrUpdate(createData);
          console.log(`[ReviewService] 復習アイテム作成完了:`, newItem);

          // 作成後の確認
          const verification =
            await reviewItemRepository.findByQuestionId(questionId);
          console.log(`[ReviewService] 作成確認クエリ結果:`, verification);

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
          const { statisticsCache } = require('./statistics-cache');
          statisticsCache.clearAll();  
          console.log('[ReviewService] 復習アイテム変更により統計キャッシュをクリア');
        } catch (error) {
          console.warn('[ReviewService] 統計キャッシュクリアに失敗:', error);
        }
      }

      return result;
    } catch (error) {
      console.error("[ReviewService] updateReviewStatus エラー:", error);
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
      console.log("[ReviewService] 復習リスト生成開始:", options);

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
      console.log("[ReviewService] 復習アイテム取得フィルター:", filter);
      const reviewItems = await reviewItemRepository.getReviewList(filter);
      console.log(
        `[ReviewService] 復習アイテム取得結果: ${reviewItems.length}件`,
        reviewItems,
      );

      if (reviewItems.length === 0) {
        console.log("[ReviewService] 復習対象の問題がありません");
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

      console.log(`[ReviewService] 復習リスト生成完了: ${questions.length}件`);
      return questions;
    } catch (error) {
      console.error("[ReviewService] generateReviewList エラー:", error);
      throw error;
    }
  }

  /**
   * 復習統計取得
   */
  public async getReviewStatistics(): Promise<ReviewStatistics> {
    try {
      console.log("[ReviewService] 復習統計取得開始");
      const result = await reviewItemRepository.getReviewStatistics();
      console.log(
        "[ReviewService] 復習統計取得完了:",
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      console.error("[ReviewService] getReviewStatistics エラー:", error);
      console.error("[ReviewService] Error details:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
      });
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

      console.log(
        `[ReviewService] 復習セッション開始: ${sessionId}, ${questions.length}問`,
      );

      return {
        sessionId,
        questions,
        totalCount: questions.length,
      };
    } catch (error) {
      console.error("[ReviewService] startReviewSession エラー:", error);
      throw error;
    }
  }

  /**
   * 弱点分野分析
   */
  public async analyzeWeakAreas(): Promise<
    Array<{
      category: QuestionCategory;
      categoryName: string;
      reviewCount: number;
      averagePriority: number;
      lastReviewedAt?: string;
      recommendation: string;
    }>
  > {
    try {
      console.log("[ReviewService] 弱点分野分析開始");
      const stats = await this.getReviewStatistics();
      console.log("[ReviewService] 統計データに基づく分析:", stats);
      const analysis = [];

      const categoryNames = {
        journal: "仕訳",
        ledger: "帳簿",
        trial_balance: "試算表",
      };

      for (const [category, categoryStats] of Object.entries(
        stats.categoryBreakdown,
      )) {
        const categoryKey = category as QuestionCategory;

        // 復習対象の実際の件数（needs_review + priority_review のみ）
        const totalReview =
          categoryStats.needsReview + categoryStats.priorityReview;

        console.log(
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

      console.log(
        "[ReviewService] 弱点分野分析完了:",
        JSON.stringify(analysis, null, 2),
      );
      return analysis;
    } catch (error) {
      console.error("[ReviewService] analyzeWeakAreas エラー:", error);
      console.error("[ReviewService] Error details:", {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
      });
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
      console.log("[ReviewService] 復習アイテムクリーンアップ開始");

      // 克服済みアイテムの削除（7日間保持）
      const masteredItemsDeleted =
        await reviewItemRepository.cleanupMasteredItems(7);

      // 古い学習履歴の削除（1年間保持）
      const oldHistoryDeleted =
        await learningHistoryRepository.cleanupOldHistory(365);

      console.log(
        `[ReviewService] クリーンアップ完了: 克服済み${masteredItemsDeleted}件, 古い履歴${oldHistoryDeleted}件削除`,
      );

      return {
        masteredItemsDeleted,
        oldHistoryDeleted,
      };
    } catch (error) {
      console.error("[ReviewService] cleanupReviewItems エラー:", error);
      throw error;
    }
  }
}

/**
 * 復習管理サービスのシングルトンインスタンス
 */
export const reviewService = new ReviewService();
