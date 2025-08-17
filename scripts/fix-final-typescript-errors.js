#!/usr/bin/env node

/**
 * Phase 2 TypeScript Error Fix Script - Final Fix
 * 残り46個のTypeScriptエラーを完全修正
 */

const fs = require("fs");
const path = require("path");

// ファイルが存在するかチェック
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// logger.error() の第1引数がErrorオブジェクトの場合の修正
function fixLoggerErrorArguments(filePath) {
  if (!fileExists(filePath)) {
    console.log(`File not found: ${filePath}`);
    return 0;
  }

  let content = fs.readFileSync(filePath, "utf-8");
  const originalContent = content;
  let changes = 0;

  // パターン1: logger.error("message", Error) → logger.error("message", Error)
  // Error オブジェクトが第1引数に来ている場合を修正
  content = content.replace(
    /logger\.error\(\s*([^,\s]+)\s*as\s*Error\s*,/g,
    (match, errorVar) => {
      changes++;
      return `logger.error((${errorVar} as Error).message,`;
    },
  );

  // パターン2: logger.error("message", Error as any) → logger.error("message", Error)
  content = content.replace(
    /logger\.error\(\s*([^,]+)\s*,\s*([^,\s]+)\s*as\s*any\s*\)/g,
    (match, msg, err) => {
      changes++;
      return `logger.error(${msg}, ${err} as Error)`;
    },
  );

  // パターン3: logger.error("message", error) where error is unknown
  content = content.replace(
    /logger\.error\(([^,]+),\s*([^,\s]+)\s*\)\s*;?\s*$/gm,
    (match, msg, err) => {
      // error変数がunknown型やany型の場合
      if (err.trim() === "error" || err.trim() === "err") {
        changes++;
        return `logger.error(${msg}, ${err} as Error);`;
      }
      return match;
    },
  );

  // パターン4: 特定のケースを個別に修正
  // src/data/database.ts のケース
  if (filePath.includes("database.ts")) {
    content = content.replace(/sqliteError,$/m, "sqliteError as Error,");
    changes++;
  }

  // unknown が第2引数の場合
  content = content.replace(
    /logger\.error\(([^,]+),\s*([^,\s]+)\s*\)/g,
    (match, msg, err) => {
      if (err.includes("unknown") || err.includes("any")) {
        changes++;
        return `logger.error(${msg}, ${err} as Error)`;
      }
      return match;
    },
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${changes} logger.error arguments in ${filePath}`);
  }

  return changes;
}

// 特殊なケースの修正
function fixSpecialCases() {
  let totalChanges = 0;

  // database.ts の特別修正
  const dbFile = "src/data/database.ts";
  if (fileExists(dbFile)) {
    let content = fs.readFileSync(dbFile, "utf-8");

    // line 271 のunknown型修正
    content = content.replace(
      /logger\.error\(\s*"SQLite初期化失敗、フォールバックとしてモックを使用"\s*,\s*sqliteError\s*,/,
      'logger.error("SQLite初期化失敗、フォールバックとしてモックを使用", sqliteError as Error,',
    );

    if (content !== fs.readFileSync(dbFile, "utf-8")) {
      fs.writeFileSync(dbFile, content);
      console.log(`✅ Fixed special case in ${dbFile}`);
      totalChanges++;
    }
  }

  // migration-manager.ts の修正
  const mgFile = "src/data/migrations/migration-manager.ts";
  if (fileExists(mgFile)) {
    let content = fs.readFileSync(mgFile, "utf-8");

    // unknown型の修正
    content = content.replace(
      /error\s*instanceof\s*Error\s*\?\s*error\.message\s*:\s*String\(error\)/g,
      "error instanceof Error ? error.message : String(error)",
    );

    // その行が string に割り当てられていることを確実にする
    content = content.replace(
      /const\s+errorMessage\s*=\s*error\s*;/g,
      "const errorMessage = error instanceof Error ? error.message : String(error);",
    );

    if (content !== fs.readFileSync(mgFile, "utf-8")) {
      fs.writeFileSync(mgFile, content);
      console.log(`✅ Fixed special case in ${mgFile}`);
      totalChanges++;
    }
  }

  // answer-service.ts の string | undefined エラー修正
  const ansFile = "src/services/answer-service.ts";
  if (fileExists(ansFile)) {
    let content = fs.readFileSync(ansFile, "utf-8");

    // formatAmount の引数を修正
    content = content.replace(
      /formatAmount\(([^)]+)\s*\|\|\s*"0"\)/g,
      'formatAmount(($1) || "0")',
    );

    // string | undefined を string に変換
    content = content.replace(
      /formatAmount\(([^)]+)\.amount\)/g,
      'formatAmount(($1.amount) || "0")',
    );

    if (content !== fs.readFileSync(ansFile, "utf-8")) {
      fs.writeFileSync(ansFile, content);
      console.log(`✅ Fixed special case in ${ansFile}`);
      totalChanges++;
    }
  }

  return totalChanges;
}

// メイン処理
let totalChanges = 0;

console.log("🔧 Final TypeScript Error Fix - 最後の46個のエラーを修正...\n");

// 対象ファイルリスト
const targetFiles = [
  "src/data/database.ts",
  "src/data/migrations/index.ts",
  "src/data/migrations/migration-manager.ts",
  "src/data/repositories/base-repository.ts",
  "src/data/repositories/learning-history-repository.ts",
  "src/data/repositories/mock-exam-repository.ts",
  "src/data/repositories/question-repository.ts",
  "src/data/repositories/review-item-repository.ts",
  "src/services/answer-service.ts",
  "src/services/audio-feedback-service.ts",
  "src/services/mock-exam-service.ts",
];

// 各ファイルのlogger.error引数を修正
targetFiles.forEach((file) => {
  totalChanges += fixLoggerErrorArguments(file);
});

// 特殊ケースの修正
totalChanges += fixSpecialCases();

console.log(`\n✅ 合計修正箇所: ${totalChanges}`);
console.log("🎯 TypeScript最終チェック実行中...\n");

// TypeScript検証
const { exec } = require("child_process");
exec("npx tsc --noEmit", (error, stdout, stderr) => {
  if (error) {
    const errorCount = (stderr.match(/error TS/g) || []).length;
    console.log(`❌ まだ ${errorCount} 個のTypeScriptエラーが残っています:`);
    console.log(stderr);
  } else {
    console.log("🎉 TypeScriptエラー完全修正成功！");
    console.log("✅ Phase 2: TypeScript型安全性確保 - 完了");
  }
});
