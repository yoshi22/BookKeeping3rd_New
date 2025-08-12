#!/usr/bin/env node

/**
 * 仕訳問題修正の検証スクリプト
 *
 * 修正内容を検証し、問題がないか確認する
 */

const fs = require("fs");
const path = require("path");

const MASTER_QUESTIONS_PATH = path.join(
  __dirname,
  "../src/data/master-questions.js",
);

function validateJournalFixes() {
  console.log("🔍 仕訳問題修正の検証を開始します...");

  try {
    const content = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf8");

    let totalJournalQuestions = 0;
    let correctTemplates = 0;
    let incorrectTemplates = 0;
    const issues = [];

    // Q_J_問題を探して検証
    const journalQuestionRegex =
      /id: "Q_J_(\d+)",[\s\S]*?answer_template_json: '([^']*)',/g;
    let match;

    while ((match = journalQuestionRegex.exec(content)) !== null) {
      const questionId = `Q_J_${match[1]}`;
      const templateJson = match[2];
      totalJournalQuestions++;

      try {
        const template = JSON.parse(templateJson);

        // テンプレート検証
        if (template.type === "journal_entry") {
          correctTemplates++;

          // 追加検証：必要なフィールドがあるか
          const requiredFields = [
            "debit_account",
            "debit_amount",
            "credit_account",
            "credit_amount",
          ];
          const hasAllFields =
            template.fields &&
            requiredFields.every((field) =>
              template.fields.some((f) => f.name === field),
            );

          if (!hasAllFields) {
            issues.push(`${questionId}: 必要なフィールドが不足`);
          }

          // allowMultipleEntriesがあるか確認
          if (!template.allowMultipleEntries) {
            issues.push(
              `${questionId}: allowMultipleEntriesが設定されていない`,
            );
          }

          console.log(`✅ ${questionId}: 正しいテンプレート`);
        } else {
          incorrectTemplates++;
          issues.push(
            `${questionId}: テンプレートタイプが間違っています (${template.type})`,
          );
          console.log(
            `❌ ${questionId}: 間違ったテンプレート (${template.type})`,
          );
        }
      } catch (parseError) {
        incorrectTemplates++;
        issues.push(`${questionId}: JSONの解析エラー - ${parseError.message}`);
        console.log(`❌ ${questionId}: JSON解析エラー`);
      }
    }

    console.log("\n📊 検証結果:");
    console.log(`📝 総仕訳問題数: ${totalJournalQuestions}問`);
    console.log(`✅ 正しいテンプレート: ${correctTemplates}問`);
    console.log(`❌ 問題のあるテンプレート: ${incorrectTemplates}問`);

    if (issues.length > 0) {
      console.log("\n⚠️  発見された問題:");
      issues.forEach((issue) => console.log(`  • ${issue}`));
    }

    // 特定の問題をテスト
    console.log("\n🧪 特定問題のテスト:");
    const testQuestions = ["Q_J_006", "Q_J_007", "Q_J_009", "Q_J_012"];

    testQuestions.forEach((questionId) => {
      const questionRegex = new RegExp(
        `id: "${questionId}",[\\s\\S]*?answer_template_json: '([^']*)',`,
      );
      const questionMatch = content.match(questionRegex);

      if (questionMatch) {
        try {
          const template = JSON.parse(questionMatch[1]);
          if (template.type === "journal_entry") {
            console.log(`✅ ${questionId}: 修正済み - journal_entry形式`);
          } else {
            console.log(`❌ ${questionId}: 未修正 - ${template.type}形式`);
          }
        } catch (error) {
          console.log(`❌ ${questionId}: JSON解析エラー`);
        }
      } else {
        console.log(`❓ ${questionId}: 問題が見つかりません`);
      }
    });

    // 結果サマリー
    if (incorrectTemplates === 0 && issues.length === 0) {
      console.log("\n🎉 全ての仕訳問題が正しく修正されています！");
      console.log("✨ 修正は成功しました。");
      return true;
    } else {
      console.log("\n⚠️  まだ修正が必要な問題があります。");
      return false;
    }
  } catch (error) {
    console.error("❌ 検証エラー:", error.message);
    return false;
  }
}

// UI Components検証
function validateUIComponents() {
  console.log("\n🖥️  UIコンポーネントの検証...");

  const componentsToCheck = [
    "../src/components/QuestionDisplay.tsx",
    "../src/components/JournalEntryForm.tsx",
  ];

  let allComponentsExist = true;

  componentsToCheck.forEach((componentPath) => {
    const fullPath = path.join(__dirname, componentPath);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${path.basename(componentPath)}: 存在します`);
    } else {
      console.log(`❌ ${path.basename(componentPath)}: 見つかりません`);
      allComponentsExist = false;
    }
  });

  return allComponentsExist;
}

console.log("🚀 仕訳問題修正検証スクリプト");
console.log("━".repeat(50));

const templateValidation = validateJournalFixes();
const componentValidation = validateUIComponents();

console.log("\n📋 最終結果:");
console.log(`テンプレート修正: ${templateValidation ? "✅ 成功" : "❌ 失敗"}`);
console.log(`UIコンポーネント: ${componentValidation ? "✅ 成功" : "❌ 失敗"}`);

if (templateValidation && componentValidation) {
  console.log("\n🎉 仕訳問題の修正が完了しました！");
  console.log("📱 アプリで仕訳問題を試してみてください。");
} else {
  console.log("\n⚠️  まだ作業が必要です。上記の問題を確認してください。");
  process.exit(1);
}
