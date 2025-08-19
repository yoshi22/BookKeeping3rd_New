#!/usr/bin/env node

/**
 * Phase 3: 当座預金パターン（15問）の新しい問題データ生成
 *
 * Category 1: 現金・預金取引の完成
 * - Q_J_013-Q_J_027: 当座預金パターン（15問）
 * - 振込・小切手・預入・引出・当座借越などの多様なパターン
 */

const fs = require("fs");
const path = require("path");

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
  {
    id: "Q_J_018",
    question_text:
      "当座預金残高が不足したため、買掛金500円の支払いで当座借越となった。",
    debit_account: "買掛金",
    debit_amount: 500,
    credit_account: "当座借越",
    credit_amount: 500,
    pattern: "当座借越発生",
    keywords: ["当座借越", "買掛金", "残高不足", "負債"],
  },
  {
    id: "Q_J_019",
    question_text: "得意先振出の小切手750円を受け取った。",
    debit_account: "現金",
    debit_amount: 750,
    credit_account: "売上",
    credit_amount: 750,
    pattern: "他人振出小切手受取",
    keywords: ["他人振出小切手", "現金", "売上"],
  },
  {
    id: "Q_J_020",
    question_text: "手形代金1,200円が当座預金口座に入金された。",
    debit_account: "当座預金",
    debit_amount: 1200,
    credit_account: "受取手形",
    credit_amount: 1200,
    pattern: "手形決済（当座預金入金）",
    keywords: ["受取手形", "当座預金", "手形決済", "満期"],
  },
  {
    id: "Q_J_021",
    question_text: "支払手形900円が当座預金から引き落とされた。",
    debit_account: "支払手形",
    debit_amount: 900,
    credit_account: "当座預金",
    credit_amount: 900,
    pattern: "手形決済（当座預金支払）",
    keywords: ["支払手形", "当座預金", "手形決済", "満期"],
  },
  {
    id: "Q_J_022",
    question_text: "事務用品費350円を小切手で支払った。",
    debit_account: "事務用品費",
    debit_amount: 350,
    credit_account: "当座預金",
    credit_amount: 350,
    pattern: "費用支払（小切手）",
    keywords: ["事務用品費", "小切手", "当座預金", "費用支払"],
  },
  {
    id: "Q_J_023",
    question_text: "家賃120,000円を当座預金から自動振替で支払った。",
    debit_account: "支払家賃",
    debit_amount: 120000,
    credit_account: "当座預金",
    credit_amount: 120000,
    pattern: "家賃自動振替",
    keywords: ["支払家賃", "自動振替", "当座預金", "固定費"],
  },
  {
    id: "Q_J_024",
    question_text: "売上代金の入金として当座預金口座に2,500円振り込まれた。",
    debit_account: "当座預金",
    debit_amount: 2500,
    credit_account: "売上",
    credit_amount: 2500,
    pattern: "売上代金振込",
    keywords: ["売上", "当座預金", "振込入金", "代金回収"],
  },
  {
    id: "Q_J_025",
    question_text: "給料150,000円を当座預金から各従業員の口座に振り込んだ。",
    debit_account: "給料",
    debit_amount: 150000,
    credit_account: "当座預金",
    credit_amount: 150000,
    pattern: "給料振込支払",
    keywords: ["給料", "当座預金", "振込支払", "人件費"],
  },
  {
    id: "Q_J_026",
    question_text: "電気料金18,000円が当座預金から自動引き落としされた。",
    debit_account: "水道光熱費",
    debit_amount: 18000,
    credit_account: "当座預金",
    credit_amount: 18000,
    pattern: "公共料金自動引落",
    keywords: ["水道光熱費", "電気料金", "自動引落", "当座預金"],
  },
  {
    id: "Q_J_027",
    question_text: "当座預金口座から普通預金口座へ50,000円を資金移動した。",
    debit_account: "普通預金",
    debit_amount: 50000,
    credit_account: "当座預金",
    credit_amount: 50000,
    pattern: "預金間資金移動",
    keywords: ["普通預金", "当座預金", "資金移動", "口座振替"],
  },
];

/**
 * 問題データを生成する関数
 */
function generateQuestionData(pattern) {
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
    explanation: generateExplanation(pattern),
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
  const explanationMap = {
    Q_J_013: `【基本概念】
当座預金は銀行に開設した決済専用の預金口座で、小切手や手形の決済に使用されます。利息は付かず、法人が開設する専用口座です。売掛金の回収時には、取引先からの振込により当座預金が増加し、売掛金が減少します。

【具体例・イメージ】
法人が取引先に商品を掛けで売った後、取引先が代金を銀行振込で支払った状況をイメージしてください。会社の当座預金口座に入金され、売掛金という「もらう権利」が回収されます。

【仕訳パターン】
・売掛金回収（振込）: 借方に当座預金、貸方に売掛金
・売掛金回収（現金）: 借方に現金、貸方に売掛金
・売掛金回収（手形）: 借方に受取手形、貸方に売掛金

【間違えやすいポイント】
・当座預金と普通預金の用途を混同する
・売掛金の回収なので「売上」ではない
・振込手数料が差し引かれる場合の処理に注意

【覚え方のコツ】
・振込で「もらった」→当座預金増加（借方）
・売掛金は「回収された」→売掛金減少（貸方）
・掛け取引の「後始末」をイメージ

【この問題の仕訳】
売掛金800円の振込回収：
借方：当座預金 800円
貸方：売掛金 800円`,

    Q_J_014: `【基本概念】
買掛金は商品やサービスを掛けで仕入れた際に発生する支払義務（負債）です。当座預金からの振込支払いにより、買掛金という債務を決済します。振込は現代の代表的な決済手段です。

【具体例・イメージ】
会社が仕入先に商品代金をツケで購入した後、約束の支払期日に銀行振込で代金を支払う状況をイメージしてください。支払により買掛金の義務がなくなり、当座預金が減少します。

【仕訳パターン】
・買掛金支払（振込）: 借方に買掛金、貸方に当座預金
・買掛金支払（現金）: 借方に買掛金、貸方に現金
・買掛金支払（手形）: 借方に買掛金、貸方に支払手形

【間違えやすいポイント】
・買掛金と売掛金を混同する（支払う側か受け取る側か）
・振込手数料が発生する場合の処理
・支払済みの買掛金を再度仕訳してしまう

【覚え方のコツ】
・「買」掛金 = 「買った」ツケ = 支払う義務（負債）
・支払ったので買掛金減少（借方）
・振込で「出た」→当座預金減少（貸方）

【この問題の仕訳】
買掛金600円の振込支払：
借方：買掛金 600円
貸方：当座預金 600円`,

    Q_J_015: `【基本概念】
小切手は当座預金口座から支払う約束手形の一種で、振出人が銀行に支払いを委託する証券です。小切手を振り出すと、当座預金から支払ったのと同じ効果があります。買掛金の支払手段として広く使用されます。

【具体例・イメージ】
会社が仕入先への支払いのために小切手帳から小切手を切って渡す状況をイメージしてください。仕入先がその小切手を銀行に持参すると、振出会社の当座預金から代金が支払われます。

【仕訳パターン】
・小切手振出（買掛金支払）: 借方に買掛金、貸方に当座預金
・小切手振出（費用支払）: 借方に各種費用、貸方に当座預金
・小切手振出（現金等価物）: 振出と同時に当座預金から控除

【間違えやすいポイント】
・他人振出小切手は「現金」として扱う
・自己振出小切手は「当座預金」の減少
・小切手の受取と振出を混同する

【覚え方のコツ】
・小切手を「出した」→当座預金減少（貸方）
・買掛金を「払った」→買掛金減少（借方）
・小切手 = 当座預金の支払約束

【この問題の仕訳】
小切手400円による買掛金支払：
借方：買掛金 400円
貸方：当座預金 400円`,
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

/**
 * メイン実行関数
 */
function main() {
  console.log("📝 Phase 3: 当座預金パターン生成開始");
  console.log("🎯 対象: Q_J_013-Q_J_027 (当座預金取引15問)");

  // 当座預金パターンのデータ生成
  console.log("\n🔄 当座預金パターン（15問）を生成中...");
  const chequingQuestions = chequingAccountPatterns.map(generateQuestionData);

  console.log(
    `\n✅ 合計${chequingQuestions.length}問の当座預金パターンを生成完了`,
  );
  console.log(
    "📄 生成された問題ID:",
    chequingQuestions.map((q) => q.id).join(", "),
  );

  // パターンの多様性を表示
  console.log("\n🌟 生成されたパターンの多様性:");
  chequingAccountPatterns.forEach((pattern, index) => {
    console.log(`${index + 1}. ${pattern.id}: ${pattern.pattern}`);
  });

  console.log("\n⚠️  次のステップ:");
  console.log("1. master-questions.ts のQ_J_013-Q_J_027を新パターンで置換");
  console.log("2. データバージョンの更新");
  console.log("3. アプリでの動作確認");

  return chequingQuestions;
}

// スクリプト実行
if (require.main === module) {
  const result = main();
  console.log("\n🎉 Phase 3 当座預金パターン生成完了");
}

module.exports = {
  chequingAccountPatterns,
  generateQuestionData,
  generateExplanation,
};
