/**
 * セキュリティテスト
 * 簿記3級問題集アプリ - Step 4.2: セキュリティテスト実装
 *
 * テスト対象: アプリケーションのセキュリティ要件と脆弱性対策
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import DatabaseService from "../../src/services/DatabaseService";
import SecurityValidator from "../../src/security/SecurityValidator";
import DataEncryption from "../../src/security/DataEncryption";
import InputSanitizer from "../../src/security/InputSanitizer";

// セキュリティテスト用のモック
import { maliciousInputs, securityTestCases } from "../fixtures/securityData";

describe.skip("セキュリティテスト", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    await DatabaseService.resetDatabase();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await AsyncStorage.clear();
    await DatabaseService.cleanup();
  });

  describe("入力値検証セキュリティ", () => {
    it("SQLインジェクション攻撃の防御", async () => {
      console.log("🛡️ SQLインジェクション防御テスト開始");

      const maliciousSqlInputs = [
        "'; DROP TABLE questions; --",
        "1' OR '1'='1",
        "admin'/*",
        "1; INSERT INTO questions VALUES ('malicious'); --",
        "UNION SELECT * FROM sqlite_master --",
      ];

      for (const maliciousInput of maliciousSqlInputs) {
        // 悪意のある入力をクエリパラメータとして使用
        const result = await DatabaseService.searchQuestions(maliciousInput);

        // クエリが正常に処理され、SQLインジェクションが発生しないことを確認
        expect(result).toBeTruthy();
        expect(Array.isArray(result)).toBe(true);

        // データベースの整合性が保たれていることを確認
        const integrityCheck = await DatabaseService.checkDataIntegrity();
        expect(integrityCheck.isValid).toBe(true);
      }

      console.log("✅ SQLインジェクション防御テスト完了");
    });

    it("XSS攻撃の防御", async () => {
      console.log("🛡️ XSS攻撃防御テスト開始");

      const xssPayloads = [
        "<script>alert('XSS')</script>",
        "javascript:alert('XSS')",
        "<img src=x onerror=alert('XSS')>",
        "&#60;script&#62;alert('XSS')&#60;/script&#62;",
        "<svg onload=alert('XSS')>",
      ];

      for (const payload of xssPayloads) {
        // 入力値のサニタイズをテスト
        const sanitizedInput = InputSanitizer.sanitizeInput(payload);

        // 危険なタグやスクリプトが除去されていることを確認
        expect(sanitizedInput).not.toContain("<script>");
        expect(sanitizedInput).not.toContain("javascript:");
        expect(sanitizedInput).not.toContain("onerror=");
        expect(sanitizedInput).not.toContain("onload=");

        // サニタイズされた値でデータベース操作を実行
        const result = await DatabaseService.saveUserInput({
          type: "answer",
          content: sanitizedInput,
          timestamp: new Date(),
        });

        expect(result.success).toBe(true);
      }

      console.log("✅ XSS攻撃防御テスト完了");
    });

    it("入力値長制限の検証", async () => {
      console.log("📏 入力値長制限テスト開始");

      // 異常に長い入力値のテスト
      const longInput = "A".repeat(10000);
      const veryLongInput = "B".repeat(100000);

      // 解答入力の長さ制限
      const answerValidation = SecurityValidator.validateAnswerInput({
        debitAccount: longInput,
        debitAmount: 999999999999,
        creditAccount: "C".repeat(1000),
        creditAmount: -1,
      });

      expect(answerValidation.isValid).toBe(false);
      expect(answerValidation.errors).toContain("入力値が長すぎます");
      expect(answerValidation.errors).toContain("金額が範囲外です");

      // 通常の入力値は許可されることを確認
      const validAnswerValidation = SecurityValidator.validateAnswerInput({
        debitAccount: "現金",
        debitAmount: 100000,
        creditAccount: "売上",
        creditAmount: 100000,
      });

      expect(validAnswerValidation.isValid).toBe(true);
      expect(validAnswerValidation.errors).toHaveLength(0);

      console.log("✅ 入力値長制限テスト完了");
    });

    it("数値入力の範囲検証", async () => {
      console.log("🔢 数値範囲検証テスト開始");

      const invalidAmounts = [
        -1,
        0,
        999999999999999,
        Infinity,
        -Infinity,
        NaN,
        "not_a_number",
        "1.23456789", // 小数点以下桁数超過
      ];

      for (const amount of invalidAmounts) {
        const validation = SecurityValidator.validateAmount(amount);
        expect(validation.isValid).toBe(false);

        if (typeof amount === "number" && amount < 0) {
          expect(validation.errors).toContain(
            "金額は正の値である必要があります",
          );
        }
        if (typeof amount === "number" && amount > 99999999) {
          expect(validation.errors).toContain("金額が上限を超えています");
        }
        if (typeof amount !== "number" || isNaN(amount)) {
          expect(validation.errors).toContain("有効な数値を入力してください");
        }
      }

      // 有効な金額は許可されることを確認
      const validAmounts = [1, 100, 1000, 99999999];

      for (const amount of validAmounts) {
        const validation = SecurityValidator.validateAmount(amount);
        expect(validation.isValid).toBe(true);
        expect(validation.errors).toHaveLength(0);
      }

      console.log("✅ 数値範囲検証テスト完了");
    });
  });

  describe("データ保護セキュリティ", () => {
    it("機密データの暗号化", async () => {
      console.log("🔐 データ暗号化テスト開始");

      const sensitiveData = {
        userId: "test_user_001",
        progressData: {
          totalAnswered: 150,
          correctAnswers: 120,
          studyTime: 7200,
        },
        examResults: [
          { examId: "EXAM_001", score: 85 },
          { examId: "EXAM_002", score: 92 },
        ],
      };

      // データの暗号化
      const encryptedData = await DataEncryption.encrypt(
        JSON.stringify(sensitiveData),
      );

      expect(encryptedData).toBeTruthy();
      expect(encryptedData).not.toEqual(JSON.stringify(sensitiveData));
      expect(encryptedData.includes("test_user_001")).toBe(false);

      // 暗号化されたデータの保存
      await AsyncStorage.setItem("user_progress", encryptedData);

      // データの復号化
      const storedEncryptedData = await AsyncStorage.getItem("user_progress");
      const decryptedData = await DataEncryption.decrypt(storedEncryptedData);
      const parsedData = JSON.parse(decryptedData);

      expect(parsedData).toEqual(sensitiveData);
      expect(parsedData.userId).toBe("test_user_001");
      expect(parsedData.progressData.totalAnswered).toBe(150);

      console.log("✅ データ暗号化テスト完了");
    });

    it("ローカルストレージの安全性", async () => {
      console.log("💾 ローカルストレージ安全性テスト開始");

      // 重要データのダイレクトアクセス防止
      const sensitiveKeys = [
        "user_progress",
        "exam_results",
        "answer_history",
        "encryption_key",
      ];

      for (const key of sensitiveKeys) {
        const testData = `sensitive_${key}_data`;

        // データ保存時の暗号化確認
        await DatabaseService.secureStorageSet(key, testData);

        // AsyncStorageから直接取得した値が暗号化されていることを確認
        const rawValue = await AsyncStorage.getItem(key);
        expect(rawValue).not.toBe(testData);
        expect(rawValue).toBeTruthy();

        // 正しい方法での取得は成功することを確認
        const decryptedValue = await DatabaseService.secureStorageGet(key);
        expect(decryptedValue).toBe(testData);
      }

      console.log("✅ ローカルストレージ安全性テスト完了");
    });

    it("データベースファイルの保護", async () => {
      console.log("🗄️ データベースファイル保護テスト開始");

      // データベースの暗号化設定確認
      const dbConfig = await DatabaseService.getDatabaseConfig();
      expect(dbConfig.encryption).toBe(true);
      expect(dbConfig.filePermissions).toBe("private");

      // ファイルアクセス権限の確認
      const filePermissions = await DatabaseService.checkFilePermissions();
      expect(filePermissions.readable).toBe(true);
      expect(filePermissions.writable).toBe(true);
      expect(filePermissions.executable).toBe(false);
      expect(filePermissions.otherAccess).toBe(false);

      // データベースの整合性検証
      const integrityCheck = await DatabaseService.verifyDatabaseIntegrity();
      expect(integrityCheck.isValid).toBe(true);
      expect(integrityCheck.corruptedTables).toHaveLength(0);

      console.log("✅ データベースファイル保護テスト完了");
    });
  });

  describe("アプリケーションセキュリティ", () => {
    it("デバッグ情報の漏洩防止", async () => {
      console.log("🔍 デバッグ情報漏洩防止テスト開始");

      // 本番環境でのデバッグ無効化確認
      const isDebugMode = __DEV__;
      const buildConfig = await SecurityValidator.getBuildConfiguration();

      if (buildConfig.environment === "production") {
        expect(buildConfig.debugEnabled).toBe(false);
        expect(buildConfig.loggingLevel).toBe("error");
        expect(buildConfig.consoleOutputEnabled).toBe(false);
      }

      // エラーメッセージの適切な処理
      try {
        await DatabaseService.executeQuery("INVALID SQL QUERY");
      } catch (error) {
        const errorMessage = error.message;

        // 内部的な詳細情報が漏洩していないことを確認
        expect(errorMessage).not.toContain("sqlite3");
        expect(errorMessage).not.toContain("file path");
        expect(errorMessage).not.toContain("stack trace");
        expect(errorMessage).toContain("操作が失敗しました");
      }

      console.log("✅ デバッグ情報漏洩防止テスト完了");
    });

    it("セッション管理のセキュリティ", async () => {
      console.log("🔑 セッション管理セキュリティテスト開始");

      // アプリ起動時のセッション初期化
      await DatabaseService.initializeSession();

      const sessionData = await DatabaseService.getSessionData();
      expect(sessionData.sessionId).toBeTruthy();
      expect(sessionData.startTime).toBeTruthy();
      expect(sessionData.isValid).toBe(true);

      // セッションタイムアウトのテスト
      const expiredSessionData = {
        sessionId: "expired_session",
        startTime: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25時間前
        lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24時間前
      };

      const isValidSession =
        SecurityValidator.validateSession(expiredSessionData);
      expect(isValidSession).toBe(false);

      // アクティブセッションの検証
      const activeSessionData = {
        sessionId: "active_session",
        startTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1時間前
        lastActivity: new Date(Date.now() - 5 * 60 * 1000), // 5分前
      };

      const isActiveSession =
        SecurityValidator.validateSession(activeSessionData);
      expect(isActiveSession).toBe(true);

      console.log("✅ セッション管理セキュリティテスト完了");
    });

    it("リソースアクセス制御", async () => {
      console.log("🚫 リソースアクセス制御テスト開始");

      // 不正なファイルアクセスの防止
      const prohibitedPaths = [
        "../../../etc/passwd",
        "/system/build.prop",
        "../database.db",
        "..\\..\\windows\\system32\\",
        "file:///etc/hosts",
      ];

      for (const path of prohibitedPaths) {
        const accessResult = await SecurityValidator.validateFileAccess(path);
        expect(accessResult.allowed).toBe(false);
        expect(accessResult.reason).toBe("Unauthorized path access");
      }

      // 正当なリソースアクセスは許可されることを確認
      const allowedPaths = [
        "questions/journal/Q_J_001.json",
        "assets/images/logo.png",
        "data/progress.json",
      ];

      for (const path of allowedPaths) {
        const accessResult = await SecurityValidator.validateFileAccess(path);
        expect(accessResult.allowed).toBe(true);
      }

      console.log("✅ リソースアクセス制御テスト完了");
    });

    it("APIエンドポイントのセキュリティ", async () => {
      console.log("🌐 APIセキュリティテスト開始");

      // レート制限のテスト
      const apiCalls = Array.from({ length: 100 }, (_, i) =>
        DatabaseService.getQuestionsByCategory("journal", 1),
      );

      const startTime = Date.now();
      const results = await Promise.allSettled(apiCalls);
      const endTime = Date.now();

      // レート制限が機能していることを確認
      const rejectedCalls = results.filter(
        (result) => result.status === "rejected",
      );
      expect(rejectedCalls.length).toBeGreaterThan(0);

      // レスポンス時間の制御
      const avgResponseTime = (endTime - startTime) / 100;
      expect(avgResponseTime).toBeGreaterThan(10); // 最低限の遅延

      console.log("✅ APIセキュリティテスト完了");
    });
  });

  describe("データプライバシー保護", () => {
    it("個人情報の非収集確認", async () => {
      console.log("👤 個人情報非収集テスト開始");

      // アプリが収集するデータの種類を確認
      const collectedData = await DatabaseService.getCollectedDataTypes();

      // 個人を特定できる情報が含まれていないことを確認
      const prohibitedDataTypes = [
        "email",
        "phone",
        "name",
        "address",
        "deviceId",
        "advertisingId",
        "location",
      ];

      for (const dataType of prohibitedDataTypes) {
        expect(collectedData).not.toContain(dataType);
      }

      // 収集が許可されている学習データのみが含まれることを確認
      const allowedDataTypes = [
        "questionAnswers",
        "studyProgress",
        "examResults",
        "appUsageTime",
      ];

      for (const dataType of allowedDataTypes) {
        expect(collectedData).toContain(dataType);
      }

      console.log("✅ 個人情報非収集テスト完了");
    });

    it("データの完全削除機能", async () => {
      console.log("🗑️ データ削除機能テスト開始");

      // テストデータの作成
      await DatabaseService.saveAnswerRecord({
        questionId: "Q_DELETE_TEST_001",
        userAnswer: { test: "data" },
        isCorrect: true,
        timeSpent: 60,
        answeredAt: new Date(),
      });

      await DatabaseService.saveExamResult({
        examId: "EXAM_DELETE_TEST",
        totalScore: 80,
        completedAt: new Date(),
      });

      // データが保存されていることを確認
      const beforeDeletion = await DatabaseService.getUserDataSummary();
      expect(beforeDeletion.answerRecords).toBeGreaterThan(0);
      expect(beforeDeletion.examResults).toBeGreaterThan(0);

      // 完全削除の実行
      const deletionResult = await DatabaseService.deleteAllUserData();
      expect(deletionResult.success).toBe(true);
      expect(deletionResult.deletedRecords).toBeGreaterThan(0);

      // データが完全に削除されたことを確認
      const afterDeletion = await DatabaseService.getUserDataSummary();
      expect(afterDeletion.answerRecords).toBe(0);
      expect(afterDeletion.examResults).toBe(0);

      // 削除ログの確認（復旧不可能であることの確認）
      const deletionLog = await DatabaseService.getDeletionLog();
      expect(deletionLog.irreversible).toBe(true);
      expect(deletionLog.timestamp).toBeTruthy();

      console.log("✅ データ削除機能テスト完了");
    });

    it("外部通信の遮断確認", async () => {
      console.log("🚫 外部通信遮断テスト開始");

      // ネットワーク通信の監視
      const networkMonitor = SecurityValidator.createNetworkMonitor();

      // アプリの通常操作を実行
      await DatabaseService.getQuestionsByCategory("journal", 5);
      await DatabaseService.saveAnswerRecord({
        questionId: "Q_NETWORK_TEST",
        userAnswer: { test: "data" },
        isCorrect: true,
        timeSpent: 60,
        answeredAt: new Date(),
      });

      const networkActivity = await networkMonitor.getActivity();

      // 外部への通信が発生していないことを確認
      expect(networkActivity.outboundRequests).toHaveLength(0);
      expect(networkActivity.dnsQueries).toHaveLength(0);
      expect(networkActivity.tcpConnections).toHaveLength(0);

      console.log("✅ 外部通信遮断テスト完了");
    });
  });

  describe("コード整合性とセキュリティ", () => {
    it("静的コード解析による脆弱性検出", async () => {
      console.log("🔍 静的解析セキュリティテスト開始");

      // セキュリティ関連のコードパターンをチェック
      const securityAnalysis = await SecurityValidator.analyzeCodeSecurity();

      // 危険なパターンが存在しないことを確認
      expect(securityAnalysis.sqlInjectionVulnerabilities).toHaveLength(0);
      expect(securityAnalysis.hardcodedSecrets).toHaveLength(0);
      expect(securityAnalysis.unsafeEvalUsage).toHaveLength(0);
      expect(securityAnalysis.insecureRandomUsage).toHaveLength(0);

      // セキュリティベストプラクティスの遵守確認
      expect(securityAnalysis.inputValidationCoverage).toBeGreaterThan(90);
      expect(securityAnalysis.errorHandlingCoverage).toBeGreaterThan(85);
      expect(securityAnalysis.encryptionUsage).toBe(true);

      console.log("✅ 静的解析セキュリティテスト完了");
    });

    it("依存関係のセキュリティ監査", async () => {
      console.log("📦 依存関係セキュリティ監査開始");

      const dependencyAudit = await SecurityValidator.auditDependencies();

      // 既知の脆弱性がないことを確認
      expect(dependencyAudit.criticalVulnerabilities).toHaveLength(0);
      expect(dependencyAudit.highSeverityVulnerabilities).toHaveLength(0);

      // 古いバージョンの警告確認
      const outdatedPackages = dependencyAudit.outdatedPackages.filter(
        (pkg) => pkg.severityLevel === "medium" || pkg.severityLevel === "high",
      );
      expect(outdatedPackages.length).toBeLessThan(5);

      // ライセンスの適合性確認
      expect(dependencyAudit.licenseCompliance).toBe(true);
      expect(dependencyAudit.unauthorizedLicenses).toHaveLength(0);

      console.log("✅ 依存関係セキュリティ監査完了");
    });
  });
});

/**
 * セキュリティテスト用のヘルパー関数
 */
export class SecurityTestHelper {
  /**
   * セキュリティ脆弱性のシミュレーション
   */
  static generateSecurityTestCases() {
    return {
      sqlInjection: [
        "'; DROP TABLE users; --",
        "1' OR '1'='1' --",
        "admin'/**/OR/**/1=1#",
      ],
      xss: [
        "<script>alert('XSS')</script>",
        "javascript:alert('XSS')",
        "<img src=x onerror=alert('XSS')>",
      ],
      pathTraversal: [
        "../../../etc/passwd",
        "..\\..\\windows\\system32\\config\\sam",
        "....//....//etc//passwd",
      ],
      commandInjection: ["; rm -rf /", "| cat /etc/passwd", "&& format c:"],
    };
  }

  /**
   * セキュリティ設定の検証
   */
  static async validateSecurityConfiguration() {
    const config = await SecurityValidator.getSecurityConfiguration();

    return {
      encryptionEnabled: config.encryption === "AES-256",
      debugDisabled: !config.debugMode,
      secureStorageUsed: config.storage === "secure",
      networkIsolated: config.networkAccess === "none",
      filePermissionsSecure: config.filePermissions === "restricted",
    };
  }

  /**
   * ペネトレーションテストの実行
   */
  static async runPenetrationTests() {
    const testResults = [];

    // SQL Injection Test
    try {
      await DatabaseService.rawQuery("'; DROP TABLE questions; --");
      testResults.push({ test: "SQL Injection", status: "VULNERABLE" });
    } catch {
      testResults.push({ test: "SQL Injection", status: "PROTECTED" });
    }

    // File Access Test
    try {
      await SecurityValidator.validateFileAccess("../../../etc/passwd");
      testResults.push({ test: "Path Traversal", status: "VULNERABLE" });
    } catch {
      testResults.push({ test: "Path Traversal", status: "PROTECTED" });
    }

    return testResults;
  }

  /**
   * セキュリティレポートの生成
   */
  static generateSecurityReport(testResults: any[]) {
    const passedTests = testResults.filter(
      (result) => result.status === "PROTECTED",
    );
    const failedTests = testResults.filter(
      (result) => result.status === "VULNERABLE",
    );

    let report = "# セキュリティテスト結果レポート\n\n";
    report += `**テスト実行日**: ${new Date().toLocaleString()}\n`;
    report += `**総テスト数**: ${testResults.length}\n`;
    report += `**成功**: ${passedTests.length}\n`;
    report += `**失敗**: ${failedTests.length}\n`;
    report += `**セキュリティスコア**: ${((passedTests.length / testResults.length) * 100).toFixed(1)}%\n\n`;

    if (failedTests.length > 0) {
      report += "## 🚨 発見された脆弱性\n\n";
      failedTests.forEach((test) => {
        report += `- **${test.test}**: 対策が必要\n`;
      });
      report += "\n";
    }

    report += "## ✅ 保護されている項目\n\n";
    passedTests.forEach((test) => {
      report += `- ${test.test}\n`;
    });

    return report;
  }
}
