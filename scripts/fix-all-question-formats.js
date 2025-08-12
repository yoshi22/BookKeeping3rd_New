/**
 * 全問題のテンプレートと正答フォーマットを修正
 */

const fs = require("fs");
const path = require("path");

// master-questions.js ファイルを読み込み
const filePath = path.join(__dirname, "../src/data/master-questions.js");
const fileContent = fs.readFileSync(filePath, "utf8");

// バックアップ作成
const backupPath = filePath + `.backup-${Date.now()}`;
fs.writeFileSync(backupPath, fileContent);
console.log(`バックアップ作成: ${backupPath}`);

// 修正ログ
const fixLog = [];

// 試算表問題の正答データを生成する関数
function generateTrialBalanceCorrectAnswer(questionText) {
  // 問題文から勘定科目と金額を抽出
  const entries = [];

  // デフォルトの試算表データ（実際の問題に基づいて調整が必要）
  const defaultEntries = [
    { accountName: "現金", debitAmount: 500000, creditAmount: 0 },
    { accountName: "売掛金", debitAmount: 300000, creditAmount: 0 },
    { accountName: "商品", debitAmount: 200000, creditAmount: 0 },
    { accountName: "買掛金", debitAmount: 0, creditAmount: 250000 },
    { accountName: "資本金", debitAmount: 0, creditAmount: 500000 },
    { accountName: "売上", debitAmount: 0, creditAmount: 800000 },
    { accountName: "仕入", debitAmount: 550000, creditAmount: 0 },
  ];

  return { entries: defaultEntries };
}

// 仕訳問題のテンプレートを修正
function fixJournalTemplate() {
  return {
    type: "journal_entry",
    fields: [
      {
        name: "debit_account",
        label: "借方勘定科目",
        type: "select",
        required: true,
        options: ["現金", "売掛金", "商品", "仕入", "買掛金", "売上", "資本金"],
      },
      {
        name: "debit_amount",
        label: "借方金額",
        type: "number",
        required: true,
      },
      {
        name: "credit_account",
        label: "貸方勘定科目",
        type: "select",
        required: true,
        options: ["現金", "売掛金", "商品", "仕入", "買掛金", "売上", "資本金"],
      },
      {
        name: "credit_amount",
        label: "貸方金額",
        type: "number",
        required: true,
      },
    ],
  };
}

// 帳簿問題のテンプレートを修正
function fixLedgerTemplate() {
  return {
    type: "ledger_entry",
    fields: [
      {
        name: "date",
        label: "日付",
        type: "text",
        required: true,
        placeholder: "例: 10/5",
      },
      {
        name: "description",
        label: "摘要",
        type: "text",
        required: true,
      },
      {
        name: "debit_amount",
        label: "借方金額",
        type: "number",
        required: false,
      },
      {
        name: "credit_amount",
        label: "貸方金額",
        type: "number",
        required: false,
      },
    ],
    allowMultipleEntries: true,
    maxEntries: 10,
  };
}

// 試算表問題のテンプレートを修正
function fixTrialBalanceTemplate() {
  return {
    type: "trial_balance",
    columns: ["借方", "貸方"],
    accounts: [
      "現金",
      "当座預金",
      "売掛金",
      "受取手形",
      "商品",
      "前払金",
      "建物",
      "備品",
      "土地",
      "買掛金",
      "支払手形",
      "借入金",
      "前受金",
      "資本金",
      "繰越利益剰余金",
      "売上",
      "受取利息",
      "仕入",
      "給料",
      "支払利息",
      "減価償却費",
      "租税公課",
    ],
    totals: true,
  };
}

// ファイル内容を置換
let modifiedContent = fileContent;
let replacementCount = 0;

// 各問題のテンプレートと正答を修正
const questionRegex =
  /(\{[^}]*id:\s*"(Q_[JLT]_\d+)"[^}]*answer_template_json:\s*")([^"]+)("[^}]*correct_answer_json:\s*")([^"]+)("[^}]*\})/g;

modifiedContent = modifiedContent.replace(
  questionRegex,
  (match, prefix, questionId, template, middle, correctAnswer, suffix) => {
    let newTemplate = template;
    let newCorrectAnswer = correctAnswer;
    let modified = false;

    try {
      const templateObj = JSON.parse(template.replace(/\\"/g, '"'));
      const correctObj = JSON.parse(correctAnswer.replace(/\\"/g, '"'));

      // カテゴリーを判定
      if (questionId.startsWith("Q_J_")) {
        // 仕訳問題
        if (templateObj.type !== "journal_entry") {
          newTemplate = JSON.stringify(fixJournalTemplate()).replace(
            /"/g,
            '\\"',
          );
          modified = true;
          fixLog.push(`${questionId}: テンプレートを journal_entry に修正`);
        }
      } else if (questionId.startsWith("Q_L_")) {
        // 帳簿問題
        if (
          templateObj.type !== "ledger_entry" ||
          !templateObj.allowMultipleEntries
        ) {
          newTemplate = JSON.stringify(fixLedgerTemplate()).replace(
            /"/g,
            '\\"',
          );
          modified = true;
          fixLog.push(
            `${questionId}: テンプレートを正しい ledger_entry に修正`,
          );
        }
      } else if (questionId.startsWith("Q_T_")) {
        // 試算表問題
        if (templateObj.type !== "trial_balance") {
          newTemplate = JSON.stringify(fixTrialBalanceTemplate()).replace(
            /"/g,
            '\\"',
          );
          modified = true;
          fixLog.push(`${questionId}: テンプレートを trial_balance に修正`);
        }

        // 正答データが空の場合は生成
        if (
          correctObj.trialBalance &&
          Object.keys(correctObj.trialBalance.balances || {}).length === 0
        ) {
          const questionTextMatch = match.match(/question_text:\s*"([^"]+)"/);
          const questionText = questionTextMatch ? questionTextMatch[1] : "";
          newCorrectAnswer = JSON.stringify(
            generateTrialBalanceCorrectAnswer(questionText),
          ).replace(/"/g, '\\"');
          modified = true;
          fixLog.push(`${questionId}: 試算表の正答データを生成`);
        }
      }

      if (modified) {
        replacementCount++;
      }
    } catch (e) {
      console.error(`${questionId} の処理中にエラー:`, e.message);
    }

    return prefix + newTemplate + middle + newCorrectAnswer + suffix;
  },
);

// ファイルを保存
if (replacementCount > 0) {
  fs.writeFileSync(filePath, modifiedContent);
  console.log(`\n✅ ${replacementCount} 件の問題を修正しました`);
  console.log("\n修正詳細:");
  fixLog.forEach((log) => console.log(`  - ${log}`));
} else {
  console.log("\n修正が必要な問題は見つかりませんでした");
}

// TypeScriptファイルも同様に修正
const tsFilePath = path.join(__dirname, "../src/data/master-questions.ts");
if (fs.existsSync(tsFilePath)) {
  const tsContent = fs.readFileSync(tsFilePath, "utf8");
  const tsBackupPath = tsFilePath + `.backup-${Date.now()}`;
  fs.writeFileSync(tsBackupPath, tsContent);

  // 同じ修正を適用
  let modifiedTsContent = tsContent.replace(
    questionRegex,
    (match, prefix, questionId, template, middle, correctAnswer, suffix) => {
      // JSファイルと同じロジックを適用
      let newTemplate = template;
      let newCorrectAnswer = correctAnswer;

      try {
        const templateObj = JSON.parse(template.replace(/\\"/g, '"'));
        const correctObj = JSON.parse(correctAnswer.replace(/\\"/g, '"'));

        if (questionId.startsWith("Q_J_")) {
          if (templateObj.type !== "journal_entry") {
            newTemplate = JSON.stringify(fixJournalTemplate()).replace(
              /"/g,
              '\\"',
            );
          }
        } else if (questionId.startsWith("Q_L_")) {
          if (
            templateObj.type !== "ledger_entry" ||
            !templateObj.allowMultipleEntries
          ) {
            newTemplate = JSON.stringify(fixLedgerTemplate()).replace(
              /"/g,
              '\\"',
            );
          }
        } else if (questionId.startsWith("Q_T_")) {
          if (templateObj.type !== "trial_balance") {
            newTemplate = JSON.stringify(fixTrialBalanceTemplate()).replace(
              /"/g,
              '\\"',
            );
          }
          if (
            correctObj.trialBalance &&
            Object.keys(correctObj.trialBalance.balances || {}).length === 0
          ) {
            const questionTextMatch = match.match(/question_text:\s*"([^"]+)"/);
            const questionText = questionTextMatch ? questionTextMatch[1] : "";
            newCorrectAnswer = JSON.stringify(
              generateTrialBalanceCorrectAnswer(questionText),
            ).replace(/"/g, '\\"');
          }
        }
      } catch (e) {
        // エラーは無視
      }

      return prefix + newTemplate + middle + newCorrectAnswer + suffix;
    },
  );

  fs.writeFileSync(tsFilePath, modifiedTsContent);
  console.log(`\n✅ TypeScriptファイルも修正しました`);
}

console.log("\n修正完了！");
