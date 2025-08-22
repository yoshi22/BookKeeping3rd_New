/**
 * ReviewItemRepository テスト
 * 復習アイテムデータアクセスの動作確認
 */

import { ReviewItemRepository } from "../../../src/data/repositories/review-item-repository";
import { DatabaseService } from "../../../src/data/database";

// Mock database service
jest.mock("../../../src/data/database");

describe("ReviewItemRepository", () => {
  let repository: ReviewItemRepository;
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
    repository = new ReviewItemRepository();
  });

  describe("復習アイテムの作成", () => {
    it("新しい復習アイテムが正しく作成される", async () => {
      const reviewItemData = {
        question_id: "Q_J_001",
        wrong_count: 1,
        priority_score: 5.0,
        consecutive_correct: 0,
        last_wrong_at: new Date().toISOString(),
      };

      mockDb.executeQuery.mockResolvedValue({
        rows: [{ insertId: 1 }],
      } as any);

      const result = await repository.create(reviewItemData as any);

      expect(mockDb.executeQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO review_items"),
        expect.arrayContaining(["Q_J_001", 1, 5.0, 0, expect.any(String)]),
      );
      expect(result.id).toBe(1);
    });

    it("復習アイテム作成時のエラーが適切に処理される", async () => {
      mockDb.executeQuery.mockRejectedValue(new Error("Constraint violation"));

      const reviewItemData = {
        question_id: "Q_J_001",
        wrong_count: 1,
      };

      await expect(repository.create(reviewItemData as any)).rejects.toThrow(
        "Constraint violation",
      );
    });
  });

  describe("復習アイテムの検索", () => {
    it("問題IDによる復習アイテム検索が機能する", async () => {
      mockDb.executeQuery.mockResolvedValue({
        rows: [
          {
            id: 1,
            question_id: "Q_J_001",
            wrong_count: 2,
            priority_score: 7.5,
            consecutive_correct: 0,
          },
        ],
      } as any);

      const item = await repository.findByQuestionId("Q_J_001");

      expect(item).toBeDefined();
      expect(item?.question_id).toBe("Q_J_001");
      expect(mockDb.executeQuery).toHaveBeenCalledWith(
        expect.stringContaining("WHERE question_id = ?"),
        ["Q_J_001"],
      );
    });

    it("存在しない問題IDの検索でnullが返される", async () => {
      mockDb.executeQuery.mockResolvedValue({
        rows: [],
      } as any);

      const item = await repository.findByQuestionId("Q_NONEXISTENT");

      expect(item).toBeNull();
    });
  });

  describe("優先度順復習リストの取得", () => {
    it("優先度順の復習リストが正しく取得される", async () => {
      const mockItems = [
        {
          id: 1,
          question_id: "Q_J_001",
          priority_score: 9.0,
          wrong_count: 3,
        },
        {
          id: 2,
          question_id: "Q_J_002",
          priority_score: 7.5,
          wrong_count: 2,
        },
      ];

      mockDb.executeQuery.mockResolvedValue({
        rows: mockItems,
      } as any);

      const items = await repository.findByPriorityWithLimit(10);

      expect(items).toHaveLength(2);
      expect(items[0].priority_score).toBeGreaterThanOrEqual(
        items[1].priority_score,
      );
      expect(mockDb.executeQuery).toHaveBeenCalledWith(
        expect.stringContaining("ORDER BY priority_score DESC"),
        [10],
      );
    });

    it("カテゴリ指定での復習リスト取得が機能する", async () => {
      mockDb.executeQuery.mockResolvedValue({
        rows: [
          {
            id: 1,
            question_id: "Q_J_001",
            category_id: "journal",
            priority_score: 8.0,
          },
        ],
      } as any);

      const items = await repository.findByPriorityWithLimit(5, "journal");

      expect(items).toHaveLength(1);
      expect(mockDb.executeQuery).toHaveBeenCalledWith(
        expect.stringContaining("JOIN questions"),
        [5, "journal"],
      );
    });
  });

  describe("復習アイテムの更新", () => {
    it("復習アイテムが正しく更新される", async () => {
      const updateData = {
        wrong_count: 3,
        priority_score: 8.5,
        consecutive_correct: 0,
        last_wrong_at: new Date().toISOString(),
      };

      mockDb.executeQuery.mockResolvedValue({
        rows: [{ id: 1, ...updateData }],
      } as any);

      const result = await repository.update(1, updateData as any);

      expect(result.wrong_count).toBe(3);
      expect(result.priority_score).toBe(8.5);
      expect(mockDb.executeQuery).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE review_items SET"),
        expect.arrayContaining([3, 8.5, 0, expect.any(String), 1]),
      );
    });

    it("存在しないIDの更新でエラーが処理される", async () => {
      mockDb.executeQuery.mockResolvedValue({
        rows: [],
      } as any);

      await expect(
        repository.update(999, { wrong_count: 1 } as any),
      ).rejects.toThrow();
    });
  });

  describe("復習アイテムの削除", () => {
    it("復習アイテムが正しく削除される", async () => {
      mockDb.executeQuery.mockResolvedValue({
        rows: [{ changes: 1 }],
      } as any);

      const result = await repository.delete(1);

      expect(result).toBe(true);
      expect(mockDb.executeQuery).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM review_items WHERE id = ?"),
        [1],
      );
    });

    it("存在しないIDの削除でfalseが返される", async () => {
      mockDb.executeQuery.mockResolvedValue({
        rows: [{ changes: 0 }],
      } as any);

      const result = await repository.delete(999);

      expect(result).toBe(false);
    });
  });

  describe("復習統計の取得", () => {
    it("復習統計が正しく取得される", async () => {
      mockDb.executeQuery.mockResolvedValue({
        rows: [
          { category_id: "journal", count: 5 },
          { category_id: "ledger", count: 3 },
        ],
      } as any);

      const stats = await repository.getReviewStatistics();

      expect(stats.categoryBreakdown).toBeDefined();
      expect(stats.categoryBreakdown.journal).toEqual({ count: 5 });
      expect(stats.categoryBreakdown.ledger).toEqual({ count: 3 });
    });

    it("全復習アイテム数が正しく取得される", async () => {
      mockDb.executeQuery.mockResolvedValue({
        rows: [{ total_count: 15 }],
      } as any);

      const count = await repository.countAll();

      expect(count).toBe(15);
      expect(mockDb.executeQuery).toHaveBeenCalledWith(
        expect.stringContaining("SELECT COUNT(*) as total_count"),
      );
    });
  });
});
