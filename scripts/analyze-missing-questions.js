const fs = require("fs");

// Read current master-questions.ts
const currentContent = fs.readFileSync(
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/data/master-questions.ts",
  "utf8",
);

// Read backup file
const backupContent = fs.readFileSync(
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/data/master-questions.ts.backup-1755417187910",
  "utf8",
);

// Extract questions from file content
function extractQuestions(content) {
  const match = content.match(
    /export const masterQuestions: Question\[\] = (\[[\s\S]+?\]);/,
  );
  if (!match) {
    throw new Error("Could not find masterQuestions in file");
  }

  // Clean up the match to make it valid JSON
  let questionsStr = match[1]
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove block comments
    .replace(/\/\/.*$/gm, "") // Remove line comments
    .replace(/,\s*\]/g, "]") // Remove trailing commas
    .replace(/,\s*\}/g, "}"); // Remove trailing commas in objects

  try {
    return eval(questionsStr);
  } catch (e) {
    console.error("Failed to parse questions:", e);
    return [];
  }
}

// Get questions from both files
const currentQuestions = extractQuestions(currentContent);
const backupQuestions = extractQuestions(backupContent);

// Filter journal questions
const currentJournal = currentQuestions.filter(
  (q) => q.category_id === "journal",
);
const backupJournal = backupQuestions.filter(
  (q) => q.category_id === "journal",
);

// Find missing questions
const currentIds = new Set(currentJournal.map((q) => q.id));
const missingQuestions = backupJournal.filter((q) => !currentIds.has(q.id));

// Categorize questions by their tag patterns
function categorizeQuestions(questions) {
  const categories = {
    "現金・預金": [],
    商品売買: [],
    "債権・債務": [],
    "給与・税金": [],
    固定資産: [],
    決算整理: [],
  };

  questions.forEach((q) => {
    let tags = [];
    try {
      if (q.tags_json) {
        tags = JSON.parse(q.tags_json);
        if (!Array.isArray(tags)) tags = [];
      }
    } catch (e) {
      tags = [];
    }

    if (
      tags.some(
        (t) =>
          t.includes("現金") || t.includes("預金") || t.includes("小口現金"),
      )
    ) {
      categories["現金・預金"].push(q.id);
    } else if (
      tags.some(
        (t) => t.includes("仕入") || t.includes("売上") || t.includes("商品"),
      )
    ) {
      categories["商品売買"].push(q.id);
    } else if (
      tags.some(
        (t) =>
          t.includes("売掛金") ||
          t.includes("買掛金") ||
          t.includes("手形") ||
          t.includes("貸付") ||
          t.includes("借入"),
      )
    ) {
      categories["債権・債務"].push(q.id);
    } else if (
      tags.some(
        (t) =>
          t.includes("給与") ||
          t.includes("給料") ||
          t.includes("税金") ||
          t.includes("保険"),
      )
    ) {
      categories["給与・税金"].push(q.id);
    } else if (
      tags.some(
        (t) =>
          t.includes("固定資産") ||
          t.includes("減価償却") ||
          t.includes("建物") ||
          t.includes("備品"),
      )
    ) {
      categories["固定資産"].push(q.id);
    } else if (
      tags.some(
        (t) =>
          t.includes("決算") ||
          t.includes("引当金") ||
          t.includes("経過勘定") ||
          t.includes("前払") ||
          t.includes("未払"),
      )
    ) {
      categories["決算整理"].push(q.id);
    }
  });

  return categories;
}

// Analyze distribution
const currentCategories = categorizeQuestions(currentJournal);
const backupCategories = categorizeQuestions(backupJournal);
const missingCategories = categorizeQuestions(missingQuestions);

// Output analysis
console.log("=== 問題数分析 ===");
console.log(`現在のmaster-questions.ts: ${currentJournal.length}問`);
console.log(`バックアップファイル: ${backupJournal.length}問`);
console.log(`欠落している問題: ${missingQuestions.length}問`);
console.log("");

console.log("=== カテゴリー別分布（現在） ===");
Object.entries(currentCategories).forEach(([cat, ids]) => {
  console.log(`${cat}: ${ids.length}問`);
});
console.log("");

console.log("=== カテゴリー別分布（バックアップ） ===");
Object.entries(backupCategories).forEach(([cat, ids]) => {
  console.log(`${cat}: ${ids.length}問`);
});
console.log("");

console.log("=== 欠落問題のカテゴリー分布 ===");
Object.entries(missingCategories).forEach(([cat, ids]) => {
  if (ids.length > 0) {
    console.log(
      `${cat}: ${ids.length}問 (${ids.slice(0, 5).join(", ")}${ids.length > 5 ? "..." : ""})`,
    );
  }
});

console.log("\n=== 欠落問題ID一覧 ===");
console.log(
  JSON.stringify(
    missingQuestions.map((q) => q.id),
    null,
    2,
  ),
);

// Export for use in restoration script
module.exports = { missingQuestions, backupQuestions };
