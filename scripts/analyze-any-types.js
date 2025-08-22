/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires, no-console */
const fs = require("fs");
const path = require("path");

/**
 * any型の使用箇所を分析・カテゴリ化するスクリプト
 */

const targetDir = "/Users/muroiyousuke/Projects/BookKeeping3rd/src";

console.log("=== any型分析開始 ===");

// 分析結果を格納
const anyUsages = {
  explicitAny: [], // ": any"
  anyArrays: [], // "any[]"
  recordAny: [], // "Record<string, any>"
  functionParams: [], // "(param: any)"
  errorTypes: [], // "error: any"
  databaseTypes: [], // SQLite関連のany
  unknown: [], // その他
};

let totalCount = 0;

/**
 * ファイル内のany型を分析
 */
function analyzeAnyTypes(filePath) {
  const relativePath = filePath.replace(
    "/Users/muroiyousuke/Projects/BookKeeping3rd/",
    "",
  );
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    // 各パターンをチェック
    if (line.includes("any")) {
      const context = {
        file: relativePath,
        line: lineNumber,
        content: trimmedLine,
        snippet: trimmedLine.substring(0, 100),
      };

      totalCount++;

      // カテゴリ分類
      if (
        /:\s*any\s*$/.test(trimmedLine) ||
        /:\s*any\s*[,;]/.test(trimmedLine)
      ) {
        anyUsages.explicitAny.push(context);
      } else if (/any\[\]/.test(trimmedLine)) {
        anyUsages.anyArrays.push(context);
      } else if (/Record<.*,\s*any.*>/.test(trimmedLine)) {
        anyUsages.recordAny.push(context);
      } else if (
        /\(\s*.*:\s*any\s*\)/.test(trimmedLine) ||
        /function.*\(.*:\s*any.*\)/.test(trimmedLine)
      ) {
        anyUsages.functionParams.push(context);
      } else if (
        /error.*:\s*any/.test(trimmedLine) ||
        /catch.*any/.test(trimmedLine)
      ) {
        anyUsages.errorTypes.push(context);
      } else if (
        /database|sqlite|sql|query|result/i.test(trimmedLine) &&
        /any/.test(trimmedLine)
      ) {
        anyUsages.databaseTypes.push(context);
      } else {
        anyUsages.unknown.push(context);
      }
    }
  });
}

/**
 * ディレクトリを再帰的に処理
 */
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!item.startsWith(".") && item !== "node_modules") {
        processDirectory(fullPath);
      }
    } else if (
      stat.isFile() &&
      (item.endsWith(".ts") || item.endsWith(".tsx"))
    ) {
      analyzeAnyTypes(fullPath);
    }
  }
}

// 分析実行
processDirectory(targetDir);

// 結果出力
console.log(`\n📊 any型使用状況サマリー (合計: ${totalCount}件)`);
console.log("=" * 50);

Object.entries(anyUsages).forEach(([category, usages]) => {
  console.log(`\n🔍 ${category}: ${usages.length}件`);

  if (usages.length > 0) {
    // 上位5件を表示
    usages.slice(0, 5).forEach((usage, index) => {
      console.log(`  ${index + 1}. ${usage.file}:${usage.line}`);
      console.log(`     ${usage.snippet}...`);
    });

    if (usages.length > 5) {
      console.log(`     ... 他 ${usages.length - 5}件`);
    }
  }
});

// 優先順位の提案
console.log(`\n🎯 修正優先順位の提案:`);
console.log(
  `1. errorTypes (${anyUsages.errorTypes.length}件) - Error | unknown に置換`,
);
console.log(
  `2. functionParams (${anyUsages.functionParams.length}件) - 具体的な型定義`,
);
console.log(
  `3. explicitAny (${anyUsages.explicitAny.length}件) - プロパティ別型定義`,
);
console.log(
  `4. recordAny (${anyUsages.recordAny.length}件) - Record<string, T> に改善`,
);
console.log(`5. anyArrays (${anyUsages.anyArrays.length}件) - T[] に型定義`);
console.log(
  `6. databaseTypes (${anyUsages.databaseTypes.length}件) - DB専用型作成`,
);

// ファイル別サマリー
const fileStats = {};
Object.values(anyUsages)
  .flat()
  .forEach((usage) => {
    if (!fileStats[usage.file]) {
      fileStats[usage.file] = 0;
    }
    fileStats[usage.file]++;
  });

console.log(`\n📁 最もany型が多いファイル (Top 10):`);
Object.entries(fileStats)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 10)
  .forEach(([file, count], index) => {
    console.log(`  ${index + 1}. ${file}: ${count}件`);
  });

// JSON形式でも保存
const report = {
  summary: {
    totalCount,
    byCategory: Object.fromEntries(
      Object.entries(anyUsages).map(([key, value]) => [key, value.length]),
    ),
    topFiles: Object.entries(fileStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20),
  },
  details: anyUsages,
  generatedAt: new Date().toISOString(),
};

fs.writeFileSync(
  "/Users/muroiyousuke/Projects/BookKeeping3rd/docs/analysis/any-types-analysis.json",
  JSON.stringify(report, null, 2),
);

console.log(
  `\n✅ 詳細レポートを docs/analysis/any-types-analysis.json に保存しました`,
);
console.log("=== 分析完了 ===");
