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

// JavaScriptファイルを読み込む
const jsContent = fs.readFileSync(jsFilePath, "utf8");

// exports.masterQuestions = [で始まる配列を抽出
const startPattern = "exports.masterQuestions = [";
const endPattern = "];";

const startIndex = jsContent.indexOf(startPattern);
const endIndex = jsContent.indexOf(endPattern, startIndex);

if (startIndex === -1 || endIndex === -1) {
  console.error("❌ JavaScriptファイルからquestions配列を抽出できませんでした");
  process.exit(1);
}

// 配列部分だけ抽出  
const arrayContent = jsContent.substring(startIndex + startPattern.length - 1, endIndex + 1);

// questionStatistics部分も抽出
const statsPattern = "exports.questionStatistics = ";
const statsStartIndex = jsContent.indexOf(statsPattern);
let questionStatistics = null;

if (statsStartIndex !== -1) {
  const statsContent = jsContent.substring(statsStartIndex + statsPattern.length);
  const statsEndIndex = statsContent.indexOf(';');
  if (statsEndIndex !== -1) {
    const statsObject = statsContent.substring(0, statsEndIndex);
    try {
      eval("questionStatistics = " + statsObject);
      console.log("✅ questionStatistics も読み込みました");
    } catch (error) {
      console.log("⚠️  questionStatistics読み込みに失敗しました:", error);
    }
  }
}

// evalでJavaScriptオブジェクトを取得
let questions;
try {
  eval("questions = " + arrayContent);
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

${questionStatistics ? `export const questionStatistics = ${JSON.stringify(questionStatistics, null, 2)};` : ''}
`;

// 新しいファイルを書き込み
fs.writeFileSync(tsFilePath, tsContent, "utf8");

console.log("✅ 新しいmaster-questions.tsファイルを作成しました");
console.log("🔍 TypeScript構文チェック中...");

// TypeScriptエラーをチェック
const { exec } = require("child_process");
exec(
  'npx tsc --noEmit --project . 2>&1 | grep -E "(master-questions.ts|error)" | head -5',
  (error, stdout, stderr) => {
    if (stdout.trim()) {
      console.log("\n❌ TypeScriptエラー:");
      console.log(stdout);
    } else {
      console.log("\n✅ TypeScript構文エラーなし！ファイル再構築成功です。");
    }
  },
);
