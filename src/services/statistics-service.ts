/**
 * 学習統計サービス
 * 簿記3級問題集アプリ - 学習進捗・統計計算
 * Step 3.1: 学習統計機能実装
 */

import { learningHistoryRepository } from "../data/repositories/learning-history-repository";
import { questionRepository } from "../data/repositories/question-repository";
import { reviewItemRepository } from "../data/repositories/review-item-repository";
import { statisticsCache } from "./statistics-cache";
import { QuestionCategory } from "../types/models";

/**
 * 全体学習統計
 */
export interface OverallStatistics {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyRate: number;
  studyDays: number;
  totalStudyTimeMs: number;
  averageStudyTimeMs: number;
  currentStreak: number;
  maxStreak: number;
  lastStudiedAt?: string;
  firstStudiedAt?: string;
}

/**
 * カテゴリ別統計
 */
export interface CategoryStatistics {
  category: QuestionCategory;
  categoryName: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyRate: number;
  averageAnswerTimeMs: number;
  completionRate: number;
  reviewItemsCount: number;
  masteredCount: number;
  lastStudiedAt?: string;
  difficultyBreakdown: {
    easy: { answered: number; correct: number };
    medium: { answered: number; correct: number };
    hard: { answered: number; correct: number };
  };
}

/**
 * 日別学習統計
 */
export interface DailyStatistics {
  date: string; // YYYY-MM-DD
  questionsAnswered: number;
  correctAnswers: number;
  accuracyRate: number;
  studyTimeMs: number;
  sessionsCount: number;
  categories: {
    [key in QuestionCategory]: {
      answered: number;
      correct: number;
    };
  };
}

/**
 * 学習傾向分析
 */
export interface LearningTrends {
  weeklyProgress: {
    week: string; // YYYY-WW
    questionsAnswered: number;
    accuracyRate: number;
    studyTimeMs: number;
  }[];

  monthlyProgress: {
    month: string; // YYYY-MM
    questionsAnswered: number;
    accuracyRate: number;
    studyTimeMs: number;
  }[];

  accuracyTrend: "improving" | "stable" | "declining";
  speedTrend: "faster" | "stable" | "slower";
  consistencyScore: number; // 0-100

  recommendations: string[];
}

/**
 * 学習目標進捗
 */
export interface LearningGoals {
  dailyGoal: {
    target: number; // 問題数
    achieved: number;
    completion: number; // 0-1
  };

  weeklyGoal: {
    target: number;
    achieved: number;
    completion: number;
  };

  monthlyGoal: {
    target: number;
    achieved: number;
    completion: number;
  };

  accuracyGoal: {
    target: number; // 0-1
    current: number;
    achievement: "achieved" | "close" | "needs_improvement";
  };
}

/**
 * 統計サービスクラス
 */
export class StatisticsService {
  /**
   * 全体学習統計取得
   */
  public async getOverallStatistics(): Promise<OverallStatistics> {
    try {
      // キャッシュチェック
      const cached = statisticsCache.getOverallStats();
      if (cached) {
        return cached;
      }

      console.log("[StatisticsService] 全体学習統計取得開始");

      // 基本統計取得（回答数ベース）
      const basicStats = await learningHistoryRepository.getStatistics();

      // ユニーク問題数取得（重複除外）
      const uniqueStats =
        await learningHistoryRepository.getUniqueAnsweredQuestions();

      // 総問題数取得
      const totalQuestions = await this.getTotalQuestionsCount();

      // 学習日数計算
      const studyDays = await this.calculateStudyDays();

      // 連続学習日数計算
      const { currentStreak, maxStreak } = await this.calculateStudyStreaks();

      // 最初と最後の学習日取得
      const { firstStudiedAt, lastStudiedAt } = await this.getStudyDateRange();

      // 統計データの整合性確保
      const answeredQuestions = uniqueStats.totalUniqueQuestions;
      const correctAnswers = uniqueStats.correctUniqueQuestions;
      const incorrectAnswers = Math.max(0, answeredQuestions - correctAnswers); // 負の値を防ぐ

      const statistics: OverallStatistics = {
        totalQuestions,
        answeredQuestions, // ユニーク回答済み問題数
        correctAnswers, // ユニーク正解問題数
        incorrectAnswers, // 不正解数（負の値を防ぐ）
        accuracyRate:
          answeredQuestions > 0 ? correctAnswers / answeredQuestions : 0,
        studyDays,
        totalStudyTimeMs: basicStats.totalStudyTime,
        averageStudyTimeMs: basicStats.averageAnswerTime,
        currentStreak,
        maxStreak,
        firstStudiedAt,
        lastStudiedAt,
      };

      // キャッシュに保存
      statisticsCache.setOverallStats(statistics);

      console.log("[StatisticsService] 全体学習統計取得完了");
      console.log("[StatisticsService] 統計データ:", {
        totalQuestions: statistics.totalQuestions,
        answeredQuestions: statistics.answeredQuestions,
        correctAnswers: statistics.correctAnswers,
        incorrectAnswers: statistics.incorrectAnswers,
      });

      return statistics;
    } catch (error) {
      console.error("[StatisticsService] getOverallStatistics エラー:", error);
      throw error;
    }
  }

  /**
   * カテゴリ別統計取得
   */
  public async getCategoryStatistics(): Promise<CategoryStatistics[]> {
    try {
      // キャッシュチェック
      const cached = statisticsCache.getCategoryStats();
      if (cached) {
        return cached;
      }

      console.log("[StatisticsService] カテゴリ別統計取得開始");

      const categories: QuestionCategory[] = [
        "journal",
        "ledger",
        "trial_balance",
        "financial_statement",
      ];
      const categoryNames: Record<QuestionCategory, string> = {
        journal: "仕訳",
        ledger: "帳簿",
        trial_balance: "試算表",
        financial_statement: "財務諸表",
        voucher_entry: "伝票記入",
        multiple_blank_choice: "複数空欄選択",
      };

      const statistics: CategoryStatistics[] = [];

      for (const category of categories) {
        // カテゴリ別ユニーク問題数（重複回答を除外した一意の問題数）
        const categoryUniqueStats =
          await learningHistoryRepository.getUniqueAnsweredQuestions({
            category,
          });

        // カテゴリ別総問題数
        const totalQuestions = await this.getCategoryQuestionsCount(category);

        // 復習アイテム数
        const reviewStats = await reviewItemRepository.getReviewStatistics();
        const categoryReviewStats = reviewStats.categoryBreakdown[category];

        // 難易度別統計
        const difficultyBreakdown = await this.getDifficultyBreakdown(category);

        // 平均回答時間（基本統計から取得）
        const basicStats = await learningHistoryRepository.getStatistics({
          category,
        });

        // ユニーク問題数を使用して統計を計算
        const uniqueAnswered = categoryUniqueStats.totalUniqueQuestions;
        const uniqueCorrect = categoryUniqueStats.correctUniqueQuestions;

        // 克服済み問題数は、一度でも正解した問題数と同じ
        const masteredCount = uniqueCorrect;

        const categoryStats: CategoryStatistics = {
          category,
          categoryName: categoryNames[category],
          totalQuestions,
          answeredQuestions: uniqueAnswered, // ユニーク回答済み問題数
          correctAnswers: uniqueCorrect, // ユニーク正解問題数
          incorrectAnswers: Math.max(0, uniqueAnswered - uniqueCorrect), // 負の値を防ぐ
          accuracyRate: uniqueAnswered > 0 ? uniqueCorrect / uniqueAnswered : 0,
          averageAnswerTimeMs: basicStats.averageAnswerTime,
          completionRate:
            totalQuestions > 0 ? uniqueAnswered / totalQuestions : 0,
          reviewItemsCount: categoryReviewStats?.total || 0, // 復習対象問題数
          masteredCount, // 克服済み問題数（一度でも正解した問題数）
          lastStudiedAt: basicStats.lastAnsweredAt,
          difficultyBreakdown,
        };

        statistics.push(categoryStats);
      }

      // キャッシュに保存
      statisticsCache.setCategoryStats(statistics);

      console.log("[StatisticsService] カテゴリ別統計取得完了");
      return statistics;
    } catch (error) {
      console.error("[StatisticsService] getCategoryStatistics エラー:", error);
      throw error;
    }
  }

  /**
   * 日別学習統計取得
   */
  public async getDailyStatistics(
    days: number = 30,
  ): Promise<DailyStatistics[]> {
    try {
      console.log(`[StatisticsService] 日別学習統計取得開始: ${days}日間`);

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const basicStats = await learningHistoryRepository.getStatistics({
        dateFrom: startDate.toISOString(),
        dateTo: endDate.toISOString(),
      });

      // 日別データ処理
      const dailyMap = new Map<string, DailyStatistics>();

      // 期間内の全日付を初期化
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toISOString().split("T")[0];
        dailyMap.set(dateStr, {
          date: dateStr,
          questionsAnswered: 0,
          correctAnswers: 0,
          accuracyRate: 0,
          studyTimeMs: 0,
          sessionsCount: 0,
          categories: {
            journal: { answered: 0, correct: 0 },
            ledger: { answered: 0, correct: 0 },
            trial_balance: { answered: 0, correct: 0 },
            financial_statement: { answered: 0, correct: 0 },
            voucher_entry: { answered: 0, correct: 0 },
            multiple_blank_choice: { answered: 0, correct: 0 },
          } as Record<QuestionCategory, { answered: number; correct: number }>,
        });
      }

      // 実際のデータで更新
      basicStats.dailyStats.forEach((stat) => {
        if (dailyMap.has(stat.date)) {
          const daily = dailyMap.get(stat.date)!;
          daily.questionsAnswered = stat.questionsAnswered;
          daily.correctAnswers = stat.correctAnswers;
          daily.accuracyRate = stat.accuracyRate;
          daily.studyTimeMs = stat.studyTime;
        }
      });

      // カテゴリ別データを追加
      await this.addCategoryDataToDaily(dailyMap, startDate, endDate);

      const result = Array.from(dailyMap.values()).sort((a, b) =>
        a.date.localeCompare(b.date),
      );

      console.log("[StatisticsService] 日別学習統計取得完了");
      return result;
    } catch (error) {
      console.error("[StatisticsService] getDailyStatistics エラー:", error);
      throw error;
    }
  }

  /**
   * 学習傾向分析
   */
  public async getLearningTrends(): Promise<LearningTrends> {
    try {
      console.log("[StatisticsService] 学習傾向分析開始");

      // 週別・月別進捗データ取得
      const weeklyProgress = await this.getWeeklyProgress();
      const monthlyProgress = await this.getMonthlyProgress();

      // 傾向分析
      const accuracyTrend = this.analyzeAccuracyTrend(weeklyProgress);
      const speedTrend = await this.analyzeSpeedTrend();
      const consistencyScore = this.calculateConsistencyScore(
        await this.getDailyStatistics(30),
      );

      // 推奨事項生成
      const recommendations = this.generateRecommendations({
        accuracyTrend,
        speedTrend,
        consistencyScore,
      });

      const trends: LearningTrends = {
        weeklyProgress,
        monthlyProgress,
        accuracyTrend,
        speedTrend,
        consistencyScore,
        recommendations,
      };

      console.log("[StatisticsService] 学習傾向分析完了");
      return trends;
    } catch (error) {
      console.error("[StatisticsService] getLearningTrends エラー:", error);
      throw error;
    }
  }

  /**
   * 学習目標進捗取得
   */
  public async getLearningGoals(): Promise<LearningGoals> {
    try {
      // キャッシュチェック
      const cached = statisticsCache.getLearningGoals();
      if (cached) {
        return cached;
      }

      console.log("[StatisticsService] 学習目標進捗取得開始");

      // 目標設定取得（将来的にはユーザー設定から）
      const targets = {
        daily: 10, // 1日10問
        weekly: 50, // 1週間50問
        monthly: 200, // 1ヶ月200問
        accuracy: 0.8, // 80%正答率
      };

      // 今日の実績
      const today = new Date().toISOString().split("T")[0];
      const todayStats = await this.getDailyStatistics(1);
      const dailyAchieved = todayStats[0]?.questionsAnswered || 0;

      // 今週の実績
      const weeklyAchieved = await this.getWeeklyAchievement();

      // 今月の実績
      const monthlyAchieved = await this.getMonthlyAchievement();

      // 現在の正答率
      const overallStats = await this.getOverallStatistics();
      const currentAccuracy = overallStats.accuracyRate;

      const goals: LearningGoals = {
        dailyGoal: {
          target: targets.daily,
          achieved: dailyAchieved,
          completion: Math.min(dailyAchieved / targets.daily, 1),
        },
        weeklyGoal: {
          target: targets.weekly,
          achieved: weeklyAchieved,
          completion: Math.min(weeklyAchieved / targets.weekly, 1),
        },
        monthlyGoal: {
          target: targets.monthly,
          achieved: monthlyAchieved,
          completion: Math.min(monthlyAchieved / targets.monthly, 1),
        },
        accuracyGoal: {
          target: targets.accuracy,
          current: currentAccuracy,
          achievement:
            currentAccuracy >= targets.accuracy
              ? "achieved"
              : currentAccuracy >= targets.accuracy - 0.1
                ? "close"
                : "needs_improvement",
        },
      };

      // キャッシュに保存
      statisticsCache.setLearningGoals(goals);

      console.log("[StatisticsService] 学習目標進捗取得完了");
      return goals;
    } catch (error) {
      console.error("[StatisticsService] getLearningGoals エラー:", error);
      throw error;
    }
  }

  /**
   * 総問題数取得
   */
  private async getTotalQuestionsCount(): Promise<number> {
    const result = await questionRepository.executeQuery<{ count: number }>(
      "SELECT COUNT(*) as count FROM questions",
      [],
    );
    return result.rows[0]?.count || 302; // デフォルトは仕様書の値
  }

  /**
   * カテゴリ別問題数取得
   */
  private async getCategoryQuestionsCount(
    category: QuestionCategory,
  ): Promise<number> {
    const result = await questionRepository.executeQuery<{ count: number }>(
      "SELECT COUNT(*) as count FROM questions WHERE category_id = ?",
      [category],
    );

    // デフォルト値（仕様書ベース）
    const defaults: Record<QuestionCategory, number> = {
      journal: 250,
      ledger: 40,
      trial_balance: 12,
      financial_statement: 2,
      voucher_entry: 0,
      multiple_blank_choice: 0,
    };
    return result.rows[0]?.count || defaults[category];
  }

  /**
   * 学習日数計算
   */
  private async calculateStudyDays(): Promise<number> {
    const result = await learningHistoryRepository.executeQuery<{
      days: number;
    }>(
      "SELECT COUNT(DISTINCT DATE(answered_at)) as days FROM learning_history",
      [],
    );
    return result.rows[0]?.days || 0;
  }

  /**
   * 連続学習日数計算
   */
  private async calculateStudyStreaks(): Promise<{
    currentStreak: number;
    maxStreak: number;
  }> {
    const result = await learningHistoryRepository.executeQuery<{
      date: string;
    }>(
      "SELECT DISTINCT DATE(answered_at) as date FROM learning_history ORDER BY date DESC",
      [],
    );

    const studyDates = result.rows.map((row) => new Date(row.date));

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 現在の連続日数計算
    for (let i = 0; i < studyDates.length; i++) {
      const studyDate = studyDates[i];
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);

      if (studyDate.getTime() === expectedDate.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }

    // 最大連続日数計算
    if (studyDates.length > 0) {
      tempStreak = 1;
      for (let i = 1; i < studyDates.length; i++) {
        const prevDate = studyDates[i - 1];
        const currDate = studyDates[i];
        const dayDiff =
          (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);

        if (dayDiff === 1) {
          tempStreak++;
        } else {
          maxStreak = Math.max(maxStreak, tempStreak);
          tempStreak = 1;
        }
      }
      maxStreak = Math.max(maxStreak, tempStreak);
    }

    return { currentStreak, maxStreak };
  }

  /**
   * 学習期間取得
   */
  private async getStudyDateRange(): Promise<{
    firstStudiedAt?: string;
    lastStudiedAt?: string;
  }> {
    const result = await learningHistoryRepository.executeQuery<{
      first: string;
      last: string;
    }>(
      "SELECT MIN(answered_at) as first, MAX(answered_at) as last FROM learning_history",
      [],
    );

    const row = result.rows[0];
    return {
      firstStudiedAt: row?.first,
      lastStudiedAt: row?.last,
    };
  }

  /**
   * 難易度別統計取得
   */
  private async getDifficultyBreakdown(category: QuestionCategory) {
    const result = await learningHistoryRepository.executeQuery<{
      difficulty: number;
      answered: number;
      correct: number;
    }>(
      `SELECT 
        q.difficulty,
        COUNT(*) as answered,
        SUM(CASE WHEN lh.is_correct = 1 THEN 1 ELSE 0 END) as correct
      FROM learning_history lh
      INNER JOIN questions q ON lh.question_id = q.id
      WHERE q.category_id = ?
      GROUP BY q.difficulty`,
      [category],
    );

    const breakdown = {
      easy: { answered: 0, correct: 0 },
      medium: { answered: 0, correct: 0 },
      hard: { answered: 0, correct: 0 },
    };

    result.rows.forEach((row) => {
      const level =
        row.difficulty <= 2 ? "easy" : row.difficulty <= 3 ? "medium" : "hard";
      breakdown[level].answered += row.answered;
      breakdown[level].correct += row.correct;
    });

    return breakdown;
  }

  /**
   * 克服済み問題数取得
   */
  private async getMasteredQuestionsCount(
    category: QuestionCategory,
  ): Promise<number> {
    const result = await learningHistoryRepository.executeQuery<{
      count: number;
    }>(
      `SELECT COUNT(DISTINCT lh.question_id) as count
      FROM learning_history lh
      INNER JOIN questions q ON lh.question_id = q.id
      WHERE q.category_id = ? AND lh.is_correct = 1`,
      [category],
    );
    return result.rows[0]?.count || 0;
  }

  /**
   * 日別統計にカテゴリデータ追加
   */
  private async addCategoryDataToDaily(
    dailyMap: Map<string, DailyStatistics>,
    startDate: Date,
    endDate: Date,
  ): Promise<void> {
    const categories: QuestionCategory[] = [
      "journal",
      "ledger",
      "trial_balance",
      "financial_statement",
      "voucher_entry",
      "multiple_blank_choice",
    ];

    for (const category of categories) {
      const result = await learningHistoryRepository.executeQuery<{
        date: string;
        answered: number;
        correct: number;
      }>(
        `SELECT 
          DATE(lh.answered_at) as date,
          COUNT(*) as answered,
          SUM(CASE WHEN lh.is_correct = 1 THEN 1 ELSE 0 END) as correct
        FROM learning_history lh
        INNER JOIN questions q ON lh.question_id = q.id
        WHERE q.category_id = ? AND lh.answered_at BETWEEN ? AND ?
        GROUP BY DATE(lh.answered_at)`,
        [category, startDate.toISOString(), endDate.toISOString()],
      );

      result.rows.forEach((row) => {
        if (dailyMap.has(row.date)) {
          const daily = dailyMap.get(row.date)!;
          daily.categories[category] = {
            answered: row.answered,
            correct: row.correct,
          };
        }
      });
    }
  }

  /**
   * 週別進捗取得
   */
  private async getWeeklyProgress() {
    // 実装省略 - 週別の統計計算
    return [];
  }

  /**
   * 月別進捗取得
   */
  private async getMonthlyProgress() {
    // 実装省略 - 月別の統計計算
    return [];
  }

  /**
   * 正答率傾向分析
   */
  private analyzeAccuracyTrend(
    weeklyData: any[],
  ): "improving" | "stable" | "declining" {
    // 実装省略 - 正答率の傾向分析
    return "stable";
  }

  /**
   * 解答速度傾向分析
   */
  private async analyzeSpeedTrend(): Promise<"faster" | "stable" | "slower"> {
    // 実装省略 - 解答速度の傾向分析
    return "stable";
  }

  /**
   * 継続性スコア計算
   */
  private calculateConsistencyScore(dailyStats: DailyStatistics[]): number {
    const studyDays = dailyStats.filter(
      (day) => day.questionsAnswered > 0,
    ).length;
    return Math.round((studyDays / dailyStats.length) * 100);
  }

  /**
   * 推奨事項生成
   */
  private generateRecommendations(trends: {
    accuracyTrend: string;
    speedTrend: string;
    consistencyScore: number;
  }): string[] {
    const recommendations: string[] = [];

    if (trends.accuracyTrend === "declining") {
      recommendations.push("復習モードで間違えた問題を重点的に学習しましょう");
    }

    if (trends.consistencyScore < 50) {
      recommendations.push(
        "毎日少しずつでも学習を継続することを心がけましょう",
      );
    }

    if (recommendations.length === 0) {
      recommendations.push("順調に学習が進んでいます！この調子で続けましょう");
    }

    return recommendations;
  }

  /**
   * 今週の実績取得
   */
  private async getWeeklyAchievement(): Promise<number> {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const result = await learningHistoryRepository.executeQuery<{
      count: number;
    }>(
      "SELECT COUNT(*) as count FROM learning_history WHERE answered_at >= ?",
      [startOfWeek.toISOString()],
    );

    return result.rows[0]?.count || 0;
  }

  /**
   * 今月の実績取得
   */
  private async getMonthlyAchievement(): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const result = await learningHistoryRepository.executeQuery<{
      count: number;
    }>(
      "SELECT COUNT(*) as count FROM learning_history WHERE answered_at >= ?",
      [startOfMonth.toISOString()],
    );

    return result.rows[0]?.count || 0;
  }
}

/**
 * 統計サービスのシングルトンインスタンス
 */
export const statisticsService = new StatisticsService();
