/**
 * データベースリセット機能
 * アプリ内からデータベースをクリアして新しいデータを再読み込みする
 */

import { databaseService } from "../data/database";
import { setupDatabase, resetDatabaseInitialization } from "../data/migrations";
import { Alert } from "react-native";
import { logger } from "../utils/logger";
import type { DatabaseError } from "../types/database";

/**
 * データベースをリセットして最新のデータを再読み込み
 */
/**
 * テーブルが存在する場合のみ削除を実行（存在しない場合はスキップ）
 */
async function safeDeleteFrom(tableName: string): Promise<void> {
  try {
    await databaseService.executeSql(`DELETE FROM ${tableName}`);
    logger.debug(`[ResetDatabase] ${tableName} のデータを削除しました`);
  } catch (error) {
    const messages: string[] = [];

    if (error instanceof Error) {
      messages.push(error.message.toLowerCase());

      const cause = (error as DatabaseError).cause;
      if (cause instanceof Error) {
        messages.push(cause.message.toLowerCase());
      } else if (typeof cause === "string") {
        messages.push(cause.toLowerCase());
      } else if (cause) {
        messages.push(String(cause).toLowerCase());
      }
    } else {
      messages.push(String(error).toLowerCase());
    }

    // "no such table" エラーは無視（テーブルが存在しない場合）
    if (messages.some((message) => message.includes("no such table"))) {
      logger.debug(
        `[ResetDatabase] ${tableName} テーブルは存在しません（スキップ）`,
      );
      return;
    }

    // その他のエラーは再スロー
    throw error;
  }
}

export async function resetDatabase(): Promise<void> {
  try {
    logger.debug("[ResetDatabase] データベースリセット開始");

    // 1. 外部キー制約を一時的に無効化（削除時のFK制約エラーを回避）
    logger.debug("[ResetDatabase] 外部キー制約を無効化");
    await databaseService.executeSql("PRAGMA foreign_keys = OFF");

    // 2. 既存のデータを全て削除
    logger.debug("[ResetDatabase] 既存データ削除中...");

    // 学習履歴とその他のデータを削除（存在しない場合はスキップ）
    await safeDeleteFrom("learning_history");
    await safeDeleteFrom("review_items");
    await safeDeleteFrom("mock_exam_results");
    await safeDeleteFrom("mock_exam_questions");
    await safeDeleteFrom("mock_exams");
    await safeDeleteFrom("user_progress");

    // 問題データを削除
    await safeDeleteFrom("questions");

    // カテゴリデータも削除（マイグレーションで再作成される）
    await safeDeleteFrom("categories");

    // マイグレーション履歴もリセット
    await safeDeleteFrom("migrations");

    logger.debug("[ResetDatabase] 既存データ削除完了");

    // 3. 外部キー制約を再有効化
    logger.debug("[ResetDatabase] 外部キー制約を再有効化");
    await databaseService.executeSql("PRAGMA foreign_keys = ON");

    logger.debug("[ResetDatabase] データベース再初期化中...");

    // 4. 初期化状態をリセット（キャッシュクリア）
    resetDatabaseInitialization();

    // 5. データベースを再セットアップ
    await setupDatabase();

    logger.debug("[ResetDatabase] データベースリセット完了");

    // 6. 確認のため問題数をチェック
    const result = await databaseService.executeSql(
      "SELECT COUNT(*) as count FROM questions WHERE id LIKE 'Q_MD_%'",
    );
    const mdCount = result.rows[0]?.count || 0;

    logger.debug(`[ResetDatabase] Q_MD_で始まる問題数: ${mdCount}`);

    if (mdCount > 0) {
      // 最初の問題を確認
      const firstQuestion = await databaseService.executeSql(
        "SELECT id, question_text FROM questions WHERE id = 'Q_MD_001'",
      );

      if (firstQuestion.rows.length > 0) {
        logger.debug("[ResetDatabase] 最初の問題確認:");
        logger.debug(`ID: ${firstQuestion.rows[0].id}`);
        logger.debug(
          `問題文: ${firstQuestion.rows[0].question_text.substring(0, 80)}...`,
        );
      }
    }

    Alert.alert(
      "リセット完了",
      `データベースがリセットされ、${mdCount}問の問題が読み込まれました。\n\nアプリを再起動してください。`,
      [{ text: "OK" }],
    );
  } catch (error) {
    logger.error("[ResetDatabase] リセット中にエラー:", error as Error);
    console.error("[ResetDatabase] Error details:", error);
    console.error(
      "[ResetDatabase] Error stack:",
      error instanceof Error ? error.stack : "No stack",
    );
    console.error(
      "[ResetDatabase] Error message:",
      error instanceof Error ? error.message : String(error),
    );

    Alert.alert(
      "エラー",
      `データベースのリセット中にエラーが発生しました。\n\n${error instanceof Error ? error.message : String(error)}`,
      [{ text: "OK" }],
    );
    throw error;
  }
}

/**
 * データベースリセットの確認ダイアログを表示
 */
export function confirmResetDatabase(): void {
  Alert.alert(
    "データベースリセット",
    "全ての学習履歴と問題データがリセットされます。\n本当に実行しますか？",
    [
      {
        text: "キャンセル",
        style: "cancel",
      },
      {
        text: "リセット",
        style: "destructive",
        onPress: async () => {
          try {
            await resetDatabase();
          } catch (error) {
            logger.error("Database reset failed:", error as Error);
          }
        },
      },
    ],
  );
}
