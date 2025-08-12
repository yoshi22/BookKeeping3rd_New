#!/usr/bin/env node

/**
 * 問題文と正答データから具体的な取引パターンを分析し、
 * 真にカスタマイズされた解説を生成するための詳細分析
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

console.log("📊 問題文と正答データから取引パターンを分析中...\n");

// 具体的な取引内容を分析する関数
function analyzeTransactionDetails(question) {
  try {
    const template = JSON.parse(question.answer_template_json);
    const correctAnswer = JSON.parse(question.correct_answer_json);

    const analysis = {
      id: question.id,
      questionText: question.question_text,
      transactionType: determineTransactionType(question.question_text),
      specificAccounts: extractAccountsFromAnswer(correctAnswer, template),
      amounts: extractAmountsFromAnswer(correctAnswer, template),
      businessContext: extractBusinessContext(question.question_text),
      keyNumbers: extractNumbers(question.question_text),
      canCustomize: true,
      customizationLevel: "high", // high, medium, low, none
    };

    return analysis;
  } catch (error) {
    return {
      id: question.id,
      questionText: question.question_text,
      canCustomize: false,
      error: error.message,
    };
  }
}

// 取引タイプを判定
function determineTransactionType(questionText) {
  const types = [];

  if (questionText.includes("現金過不足")) types.push("現金過不足処理");
  if (questionText.includes("小切手")) types.push("小切手処理");
  if (questionText.includes("手形")) types.push("手形処理");
  if (questionText.includes("売上") || questionText.includes("仕入"))
    types.push("商品売買");
  if (questionText.includes("返品") || questionText.includes("戻り"))
    types.push("返品処理");
  if (questionText.includes("値引")) types.push("値引処理");
  if (questionText.includes("給料") || questionText.includes("給与"))
    types.push("給与支払");
  if (questionText.includes("家賃")) types.push("家賃処理");
  if (questionText.includes("保険")) types.push("保険料処理");
  if (questionText.includes("減価償却")) types.push("減価償却");
  if (questionText.includes("貸倒")) types.push("貸倒処理");
  if (questionText.includes("前払") || questionText.includes("先払"))
    types.push("前払費用");
  if (questionText.includes("未払") || questionText.includes("後払"))
    types.push("未払費用");

  return types.length > 0 ? types : ["一般仕訳"];
}

// 正答データから勘定科目を抽出
function extractAccountsFromAnswer(correctAnswer, template) {
  const accounts = [];

  try {
    if (template.type === "journal_entry") {
      if (correctAnswer.journalEntry) {
        correctAnswer.journalEntry.forEach((entry) => {
          if (entry.account) accounts.push(entry.account);
        });
      } else if (correctAnswer.entries) {
        correctAnswer.entries.forEach((entry) => {
          if (entry.account) accounts.push(entry.account);
        });
      }
    } else if (template.type === "ledger_entry") {
      if (Array.isArray(correctAnswer)) {
        correctAnswer.forEach((entry) => {
          if (entry.account) accounts.push(entry.account);
        });
      } else if (correctAnswer.entries) {
        correctAnswer.entries.forEach((entry) => {
          if (entry.account) accounts.push(entry.account);
        });
      }
    }
  } catch (error) {
    // エラーは無視して空配列を返す
  }

  return [...new Set(accounts)]; // 重複除去
}

// 正答データから金額を抽出
function extractAmountsFromAnswer(correctAnswer, template) {
  const amounts = [];

  try {
    if (template.type === "journal_entry") {
      if (correctAnswer.journalEntry) {
        correctAnswer.journalEntry.forEach((entry) => {
          if (entry.amount && !isNaN(parseInt(entry.amount))) {
            amounts.push(parseInt(entry.amount));
          }
        });
      } else if (correctAnswer.entries) {
        correctAnswer.entries.forEach((entry) => {
          if (entry.amount && !isNaN(parseInt(entry.amount))) {
            amounts.push(parseInt(entry.amount));
          }
        });
      }
    }
  } catch (error) {
    // エラーは無視
  }

  return amounts;
}

// ビジネスコンテキストを抽出
function extractBusinessContext(questionText) {
  const contexts = [];

  if (questionText.includes("期首") || questionText.includes("期末"))
    contexts.push("決算処理");
  if (questionText.includes("月末") || questionText.includes("月初"))
    contexts.push("月次処理");
  if (questionText.includes("決算整理")) contexts.push("決算整理");
  if (questionText.includes("振替")) contexts.push("振替処理");
  if (questionText.includes("売却") || questionText.includes("処分"))
    contexts.push("資産処分");
  if (questionText.includes("購入") || questionText.includes("取得"))
    contexts.push("資産取得");

  return contexts;
}

// 問題文から数値を抽出
function extractNumbers(questionText) {
  const numbers = questionText.match(/[\d,]+円?/g) || [];
  return numbers
    .map((n) => n.replace(/[,円]/g, ""))
    .filter((n) => !isNaN(parseInt(n)));
}

// カスタマイズ可能性を評価
function evaluateCustomizationPotential(analysis) {
  let score = 0;

  // 具体的な勘定科目があるか
  if (analysis.specificAccounts && analysis.specificAccounts.length > 0)
    score += 3;

  // 具体的な金額があるか
  if (analysis.amounts && analysis.amounts.length > 0) score += 2;

  // 特定の取引タイプか
  if (
    analysis.transactionType &&
    analysis.transactionType.length > 0 &&
    !analysis.transactionType.includes("一般仕訳")
  )
    score += 3;

  // ビジネスコンテキストがあるか
  if (analysis.businessContext && analysis.businessContext.length > 0)
    score += 2;

  // 具体的な数値があるか
  if (analysis.keyNumbers && analysis.keyNumbers.length > 0) score += 1;

  if (score >= 7) return "high";
  if (score >= 5) return "medium";
  if (score >= 3) return "low";
  return "none";
}

// 全問題を分析
const analysisResults = questions.map((question) => {
  const analysis = analyzeTransactionDetails(question);
  if (analysis.canCustomize) {
    analysis.customizationLevel = evaluateCustomizationPotential(analysis);
  }
  return analysis;
});

// 結果をカテゴリ別に集計
const categoryStats = {
  high: 0,
  medium: 0,
  low: 0,
  none: 0,
  error: 0,
};

const examples = {
  high: [],
  medium: [],
  low: [],
  none: [],
  error: [],
};

analysisResults.forEach((result) => {
  if (!result.canCustomize) {
    categoryStats.error++;
    examples.error.push(result);
  } else {
    categoryStats[result.customizationLevel]++;
    if (examples[result.customizationLevel].length < 3) {
      examples[result.customizationLevel].push(result);
    }
  }
});

console.log("📊 カスタマイズ可能性分析結果\n");
console.log(`🔥 高度カスタマイズ可能: ${categoryStats.high}問`);
console.log(`🔸 中程度カスタマイズ可能: ${categoryStats.medium}問`);
console.log(`🔹 低度カスタマイズ可能: ${categoryStats.low}問`);
console.log(`⚪ カスタマイズ不要: ${categoryStats.none}問`);
console.log(`❌ 分析エラー: ${categoryStats.error}問`);

console.log("\n" + "=".repeat(60) + "\n");

// 各カテゴリの詳細例を表示
Object.entries(examples).forEach(([level, items]) => {
  if (items.length === 0) return;

  const levelNames = {
    high: "🔥 高度カスタマイズ可能",
    medium: "🔸 中程度カスタマイズ可能",
    low: "🔹 低度カスタマイズ可能",
    none: "⚪ カスタマイズ不要",
    error: "❌ 分析エラー",
  };

  console.log(`【${levelNames[level]}】の例:\n`);

  items.slice(0, 2).forEach((item, index) => {
    console.log(`${index + 1}. ${item.id}:`);
    console.log(`   問題文: ${item.questionText.substring(0, 80)}...`);

    if (item.canCustomize) {
      if (item.specificAccounts && item.specificAccounts.length > 0) {
        console.log(`   勘定科目: ${item.specificAccounts.join(", ")}`);
      }
      if (item.amounts && item.amounts.length > 0) {
        console.log(`   金額: ${item.amounts.join("円, ")}円`);
      }
      if (item.transactionType && item.transactionType.length > 0) {
        console.log(`   取引タイプ: ${item.transactionType.join(", ")}`);
      }
      if (item.businessContext && item.businessContext.length > 0) {
        console.log(`   コンテキスト: ${item.businessContext.join(", ")}`);
      }
    } else {
      console.log(`   エラー: ${item.error}`);
    }
    console.log("");
  });
});

// カスタマイズ戦略の提案
console.log("💡 カスタマイズ戦略の提案:\n");
console.log("🔥 高度カスタマイズ可能問題:");
console.log("   → 具体的な勘定科目・金額・取引内容を使った個別解説");
console.log("   → 実際の数値を使った計算例");
console.log("   → 特定の取引タイプの注意点\n");

console.log("🔸 中程度カスタマイズ可能問題:");
console.log("   → 取引タイプ別の標準的な解説");
console.log("   → よくある間違いパターン");
console.log("   → 関連する会計処理の説明\n");

console.log("🔹 低度カスタマイズ可能問題:");
console.log("   → 最小限の取引タイプ別説明");
console.log("   → 基本的な注意点のみ\n");

console.log("⚪ カスタマイズ不要問題:");
console.log("   → 汎用的な解説を削除");
console.log("   → 簡潔な基本説明のみ、または解説なし\n");

// 分析結果をJSONファイルに保存
const outputPath = path.join(
  __dirname,
  "..",
  "temp",
  "transaction-analysis.json",
);
const tempDir = path.dirname(outputPath);
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(analysisResults, null, 2), "utf8");
console.log(`📄 詳細分析結果を保存: ${outputPath}`);

console.log(
  "\n✨ 分析完了！次は真にカスタマイズされた解説生成ルールの作成に進みます。",
);
