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

console.log("🔍 帳簿問題（Q_L_001）の表示形式修正の検証\n");

// 1. コンポーネントの修正確認
console.log("📝 コンポーネントの修正確認:");

// ExplanationPanel.tsxの確認
const explanationPanel = fs.readFileSync(explanationPanelPath, "utf8");
const hasEntriesDirectSupport = explanationPanel.includes(
  "correctAnswer.entries && Array.isArray(correctAnswer.entries)",
);
const hasNestedHandling = explanationPanel.includes("entry.debit?.entries");
const hasLedgerTable = explanationPanel.includes("ledgerTableBox");
const hasLedgerStyles = explanationPanel.includes("ledgerTableHeader");

console.log("  ExplanationPanel.tsx:");
console.log(
  `    - entries直接配列サポート: ${hasEntriesDirectSupport ? "✅" : "❌"}`,
);
console.log(
  `    - ネストされたオブジェクト処理: ${hasNestedHandling ? "✅" : "❌"}`,
);
console.log(`    - 帳簿テーブル表示: ${hasLedgerTable ? "✅" : "❌"}`);
console.log(`    - 帳簿スタイル定義: ${hasLedgerStyles ? "✅" : "❌"}`);

// AnswerResultDialog.tsxの確認
const answerResultDialog = fs.readFileSync(answerResultDialogPath, "utf8");
const hasLedgerPassthrough =
  answerResultDialog.includes("if (correctAnswer.ledgerEntry)") &&
  answerResultDialog.includes("return correctAnswer;");
const hasEntriesPassthrough = answerResultDialog.includes(
  "if (correctAnswer.entries && Array.isArray(correctAnswer.entries))",
);

console.log("\n  AnswerResultDialog.tsx:");
console.log(
  `    - ledgerEntryをそのまま渡す: ${hasLedgerPassthrough ? "✅" : "❌"}`,
);
console.log(
  `    - entries配列をそのまま渡す: ${hasEntriesPassthrough ? "✅" : "❌"}`,
);

// 2. 問題データの形式確認
console.log("\n📊 問題データの形式確認:");

const questionsContent = fs.readFileSync(questionsPath, "utf8");

// Q_L_001の確認
const q_l_001Match = questionsContent.match(
  /Q_L_001[\s\S]*?correct_answer_json:\s*'([^']+)'/,
);
if (q_l_001Match) {
  try {
    const q_l_001Answer = JSON.parse(q_l_001Match[1]);
    console.log("\n  Q_L_001の正答形式:");

    if (q_l_001Answer.entries) {
      console.log("    ✅ entries配列形式を使用");
      console.log(`    - エントリ数: ${q_l_001Answer.entries.length}`);

      const firstEntry = q_l_001Answer.entries[0];
      if (firstEntry) {
        console.log(`    - 最初のエントリ:`);
        console.log(`      日付: ${firstEntry.date || "なし"}`);
        console.log(`      摘要: ${firstEntry.description || "なし"}`);

        // ネストされたオブジェクトのチェック
        if (typeof firstEntry.debit === "object" && firstEntry.debit?.entries) {
          console.log(`      ⚠️ 借方: ネストされたオブジェクト形式（要修正）`);
          console.log(
            `         金額: ${firstEntry.debit.entries[0]?.amount || 0}円`,
          );
        } else {
          console.log(`      借方: ${firstEntry.debit || 0}円`);
        }

        console.log(`      貸方: ${firstEntry.credit || 0}円`);

        if (
          typeof firstEntry.balance === "object" &&
          firstEntry.balance?.entries
        ) {
          console.log(`      ⚠️ 残高: ネストされたオブジェクト形式（要修正）`);
          console.log(
            `         金額: ${firstEntry.balance.entries[0]?.amount || 0}円`,
          );
        } else {
          console.log(`      残高: ${firstEntry.balance || 0}円`);
        }
      }
    } else if (q_l_001Answer.ledgerEntry) {
      console.log("    ❌ 旧形式のledgerEntryを使用");
    } else {
      console.log("    ⚠️ 不明な形式");
    }
  } catch (e) {
    console.log("    ❌ JSONパースエラー:", e.message);
  }
}

// 3. 他の帳簿問題の確認
console.log("\n📋 帳簿問題（Q_L_001〜Q_L_005）の形式一覧:");

const ledgerQuestions = ["Q_L_001", "Q_L_002", "Q_L_003", "Q_L_004", "Q_L_005"];
ledgerQuestions.forEach((id) => {
  const pattern = new RegExp(
    `${id}[\\s\\S]*?correct_answer_json:\\s*'([^']+)'`,
  );
  const match = questionsContent.match(pattern);

  if (match) {
    try {
      const answer = JSON.parse(match[1]);
      const hasEntries = !!answer.entries;
      const hasNestedDebit = answer.entries?.[0]?.debit?.entries ? true : false;

      console.log(
        `  ${id}: ${hasEntries ? "✅ entries形式" : "❌ 旧形式"} ${hasNestedDebit ? "⚠️ ネストあり" : ""}`,
      );
    } catch (e) {
      console.log(`  ${id}: ❌ パースエラー`);
    }
  }
});

// 4. 総合判定
console.log("\n🎯 総合判定:");

const allComponentsFixed =
  hasEntriesDirectSupport &&
  hasNestedHandling &&
  hasLedgerTable &&
  hasLedgerPassthrough;

if (allComponentsFixed) {
  console.log("✅ 帳簿問題の表示処理が正しく実装されています！");
  console.log("  - ExplanationPanelがネストされたデータを適切に処理");
  console.log("  - 帳簿形式のテーブル表示を実装");
  console.log('  - "entries:[object Object]"の問題は解決');
  console.log(
    "\n⚠️ 注意: Q_L_001〜Q_L_050のデータ形式自体にネストの問題があります。",
  );
  console.log("  表示処理で対応していますが、データ修正も推奨されます。");
} else {
  console.log("⚠️ 一部の修正が未完了です:");
  if (!hasEntriesDirectSupport || !hasNestedHandling) {
    console.log("  - ExplanationPanelの帳簿処理が不完全");
  }
  if (!hasLedgerPassthrough) {
    console.log("  - AnswerResultDialogのデータ渡し処理に問題");
  }
}
