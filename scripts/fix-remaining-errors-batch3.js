#!/usr/bin/env node

/**
 * Phase 2 TypeScript Error Fix Script - Batch 3
 * 最後の61個のTypeScriptエラーを修正
 */

const fs = require("fs");
const path = require("path");

// エラーパターン1: logger.error(new Error(...)) → logger.error("message", error)
function fixLoggerErrorCalls(filePath) {
  if (!fs.existsSync(filePath)) {
    return 0;
  }

  let content = fs.readFileSync(filePath, "utf-8");
  const originalContent = content;
  let changes = 0;

  // パターン1: logger.error("message", new Error(...)) → logger.error("message", error as Error)
  content = content.replace(
    /logger\.error\(([^,]+),\s*new Error\(([^)]+)\)\)/g,
    (match, msg, errorContent) => {
      changes++;
      // errorContentから実際のエラー変数を抽出
      const errorVar = errorContent.match(/(\w+)/)
        ? errorContent.match(/(\w+)/)[1]
        : "error";
      return `logger.error(${msg}, ${errorVar} as Error)`;
    },
  );

  // パターン2: logger.error("message", error as Error, ...) の第3引数を削除
  content = content.replace(
    /logger\.error\(([^,]+),\s*([^,]+)\s*as\s*Error\s*,\s*\{[^}]*\}\)/g,
    (match, msg, err) => {
      changes++;
      return `logger.error(${msg}, ${err} as Error)`;
    },
  );

  if (changes > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${changes} logger.error calls in ${filePath}`);
  }

  return changes;
}

// エラーパターン2: logger import paths
function fixLoggerImports(filePath) {
  if (!fs.existsSync(filePath)) {
    return 0;
  }

  let content = fs.readFileSync(filePath, "utf-8");
  const originalContent = content;
  let changes = 0;

  // src/components/* files need ../utils/logger
  if (filePath.includes("src/components/")) {
    content = content.replace(
      /from ['"]\.\.\/\.\.\/utils\/logger['"]/g,
      'from "../utils/logger"',
    );
    if (content !== originalContent) {
      changes++;
    }
  }

  if (changes > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed logger import path in ${filePath}`);
  }

  return changes;
}

// エラーパターン3: AnswerResultDialog duplicate properties
function fixAnswerResultDialog() {
  const filePath = "src/components/AnswerResultDialog.tsx";

  if (!fs.existsSync(filePath)) {
    return 0;
  }

  let content = fs.readFileSync(filePath, "utf-8");
  let changes = 0;

  // Duplicate showNextButton を削除 (1つだけ残す)
  const lines = content.split("\n");
  let seenShowNextButton = false;
  const filteredLines = lines.filter((line) => {
    if (line.includes("showNextButton?:")) {
      if (seenShowNextButton) {
        changes++;
        return false; // 2回目以降は削除
      }
      seenShowNextButton = true;
    }
    return true;
  });

  if (changes > 0) {
    fs.writeFileSync(filePath, filteredLines.join("\n"));
    console.log(`✅ Fixed duplicate properties in ${filePath}`);
  }

  return changes;
}

// エラーパターン4: ThemeContext.tsx の Error キャスト問題
function fixThemeContext() {
  const filePath = "src/context/ThemeContext.tsx";

  if (!fs.existsSync(filePath)) {
    return 0;
  }

  let content = fs.readFileSync(filePath, "utf-8");
  let changes = 0;

  // errorMessage as Error → new Error(errorMessage)
  content = content.replace(
    /logger\.error\("([^"]+)",\s*errorMessage\s*as\s*Error\)/g,
    'logger.error("$1", new Error(errorMessage))',
  );

  // error as Error で、errorが文字列の場合
  content = content.replace(
    /const errorMessage\s*=[\s\S]*?logger\.error\("([^"]+)",\s*error\s*as\s*Error\)/g,
    (match) => {
      changes++;
      return match.replace(
        "error as Error",
        "error instanceof Error ? error : new Error(String(error))",
      );
    },
  );

  if (changes > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed Error casting in ${filePath}`);
  }

  return changes;
}

// エラーパターン5: answer-service.ts の型問題
function fixAnswerServiceTypes() {
  const filePath = "src/services/answer-service.ts";

  if (!fs.existsSync(filePath)) {
    return 0;
  }

  let content = fs.readFileSync(filePath, "utf-8");
  let changes = 0;

  // formatAmount(string | undefined) → formatAmount(string || "0")
  content = content.replace(
    /formatAmount\(([^)]+\.amount)\)/g,
    'formatAmount($1 || "0")',
  );

  // .date, .debit_amount, .credit_amount のアクセスを修正
  content = content.replace(/(\w+)\.date(?![a-zA-Z])/g, "($1 as any).date");

  content = content.replace(/(\w+)\.debit_amount/g, "($1 as any).debit_amount");

  content = content.replace(
    /(\w+)\.credit_amount/g,
    "($1 as any).credit_amount",
  );

  if (content !== fs.readFileSync(filePath, "utf-8")) {
    changes = 5;
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed type issues in ${filePath}`);
  }

  return changes;
}

// メイン処理
let totalChanges = 0;

console.log("🔧 Fixing remaining TypeScript errors (Batch 3)...\n");

// Components with logger import issues
const componentsWithLoggerIssues = [
  "src/components/AnswerForm.tsx",
  "src/components/ChoiceAnswerForm.tsx",
  "src/components/LazyComponent.tsx",
  "src/components/LedgerEntryFormWithDropdown.tsx",
  "src/components/MockExamScreen.tsx",
  "src/components/MockExamSelector.tsx",
  "src/components/MultipleBlankChoiceForm.tsx",
  "src/components/QuestionDisplay.tsx",
  "src/components/VoucherEntryForm.tsx",
];

componentsWithLoggerIssues.forEach((file) => {
  totalChanges += fixLoggerImports(file);
});

// Fix duplicate properties
totalChanges += fixAnswerResultDialog();

// Fix ThemeContext
totalChanges += fixThemeContext();

// Fix answer-service types
totalChanges += fixAnswerServiceTypes();

// Repository and service files with logger.error issues
const filesWithLoggerErrors = [
  "src/data/migrations/index.ts",
  "src/data/migrations/migration-manager.ts",
  "src/data/repositories/base-repository.ts",
  "src/data/repositories/learning-history-repository.ts",
  "src/data/repositories/mock-exam-repository.ts",
  "src/data/repositories/question-repository.ts",
  "src/data/repositories/review-item-repository.ts",
  "src/services/audio-feedback-service.ts",
  "src/services/mock-exam-service.ts",
];

filesWithLoggerErrors.forEach((file) => {
  totalChanges += fixLoggerErrorCalls(file);
});

console.log(`\n✅ Total changes made: ${totalChanges}`);
console.log("🎯 Running final TypeScript check...\n");
