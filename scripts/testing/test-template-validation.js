#!/usr/bin/env node

/**
 * Phase 1修正検証スクリプト
 * 第1問のtemplate_type修正結果をvalidateAnswerTemplates()で確認
 */

const {
  QuestionRepository,
} = require("../src/data/repositories/question-repository");
const { masterQuestions } = require("../src/data/master-questions");

async function testTemplateValidation() {
  console.log("🔍 Phase 1修正検証: 第1問template_type修正結果テスト");
  console.log("=====================================");

  // Q_J_*問題のtemplate_type確認
  const journalQuestions = masterQuestions.filter((q) =>
    q.id.startsWith("Q_J_"),
  );
  console.log(`📊 第1問（仕訳問題）: ${journalQuestions.length}問`);

  // template_typeの統計
  const templateTypes = {};
  let validJournalEntryCount = 0;
  let invalidCount = 0;

  journalQuestions.forEach((q) => {
    try {
      const template = JSON.parse(q.answer_template_json);
      templateTypes[template.type] = (templateTypes[template.type] || 0) + 1;

      if (q.category_id === "journal" && template.type === "journal_entry") {
        validJournalEntryCount++;
      } else {
        invalidCount++;
        console.log(
          `❌ ${q.id}: category=${q.category_id}, template_type=${template.type}`,
        );
      }
    } catch (error) {
      console.log(`❌ ${q.id}: JSONパースエラー - ${error.message}`);
      invalidCount++;
    }
  });

  console.log("\n📈 Template Type統計:");
  Object.entries(templateTypes).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}問`);
  });

  console.log("\n✅ 結果サマリー:");
  console.log(`  正しいjournal_entry: ${validJournalEntryCount}問`);
  console.log(`  不正・エラー: ${invalidCount}問`);

  const isPhase1Success = validJournalEntryCount === 250 && invalidCount === 0;
  console.log(
    `\n🎯 Phase 1修正結果: ${isPhase1Success ? "✅ 成功" : "❌ 失敗"}`,
  );

  if (isPhase1Success) {
    console.log(
      "🎉 全250問の第1問でjournal_entryテンプレートが正しく適用されました！",
    );
    console.log("💡 これにより、CBT仕訳解答フォームが正常に機能します。");
  }

  return isPhase1Success;
}

// 実行
testTemplateValidation().catch((error) => {
  console.error("❌ 検証スクリプトエラー:", error);
  process.exit(1);
});
