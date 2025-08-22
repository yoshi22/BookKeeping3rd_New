#!/usr/bin/env node

/**
 * パターン修正適用スクリプト
 * 生成された新しいパターンをmaster-questions.tsに適用
 */

// fs module imported but not used in this script
const { cashPatterns } = require("./fix-duplicate-questions");

// 詳細な説明を生成する関数
function generateDetailedExplanation(pattern) {
  const explanationMap = {
    Q_J_003: `【基本概念】
現金の実際有高と帳簿残高に差額が生じた場合の処理です。実際有高が帳簿残高より多い場合（現金過剰）は、借方に現金、貸方に現金過不足を記録します。

【具体例・イメージ】
レジの現金を数えたら、売上記録よりも多く現金があった状況をイメージしてください。この差額を一時的に記録するのが現金過不足勘定です。

【現金過不足の処理パターン】
・実際有高 > 帳簿残高（現金過剰）: 借方に現金、貸方に現金過不足
・実際有高 < 帳簿残高（現金不足）: 借方に現金過不足、貸方に現金

【間違えやすいポイント】
・実際有高と帳簿残高の大小関係を逆に覚える
・現金過不足は決算時に他の勘定に振り替える必要がある
・原因不明の場合は雑益・雑損に振り替える

【覚え方のコツ】
・「実際に多い」→「現金が増えた」→「借方に現金」
・「帳簿より少ない」→「現金が減った」→「貸方に現金」
・現金過不足は「仮の勘定」で、必ず決算で整理される

【この問題の仕訳】
実際有高1,200円 > 帳簿残高1,000円 = 現金過剰200円
借方：現金 200円
貸方：現金過不足 200円`,
  };

  return (
    explanationMap[pattern.id] ||
    `【基本概念】
${pattern.pattern}の処理です。${pattern.keywords.join("、")}に関連する重要な仕訳パターンです。

【この問題の仕訳】
借方：${pattern.debit_account} ${pattern.debit_amount.toLocaleString()}円
貸方：${pattern.credit_account} ${pattern.credit_amount.toLocaleString()}円`
  );
}

// Q_J_003を現金過剰パターンに修正
function fixQ_J_003() {
  const pattern = cashPatterns.find((p) => p.id === "Q_J_003");
  if (!pattern) {
    console.error("Q_J_003 pattern not found");
    return;
  }

  console.log(`🔧 Q_J_003を修正中...`);
  console.log(`   新しい問題文: ${pattern.question_text}`);
  console.log(
    `   新しい仕訳: ${pattern.debit_account} ${pattern.debit_amount} / ${pattern.credit_account} ${pattern.credit_amount}`,
  );

  return {
    id: pattern.id,
    question_text: pattern.question_text,
    correct_answer_json: JSON.stringify({
      journalEntry: {
        debit_account: pattern.debit_account,
        debit_amount: pattern.debit_amount,
        credit_account: pattern.credit_account,
        credit_amount: pattern.credit_amount,
      },
    }),
    explanation: generateDetailedExplanation(pattern),
    tags_json: JSON.stringify({
      subcategory: "cash_deposit",
      pattern: pattern.pattern,
      accounts: [pattern.debit_account, pattern.credit_account],
      keywords: pattern.keywords,
      examSection: 1,
    }),
  };
}

function main() {
  console.log("📝 パターン修正適用開始");

  const fixedQ_J_003 = fixQ_J_003();

  console.log("\n✅ Q_J_003の修正完了:");
  console.log("   - 売掛金振込パターン → 現金過剰パターン");
  console.log("   - 多様性向上により学習効果アップ");

  console.log("\n📋 手動で適用してください:");
  console.log(`1. Q_J_003の question_text を: "${fixedQ_J_003.question_text}"`);
  console.log(
    `2. correct_answer_json を: '${fixedQ_J_003.correct_answer_json}'`,
  );
  console.log(`3. explanation を更新`);
  console.log(`4. tags_json を: '${fixedQ_J_003.tags_json}'`);

  return fixedQ_J_003;
}

if (require.main === module) {
  main();
}

module.exports = { fixQ_J_003, generateDetailedExplanation };
