#!/usr/bin/env node

/**
 * Script to fix error handling issues throughout the codebase
 * Converts `logger.error("message", error)` to `logger.error("message", error as Error)`
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Find all files with logger.error issues
function findFilesWithLoggerErrors() {
  try {
    const result = execSync('rg -l "logger\\.error.*error\\);$" src/', {
      encoding: "utf8",
    });
    return result
      .trim()
      .split("\n")
      .filter((line) => line.trim() !== "");
  } catch (error) {
    console.log("No files found with logger.error issues");
    return [];
  }
}

// Fix error handling in a specific file
function fixErrorHandling(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let changes = 0;

    // Pattern 1: logger.error("message", error);
    content = content.replace(
      /logger\.error\(([^,]+),\s*error\);/g,
      (match, message) => {
        changes++;
        return `logger.error(${message}, error as Error);`;
      },
    );

    // Pattern 2: logger.error("message", resetError);
    content = content.replace(
      /logger\.error\(([^,]+),\s*resetError\);/g,
      (match, message) => {
        changes++;
        return `logger.error(${message}, resetError as Error);`;
      },
    );

    // Pattern 3: Other specific error variables
    content = content.replace(
      /logger\.error\(([^,]+),\s*([a-zA-Z_][a-zA-Z0-9_]*Error)\);/g,
      (match, message, errorVar) => {
        changes++;
        return `logger.error(${message}, ${errorVar} as Error);`;
      },
    );

    if (changes > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed ${changes} error handling issues in ${filePath}`);
      return changes;
    }

    return 0;
  } catch (error) {
    console.error(`Failed to fix ${filePath}:`, error.message);
    return 0;
  }
}

// Fix type assignment issues
function fixTypeAssignments(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let changes = 0;

    // Fix error.message assignments
    content = content.replace(
      /throw new Error\(error\.message\|\|.*?\);/g,
      (match) => {
        changes++;
        return match.replace("error.message", "(error as Error).message");
      },
    );

    // Fix other error property access
    content = content.replace(/error\.message/g, (match) => {
      changes++;
      return "(error as Error).message";
    });

    if (changes > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed ${changes} type assignment issues in ${filePath}`);
      return changes;
    }

    return 0;
  } catch (error) {
    console.error(
      `Failed to fix type assignments in ${filePath}:`,
      error.message,
    );
    return 0;
  }
}

// Main execution
function main() {
  console.log("Starting error handling fixes...\n");

  const files = findFilesWithLoggerErrors();
  let totalChanges = 0;

  // Additional files that may have type issues
  const additionalFiles = [
    "src/data/migrations/index.ts",
    "src/data/migrations/migration-manager.ts",
    "src/data/database.ts",
    "src/context/ThemeContext.tsx",
    "src/services/review-service.ts",
  ];

  const allFiles = [...new Set([...files, ...additionalFiles])];

  for (const file of allFiles) {
    if (fs.existsSync(file)) {
      totalChanges += fixErrorHandling(file);
      totalChanges += fixTypeAssignments(file);
    }
  }

  console.log(
    `\nCompleted! Fixed ${totalChanges} error handling issues across ${allFiles.length} files.`,
  );
}

if (require.main === module) {
  main();
}
