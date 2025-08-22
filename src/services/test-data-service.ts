/**
 * テストデータ生成サービス
 * 簿記3級問題集アプリ - 開発用テストデータ生成
 */

import { databaseService } from "../data/database";
import { logger } from "../utils/logger";
import { QuestionCategory } from "../types/models";

/**
 * テストデータ生成結果
 */
export interface TestDataCreationResult {
  success: boolean;
  message: string;
  statistics: {
    questionsUsed: number;
    learningHistoryCreated: number;
    reviewItemsCreated: number;
    priorityDistribution: Record<string, number>;
  };
  output: string;
}

/**
 * 優先度レベル
 */
type PriorityLevel = "critical" | "high" | "medium" | "low";

/**
 * テストデータ生成サービス
 */
export class TestDataService {
  private readonly categoryBonus: Record<QuestionCategory, number> = {
    journal: 10,
    ledger: 5,
    trial_balance: 15,
    financial_statement: 15,
    voucher_entry: 8,
    multiple_blank_choice: 12,
  };

  /**
   * 復習システム用テストデータを作成
   */
  public async createTestData(): Promise<TestDataCreationResult> {
    try {
      let output = "=== 復習システム テストデータ作成開始 ===\n";

      // 1. 現在のデータ状況確認
      const currentStats = await this.getCurrentDataStats();
      output += "\n1. 現在のデータ状況確認:\n";
      output += `問題データ: ${currentStats.questions}件\n`;
      output += `学習履歴: ${currentStats.learningHistory}件\n`;
      output += `復習アイテム: ${currentStats.reviewItems}件\n`;

      // 2. テスト用問題の取得
      const testQuestions = await this.getTestQuestions();
      if (testQuestions.length === 0) {
        throw new Error("テスト用問題が見つかりません。");
      }

      output += `\n2. テスト用問題: ${testQuestions.length}件取得\n`;
      testQuestions.forEach((q) => {
        output += `  - ${q.id} (${q.category_id})\n`;
      });

      // 3. 学習履歴の作成（不正解データ）
      const historyCount =
        await this.createIncorrectLearningHistory(testQuestions);
      output += "\n3. 不正解学習履歴の作成:\n";
      output += `不正解学習履歴 ${historyCount}件を作成完了\n`;

      // 4. 復習アイテムの作成
      const reviewCount = await this.createReviewItems(testQuestions);
      output += "\n4. 復習アイテムの作成:\n";
      output += `復習アイテム ${reviewCount}件を作成完了\n`;

      // 5. 作成結果の確認
      const finalStats = await this.getFinalStats();
      const priorityDistribution = await this.getPriorityDistribution();

      output += "\n5. テストデータ作成結果:\n";
      output += `不正解学習履歴: ${finalStats.incorrectHistory}件\n`;
      output += `復習アイテム: ${finalStats.reviewItems}件\n`;
      output += "\n優先度別分布:\n";

      Object.entries(priorityDistribution).forEach(([level, count]) => {
        output += `  ${level}: ${count}件\n`;
      });

      output += "\n=== テストデータ作成完了 ===\n";

      return {
        success: true,
        message: "テストデータの作成に成功しました",
        statistics: {
          questionsUsed: testQuestions.length,
          learningHistoryCreated: historyCount,
          reviewItemsCreated: reviewCount,
          priorityDistribution,
        },
        output,
      };
    } catch (error) {
      logger.error("[TestDataService] テストデータ作成エラー:", error as Error);
      return {
        success: false,
        message: `テストデータ作成失敗: ${error instanceof Error ? error.message : error}`,
        statistics: {
          questionsUsed: 0,
          learningHistoryCreated: 0,
          reviewItemsCreated: 0,
          priorityDistribution: {},
        },
        output: `エラー: ${error instanceof Error ? error.message : error}`,
      };
    }
  }

  /**
   * 現在のデータ統計を取得
   */
  private async getCurrentDataStats() {
    const [questions, learningHistory, reviewItems] = await Promise.all([
      databaseService.executeSql("SELECT COUNT(*) as count FROM questions"),
      databaseService.executeSql(
        "SELECT COUNT(*) as count FROM learning_history",
      ),
      databaseService.executeSql("SELECT COUNT(*) as count FROM review_items"),
    ]);

    return {
      questions: questions.rows[0].count,
      learningHistory: learningHistory.rows[0].count,
      reviewItems: reviewItems.rows[0].count,
    };
  }

  /**
   * テスト用問題を取得
   */
  private async getTestQuestions() {
    const result = await databaseService.executeSql(`
      SELECT id, category_id 
      FROM questions 
      WHERE category_id IN ('journal', 'ledger', 'trial_balance') 
      ORDER BY id 
      LIMIT 10
    `);
    return result.rows;
  }

  /**
   * 不正解学習履歴を作成
   */
  private async createIncorrectLearningHistory(
    testQuestions: any[],
  ): Promise<number> {
    let historyCount = 0;

    for (let i = 0; i < testQuestions.length; i++) {
      const question = testQuestions[i];
      const incorrectCount = Math.floor(Math.random() * 3) + 1; // 1-3回の間違い

      for (let j = 0; j < incorrectCount; j++) {
        const sessionId = `test-session-${Date.now()}-${i}-${j}`;
        const answeredAt = new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
        ).toISOString();

        await databaseService.executeSql(
          `INSERT INTO learning_history (
            question_id, user_answer_json, is_correct, answer_time_ms,
            session_id, session_type, answered_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            question.id,
            JSON.stringify({ type: "test_incorrect_answer" }),
            0, // 不正解
            Math.floor(Math.random() * 120000) + 30000, // 30秒-2.5分
            sessionId,
            "learning",
            answeredAt,
          ],
        );
        historyCount++;
      }
    }

    return historyCount;
  }

  /**
   * 復習アイテムを作成
   */
  private async createReviewItems(testQuestions: any[]): Promise<number> {
    let reviewCount = 0;

    for (const question of testQuestions) {
      // 問題の不正解回数を取得
      const incorrectHistoryResult = await databaseService.executeSql(
        `SELECT COUNT(*) as count FROM learning_history 
         WHERE question_id = ? AND is_correct = 0`,
        [question.id],
      );

      const incorrectCount = incorrectHistoryResult.rows[0].count;
      if (incorrectCount === 0) continue;

      // 優先度スコアを計算
      const priorityScore = this.calculatePriorityScore(
        incorrectCount,
        question.category_id as QuestionCategory,
      );

      // ステータス決定
      const status = this.determineReviewStatus(priorityScore);

      // 最後の間違い日時を取得
      const lastAnsweredAt = await this.getLastIncorrectAnswerTime(question.id);

      // 復習アイテムを作成
      await databaseService.executeSql(
        `INSERT OR REPLACE INTO review_items (
          question_id, incorrect_count, consecutive_correct_count, 
          status, priority_score, last_answered_at, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          question.id,
          incorrectCount,
          0, // 連続正解なし
          status,
          Math.min(priorityScore, 100), // 上限100
          lastAnsweredAt,
          new Date().toISOString(),
          new Date().toISOString(),
        ],
      );

      reviewCount++;
    }

    return reviewCount;
  }

  /**
   * 優先度スコアを計算
   */
  private calculatePriorityScore(
    incorrectCount: number,
    category: QuestionCategory,
  ): number {
    let priorityScore = incorrectCount * 25; // 基本スコア
    priorityScore += this.categoryBonus[category] || 0; // カテゴリボーナス
    return Math.min(priorityScore, 100); // 上限100
  }

  /**
   * 復習ステータスを決定
   */
  private determineReviewStatus(priorityScore: number): string {
    if (priorityScore >= 60) {
      return "priority_review";
    }
    return "needs_review";
  }

  /**
   * 最後の不正解回答時刻を取得
   */
  private async getLastIncorrectAnswerTime(
    questionId: string,
  ): Promise<string> {
    const result = await databaseService.executeSql(
      `SELECT answered_at FROM learning_history 
       WHERE question_id = ? AND is_correct = 0 
       ORDER BY answered_at DESC LIMIT 1`,
      [questionId],
    );

    return result.rows.length > 0
      ? result.rows[0].answered_at
      : new Date().toISOString();
  }

  /**
   * 最終統計を取得
   */
  private async getFinalStats() {
    const [incorrectHistory, reviewItems] = await Promise.all([
      databaseService.executeSql(
        "SELECT COUNT(*) as count FROM learning_history WHERE is_correct = 0",
      ),
      databaseService.executeSql("SELECT COUNT(*) as count FROM review_items"),
    ]);

    return {
      incorrectHistory: incorrectHistory.rows[0].count,
      reviewItems: reviewItems.rows[0].count,
    };
  }

  /**
   * 優先度別分布を取得
   */
  private async getPriorityDistribution(): Promise<
    Record<PriorityLevel, number>
  > {
    const result = await databaseService.executeSql(`
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
    `);

    const distribution: Record<PriorityLevel, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    result.rows.forEach((row) => {
      distribution[row.priority_level as PriorityLevel] = row.count;
    });

    return distribution;
  }
}

/**
 * テストデータサービスのシングルトンインスタンス
 */
export const testDataService = new TestDataService();
