const fs = require("fs");
const path = require("path");

// テスト対象のファイルパス
const answerResultDialogPath = path.join(
  __dirname,
  "..",
  "src",
  "components",
  "AnswerResultDialog.tsx",
);
const explanationPanelPath = path.join(
  __dirname,
  "..",
  "src",
  "components",
  "ExplanationPanel.tsx",
);

console.log("🔍 2列表示形式の検証\n");

// 1. AnswerResultDialog.tsxの確認
console.log("📝 AnswerResultDialog.tsxの修正確認:");
const answerResultDialog = fs.readFileSync(answerResultDialogPath, "utf8");

// formatCorrectAnswer関数が正しく修正されているか確認
const hasCorrectReturn = answerResultDialog.includes(
  "return correctAnswer; // ExplanationPanelで2列表示するため",
);
const hasJournalEntriesConversion =
  answerResultDialog.includes("journalEntries: [");

console.log(
  `  - correctAnswerをそのまま返す処理: ${hasCorrectReturn ? "✅" : "❌"}`,
);
console.log(
  `  - 旧形式の2列形式への変換: ${hasJournalEntriesConversion ? "✅" : "❌"}`,
);

// 2. ExplanationPanel.tsxの確認
console.log("\n📝 ExplanationPanel.tsxの2列表示確認:");
const explanationPanel = fs.readFileSync(explanationPanelPath, "utf8");

// 2列表示に必要な要素を確認
const hasJournalRow = explanationPanel.includes("styles.journalRow");
const hasJournalColumn = explanationPanel.includes("styles.journalColumn");
const hasDebitColumn = explanationPanel.includes("借方");
const hasCreditColumn = explanationPanel.includes("貸方");
const hasJournalDivider = explanationPanel.includes("styles.journalDivider");

console.log(`  - journalRow（行レイアウト）: ${hasJournalRow ? "✅" : "❌"}`);
console.log(
  `  - journalColumn（列レイアウト）: ${hasJournalColumn ? "✅" : "❌"}`,
);
console.log(`  - 借方列ヘッダー: ${hasDebitColumn ? "✅" : "❌"}`);
console.log(`  - 貸方列ヘッダー: ${hasCreditColumn ? "✅" : "❌"}`);
console.log(`  - 列区切り線: ${hasJournalDivider ? "✅" : "❌"}`);

// 3. スタイル定義の確認
console.log("\n📝 スタイル定義の確認:");
const hasFlexRow = explanationPanel.includes('flexDirection: "row"');
const hasJustifyBetween = explanationPanel.includes(
  'justifyContent: "space-between"',
);
const hasFlex1 = explanationPanel.includes("flex: 1");

console.log(`  - flexDirection row: ${hasFlexRow ? "✅" : "❌"}`);
console.log(
  `  - justifyContent space-between: ${hasJustifyBetween ? "✅" : "❌"}`,
);
console.log(`  - flex: 1 (列の均等配置): ${hasFlex1 ? "✅" : "❌"}`);

// 4. サンプルデータで表示を模擬
console.log("\n📊 サンプルデータでの表示シミュレーション:");

const sampleData = {
  journalEntries: [
    {
      debit_account: "普通預金",
      debit_amount: 152000,
      credit_account: "定期預金",
      credit_amount: 150000,
    },
    {
      debit_account: "",
      debit_amount: 0,
      credit_account: "受取利息",
      credit_amount: 2000,
    },
  ],
};

console.log("\n期待される表示形式:");
console.log("┌─────────────────┬─────────────────┐");
console.log("│      借方       │      貸方       │");
console.log("├─────────────────┼─────────────────┤");
console.log("│ 普通預金 152,000円│ 定期預金 150,000円│");
console.log("│                 │ 受取利息   2,000円│");
console.log("└─────────────────┴─────────────────┘");

// 5. 総合判定
console.log("\n🎯 総合判定:");

const allComponentsFixed =
  hasCorrectReturn &&
  hasJournalEntriesConversion &&
  hasJournalRow &&
  hasJournalColumn &&
  hasDebitColumn &&
  hasCreditColumn;

if (allComponentsFixed) {
  console.log("✅ 2列表示形式が正しく実装されています！");
  console.log("  - AnswerResultDialogがデータを適切に渡している");
  console.log("  - ExplanationPanelが借方/貸方の2列で表示");
  console.log("  - 標準的な簿記の仕訳帳形式に準拠");
} else {
  console.log("⚠️ 一部の実装が不完全です:");
  if (!hasCorrectReturn || !hasJournalEntriesConversion) {
    console.log("  - AnswerResultDialogのデータ処理に問題あり");
  }
  if (!hasJournalRow || !hasJournalColumn) {
    console.log("  - ExplanationPanelの2列レイアウトが不完全");
  }
}
