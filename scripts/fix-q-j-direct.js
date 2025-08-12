#!/usr/bin/env node

/**
 * Q_J_001-045のJSON二重定義を直接修正
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

console.log("🔧 Q_J_001-045のJSON二重定義を直接修正中...\n");

let content = fs.readFileSync(tsFilePath, "utf8");

// answer_template_jsonの二重定義を修正
// 誤った連結部分を削除
const wrongTemplate =
  '"type":\\"ledger_entry\\",\\"fields\\":[{\\"name\\":\\"date\\",\\"label\\":\\"日付\\",\\"type\\":\\"text\\",\\"required\\":true,\\"placeholder\\":\\"例: 10/5\\"},{\\"name\\":\\"description\\",\\"label\\":\\"摘要\\",\\"type\\":\\"text\\",\\"required\\":true,\\"placeholder\\":\\"例: 現金売上\\"},{\\"name\\":\\"debit_amount\\",\\"label\\":\\"借方金額\\",\\"type\\":\\"number\\",\\"required\\":false,\\"format\\":\\"currency\\"},{\\"name\\":\\"credit_amount\\",\\"label\\":\\"貸方金額\\",\\"type\\":\\"number\\",\\"required\\":false,\\"format\\":\\"currency\\"},{\\"name\\":\\"balance\\",\\"label\\":\\"残高\\",\\"type\\":\\"number\\",\\"required\\":true,\\"format\\":\\"currency\\"}],\\"allowMultipleEntries\\":true,\\"maxEntries\\":10}';

// 45個のQ_J問題を修正
for (let i = 1; i <= 45; i++) {
  const id = `Q_J_${String(i).padStart(3, "0")}`;

  // answer_template_jsonフィールドを探して修正
  const searchPattern = `"id": "${id}"`;
  const index = content.indexOf(searchPattern);

  if (index !== -1) {
    // この問題の終わりまでの範囲を取得
    const endIndex = content.indexOf("},", index) + 2;
    let questionSection = content.substring(index, endIndex);

    // wrongTemplateが含まれていたら削除
    if (questionSection.includes(wrongTemplate)) {
      questionSection = questionSection.replace(wrongTemplate, "");
      content =
        content.substring(0, index) +
        questionSection +
        content.substring(endIndex);
      console.log(`✅ ${id} のテンプレート二重定義を修正`);
    }
  }
}

// tags_jsonの二重定義も修正
const wrongTags =
  '"subcategory\\":\\"cash_deposit\\",\\"pattern\\":\\"現金過不足\\",\\"accounts\\":[\\"現金\\",\\"現金過不足\\"],\\"keywords\\":[\\"現金実査\\",\\"実際有高\\",\\"帳簿残高\\"],\\"examSection\\":1}';
content = content.replace(new RegExp(wrongTags, "g"), "");

// ファイル保存
fs.writeFileSync(tsFilePath, content, "utf8");

console.log("\n✅ Q_J_001-045のJSON二重定義を修正しました！");
