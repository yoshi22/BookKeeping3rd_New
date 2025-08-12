#!/usr/bin/env node

/**
 * 第三問のmalformed JSONを修正
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

console.log("🔧 第三問のmalformed JSONを修正中...\n");

let content = fs.readFileSync(tsFilePath, "utf8");

// Q_T_001-012のmalformed JSONを修正
for (let i = 1; i <= 12; i++) {
  const id = `Q_T_${String(i).padStart(3, "0")}`;

  // 正しいテンプレートタイプを決定
  let correctTemplateEnd;
  if (i >= 1 && i <= 4) {
    correctTemplateEnd = `,\"allowMultipleEntries\":true,\"maxEntries\":30}`;
  } else if (i >= 5 && i <= 8) {
    correctTemplateEnd = `,\"totals\":true,\"allowMultipleEntries\":true,\"maxEntries\":40}`;
  } else {
    correctTemplateEnd = `,\"showTotals\":true,\"balanceType\":\"total\",\"allowMultipleEntries\":true,\"maxEntries\":35}`;
  }

  // パターン: 正しいテンプレート}"{余分なテンプレート}
  const malformedPattern = new RegExp(
    `("id":\\s*"${id}"[^}]*?"answer_template_json":\\s*"[^"]*?)(${correctTemplateEnd.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})"type\\\\":.*?\\}"`,
    "g",
  );

  content = content.replace(malformedPattern, (match, p1, p2) => {
    console.log(`✅ ${id} のmalformed JSONを修正`);
    return p1 + p2 + '"';
  });
}

// 正解データのmalformed JSONも修正
for (let i = 1; i <= 12; i++) {
  const id = `Q_T_${String(i).padStart(3, "0")}`;

  // パターン: 正しい正解データ}"{余分なデータ}
  const malformedAnswerPattern = new RegExp(
    `("id":\\s*"${id}"[^}]*?"correct_answer_json":\\s*"[^"]*?)(\\})"\\{.*?\\}"`,
    "g",
  );

  content = content.replace(malformedAnswerPattern, (match, p1, p2) => {
    console.log(`✅ ${id} の正解データmalformed JSONを修正`);
    return p1 + p2 + '"';
  });
}

// ファイル保存
fs.writeFileSync(tsFilePath, content, "utf8");

console.log("\n✅ 第三問のmalformed JSON修正が完了しました！");
