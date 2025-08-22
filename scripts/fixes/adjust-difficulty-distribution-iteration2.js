/**
/* eslint-disable */
 * 難易度分布調整スクリプト - 反復2回目
 * 仕訳問題の難易度を理想的な配分（30%:50%:20%）により近づける
 */

const fs = require("fs");
const path = require("path");

function adjustDifficultyDistributionIteration2() {
  try {
    console.log("=== 仕訳問題難易度調整開始（反復2回目） ===");
    console.log("実行時刻:", new Date().toLocaleString("ja-JP"));
    console.log("");

    // バックアップの作成
    const questionsFilePath = path.join(
      __dirname,
      "../../src/data/master-questions.ts",
    );
    const backupPath = `${questionsFilePath}.backup-iteration2-${Date.now()}`;

    console.log("バックアップを作成中...");
    fs.copyFileSync(questionsFilePath, backupPath);
    console.log(`バックアップ作成完了: ${backupPath}`);
    console.log("");

    // 現在のファイルを読み込み
    const content = fs.readFileSync(questionsFilePath, "utf8");

    // masterQuestions配列を抽出
    const match = content.match(
      /export const masterQuestions.*?=.*?\[([^]*?)\];/,
    );
    if (!match) {
      throw new Error("masterQuestions配列が見つかりません");
    }

    const questionsText = match[1];

    // 各問題オブジェクトを解析
    const questionMatches = [...questionsText.matchAll(/(\{[^]*?\n  \}),?/g)];

    console.log(`${questionMatches.length}個の問題を検出`);

    // 仕訳問題の難易度を分析・収集
    const journalQuestions = [];

    questionMatches.forEach((match, index) => {
      const questionText = match[1];
      const idMatch = questionText.match(/id:\s*"(Q_[JLT]_\d+)"/);
      const difficultyMatch = questionText.match(/difficulty:\s*(\d)/);
      const categoryMatch = questionText.match(/category_id:\s*"([^"]+)"/);

      if (idMatch && difficultyMatch && categoryMatch) {
        const id = idMatch[1];
        const difficulty = parseInt(difficultyMatch[1]);
        const category = categoryMatch[1];

        if (id.startsWith("Q_J_")) {
          journalQuestions.push({
            index,
            id,
            difficulty,
            category,
            originalText: questionText,
          });
        }
      }
    });

    console.log(`仕訳問題: ${journalQuestions.length}問`);

    // 現在の分布を確認
    const currentDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    journalQuestions.forEach((q) => currentDist[q.difficulty]++);

    console.log("=== 調整前の分布 ===");
    for (let i = 1; i <= 5; i++) {
      console.log(`難易度${i}: ${currentDist[i]}問`);
    }
    console.log("");

    // 3段階分類での現状確認
    const currentBasic = currentDist[1] + currentDist[2];
    const currentStandard = currentDist[3];
    const currentAdvanced = currentDist[4] + currentDist[5];

    console.log("=== 現在の3段階分類 ===");
    console.log(
      `基礎（1-2）: ${currentBasic}問 (${((currentBasic / journalQuestions.length) * 100).toFixed(1)}%)`,
    );
    console.log(
      `標準（3）: ${currentStandard}問 (${((currentStandard / journalQuestions.length) * 100).toFixed(1)}%)`,
    );
    console.log(
      `応用（4-5）: ${currentAdvanced}問 (${((currentAdvanced / journalQuestions.length) * 100).toFixed(1)}%)`,
    );
    console.log("");

    // 理想的な配分
    const idealBasic = 75;
    const idealStandard = 125;
    const idealAdvanced = 50;

    // 差異
    const basicDiff = currentBasic - idealBasic; // +29
    const standardDiff = currentStandard - idealStandard; // -34
    const advancedDiff = currentAdvanced - idealAdvanced; // +5

    console.log("=== 差異確認 ===");
    console.log(`基礎: ${basicDiff > 0 ? "+" : ""}${basicDiff}問`);
    console.log(`標準: ${standardDiff > 0 ? "+" : ""}${standardDiff}問`);
    console.log(`応用: ${advancedDiff > 0 ? "+" : ""}${advancedDiff}問`);
    console.log("");

    // 第2回調整計画: 基礎から標準への移動を重点的に
    const changes = [];

    // 難易度1の問題を取得
    const difficulty1Questions = journalQuestions.filter(
      (q) => q.difficulty === 1,
    );
    const difficulty2Questions = journalQuestions.filter(
      (q) => q.difficulty === 2,
    );
    const difficulty4Questions = journalQuestions.filter(
      (q) => q.difficulty === 4,
    );

    console.log("=== 第2回調整実行 ===");

    // 1. 難易度1 → 難易度2 (15問) : 基礎レベル内で調整
    const level1to2 = difficulty1Questions.slice(0, 15);
    level1to2.forEach((q) => {
      changes.push({
        id: q.id,
        from: 1,
        to: 2,
        index: q.index,
      });
    });
    console.log(`難易度1→2: ${level1to2.length}問`);

    // 2. 難易度2 → 難易度3 (20問) : 基礎→標準
    const level2to3 = difficulty2Questions.slice(0, 20);
    level2to3.forEach((q) => {
      changes.push({
        id: q.id,
        from: 2,
        to: 3,
        index: q.index,
      });
    });
    console.log(`難易度2→3: ${level2to3.length}問`);

    // 3. 難易度4 → 難易度3 (9問) : 応用→標準
    const level4to3 = difficulty4Questions.slice(0, 9);
    level4to3.forEach((q) => {
      changes.push({
        id: q.id,
        from: 4,
        to: 3,
        index: q.index,
      });
    });
    console.log(`難易度4→3: ${level4to3.length}問`);

    console.log(`総変更数: ${changes.length}問`);
    console.log("");

    // ファイル内容を変更
    let modifiedContent = content;

    // 変更を適用（後ろから適用して位置ずれを防ぐ）
    changes.sort((a, b) => b.index - a.index);

    changes.forEach((change) => {
      const questionMatch = questionMatches[change.index];
      const originalText = questionMatch[1];
      const modifiedText = originalText.replace(
        /difficulty:\s*\d/,
        `difficulty: ${change.to}`,
      );

      modifiedContent = modifiedContent.replace(originalText, modifiedText);
    });

    // ファイルに書き戻し
    fs.writeFileSync(questionsFilePath, modifiedContent, "utf8");
    console.log("ファイル更新完了");
    console.log("");

    // 調整後の分布を確認
    const newDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    Object.assign(newDist, currentDist);

    changes.forEach((change) => {
      newDist[change.from]--;
      newDist[change.to]++;
    });

    console.log("=== 調整後の予想分布 ===");
    for (let i = 1; i <= 5; i++) {
      const percentage = ((newDist[i] / journalQuestions.length) * 100).toFixed(
        1,
      );
      console.log(`難易度${i}: ${newDist[i]}問 (${percentage}%)`);
    }
    console.log("");

    // 3段階分類での結果
    const newBasic = newDist[1] + newDist[2];
    const newStandard = newDist[3];
    const newAdvanced = newDist[4] + newDist[5];

    console.log("=== 調整後の3段階分類 ===");
    console.log(
      `基礎（1-2）: ${newBasic}問 (${((newBasic / journalQuestions.length) * 100).toFixed(1)}%)`,
    );
    console.log(
      `標準（3）: ${newStandard}問 (${((newStandard / journalQuestions.length) * 100).toFixed(1)}%)`,
    );
    console.log(
      `応用（4-5）: ${newAdvanced}問 (${((newAdvanced / journalQuestions.length) * 100).toFixed(1)}%)`,
    );
    console.log("");

    // 理想との比較
    console.log("=== 理想との差異（調整後） ===");
    console.log(
      `基礎: ${newBasic - idealBasic > 0 ? "+" : ""}${newBasic - idealBasic}問`,
    );
    console.log(
      `標準: ${newStandard - idealStandard > 0 ? "+" : ""}${newStandard - idealStandard}問`,
    );
    console.log(
      `応用: ${newAdvanced - idealAdvanced > 0 ? "+" : ""}${newAdvanced - idealAdvanced}問`,
    );
    console.log("");

    console.log("=== 第2回調整完了 ===");
    console.log(`バックアップファイル: ${backupPath}`);

    return {
      iteration: 2,
      changes: changes.length,
      backupPath,
      newDistribution: newDist,
      threeLevelDistribution: {
        basic: newBasic,
        standard: newStandard,
        advanced: newAdvanced,
      },
      differences: {
        basic: newBasic - idealBasic,
        standard: newStandard - idealStandard,
        advanced: newAdvanced - idealAdvanced,
      },
    };
  } catch (error) {
    console.error("エラー:", error.message);
    return null;
  }
}

// スクリプトとして直接実行される場合
if (require.main === module) {
  adjustDifficultyDistributionIteration2();
}

module.exports = { adjustDifficultyDistributionIteration2 };
