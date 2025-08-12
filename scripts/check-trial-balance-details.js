/**
 * 試算表問題の詳細チェック
 */

const { masterQuestions } = require("../src/data/master-questions.js");

// 試算表問題のみ抽出
const trialBalanceQuestions = masterQuestions.filter(
  (q) => q.category_id === "trial_balance",
);

console.log("=== 試算表問題の詳細分析 ===\n");
console.log(`試算表問題数: ${trialBalanceQuestions.length}\n`);

// 各問題を詳細に分析
trialBalanceQuestions.forEach((q, index) => {
  console.log(`\n【${index + 1}. ${q.id}】`);
  console.log(`問題文: ${q.question_text.substring(0, 100)}...`);

  // テンプレート解析
  try {
    const template = JSON.parse(q.answer_template_json);
    console.log("\nテンプレート構造:");
    console.log(`  type: ${template.type}`);
    console.log(`  fields数: ${template.fields ? template.fields.length : 0}`);
    if (template.fields) {
      console.log("  フィールド:");
      template.fields.forEach((f) => {
        console.log(`    - ${f.name} (${f.type}): ${f.label}`);
      });
    }
  } catch (e) {
    console.log("  テンプレート解析エラー:", e.message);
  }

  // 正答解析
  try {
    const correct = JSON.parse(q.correct_answer_json);
    console.log("\n正答構造:");
    const keys = Object.keys(correct);
    console.log(`  最上位キー: ${keys.join(", ")}`);

    if (correct.trialBalance) {
      const balanceKeys = Object.keys(correct.trialBalance.balances || {});
      console.log(`  残高数: ${balanceKeys.length}`);
      if (balanceKeys.length === 0) {
        console.log("  ⚠️ 警告: 残高データが空です！");
      } else {
        console.log("  勘定科目リスト:");
        balanceKeys.slice(0, 5).forEach((key) => {
          console.log(`    - ${key}: ${correct.trialBalance.balances[key]}`);
        });
        if (balanceKeys.length > 5) {
          console.log(`    ... 他 ${balanceKeys.length - 5} 件`);
        }
      }
    } else {
      console.log("  ⚠️ trialBalanceキーが存在しません");
    }
  } catch (e) {
    console.log("  正答解析エラー:", e.message);
  }

  console.log("\n" + "=".repeat(60));
});

// UIコンポーネントとの整合性チェック
console.log("\n\n=== UIコンポーネントとの整合性チェック ===\n");
console.log("TrialBalanceForm.tsx が期待する形式:");
console.log(
  "  - answer_template_json: { type: 'trial_balance', accounts: [...], columns: [...] }",
);
console.log(
  "  - correct_answer_json: { entries: [{ accountName, debitAmount, creditAmount }] }",
);

console.log("\n現在のデータ形式:");
console.log(
  "  - answer_template_json: { type: 'ledger_entry', fields: [...] }",
);
console.log("  - correct_answer_json: { trialBalance: { balances: {} } }");

console.log("\n結論: データ形式が完全に不一致。修正が必要です。");
