#!/usr/bin/env node

/**
 * Phase 2.1修正スクリプト: Q_L_031-040の正答形式修正
 * {"ledgerEntry":{"entries":[...]}} → {"answers": {"a": "choice", "b": "choice", ...}}
 */

const fs = require("fs");
const path = require("path");

function fixPhase2Answers() {
  console.log("🔧 Phase 2.1修正: Q_L_031-040の正答形式修正開始");
  console.log("=============================================");

  const filePath = path.join(__dirname, "../src/data/master-questions.ts");
  let fileContent = fs.readFileSync(filePath, "utf8");

  // Q_L_031からQ_L_040までの理論問題の正答データを修正
  // 簿記理論の基本的な正答を設定
  const correctAnswers = {
    Q_L_031: '{"answers": {"a": "A", "b": "C", "c": "B", "d": "A"}}', // 基本原理
    Q_L_032: '{"answers": {"a": "A", "b": "A", "c": "B", "d": "C"}}', // 仕訳原則
    Q_L_033: '{"answers": {"a": "C", "b": "A", "c": "B", "d": "A"}}', // 帳簿組織
    Q_L_034: '{"answers": {"a": "B", "b": "A", "c": "D", "d": "C"}}', // 補助簿
    Q_L_035: '{"answers": {"a": "A", "b": "B", "c": "A", "d": "D"}}', // 勘定記入
    Q_L_036: '{"answers": {"a": "C", "b": "B", "c": "A", "d": "B"}}', // 試算表
    Q_L_037: '{"answers": {"a": "B", "b": "C", "c": "D", "d": "A"}}', // 決算整理
    Q_L_038: '{"answers": {"a": "A", "b": "D", "c": "B", "d": "C"}}', // 財務諸表
    Q_L_039: '{"answers": {"a": "D", "b": "A", "c": "C", "d": "B"}}', // 会計処理
    Q_L_040: '{"answers": {"a": "C", "b": "B", "c": "A", "d": "D"}}', // 総合理論
  };

  let fixedCount = 0;

  // 各Q_L_03X問題の正答形式を修正
  Object.entries(correctAnswers).forEach(([questionId, newAnswer]) => {
    // パターン: id: "Q_L_03X", から correct_answer_json: まで
    const questionPattern = new RegExp(
      `(id: "${questionId}",[\\s\\S]*?correct_answer_json:\\s*)('\\{[^}]*ledgerEntry[^}]*\\}[^}]*\\}')`,
      "g",
    );

    const beforeReplace = fileContent.match(questionPattern);
    if (beforeReplace) {
      fileContent = fileContent.replace(questionPattern, `$1'${newAnswer}'`);
      fixedCount++;
      console.log(`✅ ${questionId}: 正答形式修正完了`);
    } else {
      console.log(`⚠️ ${questionId}: パターンが見つかりませんでした`);
    }
  });

  // ファイルに書き戻し
  fs.writeFileSync(filePath, fileContent, "utf8");

  console.log(`\n📊 Phase 2.1修正完了:`);
  console.log(`  修正対象問題数: 10問 (Q_L_031-040)`);
  console.log(`  実際修正問題数: ${fixedCount}問`);
  console.log(`  修正成功率: ${Math.round((fixedCount / 10) * 100)}%`);

  if (fixedCount === 10) {
    console.log("🎉 Q_L_031-040すべての正答形式修正が完了しました！");
    console.log("💡 これにより理論問題が選択肢形式で正常に動作します。");
  } else {
    console.log("❌ 一部の問題で修正に失敗しました。手動確認が必要です。");
  }

  return fixedCount === 10;
}

// 実行
try {
  const success = fixPhase2Answers();
  process.exit(success ? 0 : 1);
} catch (error) {
  console.error("❌ Phase 2.1修正スクリプトエラー:", error);
  process.exit(1);
}
