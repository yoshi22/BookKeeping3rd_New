#!/usr/bin/env node

/**
 * 第3問の問題形式を慎重に修正するスクリプト
 * - Q_T_001-004: 財務諸表作成問題
 * - Q_T_005-008: 精算表作成問題
 * - Q_T_009-012: 試算表作成問題（変更なし）
 */

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../src/data/master-questions.ts");

// ファイルを読み込む
let content = fs.readFileSync(filePath, "utf-8");

console.log("第3問の問題形式を修正開始...");

// Q_T_001の修正
console.log("Q_T_001を財務諸表形式に修正（期首BS残高も追加）...");

// Q_T_001のテンプレートと正答データ（財務諸表形式）
const q_t_001_template = `{"type":"financial_statement","balanceSheet":{"assets":["現金","売掛金","商品","前払金","建物","備品","減価償却累計額"],"liabilities":["買掛金","借入金","貸倒引当金"],"equity":["資本金","当期純利益"]},"incomeStatement":{"revenues":["売上高"],"expenses":["仕入","水道光熱費","消耗品費","減価償却費","貸倒引当金繰入"]}}`;

const q_t_001_answer = `{"balanceSheet":{"assets":[{"accountName":"現金","amount":783000},{"accountName":"売掛金","amount":800000},{"accountName":"貸倒引当金","amount":-16000},{"accountName":"商品","amount":500000},{"accountName":"前払金","amount":867000},{"accountName":"建物","amount":2000000},{"accountName":"建物減価償却累計額","amount":-500000},{"accountName":"備品","amount":500000},{"accountName":"備品減価償却累計額","amount":-150000}],"liabilities":[{"accountName":"買掛金","amount":1551000},{"accountName":"借入金","amount":1200000}],"equity":[{"accountName":"資本金","amount":3000000},{"accountName":"当期純利益","amount":33000}]},"incomeStatement":{"revenues":[{"accountName":"売上高","amount":567000}],"expenses":[{"accountName":"仕入","amount":951000},{"accountName":"水道光熱費","amount":233000},{"accountName":"消耗品費","amount":184000},{"accountName":"減価償却費","amount":150000},{"accountName":"貸倒引当金繰入","amount":16000}],"netIncome":33000}}`;

const q_t_001_text = `【財務諸表作成問題】\\n\\n2025年9月の期首残高、期中取引および決算整理事項から、貸借対照表と損益計算書を作成してください。\\n\\n【期首残高】\\n現金：1,500,000円\\n売掛金：800,000円\\n商品：600,000円\\n建物：2,000,000円（減価償却累計額：400,000円）\\n備品：500,000円（減価償却累計額：100,000円）\\n買掛金：700,000円\\n借入金：1,200,000円\\n資本金：3,000,000円\\n\\n【期中取引】\\n9月2日 前払金 867,000 / 現金 867,000 （前払金支払）\\n9月4日 水道光熱費 233,000 / 現金 233,000 （水道光熱費支払）\\n9月9日 消耗品費 184,000 / 現金 184,000 （消耗品購入）\\n9月10日 仕入 851,000 / 買掛金 851,000 （商品仕入）\\n9月17日 現金 567,000 / 売上 567,000 （商品売上）\\n\\n【決算整理事項】\\n・貸倒引当金設定：売掛金の2%を設定\\n・減価償却：建物100,000円、備品50,000円\\n・期末商品棚卸高：500,000円\\n\\n【作成指示】\\n1. 決算整理仕訳を行う\\n2. 貸借対照表を作成する\\n3. 損益計算書を作成する`;

// Q_T_001の置換
content = content.replace(
  /question_text:\s*"[^"]*",\s*answer_template_json:\s*'[^']*',\s*correct_answer_json:\s*'[^']*',(\s*explanation:[^,]*,\s*difficulty:[^,]*,\s*tags_json:\s*'[^']*',)/gm,
  (match, rest) => {
    if (match.includes("Q_T_001")) {
      return `question_text:\n      "${q_t_001_text}",\n    answer_template_json:\n      '${q_t_001_template}',\n    correct_answer_json:\n      '${q_t_001_answer}',${rest}`;
    }
    return match;
  },
);

// Q_T_002-004も同様に修正（財務諸表形式）
const financial_template = `{"type":"financial_statement","balanceSheet":{"assets":["現金","売掛金","商品","前払金","建物","備品","減価償却累計額"],"liabilities":["買掛金","借入金","前受金","貸倒引当金"],"equity":["資本金","当期純利益"]},"incomeStatement":{"revenues":["売上高"],"expenses":["仕入","水道光熱費","減価償却費","貸倒引当金繰入"]}}`;

// Q_T_002の修正
console.log("Q_T_002を財務諸表形式に修正...");
const q_t_002_text = `【財務諸表作成問題】\\n\\n2025年10月の期首残高、期中取引および決算整理事項から、貸借対照表と損益計算書を作成してください。\\n\\n【期首残高】\\n現金：1,200,000円\\n売掛金：600,000円\\n商品：400,000円\\n建物：1,500,000円（減価償却累計額：300,000円）\\n買掛金：500,000円\\n資本金：2,900,000円\\n\\n【期中取引】\\n10月4日 前払金 353,000 / 現金 353,000 （前払金支払）\\n10月5日 現金 624,000 / 前受金 624,000 （前受金受取）\\n10月8日 仕入 570,000 / 買掛金 570,000 （商品仕入）\\n10月12日 水道光熱費 129,000 / 現金 129,000 （水道光熱費支払）\\n10月23日 売掛金 641,000 / 売上 641,000 （掛売上）\\n10月27日 現金 457,000 / 売掛金 457,000 （売掛金回収）\\n\\n【決算整理事項】\\n・貸倒引当金設定：売掛金の3%を設定\\n・減価償却：建物75,000円\\n・期末商品棚卸高：350,000円\\n\\n【作成指示】\\n1. 決算整理仕訳を行う\\n2. 貸借対照表を作成する\\n3. 損益計算書を作成する`;

const q_t_002_answer = `{"balanceSheet":{"assets":[{"accountName":"現金","amount":1799000},{"accountName":"売掛金","amount":784000},{"accountName":"貸倒引当金","amount":-24000},{"accountName":"商品","amount":350000},{"accountName":"前払金","amount":353000},{"accountName":"建物","amount":1500000},{"accountName":"建物減価償却累計額","amount":-375000}],"liabilities":[{"accountName":"買掛金","amount":1070000},{"accountName":"前受金","amount":624000}],"equity":[{"accountName":"資本金","amount":2900000},{"accountName":"当期純利益","amount":193000}]},"incomeStatement":{"revenues":[{"accountName":"売上高","amount":641000}],"expenses":[{"accountName":"仕入","amount":620000},{"accountName":"水道光熱費","amount":129000},{"accountName":"減価償却費","amount":75000},{"accountName":"貸倒引当金繰入","amount":24000}],"netIncome":193000}}`;

// Q_T_003の修正
console.log("Q_T_003を財務諸表形式に修正...");
const q_t_003_text = `【財務諸表作成問題】\\n\\n2025年12月の期首残高、期中取引および決算整理事項から、貸借対照表と損益計算書を作成してください。\\n\\n【期首残高】\\n現金：2,000,000円\\n売掛金：900,000円\\n商品：700,000円\\n備品：800,000円（減価償却累計額：200,000円）\\n買掛金：600,000円\\n借入金：800,000円\\n資本金：2,800,000円\\n\\n【期中取引】\\n12月16日 水道光熱費 217,000 / 現金 217,000 （水道光熱費支払）\\n12月17日 旅費交通費 147,000 / 現金 147,000 （交通費支払）\\n12月19日 広告宣伝費 231,000 / 現金 231,000 （広告費支払）\\n12月20日 消耗品費 199,000 / 現金 199,000 （消耗品購入）\\n12月22日 仕入 340,000 / 買掛金 340,000 （商品仕入）\\n12月27日 現金 889,000 / 売上 889,000 （商品売上）\\n\\n【決算整理事項】\\n・貸倒引当金設定：売掛金の2%を設定\\n・減価償却：備品80,000円\\n・前払費用計上：広告宣伝費のうち50,000円は翌期分\\n・期末商品棚卸高：650,000円\\n\\n【作成指示】\\n1. 決算整理仕訳を行う\\n2. 貸借対照表を作成する\\n3. 損益計算書を作成する`;

const q_t_003_template = `{"type":"financial_statement","balanceSheet":{"assets":["現金","売掛金","商品","前払費用","備品","減価償却累計額"],"liabilities":["買掛金","借入金","貸倒引当金"],"equity":["資本金","当期純利益"]},"incomeStatement":{"revenues":["売上高"],"expenses":["仕入","水道光熱費","旅費交通費","広告宣伝費","消耗品費","減価償却費","貸倒引当金繰入"]}}`;

const q_t_003_answer = `{"balanceSheet":{"assets":[{"accountName":"現金","amount":2095000},{"accountName":"売掛金","amount":900000},{"accountName":"貸倒引当金","amount":-18000},{"accountName":"商品","amount":650000},{"accountName":"前払費用","amount":50000},{"accountName":"備品","amount":800000},{"accountName":"備品減価償却累計額","amount":-280000}],"liabilities":[{"accountName":"買掛金","amount":940000},{"accountName":"借入金","amount":800000}],"equity":[{"accountName":"資本金","amount":2800000},{"accountName":"当期純利益","amount":157000}]},"incomeStatement":{"revenues":[{"accountName":"売上高","amount":889000}],"expenses":[{"accountName":"仕入","amount":390000},{"accountName":"水道光熱費","amount":217000},{"accountName":"旅費交通費","amount":147000},{"accountName":"広告宣伝費","amount":181000},{"accountName":"消耗品費","amount":199000},{"accountName":"減価償却費","amount":80000},{"accountName":"貸倒引当金繰入","amount":18000}],"netIncome":157000}}`;

// Q_T_004の修正
console.log("Q_T_004を財務諸表形式に修正...");
const q_t_004_text = `【財務諸表作成問題】\\n\\n2025年9月の期首残高、期中取引および決算整理事項から、貸借対照表と損益計算書を作成してください。\\n\\n【期首残高】\\n現金：1,800,000円\\n売掛金：500,000円\\n商品：450,000円\\n土地：1,000,000円\\n建物：1,200,000円（減価償却累計額：240,000円）\\n買掛金：400,000円\\n借入金：1,500,000円\\n資本金：2,810,000円\\n\\n【期中取引】\\n9月9日 前払金 374,000 / 現金 374,000 （前払金支払）\\n9月10日 商品 245,000 / 買掛金 245,000 （商品仕入）\\n9月21日 借入金 298,000 / 現金 298,000 （借入金返済）\\n9月21日 給料 286,000 / 現金 286,000 （給料支払）\\n9月22日 水道光熱費 217,000 / 現金 217,000 （水道光熱費支払）\\n9月23日 仕入 345,000 / 買掛金 345,000 （商品仕入）\\n9月28日 現金 872,000 / 売上 872,000 （商品売上）\\n\\n【決算整理事項】\\n・貸倒引当金設定：売掛金の2.5%を設定\\n・減価償却：建物60,000円\\n・未払費用計上：給料20,000円\\n・期末商品棚卸高：420,000円\\n\\n【作成指示】\\n1. 決算整理仕訳を行う\\n2. 貸借対照表を作成する\\n3. 損益計算書を作成する`;

const q_t_004_template = `{"type":"financial_statement","balanceSheet":{"assets":["現金","売掛金","商品","前払金","土地","建物","減価償却累計額"],"liabilities":["買掛金","借入金","未払費用","貸倒引当金"],"equity":["資本金","当期純利益"]},"incomeStatement":{"revenues":["売上高"],"expenses":["仕入","給料","水道光熱費","減価償却費","貸倒引当金繰入"]}}`;

const q_t_004_answer = `{"balanceSheet":{"assets":[{"accountName":"現金","amount":1497000},{"accountName":"売掛金","amount":500000},{"accountName":"貸倒引当金","amount":-13000},{"accountName":"商品","amount":420000},{"accountName":"前払金","amount":374000},{"accountName":"土地","amount":1000000},{"accountName":"建物","amount":1200000},{"accountName":"建物減価償却累計額","amount":-300000}],"liabilities":[{"accountName":"買掛金","amount":990000},{"accountName":"借入金","amount":1202000},{"accountName":"未払費用","amount":20000}],"equity":[{"accountName":"資本金","amount":2810000},{"accountName":"当期純利益","amount":256000}]},"incomeStatement":{"revenues":[{"accountName":"売上高","amount":872000}],"expenses":[{"accountName":"仕入","amount":620000},{"accountName":"給料","amount":306000},{"accountName":"水道光熱費","amount":217000},{"accountName":"減価償却費","amount":60000},{"accountName":"貸倒引当金繰入","amount":13000}],"netIncome":256000}}`;

// 1行ずつ処理して正確に置換
const lines = content.split("\n");
let inQT001 = false;
let inQT002 = false;
let inQT003 = false;
let inQT004 = false;

for (let i = 0; i < lines.length; i++) {
  // Q_T_001の検出と修正
  if (lines[i].includes('id: "Q_T_001"')) {
    inQT001 = true;
  }
  if (inQT001 && lines[i].includes("question_text:")) {
    // 次の行から answer_template_json まで置換
    let j = i;
    while (!lines[j].includes("answer_template_json:")) j++;
    lines[i + 1] = `      "${q_t_001_text}",`;
    i = j;
  }
  if (inQT001 && lines[i].includes("answer_template_json:")) {
    lines[i + 1] = `      '${q_t_001_template}',`;
    i++;
  }
  if (inQT001 && lines[i].includes("correct_answer_json:")) {
    lines[i + 1] = `      '${q_t_001_answer}',`;
    i++;
    inQT001 = false;
  }

  // Q_T_002の検出と修正
  if (lines[i].includes('id: "Q_T_002"')) {
    inQT002 = true;
  }
  if (inQT002 && lines[i].includes("question_text:")) {
    let j = i;
    while (!lines[j].includes("answer_template_json:")) j++;
    lines[i + 1] = `      "${q_t_002_text}",`;
    i = j;
  }
  if (inQT002 && lines[i].includes("answer_template_json:")) {
    lines[i + 1] = `      '${financial_template}',`;
    i++;
  }
  if (inQT002 && lines[i].includes("correct_answer_json:")) {
    lines[i + 1] = `      '${q_t_002_answer}',`;
    i++;
    inQT002 = false;
  }

  // Q_T_003の検出と修正
  if (lines[i].includes('id: "Q_T_003"')) {
    inQT003 = true;
  }
  if (inQT003 && lines[i].includes("question_text:")) {
    let j = i;
    while (!lines[j].includes("answer_template_json:")) j++;
    lines[i + 1] = `      "${q_t_003_text}",`;
    i = j;
  }
  if (inQT003 && lines[i].includes("answer_template_json:")) {
    lines[i + 1] = `      '${q_t_003_template}',`;
    i++;
  }
  if (inQT003 && lines[i].includes("correct_answer_json:")) {
    lines[i + 1] = `      '${q_t_003_answer}',`;
    i++;
    inQT003 = false;
  }

  // Q_T_004の検出と修正
  if (lines[i].includes('id: "Q_T_004"')) {
    inQT004 = true;
  }
  if (inQT004 && lines[i].includes("question_text:")) {
    let j = i;
    while (!lines[j].includes("answer_template_json:")) j++;
    lines[i + 1] = `      "${q_t_004_text}",`;
    i = j;
  }
  if (inQT004 && lines[i].includes("answer_template_json:")) {
    lines[i + 1] = `      '${q_t_004_template}',`;
    i++;
  }
  if (inQT004 && lines[i].includes("correct_answer_json:")) {
    lines[i + 1] = `      '${q_t_004_answer}',`;
    i++;
    inQT004 = false;
  }
}

content = lines.join("\n");

// ファイルを保存
fs.writeFileSync(filePath, content);
console.log("✅ 第3問の問題形式修正完了！");

// TypeScript型チェック
console.log("TypeScript型チェック中...");
const { execSync } = require("child_process");
try {
  execSync("npx tsc --noEmit", { stdio: "inherit" });
  console.log("✅ TypeScript型チェック成功！");
} catch (error) {
  console.error("❌ TypeScript型チェック失敗");
}
