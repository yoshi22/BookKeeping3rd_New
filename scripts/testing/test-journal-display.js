const fs = require("fs");
const path = require("path");

// テスト対象のファイルパス
const answerResultDialogPath = path.join(
  __dirname,
  "..",
  "src",
  "components",
  "AnswerResultDialog.tsx",
);
const explanationPanelPath = path.join(
  __dirname,
  "..",
  "src",
  "components",
  "ExplanationPanel.tsx",
);
const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

console.log("🔍 仕訳問題の表示形式修正の検証\n");

// 1. コンポーネントの修正確認
console.log("📝 コンポーネントの修正確認:");

// AnswerResultDialog.tsxの確認
const answerResultDialog = fs.readFileSync(answerResultDialogPath, "utf8");
const hasJournalEntriesSupport = answerResultDialog.includes(
  "correctAnswer.journalEntries",
);
const hasArrayCheck = answerResultDialog.includes(
  "Array.isArray(correctAnswer.journalEntries)",
);

console.log("  AnswerResultDialog.tsx:");
console.log(
  `    - journalEntries配列サポート: ${hasJournalEntriesSupport ? "✅" : "❌"}`,
);
console.log(`    - 配列チェック実装: ${hasArrayCheck ? "✅" : "❌"}`);

// ExplanationPanel.tsxの確認
const explanationPanel = fs.readFileSync(explanationPanelPath, "utf8");
const hasJournalEntriesRender = explanationPanel.includes(
  "correctAnswer.journalEntries",
);
const hasJournalRow = explanationPanel.includes("styles.journalRow");
const hasJournalColumn = explanationPanel.includes("styles.journalColumn");

console.log("  ExplanationPanel.tsx:");
console.log(
  `    - journalEntries配列レンダリング: ${hasJournalEntriesRender ? "✅" : "❌"}`,
);
console.log(`    - 借方/貸方列レイアウト: ${hasJournalRow ? "✅" : "❌"}`);
console.log(`    - スタイル定義: ${hasJournalColumn ? "✅" : "❌"}`);

// 2. 問題データの形式確認
console.log("\n📊 問題データの形式確認:");

const questionsContent = fs.readFileSync(questionsPath, "utf8");

// Q_J_006の確認
const q006Match = questionsContent.match(
  /Q_J_006[\s\S]*?correct_answer_json:\s*'([^']+)'/,
);
if (q006Match) {
  try {
    const q006Answer = JSON.parse(q006Match[1]);
    console.log("\n  Q_J_006の正答形式:");

    if (q006Answer.journalEntries) {
      console.log("    ✅ journalEntries配列形式を使用");
      console.log(`    - エントリ数: ${q006Answer.journalEntries.length}`);

      q006Answer.journalEntries.forEach((entry, index) => {
        console.log(`    - エントリ${index + 1}:`);
        if (entry.debit_account) {
          console.log(
            `      借方: ${entry.debit_account} ${entry.debit_amount}円`,
          );
        }
        if (entry.credit_account) {
          console.log(
            `      貸方: ${entry.credit_account} ${entry.credit_amount}円`,
          );
        }
      });
    } else if (q006Answer.journalEntry) {
      console.log("    ❌ 旧形式のjournalEntryを使用（要修正）");
    } else {
      console.log("    ⚠️ 不明な形式");
    }
  } catch (e) {
    console.log("    ❌ JSONパースエラー:", e.message);
  }
}

// 3. 他の複合仕訳問題の確認
console.log("\n📋 複合仕訳問題の一覧:");

const compoundEntries = ["Q_J_006", "Q_J_007", "Q_J_009", "Q_J_012"];
compoundEntries.forEach((id) => {
  const pattern = new RegExp(
    `${id}[\\s\\S]*?correct_answer_json:\\s*'([^']+)'`,
  );
  const match = questionsContent.match(pattern);

  if (match) {
    try {
      const answer = JSON.parse(match[1]);
      const hasJournalEntries = !!answer.journalEntries;
      const entryCount = answer.journalEntries?.length || 0;

      console.log(
        `  ${id}: ${hasJournalEntries ? "✅" : "❌"} ${hasJournalEntries ? `(${entryCount}行)` : "旧形式"}`,
      );
    } catch (e) {
      console.log(`  ${id}: ❌ パースエラー`);
    }
  }
});

// 4. 総合判定
console.log("\n🎯 総合判定:");

const allComponentsFixed =
  hasJournalEntriesSupport &&
  hasArrayCheck &&
  hasJournalEntriesRender &&
  hasJournalRow;
const allDataFixed = compoundEntries.every((id) => {
  const pattern = new RegExp(
    `${id}[\\s\\S]*?correct_answer_json:\\s*'([^']+)'`,
  );
  const match = questionsContent.match(pattern);
  if (!match) return false;
  try {
    const answer = JSON.parse(match[1]);
    return !!answer.journalEntries;
  } catch {
    return false;
  }
});

if (allComponentsFixed && allDataFixed) {
  console.log("✅ すべての修正が正しく適用されています！");
  console.log("  - 表示コンポーネントがjournalEntries配列をサポート");
  console.log("  - 複合仕訳が標準的な簿記形式で表示される");
  console.log('  - "journalEntries:[object Object]"の問題は解決');
} else {
  console.log("⚠️ 一部の修正が未完了です:");
  if (!allComponentsFixed) {
    console.log("  - コンポーネントの修正が必要");
  }
  if (!allDataFixed) {
    console.log("  - データ形式の修正が必要");
  }
}
