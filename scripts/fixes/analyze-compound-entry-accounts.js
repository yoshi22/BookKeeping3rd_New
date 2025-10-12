#!/usr/bin/env node

/**
 * 複合仕訳問題の勘定科目完全性分析スクリプト
 *
 * 目的:
 * - 複合仕訳の20問について、correct_answer_jsonから必要な勘定科目を抽出
 * - tags_jsonのaccounts配列と比較
 * - 不足・余剰勘定科目をレポート
 *
 * 実行方法:
 * node scripts/fixes/analyze-compound-entry-accounts.js
 */

const fs = require("fs");
const path = require("path");

// カラー出力用のANSIコード
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

// 複合仕訳の問題ID一覧
const COMPOUND_ENTRY_IDS = [
  "Q_J_018",
  "Q_J_023",
  "Q_J_027",
  "Q_J_032",
  "Q_J_034",
  "Q_J_037",
  "Q_J_038",
  "Q_J_039",
  "Q_J_120",
  "Q_J_125",
  "Q_J_128",
  "Q_J_131",
  "Q_J_132",
  "Q_J_133",
  "Q_J_134",
  "Q_J_135",
  "Q_J_136",
  "Q_J_137",
  "Q_J_144",
  "Q_J_244",
];

/**
 * master-questions.tsファイルを読み込んで解析
 */
function loadQuestions() {
  const filePath = path.join(__dirname, "../../src/data/master-questions.ts");
  const content = fs.readFileSync(filePath, "utf8");

  const lines = content.split("\n");
  const questions = [];
  let currentQuestion = null;
  let inExplanation = false;
  let explanationBuffer = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 新しい問題の開始
    if (line.trim().match(/^\{$/)) {
      if (
        currentQuestion &&
        currentQuestion.id &&
        COMPOUND_ENTRY_IDS.includes(currentQuestion.id)
      ) {
        questions.push(currentQuestion);
      }
      currentQuestion = { lineNumber: i + 1 };
      inExplanation = false;
      explanationBuffer = "";
    }

    // 問題ID
    if (line.includes("id:") && !line.includes("category_id")) {
      const match = line.match(/id:\s*["']([^"']+)["']/);
      if (match) {
        currentQuestion.id = match[1];
      }
    }

    // 問題文
    if (line.includes("question_text:")) {
      const nextLine = lines[i + 1];
      if (nextLine) {
        currentQuestion.question_text = nextLine
          .trim()
          .replace(/^["']|["'],?$/g, "")
          .substring(0, 50);
      }
    }

    // answer_template_json
    if (line.includes("answer_template_json:")) {
      const nextLine = lines[i + 1];
      if (nextLine) {
        currentQuestion.answer_template_json = nextLine
          .trim()
          .replace(/^["']|["'],?$/g, "");
      }
    }

    // correct_answer_json
    if (line.includes("correct_answer_json:")) {
      const nextLine = lines[i + 1];
      if (nextLine) {
        currentQuestion.correct_answer_json = nextLine
          .trim()
          .replace(/^["']|["'],?$/g, "");
      }
    }

    // tags_json
    if (line.includes("tags_json:")) {
      const nextLine = lines[i + 1];
      if (nextLine) {
        currentQuestion.tags_json = nextLine
          .trim()
          .replace(/^["']|["'],?$/g, "");
      }
    }
  }

  // 最後の問題を追加
  if (
    currentQuestion &&
    currentQuestion.id &&
    COMPOUND_ENTRY_IDS.includes(currentQuestion.id)
  ) {
    questions.push(currentQuestion);
  }

  return questions;
}

/**
 * correct_answer_jsonから勘定科目を抽出
 */
function extractAccountsFromAnswer(answerJson) {
  try {
    const answer = JSON.parse(answerJson);
    const accounts = new Set();

    if (answer.journalEntry && Array.isArray(answer.journalEntry)) {
      answer.journalEntry.forEach((entry) => {
        if (entry.debit_account && entry.debit_account.trim() !== "") {
          accounts.add(entry.debit_account.trim());
        }
        if (entry.credit_account && entry.credit_account.trim() !== "") {
          accounts.add(entry.credit_account.trim());
        }
      });
    } else if (answer.journalEntry && typeof answer.journalEntry === "object") {
      // 単純仕訳の場合（念のため）
      if (answer.journalEntry.debit_account) {
        accounts.add(answer.journalEntry.debit_account.trim());
      }
      if (answer.journalEntry.credit_account) {
        accounts.add(answer.journalEntry.credit_account.trim());
      }
    }

    return Array.from(accounts).filter((a) => a !== "");
  } catch (error) {
    console.error(`Error parsing answer JSON: ${error.message}`);
    return [];
  }
}

/**
 * tags_jsonからaccounts配列を抽出
 */
function extractAccountsFromTags(tagsJson) {
  try {
    const tags = JSON.parse(tagsJson);
    return tags.accounts || [];
  } catch (error) {
    console.error(`Error parsing tags JSON: ${error.message}`);
    return [];
  }
}

/**
 * 分析を実行
 */
function analyzeQuestions() {
  console.log(
    `${colors.cyan}複合仕訳問題の勘定科目完全性分析${colors.reset}\n`,
  );
  console.log(`対象問題数: ${COMPOUND_ENTRY_IDS.length}問\n`);
  console.log("=".repeat(80) + "\n");

  const questions = loadQuestions();

  if (questions.length === 0) {
    console.log(
      `${colors.red}エラー: 対象問題が見つかりませんでした${colors.reset}`,
    );
    return;
  }

  console.log(`読み込み完了: ${questions.length}問\n`);

  const issues = [];
  let perfectCount = 0;

  questions.forEach((q) => {
    const answerAccounts = extractAccountsFromAnswer(q.correct_answer_json);
    const tagsAccounts = extractAccountsFromTags(q.tags_json);

    const missing = answerAccounts.filter((a) => !tagsAccounts.includes(a));
    const extra = tagsAccounts.filter((a) => !answerAccounts.includes(a));

    console.log(`${colors.blue}[${q.id}]${colors.reset} (行: ${q.lineNumber})`);
    console.log(`  問題: ${q.question_text}...`);
    console.log(
      `  正解に必要な勘定科目 (${answerAccounts.length}個): ${answerAccounts.join(", ")}`,
    );
    console.log(
      `  tags_jsonのaccounts (${tagsAccounts.length}個): ${tagsAccounts.join(", ")}`,
    );

    if (missing.length > 0 || extra.length > 0) {
      if (missing.length > 0) {
        console.log(
          `  ${colors.red}❌ 不足している勘定科目: ${missing.join(", ")}${colors.reset}`,
        );
      }
      if (extra.length > 0) {
        console.log(
          `  ${colors.yellow}⚠️  余分な勘定科目: ${extra.join(", ")}${colors.reset}`,
        );
      }
      issues.push({
        id: q.id,
        lineNumber: q.lineNumber,
        missing,
        extra,
        answerAccounts,
        tagsAccounts,
      });
    } else {
      console.log(`  ${colors.green}✅ 勘定科目は完全に一致${colors.reset}`);
      perfectCount++;
    }
    console.log("");
  });

  console.log("=".repeat(80) + "\n");
  console.log(`${colors.cyan}分析サマリー${colors.reset}\n`);
  console.log(`総問題数: ${questions.length}問`);
  console.log(`完全一致: ${colors.green}${perfectCount}問${colors.reset}`);
  console.log(`問題あり: ${colors.red}${issues.length}問${colors.reset}\n`);

  if (issues.length > 0) {
    console.log(`${colors.yellow}修正が必要な問題リスト:${colors.reset}\n`);
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.id} (行: ${issue.lineNumber})`);
      if (issue.missing.length > 0) {
        console.log(`   追加が必要: ${issue.missing.join(", ")}`);
      }
      if (issue.extra.length > 0) {
        console.log(`   削除を検討: ${issue.extra.join(", ")}`);
      }
      console.log(`   現在: [${issue.tagsAccounts.join(", ")}]`);
      console.log(`   推奨: [${issue.answerAccounts.join(", ")}]`);
      console.log("");
    });

    // 修正用のデータを生成
    console.log(`${colors.cyan}修正データ（Phase 3で使用）:${colors.reset}\n`);
    console.log("const accountsFixes = {");
    issues.forEach((issue) => {
      console.log(
        `  '${issue.id}': [${issue.answerAccounts.map((a) => `'${a}'`).join(", ")}],`,
      );
    });
    console.log("};\n");
  } else {
    console.log(
      `${colors.green}すべての問題で勘定科目が完全に一致しています！${colors.reset}\n`,
    );
  }

  return issues;
}

// 実行
if (require.main === module) {
  try {
    const issues = analyzeQuestions();
    process.exit(issues.length > 0 ? 1 : 0);
  } catch (error) {
    console.error(
      `${colors.red}エラーが発生しました: ${error.message}${colors.reset}`,
    );
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = {
  analyzeQuestions,
  extractAccountsFromAnswer,
  extractAccountsFromTags,
};
