/**
 * Template field cleanup script
 * Removes existing CBT template fields from master-questions.ts
 */

import * as fs from "fs";
import * as path from "path";

// Remove existing template fields from question data
function removeTemplateFields(questionData: string): string {
  // Remove template_type field
  questionData = questionData.replace(/,?\s*template_type:\s*"[^"]*"/g, "");

  // Remove layout_variant field
  questionData = questionData.replace(/,?\s*layout_variant:\s*"[^"]*"/g, "");

  // Remove allowed_accounts field (more complex due to array structure)
  questionData = questionData.replace(
    /,?\s*allowed_accounts:\s*\[[^\]]*\]/g,
    "",
  );

  return questionData;
}

// Main execution function
async function cleanTemplateFields(): Promise<void> {
  console.log("🧹 テンプレートフィールド削除を開始します...");

  try {
    // Read master-questions.ts
    const questionsPath = path.join(
      __dirname,
      "../../src/data/master-questions.ts",
    );
    let questionsData = fs.readFileSync(questionsPath, "utf-8");
    console.log("📖 master-questions.ts を読み込みました");

    // Create backup
    const backupPath = path.join(
      __dirname,
      "../../src/data/master-questions.ts.backup-cleanup-" + Date.now(),
    );
    fs.copyFileSync(questionsPath, backupPath);
    console.log(`💾 バックアップ作成: ${path.basename(backupPath)}`);

    // Remove template fields
    const cleanedData = removeTemplateFields(questionsData);

    // Save cleaned file
    fs.writeFileSync(questionsPath, cleanedData, "utf-8");
    console.log("💾 master-questions.ts をクリーンアップしました");

    console.log("\n🎉 テンプレートフィールド削除完了!");
    console.log("これで新しいテンプレートを適用できます。");
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    throw error;
  }
}

// Execute
if (require.main === module) {
  cleanTemplateFields().catch(console.error);
}

export { cleanTemplateFields };
