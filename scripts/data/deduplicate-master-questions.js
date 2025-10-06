/**
 * master-questions.tsの重複除去スクリプト
 */

const fs = require("fs");
const path = require("path");

const masterPath = path.resolve(
  __dirname,
  "../../src/data/master-questions.ts",
);
const content = fs.readFileSync(masterPath, "utf-8");

// 問題配列を抽出
const match = content.match(
  /export const masterQuestions: Question\[\] = \[([\s\S]*)\];/,
);
if (!match) {
  console.error("配列抽出失敗");
  process.exit(1);
}

const questionsStr = match[1];

// 各問題ブロックを分割
const blocks = questionsStr.split(/(?=\s+\{\s*\n\s*id: "Q)/);
const header = blocks[0];

// 問題IDごとにグループ化（重複除去）
const questionMap = new Map();

blocks.slice(1).forEach((block) => {
  const idMatch = block.match(/id: "(Q[^"]+)"/);
  if (idMatch) {
    const id = idMatch[1];

    if (questionMap.has(id)) {
      // 既存の問題がある場合、より詳細な方を保持
      const existing = questionMap.get(id);

      // category_id: "trial_balance" を優先
      if (
        block.includes('category_id: "trial_balance"') &&
        !existing.includes('category_id: "trial_balance"')
      ) {
        questionMap.set(id, block);
      }
      // category_id: "ledger" で question_text が長い方を優先
      else if (
        block.includes('category_id: "ledger"') &&
        existing.includes('category_id: "ledger"')
      ) {
        const blockTextMatch = block.match(/question_text: "([^"]*)"/);
        const existingTextMatch = existing.match(/question_text: "([^"]*)"/);

        if (blockTextMatch && existingTextMatch) {
          if (blockTextMatch[1].length > existingTextMatch[1].length) {
            questionMap.set(id, block);
          }
        }
      }
    } else {
      questionMap.set(id, block);
    }
  }
});

console.log(`重複除去前: ${blocks.length - 1} 問`);
console.log(`重複除去後: ${questionMap.size} 問`);

// 問題IDでソート
const sortedIds = Array.from(questionMap.keys()).sort((a, b) => {
  // Q_J_, Q2_, Q3_でグループ分け
  const aPrefix = a.match(/^Q[_0-9]+/)[0];
  const bPrefix = b.match(/^Q[_0-9]+/)[0];

  if (aPrefix !== bPrefix) return aPrefix.localeCompare(bPrefix);

  const aNum = parseInt(a.match(/\d+$/)[0]);
  const bNum = parseInt(b.match(/\d+$/)[0]);
  return aNum - bNum;
});

// 重複除去後の問題を結合
const deduplicatedBlocks = sortedIds.map((id) => questionMap.get(id));

// 新しいファイル内容を生成
const newContent = `import { Question } from "../types/models";

export const masterQuestions: Question[] = [${header}${deduplicatedBlocks.join(",\n")}
];
`;

// ファイルに書き込み
fs.writeFileSync(masterPath, newContent, "utf-8");

console.log("✅ master-questions.ts重複除去完了");

// 統計情報
const q2Count = sortedIds.filter((id) => id.startsWith("Q2_")).length;
const q3Count = sortedIds.filter((id) => id.startsWith("Q3_")).length;
const qjCount = sortedIds.filter((id) => id.startsWith("Q_J_")).length;

console.log(`📊 統計:`);
console.log(`  - Q_J問題: ${qjCount} 問`);
console.log(`  - Q2問題: ${q2Count} 問`);
console.log(`  - Q3問題: ${q3Count} 問`);
console.log(`  - 合計: ${questionMap.size} 問`);
