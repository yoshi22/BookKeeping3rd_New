#!/usr/bin/env node

/**
 * Q_T_001-012を完全に再構築
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

console.log("🔧 Q_T_001-012を完全に再構築中...\n");

let content = fs.readFileSync(tsFilePath, "utf8");

// 各問題のJSONテンプレートが壊れているので、完全に置き換える
for (let i = 1; i <= 12; i++) {
  const id = `Q_T_${String(i).padStart(3, "0")}`;

  // answer_template_jsonフィールド全体を置き換え
  const templatePattern = new RegExp(
    `("id":\\s*"${id}"[\\s\\S]*?"answer_template_json":\\s*")[^"]*"`,
    "g",
  );

  let correctTemplate;

  if (i >= 1 && i <= 4) {
    // 財務諸表テンプレート（シンプル版）
    correctTemplate = {
      type: "financial_statement",
      sections: [
        { name: "balance_sheet", label: "貸借対照表" },
        { name: "income_statement", label: "損益計算書" },
      ],
      allowMultipleEntries: true,
      maxEntries: 30,
    };
  } else if (i >= 5 && i <= 8) {
    // 精算表テンプレート（シンプル版）
    correctTemplate = {
      type: "worksheet",
      columns: 8,
      allowMultipleEntries: true,
      maxEntries: 20,
    };
  } else {
    // 試算表テンプレート（シンプル版）
    correctTemplate = {
      type: "trial_balance",
      columns: 4,
      allowMultipleEntries: true,
      maxEntries: 10,
    };
  }

  content = content.replace(templatePattern, (match, p1) => {
    console.log(`✅ ${id} のテンプレートを完全に再構築`);
    const jsonStr = JSON.stringify(correctTemplate).replace(/"/g, '\\"');
    return p1 + jsonStr + '"';
  });
}

// ファイル保存
fs.writeFileSync(tsFilePath, content, "utf8");

console.log("\n✅ Q_T_001-012の完全再構築が完了しました！");
