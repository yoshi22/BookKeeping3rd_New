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

// Q_J_001からQ_J_050までの問題を検索
const pattern =
  /id: "(Q_J_0[0-4][0-9]|Q_J_050)"[\s\S]*?correct_answer_json:\s*'([^']+)'/g;
let match;
let complexEntries = [];
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
        complexEntries.push({
          id,
          format: "old_complex",
          details: "旧形式の複合仕訳",
        });
      } else {
        simpleEntries.push(id);
      }
    } else if (parsed.journalEntries && Array.isArray(parsed.journalEntries)) {
      const hasMultipleEntries = parsed.journalEntries.length > 1;
      complexEntries.push({
        id,
        format: "new_complex",
        entryCount: parsed.journalEntries.length,
        details: hasMultipleEntries ? "新形式の複合仕訳" : "新形式（単一行）",
      });
    }
  } catch (e) {
    console.error("Parse error for", id, ":", e.message);
  }
}

console.log("🔍 第1問（Q_J_001〜Q_J_050）の仕訳形式分析結果\n");

console.log("📊 集計:");
console.log("- 総問題数:", simpleEntries.length + complexEntries.length);
console.log("- 単純仕訳:", simpleEntries.length);
console.log(
  "- 複合仕訳:",
  complexEntries.filter((e) => e.entryCount > 1).length,
);
console.log("");

if (complexEntries.length > 0) {
  console.log("📝 複合仕訳形式の問題:");
  complexEntries.forEach((entry) => {
    console.log(
      `  ${entry.id}: ${entry.details}`,
      entry.entryCount ? `(${entry.entryCount}行)` : "",
    );
  });

  const oldFormat = complexEntries.filter((e) => e.format === "old_complex");
  if (oldFormat.length > 0) {
    console.log("\n⚠️ 修正が必要な旧形式の複合仕訳:");
    oldFormat.forEach((entry) => {
      console.log(`  - ${entry.id}`);
    });
  } else {
    console.log("\n✅ すべての複合仕訳が新形式に統一されています");
  }
} else {
  console.log("✅ 複合仕訳形式の問題は見つかりませんでした");
}
