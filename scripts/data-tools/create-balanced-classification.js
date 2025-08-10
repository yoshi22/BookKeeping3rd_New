#!/usr/bin/env node

/**
 * problemsStrategy.mdに合わせた強制バランス調整分類ロジック
 */

const fs = require("fs");
const path = require("path");

console.log("⚖️ バランス調整分類ロジック生成開始\n");

// 目標分布（problemsStrategy.md準拠）
const targetDistribution = {
  cash_deposit: 42, // 現金・預金取引
  sales_purchase: 45, // 商品売買取引
  receivable_payable: 41, // 債権・債務
  salary_tax: 42, // 給与・税金
  fixed_asset: 40, // 固定資産
  adjustment: 40, // 決算整理
};

// 生成された問題データから全問題を抽出
try {
  const generatedQuestionsPath = path.join(
    __dirname,
    "src/data/generated-questions.ts",
  );
  const content = fs.readFileSync(generatedQuestionsPath, "utf8");

  // 第一問の問題を抽出
  const journalQuestions = [];
  const journalPattern =
    /"id": "(Q_J_\d+)"[\s\S]*?"tags_json": "\[([^\]]+)\]"/g;
  let journalMatch;

  while ((journalMatch = journalPattern.exec(content)) !== null) {
    const id = journalMatch[1];
    const tagsRaw = journalMatch[2]
      .replace(/\\"/g, '"')
      .replace(/"/g, "")
      .split(",")
      .map((t) => t.trim());

    journalQuestions.push({
      id,
      tags: tagsRaw,
    });
  }

  console.log(`📝 第一問総問題数: ${journalQuestions.length}問`);

  // 各カテゴリの候補問題を優先度付きで選別
  const categoryScores = {};

  journalQuestions.forEach((question) => {
    const { id, tags } = question;
    const scores = {};

    // 各カテゴリーに対する適合度スコアを計算
    scores.adjustment = calculateScore(
      tags,
      [
        "決算整理",
        "貸倒引当金",
        "見積計上",
        "前払費用",
        "経過勘定",
        "未払費用",
        "前受収益",
        "消耗品",
      ],
      10,
    );

    scores.fixed_asset = calculateScore(
      tags,
      ["減価償却", "定額法", "固定資産"],
      10,
    );

    scores.salary_tax = calculateScore(
      tags,
      ["租税公課", "給与", "税金", "源泉"],
      10,
    );

    scores.receivable_payable = calculateScore(
      tags,
      [
        "手形取引",
        "受取手形",
        "支払手形",
        "売掛金",
        "買掛金",
        "債権回収",
        "債務支払",
        "借入取引",
        "貸付取引",
      ],
      8,
    );

    scores.cash_deposit = calculateScore(
      tags,
      [
        "現金取引",
        "現金・預金",
        "預け入れ",
        "引き出し",
        "現金過不足",
        "預金取引",
      ],
      6,
    );

    scores.sales_purchase = calculateScore(
      tags,
      ["商品売買", "掛取引", "基本仕訳"],
      4,
    );

    categoryScores[id] = scores;
  });

  // バランス調整アルゴリズム
  const finalAssignments = {};
  const assignedQuestions = new Set();

  // 各カテゴリーに順番に問題を割り当て
  const categories = Object.keys(targetDistribution);

  // 複数回パスで割り当て
  for (let pass = 0; pass < 5; pass++) {
    console.log(`\nパス ${pass + 1}: カテゴリー別問題割り当て`);

    for (const category of categories) {
      const needed =
        targetDistribution[category] -
        (finalAssignments[category]?.length || 0);
      if (needed <= 0) continue;

      // このカテゴリに適合する未割り当て問題を取得
      const candidates = journalQuestions
        .filter((q) => !assignedQuestions.has(q.id))
        .map((q) => ({
          ...q,
          score: categoryScores[q.id][category] || 0,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, needed);

      if (!finalAssignments[category]) finalAssignments[category] = [];

      candidates.forEach((candidate) => {
        finalAssignments[category].push(candidate.id);
        assignedQuestions.add(candidate.id);
      });

      console.log(
        `  ${category}: ${candidates.length}問追加 (合計: ${finalAssignments[category].length}問)`,
      );
    }
  }

  // 結果の確認
  console.log("\n📊 バランス調整結果:");
  const categoryNames = {
    cash_deposit: "現金・預金取引",
    sales_purchase: "商品売買取引",
    receivable_payable: "債権・債務",
    salary_tax: "給与・税金",
    fixed_asset: "固定資産",
    adjustment: "決算整理",
  };

  Object.entries(finalAssignments).forEach(([category, questionIds]) => {
    const target = targetDistribution[category];
    const actual = questionIds.length;
    const status = actual === target ? "✅" : "❌";
    console.log(
      `  ${status} ${categoryNames[category]}: ${actual}問 / ${target}問`,
    );
  });

  // 新しい分類関数を生成
  const balancedClassificationCode =
    generateBalancedClassificationFunction(finalAssignments);

  console.log("\n✅ バランス調整ロジック生成完了");
  console.log(
    "新しい分類関数をapp/category/[categoryId].tsxに適用してください",
  );

  // ファイル出力
  fs.writeFileSync(
    path.join(__dirname, "balanced-classification-logic.ts"),
    balancedClassificationCode,
  );
  console.log(
    "📄 balanced-classification-logic.ts に新しいロジックを出力しました",
  );
} catch (error) {
  console.error("❌ エラー:", error.message);
}

// スコア計算関数
function calculateScore(tags, keywords, baseScore = 5) {
  let score = 0;
  keywords.forEach((keyword) => {
    const exactMatch = tags.some((tag) => tag === keyword);
    const partialMatch = tags.some((tag) => tag.includes(keyword));

    if (exactMatch) score += baseScore;
    else if (partialMatch) score += baseScore * 0.7;
  });
  return score;
}

// バランス調整分類関数生成
function generateBalancedClassificationFunction(assignments) {
  let code = `// problemsStrategy.md準拠のバランス調整分類関数\n`;
  code += `const getBalancedQuestionType = (question: Question): string[] => {\n`;
  code += `  const questionId = question.id;\n\n`;

  Object.entries(assignments).forEach(([category, questionIds]) => {
    code += `  // ${category} (${questionIds.length}問)\n`;
    code += `  if ([${questionIds.map((id) => `"${id}"`).join(", ")}].includes(questionId)) {\n`;
    code += `    return ["${category}"];\n`;
    code += `  }\n\n`;
  });

  code += `  return ["other"];\n`;
  code += `};\n`;

  return code;
}
