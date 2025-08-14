#!/usr/bin/env node

/**
 * データベースリセットスクリプト
 * 既存のデータベースを削除して、全問題データを再読み込みします
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🔄 データベースリセット開始...");

// データベースファイルを探して削除
const possibleDbPaths = [
  path.join(__dirname, "../bookkeeping.db"),
  path.join(__dirname, "../bookkeeping.sqlite"),
  path.join(__dirname, "../bookkeeping.sql3"),
  path.join(__dirname, "../database.db"),
  path.join(__dirname, "../database.sqlite"),
];

let deletedCount = 0;
possibleDbPaths.forEach((dbPath) => {
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log(`✅ データベースファイル削除: ${dbPath}`);
    deletedCount++;
  }
});

if (deletedCount === 0) {
  console.log("ℹ️  削除すべきデータベースファイルが見つかりませんでした");
}

// iOS Simulator のデータもクリア（可能な場合）
try {
  console.log("📱 iOS Simulator データクリア中...");
  execSync("xcrun simctl shutdown all", { stdio: "ignore" });
  execSync("xcrun simctl erase all", { stdio: "ignore" });
  console.log("✅ iOS Simulator データクリア完了");
} catch (error) {
  console.log(
    "⚠️  iOS Simulator データクリアをスキップ（エラーまたは環境なし）",
  );
}

console.log("🎉 データベースリセット完了！");
console.log("");
console.log("次の手順:");
console.log("1. npm start でアプリを起動");
console.log(
  "2. 新しい問題データ（仕訳250問+帳簿40問+試算表12問）が自動読み込みされます",
);
console.log("3. 学習画面で問題数を確認してください");
