const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_021-Q_L_030のcategory_idを修復\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
let content = fs.readFileSync(questionsPath, "utf8");

// Q_L_021-Q_L_030にcategory_idを追加
for (let i = 21; i <= 30; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;
  console.log(`処理中: ${id}`);

  // 該当問題を探す
  const pattern = new RegExp(`(id: "${id}",)(\\s*question_text:)`, "g");

  if (content.match(pattern)) {
    // category_idとdifficultyを追加
    content = content.replace(
      pattern,
      `$1
    category_id: "ledger",
    difficulty: 2,$2`,
    );
    console.log(`✅ ${id}: category_id追加`);
  } else {
    console.log(`⚠️ ${id}: パターン不一致 - 別の方法を試行`);

    // 別のパターンを試す（既にquestion_textの前に何かある場合）
    const altPattern = new RegExp(`(id: "${id}",\\s*)(\\w+:)`, "g");

    if (content.match(altPattern)) {
      content = content.replace(
        altPattern,
        `$1category_id: "ledger",
    difficulty: 2,
    $2`,
      );
      console.log(`✅ ${id}: category_id追加（代替パターン）`);
    }
  }
}

// ファイル保存
console.log("\n💾 修正内容を保存中...");
fs.writeFileSync(questionsPath, content);

console.log("\n✅ category_id修復完了！");

// 検証
console.log("\n📊 検証結果:");
const updatedContent = fs.readFileSync(questionsPath, "utf8");
const ledgerCount = (updatedContent.match(/category_id: "ledger"/g) || [])
  .length;
console.log(`  category_id: "ledger" の問題数: ${ledgerCount}問`);

if (ledgerCount === 40) {
  console.log("✅ 全40問が正常に修復されました！");
} else {
  console.log(
    `⚠️ 期待値40問に対して${ledgerCount}問です。追加確認が必要です。`,
  );
}
