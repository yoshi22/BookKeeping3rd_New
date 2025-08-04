/**
 * マイグレーション統合ファイル
 * 簿記3級問題集アプリ - データベースマイグレーション管理
 */

import { migrationManager } from "./migration-manager";
import { migration001 } from "./001-initial-schema";

/**
 * 全マイグレーションの登録と実行
 */
export async function initializeDatabase(): Promise<void> {
  console.log("[Database] データベース初期化開始");

  try {
    // マイグレーション管理システムの初期化
    await migrationManager.initialize();

    // 全マイグレーションの登録
    migrationManager.registerMigration(migration001);

    // マイグレーション実行
    await migrationManager.runMigrations();

    // サンプルデータの読み込み
    await loadSampleData();

    // マイグレーション状態確認
    const status = await migrationManager.getStatus();
    console.log("[Database] マイグレーション状態:", status);

    console.log("[Database] データベース初期化完了");
  } catch (error) {
    console.error("[Database] データベース初期化エラー:", error);
    throw new Error(`Database initialization failed: ${error}`);
  }
}

/**
 * サンプルデータの読み込み
 */
async function loadSampleData(): Promise<void> {
  try {
    console.log("[Database] サンプルデータ読み込み開始");

    const { databaseService } = await import("../database");
    const { allSampleQuestions } = await import("../sample-questions");

    // 既存の問題データをチェック
    const existingCount = await databaseService.executeSql(
      "SELECT COUNT(*) as count FROM questions",
    );

    if (existingCount.rows[0]?.count > 0) {
      console.log(
        "[Database] 既存の問題データが見つかりました。サンプルデータ読み込みをスキップします",
      );
      return;
    }

    // サンプル問題データの挿入
    for (const question of allSampleQuestions) {
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

    console.log(
      `[Database] サンプルデータ読み込み完了: ${allSampleQuestions.length}件の問題を追加`,
    );
  } catch (error) {
    console.warn("[Database] サンプルデータ読み込みエラー:", error);
    // サンプルデータの読み込みエラーはアプリ起動を阻止しない
  }
}

/**
 * データベースのセットアップ（アプリ起動時に呼び出し）
 */
export async function setupDatabase(): Promise<void> {
  console.log("[Database] データベーセットアップ開始");

  try {
    const { databaseService } = await import("../database");

    // データベース接続初期化
    console.log("[Database] データベース接続初期化中");
    await databaseService.initialize();
    console.log("[Database] データベース接続初期化完了");

    // データベース接続状態確認
    if (!databaseService.isConnected()) {
      throw new Error("Database connection failed");
    }

    // マイグレーション実行
    console.log("[Database] マイグレーション実行開始");
    await initializeDatabase();
    console.log("[Database] マイグレーション実行完了");

    // データベース整合性チェック
    console.log("[Database] データベース整合性チェック中");
    const isHealthy = await databaseService.checkIntegrity();
    if (!isHealthy) {
      console.warn("[Database] データベース整合性チェック失敗");
      // 整合性チェック失敗は警告として扱い、アプリ起動は継続
    } else {
      console.log("[Database] データベース整合性チェック成功");
    }

    console.log("[Database] データベースセットアップ完了");
  } catch (error) {
    console.error("[Database] データベースセットアップエラー:", error);
    console.error(
      "[Database] Setup Error Stack:",
      error instanceof Error ? error.stack : undefined,
    );
    throw new Error(
      `Database setup failed: ${error instanceof Error ? error.message : error}`,
    );
  }
}

/**
 * マイグレーション管理システムのエクスポート
 */
export { migrationManager } from "./migration-manager";
export { migration001 } from "./001-initial-schema";
