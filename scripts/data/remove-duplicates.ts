/**
 * master-questions.tsから重複Q2/Q3問題を削除するスクリプト
 */

import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🧹 重複問題削除スクリプト開始\n");

  const projectRoot = path.resolve(__dirname, "../..");
  const masterQuestionsPath = path.join(
    projectRoot,
    "src/data/master-questions.ts",
  );

  // master-questions.tsを読み込み
  console.log("📖 master-questions.ts読み込み中...");
  const masterContent = fs.readFileSync(masterQuestionsPath, "utf-8");

  // 問題配列を抽出
  const masterArrayMatch = masterContent.match(
    /export const masterQuestions: Question\[\] = \[([\s\S]*)\];/,
  );
  if (!masterArrayMatch) {
    throw new Error("master-questions.tsの形式が不正です");
  }
  const masterQuestionsStr = masterArrayMatch[1];

  // 問題を個別に分割
  const questionBlocks = masterQuestionsStr.split(/(?=\s+\{\s*\n\s*id: "Q)/);

  console.log(`📊 現在の問題数: ${questionBlocks.length - 1} 問\n`);

  // 重複を除去した問題を保持
  const uniqueQuestions = new Set<string>();
  const filteredBlocks: string[] = [];

  // ヘッダー部分（最初のブロック）を保持
  if (questionBlocks[0] && !questionBlocks[0].includes('id: "Q')) {
    filteredBlocks.push(questionBlocks[0]);
  }

  // 各問題をチェック
  for (const block of questionBlocks) {
    const idMatch = block.match(/id: "(Q[^"]+)"/);
    if (!idMatch) continue;

    const questionId = idMatch[1];

    // 既に追加済みならスキップ
    if (uniqueQuestions.has(questionId)) {
      console.log(`  🗑️  重複削除: ${questionId}`);
      continue;
    }

    uniqueQuestions.add(questionId);
    filteredBlocks.push(block);
  }

  console.log(`\n✅ 重複削除完了: ${uniqueQuestions.size} 問に整理\n`);

  // カテゴリ別統計
  const categoryCounts = {
    Q_J: Array.from(uniqueQuestions).filter((id) => id.startsWith("Q_J_"))
      .length,
    Q2_V: Array.from(uniqueQuestions).filter((id) => id.startsWith("Q2_V_"))
      .length,
    Q2_B: Array.from(uniqueQuestions).filter((id) => id.startsWith("Q2_B_"))
      .length,
    Q2_L: Array.from(uniqueQuestions).filter((id) => id.startsWith("Q2_L_"))
      .length,
    Q3_TB: Array.from(uniqueQuestions).filter((id) => id.startsWith("Q3_TB_"))
      .length,
    Q3_CTB: Array.from(uniqueQuestions).filter((id) => id.startsWith("Q3_CTB_"))
      .length,
    Q3_FS: Array.from(uniqueQuestions).filter((id) => id.startsWith("Q3_FS_"))
      .length,
  };

  console.log("📊 カテゴリ別問題数:");
  console.log(`  - 仕訳問題（Q_J）: ${categoryCounts.Q_J} 問`);
  console.log(`  - 語句記入（Q2_V）: ${categoryCounts.Q2_V} 問`);
  console.log(`  - 補助簿選択（Q2_B）: ${categoryCounts.Q2_B} 問`);
  console.log(`  - 穴埋め帳簿（Q2_L）: ${categoryCounts.Q2_L} 問`);
  console.log(`  - 試算表（Q3_TB）: ${categoryCounts.Q3_TB} 問`);
  console.log(`  - 残高試算表（Q3_CTB）: ${categoryCounts.Q3_CTB} 問`);
  console.log(`  - 財務諸表（Q3_FS）: ${categoryCounts.Q3_FS} 問`);
  console.log(`  - 合計: ${uniqueQuestions.size} 問\n`);

  // 新しいmaster-questions.tsを生成
  const mergedQuestionsStr = filteredBlocks.join("");
  const newMasterContent = `import { Question } from "../types/models";

export const masterQuestions: Question[] = [${mergedQuestionsStr}];
`;

  // ファイルに書き込み
  fs.writeFileSync(masterQuestionsPath, newMasterContent, "utf-8");
  console.log("✅ master-questions.tsを更新しました\n");

  console.log("🎉 重複削除完了！");
}

if (require.main === module) {
  main().catch(console.error);
}
