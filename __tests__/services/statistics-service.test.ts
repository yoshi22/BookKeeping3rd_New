/**
 * StatisticsService テスト
 * 統計計算機能の動作確認
 */

import { StatisticsService } from "../../src/services/statistics-service";
import { LearningHistoryRepository } from "../../src/data/repositories/learning-history-repository";
import { ReviewItemRepository } from "../../src/data/repositories/review-item-repository";
import { QuestionRepository } from "../../src/data/repositories/question-repository";

// Mock repositories
jest.mock("../../src/data/repositories/learning-history-repository");
jest.mock("../../src/data/repositories/review-item-repository");
jest.mock("../../src/data/repositories/question-repository");

describe("StatisticsService", () => {
  let statisticsService: StatisticsService;
  let mockHistoryRepo: jest.Mocked<LearningHistoryRepository>;
  let mockReviewRepo: jest.Mocked<ReviewItemRepository>;
  let mockQuestionRepo: jest.Mocked<QuestionRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockHistoryRepo =
      new LearningHistoryRepository() as jest.Mocked<LearningHistoryRepository>;
    mockReviewRepo =
      new ReviewItemRepository() as jest.Mocked<ReviewItemRepository>;
    mockQuestionRepo =
      new QuestionRepository() as jest.Mocked<QuestionRepository>;

    statisticsService = new StatisticsService(
      mockHistoryRepo,
      mockQuestionRepo,
      mockReviewRepo,
    );
  });

  describe("学習統計の計算", () => {
    beforeEach(() => {
      // Setup mocks for getOverallStatistics method
      mockHistoryRepo.getStatistics.mockResolvedValue({
        totalAnswers: 50,
        totalCorrect: 35,
        totalIncorrect: 15,
        totalStudyTime: 135000,
        averageAnswerTime: 2700,
      } as any);

      mockHistoryRepo.getUniqueAnsweredQuestions.mockResolvedValue({
        totalUniqueQuestions: 40,
        correctUniqueQuestions: 35,
      } as any);

      mockQuestionRepo.executeQuery.mockResolvedValue({
        rows: [{ total: 302 }],
      } as any);

      mockHistoryRepo.executeQuery.mockResolvedValue({
        rows: [{ study_days: 15 }],
      } as any);

      // Mock additional methods called by getOverallStatistics
      jest
        .spyOn(statisticsService as any, "getTotalQuestionsCount")
        .mockResolvedValue(302);
      jest
        .spyOn(statisticsService as any, "calculateStudyDays")
        .mockResolvedValue(15);
      jest
        .spyOn(statisticsService as any, "calculateStudyStreaks")
        .mockResolvedValue({
          currentStreak: 5,
          maxStreak: 10,
        });
      jest
        .spyOn(statisticsService as any, "getStudyDateRange")
        .mockResolvedValue({
          firstStudiedAt: "2025-08-01T10:00:00.000Z",
          lastStudiedAt: "2025-08-22T10:00:00.000Z",
        });

      mockReviewRepo.getReviewStatistics.mockResolvedValue({
        categoryBreakdown: {
          journal: { count: 5 },
          ledger: { count: 3 },
          trial_balance: { count: 2 },
        },
      } as any);
    });

    it("全体学習統計が正しく計算される", async () => {
      const stats = await statisticsService.getOverallStatistics();

      expect(stats.answeredQuestions).toBe(40);
      expect(stats.correctAnswers).toBe(35);
      expect(stats.incorrectAnswers).toBe(5); // calculated as answeredQuestions - correctAnswers
      expect(stats.totalStudyTimeMs).toBe(135000);
    });

    it("カテゴリ別統計が取得される", async () => {
      // Setup mock for getCategoryStatistics
      mockHistoryRepo.getUniqueAnsweredQuestions.mockResolvedValue({
        uniqueQuestionsAnswered: 30,
        answeredQuestions: 35,
        correctAnswers: 25,
        incorrectAnswers: 10,
      } as any);

      const stats = await statisticsService.getCategoryStatistics();

      expect(Array.isArray(stats)).toBe(true);
    });

    it("日別統計が正しく取得される", async () => {
      // Mock for getDailyStatistics
      mockHistoryRepo.executeQuery.mockResolvedValue({
        rows: [
          {
            date: "2025-08-22",
            questions_answered: 10,
            correct_answers: 8,
            study_time_ms: 30000,
            sessions_count: 2,
          },
        ],
      } as any);

      const dailyStats = await statisticsService.getDailyStatistics(
        new Date("2025-08-22"),
        new Date("2025-08-22"),
      );

      expect(Array.isArray(dailyStats)).toBe(true);
    });

    it("学習傾向分析が取得される", async () => {
      // Mock for getLearningTrends
      mockHistoryRepo.executeQuery.mockResolvedValue({
        rows: [
          {
            week: "2025-34",
            questions_answered: 50,
            accuracy_rate: 0.8,
            study_time_ms: 120000,
          },
        ],
      } as any);

      const trends = await statisticsService.getLearningTrends();

      expect(trends).toHaveProperty("weeklyProgress");
      expect(trends).toHaveProperty("accuracyTrend");
      expect(trends).toHaveProperty("consistencyScore");
      expect(Array.isArray(trends.recommendations)).toBe(true);
    });

    it("学習目標が取得される", async () => {
      // Mock for getLearningGoals
      const goals = await statisticsService.getLearningGoals();

      expect(goals).toHaveProperty("dailyTarget");
      expect(goals).toHaveProperty("weeklyTarget");
      expect(goals).toHaveProperty("accuracyTarget");
    });
  });

  describe("カテゴリ進捗の取得", () => {
    it("カテゴリ進捗データが取得される", async () => {
      mockHistoryRepo.getUniqueAnsweredQuestions.mockResolvedValue({
        uniqueQuestionsAnswered: 30,
        answeredQuestions: 35,
        correctAnswers: 25,
        incorrectAnswers: 10,
      } as any);

      const progress = await statisticsService.getCategoryProgress();

      expect(Array.isArray(progress)).toBe(true);
    });
  });

  describe("エラーハンドリング", () => {
    it("リポジトリエラーが適切に処理される", async () => {
      // Mock the statistics cache to return null to bypass cache
      const statisticsCache =
        require("../../src/services/statistics-cache").statisticsCache;
      jest.spyOn(statisticsCache, "getOverallStats").mockReturnValue(null);

      mockHistoryRepo.getStatistics.mockRejectedValue(
        new Error("Database error"),
      );

      await expect(statisticsService.getOverallStatistics()).rejects.toThrow(
        "Database error",
      );
    });
  });
});
