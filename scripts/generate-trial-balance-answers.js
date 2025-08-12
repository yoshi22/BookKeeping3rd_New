/**
 * 試算表問題の問題文から正答データを生成
 */

const fs = require("fs");
const path = require("path");
const { masterQuestions } = require("../src/data/master-questions.js");

// 仕訳から試算表を生成する関数
function generateTrialBalanceFromJournalEntries(journalEntries) {
  const balances = {};

  // 各仕訳を処理
  journalEntries.forEach((entry) => {
    // 借方を処理
    if (entry.debit) {
      if (!balances[entry.debit.account]) {
        balances[entry.debit.account] = { debit: 0, credit: 0 };
      }
      balances[entry.debit.account].debit += entry.debit.amount;
    }

    // 貸方を処理
    if (entry.credit) {
      if (!balances[entry.credit.account]) {
        balances[entry.credit.account] = { debit: 0, credit: 0 };
      }
      balances[entry.credit.account].credit += entry.credit.amount;
    }
  });

  // 試算表形式に変換
  const entries = [];
  Object.keys(balances).forEach((accountName) => {
    const balance = balances[accountName];
    // 借方・貸方の相殺処理
    const netDebit = balance.debit - balance.credit;
    const netCredit = balance.credit - balance.debit;

    if (netDebit > 0) {
      entries.push({
        accountName: accountName,
        debitAmount: netDebit,
        creditAmount: 0,
      });
    } else if (netCredit > 0) {
      entries.push({
        accountName: accountName,
        debitAmount: 0,
        creditAmount: netCredit,
      });
    }
  });

  return entries;
}

// 問題文から仕訳を抽出する関数
function extractJournalEntries(questionText) {
  const entries = [];

  // パターン1: "借方科目 金額 / 貸方科目 金額" 形式
  const pattern1 = /([^\s]+)\s+([\d,]+)\s*\/\s*([^\s]+)\s+([\d,]+)/g;
  let match;

  while ((match = pattern1.exec(questionText)) !== null) {
    const debitAccount = match[1];
    const debitAmount = parseInt(match[2].replace(/,/g, ""));
    const creditAccount = match[3];
    const creditAmount = parseInt(match[4].replace(/,/g, ""));

    if (debitAmount === creditAmount) {
      // 金額が一致する場合のみ有効な仕訳とする
      entries.push({
        debit: { account: debitAccount, amount: debitAmount },
        credit: { account: creditAccount, amount: creditAmount },
      });
    }
  }

  return entries;
}

// 各試算表問題を処理
const trialBalanceQuestions = masterQuestions.filter((q) =>
  q.id.startsWith("Q_T_"),
);
const updatedQuestions = [];

trialBalanceQuestions.forEach((q) => {
  console.log(`\n処理中: ${q.id}`);

  // 問題文から仕訳を抽出
  const journalEntries = extractJournalEntries(q.question_text);
  console.log(`  抽出した仕訳数: ${journalEntries.length}`);

  // 試算表を生成
  const trialBalanceEntries =
    generateTrialBalanceFromJournalEntries(journalEntries);
  console.log(`  生成した試算表エントリー数: ${trialBalanceEntries.length}`);

  // 借方・貸方の合計を計算
  const totalDebit = trialBalanceEntries.reduce(
    (sum, e) => sum + e.debitAmount,
    0,
  );
  const totalCredit = trialBalanceEntries.reduce(
    (sum, e) => sum + e.creditAmount,
    0,
  );
  console.log(`  借方合計: ${totalDebit.toLocaleString()}円`);
  console.log(`  貸方合計: ${totalCredit.toLocaleString()}円`);
  console.log(
    `  バランス: ${totalDebit === totalCredit ? "✅ 一致" : "❌ 不一致"}`,
  );

  // 新しい正答データを作成
  const newCorrectAnswer = {
    entries: trialBalanceEntries,
  };

  // 問題データを更新
  const updatedQuestion = {
    ...q,
    correct_answer_json: JSON.stringify(newCorrectAnswer),
  };

  updatedQuestions.push(updatedQuestion);
});

// すべての問題を含む新しい配列を作成
const allQuestions = masterQuestions.map((q) => {
  const updated = updatedQuestions.find((uq) => uq.id === q.id);
  return updated || q;
});

// ファイルを更新
const jsFilePath = path.join(__dirname, "../src/data/master-questions.js");
const backupPath = jsFilePath + `.backup-trial-balance-${Date.now()}`;

// バックアップ作成
const originalContent = fs.readFileSync(jsFilePath, "utf8");
fs.writeFileSync(backupPath, originalContent);
console.log(`\nバックアップ作成: ${backupPath}`);

// 新しい内容を生成
const newContent = `Object.defineProperty(exports, "__esModule", { value: true });
exports.questionStatistics = exports.masterQuestions = void 0;
exports.masterQuestions = ${JSON.stringify(allQuestions, null, 4)};
exports.questionStatistics = {
    totalQuestions: ${allQuestions.length},
    byCategory: {
        journal: ${allQuestions.filter((q) => q.category_id === "journal").length},
        ledger: ${allQuestions.filter((q) => q.category_id === "ledger").length},
        trial_balance: ${allQuestions.filter((q) => q.category_id === "trial_balance").length},
    },
    byDifficulty: {
        1: ${allQuestions.filter((q) => q.difficulty === 1).length},
        2: ${allQuestions.filter((q) => q.difficulty === 2).length},
        3: ${allQuestions.filter((q) => q.difficulty === 3).length},
        4: ${allQuestions.filter((q) => q.difficulty === 4).length},
        5: ${allQuestions.filter((q) => q.difficulty === 5).length},
    },
};
`;

// ファイルを保存
fs.writeFileSync(jsFilePath, newContent);
console.log(`\n✅ master-questions.js を更新しました`);

// TypeScriptファイルも更新
const tsFilePath = path.join(__dirname, "../src/data/master-questions.ts");
if (fs.existsSync(tsFilePath)) {
  const tsBackupPath = tsFilePath + `.backup-trial-balance-${Date.now()}`;
  const tsOriginalContent = fs.readFileSync(tsFilePath, "utf8");
  fs.writeFileSync(tsBackupPath, tsOriginalContent);

  const tsContent = `import { Question } from "../types/models";

export const questions: Question[] = ${JSON.stringify(allQuestions, null, 4)};

export const questionStatistics = {
    totalQuestions: ${allQuestions.length},
    byCategory: {
        journal: ${allQuestions.filter((q) => q.category_id === "journal").length},
        ledger: ${allQuestions.filter((q) => q.category_id === "ledger").length},
        trial_balance: ${allQuestions.filter((q) => q.category_id === "trial_balance").length},
    },
    byDifficulty: {
        1: ${allQuestions.filter((q) => q.difficulty === 1).length},
        2: ${allQuestions.filter((q) => q.difficulty === 2).length},
        3: ${allQuestions.filter((q) => q.difficulty === 3).length},
        4: ${allQuestions.filter((q) => q.difficulty === 4).length},
        5: ${allQuestions.filter((q) => q.difficulty === 5).length},
    },
};
`;

  fs.writeFileSync(tsFilePath, tsContent);
  console.log(`✅ master-questions.ts も更新しました`);
}

console.log("\n処理完了！");
