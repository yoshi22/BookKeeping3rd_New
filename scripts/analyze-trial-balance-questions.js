/**
 * 試算表問題の問題文を解析して正答データを生成
 */

const { masterQuestions } = require("../src/data/master-questions.js");

// 試算表問題のみを抽出
const trialBalanceQuestions = masterQuestions.filter((q) =>
  q.id.startsWith("Q_T_"),
);

console.log(`試算表問題数: ${trialBalanceQuestions.length}`);
console.log("\n各問題の詳細:\n");

trialBalanceQuestions.forEach((q, index) => {
  console.log(`\n========== ${q.id} ==========`);
  console.log(`問題文: ${q.question_text}`);

  // 現在の正答データを確認
  try {
    const currentAnswer = JSON.parse(q.correct_answer_json);
    console.log("\n現在の正答データ:");
    if (currentAnswer.entries) {
      console.log(`  エントリー数: ${currentAnswer.entries.length}`);
      // 最初の3つのエントリーを表示
      currentAnswer.entries.slice(0, 3).forEach((entry) => {
        console.log(
          `  - ${entry.accountName}: 借方=${entry.debitAmount}, 貸方=${entry.creditAmount}`,
        );
      });
      if (currentAnswer.entries.length > 3) {
        console.log(`  ... 他 ${currentAnswer.entries.length - 3} エントリー`);
      }
    } else {
      console.log("  エントリーなし");
    }
  } catch (e) {
    console.log("\n正答データのパースエラー:", e.message);
  }

  // 問題文から金額を抽出
  console.log("\n問題文から抽出した金額:");
  const amountPattern = /([^、。]+?)([\d,]+)円/g;
  let match;
  while ((match = amountPattern.exec(q.question_text)) !== null) {
    const context = match[1].slice(-20); // 金額の前の20文字を取得
    const amount = match[2].replace(/,/g, "");
    console.log(`  ${context}${amount}円`);
  }
});
