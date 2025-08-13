#!/usr/bin/env node

/**
 * Phase 2.2修正検証: 給与・税金分野会計処理修正結果確認
 * 複合仕訳と現金支払処理が正しく実装されているか検証
 */

const fs = require("fs");
const path = require("path");

function validatePhase22() {
  console.log("🔍 Phase 2.2修正検証: 給与・税金分野会計処理修正結果テスト");
  console.log("================================================");

  const filePath = path.join(__dirname, "../src/data/master-questions.ts");
  const fileContent = fs.readFileSync(filePath, "utf8");

  // 検証対象問題
  const salaryQuestions = ["Q_J_153", "Q_J_157", "Q_J_161", "Q_J_165"];
  const insuranceQuestions = ["Q_J_154", "Q_J_158", "Q_J_162", "Q_J_166"];

  let correctSalaryCount = 0;
  let correctInsuranceCount = 0;
  const problems = [];

  console.log("📊 給料支払問題（複合仕訳）検証:");

  // 給料支払問題の検証
  salaryQuestions.forEach((questionId) => {
    const questionPattern = new RegExp(
      `id: "${questionId}",[\\s\\S]*?correct_answer_json:\\s*'([^']+)'`,
      "g",
    );

    const match = questionPattern.exec(fileContent);
    if (match) {
      const answerJson = match[1];

      // 複合仕訳の検証：entries配列、給料・現金・預り金の存在チェック
      if (
        answerJson.includes('"entries"') &&
        answerJson.includes("給料") &&
        answerJson.includes("現金") &&
        answerJson.includes("預り金")
      ) {
        correctSalaryCount++;
        console.log(`  ✅ ${questionId}: 複合仕訳（給料・現金・預り金）確認`);
      } else {
        console.log(`  ❌ ${questionId}: 複合仕訳形式が不正`);
        problems.push(questionId);
      }
    } else {
      console.log(`  ❌ ${questionId}: 問題が見つかりませんでした`);
      problems.push(questionId);
    }
  });

  console.log("\\n📊 社会保険料問題（現金支払）検証:");

  // 社会保険料問題の検証
  insuranceQuestions.forEach((questionId) => {
    const questionPattern = new RegExp(
      `id: "${questionId}",[\\s\\S]*?correct_answer_json:\\s*'([^']+)'`,
      "g",
    );

    const match = questionPattern.exec(fileContent);
    if (match) {
      const answerJson = match[1];

      // 現金支払の検証：entries配列、法定福利費・現金・預り金の存在チェック
      if (
        answerJson.includes('"entries"') &&
        answerJson.includes("法定福利費") &&
        answerJson.includes("現金") &&
        answerJson.includes("預り金")
      ) {
        correctInsuranceCount++;
        console.log(
          `  ✅ ${questionId}: 現金支払複合仕訳（法定福利費・現金・預り金）確認`,
        );
      } else {
        console.log(`  ❌ ${questionId}: 現金支払形式が不正`);
        problems.push(questionId);
      }
    } else {
      console.log(`  ❌ ${questionId}: 問題が見つかりませんでした`);
      problems.push(questionId);
    }
  });

  console.log(`\\n📊 Phase 2.2修正結果:`);
  console.log(`  給料支払問題（複合仕訳）: ${correctSalaryCount}/4問 修正済み`);
  console.log(
    `  社会保険料問題（現金支払）: ${correctInsuranceCount}/4問 修正済み`,
  );
  console.log(
    `  総合修正成功率: ${Math.round(((correctSalaryCount + correctInsuranceCount) / 8) * 100)}%`,
  );

  const isPhase22Success =
    correctSalaryCount === 4 && correctInsuranceCount === 4;

  console.log(
    `\\n🎯 Phase 2.2修正結果: ${isPhase22Success ? "✅ 成功" : "❌ 失敗"}`,
  );

  if (isPhase22Success) {
    console.log("🎉 Phase 2.2修正が正常に完了しました！");
    console.log("💡 これにより以下の会計処理が正常に動作します:");
    console.log("   - 給料支払時の源泉所得税控除（複合仕訳）");
    console.log("   - 社会保険料の現金支払処理（複合仕訳）");
    console.log("🚀 アプリでの動作確認を推奨します。");
  } else {
    console.log("❌ Phase 2.2修正で問題が発見されました。");
    if (problems.length > 0) {
      console.log("未修正の問題:", problems.join(", "));
    }
  }

  return isPhase22Success;
}

// 実行
try {
  const success = validatePhase22();
  process.exit(success ? 0 : 1);
} catch (error) {
  console.error("❌ Phase 2.2検証スクリプトエラー:", error);
  process.exit(1);
}
