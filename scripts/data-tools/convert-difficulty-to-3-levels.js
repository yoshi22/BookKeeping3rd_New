#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * 難易度を5分類から3分類に変更するスクリプト
 * problemsStrategy.md準拠: 基礎(1)・標準(2)・応用(3)
 */

const fs = require("fs");
const path = require("path");

console.log("🔄 難易度5分類→3分類変換開始\n");

try {
  const generatedQuestionsPath = path.join(
    __dirname,
    "src/data/generated-questions.ts",
  );

  if (!fs.existsSync(generatedQuestionsPath)) {
    console.error("❌ generated-questions.ts ファイルが見つかりません");
    process.exit(1);
  }

  let content = fs.readFileSync(generatedQuestionsPath, "utf8");

  console.log("📊 現在の難易度分布を分析中...");

  // 現在の難易度分布を確認
  const difficultyMatches = content.match(/"difficulty": (\d+)/g) || [];
  const currentDistribution = {};
  difficultyMatches.forEach((match) => {
    const level = match.match(/(\d+)/)[1];
    currentDistribution[level] = (currentDistribution[level] || 0) + 1;
  });

  console.log("現在の難易度分布:");
  Object.entries(currentDistribution)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .forEach(([level, count]) => {
      console.log(`  難易度${level}: ${count}問`);
    });

  const totalQuestions = Object.values(currentDistribution).reduce(
    (a, b) => a + b,
    0,
  );
  console.log(`  合計: ${totalQuestions}問\n`);

  // 変換ロジック: problemsStrategy.md準拠の3分類
  // 基礎(1): 難易度1+2の一部 → 40%程度
  // 標準(2): 難易度2の残り+3+4の一部 → 40%程度
  // 応用(3): 難易度4の残り+5 → 20%程度

  console.log("🔄 難易度変換中...");

  // 段階的に変換
  // ステップ1: 難易度5→3 (最上級 → 応用)
  content = content.replace(/"difficulty": 5/g, '"difficulty": 3');
  console.log("  ✅ 難易度5 → 3 変換完了");

  // ステップ2: 難易度4→3 (上級 → 応用) - 約半分
  let difficulty4Count = 0;
  const difficulty4Target = Math.floor((currentDistribution[4] || 0) * 0.7); // 70%を応用に
  content = content.replace(/"difficulty": 4/g, (match) => {
    difficulty4Count++;
    if (difficulty4Count <= difficulty4Target) {
      return '"difficulty": 3';
    } else {
      return '"difficulty": 2'; // 残り30%は標準に
    }
  });
  console.log("  ✅ 難易度4 → 2/3 変換完了");

  // ステップ3: 難易度3→2 (応用 → 標準) - 約80%
  let difficulty3Count = 0;
  const difficulty3Target = Math.floor((currentDistribution[3] || 0) * 0.8); // 80%を標準に
  content = content.replace(/"difficulty": 3/g, (match) => {
    difficulty3Count++;
    if (difficulty3Count <= difficulty3Target) {
      return '"difficulty": 2';
    } else {
      return '"difficulty": 3'; // 残り20%は応用のまま
    }
  });
  console.log("  ✅ 難易度3 → 2/3 変換完了");

  // ステップ4: 難易度2→1 (標準 → 基礎) - 約30%
  let difficulty2Count = 0;
  const difficulty2Target = Math.floor((currentDistribution[2] || 0) * 0.3); // 30%を基礎に
  content = content.replace(/"difficulty": 2/g, (match) => {
    difficulty2Count++;
    if (difficulty2Count <= difficulty2Target) {
      return '"difficulty": 1';
    } else {
      return '"difficulty": 2'; // 残り70%は標準のまま
    }
  });
  console.log("  ✅ 難易度2 → 1/2 変換完了");

  // 変換後の分布を確認
  console.log("\n📊 変換後の難易度分布:");
  const newDifficultyMatches = content.match(/"difficulty": (\d+)/g) || [];
  const newDistribution = {};
  newDifficultyMatches.forEach((match) => {
    const level = match.match(/(\d+)/)[1];
    newDistribution[level] = (newDistribution[level] || 0) + 1;
  });

  Object.entries(newDistribution)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .forEach(([level, count]) => {
      const percentage = ((count / totalQuestions) * 100).toFixed(1);
      const levelName =
        level === "1"
          ? "基礎"
          : level === "2"
            ? "標準"
            : level === "3"
              ? "応用"
              : "その他";
      console.log(
        `  難易度${level}(${levelName}): ${count}問 (${percentage}%)`,
      );
    });

  // ファイル書き込み
  fs.writeFileSync(generatedQuestionsPath, content);
  console.log("\n✅ generated-questions.ts 更新完了");

  console.log("\n🎉 難易度3分類変換完了!");
  console.log("📋 変換結果:");
  console.log("  ✅ 基礎レベル (1): 基本的な問題・基礎レベル");
  console.log("  ✅ 標準レベル (2): 標準的な問題・中級レベル");
  console.log("  ✅ 応用レベル (3): 応用問題・上級レベル");
} catch (error) {
  console.error("❌ エラー:", error.message);
  process.exit(1);
}
