#!/usr/bin/env node

/**
 * Q_T_001-012のテンプレート重複を最終修正
 */

const fs = require("fs");
const path = require("path");

const tsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

console.log("🔧 Q_T_001-012のテンプレート重複を最終修正中...\n");

let content = fs.readFileSync(tsFilePath, "utf8");
let fixCount = 0;

// 各問題を個別に処理
for (let i = 1; i <= 12; i++) {
  const id = `Q_T_${String(i).padStart(3, "0")}`;

  // answer_template_jsonフィールドの内容を取得して修正
  const pattern = new RegExp(
    `("id":\\s*"${id}"[\\s\\S]*?"answer_template_json":\\s*")([^"]*)"`,
    "g",
  );

  content = content.replace(pattern, (match, p1, templateContent) => {
    // テンプレート内容に重複がある場合
    if (
      templateContent.includes('}{"name"') ||
      templateContent.includes('}"type')
    ) {
      fixCount++;
      console.log(`✅ ${id} の重複テンプレートを修正`);

      // 最初の有効なJSONオブジェクトだけを残す
      // maxEntriesで終わる部分までを抽出
      let cleanedTemplate = templateContent;

      if (i >= 1 && i <= 4) {
        // 財務諸表: maxEntries":30}で終わるべき
        const endIndex = cleanedTemplate.indexOf('maxEntries\\":30}');
        if (endIndex > -1) {
          cleanedTemplate = cleanedTemplate.substring(0, endIndex + 17); // 'maxEntries\":30}'の長さ
        }
      } else if (i >= 5 && i <= 8) {
        // 精算表: maxEntries":20}で終わるべき
        const endIndex = cleanedTemplate.indexOf('maxEntries\\":20}');
        if (endIndex > -1) {
          cleanedTemplate = cleanedTemplate.substring(0, endIndex + 17);
        }
      } else {
        // 試算表: maxEntries":10}で終わるべき
        const endIndex = cleanedTemplate.indexOf('maxEntries\\":10}');
        if (endIndex > -1) {
          cleanedTemplate = cleanedTemplate.substring(0, endIndex + 17);
        }
      }

      return p1 + cleanedTemplate + '"';
    }

    return match;
  });
}

// ファイル保存
fs.writeFileSync(tsFilePath, content, "utf8");

console.log(`\n✅ ${fixCount} 箇所のテンプレート重複を修正しました！`);
