/**
 * master-questions.tsの統合スクリプト
 *
 * 既存のQ_L/Q_T問題を削除し、新しい変換済み問題を追加
 */

import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 master-questions.ts統合開始\n");

  const projectRoot = path.resolve(__dirname, "../..");
  const masterQuestionsPath = path.join(
    projectRoot,
    "src/data/master-questions.ts",
  );
  const convertedQuestionsPath = path.join(
    projectRoot,
    "scripts/data/converted-questions.ts",
  );

  // 既存のmaster-questions.tsを読み込み
  console.log("📖 master-questions.ts読み込み中...");
  const masterContent = fs.readFileSync(masterQuestionsPath, "utf-8");

  // converted-questions.tsを読み込み
  console.log("📖 converted-questions.ts読み込み中...");
  const convertedContent = fs.readFileSync(convertedQuestionsPath, "utf-8");

  // convertedQuestionsから問題配列部分だけを抽出
  const convertedArrayMatch = convertedContent.match(
    /export const convertedQuestions: Question\[\] = \[([\s\S]*)\];/,
  );
  if (!convertedArrayMatch) {
    throw new Error("converted-questions.tsの形式が不正です");
  }
  const convertedQuestionsStr = convertedArrayMatch[1];

  // master-questions.tsから問題配列を抽出
  const masterArrayMatch = masterContent.match(
    /export const masterQuestions: Question\[\] = \[([\s\S]*)\];/,
  );
  if (!masterArrayMatch) {
    throw new Error("master-questions.tsの形式が不正です");
  }
  const masterQuestionsStr = masterArrayMatch[1];

  // 既存の問題を個別に分割（id: "Q_XXX" で始まる各ブロック）
  const questionBlocks = masterQuestionsStr.split(/(?=\s+\{\s*\n\s*id: "Q_)/);

  // Q_L と Q_T 以外の問題を保持
  const filteredBlocks = questionBlocks.filter((block) => {
    const idMatch = block.match(/id: "Q_([A-Z]+)_(\d+)"/);
    if (!idMatch) return true; // ヘッダー部分等を保持

    const category = idMatch[1];
    return category !== "L" && category !== "T";
  });

  console.log(`📊 既存問題統計:`);
  console.log(`  - 全問題数: ${questionBlocks.length - 1} 問`); // -1 はヘッダー除外
  console.log(
    `  - Q_L問題: ${questionBlocks.filter((b) => /id: "Q_L_/.test(b)).length} 問（削除対象）`,
  );
  console.log(
    `  - Q_T問題: ${questionBlocks.filter((b) => /id: "Q_T_/.test(b)).length} 問（削除対象）`,
  );
  console.log(`  - 残存問題: ${filteredBlocks.length - 1} 問\n`);

  // 新しい問題を追加
  const mergedQuestionsStr =
    filteredBlocks.join("") + "," + convertedQuestionsStr;

  // 新しいmaster-questions.tsを生成
  const newMasterContent = `import { Question } from "../types/models";

export const masterQuestions: Question[] = [${mergedQuestionsStr}];
`;

  // ファイルに書き込み
  fs.writeFileSync(masterQuestionsPath, newMasterContent, "utf-8");
  console.log(`✅ master-questions.tsを更新しました\n`);

  // 最終統計
  const finalQuestionCount = filteredBlocks.length - 1 + 120; // -1はヘッダー、+120は新規問題
  console.log("📊 最終統計:");
  console.log(`  - 仕訳問題（Q_J）: 変更なし`);
  console.log(`  - 帳簿問題（Q2_V/B/L）: 70 問（新規）`);
  console.log(`  - 試算表問題（Q3_TB/CTB/FS）: 50 問（新規）`);
  console.log(`  - 合計: ~${finalQuestionCount} 問`);

  console.log("\n🎉 統合完了！");
}

if (require.main === module) {
  main().catch(console.error);
}
