#!/usr/bin/env node

/**
 * Phase 2.1修正検証: Q_L_031-040の正答形式修正結果確認
 * multiple_choice問題の正答データが正しく修正されているか確認
 */

const fs = require("fs");
const path = require("path");

function validatePhase21() {
  console.log("🔍 Phase 2.1修正検証: Q_L_031-040正答形式修正結果テスト");
  console.log("================================================");

  const filePath = path.join(__dirname, "../src/data/master-questions.ts");
  const fileContent = fs.readFileSync(filePath, "utf8");

  // Q_L_031からQ_L_040までの問題をチェック
  let correctCount = 0;
  let incorrectCount = 0;
  const problems = [];

  for (let i = 31; i <= 40; i++) {
    const questionId = `Q_L_${i.toString().padStart(3, "0")}`;

    // 問題のパターンを検索
    const questionPattern = new RegExp(
      `id: "${questionId}",[\\s\\S]*?correct_answer_json:\\s*'([^']+)'`,
      "g",
    );

    const match = questionPattern.exec(fileContent);
    if (match) {
      const answerJson = match[1];

      // 正しい形式（multiple choice）かチェック
      if (
        answerJson.includes('"answers"') &&
        answerJson.includes('"a"') &&
        !answerJson.includes("ledgerEntry")
      ) {
        correctCount++;
        console.log(`✅ ${questionId}: 正しい選択肢形式`);
      } else if (answerJson.includes("ledgerEntry")) {
        incorrectCount++;
        console.log(`❌ ${questionId}: 古いledgerEntry形式が残っています`);
        problems.push(questionId);
      } else {
        incorrectCount++;
        console.log(
          `❌ ${questionId}: 不明な形式: ${answerJson.substring(0, 50)}...`,
        );
        problems.push(questionId);
      }
    } else {
      incorrectCount++;
      console.log(`❌ ${questionId}: 問題が見つかりませんでした`);
      problems.push(questionId);
    }
  }

  console.log(`\n📊 Phase 2.1修正結果:`);
  console.log(`  修正対象問題数: 10問 (Q_L_031-040)`);
  console.log(`  正しく修正済み: ${correctCount}問`);
  console.log(`  修正未完了: ${incorrectCount}問`);
  console.log(`  修正成功率: ${Math.round((correctCount / 10) * 100)}%`);

  const isPhase21Success = correctCount === 10 && incorrectCount === 0;

  console.log(
    `\n🎯 Phase 2.1修正結果: ${isPhase21Success ? "✅ 成功" : "❌ 失敗"}`,
  );

  if (isPhase21Success) {
    console.log("🎉 Phase 2.1修正が正常に完了しました！");
    console.log(
      "💡 これによりQ_L_031-040の理論問題が選択肢形式で正常に動作します。",
    );
    console.log("🚀 次はPhase 2.2（給与・税金分野会計処理修正）に進めます。");
  } else {
    console.log("❌ Phase 2.1修正で問題が発見されました。");
    if (problems.length > 0) {
      console.log("未修正の問題:", problems.join(", "));
    }
  }

  return isPhase21Success;
}

// 実行
try {
  const success = validatePhase21();
  process.exit(success ? 0 : 1);
} catch (error) {
  console.error("❌ Phase 2.1検証スクリプトエラー:", error);
  process.exit(1);
}
