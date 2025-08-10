/**
 * 問題データから使用されている勘定科目を抽出するスクリプト
 */

const fs = require("fs");

// マスター問題データを読み込み
const masterQuestionsContent = fs.readFileSync(
  "src/data/master-questions.ts",
  "utf8",
);

// 勘定科目を抽出
const accountNames = new Set();

// answer_template_jsonから勘定科目を抽出する関数
function extractAccountsFromTemplate(templateJson) {
  try {
    const template = JSON.parse(templateJson);
    if (template.fields) {
      template.fields.forEach((field) => {
        if (field.type === "dropdown" && field.options) {
          field.options.forEach((option) => accountNames.add(option));
        }
      });
    }
  } catch (e) {
    console.error("JSON parsing error:", e.message);
  }
}

// correct_answer_jsonから勘定科目を抽出する関数
function extractAccountsFromAnswer(answerJson) {
  try {
    const answer = JSON.parse(answerJson);
    if (answer.journalEntry) {
      if (answer.journalEntry.debit_account)
        accountNames.add(answer.journalEntry.debit_account);
      if (answer.journalEntry.credit_account)
        accountNames.add(answer.journalEntry.credit_account);
    }
  } catch (e) {
    console.error("JSON parsing error:", e.message);
  }
}

// 正規表現でanswer_template_jsonを抽出
const templateMatches = masterQuestionsContent.match(
  /answer_template_json:\s*'([^']+)'/g,
);
if (templateMatches) {
  templateMatches.forEach((match) => {
    const jsonStr = match.match(/'([^']+)'/)[1];
    extractAccountsFromTemplate(jsonStr);
  });
}

// 正規表現でcorrect_answer_jsonを抽出
const answerMatches = masterQuestionsContent.match(
  /correct_answer_json:\s*'([^']+)'/g,
);
if (answerMatches) {
  answerMatches.forEach((match) => {
    const jsonStr = match.match(/'([^']+)'/)[1];
    extractAccountsFromAnswer(jsonStr);
  });
}

// 結果を表示
console.log("=== 問題データで使用されている勘定科目 ===");
const sortedAccounts = Array.from(accountNames).sort();
sortedAccounts.forEach((account, index) => {
  console.log(`${index + 1}. ${account}`);
});

console.log(`\n合計: ${sortedAccounts.length}個の勘定科目`);

// AccountDropdownの現在の勘定科目と比較
const accountDropdownContent = fs.readFileSync(
  "src/components/AccountDropdown.tsx",
  "utf8",
);
const currentAccounts = new Set();

// JOURNAL_ACCOUNT_ITEMSから勘定科目名を抽出
const accountMatches = accountDropdownContent.match(
  /{ code: "[^"]+", name: "([^"]+)", category: "[^"]+" }/g,
);
if (accountMatches) {
  accountMatches.forEach((match) => {
    const name = match.match(/name: "([^"]+)"/)[1];
    currentAccounts.add(name);
  });
}

console.log("\n=== AccountDropdownの現在の勘定科目 ===");
const sortedCurrentAccounts = Array.from(currentAccounts).sort();
sortedCurrentAccounts.forEach((account, index) => {
  console.log(`${index + 1}. ${account}`);
});

console.log(`\n合計: ${sortedCurrentAccounts.length}個の勘定科目`);

// 不足している勘定科目を特定
const missingAccounts = Array.from(accountNames).filter(
  (account) => !currentAccounts.has(account),
);
console.log("\n=== 不足している勘定科目 ===");
missingAccounts.sort().forEach((account, index) => {
  console.log(`${index + 1}. ${account}`);
});

console.log(`\n不足: ${missingAccounts.length}個の勘定科目`);
