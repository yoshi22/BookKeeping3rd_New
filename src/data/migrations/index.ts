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

/**
 * サンプルデータの読み込み
 */
async function loadSampleData(): Promise<void> {
  try {
    logger.debug("[Database] サンプルデータ読み込み開始");

    const { databaseService } = await import("../database");
    const { allQuestions: allSampleQuestions, questionStatistics } =
      await import("../master-questions");
    const SAMPLE_DATA_VERSION = "2025-08-24-account-options-fix";

    // 環境変数による強制更新フラグ（開発時のみ）
    const forceUpdate = false; // 勘定科目選択肢修正完了 - ユーザーデータ保護のため false に復元

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

    // 既存の問題データをチェック
    const existingCount = await databaseService.executeSql(
      "SELECT COUNT(*) as count FROM questions",
    );

    if (existingCount.rows[0]?.count > 0) {
      if (forceUpdate || needsUpdate) {
        logger.debug(
          forceUpdate
            ? "[Database] 強制更新モード: 既存データを削除"
            : "[Database] バージョン更新: 問題データを更新",
        );

        // 外部キー制約を考慮した安全な削除
        try {
          await databaseService.executeSql("PRAGMA foreign_keys = OFF");

          // 強制更新時のみユーザーデータを削除
          if (forceUpdate) {
            await databaseService.executeSql("DELETE FROM learning_history");
            await databaseService.executeSql("DELETE FROM review_items");
          }

          await databaseService.executeSql("DELETE FROM mock_exam_results");
          await databaseService.executeSql("DELETE FROM mock_exam_questions");
          await databaseService.executeSql("DELETE FROM questions");

          await databaseService.executeSql("PRAGMA foreign_keys = ON");
        } catch (deleteError) {
          await databaseService.executeSql("PRAGMA foreign_keys = ON");
          throw deleteError;
        }
      } else {
        logger.debug("[Database] 既存データをスキップ");
        return;
      }
    }

    // 全問題データを使用
    const allQuestions = allSampleQuestions;
    logger.debug(`[Database] 読み込み対象問題数: ${allQuestions.length}件`);

    // 全問題データの挿入
    for (const question of allQuestions) {
      await databaseService.executeSql(
        `INSERT INTO questions (
          id, category_id, question_text, answer_template_json, 
          correct_answer_json, explanation, difficulty, tags_json, 
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        ],
      );
    }

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
