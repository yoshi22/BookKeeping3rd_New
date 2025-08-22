/**
 * LearningHistoryRepository テスト
 * 学習履歴データアクセスの動作確認
 */

import { LearningHistoryRepository } from "../../../src/data/repositories/learning-history-repository";
import { DatabaseService } from "../../../src/data/database";

// Mock database service
jest.mock("../../../src/data/database");

describe("LearningHistoryRepository", () => {
  let repository: LearningHistoryRepository;
  let mockDb: jest.Mocked<DatabaseService>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock database
    mockDb = {
      executeQuery: jest.fn(),
      getDb: jest.fn(),
      initializeDatabase: jest.fn(),
      closeDatabase: jest.fn(),
    } as any;

    (DatabaseService.getInstance as jest.Mock).mockReturnValue(mockDb);
    repository = new LearningHistoryRepository();
  });

  describe("学習履歴の作成", () => {
    it("新しい学習履歴が正しく作成される", async () => {
      const historyData = {
        question_id: "Q_J_001",
        is_correct: true,
        time_spent: 30000,
        session_type: "learning",
        user_answer_json: JSON.stringify({ test: "answer" }),
      };

      mockDb.executeQuery.mockResolvedValue({
        rows: [{ insertId: 1 }],
      } as any);

      const result = await repository.create(historyData as any);

      expect(mockDb.executeQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO learning_history"),
        expect.arrayContaining([
          "Q_J_001",
          true,
          30000,
          "learning",
          expect.any(String),
        ]),
      );
      expect(result.id).toBe(1);
    });

    it("学習履歴の記録時にエラーが適切に処理される", async () => {
      mockDb.executeQuery.mockRejectedValue(new Error("Database error"));

      const historyData = {
        question_id: "Q_J_001",
        is_correct: true,
        time_spent: 30000,
      };

      await expect(repository.create(historyData as any)).rejects.toThrow(
        "Database error",
      );
    });
  });

  describe("統計情報の取得", () => {
    it("基本統計が正しく取得される", async () => {
      mockDb.executeQuery.mockResolvedValue({
        rows: [
          {
            total_answers: 100,
            total_correct: 75,
            total_incorrect: 25,
            total_study_time: 300000,
            average_time: 3000,
          },
        ],
      } as any);

      const stats = await repository.getStatistics();

      expect(stats.totalAnswers).toBe(100);
      expect(stats.totalCorrect).toBe(75);
      expect(stats.totalStudyTime).toBe(300000);
      expect(mockDb.executeQuery).toHaveBeenCalledWith(
        expect.stringContaining("SELECT"),
      );
    });

    it("ユニーク回答済み問題数が正しく取得される", async () => {
      mockDb.executeQuery.mockResolvedValue({
        rows: [
          {
            total_unique_questions: 50,
            correct_unique_questions: 40,
          },
        ],
      } as any);

      const uniqueStats = await repository.getUniqueAnsweredQuestions();

      expect(uniqueStats.totalUniqueQuestions).toBe(50);
      expect(uniqueStats.correctUniqueQuestions).toBe(40);
    });
  });

  describe("カテゴリ別統計", () => {
    it("カテゴリ別の学習統計が取得される", async () => {
      mockDb.executeQuery.mockResolvedValue({
        rows: [
          {
            category_id: "journal",
            answered_count: 30,
            correct_count: 25,
            total_time: 90000,
          },
          {
            category_id: "ledger",
            answered_count: 20,
            correct_count: 15,
            total_time: 60000,
          },
        ],
      } as any);

      const categoryStats = await repository.getCategoryStatistics("journal");

      expect(Array.isArray(categoryStats)).toBe(true);
      expect(mockDb.executeQuery).toHaveBeenCalledWith(
        expect.stringContaining("GROUP BY"),
        expect.arrayContaining(["journal"]),
      );
    });
  });

  describe("学習履歴の検索", () => {
    it("問題IDによる履歴検索が機能する", async () => {
      mockDb.executeQuery.mockResolvedValue({
        rows: [
          {
            id: 1,
            question_id: "Q_J_001",
            is_correct: true,
            created_at: "2025-08-22T10:00:00.000Z",
          },
        ],
      } as any);

      const history = await repository.findByQuestionId("Q_J_001");

      expect(Array.isArray(history)).toBe(true);
      expect(mockDb.executeQuery).toHaveBeenCalledWith(
        expect.stringContaining("WHERE question_id = ?"),
        ["Q_J_001"],
      );
    });

    it("日付範囲による履歴検索が機能する", async () => {
      const startDate = new Date("2025-08-01");
      const endDate = new Date("2025-08-31");

      mockDb.executeQuery.mockResolvedValue({
        rows: [],
      } as any);

      await repository.findByDateRange(startDate, endDate);

      expect(mockDb.executeQuery).toHaveBeenCalledWith(
        expect.stringContaining("WHERE created_at BETWEEN"),
        expect.arrayContaining([
          expect.stringMatching(/2025-08-01/),
          expect.stringMatching(/2025-08-31/),
        ]),
      );
    });
  });
});
