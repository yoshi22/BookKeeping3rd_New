/**
 * マイグレーション統合ファイル
 * 簿記3級問題集アプリ - データベースマイグレーション管理
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { migrationManager } from "./migration-manager";
import { migration001 } from "./001-initial-schema";
import { addExamSectionsMigration } from "./002-add-exam-sections";
import { migration003 } from "./003-add-question-structure";
import { migration004 } from "./004-populate-question-structure";
import { migration005 } from "./005-remove-mock-exams";
import { logger } from "../../utils/logger";

/**
 * 全マイグレーションの登録と実行
 */
export async function initializeDatabase(): Promise<void> {
  logger.debug("[Database] データベース初期化開始");

  try {
    // マイグレーション管理システムの初期化
    logger.debug("[Database] マイグレーション管理システム初期化");
    await migrationManager.initialize();

    // 全マイグレーションの登録
    logger.debug("[Database] マイグレーション登録");
    migrationManager.registerMigration(migration001);
    migrationManager.registerMigration(addExamSectionsMigration);
    migrationManager.registerMigration(migration003);
    migrationManager.registerMigration(migration004);
    migrationManager.registerMigration(migration005);

    // マイグレーション実行
    logger.debug("[Database] マイグレーション実行");
    await migrationManager.runMigrations();

    logger.debug(
      "[Database] マイグレーション完了 - サンプルデータ読み込み開始",
    );

    // サンプルデータの読み込み（非同期）
    try {
      await loadSampleData();
      logger.debug("[Database] サンプルデータ読み込み完了");
    } catch (sampleError) {
      logger.warn("[Database] サンプルデータ読み込み失敗（継続可能）:", {
        details: sampleError,
      });
      // サンプルデータの失敗は致命的でない
    }

    // マイグレーション状態確認
    try {
      const status = await migrationManager.getStatus();
      logger.debug("[Database] マイグレーション状態:", { details: status });
    } catch (statusError) {
      logger.warn("[Database] 状態確認失敗（継続可能）:", {
        details: statusError,
      });
    }

    logger.debug("[Database] データベース初期化完了");
  } catch (error) {
    logger.error("[Database] データベース初期化エラー:", error as Error);
    logger.error("[Database] Error details:");

    // エラーの種類に応じて異なる処理
    if (error instanceof Error) {
      if ((error as Error).message.includes("Database corruption detected")) {
        throw new Error(
          `Database corruption detected - reset required: ${(error as Error).message}`,
        );
      } else if (
        (error as Error).message.includes("Transaction execution failed")
      ) {
        throw new Error(
          `Database transaction failed - reset recommended: ${(error as Error).message}`,
        );
      }
    }

    throw new Error(
      `Database initialization failed: ${error instanceof Error ? (error as Error).message : error}`,
    );
  }
}

// サンプルデータ読み込みのロック（同期フラグ + 非同期Promise）
let isLoadingInProgress = false;
let sampleDataLoadingPromise: Promise<void> | null = null;

/**
 * サンプルデータの読み込み
 */
async function loadSampleData(): Promise<void> {
  // 既に読み込み中の場合は同じPromiseを返す（並行実行防止）
  if (isLoadingInProgress) {
    console.log("[DEBUG] loadSampleData() 既に実行中、待機します");
    if (sampleDataLoadingPromise) {
      return sampleDataLoadingPromise;
    }
    // Promiseが未設定の場合は待機（異常系だが安全のため）
    await new Promise((resolve) => setTimeout(resolve, 100));
    return loadSampleData();
  }

  // フラグを立てて読み込み開始（アトミックに）
  isLoadingInProgress = true;
  console.log("[DEBUG] loadSampleData() 実行開始（フラグ設定完了）");

  // 読み込み処理を開始し、Promiseを保持
  sampleDataLoadingPromise = performSampleDataLoad();

  try {
    await sampleDataLoadingPromise;
  } finally {
    sampleDataLoadingPromise = null;
    isLoadingInProgress = false;
    console.log("[DEBUG] loadSampleData() 実行完了（フラグ解除）");
  }
}

/**
 * 実際のサンプルデータ読み込み処理
 */
async function performSampleDataLoad(): Promise<void> {
  try {
    console.log("[DEBUG] loadSampleData() 開始");
    logger.debug("[Database] サンプルデータ読み込み開始");

    const { databaseService } = await import("../database");
    console.log("[DEBUG] database インポート成功");

    const { allQuestions: allSampleQuestions, questionStatistics } =
      await import("../master-questions");
    console.log(
      "[DEBUG] master-questions インポート成功, 問題数:",
      allSampleQuestions.length,
    );

    const SAMPLE_DATA_VERSION = "2025-10-06-q3-fs-002-fix";

    // 環境変数による強制更新フラグ（開発時のみ）
    const forceUpdate = false; // ✅ Q3_FS_002修正完了、ユーザーデータ保護のためfalseに戻しました

    // 現在のデータバージョンを取得
    let currentVersion = null;
    try {
      const versionResult = await databaseService.executeSql(
        "SELECT value FROM app_settings WHERE key = ?",
        ["sample_data_version"],
      );
      currentVersion = versionResult.rows[0]?.value;
    } catch (error) {
      // 初回起動時は app_settings テーブルが存在しない場合があるため正常
    }

    // バージョンチェック
    const needsUpdate = currentVersion !== SAMPLE_DATA_VERSION;
    console.log(
      "[DEBUG] バージョンチェック: current=",
      currentVersion,
      "new=",
      SAMPLE_DATA_VERSION,
      "needsUpdate=",
      needsUpdate,
    );

    // 既存の問題データをチェック
    const existingCount = await databaseService.executeSql(
      "SELECT COUNT(*) as count FROM questions",
    );
    console.log("[DEBUG] 既存データ件数チェック結果:", existingCount.rows);

    if (existingCount.rows[0]?.count > 0) {
      console.log(
        "[DEBUG] 既存データあり: count=",
        existingCount.rows[0].count,
        "forceUpdate=",
        forceUpdate,
        "needsUpdate=",
        needsUpdate,
      );
      console.log(
        "[DEBUG] Inner if check: (forceUpdate || needsUpdate) =",
        forceUpdate || needsUpdate,
      );
      if (forceUpdate || needsUpdate) {
        console.log("[DEBUG] 削除処理開始");
        logger.debug(
          forceUpdate
            ? "[Database] 強制更新モード: 既存データを削除"
            : "[Database] バージョン更新: 問題データを更新",
        );

        // トランザクションで削除を実行（並行実行対策）
        try {
          console.log("[DEBUG] トランザクション開始...");
          await databaseService.executeSql("BEGIN EXCLUSIVE TRANSACTION");
          console.log("[DEBUG] PRAGMA foreign_keys = OFF 実行中...");
          await databaseService.executeSql("PRAGMA foreign_keys = OFF");
          console.log("[DEBUG] PRAGMA foreign_keys = OFF 完了");

          // 強制更新時のみユーザーデータを削除
          if (forceUpdate) {
            console.log("[DEBUG] learning_history 削除中...");
            await databaseService.executeSql("DELETE FROM learning_history");
            console.log("[DEBUG] review_items 削除中...");
            await databaseService.executeSql("DELETE FROM review_items");
          }

          console.log("[DEBUG] mock_exam_results 削除中...");
          await databaseService.executeSql("DELETE FROM mock_exam_results");
          console.log("[DEBUG] mock_exam_questions 削除中...");
          await databaseService.executeSql("DELETE FROM mock_exam_questions");
          console.log("[DEBUG] questions 削除中...");
          await databaseService.executeSql("DELETE FROM questions");
          console.log("[DEBUG] questions 削除完了");

          await databaseService.executeSql("PRAGMA foreign_keys = ON");
          await databaseService.executeSql("COMMIT");
          console.log("[DEBUG] 削除トランザクション完了");
        } catch (deleteError) {
          console.log("[DEBUG] 削除エラー:", deleteError);
          await databaseService.executeSql("ROLLBACK");
          await databaseService.executeSql("PRAGMA foreign_keys = ON");
          throw deleteError;
        }
      } else {
        logger.debug("[Database] 既存データをスキップ");
        return;
      }
    } else {
      console.log(
        "[DEBUG] 既存データなし、または件数が0: count=",
        existingCount.rows[0]?.count,
      );
    }

    // 全問題データを使用
    const allQuestions = allSampleQuestions;
    logger.debug(`[Database] 読み込み対象問題数: ${allQuestions.length}件`);

    // 配列の妥当性チェック
    const undefinedCount = allQuestions.filter((q) => q === undefined).length;
    if (undefinedCount > 0) {
      console.log(
        `[DEBUG] WARNING: ${undefinedCount}個のundefined要素が検出されました`,
      );
    }
    console.log(
      "[DEBUG] 配列チェック: length=",
      allQuestions.length,
      "undefined要素=",
      undefinedCount,
    );

    // カテゴリ別の問題数を確認
    const categoryBreakdown = {
      journal: allQuestions.filter((q) => q.category_id === "journal").length,
      ledger: allQuestions.filter((q) => q.category_id === "ledger").length,
      trial_balance: allQuestions.filter(
        (q) => q.category_id === "trial_balance",
      ).length,
    };
    console.log("[DEBUG] カテゴリ別問題数:", categoryBreakdown);

    // Q2/Q3問題のID例を確認
    const q2Questions = allQuestions.filter((q) => q.id.startsWith("Q2_"));
    const q3Questions = allQuestions.filter((q) => q.id.startsWith("Q3_"));
    console.log(
      "[DEBUG] Q2問題数:",
      q2Questions.length,
      "最初の3問:",
      q2Questions.slice(0, 3).map((q) => q.id),
    );
    // Q2問題のquestion_order値を確認（重要）
    console.log(
      "[DEBUG] Q2問題のquestion_order値:",
      q2Questions.slice(0, 5).map((q) => `${q.id}:${q.question_order}`),
    );
    console.log(
      "[DEBUG] Q3問題数:",
      q3Questions.length,
      "最初の3問:",
      q3Questions.slice(0, 3).map((q) => q.id),
    );

    // 全問題データの挿入（トランザクションで実行）
    console.log("[DEBUG] データ挿入開始: 問題数", allQuestions.length);
    try {
      await databaseService.executeSql("BEGIN EXCLUSIVE TRANSACTION");
      console.log("[DEBUG] 挿入トランザクション開始");

      for (let i = 0; i < allQuestions.length; i++) {
        const question = allQuestions[i];
        try {
          await databaseService.executeSql(
            `INSERT INTO questions (
            id, category_id, question_text, answer_template_json,
            correct_answer_json, explanation, difficulty, tags_json,
            created_at, updated_at, question_order, section_number, subcategory, pattern_type
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              question.id,
              question.category_id,
              question.question_text,
              question.answer_template_json,
              question.correct_answer_json,
              question.explanation,
              question.difficulty,
              question.tags_json,
              question.created_at,
              question.updated_at,
              question.question_order,
              question.section_number,
              question.subcategory,
              question.pattern_type,
            ],
          );
        } catch (insertError) {
          console.log(
            `[DEBUG] 挿入エラー at index ${i}, id: ${question ? question.id : "UNDEFINED"}`,
          );
          console.log("[DEBUG] question:", question);
          console.log("[DEBUG] エラー詳細:", JSON.stringify(insertError));
          console.log(
            "[DEBUG] エラーメッセージ:",
            insertError instanceof Error
              ? insertError.message
              : String(insertError),
          );
          // ロールバック
          await databaseService.executeSql("ROLLBACK");
          throw insertError;
        }
      }

      await databaseService.executeSql("COMMIT");
      console.log("[DEBUG] 挿入トランザクション完了");
    } catch (transactionError) {
      console.log("[DEBUG] 挿入トランザクションエラー:", transactionError);
      throw transactionError;
    }
    console.log("[DEBUG] データ挿入完了");

    // 挿入後のデータベース確認
    const insertedCounts = await databaseService.executeSql(
      "SELECT category_id, COUNT(*) as count FROM questions GROUP BY category_id",
    );
    console.log("[DEBUG] DB挿入後のカテゴリ別件数:", insertedCounts.rows);

    logger.debug(
      `[Database] 全問題データ読み込み完了: ${allQuestions.length}件の問題を追加`,
    );

    // サンプル模試データの読み込み
    try {
      const { generateMockExamData } = await import("../sample-mock-exams");
      const mockExamData = generateMockExamData();

      logger.debug(
        `[Database] 模試データ読み込み開始: ${mockExamData.exams.length}件の模試`,
      );

      // 既存の模試データを削除
      await databaseService.executeSql("DELETE FROM mock_exam_questions");
      await databaseService.executeSql("DELETE FROM mock_exams");

      // 模試データの挿入
      for (const exam of mockExamData.exams) {
        await databaseService.executeSql(
          `INSERT INTO mock_exams (
            id, name, description, time_limit_minutes, total_score,
            passing_score, structure_json, is_active, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            exam.id,
            exam.name,
            exam.description,
            exam.time_limit_minutes,
            exam.total_score,
            exam.passing_score,
            exam.structure_json,
            exam.is_active ? 1 : 0,
            exam.created_at,
          ],
        );
      }

      // 模試問題関連データの挿入
      for (const question of mockExamData.questions) {
        await databaseService.executeSql(
          `INSERT INTO mock_exam_questions (
            mock_exam_id, question_id, section_number, question_order, points
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            question.mock_exam_id,
            question.question_id,
            question.section_number,
            question.question_order,
            question.points,
          ],
        );
      }

      logger.debug(
        `[Database] 模試データ読み込み完了: ${mockExamData.exams.length}件の模試、${mockExamData.questions.length}件の問題関連`,
      );
    } catch (mockExamError) {
      logger.warn("[Database] 模試データ読み込みエラー:", {
        details: mockExamError,
      });
      // 模試データの失敗は致命的でない
    }

    // バージョン情報を保存
    try {
      // 既存のバージョン情報を削除
      await databaseService.executeSql(
        "DELETE FROM app_settings WHERE key = ?",
        ["sample_data_version"],
      );

      // 新しいバージョン情報を保存
      await databaseService.executeSql(
        "INSERT INTO app_settings (key, value, updated_at) VALUES (?, ?, ?)",
        ["sample_data_version", SAMPLE_DATA_VERSION, new Date().toISOString()],
      );

      logger.debug(
        `[Database] データバージョン保存完了: ${SAMPLE_DATA_VERSION}`,
      );
    } catch (versionError) {
      logger.warn("[Database] バージョン情報保存エラー:", {
        details: versionError,
      });
      // バージョン保存の失敗は致命的でない
    }
  } catch (error) {
    logger.warn("[Database] サンプルデータ読み込みエラー:", { details: error });
    // サンプルデータの読み込みエラーはアプリ起動を阻止しない
  }
}

// データベース初期化状態管理
let initializationPromise: Promise<void> | null = null;

/**
 * データベースのセットアップ（アプリ起動時に呼び出し）
 * 重複実行防止機能付き
 */
export async function setupDatabase(): Promise<void> {
  // 既に初期化中の場合は同じPromiseを返す
  if (initializationPromise) {
    return initializationPromise;
  }

  // 初期化を実行し、Promiseを保持
  initializationPromise = performDatabaseSetup();

  try {
    await initializationPromise;
    logger.debug("[Database] データベースセットアップ完了");
  } catch (error) {
    logger.error("[Database] データベースセットアップエラー:", error as Error);
    initializationPromise = null; // エラー時はリセット
    throw error;
  }

  return initializationPromise;
}

/**
 * 実際のデータベースセットアップ処理
 */
async function performDatabaseSetup(): Promise<void> {
  try {
    const { databaseService } = await import("../database");

    // データベース接続初期化
    await databaseService.initialize();

    // データベース接続状態確認
    if (!databaseService.isConnected()) {
      throw new Error("Database connection failed");
    }

    // マイグレーション実行
    await initializeDatabase();

    // データベース整合性チェック
    const isHealthy = await databaseService.checkIntegrity();
    if (!isHealthy) {
      logger.warn("[Database] データベース整合性チェック失敗");
    }
  } catch (error) {
    logger.error("[Database] データベースセットアップエラー:", error as Error);
    throw new Error(
      `Database setup failed: ${error instanceof Error ? (error as Error).message : error}`,
    );
  }
}

/**
 * マイグレーション管理システムのエクスポート
 */
export { migrationManager } from "./migration-manager";
export { migration001 } from "./001-initial-schema";
export { migration005 } from "./005-remove-mock-exams";
