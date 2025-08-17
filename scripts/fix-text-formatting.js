const fs = require("fs");

// Read master-questions.ts
const filePath =
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/data/master-questions.ts";
const content = fs.readFileSync(filePath, "utf8");

console.log("=== 修正開始 ===");

// Fix 1: Remove unnecessary "年" prefix when no year number is specified
// 「年10月」→「10月」、「年1月」→「1月」など
let fixedContent = content.replace(/年([0-9１-９]+月)/g, "$1");

// Count the fixes for reporting
const yearFixCount = (content.match(/年([0-9１-９]+月)/g) || []).length;
console.log(`✅ 第二問修正: ${yearFixCount}箇所の「年X月」を「X月」に修正`);

// Fix 2: Replace literal \\n with actual newlines in trial_balance questions
// This is trickier because we need to replace \\n with \n in the JSON strings
const escapeNewlineFixCount = (fixedContent.match(/\\\\n/g) || []).length;
fixedContent = fixedContent.replace(/\\\\n/g, "\\n");
console.log(
  `✅ 第三問修正: ${escapeNewlineFixCount}箇所の「\\\\n」を改行文字に修正`,
);

// Update data version to force database reload
const currentDate = new Date().toISOString().split("T")[0];
const newVersion = `"${currentDate}-text-format-fixed"`;

// Write the fixed content
fs.writeFileSync(filePath, fixedContent);
console.log("\n✅ master-questions.ts を修正しました");

// Now update the data version in migrations/index.ts
const migrationsPath =
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/data/migrations/index.ts";
const migrationsContent = fs.readFileSync(migrationsPath, "utf8");

// Update the SAMPLE_DATA_VERSION
const updatedMigrations = migrationsContent.replace(
  /const SAMPLE_DATA_VERSION = "[^"]+"/,
  `const SAMPLE_DATA_VERSION = ${newVersion}`,
);

fs.writeFileSync(migrationsPath, updatedMigrations);
console.log(`✅ データベースバージョンを ${newVersion} に更新しました`);

console.log("\n=== 修正完了 ===");
console.log("次のステップ:");
console.log("1. migrations/index.ts の forceUpdate を一時的に true に設定");
console.log("2. Expo サーバーを再起動");
console.log("3. アプリをリロードして修正を確認");
console.log("4. forceUpdate を false に戻す");
