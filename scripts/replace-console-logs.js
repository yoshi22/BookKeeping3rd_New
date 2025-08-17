const fs = require("fs");
const path = require("path");

/**
 * database.tsのconsole.log文をlogger呼び出しに置換するスクリプト
 */

const filePath =
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/data/database.ts";
let content = fs.readFileSync(filePath, "utf8");

console.log("=== Console.log置換開始 ===");

// database.ts専用の置換ルール
const replacements = [
  // 同期モード設定
  {
    old: 'console.log("[DatabaseService] 同期モード設定中");',
    new: 'logger.database("同期モード設定中", { operation: "synchronous" });',
  },
  // オートバキューム設定
  {
    old: 'console.log("[DatabaseService] オートバキューム設定中");',
    new: 'logger.database("オートバキューム設定中", { operation: "auto_vacuum" });',
  },
  // WALモード設定スキップ警告
  {
    old: 'console.warn(\n              "[DatabaseService] WALモード設定をスキップ:",\n              walError,\n            );',
    new: 'logger.warn("WALモード設定をスキップ", {\n              component: "DatabaseService",\n              error: walError instanceof Error ? walError.message : walError\n            });',
  },
  // PRAGMA設定完了
  {
    old: 'console.log("[DatabaseService] PRAGMA設定完了");',
    new: 'logger.database("PRAGMA設定完了", { operation: "pragma_complete" });',
  },
  // PRAGMA設定エラー
  {
    old: 'console.warn("[DatabaseService] PRAGMA設定で一部エラー:", pragmaError);',
    new: 'logger.warn("PRAGMA設定で一部エラー", {\n          component: "DatabaseService",\n          error: pragmaError instanceof Error ? pragmaError.message : pragmaError\n        });',
  },
  // データベース接続完了
  {
    old: 'console.log("[DatabaseService] データベース接続完了");',
    new: 'logger.info("データベース接続完了", { component: "DatabaseService" });',
  },
  // エラー出力系統
  {
    old: 'console.error("[DatabaseService] 初期化中の予期しないエラー:", error);',
    new: 'logger.error("初期化中の予期しないエラー", error, { component: "DatabaseService" });',
  },
  {
    old: 'console.error("[DatabaseService] Error details:", {',
    new: 'logger.error("初期化エラー詳細", null, {',
  },
  // SQL実行ログ
  {
    old: "console.log(`[DatabaseService] SQL実行: ${sql}`, params);",
    new: 'logger.database("SQL実行", { sql: sql.substring(0, 100), params: params.length });',
  },
  // トランザクション系
  {
    old: 'console.log("[DatabaseService] トランザクション開始");',
    new: 'logger.database("トランザクション開始", { operation: "transaction_begin" });',
  },
  {
    old: 'console.log("[DatabaseService] トランザクション成功");',
    new: 'logger.database("トランザクション成功", { operation: "transaction_commit" });',
  },
  // リセット系
  {
    old: 'console.log("[DatabaseService] データベース完全リセット開始");',
    new: 'logger.database("データベース完全リセット開始", { operation: "database_reset" });',
  },
  {
    old: "console.log(\n              `[DatabaseService] データベースファイル削除試行: ${dbPath}`,\n            );",
    new: 'logger.database("データベースファイル削除試行", { path: dbPath });',
  },
];

let replacedCount = 0;
replacements.forEach((replacement, index) => {
  if (content.includes(replacement.old)) {
    content = content.replace(replacement.old, replacement.new);
    replacedCount++;
    console.log(`✅ 置換 ${index + 1}: ${replacement.old.substring(0, 50)}...`);
  } else {
    console.log(`⚠️  スキップ ${index + 1}: パターンが見つかりません`);
  }
});

// より一般的なパターンマッチ置換
const generalPatterns = [
  // 一般的なconsole.log("[DatabaseService] ...")パターン
  {
    pattern: /console\.log\("\[DatabaseService\] ([^"]+)"\);/g,
    replacement: 'logger.database("$1", {});',
  },
  // 一般的なconsole.warn("[DatabaseService] ...")パターン
  {
    pattern: /console\.warn\("\[DatabaseService\] ([^"]+)", ([^)]+)\);/g,
    replacement:
      'logger.warn("$1", { component: "DatabaseService", details: $2 });',
  },
  // 一般的なconsole.error("[DatabaseService] ...")パターン
  {
    pattern: /console\.error\("\[DatabaseService\] ([^"]+)", ([^)]+)\);/g,
    replacement: 'logger.error("$1", $2, { component: "DatabaseService" });',
  },
];

generalPatterns.forEach((pattern, index) => {
  const matches = content.match(pattern.pattern);
  if (matches) {
    content = content.replace(pattern.pattern, pattern.replacement);
    replacedCount += matches.length;
    console.log(`✅ パターン置換 ${index + 1}: ${matches.length}件`);
  }
});

// WebDatabaseMockのconsole.log文も置換
const webDbPatterns = [
  {
    pattern: /console\.log\(`\[WebDB\] ([^`]+)`([^)]*)\);/g,
    replacement: 'logger.debug("$1", { component: "WebDatabaseMock"$2 });',
  },
  {
    pattern: /console\.error\(`\[WebDB\] ([^`]+)`([^)]*)\);/g,
    replacement:
      'logger.error("$1", null, { component: "WebDatabaseMock"$2 });',
  },
];

webDbPatterns.forEach((pattern, index) => {
  const matches = content.match(pattern.pattern);
  if (matches) {
    content = content.replace(pattern.pattern, pattern.replacement);
    replacedCount += matches.length;
    console.log(`✅ WebDB パターン置換 ${index + 1}: ${matches.length}件`);
  }
});

// ファイルに書き込み
fs.writeFileSync(filePath, content);

console.log(`\n✅ database.ts の console 文置換完了: ${replacedCount}件`);
console.log("=== 置換完了 ===");
