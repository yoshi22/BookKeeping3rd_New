/**
 * 復習アイテムRepository
 * 簿記3級問題集アプリ - 復習管理システム
 * Step 2.3: 基本復習機能実装
 */

import { BaseRepository } from './base-repository';
import { ReviewItem, QuestionCategory } from '../../types/models';

/**
 * 復習優先度レベル
 */
export type ReviewPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * 復習ステータス
 */
export type ReviewStatus = 'needs_review' | 'priority_review' | 'mastered';

/**
 * 復習アイテム作成データ
 */
export interface CreateReviewItemData {
  questionId: string;
  incorrectCount?: number;
  consecutiveCorrectCount?: number;
  status?: ReviewStatus;
  priorityScore?: number;
  lastAnsweredAt?: string;
  lastReviewedAt?: string;
}

/**
 * 復習アイテム更新データ
 */
export interface UpdateReviewItemData {
  incorrectCount?: number;
  consecutiveCorrectCount?: number;
  status?: ReviewStatus;
  priorityScore?: number;
  lastAnsweredAt?: string;
  lastReviewedAt?: string;
}

/**
 * 復習フィルター
 */
export interface ReviewFilter {
  status?: ReviewStatus[];
  category?: QuestionCategory;
  minPriorityScore?: number;
  maxPriorityScore?: number;
  lastAnsweredBefore?: string;
  lastAnsweredAfter?: string;
  limit?: number;
}

/**
 * 復習統計
 */
export interface ReviewStatistics {
  totalReviewItems: number;
  needsReviewCount: number;
  priorityReviewCount: number;
  masteredCount: number;
  
  priorityDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  
  categoryBreakdown: {
    journal: ReviewCategoryStats;
    ledger: ReviewCategoryStats;
    trial_balance: ReviewCategoryStats;
  };
  
  lastUpdated: string;
}

interface ReviewCategoryStats {
  total: number;
  needsReview: number;
  priorityReview: number;
  mastered: number;
  averagePriority: number;
}

/**
 * 復習アイテムRepositoryクラス
 */
export class ReviewItemRepository extends BaseRepository<ReviewItem> {
  constructor() {
    super('review_items');
  }

  /**
   * 復習アイテム作成または更新
   */
  public async createOrUpdate(data: CreateReviewItemData): Promise<ReviewItem> {
    try {
      const existing = await this.findByQuestionId(data.questionId);
      
      if (existing) {
        // 既存レコードの更新
        const updateData: UpdateReviewItemData = {
          incorrectCount: data.incorrectCount ?? existing.incorrect_count,
          consecutiveCorrectCount: data.consecutiveCorrectCount ?? existing.consecutive_correct_count,
          status: data.status ?? existing.status as ReviewStatus,
          priorityScore: data.priorityScore ?? existing.priority_score,
          lastAnsweredAt: data.lastAnsweredAt ?? existing.last_answered_at,
          lastReviewedAt: data.lastReviewedAt ?? existing.last_reviewed_at
        };
        
        return await this.updateByQuestionId(data.questionId, updateData);
      } else {
        // 新規作成
        const reviewItemData = {
          question_id: data.questionId,
          incorrect_count: data.incorrectCount ?? 1,
          consecutive_correct_count: data.consecutiveCorrectCount ?? 0,
          status: data.status ?? 'needs_review',
          priority_score: data.priorityScore ?? this.calculateInitialPriority(data.incorrectCount ?? 1),
          last_answered_at: data.lastAnsweredAt ?? new Date().toISOString(),
          last_reviewed_at: data.lastReviewedAt,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        return await this.create(reviewItemData);
      }
    } catch (error) {
      console.error('[ReviewItemRepository] createOrUpdate エラー:', error);
      throw error;
    }
  }

  /**
   * 問題IDで復習アイテム取得
   */
  public async findByQuestionId(questionId: string): Promise<ReviewItem | null> {
    try {
      const result = await this.findOne({ question_id: questionId });
      return result;
    } catch (error) {
      console.error('[ReviewItemRepository] findByQuestionId エラー:', error);
      throw error;
    }
  }

  /**
   * 問題IDで復習アイテム更新
   */
  public async updateByQuestionId(
    questionId: string, 
    updateData: UpdateReviewItemData
  ): Promise<ReviewItem> {
    try {
      const updateFields: any = {
        updated_at: new Date().toISOString()
      };

      if (updateData.incorrectCount !== undefined) {
        updateFields.incorrect_count = updateData.incorrectCount;
      }
      if (updateData.consecutiveCorrectCount !== undefined) {
        updateFields.consecutive_correct_count = updateData.consecutiveCorrectCount;
      }
      if (updateData.status !== undefined) {
        updateFields.status = updateData.status;
      }
      if (updateData.priorityScore !== undefined) {
        updateFields.priority_score = updateData.priorityScore;
      }
      if (updateData.lastAnsweredAt !== undefined) {
        updateFields.last_answered_at = updateData.lastAnsweredAt;
      }
      if (updateData.lastReviewedAt !== undefined) {
        updateFields.last_reviewed_at = updateData.lastReviewedAt;
      }

      const result = await this.updateWhere({ question_id: questionId }, updateFields);
      
      if (result === 0) {
        throw new Error(`復習アイテムが見つかりません: ${questionId}`);
      }

      const updated = await this.findByQuestionId(questionId);
      if (!updated) {
        throw new Error(`更新後の復習アイテムが見つかりません: ${questionId}`);
      }

      console.log(`[ReviewItemRepository] 復習アイテム更新完了: ${questionId}`);
      return updated;
    } catch (error) {
      console.error('[ReviewItemRepository] updateByQuestionId エラー:', error);
      throw error;
    }
  }

  /**
   * 復習リスト取得（優先度順）
   */
  public async getReviewList(filter: ReviewFilter = {}): Promise<ReviewItem[]> {
    try {
      let sql = `
        SELECT ri.* FROM review_items ri
      `;
      const params: any[] = [];
      const whereConditions: string[] = [];

      // カテゴリフィルター
      if (filter.category) {
        sql += ' INNER JOIN questions q ON ri.question_id = q.id';
        whereConditions.push('q.category_id = ?');
        params.push(filter.category);
      }

      // ステータスフィルター
      if (filter.status && filter.status.length > 0) {
        const statusPlaceholders = filter.status.map(() => '?').join(',');
        whereConditions.push(`ri.status IN (${statusPlaceholders})`);
        params.push(...filter.status);
      }

      // 優先度スコアフィルター
      if (filter.minPriorityScore !== undefined) {
        whereConditions.push('ri.priority_score >= ?');
        params.push(filter.minPriorityScore);
      }
      if (filter.maxPriorityScore !== undefined) {
        whereConditions.push('ri.priority_score <= ?');
        params.push(filter.maxPriorityScore);
      }

      // 日付フィルター
      if (filter.lastAnsweredBefore) {
        whereConditions.push('ri.last_answered_at <= ?');
        params.push(filter.lastAnsweredBefore);
      }
      if (filter.lastAnsweredAfter) {
        whereConditions.push('ri.last_answered_at >= ?');
        params.push(filter.lastAnsweredAfter);
      }

      // WHERE句の構築
      if (whereConditions.length > 0) {
        sql += ` WHERE ${whereConditions.join(' AND ')}`;
      }

      // ソート（優先度スコア降順、最終解答日時昇順）
      sql += ' ORDER BY ri.priority_score DESC, ri.last_answered_at ASC';

      // LIMIT
      if (filter.limit) {
        sql += ' LIMIT ?';
        params.push(filter.limit);
      }

      const result = await this.executeQuery<ReviewItem>(sql, params);
      
      console.log(`[ReviewItemRepository] 復習リスト取得完了: ${result.rows.length}件`);
      return result.rows;
    } catch (error) {
      console.error('[ReviewItemRepository] getReviewList エラー:', error);
      throw error;
    }
  }

  /**
   * 復習統計取得
   */
  public async getReviewStatistics(): Promise<ReviewStatistics> {
    try {
      // 基本統計
      const basicStatsQuery = `
        SELECT 
          COUNT(*) as totalReviewItems,
          SUM(CASE WHEN status = 'needs_review' THEN 1 ELSE 0 END) as needsReviewCount,
          SUM(CASE WHEN status = 'priority_review' THEN 1 ELSE 0 END) as priorityReviewCount,
          SUM(CASE WHEN status = 'mastered' THEN 1 ELSE 0 END) as masteredCount
        FROM review_items
      `;

      const basicStatsResult = await this.executeQuery<any>(basicStatsQuery, []);
      const basicStats = basicStatsResult.rows[0] || {};

      // 優先度分布
      const priorityDistQuery = `
        SELECT 
          CASE 
            WHEN priority_score >= 80 THEN 'critical'
            WHEN priority_score >= 60 THEN 'high'
            WHEN priority_score >= 40 THEN 'medium'
            ELSE 'low'
          END as priority_level,
          COUNT(*) as count
        FROM review_items
        GROUP BY priority_level
      `;

      const priorityDistResult = await this.executeQuery<any>(priorityDistQuery, []);
      const priorityDistribution = {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      };

      priorityDistResult.rows.forEach(row => {
        priorityDistribution[row.priority_level as keyof typeof priorityDistribution] = row.count;
      });

      // カテゴリ別統計
      const categoryStatsQuery = `
        SELECT 
          q.category_id,
          COUNT(*) as total,
          SUM(CASE WHEN ri.status = 'needs_review' THEN 1 ELSE 0 END) as needsReview,
          SUM(CASE WHEN ri.status = 'priority_review' THEN 1 ELSE 0 END) as priorityReview,
          SUM(CASE WHEN ri.status = 'mastered' THEN 1 ELSE 0 END) as mastered,
          AVG(ri.priority_score) as averagePriority
        FROM review_items ri
        INNER JOIN questions q ON ri.question_id = q.id
        GROUP BY q.category_id
      `;

      const categoryStatsResult = await this.executeQuery<any>(categoryStatsQuery, []);
      const categoryBreakdown = {
        journal: { total: 0, needsReview: 0, priorityReview: 0, mastered: 0, averagePriority: 0 },
        ledger: { total: 0, needsReview: 0, priorityReview: 0, mastered: 0, averagePriority: 0 },
        trial_balance: { total: 0, needsReview: 0, priorityReview: 0, mastered: 0, averagePriority: 0 }
      };

      categoryStatsResult.rows.forEach(row => {
        const category = row.category_id as QuestionCategory;
        if (categoryBreakdown[category]) {
          categoryBreakdown[category] = {
            total: row.total || 0,
            needsReview: row.needsReview || 0,
            priorityReview: row.priorityReview || 0,
            mastered: row.mastered || 0,
            averagePriority: row.averagePriority || 0
          };
        }
      });

      const statistics: ReviewStatistics = {
        totalReviewItems: basicStats.totalReviewItems || 0,
        needsReviewCount: basicStats.needsReviewCount || 0,
        priorityReviewCount: basicStats.priorityReviewCount || 0,
        masteredCount: basicStats.masteredCount || 0,
        priorityDistribution,
        categoryBreakdown,
        lastUpdated: new Date().toISOString()
      };

      console.log('[ReviewItemRepository] 復習統計取得完了');
      return statistics;
    } catch (error) {
      console.error('[ReviewItemRepository] getReviewStatistics エラー:', error);
      throw error;
    }
  }

  /**
   * 優先度計算（初期値）
   */
  private calculateInitialPriority(incorrectCount: number): number {
    // 基本的な優先度計算アルゴリズム
    // incorrectCount: 1-2回 → 40-50点, 3-4回 → 60-70点, 5回以上 → 80-90点
    const baseScore = Math.min(incorrectCount * 15, 80);
    const randomOffset = Math.floor(Math.random() * 10); // ランダム要素
    return Math.min(baseScore + randomOffset, 100);
  }

  /**
   * 復習アイテム削除（克服済み問題）
   */
  public async deleteByQuestionId(questionId: string): Promise<number> {
    try {
      const result = await this.deleteWhere({ question_id: questionId });
      console.log(`[ReviewItemRepository] 復習アイテム削除完了: ${questionId}`);
      return result;
    } catch (error) {
      console.error('[ReviewItemRepository] deleteByQuestionId エラー:', error);
      throw error;
    }
  }

  /**
   * 克服済み問題のクリーンアップ
   */
  public async cleanupMasteredItems(retentionDays: number = 7): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      
      const sql = `
        DELETE FROM review_items 
        WHERE status = 'mastered' 
        AND updated_at < ?
      `;
      
      const result = await this.executeQuery(sql, [cutoffDate.toISOString()]);
      
      console.log(`[ReviewItemRepository] 克服済みアイテムクリーンアップ完了: ${result.rowsAffected}件削除`);
      return result.rowsAffected;
    } catch (error) {
      console.error('[ReviewItemRepository] cleanupMasteredItems エラー:', error);
      throw error;
    }
  }
}

/**
 * 復習アイテムRepositoryのシングルトンインスタンス
 */
export const reviewItemRepository = new ReviewItemRepository();