/**
 * 問題Repository単体テスト
 * 簿記3級問題集アプリ - 問題データ管理テスト
 */

import { QuestionRepository } from "../../../src/data/repositories/question-repository";
import { Question, QuestionCategory } from "../../../src/types/models";

// データベースサービスのモック
jest.mock("../../../src/data/database", () => ({
  databaseService: {
    executeSql: jest.fn(),
    initialize: jest.fn(),
    isConnected: jest.fn(() => true),
  },
}));

describe("QuestionRepository", () => {
  let questionRepository: QuestionRepository;
  let mockExecuteSql: jest.Mock;

  beforeEach(() => {
    questionRepository = new QuestionRepository();

    // データベースサービスのモック取得
    const { databaseService } = require("../../../src/data/database");
    mockExecuteSql = databaseService.executeSql;

    // モックをリセット
    jest.clearAllMocks();
  });

  // テスト用のサンプルデータ
  const sampleQuestions: Question[] = [
    {
      id: "Q_J_001",
      category_id: "journal",
      question_text: "現金100,000円で商品を仕入れた",
      answer_template_json: JSON.stringify({
        type: "journal_entry",
        fields: [
          {
            label: "借方勘定科目",
            type: "dropdown",
            name: "debit_account",
            required: true,
          },
          {
            label: "借方金額",
            type: "number",
            name: "debit_amount",
            required: true,
          },
        ],
      }),
      correct_answer_json: JSON.stringify({
        debit_account: "仕入",
        debit_amount: 100000,
        credit_account: "現金",
        credit_amount: 100000,
      }),
      explanation: "商品の仕入れは仕入勘定の借方に記録します",
      difficulty: 1,
      section_number: 1,
      question_order: 1,
      tags_json: JSON.stringify(["基本", "仕入"]),
      created_at: "2025-01-27T10:00:00Z",
      updated_at: "2025-01-27T10:00:00Z",
    },
    {
      id: "Q_L_001",
      category_id: "ledger",
      question_text: "現金出納帳に記入しなさい",
      answer_template_json: JSON.stringify({
        type: "ledger_entry",
        fields: [
          {
            label: "摘要",
            type: "dropdown",
            name: "description",
            required: true,
          },
          { label: "入金", type: "number", name: "credit", required: false },
        ],
      }),
      correct_answer_json: JSON.stringify({
        description: "商品売上",
        credit: 50000,
      }),
      explanation: "現金の増加は入金欄に記録します",
      difficulty: 2,
      section_number: 2,
      question_order: 1,
      tags_json: JSON.stringify(["帳簿", "現金出納帳"]),
      created_at: "2025-01-27T10:00:00Z",
      updated_at: "2025-01-27T10:00:00Z",
    },
  ];

  describe("基本的なCRUD操作", () => {
    test("findById()が指定されたIDの問題を返す", async () => {
      // モックの設定
      mockExecuteSql.mockResolvedValue({
        rows: [sampleQuestions[0]],
        rowsAffected: 1,
      });

      const result = await questionRepository.findById("Q_J_001");

      expect(result).toEqual(sampleQuestions[0]);
      expect(mockExecuteSql).toHaveBeenCalledWith(
        "SELECT * FROM questions WHERE id = ? LIMIT 1",
        ["Q_J_001"],
      );
    });

    test("findById()で存在しないIDの場合はnullを返す", async () => {
      mockExecuteSql.mockResolvedValue({
        rows: [],
        rowsAffected: 0,
      });

      const result = await questionRepository.findById("NON_EXISTENT");

      expect(result).toBeNull();
    });

    test("findAll()が全ての問題を返す", async () => {
      mockExecuteSql.mockResolvedValue({
        rows: sampleQuestions,
        rowsAffected: 2,
      });

      const result = await questionRepository.findAll();

      expect(result).toEqual(sampleQuestions);
      expect(result).toHaveLength(2);
    });
  });

  describe("カテゴリ別検索（新コンテンツ構成対応）", () => {
    test("findByCategory()が指定されたカテゴリの問題を返す", async () => {
      const journalQuestions = [sampleQuestions[0]];
      mockExecuteSql.mockResolvedValue({
        rows: journalQuestions,
        rowsAffected: 1,
      });

      const result = await questionRepository.findByCategory("journal");

      expect(result).toEqual(journalQuestions);
      expect(mockExecuteSql).toHaveBeenCalledWith(
        "SELECT * FROM questions WHERE category_id = ? ORDER BY difficulty ASC, id ASC",
        ["journal"],
      );
    });

    test("findByCategory()で難易度フィルターが適用される", async () => {
      mockExecuteSql.mockResolvedValue({
        rows: [sampleQuestions[0]],
        rowsAffected: 1,
      });

      await questionRepository.findByCategory("journal", {
        difficulty: 1,
        limit: 10,
      });

      expect(mockExecuteSql).toHaveBeenCalledWith(
        "SELECT * FROM questions WHERE category_id = ? AND difficulty = ? ORDER BY difficulty ASC, id ASC LIMIT ?",
        ["journal", 1, 10],
      );
    });

    test("findByCategory()で除外IDが適用される", async () => {
      mockExecuteSql.mockResolvedValue({
        rows: [],
        rowsAffected: 0,
      });

      await questionRepository.findByCategory("journal", {
        excludeIds: ["Q_J_001", "Q_J_002"],
      });

      expect(mockExecuteSql).toHaveBeenCalledWith(
        "SELECT * FROM questions WHERE category_id = ? AND id NOT IN (?, ?) ORDER BY difficulty ASC, id ASC",
        ["journal", "Q_J_001", "Q_J_002"],
      );
    });

    test("findByCategory()でランダム化が適用される", async () => {
      mockExecuteSql.mockResolvedValue({
        rows: sampleQuestions,
        rowsAffected: 2,
      });

      await questionRepository.findByCategory("journal", {
        randomize: true,
      });

      expect(mockExecuteSql).toHaveBeenCalledWith(
        "SELECT * FROM questions WHERE category_id = ? ORDER BY RANDOM()",
        ["journal"],
      );
    });
  });

  describe("学習状況による検索", () => {
    test("findUnstudiedQuestions()が未学習問題を返す", async () => {
      mockExecuteSql.mockResolvedValue({
        rows: sampleQuestions,
        rowsAffected: 2,
      });

      const result = await questionRepository.findUnstudiedQuestions(
        "journal",
        5,
      );

      expect(result).toEqual(sampleQuestions);
      expect(mockExecuteSql).toHaveBeenCalledWith(
        expect.stringContaining("LEFT JOIN learning_history"),
        ["journal", 5],
      );
    });

    test("findReviewQuestions()が復習対象問題を優先度順で返す", async () => {
      const reviewQuestions = sampleQuestions.map((q) => ({
        ...q,
        priority_score: 100,
        incorrect_count: 2,
        status: "needs_review",
      }));

      mockExecuteSql.mockResolvedValue({
        rows: reviewQuestions,
        rowsAffected: 2,
      });

      const result = await questionRepository.findReviewQuestions(
        "journal",
        10,
      );

      expect(result).toEqual(reviewQuestions);
      expect(mockExecuteSql).toHaveBeenCalledWith(
        expect.stringContaining("INNER JOIN review_items"),
        ["journal", 10],
      );
    });
  });

  describe("模試用機能", () => {
    test("findByIds()が指定されたIDリストの問題を返す", async () => {
      mockExecuteSql.mockResolvedValue({
        rows: sampleQuestions,
        rowsAffected: 2,
      });

      const questionIds = ["Q_J_001", "Q_L_001"];
      const result = await questionRepository.findByIds(questionIds);

      expect(result).toEqual(sampleQuestions);
      expect(mockExecuteSql).toHaveBeenCalledWith(
        "SELECT * FROM questions WHERE id IN (?, ?) ORDER BY id",
        questionIds,
      );
    });

    test("findByIds()で空配列を渡した場合は空配列を返す", async () => {
      const result = await questionRepository.findByIds([]);

      expect(result).toEqual([]);
      expect(mockExecuteSql).not.toHaveBeenCalled();
    });
  });

  describe("タグ検索", () => {
    test("findByTag()が指定されたタグの問題を返す", async () => {
      mockExecuteSql.mockResolvedValue({
        rows: [sampleQuestions[0]],
        rowsAffected: 1,
      });

      const result = await questionRepository.findByTag("基本", "journal", 10);

      expect(result).toEqual([sampleQuestions[0]]);
      expect(mockExecuteSql).toHaveBeenCalledWith(
        expect.stringContaining("json_extract(tags_json"),
        ['%"基本"%', "journal", 10],
      );
    });
  });

  describe("統計情報（新コンテンツ構成対応）", () => {
    test("getStats()が問題統計情報を返す", async () => {
      // 全問題数
      mockExecuteSql
        .mockResolvedValueOnce({
          rows: [{ count: 302 }],
          rowsAffected: 1,
        })
        // カテゴリ別集計
        .mockResolvedValueOnce({
          rows: [
            { category_id: "journal", count: 250 },
            { category_id: "ledger", count: 40 },
            { category_id: "trial_balance", count: 12 },
          ],
          rowsAffected: 3,
        })
        // 難易度別集計
        .mockResolvedValueOnce({
          rows: [
            { difficulty: 1, count: 100 },
            { difficulty: 2, count: 102 },
            { difficulty: 3, count: 100 },
          ],
          rowsAffected: 3,
        })
        // 平均難易度
        .mockResolvedValueOnce({
          rows: [{ avg_difficulty: 2.01 }],
          rowsAffected: 1,
        });

      const stats = await questionRepository.getStats();

      expect(stats.totalQuestions).toBe(302);
      expect(stats.categoryBreakdown.journal).toBe(250);
      expect(stats.categoryBreakdown.ledger).toBe(40);
      expect(stats.categoryBreakdown.trial_balance).toBe(12);
      expect(stats.averageDifficulty).toBe(2.01);
    });
  });

  describe("コンテンツ構成検証", () => {
    test("validateContentStructure()が正常な構成を検証する", async () => {
      // 統計情報のモック
      mockExecuteSql
        .mockResolvedValueOnce({
          rows: [{ count: 302 }],
          rowsAffected: 1,
        })
        .mockResolvedValueOnce({
          rows: [
            { category_id: "journal", count: 250 },
            { category_id: "ledger", count: 40 },
            { category_id: "trial_balance", count: 12 },
          ],
          rowsAffected: 3,
        })
        .mockResolvedValueOnce({
          rows: [
            { difficulty: 1, count: 100 },
            { difficulty: 2, count: 102 },
            { difficulty: 3, count: 100 },
          ],
          rowsAffected: 3,
        })
        .mockResolvedValueOnce({
          rows: [{ avg_difficulty: 2.01 }],
          rowsAffected: 1,
        })
        // ID形式検証
        .mockResolvedValueOnce({
          rows: [
            { id: "Q_J_001", category_id: "journal" },
            { id: "Q_L_001", category_id: "ledger" },
            { id: "Q_T_001", category_id: "trial_balance" },
          ],
          rowsAffected: 3,
        });

      const validation = await questionRepository.validateContentStructure();

      expect(validation.isValid).toBe(true);
      expect(validation.issues).toHaveLength(0);
      expect(validation.expectedCounts.journal).toBe(250);
      expect(validation.expectedCounts.ledger).toBe(40);
      expect(validation.expectedCounts.trial_balance).toBe(12);
    });

    test("validateContentStructure()が不正な構成を検出する", async () => {
      // 不正な問題数の統計情報
      mockExecuteSql
        .mockResolvedValueOnce({
          rows: [{ count: 280 }],
          rowsAffected: 1,
        })
        .mockResolvedValueOnce({
          rows: [
            { category_id: "journal", count: 240 }, // 250問あるべき
            { category_id: "ledger", count: 30 }, // 40問あるべき
            { category_id: "trial_balance", count: 10 }, // 12問あるべき
          ],
          rowsAffected: 3,
        })
        // 以下は省略...
        .mockResolvedValueOnce({
          rows: [],
          rowsAffected: 0,
        })
        .mockResolvedValueOnce({
          rows: [{ avg_difficulty: 2.0 }],
          rowsAffected: 1,
        })
        .mockResolvedValueOnce({
          rows: [
            { id: "INVALID_001", category_id: "journal" }, // 不正なID形式
          ],
          rowsAffected: 1,
        });

      const validation = await questionRepository.validateContentStructure();

      expect(validation.isValid).toBe(false);
      expect(validation.issues.length).toBeGreaterThan(0);
      expect(validation.issues.some((issue) => issue.includes("journal"))).toBe(
        true,
      );
    });
  });

  describe("CBT解答テンプレート検証", () => {
    test("validateAnswerTemplates()が有効なテンプレートを検証する", async () => {
      mockExecuteSql.mockResolvedValue({
        rows: sampleQuestions,
        rowsAffected: 2,
      });

      const validation = await questionRepository.validateAnswerTemplates();

      expect(validation.validCount).toBe(2);
      expect(validation.invalidCount).toBe(0);
      expect(validation.errors).toHaveLength(0);
    });

    test("validateAnswerTemplates()が無効なテンプレートを検出する", async () => {
      const invalidQuestions: Question[] = [
        {
          ...sampleQuestions[0],
          answer_template_json: "INVALID JSON",
        },
        {
          ...sampleQuestions[1],
          answer_template_json: JSON.stringify({
            type: "invalid_type", // 不正なタイプ
            fields: [],
          }),
        },
      ];

      mockExecuteSql.mockResolvedValue({
        rows: invalidQuestions,
        rowsAffected: 2,
      });

      const validation = await questionRepository.validateAnswerTemplates();

      expect(validation.validCount).toBe(0);
      expect(validation.invalidCount).toBe(2);
      expect(validation.errors).toHaveLength(2);
    });
  });

  describe("エラーハンドリング", () => {
    test("データベースエラーが適切にハンドリングされる", async () => {
      mockExecuteSql.mockRejectedValue(new Error("Database connection failed"));

      await expect(questionRepository.findById("Q_J_001")).rejects.toThrow();
    });

    test("SQL実行エラーが適切にログ出力される", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      mockExecuteSql.mockRejectedValue(new Error("SQL syntax error"));

      try {
        await questionRepository.findByCategory("journal");
      } catch (error) {
        // エラーが投げられることを確認
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("[QuestionRepository] findByCategory エラー:"),
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });
});
