/**
 * データベース内の試算表問題データを確認
 */
const { initializeDatabase } = require("../src/data/migrations");
const { databaseService } = require("../src/data/database");

async function checkDatabaseTrialBalance() {
  try {
    console.log("=== データベース内の試算表問題確認 ===\n");

    // データベース初期化
    await initializeDatabase();

    // 試算表問題を取得
    const result = await databaseService.executeSql(
      `SELECT id, question_text, correct_answer_json 
       FROM questions 
       WHERE id LIKE 'Q_T_%' 
       ORDER BY id`,
      [],
    );

    console.log(`データベース内の試算表問題数: ${result.rows.length}\n`);

    // 各問題の正答データを確認
    for (const row of result.rows) {
      console.log("===================================");
      console.log("問題ID:", row.id);
      console.log(
        "問題文（最初の50文字）:",
        row.question_text.substring(0, 50) + "...",
      );
      console.log("正答データ存在:", !!row.correct_answer_json);

      if (row.correct_answer_json) {
        try {
          const parsed = JSON.parse(row.correct_answer_json);
          console.log("正答データ形式:", Object.keys(parsed));

          if (parsed.entries) {
            console.log("entries数:", parsed.entries.length);
            if (parsed.entries.length > 0) {
              console.log(
                "最初のエントリ:",
                JSON.stringify(parsed.entries[0], null, 2),
              );
            } else {
              console.log("⚠️ entries配列が空です");
            }
          } else {
            console.log("⚠️ entriesプロパティが存在しません");
            console.log("実際のデータキー:", Object.keys(parsed));
          }
        } catch (e) {
          console.log("❌ JSONパースエラー:", e.message);
        }
      } else {
        console.log("❌ 正答データ: null または空文字");
      }
    }

    console.log("\n=== Q_T_001の詳細確認 ===");
    const detailResult = await databaseService.executeSql(
      `SELECT * FROM questions WHERE id = 'Q_T_001'`,
      [],
    );

    if (detailResult.rows.length > 0) {
      const row = detailResult.rows[0];
      console.log(
        "answer_template_json:",
        row.answer_template_json ? "存在" : "空",
      );
      if (row.answer_template_json) {
        const template = JSON.parse(row.answer_template_json);
        console.log("テンプレートタイプ:", template.type);
      }
      console.log(
        "correct_answer_json:",
        row.correct_answer_json ? "存在" : "空",
      );
      if (row.correct_answer_json) {
        console.log("正答データ長さ:", row.correct_answer_json.length);
        console.log(
          "正答データ最初の100文字:",
          row.correct_answer_json.substring(0, 100),
        );
      }
    }
  } catch (error) {
    console.error("エラー:", error);
  } finally {
    // データベース接続をクリーンアップ
    process.exit(0);
  }
}

checkDatabaseTrialBalance();
