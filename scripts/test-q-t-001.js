#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const tsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

const content = fs.readFileSync(tsFilePath, "utf8");

// Q_T_001だけを探す
const match = content.match(
  /"id":\s*"Q_T_001"[\s\S]*?"answer_template_json":\s*"([^"]*)"[\s\S]*?"correct_answer_json":\s*"([^"]*)"/,
);

if (match) {
  console.log("✅ Q_T_001を見つけました");

  const templateStr = match[1];
  const answerStr = match[2];

  console.log("\n【テンプレート文字列の長さ】", templateStr.length);
  console.log("【最初の100文字】", templateStr.substring(0, 100));
  console.log(
    "【最後の100文字】",
    templateStr.substring(templateStr.length - 100),
  );

  // JSONとしてパース試行
  try {
    const template = JSON.parse(templateStr.replace(/\\"/g, '"'));
    console.log("\n✅ テンプレートのパース成功");
    console.log("テンプレートタイプ:", template.type);
  } catch (e) {
    console.log("\n❌ テンプレートのパースエラー:", e.message);

    // エスケープを外してみる
    const unescaped = templateStr.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    console.log(
      "\n【エスケープ解除後の最初の100文字】",
      unescaped.substring(0, 100),
    );
    console.log(
      "【エスケープ解除後の最後の100文字】",
      unescaped.substring(unescaped.length - 100),
    );

    try {
      const template2 = JSON.parse(unescaped);
      console.log("\n✅ エスケープ解除後のパース成功");
      console.log("テンプレートタイプ:", template2.type);
    } catch (e2) {
      console.log("\n❌ エスケープ解除後もパースエラー:", e2.message);
    }
  }
} else {
  console.log("❌ Q_T_001が見つかりません");
}
