#!/usr/bin/env node

/**
 * Q3問題の並び替えスクリプト
 *
 * 現在の順序: Q3_TB_001 → Q3_CTB_001 → Q3_FS_001 → Q3_TB_002 → ...
 * 目標の順序: Q3_TB_001～020 → Q3_CTB_001～015 → Q3_FS_001～015
 */

const fs = require("fs");
const path = require("path");

const MASTER_QUESTIONS_PATH = path.join(
  __dirname,
  "../../src/data/master-questions.ts",
);

function main() {
  console.log("Q3問題の並び替えを開始します...\n");

  // ファイルを読み込む
  const content = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf8");
  const lines = content.split("\n");

  console.log(`ファイル読み込み完了: ${lines.length}行\n`);

  // Q3問題の開始・終了行を検出
  const q3Questions = [];
  let currentQuestion = null;
  let inQuestion = false;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Q3問題のID行を検出
    if (
      !inQuestion &&
      (line.includes('id: "Q3_TB_') ||
        line.includes('id: "Q3_CTB_') ||
        line.includes('id: "Q3_FS_'))
    ) {
      const match = line.match(/id: "(Q3_[A-Z]+_\d+)"/);
      if (match) {
        // 前の行が `{` かどうか確認
        let startLine = i - 1;
        while (startLine >= 0 && !lines[startLine].trim()) {
          startLine--;
        }
        if (lines[startLine].trim() === "{") {
          currentQuestion = {
            id: match[1],
            startLine: startLine,
            lines: [],
          };
          inQuestion = true;
          braceDepth = 0;
          // `{` の行から追加開始
          i = startLine;
          continue;
        }
      }
    }

    if (inQuestion) {
      currentQuestion.lines.push(line);

      // ブレースのカウント
      for (const char of line) {
        if (char === "{") braceDepth++;
        if (char === "}") braceDepth--;
      }

      // 問題オブジェクトの終了を検出: `},` または配列の最後の `}`
      if (braceDepth === 0 && (line.trim() === "}," || line.trim() === "}")) {
        currentQuestion.endLine = i;
        q3Questions.push(currentQuestion);
        inQuestion = false;
        currentQuestion = null;
      }
    }
  }

  console.log(`Q3問題を${q3Questions.length}問検出しました:\n`);

  // カテゴリ別に分類
  const tbQuestions = q3Questions.filter((q) => q.id.startsWith("Q3_TB_"));
  const ctbQuestions = q3Questions.filter((q) => q.id.startsWith("Q3_CTB_"));
  const fsQuestions = q3Questions.filter((q) => q.id.startsWith("Q3_FS_"));

  console.log(`- Q3_TB (試算表穴埋め): ${tbQuestions.length}問`);
  console.log(`- Q3_CTB (合計試算表): ${ctbQuestions.length}問`);
  console.log(`- Q3_FS (財務諸表): ${fsQuestions.length}問\n`);

  // 各カテゴリ内でIDでソート
  tbQuestions.sort((a, b) => a.id.localeCompare(b.id));
  ctbQuestions.sort((a, b) => a.id.localeCompare(b.id));
  fsQuestions.sort((a, b) => a.id.localeCompare(b.id));

  // TB → CTB → FS の順に結合
  const reorderedQuestions = [...tbQuestions, ...ctbQuestions, ...fsQuestions];

  console.log("並び替え後の順序:");
  console.log(
    `1-20: ${reorderedQuestions
      .slice(0, 20)
      .map((q) => q.id)
      .join(", ")}`,
  );
  console.log(
    `21-35: ${reorderedQuestions
      .slice(20, 35)
      .map((q) => q.id)
      .join(", ")}`,
  );
  console.log(
    `36-50: ${reorderedQuestions
      .slice(35, 50)
      .map((q) => q.id)
      .join(", ")}\n`,
  );

  // 元のファイルでの最初と最後のQ3問題の位置を特定
  const firstQ3Line = q3Questions[0].startLine;
  const lastQ3Line = q3Questions[q3Questions.length - 1].endLine;

  console.log(
    `元のファイルでのQ3問題範囲: ${firstQ3Line}行 ～ ${lastQ3Line}行\n`,
  );

  // 新しいコンテンツを構築
  const beforeQ3 = lines.slice(0, firstQ3Line);
  const afterQ3 = lines.slice(lastQ3Line + 1);

  const reorderedLines = reorderedQuestions.flatMap((q) => q.lines);

  const newContent = [...beforeQ3, ...reorderedLines, ...afterQ3].join("\n");

  // ファイルに書き戻す
  fs.writeFileSync(MASTER_QUESTIONS_PATH, newContent, "utf8");

  console.log("✅ Q3問題の並び替えが完了しました！");
  console.log(`ファイル: ${MASTER_QUESTIONS_PATH}\n`);

  // 検証: Q3問題の数が変わっていないことを確認
  const newLines = newContent.split("\n");
  const newQ3Count = newLines.filter(
    (line) =>
      line.includes('id: "Q3_TB_') ||
      line.includes('id: "Q3_CTB_') ||
      line.includes('id: "Q3_FS_'),
  ).length;

  console.log(`検証: Q3問題数 ${q3Questions.length} → ${newQ3Count}`);

  if (newQ3Count === q3Questions.length) {
    console.log("✅ 問題数が一致しています\n");
  } else {
    console.error("❌ 警告: 問題数が変わっています！\n");
    process.exit(1);
  }
}

main();
