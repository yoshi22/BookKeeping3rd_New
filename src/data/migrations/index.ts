/**
 * マイグレーション統合ファイル
 * 簿記3級問題集アプリ - データベースマイグレーション管理
 */

import { migrationManager } from "./migration-manager";
import { migration001 } from "./001-initial-schema";
import { addExamSectionsMigration } from "./002-add-exam-sections";
import { migration003 } from "./003-add-question-structure";
import { migration004 } from "./004-populate-question-structure";

/**
 * 全マイグレーションの登録と実行
 */
export async function initializeDatabase(): Promise<void> {
  console.log("[Database] データベース初期化開始");

  try {
    // マイグレーション管理システムの初期化
    console.log("[Database] マイグレーション管理システム初期化");
    await migrationManager.initialize();

    // 全マイグレーションの登録
    console.log("[Database] マイグレーション登録");
    migrationManager.registerMigration(migration001);
    migrationManager.registerMigration(addExamSectionsMigration);
    migrationManager.registerMigration(migration003);
    migrationManager.registerMigration(migration004);

    // マイグレーション実行
    console.log("[Database] マイグレーション実行");
    await migrationManager.runMigrations();

    console.log("[Database] マイグレーション完了 - サンプルデータ読み込み開始");

    // サンプルデータの読み込み（非同期）
    try {
      await loadSampleData();
      console.log("[Database] サンプルデータ読み込み完了");
    } catch (sampleError) {
      console.warn(
        "[Database] サンプルデータ読み込み失敗（継続可能）:",
        sampleError,
      );
      // サンプルデータの失敗は致命的でない
    }

    // マイグレーション状態確認
    try {
      const status = await migrationManager.getStatus();
      console.log("[Database] マイグレーション状態:", status);
    } catch (statusError) {
      console.warn("[Database] 状態確認失敗（継続可能）:", statusError);
    }

    console.log("[Database] データベース初期化完了");
  } catch (error) {
    console.error("[Database] データベース初期化エラー:", error);
    console.error("[Database] Error details:", {
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });

    // エラーの種類に応じて異なる処理
    if (error instanceof Error) {
      if (error.message.includes("Database corruption detected")) {
        throw new Error(
          `Database corruption detected - reset required: ${error.message}`,
        );
      } else if (error.message.includes("Transaction execution failed")) {
        throw new Error(
          `Database transaction failed - reset recommended: ${error.message}`,
        );
      }
    }

    throw new Error(
      `Database initialization failed: ${error instanceof Error ? error.message : error}`,
    );
  }
}

/**
 * サンプルデータの読み込み
 */
async function loadSampleData(): Promise<void> {
  try {
    console.log("[Database] サンプルデータ読み込み開始");

    const { databaseService } = await import("../database");
    const { masterQuestions: allSampleQuestions, questionStatistics } =
      await import("../master-questions");
    const SAMPLE_DATA_VERSION = "2025-08-10-master-questions";

    // 開発環境での強制更新フラグ
    const forceUpdate =
      process.env.NODE_ENV === "development" &&
      (process.env.FORCE_UPDATE_QUESTIONS === "true" ||
        process.env.EXPO_PUBLIC_FORCE_UPDATE_QUESTIONS === "true");

    // 現在のデータバージョンを取得
    let currentVersion = null;
    try {
      const versionResult = await databaseService.executeSql(
        "SELECT value FROM app_settings WHERE key = ?",
        ["sample_data_version"],
      );
      currentVersion = versionResult.rows[0]?.value;
    } catch (error) {
      console.log(
        "[Database] バージョン情報取得エラー（初回起動時は正常）:",
        error,
      );
    }

    // バージョンチェック
    const needsUpdate = currentVersion !== SAMPLE_DATA_VERSION;

    if (needsUpdate) {
      console.log(`[Database] データバージョンが更新されています`);
      console.log(`[Database] 現在: ${currentVersion || "なし"}`);
      console.log(`[Database] 新規: ${SAMPLE_DATA_VERSION}`);
    }

    // 既存の問題データをチェック
    const existingCount = await databaseService.executeSql(
      "SELECT COUNT(*) as count FROM questions",
    );

    if (existingCount.rows[0]?.count > 0) {
      if (forceUpdate || needsUpdate) {
        console.log(
          forceUpdate
            ? "[Database] 強制更新モード: 既存の問題データを削除します"
            : "[Database] データバージョンが更新されたため、既存データを更新します",
        );

        // 関連データを安全な順序で削除（外部キー制約を考慮）
        try {
          // 1. 外部キー制約を一時的に無効化
          await databaseService.executeSql("PRAGMA foreign_keys = OFF");
          console.log("[Database] 外部キー制約を一時無効化");

          // 2. 依存関係のある順序で削除
          await databaseService.executeSql("DELETE FROM learning_history");
          console.log("[Database] learning_history テーブル削除完了");

          await databaseService.executeSql("DELETE FROM review_items");
          console.log("[Database] review_items テーブル削除完了");

          await databaseService.executeSql("DELETE FROM mock_exam_results");
          console.log("[Database] mock_exam_results テーブル削除完了");

          await databaseService.executeSql("DELETE FROM mock_exam_questions");
          console.log("[Database] mock_exam_questions テーブル削除完了");

          await databaseService.executeSql("DELETE FROM questions");
          console.log("[Database] questions テーブル削除完了");

          // 3. 外部キー制約を再有効化
          await databaseService.executeSql("PRAGMA foreign_keys = ON");
          console.log("[Database] 外部キー制約を再有効化");
        } catch (deleteError) {
          console.log("[Database] 削除処理エラー:", deleteError);
          // 外部キー制約を確実に再有効化
          await databaseService.executeSql("PRAGMA foreign_keys = ON");
          throw deleteError;
        }

        console.log("[Database] 既存データの削除完了");
      } else {
        console.log(
          "[Database] 既存の問題データが見つかりました。サンプルデータ読み込みをスキップします",
        );
        console.log(
          "[Database] ヒント: EXPO_PUBLIC_FORCE_UPDATE_QUESTIONS=true を設定すると強制更新できます",
        );
        return;
      }
    }

    // 全問題データを使用
    const allQuestions = allSampleQuestions;
    console.log(`[Database] 読み込み対象問題数: ${allQuestions.length}件`);

    // Q_J_001のデータソース確認（デバッグ用）
    const qJ001 = allQuestions.find((q) => q.id === "Q_J_001");
    if (qJ001) {
      console.log("[Database] 読み込み前Q_J_001データソース確認:", {
        id: qJ001.id,
        correct_answer_json: qJ001.correct_answer_json,
        parsed: JSON.parse(qJ001.correct_answer_json || "{}"),
        data_version: SAMPLE_DATA_VERSION,
      });
    } else {
      console.log("[Database] 警告: Q_J_001が見つかりません！");
    }

    // 全問題データの挿入
    for (const question of allQuestions) {
      // Q_J_001の詳細ログ（問題調査用）
      if (question.id === "Q_J_001") {
        console.log("[Database] Q_J_001データ詳細ログ:", {
          id: question.id,
          correct_answer_json: question.correct_answer_json,
          parsed_answer: JSON.parse(question.correct_answer_json || "{}"),
          source_file: "allSampleQuestions配列から取得",
        });
      }

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

      // Q_J_001挿入後の確認ログ
      if (question.id === "Q_J_001") {
        const inserted = await databaseService.executeSql(
          "SELECT id, correct_answer_json FROM questions WHERE id = ?",
          ["Q_J_001"],
        );
        console.log("[Database] Q_J_001挿入後データベース確認:", {
          inserted_data: inserted.rows[0],
          parsed_inserted: JSON.parse(
            inserted.rows[0]?.correct_answer_json || "{}",
          ),
        });
      }
    }

    console.log(
      `[Database] 全問題データ読み込み完了: ${allQuestions.length}件の問題を追加`,
    );

    // サンプル模試データの読み込み
    try {
      const { generateMockExamData } = await import("../sample-mock-exams");
      const mockExamData = generateMockExamData();

      console.log(
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

      console.log(
        `[Database] 模試データ読み込み完了: ${mockExamData.exams.length}件の模試、${mockExamData.questions.length}件の問題関連`,
      );
    } catch (mockExamError) {
      console.warn("[Database] 模試データ読み込みエラー:", mockExamError);
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

      console.log(
        `[Database] データバージョン保存完了: ${SAMPLE_DATA_VERSION}`,
      );
    } catch (versionError) {
      console.warn("[Database] バージョン情報保存エラー:", versionError);
      // バージョン保存の失敗は致命的でない
    }
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
