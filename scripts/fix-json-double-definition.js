#!/usr/bin/env node

/**
 * JSONの二重定義問題を解消するスクリプト
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

console.log("🔧 JSONの二重定義問題を修正中...\n");

let content = fs.readFileSync(tsFilePath, "utf8");

// Q_T_001-012のJSONダブル定義を修正
// パターン: ...30}"type":"ledger_entry"... または ...30}\"type\":\"ledger_entry\"...
const doubleJsonPattern = /(\}",?\s*\"type\\"?:\\"?ledger_entry[^"]*?\})/g;

let fixCount = 0;

// 各Q_T問題について個別に処理
for (let i = 1; i <= 12; i++) {
  const id = `Q_T_${String(i).padStart(3, "0")}`;

  // この問題IDの部分を探す
  const questionPattern = new RegExp(
    `("id":\\s*"${id}"[\\s\\S]*?"answer_template_json":\\s*"[^"]*?)(\\}"type[^"]*?ledger_entry[^"]*?\\})(")`,
  );

  if (questionPattern.test(content)) {
    content = content.replace(questionPattern, (match, p1, p2, p3) => {
      fixCount++;
      console.log(`✅ ${id} の二重テンプレートを削除`);
      return p1 + "}" + p3;
    });
  }
}

// バックスラッシュが重複している箇所を修正
content = content.replace(/\\\\"/g, '\\"');

// ファイル保存
fs.writeFileSync(tsFilePath, content, "utf8");

console.log(`\n✅ ${fixCount} 箇所のJSONの二重定義を修正しました！`);
