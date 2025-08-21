/**
 * 難易度分布分析スクリプト
 * 仕訳問題の現状分析と理想的な配分との比較
 */

const fs = require("fs");
const path = require("path");

function analyzeDifficultyDistribution() {
  try {
    console.log("=== 仕訳問題難易度分布分析 ===");
    console.log("実行時刻:", new Date().toLocaleString("ja-JP"));
    console.log("");

    // master-questions.tsの読み込み
    const questionsFilePath = path.join(
      __dirname,
      "../../src/data/master-questions.ts",
    );
    const content = fs.readFileSync(questionsFilePath, "utf8");

    // masterQuestionsの抽出
    const match = content.match(
      /export const masterQuestions.*?=.*?\[([\s\S]*?)\];/,
    );
    if (!match) {
      throw new Error("masterQuestions配列が見つかりません");
    }

    const questions = [];
    const questionRegex =
      /\{[\s\S]*?id:\s*"(Q_[JLT]_\d+)"[\s\S]*?category_id:\s*"([^"]+)"[\s\S]*?difficulty:\s*(\d)[\s\S]*?\}/g;

    let m;
    while ((m = questionRegex.exec(match[0]))) {
      questions.push({
        id: m[1],
        category: m[2],
        difficulty: parseInt(m[3]),
      });
    }

    // 仕訳問題の抽出
    const journalQuestions = questions.filter((q) => q.id.startsWith("Q_J_"));

    console.log("=== 問題数の確認 ===");
    console.log(`全問題数: ${questions.length}問`);
    console.log(`仕訳問題: ${journalQuestions.length}問`);
    console.log(
      `帳簿問題: ${questions.filter((q) => q.id.startsWith("Q_L_")).length}問`,
    );
    console.log(
      `試算表問題: ${questions.filter((q) => q.id.startsWith("Q_T_")).length}問`,
    );
    console.log("");

    // 仕訳問題の難易度分布
    const diffCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    journalQuestions.forEach((q) => {
      diffCount[q.difficulty]++;
    });

    console.log("=== 現状の難易度分布 ===");
    for (let i = 1; i <= 5; i++) {
      const percentage = (
        (diffCount[i] / journalQuestions.length) *
        100
      ).toFixed(1);
      console.log(`難易度${i}: ${diffCount[i]}問 (${percentage}%)`);
    }
    console.log("");

    // 3段階分類での現状
    const currentBasic = diffCount[1] + diffCount[2];
    const currentStandard = diffCount[3];
    const currentAdvanced = diffCount[4] + diffCount[5];

    console.log("=== 3段階分類（現状） ===");
    console.log(
      `基礎（難易度1-2）: ${currentBasic}問 (${((currentBasic / journalQuestions.length) * 100).toFixed(1)}%)`,
    );
    console.log(
      `標準（難易度3）: ${currentStandard}問 (${((currentStandard / journalQuestions.length) * 100).toFixed(1)}%)`,
    );
    console.log(
      `応用（難易度4-5）: ${currentAdvanced}問 (${((currentAdvanced / journalQuestions.length) * 100).toFixed(1)}%)`,
    );
    console.log("");

    // 理想的な配分
    const totalQuestions = journalQuestions.length;
    const idealBasic = Math.round(totalQuestions * 0.3);
    const idealStandard = Math.round(totalQuestions * 0.5);
    const idealAdvanced = Math.round(totalQuestions * 0.2);

    console.log("=== 理想的な配分（30%:50%:20%） ===");
    console.log(`基礎: ${idealBasic}問 (30%)`);
    console.log(`標準: ${idealStandard}問 (50%)`);
    console.log(`応用: ${idealAdvanced}問 (20%)`);
    console.log("");

    // 差異分析
    const basicDiff = currentBasic - idealBasic;
    const standardDiff = currentStandard - idealStandard;
    const advancedDiff = currentAdvanced - idealAdvanced;

    console.log("=== 差異分析 ===");
    console.log(
      `基礎: ${basicDiff > 0 ? "+" : ""}${basicDiff}問 (${basicDiff > 0 ? "過多" : "不足"})`,
    );
    console.log(
      `標準: ${standardDiff > 0 ? "+" : ""}${standardDiff}問 (${standardDiff > 0 ? "過多" : "不足"})`,
    );
    console.log(
      `応用: ${advancedDiff > 0 ? "+" : ""}${advancedDiff}問 (${advancedDiff > 0 ? "過多" : "不足"})`,
    );
    console.log("");

    // 調整の必要性
    const tolerance = 5; // ±5問の許容範囲
    const needsAdjustment =
      Math.abs(basicDiff) > tolerance ||
      Math.abs(standardDiff) > tolerance ||
      Math.abs(advancedDiff) > tolerance;

    console.log("=== 調整の必要性 ===");
    console.log(`調整が必要: ${needsAdjustment ? "はい" : "いいえ"}`);

    if (needsAdjustment) {
      console.log("推奨される調整:");
      if (Math.abs(basicDiff) > tolerance) {
        console.log(
          `- 基礎レベル: ${Math.abs(basicDiff)}問を${basicDiff > 0 ? "減らす" : "増やす"}`,
        );
      }
      if (Math.abs(standardDiff) > tolerance) {
        console.log(
          `- 標準レベル: ${Math.abs(standardDiff)}問を${standardDiff > 0 ? "減らす" : "増やす"}`,
        );
      }
      if (Math.abs(advancedDiff) > tolerance) {
        console.log(
          `- 応用レベル: ${Math.abs(advancedDiff)}問を${advancedDiff > 0 ? "減らす" : "増やす"}`,
        );
      }
    }
    console.log("");

    // 結果を返す
    return {
      total: totalQuestions,
      current: {
        basic: currentBasic,
        standard: currentStandard,
        advanced: currentAdvanced,
      },
      ideal: {
        basic: idealBasic,
        standard: idealStandard,
        advanced: idealAdvanced,
      },
      diff: {
        basic: basicDiff,
        standard: standardDiff,
        advanced: advancedDiff,
      },
      needsAdjustment,
      diffCount,
    };
  } catch (error) {
    console.error("エラー:", error.message);
    return null;
  }
}

// スクリプトとして直接実行される場合
if (require.main === module) {
  analyzeDifficultyDistribution();
}

module.exports = { analyzeDifficultyDistribution };
