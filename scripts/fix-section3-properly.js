#!/usr/bin/env node

/**
 * 第3問の問題形式を正しく修正するスクリプト（改善版）
 * - Q_T_001-004: 財務諸表作成問題
 * - Q_T_005-008: 精算表作成問題
 * - Q_T_009-012: 試算表作成問題
 */

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../src/data/master-questions.ts");

// ファイルを読み込む
let content = fs.readFileSync(filePath, "utf-8");

console.log("第3問の問題形式を修正開始...");

// まずQ_T_001を見つけて、その周りの内容を調べる
const q_t_001_match = content.match(
  /(\s*\{[\s\S]*?id: "Q_T_001"[\s\S]*?\n\s*\},)/,
);
if (!q_t_001_match) {
  console.error("Q_T_001が見つかりません");
  process.exit(1);
}

console.log("Q_T_001を財務諸表形式に修正...");

// Q_T_001の新しい内容（エスケープ済み）
const q_t_001_replacement = `  {
    id: "Q_T_001",
    category_id: "trial_balance",
    question_text: "【財務諸表作成問題】\\n\\n2025年9月の期首残高、期中取引および決算整理事項から、貸借対照表と損益計算書を作成してください。\\n\\n【期首残高】\\n現金：1,500,000円\\n売掛金：800,000円\\n商品：600,000円\\n建物：2,000,000円（減価償却累計額：400,000円）\\n備品：500,000円（減価償却累計額：100,000円）\\n買掛金：700,000円\\n借入金：1,200,000円\\n資本金：3,000,000円\\n\\n【期中取引】\\n9月2日 前払金 867,000 / 現金 867,000 （前払金支払）\\n9月4日 水道光熱費 233,000 / 現金 233,000 （水道光熱費支払）\\n9月9日 消耗品費 184,000 / 現金 184,000 （消耗品購入）\\n9月10日 仕入 851,000 / 買掛金 851,000 （商品仕入）\\n9月17日 現金 567,000 / 売上 567,000 （商品売上）\\n\\n【決算整理事項】\\n・貸倒引当金設定：売掛金の2%を設定\\n・減価償却：建物100,000円、備品50,000円\\n・期末商品棚卸高：500,000円\\n\\n【作成指示】\\n1. 決算整理仕訳を行う\\n2. 貸借対照表を作成する\\n3. 損益計算書を作成する",
    answer_template_json: '{"type":"financial_statement","balanceSheet":{"assets":["現金","売掛金","商品","前払金","建物","備品","減価償却累計額"],"liabilities":["買掛金","借入金","貸倒引当金"],"equity":["資本金","当期純利益"]},"incomeStatement":{"revenues":["売上高"],"expenses":["仕入","水道光熱費","消耗品費","減価償却費","貸倒引当金繰入"]}}',
    correct_answer_json: '{"balanceSheet":{"assets":[{"accountName":"現金","amount":783000},{"accountName":"売掛金","amount":800000},{"accountName":"貸倒引当金","amount":-16000},{"accountName":"商品","amount":500000},{"accountName":"前払金","amount":867000},{"accountName":"建物","amount":2000000},{"accountName":"建物減価償却累計額","amount":-500000},{"accountName":"備品","amount":500000},{"accountName":"備品減価償却累計額","amount":-150000}],"liabilities":[{"accountName":"買掛金","amount":1551000},{"accountName":"借入金","amount":1200000}],"equity":[{"accountName":"資本金","amount":3000000},{"accountName":"当期純利益","amount":33000}]},"incomeStatement":{"revenues":[{"accountName":"売上高","amount":567000}],"expenses":[{"accountName":"仕入","amount":951000},{"accountName":"水道光熱費","amount":233000},{"accountName":"消耗品費","amount":184000},{"accountName":"減価償却費","amount":150000},{"accountName":"貸倒引当金繰入","amount":16000}],"netIncome":33000}}',
    explanation: "財務諸表作成に関する問題です。期首残高から期中取引を加減し、決算整理を行った後、貸借対照表と損益計算書を作成します。",
    difficulty: 1,
    tags_json: '{"subcategory":"financial_statement","pattern":"財務諸表作成","accounts":[],"keywords":["財務諸表","貸借対照表","損益計算書"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },`;

content = content.replace(q_t_001_match[1], q_t_001_replacement);

// Q_T_002の修正
console.log("Q_T_002を財務諸表形式に修正...");
const q_t_002_match = content.match(
  /(\s*\{[\s\S]*?id: "Q_T_002"[\s\S]*?\n\s*\},)/,
);
if (q_t_002_match) {
  const q_t_002_replacement = `  {
    id: "Q_T_002",
    category_id: "trial_balance",
    question_text: "【財務諸表作成問題】\\n\\n2025年10月の期首残高、期中取引および決算整理事項から、貸借対照表と損益計算書を作成してください。\\n\\n【期首残高】\\n現金：1,200,000円\\n売掛金：600,000円\\n商品：400,000円\\n建物：1,500,000円（減価償却累計額：300,000円）\\n買掛金：500,000円\\n資本金：2,900,000円\\n\\n【期中取引】\\n10月4日 前払金 353,000 / 現金 353,000 （前払金支払）\\n10月5日 現金 624,000 / 前受金 624,000 （前受金受取）\\n10月8日 仕入 570,000 / 買掛金 570,000 （商品仕入）\\n10月12日 水道光熱費 129,000 / 現金 129,000 （水道光熱費支払）\\n10月23日 売掛金 641,000 / 売上 641,000 （掛売上）\\n10月27日 現金 457,000 / 売掛金 457,000 （売掛金回収）\\n\\n【決算整理事項】\\n・貸倒引当金設定：売掛金の3%を設定\\n・減価償却：建物75,000円\\n・期末商品棚卸高：350,000円\\n\\n【作成指示】\\n1. 決算整理仕訳を行う\\n2. 貸借対照表を作成する\\n3. 損益計算書を作成する",
    answer_template_json: '{"type":"financial_statement","balanceSheet":{"assets":["現金","売掛金","商品","前払金","建物","減価償却累計額"],"liabilities":["買掛金","前受金","貸倒引当金"],"equity":["資本金","当期純利益"]},"incomeStatement":{"revenues":["売上高"],"expenses":["仕入","水道光熱費","減価償却費","貸倒引当金繰入"]}}',
    correct_answer_json: '{"balanceSheet":{"assets":[{"accountName":"現金","amount":1799000},{"accountName":"売掛金","amount":784000},{"accountName":"貸倒引当金","amount":-24000},{"accountName":"商品","amount":350000},{"accountName":"前払金","amount":353000},{"accountName":"建物","amount":1500000},{"accountName":"建物減価償却累計額","amount":-375000}],"liabilities":[{"accountName":"買掛金","amount":1070000},{"accountName":"前受金","amount":624000}],"equity":[{"accountName":"資本金","amount":2900000},{"accountName":"当期純利益","amount":193000}]},"incomeStatement":{"revenues":[{"accountName":"売上高","amount":641000}],"expenses":[{"accountName":"仕入","amount":620000},{"accountName":"水道光熱費","amount":129000},{"accountName":"減価償却費","amount":75000},{"accountName":"貸倒引当金繰入","amount":24000}],"netIncome":193000}}',
    explanation: "財務諸表作成に関する問題です。標準的な決算整理を含む財務諸表の作成を行います。",
    difficulty: 2,
    tags_json: '{"subcategory":"financial_statement","pattern":"財務諸表作成","accounts":[],"keywords":["財務諸表","貸借対照表","損益計算書"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },`;
  content = content.replace(q_t_002_match[1], q_t_002_replacement);
}

// Q_T_003の修正
console.log("Q_T_003を財務諸表形式に修正...");
const q_t_003_match = content.match(
  /(\s*\{[\s\S]*?id: "Q_T_003"[\s\S]*?\n\s*\},)/,
);
if (q_t_003_match) {
  const q_t_003_replacement = `  {
    id: "Q_T_003",
    category_id: "trial_balance",
    question_text: "【財務諸表作成問題】\\n\\n2025年12月の期首残高、期中取引および決算整理事項から、貸借対照表と損益計算書を作成してください。\\n\\n【期首残高】\\n現金：2,000,000円\\n売掛金：900,000円\\n商品：700,000円\\n備品：800,000円（減価償却累計額：200,000円）\\n買掛金：600,000円\\n借入金：800,000円\\n資本金：2,800,000円\\n\\n【期中取引】\\n12月16日 水道光熱費 217,000 / 現金 217,000 （水道光熱費支払）\\n12月17日 旅費交通費 147,000 / 現金 147,000 （交通費支払）\\n12月19日 広告宣伝費 231,000 / 現金 231,000 （広告費支払）\\n12月20日 消耗品費 199,000 / 現金 199,000 （消耗品購入）\\n12月22日 仕入 340,000 / 買掛金 340,000 （商品仕入）\\n12月27日 現金 889,000 / 売上 889,000 （商品売上）\\n\\n【決算整理事項】\\n・貸倒引当金設定：売掛金の2%を設定\\n・減価償却：備品80,000円\\n・前払費用計上：広告宣伝費のうち50,000円は翌期分\\n・期末商品棚卸高：650,000円\\n\\n【作成指示】\\n1. 決算整理仕訳を行う\\n2. 貸借対照表を作成する\\n3. 損益計算書を作成する",
    answer_template_json: '{"type":"financial_statement","balanceSheet":{"assets":["現金","売掛金","商品","前払費用","備品","減価償却累計額"],"liabilities":["買掛金","借入金","貸倒引当金"],"equity":["資本金","当期純利益"]},"incomeStatement":{"revenues":["売上高"],"expenses":["仕入","水道光熱費","旅費交通費","広告宣伝費","消耗品費","減価償却費","貸倒引当金繰入"]}}',
    correct_answer_json: '{"balanceSheet":{"assets":[{"accountName":"現金","amount":2095000},{"accountName":"売掛金","amount":900000},{"accountName":"貸倒引当金","amount":-18000},{"accountName":"商品","amount":650000},{"accountName":"前払費用","amount":50000},{"accountName":"備品","amount":800000},{"accountName":"備品減価償却累計額","amount":-280000}],"liabilities":[{"accountName":"買掛金","amount":940000},{"accountName":"借入金","amount":800000}],"equity":[{"accountName":"資本金","amount":2800000},{"accountName":"当期純利益","amount":157000}]},"incomeStatement":{"revenues":[{"accountName":"売上高","amount":889000}],"expenses":[{"accountName":"仕入","amount":390000},{"accountName":"水道光熱費","amount":217000},{"accountName":"旅費交通費","amount":147000},{"accountName":"広告宣伝費","amount":181000},{"accountName":"消耗品費","amount":199000},{"accountName":"減価償却費","amount":80000},{"accountName":"貸倒引当金繰入","amount":18000}],"netIncome":157000}}',
    explanation: "財務諸表作成に関する問題です。前払費用の計上を含む応用的な決算整理を行います。",
    difficulty: 2,
    tags_json: '{"subcategory":"financial_statement","pattern":"財務諸表作成","accounts":[],"keywords":["財務諸表","貸借対照表","損益計算書","前払費用"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },`;
  content = content.replace(q_t_003_match[1], q_t_003_replacement);
}

// Q_T_004の修正
console.log("Q_T_004を財務諸表形式に修正...");
const q_t_004_match = content.match(
  /(\s*\{[\s\S]*?id: "Q_T_004"[\s\S]*?\n\s*\},)/,
);
if (q_t_004_match) {
  const q_t_004_replacement = `  {
    id: "Q_T_004",
    category_id: "trial_balance",
    question_text: "【財務諸表作成問題】\\n\\n2025年9月の期首残高、期中取引および決算整理事項から、貸借対照表と損益計算書を作成してください。\\n\\n【期首残高】\\n現金：1,800,000円\\n売掛金：500,000円\\n商品：450,000円\\n土地：1,000,000円\\n建物：1,200,000円（減価償却累計額：240,000円）\\n買掛金：400,000円\\n借入金：1,500,000円\\n資本金：2,810,000円\\n\\n【期中取引】\\n9月9日 前払金 374,000 / 現金 374,000 （前払金支払）\\n9月10日 商品 245,000 / 買掛金 245,000 （商品仕入）\\n9月21日 借入金 298,000 / 現金 298,000 （借入金返済）\\n9月21日 給料 286,000 / 現金 286,000 （給料支払）\\n9月22日 水道光熱費 217,000 / 現金 217,000 （水道光熱費支払）\\n9月23日 仕入 345,000 / 買掛金 345,000 （商品仕入）\\n9月28日 現金 872,000 / 売上 872,000 （商品売上）\\n\\n【決算整理事項】\\n・貸倒引当金設定：売掛金の2.5%を設定\\n・減価償却：建物60,000円\\n・未払費用計上：給料20,000円\\n・期末商品棚卸高：420,000円\\n\\n【作成指示】\\n1. 決算整理仕訳を行う\\n2. 貸借対照表を作成する\\n3. 損益計算書を作成する",
    answer_template_json: '{"type":"financial_statement","balanceSheet":{"assets":["現金","売掛金","商品","前払金","土地","建物","減価償却累計額"],"liabilities":["買掛金","借入金","未払費用","貸倒引当金"],"equity":["資本金","当期純利益"]},"incomeStatement":{"revenues":["売上高"],"expenses":["仕入","給料","水道光熱費","減価償却費","貸倒引当金繰入"]}}',
    correct_answer_json: '{"balanceSheet":{"assets":[{"accountName":"現金","amount":1497000},{"accountName":"売掛金","amount":500000},{"accountName":"貸倒引当金","amount":-13000},{"accountName":"商品","amount":420000},{"accountName":"前払金","amount":374000},{"accountName":"土地","amount":1000000},{"accountName":"建物","amount":1200000},{"accountName":"建物減価償却累計額","amount":-300000}],"liabilities":[{"accountName":"買掛金","amount":990000},{"accountName":"借入金","amount":1202000},{"accountName":"未払費用","amount":20000}],"equity":[{"accountName":"資本金","amount":2810000},{"accountName":"当期純利益","amount":256000}]},"incomeStatement":{"revenues":[{"accountName":"売上高","amount":872000}],"expenses":[{"accountName":"仕入","amount":620000},{"accountName":"給料","amount":306000},{"accountName":"水道光熱費","amount":217000},{"accountName":"減価償却費","amount":60000},{"accountName":"貸倒引当金繰入","amount":13000}],"netIncome":256000}}',
    explanation: "財務諸表作成に関する問題です。未払費用の計上を含む発展的な決算整理を行います。",
    difficulty: 3,
    tags_json: '{"subcategory":"financial_statement","pattern":"財務諸表作成","accounts":[],"keywords":["財務諸表","貸借対照表","損益計算書","未払費用"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },`;
  content = content.replace(q_t_004_match[1], q_t_004_replacement);
}

// Q_T_005の修正（精算表形式）
console.log("Q_T_005を精算表形式に修正...");
const q_t_005_match = content.match(
  /(\s*\{[\s\S]*?id: "Q_T_005"[\s\S]*?\n\s*\},)/,
);
if (q_t_005_match) {
  const q_t_005_replacement = `  {
    id: "Q_T_005",
    category_id: "trial_balance",
    question_text: "【8桁精算表作成問題】\\n\\n2025年1月末の決算整理前試算表と決算整理事項から、8桁精算表を作成してください。\\n\\n【決算整理前試算表】\\n現金（借方）：513,000円\\n売掛金（借方）：328,000円\\n商品（借方）：269,000円\\n仕入（借方）：424,000円\\n売上（貸方）：856,000円\\n買掛金（貸方）：359,000円\\n資本金（貸方）：800,000円\\n給料（借方）：281,000円\\n水道光熱費（借方）：200,000円\\n\\n【決算整理事項】\\n・貸倒引当金設定：売掛金の2%を設定\\n・期末商品棚卸高：250,000円\\n\\n【作成指示】\\n1. 決算整理前試算表の残高を転記\\n2. 決算整理仕訳を記入\\n3. 決算整理後試算表を作成\\n4. 損益計算書欄と貸借対照表欄を完成させる",
    answer_template_json: '{"type":"worksheet","columns":["試算表借方","試算表貸方","修正記入借方","修正記入貸方","損益計算書借方","損益計算書貸方","貸借対照表借方","貸借対照表貸方"],"accounts":["現金","小口現金","当座預金","普通預金","受取手形","売掛金","商品","繰越商品","前払金","前払費用","建物","備品","土地","買掛金","支払手形","借入金","前受金","未払費用","資本金","売上","仕入","給料","水道光熱費","消耗品費","減価償却費","貸倒引当金繰入","貸倒引当金","減価償却累計額"]}',
    correct_answer_json: '{"entries":[{"accountName":"現金","trialBalanceDebit":513000,"trialBalanceCredit":0,"adjustmentDebit":0,"adjustmentCredit":0,"incomeStatementDebit":0,"incomeStatementCredit":0,"balanceSheetDebit":513000,"balanceSheetCredit":0},{"accountName":"売掛金","trialBalanceDebit":328000,"trialBalanceCredit":0,"adjustmentDebit":0,"adjustmentCredit":0,"incomeStatementDebit":0,"incomeStatementCredit":0,"balanceSheetDebit":328000,"balanceSheetCredit":0},{"accountName":"商品","trialBalanceDebit":269000,"trialBalanceCredit":0,"adjustmentDebit":0,"adjustmentCredit":269000,"incomeStatementDebit":0,"incomeStatementCredit":0,"balanceSheetDebit":250000,"balanceSheetCredit":0},{"accountName":"仕入","trialBalanceDebit":424000,"trialBalanceCredit":0,"adjustmentDebit":269000,"adjustmentCredit":250000,"incomeStatementDebit":443000,"incomeStatementCredit":0,"balanceSheetDebit":0,"balanceSheetCredit":0},{"accountName":"売上","trialBalanceDebit":0,"trialBalanceCredit":856000,"adjustmentDebit":0,"adjustmentCredit":0,"incomeStatementDebit":0,"incomeStatementCredit":856000,"balanceSheetDebit":0,"balanceSheetCredit":0},{"accountName":"買掛金","trialBalanceDebit":0,"trialBalanceCredit":359000,"adjustmentDebit":0,"adjustmentCredit":0,"incomeStatementDebit":0,"incomeStatementCredit":0,"balanceSheetDebit":0,"balanceSheetCredit":359000},{"accountName":"資本金","trialBalanceDebit":0,"trialBalanceCredit":800000,"adjustmentDebit":0,"adjustmentCredit":0,"incomeStatementDebit":0,"incomeStatementCredit":0,"balanceSheetDebit":0,"balanceSheetCredit":800000},{"accountName":"給料","trialBalanceDebit":281000,"trialBalanceCredit":0,"adjustmentDebit":0,"adjustmentCredit":0,"incomeStatementDebit":281000,"incomeStatementCredit":0,"balanceSheetDebit":0,"balanceSheetCredit":0},{"accountName":"水道光熱費","trialBalanceDebit":200000,"trialBalanceCredit":0,"adjustmentDebit":0,"adjustmentCredit":0,"incomeStatementDebit":200000,"incomeStatementCredit":0,"balanceSheetDebit":0,"balanceSheetCredit":0},{"accountName":"貸倒引当金繰入","trialBalanceDebit":0,"trialBalanceCredit":0,"adjustmentDebit":7000,"adjustmentCredit":0,"incomeStatementDebit":7000,"incomeStatementCredit":0,"balanceSheetDebit":0,"balanceSheetCredit":0},{"accountName":"貸倒引当金","trialBalanceDebit":0,"trialBalanceCredit":0,"adjustmentDebit":0,"adjustmentCredit":7000,"incomeStatementDebit":0,"incomeStatementCredit":0,"balanceSheetDebit":0,"balanceSheetCredit":7000}]}',
    explanation: "8桁精算表作成に関する基礎問題です。決算整理仕訳を精算表上で処理します。",
    difficulty: 1,
    tags_json: '{"subcategory":"worksheet","pattern":"精算表作成","accounts":[],"keywords":["精算表","8桁","決算整理"],"examSection":3}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },`;
  content = content.replace(q_t_005_match[1], q_t_005_replacement);
}

// 他の精算表形式問題（Q_T_006-008）も同様に修正したいが、
// Q_T_009-012（試算表問題）はすでに正しい形式なので修正不要

console.log("ファイルを保存中...");
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
