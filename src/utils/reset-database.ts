/**
 * データベースリセット機能
 * アプリ内からデータベースをクリアして新しいデータを再読み込みする
 */

import { databaseService } from "../data/database";
import { setupDatabase } from "../data/migrations";
import { Alert } from "react-native";

/**
 * データベースをリセットして最新のデータを再読み込み
 */
export async function resetDatabase(): Promise<void> {
  try {
    console.log("[ResetDatabase] データベースリセット開始");

    // 1. 既存のデータを全て削除
    console.log("[ResetDatabase] 既存データ削除中...");

    // 学習履歴とその他のデータを削除
    await databaseService.executeSql("DELETE FROM learning_history");
    await databaseService.executeSql("DELETE FROM review_items");
    await databaseService.executeSql("DELETE FROM mock_exam_results");
    await databaseService.executeSql("DELETE FROM mock_exam_questions");
    await databaseService.executeSql("DELETE FROM mock_exams");
    await databaseService.executeSql("DELETE FROM user_progress");

    // 問題データを削除
    await databaseService.executeSql("DELETE FROM questions");

    console.log("[ResetDatabase] 既存データ削除完了");

    // 2. カテゴリデータも削除（マイグレーションで再作成される）
    await databaseService.executeSql("DELETE FROM categories");

    // 3. マイグレーション履歴もリセット
    await databaseService.executeSql("DELETE FROM migration_history");

    console.log("[ResetDatabase] データベース再初期化中...");

    // 4. データベースを再セットアップ
    await setupDatabase();

    console.log("[ResetDatabase] データベースリセット完了");

    // 5. 確認のため問題数をチェック
    const result = await databaseService.executeSql(
      "SELECT COUNT(*) as count FROM questions WHERE id LIKE 'Q_MD_%'",
    );
    const mdCount = result.rows[0]?.count || 0;

    console.log(`[ResetDatabase] Q_MD_で始まる問題数: ${mdCount}`);

    if (mdCount > 0) {
      // 最初の問題を確認
      const firstQuestion = await databaseService.executeSql(
        "SELECT id, question_text FROM questions WHERE id = 'Q_MD_001'",
      );

      if (firstQuestion.rows.length > 0) {
        console.log("[ResetDatabase] 最初の問題確認:");
        console.log(`ID: ${firstQuestion.rows[0].id}`);
        console.log(
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
    console.error("[ResetDatabase] リセット中にエラー:", error);
    Alert.alert("エラー", "データベースのリセット中にエラーが発生しました。", [
      { text: "OK" },
    ]);
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
            console.error("Database reset failed:", error);
          }
        },
      },
    ],
  );
}
