/**
 * 仕訳問題（第一問、第二問）を元の状態に復元しつつ、
 * 試算表問題（第三問）の修正は保持する
 */

const fs = require("fs");
const path = require("path");

// バックアップファイルから元のデータを読み込み
const backup = require("../src/data/master-questions.js.backup-1754893483448");
const current = require("../src/data/master-questions.js");

console.log("=== 仕訳・帳簿問題の復元 ===\n");

// 復元結果を格納
const restoredQuestions = current.masterQuestions.map((currentQ) => {
  // 試算表問題（Q_T_*）は現在の状態を保持
  if (currentQ.id.startsWith("Q_T_")) {
    console.log(`✅ 保持: ${currentQ.id} (試算表問題)`);
    return currentQ;
  }

  // 仕訳問題（Q_J_*）と帳簿問題（Q_L_*）はバックアップから復元
  const backupQ = backup.masterQuestions.find((bq) => bq.id === currentQ.id);
  if (backupQ) {
    if (currentQ.id.startsWith("Q_J_")) {
      console.log(`🔄 復元: ${currentQ.id} (仕訳問題)`);
    } else if (currentQ.id.startsWith("Q_L_")) {
      console.log(`🔄 復元: ${currentQ.id} (帳簿問題)`);
    }
    // テンプレートと正答データをバックアップから復元
    return {
      ...currentQ,
      answer_template_json: backupQ.answer_template_json,
      correct_answer_json: backupQ.correct_answer_json,
    };
  }

  // バックアップに存在しない場合は現在の状態を保持
  return currentQ;
});

// 統計情報を再計算
const statistics = {
  totalQuestions: restoredQuestions.length,
  byCategory: {
    journal: restoredQuestions.filter((q) => q.category_id === "journal")
      .length,
    ledger: restoredQuestions.filter((q) => q.category_id === "ledger").length,
    trial_balance: restoredQuestions.filter(
      (q) => q.category_id === "trial_balance",
    ).length,
  },
  byDifficulty: {
    1: restoredQuestions.filter((q) => q.difficulty === 1).length,
    2: restoredQuestions.filter((q) => q.difficulty === 2).length,
    3: restoredQuestions.filter((q) => q.difficulty === 3).length,
    4: restoredQuestions.filter((q) => q.difficulty === 4).length,
    5: restoredQuestions.filter((q) => q.difficulty === 5).length,
  },
};

// ファイルパス
const jsFilePath = path.join(__dirname, "../src/data/master-questions.js");
const tsFilePath = path.join(__dirname, "../src/data/master-questions.ts");

// バックアップ作成
const timestamp = Date.now();
const jsBackupPath = jsFilePath + `.backup-restore-${timestamp}`;
const tsBackupPath = tsFilePath + `.backup-restore-${timestamp}`;

fs.copyFileSync(jsFilePath, jsBackupPath);
console.log(`\n📁 バックアップ作成: ${jsBackupPath}`);

if (fs.existsSync(tsFilePath)) {
  fs.copyFileSync(tsFilePath, tsBackupPath);
  console.log(`📁 バックアップ作成: ${tsBackupPath}`);
}

// JavaScriptファイルを更新
const jsContent = `Object.defineProperty(exports, "__esModule", { value: true });
exports.questionStatistics = exports.masterQuestions = void 0;
exports.masterQuestions = ${JSON.stringify(restoredQuestions, null, 4)};
exports.questionStatistics = ${JSON.stringify(statistics, null, 4)};
`;

fs.writeFileSync(jsFilePath, jsContent);
console.log("\n✅ master-questions.js を復元しました");

// TypeScriptファイルも更新
if (fs.existsSync(tsFilePath)) {
  const tsContent = `import { Question } from "../types/models";

export const questions: Question[] = ${JSON.stringify(restoredQuestions, null, 4)};

export const questionStatistics = ${JSON.stringify(statistics, null, 4)};
`;

  fs.writeFileSync(tsFilePath, tsContent);
  console.log("✅ master-questions.ts も復元しました");
}

// 復元の概要を表示
console.log("\n=== 復元完了 ===");
console.log(
  `仕訳問題 (Q_J_*): ${restoredQuestions.filter((q) => q.id.startsWith("Q_J_")).length}件を復元`,
);
console.log(
  `帳簿問題 (Q_L_*): ${restoredQuestions.filter((q) => q.id.startsWith("Q_L_")).length}件を復元`,
);
console.log(
  `試算表問題 (Q_T_*): ${restoredQuestions.filter((q) => q.id.startsWith("Q_T_")).length}件の修正を保持`,
);

console.log("\n📝 次のステップ:");
console.log("1. アプリを再起動してください");
console.log("2. 第一問、第二問、第三問へのアクセスを確認してください");
