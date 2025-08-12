#!/usr/bin/env node

/**
 * 真にカスタマイズされた解説を生成するスクリプト
 * 分析結果に基づき、各問題の取引内容に特化した解説を作成
 */

const fs = require("fs");
const path = require("path");

// TypeScriptファイルを読み込む
const tsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
const content = fs.readFileSync(tsFilePath, "utf8");

// 分析結果を読み込む
const analysisPath = path.join(
  __dirname,
  "..",
  "temp",
  "transaction-analysis.json",
);
const analysisData = JSON.parse(fs.readFileSync(analysisPath, "utf8"));

console.log("🎯 真にカスタマイズされた解説を生成中...\n");

// データを抽出
const startPattern = /export const masterQuestions[^=]*=\s*\[/;
const startMatch = content.match(startPattern);
const startIndex = startMatch.index + startMatch[0].length - 1;

let depth = 0;
let endIndex = -1;
let inString = false;
let escapeNext = false;

for (let i = startIndex; i < content.length; i++) {
  const char = content[i];

  if (escapeNext) {
    escapeNext = false;
    continue;
  }

  if (char === "\\") {
    escapeNext = true;
    continue;
  }

  if (char === '"' && !inString) {
    inString = true;
  } else if (char === '"' && inString) {
    inString = false;
  }

  if (!inString) {
    if (char === "[" || char === "{") {
      depth++;
    } else if (char === "]" || char === "}") {
      depth--;
      if (depth === 0 && char === "]") {
        endIndex = i + 1;
        break;
      }
    }
  }
}

const dataString = content.substring(startIndex, endIndex);
const questions = eval(dataString);

// 分析データをマップとして構築
const analysisMap = new Map();
analysisData.forEach((item) => {
  analysisMap.set(item.id, item);
});

// カスタマイズレベル別の解説生成ルール

// 中程度カスタマイズ可能問題の解説生成
function generateMediumCustomizedExplanation(question, analysis) {
  const transactionTypes = analysis.transactionType || [];
  const businessContext = analysis.businessContext || [];
  const accounts = analysis.specificAccounts || [];
  const questionText = question.question_text;

  let explanation = "";
  let pointsSection = "💡 重要ポイント：\n";
  let tipsSection = "";

  // 取引タイプ別の詳細解説
  if (transactionTypes.includes("給与支払")) {
    if (businessContext.includes("月次処理")) {
      explanation = "前月分給料の未払い分を当月支払う処理です。";
      pointsSection +=
        "• 未払給料（負債）を減少させ、現金（資産）を減少させる\n";
      pointsSection += "• 給料費用は前月に既に計上済みのため、費用計上は不要\n";
      tipsSection =
        "🎯 理解のコツ：\n月次決算で計上した未払給料を実際に支払う際の処理。未払金の解消なので費用ではなく負債の減少として処理します。";
    } else {
      explanation = "従業員への給料支払い処理です。";
      pointsSection += "• 総支給額を「給料」（費用）で計上\n";
      pointsSection += "• 源泉所得税等の天引き分は「預り金」（負債）で処理\n";
      tipsSection =
        "🎯 理解のコツ：\n給料の総額を費用計上し、天引き分は預り金として後日納付します。";
    }
  } else if (transactionTypes.includes("減価償却")) {
    const hasContext = businessContext.includes("決算処理");
    explanation = `固定資産の減価償却${hasContext ? "（決算処理）" : ""}です。`;
    pointsSection += "• 借方「減価償却費」、貸方「減価償却累計額」（間接法）\n";

    // 問題文から具体的な数値を抽出して説明に活用
    if (questionText.includes("定額法")) {
      pointsSection +=
        "• 定額法：（取得原価－残存価額）÷耐用年数で年間償却額を計算\n";
    }
    if (questionText.includes("残存価額")) {
      pointsSection += "• 残存価額は取得原価の一定割合（通常10%）\n";
    }

    tipsSection =
      "🎯 理解のコツ：\n減価償却累計額は資産のマイナス勘定。貸借対照表では固定資産から控除して表示されます。";
  } else if (transactionTypes.includes("現金過不足処理")) {
    explanation = "現金の実際有高と帳簿残高の差額処理です。";
    pointsSection += "• 現金不足：借方「現金過不足」、貸方「現金」\n";
    pointsSection += "• 現金過剰：借方「現金」、貸方「現金過不足」\n";
    pointsSection += "• 原因判明時は該当勘定科目に振替\n";
    tipsSection =
      "🎯 理解のコツ：\n現金過不足は一時的な勘定科目。決算時に原因不明な場合は雑損・雑益に振替えます。";
  } else if (transactionTypes.includes("小切手処理")) {
    const isOverdraft = questionText.includes("当座借越");
    explanation = `小切手による取引${isOverdraft ? "（当座借越含む）" : ""}です。`;
    pointsSection += "• 小切手振出：貸方「当座預金」（資産の減少）\n";
    if (isOverdraft) {
      pointsSection += "• 当座借越：「当座預金」がマイナス残高（負債的性質）\n";
    }
    pointsSection += "• 他店振出小切手受取：借方「現金」\n";
    tipsSection =
      "🎯 理解のコツ：\n" +
      (isOverdraft
        ? "当座借越は銀行からの短期借入。当座預金口座の残高がマイナスになっても、限度額内なら取引継続可能です。"
        : "小切手は通貨代用証券。他店振出小切手は現金同等物として処理します。");
  } else if (transactionTypes.includes("手形処理")) {
    explanation = "約束手形による取引です。";
    pointsSection += "• 手形受取：借方「受取手形」（将来の現金受取権利）\n";
    pointsSection += "• 手形振出：貸方「支払手形」（将来の現金支払義務）\n";
    tipsSection =
      "🎯 理解のコツ：\n手形は満期日のある信用取引。小切手と違い、満期日まで現金化できません。";
  } else if (transactionTypes.includes("商品売買")) {
    const hasReturn = transactionTypes.includes("返品処理");
    const hasDiscount = transactionTypes.includes("値引処理");
    explanation = `商品売買の三分法による処理${hasReturn || hasDiscount ? "（返品・値引含む）" : ""}です。`;
    pointsSection += "• 仕入：借方「仕入」、貸方「買掛金」または「現金」\n";
    pointsSection += "• 売上：借方「売掛金」または「現金」、貸方「売上」\n";
    if (hasReturn) pointsSection += "• 返品：元の仕訳と逆の処理\n";
    if (hasDiscount) pointsSection += "• 値引：元の仕訳と逆の処理\n";
    tipsSection =
      "🎯 理解のコツ：\n三分法では「仕入」「売上」「繰越商品」の3勘定を使用。返品・値引は元取引の取り消し処理です。";
  }

  // 取引タイプが複数ある場合の追加説明
  if (transactionTypes.length > 1) {
    explanation += ` この問題は${transactionTypes.join("と")}が組み合わされた複合取引です。`;
  }

  return explanation + "\n\n" + pointsSection + "\n" + tipsSection;
}

// 低度カスタマイズ可能問題の解説生成（簡潔版）
function generateLowCustomizedExplanation(question, analysis) {
  const transactionTypes = analysis.transactionType || ["一般仕訳"];
  const primaryType = transactionTypes[0];

  const simpleExplanations = {
    現金過不足処理:
      "現金実査の結果を「現金過不足」勘定で処理。原因判明時は該当科目に振替。",
    小切手処理: "小切手振出は当座預金の減少、他店振出小切手受取は現金の増加。",
    手形処理: "受取手形は資産、支払手形は負債。満期日まで現金化不可。",
    商品売買: "三分法により「仕入」「売上」で処理。期末に売上原価を計算。",
    返品処理: "元の売買取引と逆の仕訳で処理（取引の取り消し）。",
    値引処理: "元の売買取引と逆の仕訳で処理（金額の減額修正）。",
    給与支払: "給料費用の計上と源泉税等の預り金処理に注意。",
    家賃処理: "期間に応じた費用配分。前払・未払の経過勘定処理が重要。",
    保険料処理: "期間に応じた費用配分。前払・未払の経過勘定処理が重要。",
    減価償却: "固定資産の価値減少を費用化。間接法では減価償却累計額を使用。",
    貸倒処理: "引当金の設定・取崩しまたは直接の貸倒損失処理。",
    前払費用: "当期に支払い、翌期以降にサービスを受ける費用の処理。",
    未払費用: "当期にサービスを受け、翌期に支払う費用の処理。",
  };

  return (
    simpleExplanations[primaryType] ||
    `${primaryType}の基本的な仕訳処理。借方・貸方のルールに従い正確に処理してください。`
  );
}

// カスタマイズ不要問題の解説生成（最小限）
function generateMinimalExplanation(question, analysis) {
  // 汎用的な解説は削除し、最小限の説明のみ
  return "基本的な仕訳処理です。借方・貸方の金額を一致させて記入してください。";
}

// 第二問（帳簿問題）の解説
function generateLedgerExplanation(question, analysis) {
  const questionText = question.question_text;

  if (questionText.includes("総勘定元帳")) {
    return "総勘定元帳への転記処理。仕訳帳から勘定科目別に転記し、相手科目を摘要に記入。";
  } else if (questionText.includes("現金出納帳")) {
    return "現金出納帳への記入。収入は借方、支出は貸方。残高は累計で計算。";
  } else if (questionText.includes("仕入帳")) {
    return "仕入帳への記入。仕入先別に記録し、返品・値引は△表示。";
  } else if (questionText.includes("売上帳")) {
    return "売上帳への記入。得意先別に記録し、返品・値引は△表示。";
  } else if (questionText.includes("商品有高帳")) {
    return "商品有高帳への記入。先入先出法または移動平均法で払出単価を計算。";
  }

  return "帳簿記入の基本ルールに従い、正確に転記・記入してください。";
}

// 第三問（表作成問題）の解説
function generateStatementExplanation(question, analysis) {
  const questionText = question.question_text;

  if (questionText.includes("試算表")) {
    if (questionText.includes("合計")) {
      return "合計試算表の作成。各勘定の借方合計・貸方合計を集計。貸借合計額が一致することを確認。";
    } else if (questionText.includes("残高")) {
      return "残高試算表の作成。各勘定の残高を計算し、借方・貸方に分類。貸借合計額が一致することを確認。";
    }
    return "試算表の作成。借方・貸方の合計が一致することで仕訳の正確性を検証。";
  } else if (questionText.includes("精算表")) {
    return "精算表の作成。決算整理仕訳を修正記入欄に記入し、損益計算書・貸借対照表の各欄に振り分け。";
  } else if (questionText.includes("損益計算書")) {
    return "損益計算書の作成。収益・費用を段階利益別に整理し、当期純利益を算出。";
  } else if (questionText.includes("貸借対照表")) {
    return "貸借対照表の作成。資産・負債・純資産を流動・固定に分類し、貸借合計額を一致。";
  }

  return "表作成の基本原則に従い、貸借の一致を確認しながら作成してください。";
}

// メインの解説生成関数
function generateCustomizedExplanation(question, analysis) {
  const questionId = question.id;

  // 第二問（帳簿問題）
  if (questionId.startsWith("Q_L_")) {
    return generateLedgerExplanation(question, analysis);
  }

  // 第三問（表作成問題）
  if (questionId.startsWith("Q_T_")) {
    return generateStatementExplanation(question, analysis);
  }

  // 第一問（仕訳問題）のカスタマイズレベル別処理
  if (!analysis || !analysis.canCustomize) {
    return generateMinimalExplanation(question, analysis);
  }

  switch (analysis.customizationLevel) {
    case "medium":
      return generateMediumCustomizedExplanation(question, analysis);
    case "low":
      return generateLowCustomizedExplanation(question, analysis);
    case "none":
      return generateMinimalExplanation(question, analysis);
    default:
      return generateMinimalExplanation(question, analysis);
  }
}

// 各問題の解説を更新
let updatedCount = 0;
let categoryStats = {
  medium: 0,
  low: 0,
  minimal: 0,
  ledger: 0,
  statement: 0,
};

questions.forEach((question) => {
  const analysis = analysisMap.get(question.id);
  const newExplanation = generateCustomizedExplanation(question, analysis);

  if (newExplanation !== question.explanation) {
    question.explanation = newExplanation;
    updatedCount++;

    // 統計更新
    if (question.id.startsWith("Q_L_")) {
      categoryStats.ledger++;
    } else if (question.id.startsWith("Q_T_")) {
      categoryStats.statement++;
    } else if (analysis && analysis.customizationLevel === "medium") {
      categoryStats.medium++;
    } else if (analysis && analysis.customizationLevel === "low") {
      categoryStats.low++;
    } else {
      categoryStats.minimal++;
    }
  }
});

// TypeScriptファイルを再構築
const beforeData = content.substring(0, startIndex);
const afterData = content.substring(endIndex);

// 元のフォーマットに戻す
const formattedQuestions = questions
  .map((q) => {
    // explanationフィールドのエスケープ処理
    const escapedExplanation = q.explanation
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n");

    return `  {
    id: "${q.id}",
    category_id: "${q.category_id}",
    difficulty: ${q.difficulty},
    question_text: "${q.question_text.replace(/"/g, '\\"').replace(/\n/g, "\\n")}",
    answer_template_json: "${q.answer_template_json.replace(/"/g, '\\"')}",
    correct_answer_json: "${q.correct_answer_json.replace(/"/g, '\\"')}",
    explanation: "${escapedExplanation}",
    tags_json: "${q.tags_json.replace(/"/g, '\\"')}",
    created_at: "${q.created_at}",
    updated_at: "${q.updated_at}"
  }`;
  })
  .join(",\n");

const newContent = beforeData + "[\n" + formattedQuestions + "\n]" + afterData;
fs.writeFileSync(tsFilePath, newContent, "utf8");

console.log(`✅ ${updatedCount}個の問題の解説を真にカスタマイズしました！\n`);

console.log("📊 カスタマイズ統計:");
console.log(`🔸 中程度カスタマイズ (第1問): ${categoryStats.medium}問`);
console.log(`🔹 低度カスタマイズ (第1問): ${categoryStats.low}問`);
console.log(`⚪ 最小限解説 (第1問): ${categoryStats.minimal}問`);
console.log(`📖 帳簿問題解説 (第2問): ${categoryStats.ledger}問`);
console.log(`📊 表作成解説 (第3問): ${categoryStats.statement}問`);

// 改善例の表示
console.log("\n🎯 カスタマイズ改善例:\n");

const examples = {
  medium: questions
    .filter((q, i) => {
      const analysis = analysisMap.get(q.id);
      return analysis && analysis.customizationLevel === "medium";
    })
    .slice(0, 2),

  low: questions
    .filter((q, i) => {
      const analysis = analysisMap.get(q.id);
      return analysis && analysis.customizationLevel === "low";
    })
    .slice(0, 2),

  minimal: questions
    .filter((q, i) => {
      const analysis = analysisMap.get(q.id);
      return analysis && analysis.customizationLevel === "none";
    })
    .slice(0, 2),
};

Object.entries(examples).forEach(([level, items]) => {
  if (items.length === 0) return;

  const levelNames = {
    medium: "🔸 中程度カスタマイズ",
    low: "🔹 低度カスタマイズ",
    minimal: "⚪ 最小限解説",
  };

  console.log(`【${levelNames[level]}】:`);
  items.forEach((item, index) => {
    console.log(`\n${index + 1}. ${item.id}:`);
    console.log(item.explanation);
  });
  console.log("\n" + "=".repeat(50) + "\n");
});

console.log(
  "✨ カスタマイズ完了！汎用的な解説を削除し、問題固有の内容に特化しました。",
);
console.log("📈 改善内容:");
console.log("  - 取引タイプ別の具体的な解説");
console.log("  - 問題固有の注意点とコツ");
console.log("  - 汎用的な内容の大幅削減");
console.log("  - 冗長性の排除");
