const fs = require("fs");

console.log("問題データのsection_number/question_orderプロパティを追加中...");

// master-questions.tsファイルを読み取り
const filePath = "src/data/master-questions.ts";
let content = fs.readFileSync(filePath, "utf8");

// 各カテゴリのカウンター
let journalOrder = 1;
let ledgerOrder = 1;
let trialBalanceOrder = 1;

// journal問題（Q_J_）のsection_number: 1, question_order追加
content = content.replace(
  /(\{[^}]*id:\s*"Q_J_\d+",\s*category_id:\s*"journal",)/g,
  (match) => {
    return (
      match + `\n    section_number: 1,\n    question_order: ${journalOrder++},`
    );
  },
);

// ledger問題（Q_L_）のsection_number: 2, question_order追加
content = content.replace(
  /(\{[^}]*id:\s*"Q_L_\d+",\s*category_id:\s*"ledger",)/g,
  (match) => {
    return (
      match + `\n    section_number: 2,\n    question_order: ${ledgerOrder++},`
    );
  },
);

// trial_balance問題（Q_T_）のsection_number: 3, question_order追加
content = content.replace(
  /(\{[^}]*id:\s*"Q_T_\d+",\s*category_id:\s*"trial_balance",)/g,
  (match) => {
    return (
      match +
      `\n    section_number: 3,\n    question_order: ${trialBalanceOrder++},`
    );
  },
);

// ファイルに書き込み
fs.writeFileSync(filePath, content, "utf8");

console.log(
  `修正完了: journal=${journalOrder - 1}問, ledger=${ledgerOrder - 1}問, trial_balance=${trialBalanceOrder - 1}問`,
);
console.log("section_number/question_orderプロパティを追加しました。");
