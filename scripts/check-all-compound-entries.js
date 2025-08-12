const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
const content = fs.readFileSync(filePath, "utf8");

// すべてのQ_J問題を検索
const pattern = /id: "(Q_J_[0-9]{3})"[\s\S]*?correct_answer_json:\s*'([^']+)'/g;
let match;
let complexEntriesOld = [];
let complexEntriesNew = [];
let simpleEntries = [];

while ((match = pattern.exec(content)) !== null) {
  const [, id, json] = match;

  try {
    const parsed = JSON.parse(json);

    // 複合仕訳の可能性がある形式をチェック
    if (parsed.journalEntry) {
      if (
        Array.isArray(parsed.journalEntry.debit_account) ||
        Array.isArray(parsed.journalEntry.credit_account) ||
        parsed.journalEntry.entries
      ) {
        complexEntriesOld.push(id);
      } else {
        simpleEntries.push(id);
      }
    } else if (parsed.journalEntries && Array.isArray(parsed.journalEntries)) {
      if (parsed.journalEntries.length > 1) {
        complexEntriesNew.push({
          id,
          entryCount: parsed.journalEntries.length,
        });
      } else {
        simpleEntries.push(id);
      }
    }
  } catch (e) {
    console.error("Parse error for", id);
  }
}

console.log("🔍 全仕訳問題の形式分析結果\n");

console.log("📊 集計:");
console.log(
  "- 総問題数:",
  simpleEntries.length + complexEntriesOld.length + complexEntriesNew.length,
);
console.log("- 単純仕訳:", simpleEntries.length);
console.log("- 複合仕訳（新形式）:", complexEntriesNew.length);
console.log("- 複合仕訳（旧形式）:", complexEntriesOld.length);

if (complexEntriesNew.length > 0) {
  console.log("\n✅ 新形式の複合仕訳:");
  complexEntriesNew.forEach((entry) => {
    console.log(`  ${entry.id} (${entry.entryCount}行)`);
  });
}

if (complexEntriesOld.length > 0) {
  console.log("\n⚠️ 修正が必要な旧形式の複合仕訳:");
  complexEntriesOld.forEach((id) => {
    console.log(`  - ${id}`);
  });
} else {
  console.log("\n✅ すべての複合仕訳が新形式に統一されています");
}
