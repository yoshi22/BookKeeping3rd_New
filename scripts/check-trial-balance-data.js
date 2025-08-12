/**
 * 試算表問題の正答データを確認
 */
const { masterQuestions } = require("../src/data/master-questions.js");

// 試算表問題を抽出
const trialBalanceQuestions = masterQuestions.filter((q) =>
  q.id.startsWith("Q_T_"),
);

console.log("=== 試算表問題の正答データ確認 ===");
console.log("試算表問題数:", trialBalanceQuestions.length);

// 各問題の正答データを確認
trialBalanceQuestions.forEach((q) => {
  console.log("\n===================================");
  console.log("問題ID:", q.id);
  console.log("正答データ存在:", !!q.correct_answer_json);

  if (q.correct_answer_json) {
    try {
      const parsed = JSON.parse(q.correct_answer_json);
      console.log("正答データ形式:", Object.keys(parsed));

      if (parsed.entries) {
        console.log("entries数:", parsed.entries.length);
        if (parsed.entries.length > 0) {
          console.log(
            "最初のエントリ:",
            JSON.stringify(parsed.entries[0], null, 2),
          );

          // 借方・貸方の合計を計算
          const totalDebit = parsed.entries.reduce(
            (sum, e) => sum + (e.debitAmount || 0),
            0,
          );
          const totalCredit = parsed.entries.reduce(
            (sum, e) => sum + (e.creditAmount || 0),
            0,
          );
          console.log("借方合計:", totalDebit);
          console.log("貸方合計:", totalCredit);
          console.log(
            "バランス:",
            totalDebit === totalCredit ? "✅ 一致" : "⚠️ 不一致",
          );
        } else {
          console.log("⚠️ entries配列が空です");
        }
      } else {
        console.log("⚠️ entriesプロパティが存在しません");
        console.log("実際のデータ:", JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      console.log("❌ JSONパースエラー:", e.message);
    }
  } else {
    console.log("❌ 正答データ: null または undefined");
  }
});
