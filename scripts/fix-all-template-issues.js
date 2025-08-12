#!/usr/bin/env node

/**
 * 全問題のテンプレートと正答形式の不整合を修正
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
const content = fs.readFileSync(tsFilePath, "utf8");

console.log("🔧 全問題のテンプレート・正答形式を修正中...\n");

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

let fixedCount = 0;

// 修正処理
questions.forEach((question, index) => {
  let modified = false;

  // Q_J_046以降の仕訳問題を修正
  if (
    question.id.startsWith("Q_J_") &&
    parseInt(question.id.split("_")[2]) >= 46
  ) {
    const template = JSON.parse(question.answer_template_json);
    const answer = JSON.parse(question.correct_answer_json);

    if (template.type === "ledger_entry" && answer.journalEntry) {
      // journal_entryテンプレートに変更
      const newTemplate = {
        type: "journal_entry",
        entries: [
          {
            label: "借方",
            fields: [
              {
                name: "debit_account",
                label: "勘定科目",
                type: "select",
                required: true,
              },
              {
                name: "debit_amount",
                label: "金額",
                type: "number",
                required: true,
              },
            ],
          },
          {
            label: "貸方",
            fields: [
              {
                name: "credit_account",
                label: "勘定科目",
                type: "select",
                required: true,
              },
              {
                name: "credit_amount",
                label: "金額",
                type: "number",
                required: true,
              },
            ],
          },
        ],
        allowMultipleEntries: true,
        maxEntries: 5,
      };

      question.answer_template_json = JSON.stringify(newTemplate);
      modified = true;
    }
  }

  // 第二問（Q_L_***）の修正
  if (question.id.startsWith("Q_L_")) {
    const template = JSON.parse(question.answer_template_json);
    const answer = JSON.parse(question.correct_answer_json);

    // 未対応のテンプレートタイプを修正
    if (
      [
        "ledger_account",
        "subsidiary_book",
        "voucher",
        "multiple_choice",
      ].includes(template.type)
    ) {
      // ledger_entryテンプレートに変更
      const newTemplate = {
        type: "ledger_entry",
        fields: [
          { name: "date", label: "日付", type: "date", required: true },
          { name: "description", label: "摘要", type: "text", required: true },
          { name: "debit", label: "借方", type: "number", required: false },
          { name: "credit", label: "貸方", type: "number", required: false },
          { name: "balance", label: "残高", type: "number", required: false },
        ],
        allowMultipleEntries: true,
        maxEntries: 10,
      };

      // 正答データも調整
      let newAnswer;
      if (answer.answer !== undefined) {
        // multiple_choice形式の場合
        newAnswer = {
          entries: [
            {
              date: new Date().toISOString().split("T")[0],
              description: String(answer.answer),
              debit: 0,
              credit: 0,
              balance: 0,
            },
          ],
        };
      } else if (answer.entries) {
        // すでにentries形式の場合
        newAnswer = answer;
      } else {
        // その他の形式の場合、デフォルトentries形式に変換
        newAnswer = {
          entries: Object.keys(answer).map((key) => ({
            date: new Date().toISOString().split("T")[0],
            description: key,
            debit: answer[key] || 0,
            credit: 0,
            balance: answer[key] || 0,
          })),
        };
      }

      question.answer_template_json = JSON.stringify(newTemplate);
      question.correct_answer_json = JSON.stringify(newAnswer);
      modified = true;
    }
  }

  // 第三問（Q_T_***）の修正
  if (question.id.startsWith("Q_T_")) {
    const template = JSON.parse(question.answer_template_json);
    const answer = JSON.parse(question.correct_answer_json);

    if (template.type === "ledger_entry") {
      // 問題番号に基づいて適切なテンプレートタイプを設定
      const questionNum = parseInt(question.id.split("_")[2]);
      let newTemplate;

      if (questionNum <= 4) {
        // 試算表問題
        newTemplate = {
          type: "trial_balance",
          columns: ["借方", "貸方"],
          accounts: [
            "現金",
            "当座預金",
            "売掛金",
            "商品",
            "備品",
            "買掛金",
            "借入金",
            "資本金",
            "売上",
            "仕入",
          ],
          totals: true,
        };
      } else if (questionNum <= 8) {
        // 精算表問題
        newTemplate = {
          type: "worksheet",
          columns: [
            "試算表借方",
            "試算表貸方",
            "修正借方",
            "修正貸方",
            "損益借方",
            "損益貸方",
            "貸借借方",
            "貸借貸方",
          ],
          accounts: [
            "現金",
            "売掛金",
            "商品",
            "備品",
            "買掛金",
            "資本金",
            "売上",
            "仕入",
            "給料",
            "家賃",
          ],
        };
      } else {
        // 財務諸表問題
        newTemplate = {
          type: "financial_statement",
          sections: ["資産", "負債", "純資産"],
          items: [
            { name: "流動資産", section: "資産" },
            { name: "固定資産", section: "資産" },
            { name: "流動負債", section: "負債" },
            { name: "固定負債", section: "負債" },
            { name: "資本金", section: "純資産" },
          ],
        };
      }

      // 正答データも調整
      let newAnswer;
      if (answer.trialBalance) {
        // 試算表形式をentriesに変換
        newAnswer = {
          entries: Object.keys(answer.trialBalance).map((account) => ({
            account: account,
            debit: answer.trialBalance[account].debit || 0,
            credit: answer.trialBalance[account].credit || 0,
          })),
        };
      } else if (answer.worksheet) {
        // 精算表形式をentriesに変換
        newAnswer = {
          entries: Object.keys(answer.worksheet).map((account) => ({
            account: account,
            values: answer.worksheet[account],
          })),
        };
      } else if (answer.statement) {
        // 財務諸表形式をentriesに変換
        newAnswer = {
          entries: Object.keys(answer.statement).map((item) => ({
            item: item,
            amount: answer.statement[item],
          })),
        };
      } else {
        // デフォルト形式
        newAnswer = {
          entries: [],
        };
      }

      question.answer_template_json = JSON.stringify(newTemplate);
      question.correct_answer_json = JSON.stringify(newAnswer);
      modified = true;
    }
  }

  if (modified) {
    fixedCount++;
  }
});

// TypeScriptファイルを再構築
const beforeData = content.substring(0, startIndex);
const afterData = content.substring(endIndex);

// questionsをTypeScript形式の文字列に変換
const questionsString = JSON.stringify(questions, null, 2)
  .replace(/"answer_template_json": "(.+?)"/g, (match, p1) => {
    // JSONエスケープを維持
    return `"answer_template_json": "${p1.replace(/"/g, '\\"')}"`;
  })
  .replace(/"correct_answer_json": "(.+?)"/g, (match, p1) => {
    return `"correct_answer_json": "${p1.replace(/"/g, '\\"')}"`;
  })
  .replace(/"tags_json": "(.+?)"/g, (match, p1) => {
    return `"tags_json": "${p1.replace(/"/g, '\\"')}"`;
  });

const newContent = beforeData + questionsString + afterData;
fs.writeFileSync(tsFilePath, newContent, "utf8");

console.log(`✅ ${fixedCount}個の問題を修正しました！`);
console.log("\n修正内容:");
console.log("- Q_J_046以降: ledger_entry → journal_entry");
console.log("- 第二問: 未対応タイプ → ledger_entry");
console.log(
  "- 第三問: ledger_entry → trial_balance/worksheet/financial_statement",
);
