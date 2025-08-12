#!/usr/bin/env node

/**
 * JavaScriptファイルからTypeScriptファイルを完全再構築
 */

const fs = require("fs");
const path = require("path");

const tsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
const jsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.js",
);

console.log(
  "🔄 master-questions.ts を master-questions.js から完全再構築中...\n",
);

// JavaScriptファイルを読み込んでparseする
const jsContent = fs.readFileSync(jsFilePath, "utf8");

// exports.masterQuestions = [...]の部分を抽出
const questionsMatch = jsContent.match(
  /exports\.masterQuestions = (\[[^\]]*\]);/s,
);
if (!questionsMatch) {
  console.error("❌ JavaScriptファイルからquestions配列を抽出できませんでした");
  process.exit(1);
}

// evalでJavaScriptオブジェクトを取得
let questions;
try {
  eval("questions = " + questionsMatch[1]);
  console.log(`✅ ${questions.length} 問の問題データを読み込みました`);
} catch (error) {
  console.error("❌ JavaScript問題データのparse失敗:", error);
  process.exit(1);
}

// TypeScript形式で完全に新しいファイルを作成
console.log("📝 新しいTypeScriptファイルを作成中...");

const tsContent = `/**
 * Master questions data
 * Generated from master-questions.js
 */

export interface Question {
  id: string;
  category_id: string;
  question_text: string;
  answer_template_json: string;
  correct_answer_json: string;
  explanation: string;
  difficulty: number;
  tags_json: string;
  created_at: string;
  updated_at: string;
}

export const masterQuestions: Question[] = ${JSON.stringify(questions, null, 2)};
`;

// 新しいファイルを書き込み
fs.writeFileSync(tsFilePath, tsContent, "utf8");

console.log("✅ 新しいmaster-questions.tsファイルを作成しました");

// TypeScriptエラーをチェック
console.log("🔍 TypeScript構文チェック中...");
const { exec } = require("child_process");

exec(
  'npx tsc --noEmit --project . 2>&1 | grep -E "(master-questions.ts|error)"',
  (error, stdout, stderr) => {
    if (stdout.trim()) {
      console.log("\n❌ TypeScriptエラー:");
      console.log(stdout);
    } else {
      console.log("\n✅ TypeScript構文エラーなし！ファイル再構築成功です。");
    }
  },
);
