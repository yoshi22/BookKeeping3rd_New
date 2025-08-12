#!/usr/bin/env node

/**
 * Q_T_001-012の不正な追加テンプレートを削除
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

console.log("🔧 Q_T_001-012の不正な追加テンプレートを削除中...\n");

let content = fs.readFileSync(tsFilePath, "utf8");

// Q_T_001-012の各問題の不正な部分を削除
for (let i = 1; i <= 12; i++) {
  const id = `Q_T_${String(i).padStart(3, "0")}`;

  // ledger_entryのパターンがまだ残っている場合は削除
  // パターン: ...}","name":"date","label":"日付"... または類似のledger_entryフィールド
  const ledgerPattern = new RegExp(
    `("id":\\s*"${id}"[\\s\\S]*?"answer_template_json":\\s*"[^"]*?)("\\{"name":"date","label":"日付"[^}]*\\}[^"]*)"`,
    "g",
  );

  content = content.replace(ledgerPattern, (match, p1, p2, p3) => {
    console.log(`✅ ${id} の不正な追加テンプレートを削除`);
    return p1 + '"';
  });

  // 別のパターンもチェック
  const fieldPattern = new RegExp(
    `("id":\\s*"${id}"[\\s\\S]*?"answer_template_json":\\s*"[^"]*?)(\\[\\{"name":"date"[^\\]]*\\][^"]*)"`,
    "g",
  );

  content = content.replace(fieldPattern, (match, p1, p2, p3) => {
    console.log(`✅ ${id} の不正なフィールド配列を削除`);
    return p1 + '"';
  });
}

// ファイル保存
fs.writeFileSync(tsFilePath, content, "utf8");

console.log("\n✅ Q_T_001-012の不正な追加テンプレート削除完了！");
