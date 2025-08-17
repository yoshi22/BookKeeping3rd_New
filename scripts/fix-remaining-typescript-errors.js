#!/usr/bin/env node

/**
 * Phase 2 TypeScript Error Fix Script
 * 残りのTypeScriptエラーを修正する包括的スクリプト
 */

const fs = require("fs");
const path = require("path");

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return 0;
  }

  let content = fs.readFileSync(filePath, "utf-8");
  const originalContent = content;
  let changes = 0;

  // 1. Logger import path fixes
  const loggerImportPatterns = [
    {
      from: /from ['"]\.\.\/\.\.\/utils\/logger['"];?/g,
      to: 'from "../../utils/logger";',
    },
    {
      from: /from ['"]\.\.\/utils\/logger['"];?/g,
      to: 'from "../utils/logger";',
    },
    {
      from: /import { logger } from ['"]\.\.\/\.\.\/\.\.\/utils\/logger['"];?/g,
      to: 'import { logger } from "../../../utils/logger";',
    },
  ];

  loggerImportPatterns.forEach((pattern) => {
    const matches = content.match(pattern.from);
    if (matches) {
      content = content.replace(pattern.from, pattern.to);
      changes += matches.length;
    }
  });

  // 2. Fix logger.error calls with Error objects
  // Fix calls like: logger.error(new Error("message", errorVar as Error))
  content = content.replace(
    /logger\.error\(new Error\("([^"]+)",\s*([^,\)]+)\s*as\s*Error[^)]*\)\);?/g,
    (match, message, errorVar) => {
      changes++;
      return `logger.error("${message}", ${errorVar} as Error);`;
    },
  );

  // Fix calls like: logger.error("message", errorVar as Error, { ... })
  content = content.replace(
    /logger\.error\("([^"]+)",\s*([^,\s]+)\s*as\s*Error,\s*(\{[^}]*\})\);?/g,
    (match, message, errorVar, options) => {
      changes++;
      return `logger.error("${message}", ${errorVar} as Error, ${options});`;
    },
  );

  // Fix calls like: logger.error(new Error("message"), errorVar as Error, { ... })
  content = content.replace(
    /logger\.error\(new Error\("([^"]+)"\),\s*([^,\s]+)\s*as\s*Error,\s*(\{[^}]*\})\);?/g,
    (match, message, errorVar, options) => {
      changes++;
      return `logger.error("${message}", ${errorVar} as Error, ${options});`;
    },
  );

  // 3. Fix new Error constructor with multiple arguments
  content = content.replace(
    /new Error\("([^"]+)",\s*([^,\)]+)\s*as\s*Error/g,
    (match, message, errorVar) => {
      changes++;
      return `new Error(\`${message}: \${(${errorVar} as Error).message}\`)`;
    },
  );

  // 4. Fix Error being passed where string is expected
  content = content.replace(
    /logger\.error\(([^,\s]+)\s*as\s*Error\);?/g,
    (match, errorVar) => {
      changes++;
      return `logger.error((${errorVar} as Error).message);`;
    },
  );

  // 5. Fix logger.error calls expecting only 0-2 arguments but getting 3
  content = content.replace(
    /logger\.error\("([^"]+)",\s*([^,\s]+)\s*as\s*Error,\s*(\{[^}]*\})\);?/g,
    (match, message, errorVar, options) => {
      changes++;
      return `logger.error("${message}", ${errorVar} as Error);`;
    },
  );

  if (changes > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${changes} issues in ${filePath}`);
  }

  return changes;
}

function fixAnswerResultDialogProps() {
  const dialogPath = "src/components/AnswerResultDialog.tsx";

  if (!fs.existsSync(dialogPath)) {
    console.log(`File not found: ${dialogPath}`);
    return 0;
  }

  let content = fs.readFileSync(dialogPath, "utf-8");
  let changes = 0;

  // Add onReviewQuestion to AnswerResultDialogProps if it doesn't exist
  if (
    content.includes("interface AnswerResultDialogProps") &&
    !content.includes("onReviewQuestion")
  ) {
    content = content.replace(
      /(interface AnswerResultDialogProps\s*\{[^}]*)(onClose:\s*\(\)\s*=>\s*void;?)([^}]*\})/s,
      (match, start, onClose, end) => {
        changes++;
        return `${start}${onClose}
  onReviewQuestion?: () => void;${end}`;
      },
    );

    if (changes > 0) {
      fs.writeFileSync(dialogPath, content);
      console.log(`✅ Added onReviewQuestion prop to AnswerResultDialogProps`);
    }
  }

  return changes;
}

// Files that need logger import path fixes
const filesToFix = [
  "src/components/AnswerForm.tsx",
  "src/components/ChoiceAnswerForm.tsx",
  "src/components/feedback/ErrorBoundary.tsx",
  "src/components/LazyComponent.tsx",
  "src/components/LedgerEntryFormWithDropdown.tsx",
  "src/components/MockExamScreen.tsx",
  "src/components/MockExamSelector.tsx",
  "src/components/MultipleBlankChoiceForm.tsx",
  "src/components/QuestionDisplay.tsx",
  "src/components/unified/JournalEntryForm.tsx",
  "src/components/unified/LedgerEntryForm.tsx",
  "src/components/VoucherEntryForm.tsx",
  "src/context/ThemeContext.tsx",
  "src/data/database-optimized.ts",
  "src/data/database.ts",
  "src/services/answer-service.ts",
  "src/services/review-service.ts",
  "src/services/statistics-service.ts",
  "src/services/storage-optimizer.ts",
  "src/services/offline-cache-service.ts",
  "src/services/offline-sync-service.ts",
  "src/utils/reset-database.ts",
];

let totalChanges = 0;

console.log("🔧 Fixing remaining TypeScript errors...\n");

// Fix logger imports and error handling in all files
filesToFix.forEach((file) => {
  totalChanges += fixFile(file);
});

// Fix AnswerResultDialogProps
totalChanges += fixAnswerResultDialogProps();

console.log(`\n✅ Total changes made: ${totalChanges}`);
console.log("🎯 Running TypeScript check to verify fixes...\n");
