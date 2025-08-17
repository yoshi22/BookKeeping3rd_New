#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Find all files that need Theme type import fixes
function findFilesNeedingThemeImport() {
  try {
    const grepResult = execSync(
      'grep -r "from.*ThemeContext" src/ app/ | grep -v "type Theme" | grep -E "(useTheme|useThemedStyles)"',
      { encoding: "utf8" },
    );

    const lines = grepResult.trim().split("\n");
    const files = lines
      .map((line) => line.split(":")[0])
      .filter((file, index, self) => self.indexOf(file) === index); // Remove duplicates

    return files;
  } catch (error) {
    console.error("Error finding files:", error.message);
    return [];
  }
}

// Fix Theme import in a single file
function fixThemeImportInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // Pattern to match ThemeContext imports without type Theme
    const importPatterns = [
      // Pattern 1: import { useTheme, useThemedStyles } from "../context/ThemeContext";
      {
        regex:
          /import\s*\{\s*(useTheme(?:\s*,\s*useThemedStyles)?(?:\s*,\s*useColors)?(?:\s*,\s*useDynamicColors)?(?:\s*,\s*useResponsiveTheme)?(?:\s*,\s*useAccessibleStyles)?)\s*\}\s*from\s*["']([^"']*ThemeContext)["'];/g,
        replacement: (match, imports, modulePath) => {
          return `import { ${imports}, type Theme } from "${modulePath}";`;
        },
      },
      // Pattern 2: import { useTheme } from "...";
      {
        regex:
          /import\s*\{\s*useTheme\s*\}\s*from\s*["']([^"']*ThemeContext)["'];/g,
        replacement: (match, modulePath) => {
          return `import { useTheme, type Theme } from "${modulePath}";`;
        },
      },
    ];

    let modifiedContent = content;
    let wasModified = false;

    // Apply each pattern
    importPatterns.forEach((pattern) => {
      const newContent = modifiedContent.replace(
        pattern.regex,
        pattern.replacement,
      );
      if (newContent !== modifiedContent) {
        modifiedContent = newContent;
        wasModified = true;
      }
    });

    if (wasModified) {
      fs.writeFileSync(filePath, modifiedContent, "utf8");
      console.log(`✅ Fixed Theme import in: ${filePath}`);
      return true;
    } else {
      console.log(`⚠️  No changes needed in: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Main function
function main() {
  console.log("🔍 Finding files that need Theme type import fixes...");

  const files = findFilesNeedingThemeImport();

  if (files.length === 0) {
    console.log("✅ No files found that need Theme import fixes");
    return;
  }

  console.log(`📝 Found ${files.length} files to fix:`);
  files.forEach((file) => console.log(`   - ${file}`));
  console.log("");

  let fixedCount = 0;
  files.forEach((file) => {
    if (fixThemeImportInFile(file)) {
      fixedCount++;
    }
  });

  console.log(`\n🎉 Fixed ${fixedCount} out of ${files.length} files`);

  if (fixedCount > 0) {
    console.log("\n🔄 Running TypeScript check to verify fixes...");
    try {
      execSync("npx tsc --noEmit --skipLibCheck", {
        encoding: "utf8",
        stdio: "pipe",
      });
      console.log("✅ TypeScript check passed!");
    } catch (error) {
      console.log(
        "⚠️  Some TypeScript errors remain, but Theme import errors should be fixed",
      );
    }
  }
}

if (require.main === module) {
  main();
}
