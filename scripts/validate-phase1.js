#!/usr/bin/env node

/**
 * Phase 1修正検証: 第1問template_type修正結果確認
 * master-questions.tsを直接読み込んでデータ検証
 */

const fs = require("fs");
const path = require("path");

function validatePhase1() {
  console.log("🔍 Phase 1修正検証: 第1問template_type修正結果テスト");
  console.log("=====================================");

  // master-questions.tsファイルを読み込み
  const filePath = path.join(__dirname, "../src/data/master-questions.ts");
  const fileContent = fs.readFileSync(filePath, "utf8");

  // Q_J_*問題のtemplate_typeをチェック
  const qjMatches = fileContent.match(/id: "Q_J_\d+"/g);
  const totalQJQuestions = qjMatches ? qjMatches.length : 0;

  // "type":"journal_entry"の出現数をカウント
  const journalEntryMatches = fileContent.match(/"type":"journal_entry"/g);
  const journalEntryCount = journalEntryMatches
    ? journalEntryMatches.length
    : 0;

  // "type":"ledger_entry"の出現数をチェック（残っていないか確認）
  const ledgerEntryMatches = fileContent.match(/"type":"ledger_entry"/g);
  const ledgerEntryCount = ledgerEntryMatches ? ledgerEntryMatches.length : 0;

  // その他のtemplate_typeをチェック
  const multipleChoiceMatches = fileContent.match(/"type":"multiple_choice"/g);
  const multipleChoiceCount = multipleChoiceMatches
    ? multipleChoiceMatches.length
    : 0;

  const ledgerAccountMatches = fileContent.match(/"type":"ledger_account"/g);
  const ledgerAccountCount = ledgerAccountMatches
    ? ledgerAccountMatches.length
    : 0;

  const trialBalanceMatches = fileContent.match(/"type":"trial_balance"/g);
  const trialBalanceCount = trialBalanceMatches
    ? trialBalanceMatches.length
    : 0;

  const financialStatementMatches = fileContent.match(
    /"type":"financial_statement"/g,
  );
  const financialStatementCount = financialStatementMatches
    ? financialStatementMatches.length
    : 0;

  const worksheetMatches = fileContent.match(/"type":"worksheet"/g);
  const worksheetCount = worksheetMatches ? worksheetMatches.length : 0;

  console.log(`📊 検出結果:`);
  console.log(`  第1問（Q_J_*）問題数: ${totalQJQuestions}問`);
  console.log("");
  console.log("📈 Template Type統計:");
  console.log(`  journal_entry: ${journalEntryCount}問`);
  console.log(
    `  ledger_entry: ${ledgerEntryCount}問 ${ledgerEntryCount > 0 ? "❌" : "✅"}`,
  );
  console.log(`  ledger_account: ${ledgerAccountCount}問`);
  console.log(`  multiple_choice: ${multipleChoiceCount}問`);
  console.log(`  trial_balance: ${trialBalanceCount}問`);
  console.log(`  financial_statement: ${financialStatementCount}問`);
  console.log(`  worksheet: ${worksheetCount}問`);

  console.log("\n✅ Phase 1結果分析:");

  // Phase 1成功の判定（Q_J_*問題が全て"journal_entry"になっているか）
  const isPhase1Success =
    totalQJQuestions === 250 && // 250問の第1問が存在
    journalEntryCount >= 250 && // journal_entryが250個以上
    ledgerEntryCount === 0; // ledger_entryが残っていない

  console.log(`  第1問の期待問題数: 250問`);
  console.log(
    `  第1問の実際問題数: ${totalQJQuestions}問 ${totalQJQuestions === 250 ? "✅" : "❌"}`,
  );
  console.log(
    `  ledger_entry → journal_entry変換: ${ledgerEntryCount === 0 ? "✅ 完了" : "❌ 未完了"}`,
  );
  console.log(
    `  journal_entryテンプレート適用: ${journalEntryCount >= 250 ? "✅" : "❌"}`,
  );

  console.log(
    `\n🎯 Phase 1修正結果: ${isPhase1Success ? "✅ 成功" : "❌ 失敗"}`,
  );

  if (isPhase1Success) {
    console.log("🎉 Phase 1修正が正常に完了しました！");
    console.log(
      "💡 これにより第1問（仕訳問題）のCBT解答フォームが正常に機能します。",
    );
    console.log("🚀 次はPhase 2（第2問answer format修正）に進めます。");
  } else {
    console.log("❌ Phase 1修正で問題が発見されました。");
    if (ledgerEntryCount > 0) {
      console.log(`   - ${ledgerEntryCount}個のledger_entryが残っています`);
    }
    if (totalQJQuestions !== 250) {
      console.log(
        `   - Q_J_*問題数が期待値と異なります (期待: 250, 実際: ${totalQJQuestions})`,
      );
    }
  }

  return isPhase1Success;
}

// 実行
try {
  const success = validatePhase1();
  process.exit(success ? 0 : 1);
} catch (error) {
  console.error("❌ 検証スクリプトエラー:", error);
  process.exit(1);
}
