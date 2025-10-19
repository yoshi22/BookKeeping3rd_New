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
import type { DatabaseService } from "../database";
import type { ReviewItemRepository } from "../repositories/review-item-repository";

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

    const SAMPLE_DATA_VERSION = "2025-10-19-fix-orphaned-review-items-v4";

    // 環境変数による強制更新フラグ（開発時のみ）
    const forceUpdate = true; // ⚠️ 一時的にtrue - orphaned review_itemsクリーンアップのため（検証後にfalseに戻す）

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

          // mock_exam関連テーブルは削除（migration 005で削除済みの場合はスキップ）
          try {
            console.log("[DEBUG] mock_exam_results 削除試行...");
            await databaseService.executeSql("DELETE FROM mock_exam_results");
          } catch (e) {
            console.log(
              "[DEBUG] mock_exam_results テーブルが存在しません（スキップ）",
            );
          }

          try {
            console.log("[DEBUG] mock_exam_questions 削除試行...");
            await databaseService.executeSql("DELETE FROM mock_exam_questions");
          } catch (e) {
            console.log(
              "[DEBUG] mock_exam_questions テーブルが存在しません（スキップ）",
            );
          }

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
        await ensureReviewItemsIntegrity(databaseService);
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

    // サンプル模試データの読み込み（一時的にスキップ - Q3問題順序確認のため）
    /*
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
    */

    // カテゴリ名称を更新（独立した関数で実行）
    await updateCategoryNames();

    await ensureReviewItemsIntegrity(databaseService);

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

/**
 * カテゴリ名称を更新する独立した関数
 * 問題データの再読み込みをトリガーせずにカテゴリ名のみを更新
 */
async function updateCategoryNames(): Promise<void> {
  try {
    console.log("[DEBUG] カテゴリ名称更新開始");
    const { databaseService } = await import("../database");

    // カテゴリ情報を更新（名称・説明文・問題数）
    await databaseService.executeSql(
      `UPDATE categories SET name = ?, description = ?, total_questions = ? WHERE id = ?`,
      ["第一問", "仕訳問題", 250, "journal"],
    );
    await databaseService.executeSql(
      `UPDATE categories SET name = ?, description = ?, total_questions = ? WHERE id = ?`,
      ["第二問", "帳簿・伝票等の問題", 70, "ledger"],
    );
    await databaseService.executeSql(
      `UPDATE categories SET name = ?, description = ?, total_questions = ? WHERE id = ?`,
      ["第三問", "試算表作成問題", 50, "trial_balance"],
    );

    console.log("[DEBUG] カテゴリ名称更新完了");
  } catch (error) {
    console.log("[DEBUG] カテゴリ名称更新エラー:", error);
    logger.warn("[Database] カテゴリ名称更新エラー:", {
      details: error,
    });
    // カテゴリ名更新の失敗は致命的でない
  }
}

/**
 * review_itemsテーブルの整合性を確保
 * - orphanedデータの削除
 * - learning_historyからの復元
 */
async function ensureReviewItemsIntegrity(
  databaseService: DatabaseService,
): Promise<void> {
  try {
    const { reviewItemRepository } = await import(
      "../repositories/review-item-repository"
    );
    const { statisticsCache } = await import("../../services/statistics-cache");

    const deletedCount =
      await reviewItemRepository.cleanupOrphanedItems(databaseService);
    const restoredCount = await restoreReviewItemsFromHistory(
      databaseService,
      reviewItemRepository,
    );

    if (deletedCount === 0 && restoredCount === 0) {
      logger.debug("[Database] review_items整合性チェック完了: 変更なし");
      return;
    }

    statisticsCache.clearAll();
    logger.debug(
      "[Database] review_items整合性チェック後に統計キャッシュをクリア",
    );

    logger.info(
      `[Database] review_items整合性チェック完了: 削除${deletedCount}件 / 復元${restoredCount}件`,
    );
  } catch (error) {
    logger.warn("[Database] review_items整合性チェックエラー:", {
      details: error,
    });
  }
}

/**
 * learning_historyから欠損したreview_itemsを復元
 */
async function restoreReviewItemsFromHistory(
  databaseService: DatabaseService,
  reviewItemRepository: ReviewItemRepository,
): Promise<number> {
  type RestoreCandidateRow = {
    question_id: string;
    incorrect_attempts: number;
    correct_attempts: number;
    last_answered_at: string | null;
  };

  const candidates = await databaseService.executeSql<RestoreCandidateRow>(
    `
      SELECT
        lh.question_id AS question_id,
        SUM(CASE WHEN lh.is_correct = 0 THEN 1 ELSE 0 END) AS incorrect_attempts,
        SUM(CASE WHEN lh.is_correct = 1 THEN 1 ELSE 0 END) AS correct_attempts,
        MAX(lh.answered_at) AS last_answered_at
      FROM learning_history lh
      INNER JOIN questions q ON lh.question_id = q.id
      LEFT JOIN review_items ri ON lh.question_id = ri.question_id
      GROUP BY lh.question_id
      HAVING incorrect_attempts > 0 AND ri.question_id IS NULL
    `,
    [],
  );

  if (candidates.rows.length === 0) {
    logger.debug("[Database] review_items復元対象なし");
    return 0;
  }

  let restoredCount = 0;
  const restoredIds: string[] = [];

  for (const row of candidates.rows) {
    await reviewItemRepository.createOrUpdate({
      questionId: row.question_id,
      incorrectCount: row.incorrect_attempts,
      consecutiveCorrectCount: 0, // 連続正解は再計算困難なため0で再開
      status: "needs_review",
      lastAnsweredAt: row.last_answered_at ?? new Date().toISOString(),
    });

    restoredCount += 1;
    restoredIds.push(row.question_id);
  }

  logger.info(`[Database] review_items復元完了: ${restoredCount}件生成`, {
    details: restoredIds.slice(0, 20),
  });

  if (restoredIds.length > 20) {
    logger.debug("[Database] 復元対象ID一覧", { details: restoredIds });
  }

  return restoredCount;
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

    // カテゴリ名称を常に最新に更新（needsUpdateに関係なく実行）
    await updateCategoryNames();
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
