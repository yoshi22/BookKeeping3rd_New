#!/usr/bin/env node

/**
 * 簿記3級問題集アプリ - 重複問題修正スクリプト
 *
 * 問題: 仕訳問題（Q_J_001-Q_J_250）で金額だけ変えた重複パターンが多数存在
 * 対策: problemsStrategy.mdに基づく多様なパターンで置き換え
 *
 * カテゴリー1: 現金・預金取引（Q_J_001-Q_J_042）
 * - 現金取引パターン: 12問
 * - 当座預金パターン: 15問
 * - 普通預金・定期預金パターン: 15問
 */

const fs = require("fs");
const path = require("path");

// 現金取引パターン（12問）の新しい問題データ
const cashPatterns = [
  {
    id: "Q_J_001",
    question_text:
      "現金実査の結果、現金の実際有高が300円であったが、帳簿残高は500円であった。",
    debit_account: "現金過不足",
    debit_amount: 200,
    credit_account: "現金",
    credit_amount: 200,
    pattern: "現金過不足（不足）",
    keywords: ["現金実査", "実際有高", "帳簿残高", "現金不足"],
  },
  {
    id: "Q_J_002",
    question_text:
      "小口現金係への前渡金500円の精算を受け、不足額300円を補給した。",
    debit_account: "小口現金",
    debit_amount: 300,
    credit_account: "現金",
    credit_amount: 300,
    pattern: "小口現金補給",
    keywords: ["小口現金", "精算", "補給", "定額資金前渡制"],
  },
  {
    id: "Q_J_003",
    question_text:
      "現金実査の結果、現金の実際有高が1,200円であったが、帳簿残高は1,000円であった。",
    debit_account: "現金",
    debit_amount: 200,
    credit_account: "現金過不足",
    credit_amount: 200,
    pattern: "現金過不足（過剰）",
    keywords: ["現金実査", "実際有高", "現金過剰"],
  },
  {
    id: "Q_J_004",
    question_text: "小口現金係に定額資金として800円を前渡しした。",
    debit_account: "小口現金",
    debit_amount: 800,
    credit_account: "現金",
    credit_amount: 800,
    pattern: "小口現金前渡し",
    keywords: ["小口現金", "定額資金", "前渡し", "インプレスト制"],
  },
  {
    id: "Q_J_005",
    question_text: "現金売上400円があった。",
    debit_account: "現金",
    debit_amount: 400,
    credit_account: "売上",
    credit_amount: 400,
    pattern: "現金売上",
    keywords: ["現金売上", "売上収入"],
  },
  {
    id: "Q_J_006",
    question_text: "事務用品費150円を現金で支払った。",
    debit_account: "事務用品費",
    debit_amount: 150,
    credit_account: "現金",
    credit_amount: 150,
    pattern: "現金支払（事務用品）",
    keywords: ["事務用品費", "現金支払"],
  },
  {
    id: "Q_J_007",
    question_text: "従業員への出張旅費3,000円を現金で支払った。",
    debit_account: "旅費交通費",
    debit_amount: 3000,
    credit_account: "現金",
    credit_amount: 3000,
    pattern: "現金支払（旅費）",
    keywords: ["旅費交通費", "現金支払", "出張旅費"],
  },
  {
    id: "Q_J_008",
    question_text:
      "現金による売上代金の過不足が判明し、不足分100円を雑損失として処理した。",
    debit_account: "雑損失",
    debit_amount: 100,
    credit_account: "現金過不足",
    credit_amount: 100,
    pattern: "現金過不足処理（雑損）",
    keywords: ["現金過不足", "雑損失", "決算処理"],
  },
  {
    id: "Q_J_009",
    question_text:
      "現金による売上代金の過不足が判明し、過剰分80円を雑収入として処理した。",
    debit_account: "現金過不足",
    debit_amount: 80,
    credit_account: "雑収入",
    credit_amount: 80,
    pattern: "現金過不足処理（雑益）",
    keywords: ["現金過不足", "雑収入", "決算処理"],
  },
  {
    id: "Q_J_010",
    question_text:
      "小口現金から交通費200円、文房具代300円を支払った精算報告を受けた。",
    debit_account: "旅費交通費",
    debit_amount: 200,
    credit_account: "小口現金",
    credit_amount: 500,
    pattern: "小口現金精算（複合）",
    keywords: ["小口現金", "精算", "旅費交通費", "事務用品費"],
    additional_entry: {
      debit_account: "事務用品費",
      debit_amount: 300,
    },
  },
  {
    id: "Q_J_011",
    question_text:
      "現金収支の不一致により生じた現金過不足50円について、原因が判明しないため雑損失として処理した。",
    debit_account: "雑損失",
    debit_amount: 50,
    credit_account: "現金過不足",
    credit_amount: 50,
    pattern: "現金過不足の最終処理",
    keywords: ["現金過不足", "雑損失", "原因不明", "決算整理"],
  },
  {
    id: "Q_J_012",
    question_text: "現金での商品販売により売上1,500円を得た。",
    debit_account: "現金",
    debit_amount: 1500,
    credit_account: "売上",
    credit_amount: 1500,
    pattern: "現金売上（商品）",
    keywords: ["現金売上", "商品販売", "売上収入"],
  },
];

// 当座預金パターン（15問）の新しい問題データ
const chequingAccountPatterns = [
  {
    id: "Q_J_013",
    question_text: "売掛金800円が当座預金口座に振り込まれた。",
    debit_account: "当座預金",
    debit_amount: 800,
    credit_account: "売掛金",
    credit_amount: 800,
    pattern: "当座預金振込（売掛金回収）",
    keywords: ["当座預金", "売掛金", "振込", "債権回収"],
  },
  {
    id: "Q_J_014",
    question_text: "買掛金600円を当座預金から振り込みで支払った。",
    debit_account: "買掛金",
    debit_amount: 600,
    credit_account: "当座預金",
    credit_amount: 600,
    pattern: "当座預金支払（買掛金）",
    keywords: ["買掛金", "当座預金", "振込支払", "債務支払"],
  },
  {
    id: "Q_J_015",
    question_text: "仕入先に対し小切手400円を振り出して支払った。",
    debit_account: "買掛金",
    debit_amount: 400,
    credit_account: "当座預金",
    credit_amount: 400,
    pattern: "小切手振出（買掛金支払）",
    keywords: ["小切手", "振出", "当座預金", "買掛金支払"],
  },
  {
    id: "Q_J_016",
    question_text: "現金300円を当座預金口座に預け入れた。",
    debit_account: "当座預金",
    debit_amount: 300,
    credit_account: "現金",
    credit_amount: 300,
    pattern: "当座預金預入",
    keywords: ["当座預金", "預け入れ", "現金"],
  },
  {
    id: "Q_J_017",
    question_text: "当座預金から現金200円を引き出した。",
    debit_account: "現金",
    debit_amount: 200,
    credit_account: "当座預金",
    credit_amount: 200,
    pattern: "当座預金引出",
    keywords: ["当座預金", "引出", "現金"],
  },
  // 残り10問は後で追加
];

/**
 * 問題データを生成する関数
 */
function generateQuestionData(pattern) {
  const baseExplanation = generateExplanation(pattern);

  return {
    id: pattern.id,
    category_id: "journal",
    question_text: pattern.question_text,
    answer_template_json:
      '{"type":"journal_entry","journalEntry":{"debit_account":"","debit_amount":0,"credit_account":"","credit_amount":0}}',
    correct_answer_json: JSON.stringify({
      journalEntry: {
        debit_account: pattern.debit_account,
        debit_amount: pattern.debit_amount,
        credit_account: pattern.credit_account,
        credit_amount: pattern.credit_amount,
      },
    }),
    explanation: baseExplanation,
    difficulty: 1,
    tags_json: JSON.stringify({
      subcategory: "cash_deposit",
      pattern: pattern.pattern,
      accounts: [pattern.debit_account, pattern.credit_account],
      keywords: pattern.keywords,
      examSection: 1,
    }),
    created_at: "2025-08-07T00:31:25.367Z",
    updated_at: "2025-08-07T00:31:25.367Z",
  };
}

/**
 * パターンに基づいて説明文を生成
 */
function generateExplanation(pattern) {
  // 基本的な説明テンプレートを返す
  return `【基本概念】\n${pattern.pattern}の処理です。${pattern.keywords.join("、")}に関連する重要な仕訳パターンです。\n\n【この問題の仕訳】\n借方：${pattern.debit_account} ${pattern.debit_amount.toLocaleString()}円\n貸方：${pattern.credit_account} ${pattern.credit_amount.toLocaleString()}円`;
}

/**
 * メイン実行関数
 */
function main() {
  console.log("📝 重複問題修正スクリプト開始");
  console.log("🎯 対象: Q_J_001-Q_J_042 (現金・預金取引)");

  // 現金取引パターン（12問）のデータ生成
  console.log("\n🔄 現金取引パターン（12問）を生成中...");
  const cashQuestions = cashPatterns.map(generateQuestionData);

  // 当座預金パターン（5問のみ先行）のデータ生成
  console.log("🔄 当座預金パターン（5問）を生成中...");
  const chequingQuestions = chequingAccountPatterns.map(generateQuestionData);

  const allNewQuestions = [...cashQuestions, ...chequingQuestions];

  console.log(`\n✅ 合計${allNewQuestions.length}問の新しいパターンを生成完了`);
  console.log(
    "📄 生成された問題ID:",
    allNewQuestions.map((q) => q.id).join(", "),
  );

  // 実際のファイル修正はここで実装
  console.log("\n⚠️  注意: 実際のファイル修正は手動で実施してください");
  console.log("📋 次のステップ:");
  console.log("1. master-questions.ts のバックアップ作成");
  console.log("2. 該当問題の置き換え実施");
  console.log("3. データバージョンの更新");
  console.log("4. アプリでの動作確認");

  return allNewQuestions;
}

// スクリプト実行
if (require.main === module) {
  const result = main();
  console.log("\n🎉 スクリプト完了");
}

module.exports = {
  cashPatterns,
  chequingAccountPatterns,
  generateQuestionData,
};
