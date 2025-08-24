#!/usr/bin/env node

/**
 * 問題データ抽出デバッグスクリプト
 * master-questions.tsからの問題抽出ロジックをデバッグ
 */

const fs = require("fs");
const path = require("path");

// TypeScript問題データファイル読み込み
const masterQuestionsPath = path.join(
  __dirname,
  "../../src/data/master-questions.ts",
);

console.log("🔍 問題データ抽出デバッグ開始");
console.log("============================");

// ファイル読み込み
const content = fs.readFileSync(masterQuestionsPath, "utf8");
console.log("✅ ファイル読み込み完了");

// 最初の問題だけを詳細にデバッグ
function debugFirstQuestion() {
  // Q_J_001の部分だけを抽出してみる
  const startIndex = content.indexOf('id: "Q_J_001"');
  if (startIndex === -1) {
    console.log("❌ Q_J_001が見つかりません");
    return;
  }

  // 次の問題が始まるまでの範囲を取得
  const nextQuestionIndex = content.indexOf('id: "Q_L_001"', startIndex);
  const questionText = content.substring(startIndex, nextQuestionIndex);

  console.log("\n📝 Q_J_001の生テキスト:");
  console.log("=".repeat(50));
  console.log(questionText.substring(0, 500) + "...");
  console.log("=".repeat(50));

  // answer_template_jsonの部分を抽出
  const templateMatch = questionText.match(
    /answer_template_json:\s*["'](.*?)["']/s,
  );
  if (templateMatch) {
    console.log("\n🔧 answer_template_json (生):");
    console.log(templateMatch[1]);

    console.log("\n🔧 answer_template_json (エスケープ処理後):");
    const processed = templateMatch[1].replace(/\\"/g, '"');
    console.log(processed);

    console.log("\n🔧 JSON解析テスト:");
    try {
      const parsed = JSON.parse(processed);
      console.log("✅ JSON解析成功:", parsed);
    } catch (error) {
      console.log("❌ JSON解析エラー:", error.message);
      console.log("先頭50文字:", processed.substring(0, 50));
    }
  } else {
    console.log("❌ answer_template_jsonが見つかりません");
  }

  // correct_answer_jsonの部分を抽出
  const answerMatch = questionText.match(
    /correct_answer_json:\s*["'](.*?)["']/s,
  );
  if (answerMatch) {
    console.log("\n✅ correct_answer_json (生):");
    console.log(answerMatch[1]);

    console.log("\n✅ correct_answer_json (エスケープ処理後):");
    const processed = answerMatch[1].replace(/\\"/g, '"');
    console.log(processed);

    console.log("\n✅ JSON解析テスト:");
    try {
      const parsed = JSON.parse(processed);
      console.log("✅ JSON解析成功:", parsed);
    } catch (error) {
      console.log("❌ JSON解析エラー:", error.message);
      console.log("先頭50文字:", processed.substring(0, 50));
    }
  } else {
    console.log("❌ correct_answer_jsonが見つかりません");
  }
}

// 全問題数をカウント
function countAllQuestions() {
  const idMatches = content.match(/id:\s*["'][^"']+["']/g);
  console.log(`\n📊 発見された問題ID数: ${idMatches ? idMatches.length : 0}`);

  if (idMatches && idMatches.length > 0) {
    console.log("最初の10問:");
    idMatches.slice(0, 10).forEach((match, index) => {
      console.log(`  ${index + 1}. ${match}`);
    });
  }
}

// より簡単な抽出方法をテスト
function testSimpleExtraction() {
  console.log("\n🧪 簡易抽出テスト");
  console.log("================");

  // 問題オブジェクトの境界を見つける
  const questionObjects = [];
  let currentPos = 0;

  while (true) {
    const idMatch = content.indexOf("id:", currentPos);
    if (idMatch === -1) break;

    const nextIdMatch = content.indexOf("id:", idMatch + 1);
    const endPos = nextIdMatch === -1 ? content.length : nextIdMatch;

    const questionText = content.substring(idMatch, endPos);

    // IDを抽出
    const idExtract = questionText.match(/id:\s*["']([^"']+)["']/);
    if (idExtract) {
      console.log(`発見: ${idExtract[1]}`);
      questionObjects.push({
        id: idExtract[1],
        text: questionText.substring(0, 100) + "...",
      });
    }

    currentPos = nextIdMatch;
    if (currentPos === -1 || questionObjects.length >= 5) break; // 最初の5問だけテスト
  }

  console.log(`\n簡易抽出結果: ${questionObjects.length}問`);
}

// メイン実行
debugFirstQuestion();
countAllQuestions();
testSimpleExtraction();
