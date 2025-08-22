/**
 * AnswerService テスト
 * 解答処理・採点ロジックの動作確認
 */

import { AnswerService } from "../../src/services/answer-service";
import { QuestionRepository } from "../../src/data/repositories/question-repository";
import { LearningHistoryRepository } from "../../src/data/repositories/learning-history-repository";
import { ReviewService } from "../../src/services/review-service";

// Mock repositories and services
jest.mock("../../src/data/repositories/question-repository");
jest.mock("../../src/data/repositories/learning-history-repository");
jest.mock("../../src/services/review-service");

describe("AnswerService", () => {
  let answerService: AnswerService;
  let mockQuestionRepo: jest.Mocked<QuestionRepository>;
  let mockHistoryRepo: jest.Mocked<LearningHistoryRepository>;
  let mockReviewService: jest.Mocked<ReviewService>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Setup mocked repositories and services
    mockQuestionRepo =
      new QuestionRepository() as jest.Mocked<QuestionRepository>;
    mockHistoryRepo =
      new LearningHistoryRepository() as jest.Mocked<LearningHistoryRepository>;
    mockReviewService = new ReviewService() as jest.Mocked<ReviewService>;

    answerService = new AnswerService(
      mockQuestionRepo,
      mockHistoryRepo,
      mockReviewService,
    );
  });

  describe("仕訳問題の採点", () => {
    const journalQuestion = {
      id: "Q_J_001",
      question_text: "現金100円を売り上げた",
      category_id: "journal",
      difficulty: 1,
      correct_answer_json: JSON.stringify({
        journalEntry: {
          debit_account: "現金",
          debit_amount: 100,
          credit_account: "売上",
          credit_amount: 100,
        },
      }),
      answer_template_json: JSON.stringify({
        type: "journal_entry",
        fields: [],
      }),
      explanation: "現金が増加し、売上が発生する取引です。",
    };

    beforeEach(() => {
      mockQuestionRepo.findById.mockResolvedValue(journalQuestion as any);
      mockHistoryRepo.create.mockResolvedValue({ id: 123 } as any);
      if (mockReviewService.updateReviewProgress) {
        mockReviewService.updateReviewProgress.mockResolvedValue(undefined);
      }
    });

    it("正解の仕訳が正しく採点される", async () => {
      const userAnswer = {
        debits: [{ account: "現金", amount: 100 }],
        credits: [{ account: "売上", amount: 100 }],
      };

      const result = await answerService.submitAnswer({
        questionId: "Q_J_001",
        userAnswer,
        sessionType: "learning",
        timeSpent: 30000,
      });

      expect(result.isCorrect).toBe(true);
      expect(result.score).toBeGreaterThan(0);
    });

    it("不正解の仕訳が正しく判定される", async () => {
      const userAnswer = {
        debits: [{ account: "現金", amount: 100 }],
        credits: [{ account: "仕入", amount: 100 }], // 間違った勘定科目
      };

      const result = await answerService.submitAnswer({
        questionId: "Q_J_001",
        userAnswer,
        sessionType: "learning",
        timeSpent: 30000,
      });

      expect(result.isCorrect).toBe(false);
      expect(result.score).toBe(0);
    });

    it("金額間違いが正しく判定される", async () => {
      const userAnswer = {
        debits: [{ account: "現金", amount: 200 }], // 間違った金額
        credits: [{ account: "売上", amount: 200 }],
      };

      const result = await answerService.submitAnswer({
        questionId: "Q_J_001",
        userAnswer,
        sessionType: "learning",
        timeSpent: 30000,
      });

      expect(result.isCorrect).toBe(false);
    });

    it("複合仕訳問題の採点が正しく行われる", async () => {
      const complexJournalQuestion = {
        id: "Q_J_002",
        question_text: "商品100円を現金50円、売掛金50円で売上げた",
        category_id: "journal",
        difficulty: 2,
        correct_answer_json: JSON.stringify({
          journalEntry: {
            debit_account: ["現金", "売掛金"],
            debit_amount: [50, 50],
            credit_account: ["売上"],
            credit_amount: [100],
          },
        }),
        explanation: "複合取引の仕訳です。",
      };

      mockQuestionRepo.findById.mockResolvedValue(
        complexJournalQuestion as any,
      );

      const userAnswer = {
        debits: [
          { account: "現金", amount: 50 },
          { account: "売掛金", amount: 50 },
        ],
        credits: [{ account: "売上", amount: 100 }],
      };

      const result = await answerService.submitAnswer({
        questionId: "Q_J_002",
        userAnswer,
        sessionType: "learning",
        timeSpent: 45000,
      });

      expect(result.isCorrect).toBe(true);
      expect(result.score).toBeGreaterThan(0);
    });

    it("バランス不整合の検証が正しく行われる", async () => {
      const userAnswer = {
        debits: [{ account: "現金", amount: 100 }],
        credits: [{ account: "売上", amount: 150 }], // バランス不整合
      };

      const result = await answerService.submitAnswer({
        questionId: "Q_J_001",
        userAnswer,
        sessionType: "learning",
        timeSpent: 30000,
      });

      expect(result.isCorrect).toBe(false);
      expect(result.feedback).toContain("借方と貸方の合計が一致しません");
    });
  });

  describe("帳簿問題の採点", () => {
    const ledgerQuestion = {
      id: "Q_L_001",
      question_text: "現金出納帳の残高を計算せよ",
      category_id: "ledger",
      difficulty: 2,
      correct_answer_json: JSON.stringify({
        result_amount: 1500,
      }),
    };

    beforeEach(() => {
      mockQuestionRepo.findById.mockResolvedValue(ledgerQuestion as any);
    });

    it("正解の金額が正しく採点される", async () => {
      const userAnswer = {
        result_amount: 1500,
      };

      const result = await answerService.submitAnswer({
        questionId: "Q_L_001",
        userAnswer,
        sessionType: "learning",
        timeSpent: 45000,
      });

      expect(result.isCorrect).toBe(true);
    });

    it("不正解の金額が正しく判定される", async () => {
      const userAnswer = {
        result_amount: 1000, // 間違った金額
      };

      const result = await answerService.submitAnswer({
        questionId: "Q_L_001",
        userAnswer,
        sessionType: "learning",
        timeSpent: 45000,
      });

      expect(result.isCorrect).toBe(false);
    });
  });

  describe("学習履歴の記録", () => {
    const sampleQuestion = {
      id: "Q_J_002",
      category_id: "journal",
      difficulty: 1,
      correct_answer_json: JSON.stringify({
        journalEntry: {
          debit_account: "現金",
          debit_amount: 100,
          credit_account: "売上",
          credit_amount: 100,
        },
      }),
      answer_template_json: JSON.stringify({
        type: "journal_entry",
        fields: [],
      }),
      explanation: "テスト用の説明",
    };

    beforeEach(() => {
      mockQuestionRepo.findById.mockResolvedValue(sampleQuestion as any);
      mockHistoryRepo.create.mockResolvedValue({ id: 1 } as any);
    });

    it("正解時の学習履歴が記録される", async () => {
      const userAnswer = { test: "answer" };

      const result = await answerService.submitAnswer({
        questionId: "Q_J_002",
        userAnswer,
        sessionType: "learning",
        timeSpent: 25000,
      });

      expect(mockHistoryRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          question_id: "Q_J_002",
          time_spent: 25000,
          session_type: "learning",
        }),
      );
    });

    it("不正解時も学習履歴が記録される", async () => {
      const userAnswer = { test: "wrong_answer" };

      await answerService.submitAnswer({
        questionId: "Q_J_002",
        userAnswer,
        sessionType: "learning",
        timeSpent: 60000,
      });

      expect(mockHistoryRepo.create).toHaveBeenCalled();
    });
  });

  describe("エラーハンドリング", () => {
    it("存在しない問題IDでエラーが処理される", async () => {
      mockQuestionRepo.findById.mockResolvedValue(null);

      await expect(
        answerService.submitAnswer({
          questionId: "Q_INVALID",
          userAnswer: {},
          sessionType: "learning",
          timeSpent: 30000,
        }),
      ).rejects.toThrow();
    });

    it("リポジトリエラーが適切に処理される", async () => {
      mockQuestionRepo.findById.mockRejectedValue(new Error("Database error"));

      await expect(
        answerService.submitAnswer({
          questionId: "Q_J_001",
          userAnswer: {},
          sessionType: "learning",
          timeSpent: 30000,
        }),
      ).rejects.toThrow("Database error");
    });
  });
});
