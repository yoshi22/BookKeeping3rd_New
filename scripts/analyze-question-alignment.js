#!/usr/bin/env node

/**
 * 問題とproblemsStrategy.mdの整合性分析スクリプト
 */

const fs = require("fs");
const path = require("path");

// ファイルパス
const MASTER_QUESTIONS_PATH = path.join(
  __dirname,
  "../src/data/master-questions.ts",
);
const STRATEGY_PATH = path.join(
  __dirname,
  "../docs/product/problemsStrategy.md",
);

// problemsStrategy.mdで定義されている問題パターン
const EXPECTED_PATTERNS = {
  // カテゴリー1：現金・預金取引（42問）
  Q_J_001: "原因不明の現金過不足発見→現金過不足勘定計上",
  Q_J_002: "原因判明の現金過不足→該当勘定への直接修正",
  Q_J_003: "決算時の現金過不足整理→雑損益への振替",
  Q_J_004: "現金実査による帳簿残高との差額発見",
  Q_J_005: "小口現金制度の設定・資金前渡",
  Q_J_006: "小口現金の定期補給（インプレスト・システム）",
  Q_J_007: "小口現金からの経費支払・精算",
  Q_J_008: "現金売上・現金仕入の基本処理",
  Q_J_009: "現金による給与支払・源泉徴収",
  Q_J_010: "現金による経費支払（交通費・消耗品等）",
  Q_J_011: "現金による税金支払",
  Q_J_012: "現金による利息・配当金の受取",
  Q_J_013: "当座預金口座開設・資金預入",
  Q_J_014: "小切手振出による支払",
  Q_J_015: "振込による当座預金入金",
  Q_J_016: "当座預金からの現金引出",
  Q_J_017: "当座預金口座間振替",
  Q_J_018: "銀行振込手数料の処理",
  Q_J_019: "当座借越契約・限度額設定",
  Q_J_020: "当座預金残高不足での小切手振出",
  Q_J_021: "当座借越利息の計算・支払",
  Q_J_022: "当座借越の返済・解消",
  Q_J_023: "当座借越から当座預金への振替",
  Q_J_024: "当座借越限度額の変更",
  Q_J_025: "当座預金利息の受取・源泉徴収",
  Q_J_026: "銀行手数料の自動引落",
  Q_J_027: "振込手数料の負担区分処理",
  Q_J_028: "普通預金口座開設・資金預入",
  Q_J_029: "普通預金からの現金引出",
  Q_J_030: "自動引落による公共料金支払",
  Q_J_031: "給与振込による普通預金入金",
  Q_J_032: "普通預金利息の受取・源泉徴収",
  Q_J_033: "普通預金と当座預金の振替",
  Q_J_034: "ATM手数料の処理",
  Q_J_035: "普通預金口座解約",
  Q_J_036: "定期預金の預入・証書発行",
  Q_J_037: "定期預金の満期解約・利息計算",
  Q_J_038: "定期預金の中途解約・違約金",
  Q_J_039: "自動継続定期預金の処理",
  Q_J_040: "定期預金担保貸付の実行",
  Q_J_041: "外貨定期預金の為替差損益",
  Q_J_042: "定期預金から普通預金への振替",

  // カテゴリー2：商品売買取引（45問）
  Q_J_043: "商品の現金仕入",
  Q_J_044: "商品の掛け仕入（買掛金計上）",
  Q_J_045: "商品の現金売上",
  Q_J_046: "商品の掛け売上（売掛金計上）",
  Q_J_047: "掛け仕入代金の現金支払（買掛金決済）",
  Q_J_048: "掛け売上代金の現金回収（売掛金回収）",
  Q_J_049: "仕入・売上の混合取引（一部現金・一部掛け）",
  Q_J_050: "三分法による商品勘定の処理",
};

// 実際の問題を読み込み
function loadActualQuestions() {
  const content = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf8");
  const questions = [];

  // 正規表現で問題を抽出
  const questionRegex =
    /{\s*id:\s*"(Q_[JLT]_\d{3})",[\s\S]*?question_text:\s*"([^"]*)"[\s\S]*?}/g;
  let match;

  while ((match = questionRegex.exec(content)) !== null) {
    questions.push({
      id: match[1],
      question_text: match[2],
    });
  }

  return questions;
}

// 分析実行
function analyzeAlignment() {
  console.log("📊 問題整合性分析開始...\n");

  const actualQuestions = loadActualQuestions();
  const discrepancies = [];

  // 各期待パターンをチェック
  for (const [questionId, expectedPattern] of Object.entries(
    EXPECTED_PATTERNS,
  )) {
    const actualQuestion = actualQuestions.find((q) => q.id === questionId);

    if (!actualQuestion) {
      discrepancies.push({
        id: questionId,
        type: "MISSING",
        expected: expectedPattern,
        actual: "問題が見つかりません",
      });
    } else {
      // パターンマッチング判定
      const isAligned = checkPatternAlignment(
        expectedPattern,
        actualQuestion.question_text,
      );
      if (!isAligned) {
        discrepancies.push({
          id: questionId,
          type: "MISMATCH",
          expected: expectedPattern,
          actual: actualQuestion.question_text,
        });
      }
    }
  }

  // 結果表示
  console.log("=== 分析結果 ===\n");
  console.log(`総問題数: ${Object.keys(EXPECTED_PATTERNS).length}`);
  console.log(`不整合数: ${discrepancies.length}`);
  console.log(
    `整合率: ${(((Object.keys(EXPECTED_PATTERNS).length - discrepancies.length) / Object.keys(EXPECTED_PATTERNS).length) * 100).toFixed(1)}%\n`,
  );

  if (discrepancies.length > 0) {
    console.log("=== 不整合詳細 ===\n");
    for (const disc of discrepancies) {
      console.log(`❌ ${disc.id}:`);
      console.log(`   期待: ${disc.expected}`);
      console.log(`   実際: ${disc.actual}`);
      console.log("");
    }
  }

  return discrepancies;
}

// パターン整合性チェック
function checkPatternAlignment(expectedPattern, actualText) {
  // キーワードベースでの簡易マッチング
  const patterns = {
    原因不明の現金過不足: ["現金実査", "帳簿残高", "現金過不足"],
    原因判明の現金過不足: ["原因判明", "現金過不足", "修正"],
    小口現金制度の設定: ["小口現金", "前渡"],
    商品の現金仕入: ["商品", "仕入", "現金"],
    商品の掛け仕入: ["商品", "仕入", "掛け"],
    // ... 他のパターン
  };

  // より詳細なマッチングロジックが必要
  for (const [key, keywords] of Object.entries(patterns)) {
    if (expectedPattern.includes(key)) {
      return keywords.some((kw) => actualText.includes(kw));
    }
  }

  // デフォルトは不一致
  return false;
}

// 実行
const discrepancies = analyzeAlignment();

// 結果をファイルに保存
const resultPath = path.join(
  __dirname,
  "../docs/development-logs/2025-08-19-alignment-analysis.json",
);
fs.writeFileSync(resultPath, JSON.stringify(discrepancies, null, 2));
console.log(`\n📁 詳細結果を保存しました: ${resultPath}`);
