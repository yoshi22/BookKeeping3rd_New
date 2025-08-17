#!/usr/bin/env node

/**
 * Phase 2 TypeScript Error Fix Script - Logger.error() Signature Fix
 * 残り46個の logger.error() 引数型エラーを完全修正
 *
 * 正しいシグネチャ: logger.error(message: string, error?: Error, context?: LogContext)
 */

const fs = require("fs");
const path = require("path");

// ファイルが存在するかチェック
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// logger.error() の引数を修正
function fixLoggerErrorCalls(filePath) {
  if (!fileExists(filePath)) {
    console.log(`File not found: ${filePath}`);
    return 0;
  }

  let content = fs.readFileSync(filePath, "utf-8");
  const originalContent = content;
  let changes = 0;

  // パターン1: logger.error(errorVar as Error) → logger.error(errorVar.message || "Unknown error", errorVar as Error)
  content = content.replace(
    /logger\.error\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s+as\s+Error\s*\)/g,
    (match, errorVar) => {
      changes++;
      return `logger.error(${errorVar} instanceof Error ? ${errorVar}.message : "Unknown error", ${errorVar} as Error)`;
    },
  );

  // パターン2: logger.error("message", errorVar) → logger.error("message", errorVar as Error)
  // ただし、既に as Error がある場合はスキップ
  content = content.replace(
    /logger\.error\(\s*"([^"]*)",\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\)/g,
    (match, message, errorVar) => {
      if (match.includes(" as Error")) {
        return match; // 既に修正済み
      }
      changes++;
      return `logger.error("${message}", ${errorVar} as Error)`;
    },
  );

  // パターン3: logger.error("message", error, {...}) の形の修正
  content = content.replace(
    /logger\.error\(\s*"([^"]*)",\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*,\s*\{/g,
    (match, message, errorVar) => {
      if (match.includes(" as Error")) {
        return match; // 既に修正済み
      }
      changes++;
      return `logger.error("${message}", ${errorVar} as Error, {`;
    },
  );

  // パターン4: new Error(...) が第1引数に来ている場合の修正
  content = content.replace(
    /logger\.error\(\s*new\s+Error\(\s*"([^"]*)",\s*([^)]+)\)\s*\)/g,
    (match, message, errorVar) => {
      changes++;
      return `logger.error("${message}", ${errorVar} as Error)`;
    },
  );

  // パターン5: logger.error(new Error("message", error)) → logger.error("message", error as Error)
  content = content.replace(
    /logger\.error\(\s*new\s+Error\(\s*"([^"]*)"[^)]*\)\s*,\s*([^)]+)\)/g,
    (match, message, errorVar) => {
      changes++;
      return `logger.error("${message}", ${errorVar} as Error)`;
    },
  );

  // パターン6: 特定ファイルの個別修正
  if (filePath.includes("mock-exam-service.ts")) {
    // line 140, 179, 238 の修正
    content = content.replace(
      /logger\.error\(new Error\("Failed to start mock exam session:", error as Error\)\);/g,
      'logger.error("Failed to start mock exam session", error as Error);',
    );
    content = content.replace(
      /logger\.error\(new Error\("Failed to record mock exam answer:", error as Error\)\);/g,
      'logger.error("Failed to record mock exam answer", error as Error);',
    );
    content = content.replace(
      /logger\.error\(new Error\("Failed to complete mock exam session:", error as Error\)\);/g,
      'logger.error("Failed to complete mock exam session", error as Error);',
    );
    changes += 3;
  }

  if (filePath.includes("audio-feedback-service.ts")) {
    // line 196, 228, 503 の修正
    content = content.replace(
      /logger\.error\(new Error\("\[AudioFeedbackService\] 初期化エラー:", error as Error\)\);/g,
      'logger.error("[AudioFeedbackService] 初期化エラー", error as Error);',
    );
    content = content.replace(
      /logger\.error\(new Error\("\[AudioFeedbackService\] 設定保存エラー:", error as Error\)\);/g,
      'logger.error("[AudioFeedbackService] 設定保存エラー", error as Error);',
    );
    content = content.replace(
      /logger\.error\(new Error\("\[AudioFeedbackService\] クリーンアップエラー:", error as Error\)\);/g,
      'logger.error("[AudioFeedbackService] クリーンアップエラー", error as Error);',
    );
    changes += 3;
  }

  // パターン7: logger.error(..., error  as Error) の空白を修正
  content = content.replace(/error\s\s+as\s+Error/g, "error as Error");

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${changes} logger.error calls in ${filePath}`);
  }

  return changes;
}

// メイン処理
let totalChanges = 0;

console.log("🔧 Logger.error() Signature Fix - 46個のエラーを修正...\n");

// 対象ファイルリスト（TypeScriptエラーが発生しているファイル）
const targetFiles = [
  "src/data/database.ts",
  "src/data/migrations/index.ts",
  "src/data/migrations/migration-manager.ts",
  "src/data/repositories/base-repository.ts",
  "src/data/repositories/learning-history-repository.ts",
  "src/data/repositories/mock-exam-repository.ts",
  "src/data/repositories/question-repository.ts",
  "src/data/repositories/review-item-repository.ts",
  "src/data/repositories/user-progress-repository.ts",
  "src/services/answer-service.ts",
  "src/services/audio-feedback-service.ts",
  "src/services/mock-exam-service.ts",
];

// 各ファイルのlogger.errorを修正
targetFiles.forEach((file) => {
  totalChanges += fixLoggerErrorCalls(file);
});

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
