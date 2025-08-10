#!/usr/bin/env node

/**
 * 排他的分類ロジックのテスト
 */

const fs = require("fs");
const path = require("path");

console.log("🧪 排他的分類ロジックテスト開始\n");

// 新しい排他的分類ロジック（app/category/[categoryId].tsxから移植）
function getQuestionTypeFromQuestion(question, categoryId) {
  try {
    const tagsJson = question.tags_json;
    if (!tagsJson) return ["other"];

    const tags = JSON.parse(tagsJson);
    if (!Array.isArray(tags) || tags.length === 0) return ["other"];

    if (categoryId === "journal") {
      // 優先順位付き排他的分類（より具体的なタグを優先）

      // 1. 決算整理（最優先）
      if (
        tags.some(
          (tag) =>
            tag.includes("決算整理") ||
            tag.includes("貸倒引当金") ||
            tag.includes("見積計上") ||
            tag.includes("前払費用") ||
            tag.includes("経過勘定") ||
            tag.includes("未払費用") ||
            tag.includes("前受収益") ||
            tag.includes("消耗品"),
        )
      ) {
        return ["adjustment"];
      }

      // 2. 固定資産
      if (
        tags.some(
          (tag) =>
            tag.includes("減価償却") ||
            tag.includes("定額法") ||
            tag.includes("固定資産"),
        )
      ) {
        return ["fixed_asset"];
      }

      // 3. 給与・税金
      if (
        tags.some(
          (tag) =>
            tag.includes("租税公課") ||
            tag.includes("給与") ||
            tag.includes("税金") ||
            tag.includes("源泉"),
        )
      ) {
        return ["salary_tax"];
      }

      // 4. 債権・債務
      if (
        tags.some(
          (tag) =>
            tag.includes("手形取引") ||
            tag.includes("受取手形") ||
            tag.includes("支払手形") ||
            tag.includes("売掛金") ||
            tag.includes("買掛金") ||
            tag.includes("債権回収") ||
            tag.includes("債務支払") ||
            tag.includes("借入取引") ||
            tag.includes("貸付取引"),
        )
      ) {
        return ["receivable_payable"];
      }

      // 5. 現金・預金取引（具体的な現金・預金関連のみ）
      if (
        tags.some(
          (tag) =>
            tag === "現金取引" ||
            tag === "現金・預金" ||
            tag.includes("預け入れ") ||
            tag.includes("引き出し") ||
            tag.includes("現金過不足") ||
            tag === "預金取引",
        )
      ) {
        return ["cash_deposit"];
      }

      // 6. 商品売買取引（残りの「基本仕訳」「商品売買」「掛取引」）
      if (
        tags.some(
          (tag) =>
            tag.includes("商品売買") ||
            tag.includes("掛取引") ||
            tag === "基本仕訳",
        )
      ) {
        return ["sales_purchase"];
      }
    }

    return ["other"];
  } catch (e) {
    return ["other"];
  }
}

// 生成された問題データから分類テスト
try {
  const generatedQuestionsPath = path.join(
    __dirname,
    "src/data/generated-questions.ts",
  );
  const content = fs.readFileSync(generatedQuestionsPath, "utf8");

  // 第一問の問題を抽出
  console.log("📝 第一問（仕訳）の排他的分類テスト:");
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

    const question = {
      id,
      tags_json: JSON.stringify(tagsRaw),
    };

    const classification = getQuestionTypeFromQuestion(question, "journal");
    journalQuestions.push({
      id,
      tags: tagsRaw,
      classification: classification[0],
    });
  }

  // 分類結果の統計
  const classificationStats = {};
  journalQuestions.forEach((q) => {
    if (!classificationStats[q.classification]) {
      classificationStats[q.classification] = [];
    }
    classificationStats[q.classification].push(q.id);
  });

  console.log(`  総問題数: ${journalQuestions.length}問\n`);
  console.log("  排他的分類結果:");

  const categoryNames = {
    cash_deposit: "現金・預金取引",
    sales_purchase: "商品売買取引",
    receivable_payable: "債権・債務",
    salary_tax: "給与・税金",
    fixed_asset: "固定資産",
    adjustment: "決算整理",
    other: "その他",
  };

  const targetCounts = {
    cash_deposit: 42,
    sales_purchase: 45,
    receivable_payable: 41,
    salary_tax: 42,
    fixed_asset: 40,
    adjustment: 40,
  };

  Object.entries(classificationStats)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([type, questions]) => {
      const categoryName = categoryNames[type] || type;
      const target = targetCounts[type]
        ? ` (目標: ${targetCounts[type]}問)`
        : "";
      console.log(`    ${categoryName}: ${questions.length}問${target}`);
    });

  // 詳細な分類例を表示
  console.log("\n  分類例（各カテゴリー最初の3問）:");
  Object.entries(classificationStats).forEach(([type, questions]) => {
    const categoryName = categoryNames[type] || type;
    console.log(`    ${categoryName}:`);
    questions.slice(0, 3).forEach((questionId) => {
      const question = journalQuestions.find((q) => q.id === questionId);
      console.log(
        `      ${questionId}: [${question.tags.slice(0, 3).join(", ")}]`,
      );
    });
  });

  console.log("\n✅ 排他的分類テスト完了");
  console.log("\n📱 problemsStrategy.md との整合性:");
  console.log("  理想的な問題数:");
  Object.entries(targetCounts).forEach(([type, target]) => {
    const actual = classificationStats[type]?.length || 0;
    const categoryName = categoryNames[type];
    const status = actual === target ? "✅" : "❌";
    console.log(`    ${status} ${categoryName}: ${actual}問 / ${target}問`);
  });
} catch (error) {
  console.error("❌ テスト実行エラー:", error.message);
}
