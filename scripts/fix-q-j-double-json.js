#!/usr/bin/env node

/**
 * Q_J_001-045のJSON二重定義を修正
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

console.log("🔧 Q_J_001-045のJSON二重定義を修正中...\n");

let content = fs.readFileSync(tsFilePath, "utf8");

// answer_template_jsonの二重定義を修正
// パターン: "maxEntries":5}"type":"ledger_entry...maxEntries":10}
const doubleTemplatePattern =
  /(\\"maxEntries\\":5\})\\"type\\":\\"ledger_entry[^}]*\\"maxEntries\\":10\}/g;
content = content.replace(doubleTemplatePattern, "$1");

// tags_jsonの二重定義も修正
// パターン: "examSection":1}"subcategory":"cash_deposit...examSection":1}
const doubleTagsPattern =
  /(\\"examSection\\":1\})\\"subcategory\\":[^}]*\\"examSection\\":1\}/g;
content = content.replace(doubleTagsPattern, "$1");

// ファイル保存
fs.writeFileSync(tsFilePath, content, "utf8");

console.log("✅ Q_J_001-045のJSON二重定義を修正しました！");
