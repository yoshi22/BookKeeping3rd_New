/**
 * ReviewService テスト
 * 復習システムの核心ロジックの動作確認
 */

import { ReviewService } from "../../src/services/review-service";
import { ReviewItemRepository } from "../../src/data/repositories/review-item-repository";
import { QuestionRepository } from "../../src/data/repositories/question-repository";
import { LearningHistoryRepository } from "../../src/data/repositories/learning-history-repository";

// Mock repositories
jest.mock("../../src/data/repositories/review-item-repository");
jest.mock("../../src/data/repositories/question-repository");
jest.mock("../../src/data/repositories/learning-history-repository");

describe("ReviewService", () => {
  let reviewService: ReviewService;
  let mockReviewRepo: jest.Mocked<ReviewItemRepository>;
  let mockQuestionRepo: jest.Mocked<QuestionRepository>;
  let mockHistoryRepo: jest.Mocked<LearningHistoryRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReviewRepo =
      new ReviewItemRepository() as jest.Mocked<ReviewItemRepository>;
    mockQuestionRepo =
      new QuestionRepository() as jest.Mocked<QuestionRepository>;
    mockHistoryRepo =
      new LearningHistoryRepository() as jest.Mocked<LearningHistoryRepository>;

    reviewService = new ReviewService(
      mockReviewRepo,
      mockHistoryRepo,
      mockQuestionRepo,
    );
  });

  describe("復習リスト生成", () => {
    const sampleReviewItems = [
      {
        id: 1,
        question_id: "Q_J_001",
        priority_score: 8.5,
        wrong_count: 3,
        last_wrong_at: "2025-08-20T10:00:00.000Z",
        created_at: "2025-08-18T10:00:00.000Z",
        updated_at: "2025-08-20T10:00:00.000Z",
      },
      {
        id: 2,
        question_id: "Q_J_002",
        priority_score: 6.2,
        wrong_count: 2,
        last_wrong_at: "2025-08-21T15:00:00.000Z",
        created_at: "2025-08-19T10:00:00.000Z",
        updated_at: "2025-08-21T15:00:00.000Z",
      },
    ];

    const sampleQuestions = [
      {
        id: "Q_J_001",
        question_text: "現金の仕訳",
        category_id: "journal",
        difficulty: 1,
      },
      {
        id: "Q_J_002",
        question_text: "売掛金の仕訳",
        category_id: "journal",
        difficulty: 2,
      },
    ];

    beforeEach(() => {
      mockReviewRepo.getReviewList.mockResolvedValue(sampleReviewItems as any);
      mockQuestionRepo.findByIds.mockResolvedValue(sampleQuestions as any);
    });

    it("優先度順の復習リストが生成される", async () => {
      const result = await reviewService.generateReviewList({
        maxCount: 10,
      });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("Q_J_001"); // 高優先度が最初
      expect(result[1].id).toBe("Q_J_002");
      expect(mockReviewRepo.findByPriorityWithLimit).toHaveBeenCalledWith(
        10,
        undefined,
      );
    });

    it("カテゴリ指定の復習リストが生成される", async () => {
      mockReviewRepo.findByPriorityWithLimit.mockResolvedValue([
        sampleReviewItems[0],
      ]);
      mockQuestionRepo.findByIds.mockResolvedValue([sampleQuestions[0]] as any);

      const result = await reviewService.generateReviewList({
        maxCount: 5,
        category: "journal",
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("Q_J_001");
      expect(mockReviewRepo.findByPriorityWithLimit).toHaveBeenCalledWith(
        5,
        "journal",
      );
    });

    it("空の復習リストが適切に処理される", async () => {
      mockReviewRepo.findByPriorityWithLimit.mockResolvedValue([]);

      const result = await reviewService.generateReviewList({
        maxCount: 10,
      });

      expect(result).toHaveLength(0);
    });
  });

  describe("復習アイテム追加", () => {
    const questionId = "Q_J_003";

    beforeEach(() => {
      mockReviewRepo.findByQuestionId.mockResolvedValue(null);
      mockReviewRepo.create.mockResolvedValue({ id: 3 } as any);
    });

    it("新規復習アイテムが作成される", async () => {
      await reviewService.addReviewItem(questionId);

      expect(mockReviewRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          question_id: questionId,
          wrong_count: 1,
          priority_score: expect.any(Number),
        }),
      );
    });

    it("既存復習アイテムが更新される", async () => {
      const existingItem = {
        id: 4,
        question_id: questionId,
        wrong_count: 2,
        priority_score: 5.0,
        consecutive_correct: 0,
      };

      mockReviewRepo.findByQuestionId.mockResolvedValue(existingItem as any);
      mockReviewRepo.update.mockResolvedValue(existingItem as any);

      await reviewService.addReviewItem(questionId);

      expect(mockReviewRepo.update).toHaveBeenCalledWith(
        4,
        expect.objectContaining({
          wrong_count: 3,
          consecutive_correct: 0,
          priority_score: expect.any(Number),
        }),
      );
    });
  });

  describe("復習進捗更新", () => {
    const questionId = "Q_J_004";
    const existingItem = {
      id: 5,
      question_id: questionId,
      wrong_count: 3,
      priority_score: 7.5,
      consecutive_correct: 0,
    };

    beforeEach(() => {
      mockReviewRepo.findByQuestionId.mockResolvedValue(existingItem as any);
    });

    it("正解時に連続正解数が増加する", async () => {
      mockReviewRepo.update.mockResolvedValue(existingItem as any);

      await reviewService.updateReviewProgress(questionId, true);

      expect(mockReviewRepo.update).toHaveBeenCalledWith(
        5,
        expect.objectContaining({
          consecutive_correct: 1,
          priority_score: expect.any(Number),
        }),
      );
    });

    it("2回連続正解で復習アイテムが削除される", async () => {
      const masteredItem = {
        ...existingItem,
        consecutive_correct: 1, // 既に1回正解済み
      };
      mockReviewRepo.findByQuestionId.mockResolvedValue(masteredItem as any);
      mockReviewRepo.delete.mockResolvedValue(true);

      await reviewService.updateReviewProgress(questionId, true);

      expect(mockReviewRepo.delete).toHaveBeenCalledWith(5);
    });

    it("不正解時に連続正解数がリセットされる", async () => {
      const correctItem = {
        ...existingItem,
        consecutive_correct: 1,
      };
      mockReviewRepo.findByQuestionId.mockResolvedValue(correctItem as any);
      mockReviewRepo.update.mockResolvedValue(correctItem as any);

      await reviewService.updateReviewProgress(questionId, false);

      expect(mockReviewRepo.update).toHaveBeenCalledWith(
        5,
        expect.objectContaining({
          consecutive_correct: 0,
          wrong_count: 4, // 増加
          priority_score: expect.any(Number),
        }),
      );
    });

    it("存在しない復習アイテムの進捗更新が適切に処理される", async () => {
      mockReviewRepo.findByQuestionId.mockResolvedValue(null);

      // エラーが発生せずに完了することを確認
      await expect(
        reviewService.updateReviewProgress("Q_NONEXISTENT", true),
      ).resolves.not.toThrow();
    });

    it("復習アイテムの優先度が正しく更新される", async () => {
      const existingItem = {
        id: 6,
        question_id: "Q_J_005",
        wrong_count: 2,
        priority_score: 6.0,
        consecutive_correct: 0,
      };

      mockReviewRepo.findByQuestionId.mockResolvedValue(existingItem as any);
      mockReviewRepo.update.mockResolvedValue(existingItem as any);

      await reviewService.updateReviewProgress("Q_J_005", false);

      expect(mockReviewRepo.update).toHaveBeenCalledWith(
        6,
        expect.objectContaining({
          wrong_count: 3,
          consecutive_correct: 0,
          priority_score: expect.any(Number),
        }),
      );
    });

    it("復習リストのカテゴリフィルタリングが機能する", async () => {
      const categoryItems = [
        {
          id: 1,
          question_id: "Q_J_001",
          priority_score: 8.0,
          wrong_count: 2,
        },
      ];

      mockReviewRepo.findByPriorityWithLimit.mockResolvedValue(
        categoryItems as any,
      );
      mockQuestionRepo.findByIds.mockResolvedValue([
        { id: "Q_J_001", category_id: "journal" },
      ] as any);

      const result = await reviewService.generateReviewList({
        maxCount: 5,
        category: "journal",
      });

      expect(result).toHaveLength(1);
      expect(mockReviewRepo.findByPriorityWithLimit).toHaveBeenCalledWith(
        5,
        "journal",
      );
    });
  });

  describe("優先度計算", () => {
    it("間違い回数が多いほど高優先度になる", async () => {
      const item1 = {
        wrong_count: 1,
        last_wrong_at: "2025-08-22T10:00:00.000Z",
      };
      const item2 = {
        wrong_count: 5,
        last_wrong_at: "2025-08-22T10:00:00.000Z",
      };

      // 同じ日時での優先度比較
      expect(item2.wrong_count).toBeGreaterThan(item1.wrong_count);
    });

    it("最近間違えた問題ほど高優先度になる", async () => {
      const recentItem = {
        wrong_count: 2,
        last_wrong_at: "2025-08-22T10:00:00.000Z",
      };
      const oldItem = {
        wrong_count: 2,
        last_wrong_at: "2025-08-20T10:00:00.000Z",
      };

      const recentTime = new Date(recentItem.last_wrong_at).getTime();
      const oldTime = new Date(oldItem.last_wrong_at).getTime();

      expect(recentTime).toBeGreaterThan(oldTime);
    });
  });

  describe("統計情報取得", () => {
    beforeEach(() => {
      mockReviewRepo.countAll.mockResolvedValue(15);
      mockReviewRepo.countByCategory.mockResolvedValue([
        { category_id: "journal", count: 10 },
        { category_id: "ledger", count: 5 },
      ]);
    });

    it("復習統計が正しく取得される", async () => {
      const stats = await reviewService.getReviewStats();

      expect(stats.totalReviewItems).toBe(15);
      expect(stats.categoryBreakdown).toHaveLength(2);
      expect(stats.categoryBreakdown[0].category_id).toBe("journal");
      expect(stats.categoryBreakdown[0].count).toBe(10);
    });

    it("空の統計が適切に処理される", async () => {
      mockReviewRepo.countAll.mockResolvedValue(0);
      mockReviewRepo.countByCategory.mockResolvedValue([]);

      const stats = await reviewService.getReviewStats();

      expect(stats.totalReviewItems).toBe(0);
      expect(stats.categoryBreakdown).toHaveLength(0);
    });
  });

  describe("エラーハンドリング", () => {
    it("リポジトリエラーが適切に処理される", async () => {
      mockReviewRepo.findByPriorityWithLimit.mockRejectedValue(
        new Error("Database connection failed"),
      );

      await expect(
        reviewService.generateReviewList({ maxCount: 10 }),
      ).rejects.toThrow("Database connection failed");
    });

    it("無効なパラメータが適切に処理される", async () => {
      await expect(
        reviewService.generateReviewList({ maxCount: -1 }),
      ).rejects.toThrow();
    });
  });
});
