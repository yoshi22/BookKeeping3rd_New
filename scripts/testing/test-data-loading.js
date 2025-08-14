/**
 * データ読み込みテストスクリプト
 * アプリでの問題データ読み込みをシミュレート
 */

console.log("===== データ読み込みテスト開始 =====\n");

// 1. master-questions.js の直接読み込みテスト
console.log("1. master-questions.js の直接読み込み:");
try {
  const masterDirect = require("../src/data/master-questions.js");
  console.log("   ✅ 成功");
  console.log("   - Keys:", Object.keys(masterDirect));
  console.log(
    "   - masterQuestions:",
    masterDirect.masterQuestions
      ? masterDirect.masterQuestions.length + "問"
      : "undefined",
  );
  console.log(
    "   - questionStatistics:",
    masterDirect.questionStatistics ? "あり" : "なし",
  );
} catch (error) {
  console.log("   ❌ エラー:", error.message);
}

// 2. master-questions-wrapper.js の読み込みテスト
console.log("\n2. master-questions-wrapper.js の読み込み:");
try {
  const masterWrapper = require("../src/data/master-questions-wrapper.js");
  console.log("   ✅ 成功");
  console.log("   - Keys:", Object.keys(masterWrapper));
  console.log(
    "   - masterQuestions:",
    masterWrapper.masterQuestions
      ? masterWrapper.masterQuestions.length + "問"
      : "undefined",
  );
  console.log(
    "   - questionStatistics:",
    masterWrapper.questionStatistics ? "あり" : "なし",
  );
} catch (error) {
  console.log("   ❌ エラー:", error.message);
}

// 3. sample-questions-new.ts のシミュレーション
console.log("\n3. sample-questions-new.ts のシミュレーション:");
try {
  const masterData = require("../src/data/master-questions-wrapper.js");

  if (
    masterData &&
    masterData.masterQuestions &&
    masterData.masterQuestions.length > 0
  ) {
    const allSampleQuestions = masterData.masterQuestions;

    // カテゴリー別に分類
    const journalQuestions = masterData.masterQuestions.filter(
      (q) => q.category_id === "journal",
    );
    const ledgerQuestions = masterData.masterQuestions.filter(
      (q) => q.category_id === "ledger",
    );
    const trialBalanceQuestions = masterData.masterQuestions.filter(
      (q) => q.category_id === "trial_balance",
    );

    console.log("   ✅ データ読み込み成功");
    console.log("   - 総問題数:", allSampleQuestions.length + "問");
    console.log("   - 仕訳問題:", journalQuestions.length + "問");
    console.log("   - 帳簿問題:", ledgerQuestions.length + "問");
    console.log("   - 試算表問題:", trialBalanceQuestions.length + "問");

    // サンプル問題表示
    if (journalQuestions.length > 0) {
      const sample = journalQuestions[0];
      console.log("\n   サンプル問題（仕訳）:");
      console.log("   - ID:", sample.id);
      console.log("   - カテゴリー:", sample.category_id);
      console.log("   - 難易度:", sample.difficulty);
      console.log(
        "   - 問題文:",
        sample.question_text.substring(0, 50) + "...",
      );
    }
  } else {
    console.log("   ❌ データが空または無効");
  }
} catch (error) {
  console.log("   ❌ エラー:", error.message);
  console.log("      詳細:", error);
}

// 4. データベース接続テスト
console.log("\n4. データベース接続テスト:");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "..", "bookkeeping.db");
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.log("   ❌ データベース接続エラー:", err.message);
  } else {
    console.log("   ✅ データベース接続成功");

    // 問題数カウント
    db.get("SELECT COUNT(*) as count FROM questions", (err, row) => {
      if (err) {
        console.log("   ❌ クエリエラー:", err.message);
      } else {
        console.log("   - データベース内の問題数:", row.count + "問");
      }

      // カテゴリー別カウント
      db.all(
        "SELECT category_id, COUNT(*) as count FROM questions GROUP BY category_id",
        (err, rows) => {
          if (err) {
            console.log("   ❌ カテゴリー別クエリエラー:", err.message);
          } else {
            console.log("   - カテゴリー別:");
            rows.forEach((row) => {
              console.log(`     ${row.category_id}: ${row.count}問`);
            });
          }

          db.close();
          console.log("\n===== テスト完了 =====");
        },
      );
    });
  }
});
