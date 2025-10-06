#!/usr/bin/env node

/**
 * Q2_V_011-013のデータベース状態確認スクリプト
 * tags_jsonのsubcategory値を確認して、データベースが正しく更新されているか検証
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// データベースパス（実際のシミュレーターのパスを使用）
const DB_PATH = path.join(__dirname, "../../bookkeeping.db");

console.log("📊 Q2_V_011-013 データベース状態確認\n");
console.log("データベースパス:", DB_PATH);
console.log("=====================================\n");

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("❌ データベース接続エラー:", err.message);
    console.log(
      "\n💡 ヒント: このスクリプトはシミュレーターのデータベースを直接確認しません。",
    );
    console.log(
      "   アプリを起動してデータベース初期化ログを確認してください。",
    );
    process.exit(1);
  }

  console.log("✅ データベース接続成功\n");

  // Q2_V_011-013のデータを取得
  const query = `
    SELECT
      id,
      question_text,
      tags_json,
      section_number,
      question_order
    FROM questions
    WHERE id IN ('Q2_V_011', 'Q2_V_012', 'Q2_V_013')
    ORDER BY question_order
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("❌ クエリエラー:", err.message);
      db.close();
      process.exit(1);
    }

    if (rows.length === 0) {
      console.log("⚠️  Q2_V_011-013 のデータが見つかりません");
      console.log(
        "   データベースがまだ初期化されていない可能性があります。\n",
      );

      // 全体の問題数を確認
      db.get("SELECT COUNT(*) as count FROM questions", (err, result) => {
        if (!err) {
          console.log(`📈 データベース内の総問題数: ${result.count}`);
        }
        db.close();
      });
      return;
    }

    console.log(`✅ ${rows.length}件のデータが見つかりました\n`);

    rows.forEach((row, index) => {
      console.log(`【${index + 1}】 ${row.id}`);
      console.log(`   問題文: ${row.question_text.substring(0, 50)}...`);
      console.log(`   section_number: ${row.section_number}`);
      console.log(`   question_order: ${row.question_order}`);

      try {
        const tags = JSON.parse(row.tags_json);
        console.log(`   subcategory: ${tags.subcategory}`);

        // subcategoryの検証
        if (tags.subcategory === "vocabulary") {
          console.log('   ✅ subcategory = "vocabulary" (正しい)');
        } else {
          console.log(
            `   ❌ subcategory = "${tags.subcategory}" (期待値: "vocabulary")`,
          );
        }
      } catch (e) {
        console.log(`   ❌ tags_json解析エラー: ${row.tags_json}`);
      }

      console.log("");
    });

    // app_settingsからデータバージョンを確認
    db.get(
      "SELECT value FROM app_settings WHERE key = 'sample_data_version'",
      (err, versionRow) => {
        if (!err && versionRow) {
          console.log("📌 現在のデータバージョン:", versionRow.value);
          console.log("   期待値: 2025-10-05-q2-vocabulary-mapping-fix\n");

          if (versionRow.value === "2025-10-05-q2-vocabulary-mapping-fix") {
            console.log("✅ データベースが最新バージョンに更新されています");
          } else {
            console.log("⚠️  データベースが古いバージョンです");
            console.log(
              "   アプリを再起動してデータベース更新を実行してください",
            );
          }
        }

        db.close();
      },
    );
  });
});
