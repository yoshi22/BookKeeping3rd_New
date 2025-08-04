/**
 * 学習履歴Repository
 * 簿記3級問題集アプリ - CBT形式学習データ管理
 */

import { BaseRepository } from "./base-repository";
import {
  LearningHistory,
  QuestionCategory,
  SessionType,
} from "../../types/models";
import { CBTAnswerData } from "../../types/database";

/**
 * 学習履歴フィルター
 */
export interface LearningHistoryFilter {
  questionId?: string;
  category?: QuestionCategory;
  sessionType?: SessionType;
  isCorrect?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sessionId?: string;
}

/**
 * 学習統計データ
 */
export interface LearningStatistics {
  totalAnswers: number;
  correctAnswers: number;
  accuracyRate: number;
  averageAnswerTime: number; // ミリ秒
  totalStudyTime: number; // ミリ秒
  sessionCount: number;
  lastAnsweredAt?: string;

  // カテゴリ別統計
  categoryStats: {
    journal: CategoryStats;
    ledger: CategoryStats;
    trial_balance: CategoryStats;
  };

  // セッション種別統計
  sessionTypeStats: {
    learning: SessionStats;
    review: SessionStats;
    mock_exam: SessionStats;
  };

  // 日別統計
  dailyStats: Array<{
    date: string;
    questionsAnswered: number;
    correctAnswers: number;
    accuracyRate: number;
    studyTime: number;
  }>;
}

interface CategoryStats {
  totalAnswers: number;
  correctAnswers: number;
  accuracyRate: number;
  averageAnswerTime: number;
}

interface SessionStats {
  totalAnswers: number;
  correctAnswers: number;
  accuracyRate: number;
  sessionCount: number;
}

/**
 * CBT解答記録データ
 */
export interface CBTAnswerRecord {
  questionId: string;
  answerData: CBTAnswerData;
  isCorrect: boolean;
  answerTimeMs: number;
  sessionId?: string;
  sessionType: SessionType;
  validationErrors?: string[];
}

/**
 * 学習履歴Repositoryクラス
 */
export class LearningHistoryRepository extends BaseRepository<LearningHistory> {
  constructor() {
    super("learning_history");
  }

  /**
   * CBT解答記録
   */
  public async recordAnswer(record: CBTAnswerRecord): Promise<LearningHistory> {
    try {
      const historyData = {
        question_id: record.questionId,
        user_answer_json: JSON.stringify(record.answerData),
        is_correct: record.isCorrect,
        answer_time_ms: record.answerTimeMs,
        session_id: record.sessionId,
        session_type: record.sessionType,
        validation_errors_json: record.validationErrors
          ? JSON.stringify(record.validationErrors)
          : undefined,
        answered_at: new Date().toISOString(),
      };

      const result = await this.create(historyData);

      console.log(
        `[LearningHistoryRepository] CBT解答記録完了: ${record.questionId}`,
      );
      return result;
    } catch (error) {
      console.error(`[LearningHistoryRepository] recordAnswer エラー:`, error);
      throw error;
    }
  }

  /**
   * 問題別学習履歴取得
   */
  public async findByQuestionId(
    questionId: string,
    limit?: number,
  ): Promise<LearningHistory[]> {
    try {
      let sql =
        "SELECT * FROM learning_history WHERE question_id = ? ORDER BY answered_at DESC";
      const params = [questionId];

      if (limit) {
        sql += " LIMIT ?";
        params.push(limit.toString());
      }

      const result = await this.executeQuery<LearningHistory>(sql, params);
      return result.rows;
    } catch (error) {
      console.error(
        `[LearningHistoryRepository] findByQuestionId エラー:`,
        error,
      );
      throw error;
    }
  }

  /**
   * セッション別学習履歴取得
   */
  public async findBySessionId(sessionId: string): Promise<LearningHistory[]> {
    try {
      const sql =
        "SELECT * FROM learning_history WHERE session_id = ? ORDER BY answered_at ASC";
      const result = await this.executeQuery<LearningHistory>(sql, [sessionId]);
      return result.rows;
    } catch (error) {
      console.error(
        `[LearningHistoryRepository] findBySessionId エラー:`,
        error,
      );
      throw error;
    }
  }

  /**
   * カテゴリ別学習履歴取得
   */
  public async findByCategory(
    category: QuestionCategory,
    options: {
      sessionType?: SessionType;
      isCorrect?: boolean;
      limit?: number;
      dateFrom?: string;
      dateTo?: string;
    } = {},
  ): Promise<LearningHistory[]> {
    try {
      let sql = `
        SELECT lh.* FROM learning_history lh
        INNER JOIN questions q ON lh.question_id = q.id
        WHERE q.category_id = ?
      `;
      const params: any[] = [category];

      if (options.sessionType) {
        sql += " AND lh.session_type = ?";
        params.push(options.sessionType);
      }

      if (options.isCorrect !== undefined) {
        sql += " AND lh.is_correct = ?";
        params.push(options.isCorrect);
      }

      if (options.dateFrom) {
        sql += " AND lh.answered_at >= ?";
        params.push(options.dateFrom);
      }

      if (options.dateTo) {
        sql += " AND lh.answered_at <= ?";
        params.push(options.dateTo);
      }

      sql += " ORDER BY lh.answered_at DESC";

      if (options.limit) {
        sql += " LIMIT ?";
        params.push(options.limit);
      }

      const result = await this.executeQuery<LearningHistory>(sql, params);
      return result.rows;
    } catch (error) {
      console.error(
        `[LearningHistoryRepository] findByCategory エラー:`,
        error,
      );
      throw error;
    }
  }

  /**
   * 学習統計情報取得
   */
  public async getStatistics(
    options: {
      dateFrom?: string;
      dateTo?: string;
      category?: QuestionCategory;
    } = {},
  ): Promise<LearningStatistics> {
    try {
      let whereClause = "";
      const params: any[] = [];

      // 日付範囲フィルター
      if (options.dateFrom || options.dateTo) {
        const conditions: string[] = [];
        if (options.dateFrom) {
          conditions.push("lh.answered_at >= ?");
          params.push(options.dateFrom);
        }
        if (options.dateTo) {
          conditions.push("lh.answered_at <= ?");
          params.push(options.dateTo);
        }
        whereClause = `WHERE ${conditions.join(" AND ")}`;
      }

      // カテゴリフィルター
      if (options.category) {
        const categoryCondition = "q.category_id = ?";
        if (whereClause) {
          whereClause += ` AND ${categoryCondition}`;
        } else {
          whereClause = `WHERE ${categoryCondition}`;
        }
        params.push(options.category);
      }

      // 基本統計
      const basicStatsQuery = `
        SELECT 
          COUNT(*) as totalAnswers,
          SUM(CASE WHEN lh.is_correct = 1 THEN 1 ELSE 0 END) as correctAnswers,
          AVG(CASE WHEN lh.is_correct = 1 THEN 1.0 ELSE 0.0 END) as accuracyRate,
          AVG(lh.answer_time_ms) as averageAnswerTime,
          SUM(lh.answer_time_ms) as totalStudyTime,
          COUNT(DISTINCT lh.session_id) as sessionCount,
          MAX(lh.answered_at) as lastAnsweredAt
        FROM learning_history lh
        LEFT JOIN questions q ON lh.question_id = q.id
        ${whereClause}
      `;

      const basicStatsResult = await this.executeQuery<any>(
        basicStatsQuery,
        params,
      );
      const basicStats = basicStatsResult.rows[0] || {};

      // カテゴリ別統計
      const categoryStatsQuery = `
        SELECT 
          q.category_id,
          COUNT(*) as totalAnswers,
          SUM(CASE WHEN lh.is_correct = 1 THEN 1 ELSE 0 END) as correctAnswers,
          AVG(CASE WHEN lh.is_correct = 1 THEN 1.0 ELSE 0.0 END) as accuracyRate,
          AVG(lh.answer_time_ms) as averageAnswerTime
        FROM learning_history lh
        INNER JOIN questions q ON lh.question_id = q.id
        ${whereClause}
        GROUP BY q.category_id
      `;

      const categoryStatsResult = await this.executeQuery<any>(
        categoryStatsQuery,
        params,
      );
      const categoryStats = {
        journal: {
          totalAnswers: 0,
          correctAnswers: 0,
          accuracyRate: 0,
          averageAnswerTime: 0,
        },
        ledger: {
          totalAnswers: 0,
          correctAnswers: 0,
          accuracyRate: 0,
          averageAnswerTime: 0,
        },
        trial_balance: {
          totalAnswers: 0,
          correctAnswers: 0,
          accuracyRate: 0,
          averageAnswerTime: 0,
        },
      };

      categoryStatsResult.rows.forEach((row) => {
        categoryStats[row.category_id as QuestionCategory] = {
          totalAnswers: row.totalAnswers || 0,
          correctAnswers: row.correctAnswers || 0,
          accuracyRate: row.accuracyRate || 0,
          averageAnswerTime: row.averageAnswerTime || 0,
        };
      });

      // セッション種別統計
      const sessionStatsQuery = `
        SELECT 
          lh.session_type,
          COUNT(*) as totalAnswers,
          SUM(CASE WHEN lh.is_correct = 1 THEN 1 ELSE 0 END) as correctAnswers,
          AVG(CASE WHEN lh.is_correct = 1 THEN 1.0 ELSE 0.0 END) as accuracyRate,
          COUNT(DISTINCT lh.session_id) as sessionCount
        FROM learning_history lh
        LEFT JOIN questions q ON lh.question_id = q.id
        ${whereClause}
        GROUP BY lh.session_type
      `;

      const sessionStatsResult = await this.executeQuery<any>(
        sessionStatsQuery,
        params,
      );
      const sessionTypeStats = {
        learning: {
          totalAnswers: 0,
          correctAnswers: 0,
          accuracyRate: 0,
          sessionCount: 0,
        },
        review: {
          totalAnswers: 0,
          correctAnswers: 0,
          accuracyRate: 0,
          sessionCount: 0,
        },
        mock_exam: {
          totalAnswers: 0,
          correctAnswers: 0,
          accuracyRate: 0,
          sessionCount: 0,
        },
      };

      sessionStatsResult.rows.forEach((row) => {
        if (
          row.session_type &&
          sessionTypeStats[row.session_type as SessionType]
        ) {
          sessionTypeStats[row.session_type as SessionType] = {
            totalAnswers: row.totalAnswers || 0,
            correctAnswers: row.correctAnswers || 0,
            accuracyRate: row.accuracyRate || 0,
            sessionCount: row.sessionCount || 0,
          };
        }
      });

      // 日別統計
      const dailyStatsQuery = `
        SELECT 
          DATE(lh.answered_at) as date,
          COUNT(*) as questionsAnswered,
          SUM(CASE WHEN lh.is_correct = 1 THEN 1 ELSE 0 END) as correctAnswers,
          AVG(CASE WHEN lh.is_correct = 1 THEN 1.0 ELSE 0.0 END) as accuracyRate,
          SUM(lh.answer_time_ms) as studyTime
        FROM learning_history lh
        LEFT JOIN questions q ON lh.question_id = q.id
        ${whereClause}
        GROUP BY DATE(lh.answered_at)
        ORDER BY date DESC
        LIMIT 30
      `;

      const dailyStatsResult = await this.executeQuery<any>(
        dailyStatsQuery,
        params,
      );
      const dailyStats = dailyStatsResult.rows.map((row) => ({
        date: row.date,
        questionsAnswered: row.questionsAnswered || 0,
        correctAnswers: row.correctAnswers || 0,
        accuracyRate: row.accuracyRate || 0,
        studyTime: row.studyTime || 0,
      }));

      const statistics: LearningStatistics = {
        totalAnswers: basicStats.totalAnswers || 0,
        correctAnswers: basicStats.correctAnswers || 0,
        accuracyRate: basicStats.accuracyRate || 0,
        averageAnswerTime: basicStats.averageAnswerTime || 0,
        totalStudyTime: basicStats.totalStudyTime || 0,
        sessionCount: basicStats.sessionCount || 0,
        lastAnsweredAt: basicStats.lastAnsweredAt,
        categoryStats,
        sessionTypeStats,
        dailyStats,
      };

      console.log("[LearningHistoryRepository] 学習統計情報取得完了");
      return statistics;
    } catch (error) {
      console.error("[LearningHistoryRepository] getStatistics エラー:", error);
      throw error;
    }
  }

  /**
   * 間違い問題抽出
   */
  public async findIncorrectQuestions(
    options: {
      category?: QuestionCategory;
      minIncorrectCount?: number;
      limit?: number;
    } = {},
  ): Promise<
    Array<{
      questionId: string;
      incorrectCount: number;
      lastIncorrectAt: string;
      totalAttempts: number;
    }>
  > {
    try {
      let sql = `
        SELECT 
          lh.question_id,
          SUM(CASE WHEN lh.is_correct = 0 THEN 1 ELSE 0 END) as incorrectCount,
          MAX(CASE WHEN lh.is_correct = 0 THEN lh.answered_at END) as lastIncorrectAt,
          COUNT(*) as totalAttempts
        FROM learning_history lh
      `;
      const params: any[] = [];

      if (options.category) {
        sql +=
          " INNER JOIN questions q ON lh.question_id = q.id WHERE q.category_id = ?";
        params.push(options.category);
      }

      sql += " GROUP BY lh.question_id HAVING incorrectCount > 0";

      if (options.minIncorrectCount) {
        sql += " AND incorrectCount >= ?";
        params.push(options.minIncorrectCount);
      }

      sql += " ORDER BY incorrectCount DESC, lastIncorrectAt DESC";

      if (options.limit) {
        sql += " LIMIT ?";
        params.push(options.limit);
      }

      const result = await this.executeQuery<any>(sql, params);
      return result.rows.map((row) => ({
        questionId: row.question_id,
        incorrectCount: row.incorrectCount,
        lastIncorrectAt: row.lastIncorrectAt,
        totalAttempts: row.totalAttempts,
      }));
    } catch (error) {
      console.error(
        "[LearningHistoryRepository] findIncorrectQuestions エラー:",
        error,
      );
      throw error;
    }
  }

  /**
   * 学習セッション削除
   */
  public async deleteSession(sessionId: string): Promise<number> {
    try {
      const result = await this.deleteWhere({ session_id: sessionId });
      console.log(
        `[LearningHistoryRepository] セッション削除完了: ${sessionId}, ${result}件`,
      );
      return result;
    } catch (error) {
      console.error(`[LearningHistoryRepository] deleteSession エラー:`, error);
      throw error;
    }
  }

  /**
   * 古い履歴のクリーンアップ
   */
  public async cleanupOldHistory(retentionDays: number = 365): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const sql = "DELETE FROM learning_history WHERE answered_at < ?";
      const result = await this.executeQuery(sql, [cutoffDate.toISOString()]);

      console.log(
        `[LearningHistoryRepository] 古い履歴クリーンアップ完了: ${result.rowsAffected}件削除`,
      );
      return result.rowsAffected;
    } catch (error) {
      console.error(
        "[LearningHistoryRepository] cleanupOldHistory エラー:",
        error,
      );
      throw error;
    }
  }

  /**
   * 学習履歴の正解フラグを更新（模試採点後に使用）
   */
  public async updateCorrectStatus(
    questionId: string,
    sessionId: string,
    isCorrect: boolean,
  ): Promise<void> {
    try {
      const sql = `
        UPDATE learning_history 
        SET is_correct = ? 
        WHERE question_id = ? AND session_id = ?
      `;

      const result = await this.executeQuery(sql, [
        isCorrect ? 1 : 0,
        questionId,
        sessionId,
      ]);

      if (result.rowsAffected === 0) {
        console.warn(
          `[LearningHistoryRepository] updateCorrectStatus: 対象レコードが見つかりません - questionId: ${questionId}, sessionId: ${sessionId}`,
        );
      } else {
        console.log(
          `[LearningHistoryRepository] 正解フラグ更新完了: ${questionId} -> ${isCorrect}`,
        );
      }
    } catch (error) {
      console.error(
        `[LearningHistoryRepository] updateCorrectStatus エラー:`,
        error,
      );
      throw error;
    }
  }
}

/**
 * 学習履歴Repositoryのシングルトンインスタンス
 */
export const learningHistoryRepository = new LearningHistoryRepository();
