#!/usr/bin/env node

/**
 * Theme Import Fix Script v2
 * Properly adds Theme type to existing ThemeContext imports
 */

const fs = require("fs");
const { execSync } = require("child_process");

console.log("🔧 Finding files with Theme import issues...\n");

// Find all files that need Theme import fixes
const result = execSync(
  'npx tsc --noEmit 2>&1 | grep "Cannot find name \'Theme\'" | cut -d"(" -f1 | sort -u',
  { encoding: "utf8" },
);
const files = result
  .trim()
  .split("\n")
  .filter((f) => f && f.includes(".tsx"));

console.log(`Found ${files.length} files to fix:\n`);

files.forEach((file) => {
  try {
    console.log(`Processing: ${file}`);

    const fullPath = `/Users/muroiyousuke/Projects/BookKeeping3rd/${file}`;
    const content = fs.readFileSync(fullPath, "utf8");

    // Find ThemeContext import line
    const themeContextImportRegex =
      /(import\s*\{[^}]*\}\s*from\s*['"](.*?)ThemeContext['"])/;
    const match = content.match(themeContextImportRegex);

    if (match) {
      const existingImport = match[1];

      // Check if Theme is already imported
      if (existingImport.includes("Theme")) {
        console.log("  - Already has Theme import, skipping");
        return;
      }

      // Add Theme to existing import
      const updatedImport = existingImport.replace(
        /import\s*\{([^}]*)\}/,
        (_, imports) => {
          const cleanImports = imports
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          cleanImports.push("type Theme");
          return `import { ${cleanImports.join(", ")} }`;
        },
      );

      const newContent = content.replace(existingImport, updatedImport);
      fs.writeFileSync(fullPath, newContent, "utf8");
      console.log("  ✅ Added Theme to existing import");
    } else {
      console.log("  ❌ No ThemeContext import found");
    }
  } catch (error) {
    console.error(`  ❌ Error processing ${file}:`, error.message);
  }
});

console.log("\n✅ Theme import fixes v2 completed!");
