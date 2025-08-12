#!/usr/bin/env node

/**
 * 全問題から「学習のコツ」セクションを削除
 * 汎用的で個別化されていない内容のため削除
 */

const fs = require("fs");
const path = require("path");

// TypeScriptファイルを読み込む
const tsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
const content = fs.readFileSync(tsFilePath, "utf8");

console.log("🔧 学習のコツセクションを削除中...\n");

// データを抽出
const startPattern = /export const masterQuestions[^=]*=\s*\[/;
const startMatch = content.match(startPattern);
const startIndex = startMatch.index + startMatch[0].length - 1;

let depth = 0;
let endIndex = -1;
let inString = false;
let escapeNext = false;

for (let i = startIndex; i < content.length; i++) {
  const char = content[i];

  if (escapeNext) {
    escapeNext = false;
    continue;
  }

  if (char === "\\") {
    escapeNext = true;
    continue;
  }

  if (char === '"' && !inString) {
    inString = true;
  } else if (char === '"' && inString) {
    inString = false;
  }

  if (!inString) {
    if (char === "[" || char === "{") {
      depth++;
    } else if (char === "]" || char === "}") {
      depth--;
      if (depth === 0 && char === "]") {
        endIndex = i + 1;
        break;
      }
    }
  }
}

const dataString = content.substring(startIndex, endIndex);
const questions = eval(dataString);

// 学習のコツセクションを削除
let updatedCount = 0;
questions.forEach((question) => {
  const originalExplanation = question.explanation;

  // 学習のコツセクションを削除（⚠️の後から💡の部分全体を削除）
  let newExplanation = originalExplanation;

  // パターン1: \\n\\n💡 学習のコツ：で始まる部分を削除
  const learningTipsPattern = /\\n\\n💡 学習のコツ：[^]*$/;
  if (learningTipsPattern.test(newExplanation)) {
    newExplanation = newExplanation.replace(learningTipsPattern, "");
    updatedCount++;
  }

  // パターン2: 実際の改行文字がある場合
  const learningTipsPattern2 = /\n\n💡 学習のコツ：[^]*$/;
  if (learningTipsPattern2.test(newExplanation)) {
    newExplanation = newExplanation.replace(learningTipsPattern2, "");
    updatedCount++;
  }

  question.explanation = newExplanation;
});

// TypeScriptファイルを再構築
const beforeData = content.substring(0, startIndex);
const afterData = content.substring(endIndex);

// 元のフォーマットに戻す
const formattedQuestions = questions
  .map((q) => {
    // explanationフィールドのエスケープ処理
    const escapedExplanation = q.explanation
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n");

    return `  {
    id: "${q.id}",
    category_id: "${q.category_id}",
    difficulty: ${q.difficulty},
    question_text: "${q.question_text.replace(/"/g, '\\"').replace(/\n/g, "\\n")}",
    answer_template_json: "${q.answer_template_json.replace(/"/g, '\\"')}",
    correct_answer_json: "${q.correct_answer_json.replace(/"/g, '\\"')}",
    explanation: "${escapedExplanation}",
    tags_json: "${q.tags_json.replace(/"/g, '\\"')}",
    created_at: "${q.created_at}",
    updated_at: "${q.updated_at}"
  }`;
  })
  .join(",\n");

const newContent = beforeData + "[\n" + formattedQuestions + "\n]" + afterData;
fs.writeFileSync(tsFilePath, newContent, "utf8");

console.log(`✅ ${updatedCount}問から学習のコツセクションを削除しました！\n`);

console.log("📋 削除内容:");
console.log("  - 💡 学習のコツセクション（汎用的な内容）");
console.log("  - 個別化されていない学習アドバイス");
console.log("\n📌 残った内容:");
console.log("  - 問題固有の詳細解説");
console.log("  - ⚠️ 間違えやすいポイント（具体的な注意点）");

console.log("\n✨ 修正が完了しました！");
