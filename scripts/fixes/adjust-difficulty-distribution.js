/**
 * 難易度分布調整スクリプト
 * 仕訳問題の難易度を理想的な配分（30%:50%:20%）に調整
 */

const fs = require("fs");
const path = require("path");

function adjustDifficultyDistribution() {
  try {
    console.log("=== 仕訳問題難易度調整開始 ===");
    console.log("実行時刻:", new Date().toLocaleString("ja-JP"));
    console.log("");

    // バックアップの作成
    const questionsFilePath = path.join(
      __dirname,
      "../../src/data/master-questions.ts",
    );
    const backupPath = `${questionsFilePath}.backup-${Date.now()}`;

    console.log("バックアップを作成中...");
    fs.copyFileSync(questionsFilePath, backupPath);
    console.log(`バックアップ作成完了: ${backupPath}`);
    console.log("");

    // 現在のファイルを読み込み
    const content = fs.readFileSync(questionsFilePath, "utf8");

    // masterQuestions配列を抽出
    const match = content.match(
      /export const masterQuestions.*?=.*?\[([\s\S]*?)\];/,
    );
    if (!match) {
      throw new Error("masterQuestions配列が見つかりません");
    }

    const questionsText = match[1];

    // 各問題オブジェクトを解析
    const questionMatches = [
      ...questionsText.matchAll(/(\{[\s\S]*?\n  \}),?/g),
    ];

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

    // 調整計画に基づく変更
    const changes = [];

    // 難易度2の問題を取得（変更対象）
    const difficulty2Questions = journalQuestions.filter(
      (q) => q.difficulty === 2,
    );
    const difficulty3Questions = journalQuestions.filter(
      (q) => q.difficulty === 3,
    );
    const difficulty4Questions = journalQuestions.filter(
      (q) => q.difficulty === 4,
    );

    console.log("=== 調整実行 ===");

    // 1. 難易度2 → 難易度3 (30問)
    const toLevel3 = difficulty2Questions.slice(0, 30);
    toLevel3.forEach((q) => {
      changes.push({
        id: q.id,
        from: 2,
        to: 3,
        index: q.index,
      });
    });
    console.log(`難易度2→3: ${toLevel3.length}問`);

    // 2. 難易度2 → 難易度4 (35問)
    const toLevel4FromLevel2 = difficulty2Questions.slice(30, 65);
    toLevel4FromLevel2.forEach((q) => {
      changes.push({
        id: q.id,
        from: 2,
        to: 4,
        index: q.index,
      });
    });
    console.log(`難易度2→4: ${toLevel4FromLevel2.length}問`);

    // 3. 難易度3 → 難易度4 (15問)
    const toLevel4FromLevel3 = difficulty3Questions.slice(0, 15);
    toLevel4FromLevel3.forEach((q) => {
      changes.push({
        id: q.id,
        from: 3,
        to: 4,
        index: q.index,
      });
    });
    console.log(`難易度3→4: ${toLevel4FromLevel3.length}問`);

    // 4. 難易度4 → 難易度5 (2問)
    const toLevel5 = difficulty4Questions.slice(0, 2);
    toLevel5.forEach((q) => {
      changes.push({
        id: q.id,
        from: 4,
        to: 5,
        index: q.index,
      });
    });
    console.log(`難易度4→5: ${toLevel5.length}問`);

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
    const idealBasic = Math.round(journalQuestions.length * 0.3);
    const idealStandard = Math.round(journalQuestions.length * 0.5);
    const idealAdvanced = Math.round(journalQuestions.length * 0.2);

    console.log("=== 理想との差異 ===");
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

    console.log("=== 調整完了 ===");
    console.log("次の手順:");
    console.log(
      "1. src/data/migrations/index.ts の SAMPLE_DATA_VERSION を更新",
    );
    console.log("2. forceUpdate を一時的に true に設定");
    console.log("3. アプリで動作確認");
    console.log("4. forceUpdate を false に戻す");
    console.log("");
    console.log(`バックアップファイル: ${backupPath}`);

    return {
      changes: changes.length,
      backupPath,
      newDistribution: newDist,
      threeLevelDistribution: {
        basic: newBasic,
        standard: newStandard,
        advanced: newAdvanced,
      },
    };
  } catch (error) {
    console.error("エラー:", error.message);
    return null;
  }
}

// スクリプトとして直接実行される場合
if (require.main === module) {
  adjustDifficultyDistribution();
}

module.exports = { adjustDifficultyDistribution };
