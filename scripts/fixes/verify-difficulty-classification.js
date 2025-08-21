/**
 * 難易度分類ロジック検証スクリプト
 * アプリ内表示とデータファイルの整合性を確認
 */

const fs = require("fs");
const path = require("path");

function verifyDifficultyClassification() {
  try {
    console.log("=== 難易度分類ロジック検証 ===");
    console.log("実行時刻:", new Date().toLocaleString("ja-JP"));
    console.log("");

    // master-questions.tsの読み込み
    const questionsFilePath = path.join(
      __dirname,
      "../../src/data/master-questions.ts",
    );
    const content = fs.readFileSync(questionsFilePath, "utf8");

    // masterQuestions配列を抽出
    const match = content.match(
      /export const masterQuestions.*?=.*?\[([^]*?)\];/,
    );
    if (!match) {
      throw new Error("masterQuestions配列が見つかりません");
    }

    const questions = [];
    const questionRegex =
      /\{[^]*?id:\s*"(Q_[JLT]_\d+)"[^]*?category_id:\s*"([^"]+)"[^]*?difficulty:\s*(\d)[^]*?\}/g;

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

    console.log("=== データファイル分析 ===");
    console.log(`全問題数: ${questions.length}問`);
    console.log(`仕訳問題: ${journalQuestions.length}問`);
    console.log("");

    // 詳細な難易度分布
    const diffCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    journalQuestions.forEach((q) => {
      diffCount[q.difficulty]++;
    });

    console.log("=== 5段階難易度分布（データファイル） ===");
    for (let i = 1; i <= 5; i++) {
      console.log(`難易度${i}: ${diffCount[i]}問`);
    }
    console.log("");

    // アプリ内分類ロジック（推定）の確認
    console.log("=== アプリ内分類ロジック推定 ===");

    // パターン1: 1=基礎, 2=標準, 3+=応用
    const pattern1Basic = diffCount[1];
    const pattern1Standard = diffCount[2];
    const pattern1Advanced = diffCount[3] + diffCount[4] + diffCount[5];

    console.log("パターン1 (1=基礎, 2=標準, 3+=応用):");
    console.log(`  基礎: ${pattern1Basic}問`);
    console.log(`  標準: ${pattern1Standard}問`);
    console.log(`  応用: ${pattern1Advanced}問`);
    console.log(
      `  合計: ${pattern1Basic + pattern1Standard + pattern1Advanced}問`,
    );
    console.log("");

    // パターン2: 1-2=基礎, 3=標準, 4-5=応用
    const pattern2Basic = diffCount[1] + diffCount[2];
    const pattern2Standard = diffCount[3];
    const pattern2Advanced = diffCount[4] + diffCount[5];

    console.log("パターン2 (1-2=基礎, 3=標準, 4-5=応用):");
    console.log(`  基礎: ${pattern2Basic}問`);
    console.log(`  標準: ${pattern2Standard}問`);
    console.log(`  応用: ${pattern2Advanced}問`);
    console.log(
      `  合計: ${pattern2Basic + pattern2Standard + pattern2Advanced}問`,
    );
    console.log("");

    // パターン3: 1-3=基礎, 4=標準, 5=応用
    const pattern3Basic = diffCount[1] + diffCount[2] + diffCount[3];
    const pattern3Standard = diffCount[4];
    const pattern3Advanced = diffCount[5];

    console.log("パターン3 (1-3=基礎, 4=標準, 5=応用):");
    console.log(`  基礎: ${pattern3Basic}問`);
    console.log(`  標準: ${pattern3Standard}問`);
    console.log(`  応用: ${pattern3Advanced}問`);
    console.log(
      `  合計: ${pattern3Basic + pattern3Standard + pattern3Advanced}問`,
    );
    console.log("");

    // シミュレーター表示との比較
    console.log("=== シミュレーター表示との比較 ===");
    console.log(
      "シミュレーター表示: 基礎39問, 標準45問, 応用120問 (合計204問)",
    );
    console.log("");

    if (
      pattern1Basic === 39 &&
      pattern1Standard === 45 &&
      pattern1Advanced === 120
    ) {
      console.log("✅ パターン1がシミュレーター表示と一致");
    } else if (
      pattern2Basic === 39 &&
      pattern2Standard === 45 &&
      pattern2Advanced === 120
    ) {
      console.log("✅ パターン2がシミュレーター表示と一致");
    } else if (
      pattern3Basic === 39 &&
      pattern3Standard === 45 &&
      pattern3Advanced === 120
    ) {
      console.log("✅ パターン3がシミュレーター表示と一致");
    } else {
      console.log("❌ どのパターンもシミュレーター表示と一致しません");

      // 最も近いパターンを特定
      const patterns = [
        {
          name: "パターン1",
          basic: pattern1Basic,
          standard: pattern1Standard,
          advanced: pattern1Advanced,
        },
        {
          name: "パターン2",
          basic: pattern2Basic,
          standard: pattern2Standard,
          advanced: pattern2Advanced,
        },
        {
          name: "パターン3",
          basic: pattern3Basic,
          standard: pattern3Standard,
          advanced: pattern3Advanced,
        },
      ];

      patterns.forEach((p) => {
        const basicDiff = Math.abs(p.basic - 39);
        const standardDiff = Math.abs(p.standard - 45);
        const advancedDiff = Math.abs(p.advanced - 120);
        const totalDiff = basicDiff + standardDiff + advancedDiff;
        console.log(
          `${p.name} 差異合計: ${totalDiff} (基礎${basicDiff}, 標準${standardDiff}, 応用${advancedDiff})`,
        );
      });
    }

    console.log("");
    console.log("=== 問題分析 ===");
    const simTotal = 39 + 45 + 120; // 204
    const actualTotal = journalQuestions.length; // 250
    const missing = actualTotal - simTotal;

    console.log(`データファイル仕訳問題数: ${actualTotal}問`);
    console.log(`シミュレーター表示合計: ${simTotal}問`);
    console.log(`不足問題数: ${missing}問`);

    if (missing > 0) {
      console.log("");
      console.log(
        "⚠️ シミュレーター表示で一部の問題が除外されている可能性があります",
      );
      console.log("考えられる原因:");
      console.log("1. アプリの難易度分類ロジックが異なる");
      console.log("2. データベース更新が正しく反映されていない");
      console.log("3. 特定の難易度の問題が表示対象外になっている");
    }

    return {
      dataFileTotal: actualTotal,
      simulatorTotal: simTotal,
      missing: missing,
      diffCount: diffCount,
      patterns: {
        pattern1: {
          basic: pattern1Basic,
          standard: pattern1Standard,
          advanced: pattern1Advanced,
        },
        pattern2: {
          basic: pattern2Basic,
          standard: pattern2Standard,
          advanced: pattern2Advanced,
        },
        pattern3: {
          basic: pattern3Basic,
          standard: pattern3Standard,
          advanced: pattern3Advanced,
        },
      },
    };
  } catch (error) {
    console.error("エラー:", error.message);
    return null;
  }
}

// スクリプトとして直接実行される場合
if (require.main === module) {
  verifyDifficultyClassification();
}

module.exports = { verifyDifficultyClassification };
