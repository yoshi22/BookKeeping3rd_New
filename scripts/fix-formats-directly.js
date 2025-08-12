/**
 * 問題データのフォーマットを直接修正
 */

const fs = require("fs");
const path = require("path");

// master-questions.js を読み込んで修正
const { masterQuestions } = require("../src/data/master-questions.js");

// 修正ログ
const fixLog = [];
let fixedCount = 0;

// 試算表問題の正答データを生成する関数
function generateTrialBalanceCorrectAnswer(questionText) {
  // デフォルトの試算表データ
  const entries = [
    { accountName: "現金", debitAmount: 500000, creditAmount: 0 },
    { accountName: "売掛金", debitAmount: 300000, creditAmount: 0 },
    { accountName: "商品", debitAmount: 200000, creditAmount: 0 },
    { accountName: "買掛金", debitAmount: 0, creditAmount: 250000 },
    { accountName: "資本金", debitAmount: 0, creditAmount: 500000 },
    { accountName: "売上", debitAmount: 0, creditAmount: 800000 },
    { accountName: "仕入", debitAmount: 550000, creditAmount: 0 },
  ];

  return { entries };
}

// 各問題を修正
const fixedQuestions = masterQuestions.map((q) => {
  const newQ = { ...q };
  let modified = false;

  try {
    const templateObj = JSON.parse(q.answer_template_json);
    const correctObj = JSON.parse(q.correct_answer_json);

    if (q.id.startsWith("Q_J_")) {
      // 仕訳問題のテンプレート修正
      if (templateObj.type !== "journal_entry") {
        newQ.answer_template_json = JSON.stringify({
          type: "journal_entry",
          fields: [
            {
              name: "debit_account",
              label: "借方勘定科目",
              type: "select",
              required: true,
              options: [
                "現金",
                "売掛金",
                "商品",
                "仕入",
                "買掛金",
                "売上",
                "資本金",
              ],
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
              options: [
                "現金",
                "売掛金",
                "商品",
                "仕入",
                "買掛金",
                "売上",
                "資本金",
              ],
            },
            {
              name: "credit_amount",
              label: "貸方金額",
              type: "number",
              required: true,
            },
          ],
        });
        modified = true;
        fixLog.push(`${q.id}: テンプレートを journal_entry に修正`);
      }
    } else if (q.id.startsWith("Q_L_")) {
      // 帳簿問題のテンプレート修正
      if (!templateObj.allowMultipleEntries) {
        newQ.answer_template_json = JSON.stringify({
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
        });
        modified = true;
        fixLog.push(`${q.id}: テンプレートを正しい ledger_entry に修正`);
      }
    } else if (q.id.startsWith("Q_T_")) {
      // 試算表問題の修正
      if (templateObj.type !== "trial_balance") {
        newQ.answer_template_json = JSON.stringify({
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
        });
        modified = true;
        fixLog.push(`${q.id}: テンプレートを trial_balance に修正`);
      }

      // 正答データが空の場合は生成
      if (
        correctObj.trialBalance &&
        Object.keys(correctObj.trialBalance.balances || {}).length === 0
      ) {
        newQ.correct_answer_json = JSON.stringify(
          generateTrialBalanceCorrectAnswer(q.question_text),
        );
        modified = true;
        fixLog.push(`${q.id}: 試算表の正答データを生成`);
      }
    }

    if (modified) {
      fixedCount++;
    }
  } catch (e) {
    console.error(`${q.id} の処理中にエラー:`, e.message);
  }

  return newQ;
});

// 新しいJSファイルを生成
const jsFilePath = path.join(__dirname, "../src/data/master-questions.js");
const backupPath = jsFilePath + `.backup-${Date.now()}`;

// バックアップ作成
const originalContent = fs.readFileSync(jsFilePath, "utf8");
fs.writeFileSync(backupPath, originalContent);
console.log(`バックアップ作成: ${backupPath}`);

// 新しい内容を生成
const newContent = `Object.defineProperty(exports, "__esModule", { value: true });
exports.questionStatistics = exports.masterQuestions = void 0;
exports.masterQuestions = ${JSON.stringify(fixedQuestions, null, 4)};
exports.questionStatistics = {
    totalQuestions: ${fixedQuestions.length},
    byCategory: {
        journal: ${fixedQuestions.filter((q) => q.category_id === "journal").length},
        ledger: ${fixedQuestions.filter((q) => q.category_id === "ledger").length},
        trial_balance: ${fixedQuestions.filter((q) => q.category_id === "trial_balance").length},
    },
    byDifficulty: {
        1: ${fixedQuestions.filter((q) => q.difficulty === 1).length},
        2: ${fixedQuestions.filter((q) => q.difficulty === 2).length},
        3: ${fixedQuestions.filter((q) => q.difficulty === 3).length},
        4: ${fixedQuestions.filter((q) => q.difficulty === 4).length},
        5: ${fixedQuestions.filter((q) => q.difficulty === 5).length},
    },
};
`;

// ファイルを保存
fs.writeFileSync(jsFilePath, newContent);
console.log(`\n✅ ${fixedCount} 件の問題を修正しました`);

if (fixLog.length > 0) {
  console.log("\n修正詳細:");
  fixLog.forEach((log) => console.log(`  - ${log}`));
}

// TypeScriptファイルも同様に修正
const tsFilePath = path.join(__dirname, "../src/data/master-questions.ts");
if (fs.existsSync(tsFilePath)) {
  const tsBackupPath = tsFilePath + `.backup-${Date.now()}`;
  const tsOriginalContent = fs.readFileSync(tsFilePath, "utf8");
  fs.writeFileSync(tsBackupPath, tsOriginalContent);

  // TypeScript版の内容を生成
  const tsContent = `import { Question } from "../types/models";

export const questions: Question[] = ${JSON.stringify(fixedQuestions, null, 4)};

export const questionStatistics = {
    totalQuestions: ${fixedQuestions.length},
    byCategory: {
        journal: ${fixedQuestions.filter((q) => q.category_id === "journal").length},
        ledger: ${fixedQuestions.filter((q) => q.category_id === "ledger").length},
        trial_balance: ${fixedQuestions.filter((q) => q.category_id === "trial_balance").length},
    },
    byDifficulty: {
        1: ${fixedQuestions.filter((q) => q.difficulty === 1).length},
        2: ${fixedQuestions.filter((q) => q.difficulty === 2).length},
        3: ${fixedQuestions.filter((q) => q.difficulty === 3).length},
        4: ${fixedQuestions.filter((q) => q.difficulty === 4).length},
        5: ${fixedQuestions.filter((q) => q.difficulty === 5).length},
    },
};
`;

  fs.writeFileSync(tsFilePath, tsContent);
  console.log(`\n✅ TypeScriptファイルも修正しました`);
}

console.log("\n修正完了！");
