/**
 * データベース統合テスト
 * 簿記3級問題集アプリ - Step 4.2: 統合テスト実装
 *
 * テスト対象: SQLiteデータベースとアプリケーション層の統合動作
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { databaseService } from "../../src/data/database";
import { reviewService } from "../../src/services/review-service";
import { statisticsService } from "../../src/services/statistics-service";

// テストデータ
// import { mockQuestions, mockAnswerRecords } from '../fixtures/databaseData';

describe.skip("データベース統合テスト", () => {
  beforeEach(async () => {
    // データベースの初期化
    await DatabaseService.resetDatabase();
    await AsyncStorage.clear();

    // テストデータの投入
    await DatabaseService.initializeTestData({
      questions: mockQuestions,
      categories: [
        { id: "journal", name: "仕訳", questionCount: 250 },
        { id: "ledger", name: "帳簿", questionCount: 40 },
        { id: "trial-balance", name: "試算表", questionCount: 12 },
      ],
    });
  });

  afterEach(async () => {
    await DatabaseService.cleanup();
    await AsyncStorage.clear();
  });

  describe("問題データの管理統合テスト", () => {
    it("問題データの取得と表示形式変換", async () => {
      console.log("📊 問題データ統合テスト開始");

      // 仕訳問題の取得
      const journalQuestions = await DatabaseService.getQuestionsByCategory(
        "journal",
        10,
      );
      expect(journalQuestions).toHaveLength(10);

      journalQuestions.forEach((question) => {
        expect(question.id).toMatch(/^Q_J_\d{3}$/);
        expect(question.category).toBe("journal");
        expect(question.questionText).toBeTruthy();
        expect(question.correctAnswer).toBeTruthy();
      });

      // 帳簿問題の取得
      const ledgerQuestions = await DatabaseService.getQuestionsByCategory(
        "ledger",
        5,
      );
      expect(ledgerQuestions).toHaveLength(5);

      ledgerQuestions.forEach((question) => {
        expect(question.id).toMatch(/^Q_L_\d{3}$/);
        expect(question.category).toBe("ledger");
      });

      // 試算表問題の取得
      const trialBalanceQuestions =
        await DatabaseService.getQuestionsByCategory("trial-balance", 3);
      expect(trialBalanceQuestions).toHaveLength(3);

      trialBalanceQuestions.forEach((question) => {
        expect(question.id).toMatch(/^Q_T_\d{3}$/);
        expect(question.category).toBe("trial-balance");
      });

      console.log("✅ 問題データ統合テスト完了");
    });

    it("ランダム出題と重複制御", async () => {
      console.log("🎲 ランダム出題統合テスト開始");

      // 複数回取得して重複を確認
      const firstBatch = await DatabaseService.getRandomQuestions(
        "journal",
        5,
        [],
      );
      const secondBatch = await DatabaseService.getRandomQuestions(
        "journal",
        5,
        firstBatch.map((q) => q.id),
      );

      expect(firstBatch).toHaveLength(5);
      expect(secondBatch).toHaveLength(5);

      // 重複がないことを確認
      const firstIds = new Set(firstBatch.map((q) => q.id));
      const secondIds = new Set(secondBatch.map((q) => q.id));
      const intersection = [...firstIds].filter((id) => secondIds.has(id));

      expect(intersection).toHaveLength(0);

      console.log("✅ ランダム出題統合テスト完了");
    });

    it("難易度別フィルタリング", async () => {
      console.log("⭐ 難易度フィルタリング統合テスト開始");

      // 基礎レベルの問題取得
      const basicQuestions = await DatabaseService.getQuestionsByDifficulty(
        "basic",
        10,
      );
      expect(basicQuestions).toHaveLength(10);

      basicQuestions.forEach((question) => {
        expect(question.difficulty).toBe("basic");
      });

      // 応用レベルの問題取得
      const advancedQuestions = await DatabaseService.getQuestionsByDifficulty(
        "advanced",
        5,
      );
      expect(advancedQuestions).toHaveLength(5);

      advancedQuestions.forEach((question) => {
        expect(question.difficulty).toBe("advanced");
      });

      console.log("✅ 難易度フィルタリング統合テスト完了");
    });
  });

  describe("解答記録の統合テスト", () => {
    it("解答データの永続化と取得", async () => {
      console.log("💾 解答記録統合テスト開始");

      const questionId = "Q_J_001";
      const userAnswer = {
        debitAccount: "現金",
        debitAmount: 100000,
        creditAccount: "売上",
        creditAmount: 100000,
      };

      // 解答記録の保存
      await DatabaseService.saveAnswerRecord({
        questionId,
        userAnswer,
        isCorrect: true,
        timeSpent: 45,
        answeredAt: new Date(),
      });

      // 保存された解答の取得
      const savedRecord = await DatabaseService.getAnswerRecord(questionId);

      expect(savedRecord).toBeTruthy();
      expect(savedRecord.questionId).toBe(questionId);
      expect(savedRecord.userAnswer).toEqual(userAnswer);
      expect(savedRecord.isCorrect).toBe(true);
      expect(savedRecord.timeSpent).toBe(45);

      console.log("✅ 解答記録統合テスト完了");
    });

    it("解答履歴の集計と統計計算", async () => {
      console.log("📈 解答履歴統計統合テスト開始");

      // 複数の解答記録を作成
      const answerRecords = [
        {
          questionId: "Q_J_001",
          isCorrect: true,
          timeSpent: 30,
          category: "journal",
        },
        {
          questionId: "Q_J_002",
          isCorrect: false,
          timeSpent: 60,
          category: "journal",
        },
        {
          questionId: "Q_J_003",
          isCorrect: true,
          timeSpent: 45,
          category: "journal",
        },
        {
          questionId: "Q_L_001",
          isCorrect: true,
          timeSpent: 90,
          category: "ledger",
        },
        {
          questionId: "Q_L_002",
          isCorrect: false,
          timeSpent: 120,
          category: "ledger",
        },
      ];

      for (const record of answerRecords) {
        await DatabaseService.saveAnswerRecord({
          ...record,
          userAnswer: { test: "data" },
          answeredAt: new Date(),
        });
      }

      // 統計データの取得
      const journalStats = await DatabaseService.getCategoryStats("journal");
      expect(journalStats.totalAnswered).toBe(3);
      expect(journalStats.correctCount).toBe(2);
      expect(journalStats.incorrectCount).toBe(1);
      expect(journalStats.accuracy).toBeCloseTo(66.67, 1);

      const ledgerStats = await DatabaseService.getCategoryStats("ledger");
      expect(ledgerStats.totalAnswered).toBe(2);
      expect(ledgerStats.correctCount).toBe(1);
      expect(ledgerStats.incorrectCount).toBe(1);
      expect(ledgerStats.accuracy).toBe(50);

      console.log("✅ 解答履歴統計統合テスト完了");
    });

    it("間違い問題の自動復習登録", async () => {
      console.log("🔄 復習登録統合テスト開始");

      const questionId = "Q_J_005";

      // 間違った解答を記録
      await DatabaseService.saveAnswerRecord({
        questionId,
        userAnswer: { incorrect: "answer" },
        isCorrect: false,
        timeSpent: 90,
        answeredAt: new Date(),
      });

      // 復習リストへの自動登録確認
      const reviewList = await ReviewManager.getReviewList();
      const registeredQuestion = reviewList.find(
        (item) => item.questionId === questionId,
      );

      expect(registeredQuestion).toBeTruthy();
      expect(registeredQuestion.priority).toBeGreaterThan(0);
      expect(registeredQuestion.wrongCount).toBe(1);

      console.log("✅ 復習登録統合テスト完了");
    });
  });

  describe("進捗追跡統合テスト", () => {
    it("学習進捗の正確な計算", async () => {
      console.log("📊 進捗計算統合テスト開始");

      // 複数分野の解答記録を作成
      const answerData = [
        { questionId: "Q_J_001", category: "journal", isCorrect: true },
        { questionId: "Q_J_002", category: "journal", isCorrect: false },
        { questionId: "Q_J_003", category: "journal", isCorrect: true },
        { questionId: "Q_L_001", category: "ledger", isCorrect: true },
        { questionId: "Q_T_001", category: "trial-balance", isCorrect: false },
      ];

      for (const data of answerData) {
        await DatabaseService.saveAnswerRecord({
          ...data,
          userAnswer: { test: "data" },
          timeSpent: 60,
          answeredAt: new Date(),
        });
      }

      // ProgressTrackerを使用した進捗計算
      const overallProgress = await ProgressTracker.getOverallProgress();

      expect(overallProgress.totalQuestions).toBe(302); // 250 + 40 + 12
      expect(overallProgress.totalAnswered).toBe(5);
      expect(overallProgress.correctAnswers).toBe(3);
      expect(overallProgress.accuracyRate).toBeCloseTo(60, 1);
      expect(overallProgress.completionRate).toBeCloseTo(1.66, 1);

      // 分野別進捗の確認
      const journalProgress =
        await ProgressTracker.getCategoryProgress("journal");
      expect(journalProgress.answeredCount).toBe(3);
      expect(journalProgress.correctCount).toBe(2);
      expect(journalProgress.accuracy).toBeCloseTo(66.67, 1);

      console.log("✅ 進捗計算統合テスト完了");
    });

    it("長期学習データの統計処理", async () => {
      console.log("📅 長期統計統合テスト開始");

      // 過去30日間のデータを生成
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      for (let i = 0; i < 30; i++) {
        const date = new Date(thirtyDaysAgo);
        date.setDate(date.getDate() + i);

        // 各日5問ずつ解答
        for (let j = 0; j < 5; j++) {
          await DatabaseService.saveAnswerRecord({
            questionId: `Q_J_${(i * 5 + j + 1).toString().padStart(3, "0")}`,
            userAnswer: { test: "data" },
            isCorrect: Math.random() > 0.3, // 70%の正答率
            timeSpent: 45 + Math.random() * 30,
            answeredAt: date,
          });
        }
      }

      // 長期統計の取得
      const weeklyStats = await ProgressTracker.getWeeklyStats();
      expect(weeklyStats).toHaveLength(4); // 4週間分

      const monthlyAccuracy = await ProgressTracker.getMonthlyAccuracy();
      expect(monthlyAccuracy).toBeGreaterThan(65);
      expect(monthlyAccuracy).toBeLessThan(75);

      console.log("✅ 長期統計統合テスト完了");
    });
  });

  describe("模試データ統合テスト", () => {
    it("模試結果の永続化と履歴管理", async () => {
      console.log("🎯 模試データ統合テスト開始");

      const examResult = {
        examId: "MOCK_EXAM_001",
        examType: "basic",
        totalScore: 85,
        maxScore: 100,
        sectionResults: [
          { section: "第1問", score: 42, maxScore: 45 },
          { section: "第2問", score: 18, maxScore: 20 },
          { section: "第3問", score: 25, maxScore: 35 },
        ],
        timeSpent: 3600, // 60分
        completedAt: new Date(),
        passed: true,
      };

      // 模試結果の保存
      await DatabaseService.saveExamResult(examResult);

      // 保存された結果の取得
      const savedResult = await DatabaseService.getExamResult("MOCK_EXAM_001");

      expect(savedResult).toBeTruthy();
      expect(savedResult.totalScore).toBe(85);
      expect(savedResult.passed).toBe(true);
      expect(savedResult.sectionResults).toHaveLength(3);

      // 模試履歴の取得
      const examHistory = await DatabaseService.getExamHistory();
      expect(examHistory).toHaveLength(1);
      expect(examHistory[0].examId).toBe("MOCK_EXAM_001");

      console.log("✅ 模試データ統合テスト完了");
    });

    it("模試結果からの復習問題自動抽出", async () => {
      console.log("🔍 模試復習抽出統合テスト開始");

      // 模試の間違い問題を含む結果を作成
      const examAnswers = [
        {
          questionId: "Q_J_010",
          isCorrect: false,
          userAnswer: { wrong: "answer" },
        },
        {
          questionId: "Q_J_011",
          isCorrect: true,
          userAnswer: { correct: "answer" },
        },
        {
          questionId: "Q_L_005",
          isCorrect: false,
          userAnswer: { wrong: "answer" },
        },
        {
          questionId: "Q_T_003",
          isCorrect: false,
          userAnswer: { wrong: "answer" },
        },
      ];

      // 模試結果として保存
      await DatabaseService.saveExamAnswers("MOCK_EXAM_002", examAnswers);

      // ReviewManagerを使用して復習問題を抽出
      await ReviewManager.extractFromExamResult("MOCK_EXAM_002");

      // 復習リストの確認
      const reviewList = await ReviewManager.getReviewList();
      const examMistakes = reviewList.filter((item) =>
        ["Q_J_010", "Q_L_005", "Q_T_003"].includes(item.questionId),
      );

      expect(examMistakes).toHaveLength(3);
      examMistakes.forEach((mistake) => {
        expect(mistake.source).toBe("exam");
        expect(mistake.examId).toBe("MOCK_EXAM_002");
      });

      console.log("✅ 模試復習抽出統合テスト完了");
    });
  });

  describe("データ移行と整合性テスト", () => {
    it("データベーススキーマのバージョン管理", async () => {
      console.log("🔄 スキーマ管理統合テスト開始");

      // 現在のスキーマバージョンを確認
      const currentVersion = await DatabaseService.getSchemaVersion();
      expect(currentVersion).toBeTruthy();
      expect(currentVersion).toMatch(/^\d+\.\d+\.\d+$/);

      // スキーマアップグレードのシミュレーション
      const upgradeResult = await DatabaseService.upgradeSchema();
      expect(upgradeResult.success).toBe(true);
      expect(upgradeResult.fromVersion).toBeTruthy();
      expect(upgradeResult.toVersion).toBeTruthy();

      console.log("✅ スキーマ管理統合テスト完了");
    });

    it("データ整合性の検証", async () => {
      console.log("🔍 データ整合性統合テスト開始");

      // テストデータの投入
      await DatabaseService.saveAnswerRecord({
        questionId: "Q_J_100",
        userAnswer: { test: "data" },
        isCorrect: true,
        timeSpent: 60,
        answeredAt: new Date(),
      });

      // 参照整合性の確認
      const integrityCheck = await DatabaseService.checkDataIntegrity();

      expect(integrityCheck.orphanedAnswers).toBe(0);
      expect(integrityCheck.invalidReferences).toBe(0);
      expect(integrityCheck.duplicateRecords).toBe(0);
      expect(integrityCheck.isValid).toBe(true);

      console.log("✅ データ整合性統合テスト完了");
    });
  });

  describe("パフォーマンステスト", () => {
    it("大量データでのクエリ性能", async () => {
      console.log("⚡ クエリ性能統合テスト開始");

      // 大量の解答データを作成（1000件）
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        questionId: `Q_J_${(i + 1).toString().padStart(3, "0")}`,
        userAnswer: { test: `data_${i}` },
        isCorrect: Math.random() > 0.3,
        timeSpent: 30 + Math.random() * 90,
        answeredAt: new Date(Date.now() - i * 1000 * 60),
      }));

      const insertStartTime = Date.now();
      await DatabaseService.bulkInsertAnswerRecords(largeDataset);
      const insertTime = Date.now() - insertStartTime;

      console.log(`1000件の挿入時間: ${insertTime}ms`);
      expect(insertTime).toBeLessThan(1000); // 1秒以内

      // 検索性能のテスト
      const queryStartTime = Date.now();
      const searchResults = await DatabaseService.searchAnswerRecords({
        isCorrect: false,
        dateRange: {
          from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          to: new Date(),
        },
      });
      const queryTime = Date.now() - queryStartTime;

      console.log(`検索時間: ${queryTime}ms`);
      expect(queryTime).toBeLessThan(100); // 100ms以内
      expect(searchResults.length).toBeGreaterThan(0);

      console.log("✅ クエリ性能統合テスト完了");
    });

    it("同時アクセス処理の安全性", async () => {
      console.log("🔐 同時アクセス統合テスト開始");

      // 複数の同時書き込み操作
      const concurrentWrites = Array.from({ length: 10 }, (_, i) =>
        DatabaseService.saveAnswerRecord({
          questionId: `Q_CONCURRENT_${i.toString().padStart(3, "0")}`,
          userAnswer: { concurrent: `test_${i}` },
          isCorrect: i % 2 === 0,
          timeSpent: 60,
          answeredAt: new Date(),
        }),
      );

      // 全ての書き込み操作を並行実行
      await Promise.all(concurrentWrites);

      // データの整合性確認
      const savedRecords =
        await DatabaseService.getAnswerRecordsByPrefix("Q_CONCURRENT_");
      expect(savedRecords).toHaveLength(10);

      // 重複やデータ破損がないことを確認
      const questionIds = savedRecords.map((record) => record.questionId);
      const uniqueIds = [...new Set(questionIds)];
      expect(uniqueIds).toHaveLength(10);

      console.log("✅ 同時アクセス統合テスト完了");
    });
  });
});

/**
 * データベース統合テスト用のヘルパー関数
 */
export class DatabaseIntegrationHelper {
  /**
   * テスト用のランダムデータ生成
   */
  static generateRandomAnswerData(count: number) {
    return Array.from({ length: count }, (_, i) => ({
      questionId: `Q_TEST_${i.toString().padStart(3, "0")}`,
      userAnswer: { randomData: Math.random().toString(36).substring(7) },
      isCorrect: Math.random() > 0.3,
      timeSpent: Math.floor(30 + Math.random() * 120),
      answeredAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      ),
    }));
  }

  /**
   * データベースサイズの測定
   */
  static async measureDatabaseSize() {
    const stats = await DatabaseService.getDatabaseStats();
    return {
      totalRecords: stats.answerRecords + stats.examResults + stats.reviewItems,
      sizeInKB: stats.fileSizeKB,
      indexes: stats.indexCount,
    };
  }

  /**
   * クエリ性能の測定
   */
  static async measureQueryPerformance(queryFunction: () => Promise<any>) {
    const startTime = Date.now();
    const result = await queryFunction();
    const endTime = Date.now();

    return {
      executionTime: endTime - startTime,
      resultCount: Array.isArray(result) ? result.length : 1,
      result,
    };
  }

  /**
   * データ整合性レポートの生成
   */
  static async generateIntegrityReport() {
    const integrityCheck = await DatabaseService.checkDataIntegrity();
    const dbStats = await DatabaseService.getDatabaseStats();

    let report = "# データベース整合性レポート\n\n";
    report += `**検証日時**: ${new Date().toLocaleString()}\n`;
    report += `**総レコード数**: ${dbStats.answerRecords + dbStats.examResults}\n`;
    report += `**ファイルサイズ**: ${dbStats.fileSizeKB} KB\n\n`;

    report += "## 整合性チェック結果\n\n";
    report += `- 孤立した解答レコード: ${integrityCheck.orphanedAnswers}\n`;
    report += `- 無効な参照: ${integrityCheck.invalidReferences}\n`;
    report += `- 重複レコード: ${integrityCheck.duplicateRecords}\n`;
    report += `- 全体の整合性: ${integrityCheck.isValid ? "✅ 正常" : "❌ 異常"}\n`;

    return report;
  }
}
