#!/usr/bin/env node

/**
 * Comprehensive script to fix all error handling type issues
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Get all TypeScript files in src/
function getAllTypeScriptFiles() {
  try {
    const result = execSync('find src -name "*.ts" -o -name "*.tsx"', {
      encoding: "utf8",
    });
    return result
      .trim()
      .split("\n")
      .filter((line) => line.trim() !== "");
  } catch (error) {
    console.error("Failed to find TypeScript files");
    return [];
  }
}

// Fix error handling in a file
function fixErrorHandlingInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let changes = 0;

    // Fix logger.error calls with unknown errors
    const loggerErrorPatterns = [
      /logger\.error\(([^,]+),\s*([a-zA-Z_][a-zA-Z0-9_]*)\);/g,
      /logger\.error\(([^,]+),\s*error\);/g,
      /logger\.error\(([^,]+),\s*resetError\);/g,
      /logger\.error\(([^,]+),\s*e\);/g,
    ];

    loggerErrorPatterns.forEach((pattern) => {
      content = content.replace(pattern, (match, message, errorVar) => {
        if (!match.includes(" as Error")) {
          changes++;
          return match.replace(`${errorVar});`, `${errorVar} as Error);`);
        }
        return match;
      });
    });

    // Fix logger.error with string as first parameter (should be Error)
    content = content.replace(
      /logger\.error\(([^)]+as Error[^)]*)\);/g,
      (match, content) => {
        if (content.includes('"') && !content.includes("new Error(")) {
          changes++;
          return match.replace(content, `new Error(${content})`);
        }
        return match;
      },
    );

    // Fix error.message access
    content = content.replace(/(\w+)\.message/g, (match, errorVar) => {
      if (["error", "e", "err", "exception"].includes(errorVar)) {
        changes++;
        return `(${errorVar} as Error).message`;
      }
      return match;
    });

    // Fix throw statements with error.message
    content = content.replace(
      /throw new Error\(([^)]*error\.message[^)]*)\);/g,
      (match, errorExpr) => {
        changes++;
        return match.replace("error.message", "(error as Error).message");
      },
    );

    // Fix type assignments from unknown to string
    content = content.replace(
      /(\w+):\s*string\s*=\s*(error|e|err)\.message/g,
      (match, varName, errorVar) => {
        changes++;
        return `${varName}: string = (${errorVar} as Error).message`;
      },
    );

    if (changes > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed ${changes} error handling issues in ${filePath}`);
    }

    return changes;
  } catch (error) {
    console.error(`Failed to process ${filePath}:`, error.message);
    return 0;
  }
}

// Fix import path issues
function fixImportPaths(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let changes = 0;

    // Fix logger import paths
    if (filePath.includes("src/components/")) {
      content = content.replace(
        /import \{ logger \} from ["']\.\.\/utils\/logger["'];/g,
        () => {
          changes++;
          return `import { logger } from "../../utils/logger";`;
        },
      );
    }

    if (changes > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed ${changes} import path issues in ${filePath}`);
    }

    return changes;
  } catch (error) {
    console.error(`Failed to fix imports in ${filePath}:`, error.message);
    return 0;
  }
}

// Main execution
function main() {
  console.log("Starting comprehensive error handling fixes...\n");

  const allFiles = getAllTypeScriptFiles();
  let totalChanges = 0;

  for (const file of allFiles) {
    if (fs.existsSync(file)) {
      totalChanges += fixImportPaths(file);
      totalChanges += fixErrorHandlingInFile(file);
    }
  }

  console.log(
    `\nCompleted! Fixed ${totalChanges} issues across ${allFiles.length} files.`,
  );
}

if (require.main === module) {
  main();
}
