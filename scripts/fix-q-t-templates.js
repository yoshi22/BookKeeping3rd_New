#!/usr/bin/env node

/**
 * Q_T_001-012のテンプレートを完全に修正
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

console.log("🔧 Q_T_001-012のテンプレートを修正中...\n");

let content = fs.readFileSync(tsFilePath, "utf8");

// 各問題のテンプレートを個別に置換
for (let i = 1; i <= 12; i++) {
  const id = `Q_T_${String(i).padStart(3, "0")}`;

  // 現在の不正なテンプレートを正しいものに置換
  const questionPattern = new RegExp(
    `("id":\\s*"${id}"[\\s\\S]*?"answer_template_json":\\s*")[^"]*"`,
    "g",
  );

  let newTemplate;

  if (i >= 1 && i <= 4) {
    // 財務諸表テンプレート
    newTemplate = {
      type: "financial_statement",
      sections: [
        {
          name: "balance_sheet",
          label: "貸借対照表",
          columns: [
            { name: "account", label: "科目", type: "text", width: "30%" },
            { name: "amount", label: "金額", type: "number", width: "35%" },
            { name: "total", label: "合計", type: "number", width: "35%" },
          ],
          categories: [
            { label: "【資産の部】", type: "header" },
            { label: "流動資産", type: "subheader" },
            { label: "固定資産", type: "subheader" },
            { label: "資産合計", type: "total" },
            { label: "【負債の部】", type: "header" },
            { label: "流動負債", type: "subheader" },
            { label: "固定負債", type: "subheader" },
            { label: "負債合計", type: "total" },
            { label: "【純資産の部】", type: "header" },
            { label: "純資産合計", type: "total" },
            { label: "負債純資産合計", type: "grand_total" },
          ],
        },
        {
          name: "income_statement",
          label: "損益計算書",
          columns: [
            { name: "account", label: "科目", type: "text", width: "30%" },
            { name: "amount", label: "金額", type: "number", width: "35%" },
            { name: "total", label: "合計", type: "number", width: "35%" },
          ],
          categories: [
            { label: "【売上高】", type: "header" },
            { label: "【売上原価】", type: "header" },
            { label: "売上総利益", type: "subtotal" },
            { label: "【販売費及び一般管理費】", type: "header" },
            { label: "営業利益", type: "subtotal" },
            { label: "【営業外収益】", type: "header" },
            { label: "【営業外費用】", type: "header" },
            { label: "経常利益", type: "subtotal" },
            { label: "【特別利益】", type: "header" },
            { label: "【特別損失】", type: "header" },
            { label: "当期純利益", type: "total" },
          ],
        },
      ],
      allowMultipleEntries: true,
      maxEntries: 30,
    };
  } else if (i >= 5 && i <= 8) {
    // 精算表テンプレート
    newTemplate = {
      type: "worksheet",
      columns: [
        { name: "account", label: "勘定科目", type: "text", width: "20%" },
        {
          name: "trial_debit",
          label: "試算表借方",
          type: "number",
          width: "10%",
        },
        {
          name: "trial_credit",
          label: "試算表貸方",
          type: "number",
          width: "10%",
        },
        {
          name: "adj_debit",
          label: "修正記入借方",
          type: "number",
          width: "10%",
        },
        {
          name: "adj_credit",
          label: "修正記入貸方",
          type: "number",
          width: "10%",
        },
        {
          name: "income_debit",
          label: "損益計算書借方",
          type: "number",
          width: "10%",
        },
        {
          name: "income_credit",
          label: "損益計算書貸方",
          type: "number",
          width: "10%",
        },
        {
          name: "balance_debit",
          label: "貸借対照表借方",
          type: "number",
          width: "10%",
        },
        {
          name: "balance_credit",
          label: "貸借対照表貸方",
          type: "number",
          width: "10%",
        },
      ],
      allowMultipleEntries: true,
      maxEntries: 20,
    };
  } else {
    // 試算表テンプレート
    newTemplate = {
      type: "trial_balance",
      columns: [
        { name: "account", label: "勘定科目", type: "text", width: "25%" },
        { name: "debit", label: "借方", type: "number", width: "25%" },
        { name: "credit", label: "貸方", type: "number", width: "25%" },
        { name: "balance", label: "残高", type: "number", width: "25%" },
      ],
      allowMultipleEntries: true,
      maxEntries: 10,
    };
  }

  content = content.replace(questionPattern, (match, p1) => {
    console.log(`✅ ${id} のテンプレートを修正`);
    return p1 + JSON.stringify(newTemplate).replace(/"/g, '\\"') + '"';
  });
}

// ファイル保存
fs.writeFileSync(tsFilePath, content, "utf8");

console.log("\n✅ Q_T_001-012のテンプレート修正完了！");
