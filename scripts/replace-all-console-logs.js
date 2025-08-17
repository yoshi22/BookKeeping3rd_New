const fs = require("fs");
const path = require("path");

/**
 * プロジェクト全体のconsole.log文をlogger呼び出しに置換するスクリプト
 */

// 対象ディレクトリ
const targetDir = "/Users/muroiyousuke/Projects/BookKeeping3rd/src";

// 除外ファイル（logger.ts は除外）
const excludeFiles = ["src/utils/logger.ts"];

console.log("=== 全ファイルのConsole.log置換開始 ===");

/**
 * ファイル内のconsole文を置換する
 */
function replaceConsoleInFile(filePath) {
  const relativePath = filePath.replace(
    "/Users/muroiyousuke/Projects/BookKeeping3rd/",
    "",
  );

  // 除外ファイルのチェック
  if (excludeFiles.includes(relativePath)) {
    console.log(`⏭️  スキップ: ${relativePath} (除外リスト)`);
    return 0;
  }

  let content = fs.readFileSync(filePath, "utf8");
  const originalContent = content;
  let replacedCount = 0;

  // logger import の追加が必要かチェック
  const hasLoggerImport =
    content.includes("import { logger }") ||
    content.includes('from "../utils/logger"');

  if (!hasLoggerImport && content.includes("console.")) {
    // import文の追加
    const importMatch = content.match(/^(import.*from.*;?\n)+/m);
    if (importMatch) {
      const importEnd = importMatch.index + importMatch[0].length;
      const beforeImports = content.substring(0, importEnd);
      const afterImports = content.substring(importEnd);

      // 相対パスを計算
      const depth = (relativePath.match(/\//g) || []).length;
      const relativeLoggerPath = "../".repeat(depth) + "utils/logger";

      content =
        beforeImports +
        `import { logger } from "${relativeLoggerPath}";\n` +
        afterImports;
    }
  }

  // 一般的な置換パターン
  const replacements = [
    // console.log()系
    {
      pattern: /console\.log\(`([^`]+)`, ([^)]+)\);/g,
      replacement: 'logger.debug("$1", { details: $2 });',
    },
    {
      pattern: /console\.log\("([^"]+)", ([^)]+)\);/g,
      replacement: 'logger.debug("$1", { details: $2 });',
    },
    {
      pattern: /console\.log\(`([^`]+)`\);/g,
      replacement: 'logger.debug("$1");',
    },
    {
      pattern: /console\.log\("([^"]+)"\);/g,
      replacement: 'logger.debug("$1");',
    },

    // console.warn()系
    {
      pattern: /console\.warn\(`([^`]+)`, ([^)]+)\);/g,
      replacement: 'logger.warn("$1", { details: $2 });',
    },
    {
      pattern: /console\.warn\("([^"]+)", ([^)]+)\);/g,
      replacement: 'logger.warn("$1", { details: $2 });',
    },
    {
      pattern: /console\.warn\(`([^`]+)`\);/g,
      replacement: 'logger.warn("$1");',
    },
    {
      pattern: /console\.warn\("([^"]+)"\);/g,
      replacement: 'logger.warn("$1");',
    },

    // console.error()系
    {
      pattern: /console\.error\(`([^`]+)`, ([^)]+)\);/g,
      replacement: 'logger.error("$1", $2);',
    },
    {
      pattern: /console\.error\("([^"]+)", ([^)]+)\);/g,
      replacement: 'logger.error("$1", $2);',
    },
    {
      pattern: /console\.error\(`([^`]+)`\);/g,
      replacement: 'logger.error("$1");',
    },
    {
      pattern: /console\.error\("([^"]+)"\);/g,
      replacement: 'logger.error("$1");',
    },

    // console.info()系
    {
      pattern: /console\.info\(`([^`]+)`, ([^)]+)\);/g,
      replacement: 'logger.info("$1", { details: $2 });',
    },
    {
      pattern: /console\.info\("([^"]+)", ([^)]+)\);/g,
      replacement: 'logger.info("$1", { details: $2 });',
    },
    {
      pattern: /console\.info\(`([^`]+)`\);/g,
      replacement: 'logger.info("$1");',
    },
    {
      pattern: /console\.info\("([^"]+)"\);/g,
      replacement: 'logger.info("$1");',
    },

    // console.debug()系
    {
      pattern: /console\.debug\(`([^`]+)`, ([^)]+)\);/g,
      replacement: 'logger.debug("$1", { details: $2 });',
    },
    {
      pattern: /console\.debug\("([^"]+)", ([^)]+)\);/g,
      replacement: 'logger.debug("$1", { details: $2 });',
    },
    {
      pattern: /console\.debug\(`([^`]+)`\);/g,
      replacement: 'logger.debug("$1");',
    },
    {
      pattern: /console\.debug\("([^"]+)"\);/g,
      replacement: 'logger.debug("$1");',
    },
  ];

  // 置換実行
  replacements.forEach((replacement, index) => {
    const matches = content.match(replacement.pattern);
    if (matches) {
      content = content.replace(replacement.pattern, replacement.replacement);
      replacedCount += matches.length;
    }
  });

  // ファイルに書き込み（変更があった場合のみ）
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${relativePath}: ${replacedCount}件の置換`);
  } else if (originalContent.includes("console.")) {
    console.log(`⚠️  ${relativePath}: 置換パターンに該当しないconsole文が存在`);
  }

  return replacedCount;
}

/**
 * ディレクトリを再帰的に探索してTypeScriptファイルを処理
 */
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  let totalReplaced = 0;

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // node_modules等を除外
      if (!item.startsWith(".") && item !== "node_modules") {
        totalReplaced += processDirectory(fullPath);
      }
    } else if (
      stat.isFile() &&
      (item.endsWith(".ts") || item.endsWith(".tsx"))
    ) {
      totalReplaced += replaceConsoleInFile(fullPath);
    }
  }

  return totalReplaced;
}

// 実行
const totalReplaced = processDirectory(targetDir);

console.log(`\n✅ 全ファイルの console 文置換完了: ${totalReplaced}件`);
console.log("=== 置換完了 ===");
