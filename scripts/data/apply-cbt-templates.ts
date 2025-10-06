/**
 * CBTテンプレート統合スクリプト
 * Phase A生成済みテンプレートを master-questions.ts に適用
 */

import * as fs from "fs";
import * as path from "path";
import type { Question, CBTAnswerTemplate } from "../../src/types/models";

interface TemplateData {
  questionId: string;
  template: CBTAnswerTemplate;
}

// 生成済みテンプレートデータを読み込み
function loadJournalEntryTemplates(): TemplateData[] {
  const templatePath = path.join(__dirname, "journal-entry-templates.json");

  if (!fs.existsSync(templatePath)) {
    throw new Error(`テンプレートファイルが見つかりません: ${templatePath}`);
  }

  const templateData = fs.readFileSync(templatePath, "utf-8");
  return JSON.parse(templateData) as TemplateData[];
}

// master-questions.ts の内容を読み込み
function loadMasterQuestions(): string {
  const questionsPath = path.join(
    __dirname,
    "../../src/data/master-questions.ts",
  );
  return fs.readFileSync(questionsPath, "utf-8");
}

// 問題データにCBTテンプレートフィールドを追加
function applyTemplateToQuestion(
  questionData: string,
  templateData: TemplateData,
): string {
  const { questionId, template } = templateData;

  // 問題オブジェクトの開始から終了まで正確にマッチする
  // 1つの問題オブジェクトのみをマッチするため、より具体的な検索を行う
  const questionStart = questionData.indexOf(`id: "${questionId}"`);
  if (questionStart === -1) {
    console.warn(`問題 ${questionId} が見つかりません`);
    return questionData;
  }

  // 問題オブジェクトの開始点を見つける（{を逆方向に検索）
  let objectStart = questionStart;
  while (objectStart > 0 && questionData[objectStart] !== "{") {
    objectStart--;
  }

  // 問題オブジェクトの終了点を見つける（対応する}を検索）
  let braceCount = 0;
  let objectEnd = objectStart;
  while (objectEnd < questionData.length) {
    if (questionData[objectEnd] === "{") braceCount++;
    if (questionData[objectEnd] === "}") braceCount--;
    objectEnd++;
    if (braceCount === 0) break;
  }

  const beforeObject = questionData.substring(0, objectStart);
  const questionBody = questionData.substring(objectStart, objectEnd - 1); // -1 to exclude the final }

  // Check if there's already a comma after the object
  const afterObject = questionData.substring(objectEnd);
  const hasExistingComma = afterObject.startsWith(",");
  const closingBrace = hasExistingComma ? "}" : "},";
  const finalAfterObject = hasExistingComma
    ? afterObject.substring(1)
    : afterObject;

  // デバッグ: マッチした内容を確認
  if (questionId === "Q_L_001") {
    console.log(`=== ${questionId} のマッチした内容 ===`);
    console.log(`questionBody の最初の300文字:`);
    console.log(questionBody.substring(0, 300));
    console.log(`questionBody の最後の300文字:`);
    console.log(questionBody.substring(Math.max(0, questionBody.length - 300)));
    console.log(`=== 終了 ===`);
  }

  // 既存のテンプレートフィールドがあるかチェック
  const hasTemplateType = questionBody.includes("template_type:");
  const hasLayoutVariant = questionBody.includes("layout_variant:");
  const hasAllowedAccounts = questionBody.includes("allowed_accounts:");

  // デバッグ用ログ
  console.log(
    `${questionId}: template_type=${hasTemplateType}, layout_variant=${hasLayoutVariant}, allowed_accounts=${hasAllowedAccounts}`,
  );

  if (hasTemplateType && hasLayoutVariant && hasAllowedAccounts) {
    console.log(`${questionId}: CBTテンプレートフィールドは既に存在します`);
    return questionData;
  }

  // 新しいフィールドを追加
  const newFields = [];

  if (!hasTemplateType) {
    newFields.push(`    template_type: "${template.template_type}"`);
  }

  if (!hasLayoutVariant) {
    newFields.push(`    layout_variant: "${template.layout_variant}"`);
  }

  if (!hasAllowedAccounts) {
    const accountsJson = JSON.stringify(template.allowed_accounts, null, 6);
    newFields.push(`    allowed_accounts: ${accountsJson}`);
  }

  // updated_at フィールドの前に新しいフィールドを挿入
  const updatedAtPattern = /(\s*)(updated_at:)/;
  const replacement =
    newFields.length > 0 ? `,\n${newFields.join(",\n")},\n$1$2` : "$1$2";
  const updatedQuestionBody = questionBody.replace(
    updatedAtPattern,
    replacement,
  );

  return beforeObject + updatedQuestionBody + closingBrace + finalAfterObject;
}

// メイン実行関数
async function applyCBTTemplates(): Promise<void> {
  console.log("🔄 Q_J_001-250仕訳問題テンプレート統合を開始します...");

  try {
    // テンプレートデータを読み込み
    const templates = loadJournalEntryTemplates();
    console.log(`📋 読み込み完了: ${templates.length}個の仕訳テンプレート`);

    // master-questions.ts を読み込み
    let questionsData = loadMasterQuestions();
    console.log("📖 master-questions.ts を読み込みました");

    // 各テンプレートを適用
    let appliedCount = 0;
    for (const template of templates) {
      const beforeData = questionsData;
      questionsData = applyTemplateToQuestion(questionsData, template);

      // 実際に変更があったかチェック（内容比較）
      if (questionsData !== beforeData) {
        appliedCount++;
        console.log(
          `✅ ${template.questionId}: ${template.template.template_type} テンプレート適用完了`,
        );
      } else {
        console.log(
          `⚠️ ${template.questionId}: テンプレート適用がスキップされました`,
        );
      }
    }

    // バックアップを作成
    const backupPath = path.join(
      __dirname,
      "../../src/data/master-questions.ts.backup-" + Date.now(),
    );
    const originalPath = path.join(
      __dirname,
      "../../src/data/master-questions.ts",
    );
    fs.copyFileSync(originalPath, backupPath);
    console.log(`💾 バックアップ作成: ${path.basename(backupPath)}`);

    // 更新されたファイルを保存
    fs.writeFileSync(originalPath, questionsData, "utf-8");
    console.log("💾 master-questions.ts を更新しました");

    console.log(`\n🎉 Q_J_001-250仕訳問題テンプレート統合完了!`);
    console.log(`📊 統計:`);
    console.log(`  - 対象テンプレート: ${templates.length}個`);
    console.log(`  - 適用完了: ${appliedCount}個`);
    console.log(`  - スキップ: ${templates.length - appliedCount}個`);

    // テンプレート種別統計
    const templateTypes = templates.reduce(
      (acc, { template }) => {
        acc[template.template_type] = (acc[template.template_type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    console.log(`\n📈 テンプレート種別統計:`);
    Object.entries(templateTypes).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}問`);
    });
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    throw error;
  }
}

// 実行
if (require.main === module) {
  applyCBTTemplates().catch(console.error);
}

export { applyCBTTemplates };
