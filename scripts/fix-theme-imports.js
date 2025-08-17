#!/usr/bin/env node

/**
 * Theme Import Fix Script
 * Fixes Theme type import issues across all affected files
 */

const fs = require("fs");
const path = require("path");

const files = [
  "/Users/muroiyousuke/Projects/BookKeeping3rd/app/(tabs)/review/index.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/MockExamScreen.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/LedgerEntryFormWithDropdown.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/ChoiceAnswerForm.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/NumberInput.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/VoucherEntryForm.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/MultipleBlankChoiceForm.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/AccountDropdown.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/hooks/useProgressIndicators.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/QuestionDisplay.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/QuestionText.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/app/(tabs)/settings.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/AnswerGuide.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/mock-exam/LedgerEntryForm.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/FinancialStatementForm.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/mock-exam/TrialBalanceForm.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/AnswerResultDialog.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/CorrectAnswerExample.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/LazyComponent.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/LedgerEntryForm.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/ExplanationPanel.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/AnswerForm.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/QuestionNavigation.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/MockExamSelector.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/src/components/MockExamResult.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/app/mock-exam/result.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/app/(tabs)/index.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/app/(tabs)/stats.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/app/(tabs)/learning/category/[categoryId].tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/app/(tabs)/learning/index.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/app/mock-exam.tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/app/(tabs)/review/question/[id].tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/app/(tabs)/learning/question/[id].tsx",
  "/Users/muroiyousuke/Projects/BookKeeping3rd/app/(tabs)/mock-exam.tsx",
];

function getThemeContextImportPath(filePath) {
  const relativePath = path.relative(
    path.dirname(filePath),
    "/Users/muroiyousuke/Projects/BookKeeping3rd/src/context/ThemeContext",
  );
  return relativePath.startsWith(".") ? relativePath : "./" + relativePath;
}

function fixThemeImports(filePath) {
  try {
    console.log(`Processing: ${filePath}`);

    const content = fs.readFileSync(filePath, "utf8");

    // Skip if file doesn't exist
    if (!content) {
      console.log(`  - File is empty or doesn't exist, skipping`);
      return;
    }

    // Get the correct import path for Theme
    const themeImportPath = getThemeContextImportPath(filePath);

    // Check if Theme type import already exists
    const hasThemeImport =
      content.includes("type { Theme }") || content.includes("Theme }");

    let newContent = content;

    // 1. Replace typeof import pattern with just Theme
    const typeofImportRegex =
      /typeof import\(['"](.*?)ThemeContext['"]\)\.Theme/g;
    newContent = newContent.replace(typeofImportRegex, "Theme");

    // 2. Add Theme import if not already present and if we made changes
    if (!hasThemeImport && typeofImportRegex.test(content)) {
      // Find existing ThemeContext import line
      const themeContextImportRegex =
        /(import\s*\{[^}]*\}\s*from\s*['"](.*?)ThemeContext['"])/;
      const match = newContent.match(themeContextImportRegex);

      if (match) {
        // Add Theme to existing import
        const existingImport = match[1];
        const updatedImport = existingImport.replace(
          /import\s*\{([^}]*)\}/,
          (_, imports) => {
            const cleanImports = imports
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
            if (!cleanImports.some((imp) => imp.includes("Theme"))) {
              cleanImports.push("type Theme");
            }
            return `import { ${cleanImports.join(", ")} }`;
          },
        );
        newContent = newContent.replace(existingImport, updatedImport);
      } else {
        // Add new import at the top
        const lines = newContent.split("\n");
        let insertIndex = 0;

        // Find the best place to insert (after React import, before first component import)
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith("import") && lines[i].includes("react")) {
            insertIndex = i + 1;
          } else if (lines[i].startsWith("import") && insertIndex > 0) {
            break;
          }
        }

        lines.splice(
          insertIndex,
          0,
          `import type { Theme } from "${themeImportPath}";`,
        );
        newContent = lines.join("\n");
      }
    }

    // Write back only if changes were made
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, "utf8");
      console.log(`  ✅ Fixed Theme imports`);
    } else {
      console.log(`  - No changes needed`);
    }
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error.message);
  }
}

console.log("🔧 Starting Theme import fixes...\n");

files.forEach(fixThemeImports);

console.log("\n✅ Theme import fixes completed!");
