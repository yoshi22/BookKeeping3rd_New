#!/usr/bin/env node

/**
 * 第三問（試算表）の包括的修正スクリプト
 * Q_T_001-Q_T_012の問題文と回答フォームを適切な形式に修正
 */

const fs = require("fs");
const path = require("path");

const tsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

console.log("🔧 第三問（Q_T_001〜Q_T_012）を修正中...\n");

// TypeScriptファイルを読み込む
let content = fs.readFileSync(tsFilePath, "utf8");

// 財務諸表作成用テンプレート（Q_T_001-004用）
const financialStatementTemplate = {
  type: "financial_statement",
  sections: [
    {
      name: "balance_sheet",
      label: "貸借対照表",
      columns: [
        { name: "account", label: "科目", type: "text", width: "30%" },
        { name: "amount", label: "金額", type: "number", width: "35%" },
        { name: "total", label: "合計", type: "number", width: "35%" },
      ],
      categories: [
        { label: "【資産の部】", type: "header" },
        { label: "流動資産", type: "subheader" },
        { label: "固定資産", type: "subheader" },
        { label: "資産合計", type: "total" },
        { label: "【負債の部】", type: "header" },
        { label: "流動負債", type: "subheader" },
        { label: "固定負債", type: "subheader" },
        { label: "負債合計", type: "total" },
        { label: "【純資産の部】", type: "header" },
        { label: "純資産合計", type: "total" },
        { label: "負債純資産合計", type: "grand_total" },
      ],
    },
    {
      name: "income_statement",
      label: "損益計算書",
      columns: [
        { name: "account", label: "科目", type: "text", width: "30%" },
        { name: "amount", label: "金額", type: "number", width: "35%" },
        { name: "total", label: "合計", type: "number", width: "35%" },
      ],
      categories: [
        { label: "【売上高】", type: "header" },
        { label: "【売上原価】", type: "header" },
        { label: "売上総利益", type: "subtotal" },
        { label: "【販売費及び一般管理費】", type: "header" },
        { label: "営業利益", type: "subtotal" },
        { label: "【営業外収益】", type: "header" },
        { label: "【営業外費用】", type: "header" },
        { label: "経常利益", type: "subtotal" },
        { label: "【特別利益】", type: "header" },
        { label: "【特別損失】", type: "header" },
        { label: "当期純利益", type: "total" },
      ],
    },
  ],
  allowMultipleEntries: true,
  maxEntries: 30,
};

// 精算表作成用テンプレート（Q_T_005-008用）
const worksheetTemplate = {
  type: "worksheet",
  label: "8桁精算表",
  columns: [
    { name: "account", label: "勘定科目", type: "text", width: "15%" },
    { name: "trial_debit", label: "試算表借方", type: "number", width: "12%" },
    { name: "trial_credit", label: "試算表貸方", type: "number", width: "12%" },
    {
      name: "adjust_debit",
      label: "整理記入借方",
      type: "number",
      width: "12%",
    },
    {
      name: "adjust_credit",
      label: "整理記入貸方",
      type: "number",
      width: "12%",
    },
    { name: "income_debit", label: "損益借方", type: "number", width: "12%" },
    { name: "income_credit", label: "損益貸方", type: "number", width: "12%" },
    { name: "balance_debit", label: "貸借借方", type: "number", width: "12%" },
    { name: "balance_credit", label: "貸借貸方", type: "number", width: "12%" },
  ],
  accounts: [
    "現金",
    "小口現金",
    "当座預金",
    "普通預金",
    "受取手形",
    "売掛金",
    "商品",
    "繰越商品",
    "前払金",
    "前払費用",
    "未収収益",
    "建物",
    "備品",
    "車両運搬具",
    "減価償却累計額",
    "支払手形",
    "買掛金",
    "前受金",
    "前受収益",
    "未払費用",
    "借入金",
    "貸倒引当金",
    "資本金",
    "売上",
    "仕入",
    "給料",
    "家賃",
    "水道光熱費",
    "通信費",
    "消耗品費",
    "広告宣伝費",
    "旅費交通費",
    "支払利息",
    "受取利息",
    "貸倒引当金繰入",
    "減価償却費",
    "雑益",
    "雑損",
  ],
  totals: true,
  allowMultipleEntries: true,
  maxEntries: 40,
};

// 試算表作成用テンプレート（Q_T_009-012用）
const trialBalanceTemplate = {
  type: "trial_balance",
  label: "合計試算表",
  columns: [
    { name: "account", label: "勘定科目", type: "text", width: "25%" },
    { name: "debit_total", label: "借方合計", type: "number", width: "25%" },
    { name: "credit_total", label: "貸方合計", type: "number", width: "25%" },
    { name: "balance", label: "残高", type: "number", width: "25%" },
  ],
  accounts: [
    "現金",
    "小口現金",
    "当座預金",
    "普通預金",
    "受取手形",
    "売掛金",
    "商品",
    "繰越商品",
    "前払金",
    "前払費用",
    "建物",
    "備品",
    "車両運搬具",
    "支払手形",
    "買掛金",
    "前受金",
    "前受収益",
    "未払費用",
    "借入金",
    "資本金",
    "売上",
    "仕入",
    "給料",
    "家賃",
    "水道光熱費",
    "通信費",
    "消耗品費",
    "広告宣伝費",
    "旅費交通費",
    "支払利息",
    "受取利息",
    "雑益",
    "雑損",
  ],
  showTotals: true,
  balanceType: "total", // "total" for 合計試算表, "balance" for 残高試算表
  allowMultipleEntries: true,
  maxEntries: 35,
};

// 修正対象の問題
const updates = [
  // パターン1: 財務諸表作成（Q_T_001-004）
  {
    id: "Q_T_001",
    template: financialStatementTemplate,
    correctAnswer: {
      balance_sheet: {
        assets: {
          current: { cash: 500000, accounts_receivable: 300000 },
          fixed: { buildings: 1000000, accumulated_depreciation: -331000 },
          total: 1469000,
        },
        liabilities: {
          current: { accounts_payable: 851000 },
          total: 851000,
        },
        equity: {
          capital: 618000,
          total: 618000,
        },
        total: 1469000,
      },
      income_statement: {
        sales: 167000,
        cost_of_sales: 851000,
        gross_profit: -684000,
        operating_expenses: {
          utilities: 833000,
          supplies: 384000,
          depreciation: 331000,
          bad_debt: 934000,
        },
        operating_income: -3166000,
        net_income: -3166000,
      },
    },
  },
  {
    id: "Q_T_002",
    template: financialStatementTemplate,
    correctAnswer: {
      balance_sheet: {
        assets: {
          current: {
            cash: 850000,
            accounts_receivable: 84000,
            merchandise: 806000,
          },
          fixed: { equipment: 800000, accumulated_depreciation: -386000 },
          total: 2154000,
        },
        liabilities: {
          current: { accounts_payable: 1776000, unearned_revenue: 624000 },
          total: 2400000,
        },
        equity: {
          capital: 757000,
          retained_earnings: -1003000,
          total: -246000,
        },
        total: 2154000,
      },
      income_statement: {
        sales: 941000,
        cost_of_sales: 1776000,
        gross_profit: -835000,
        operating_expenses: {
          utilities: 229000,
          depreciation: 386000,
          bad_debt: 590000,
        },
        operating_income: -2040000,
        net_income: -2040000,
      },
    },
  },
  {
    id: "Q_T_003",
    template: financialStatementTemplate,
    correctAnswer: {
      balance_sheet: {
        assets: {
          current: { cash: -100000, prepaid_expenses: 341000 },
          fixed: { equipment: 600000, accumulated_depreciation: -426000 },
          total: 415000,
        },
        liabilities: {
          current: { accounts_payable: 140000 },
          total: 140000,
        },
        equity: {
          retained_earnings: 275000,
          total: 275000,
        },
        total: 415000,
      },
      income_statement: {
        sales: 0,
        cost_of_sales: 140000,
        gross_profit: -140000,
        operating_expenses: {
          utilities: 1349000,
          travel: 847000,
          advertising: 1656000,
          supplies: 399000,
          insurance: -341000,
          depreciation: 426000,
          bad_debt: 185000,
        },
        operating_income: -4661000,
        net_income: -4661000,
      },
    },
  },
  {
    id: "Q_T_004",
    template: financialStatementTemplate,
    correctAnswer: {
      balance_sheet: {
        assets: {
          current: {
            cash: -300000,
            prepaid_expenses: 104000,
            merchandise: 245000,
          },
          fixed: { equipment: 900000, accumulated_depreciation: -818000 },
          total: 131000,
        },
        liabilities: {
          current: { accounts_payable: 890000, unearned_revenue: 372000 },
          total: 1262000,
        },
        equity: {
          capital: 214000,
          retained_earnings: -1345000,
          total: -1131000,
        },
        total: 131000,
      },
      income_statement: {
        sales: 0,
        cost_of_sales: 890000,
        gross_profit: -890000,
        operating_expenses: {
          utilities: 917000,
          salaries: 786000,
          insurance: -104000,
          depreciation: 818000,
          bad_debt: 630000,
        },
        operating_income: -3937000,
        net_income: -3937000,
      },
    },
  },

  // パターン2: 精算表作成（Q_T_005-008）
  {
    id: "Q_T_005",
    template: worksheetTemplate,
    correctAnswer: {
      worksheet: {
        accounts: [
          {
            name: "現金",
            trial_debit: 213000,
            trial_credit: 0,
            balance_debit: 213000,
          },
          {
            name: "小口現金",
            trial_debit: 0,
            trial_credit: 311000,
            balance_credit: 311000,
          },
          {
            name: "当座預金",
            trial_debit: 0,
            trial_credit: 399000,
            balance_credit: 399000,
          },
          {
            name: "普通預金",
            trial_debit: 0,
            trial_credit: 471000,
            balance_credit: 471000,
          },
          {
            name: "受取手形",
            trial_debit: 0,
            trial_credit: 697000,
            balance_credit: 697000,
          },
          {
            name: "売掛金",
            trial_debit: 528000,
            trial_credit: 0,
            balance_debit: 528000,
          },
          {
            name: "商品",
            trial_debit: 369000,
            trial_credit: 0,
            balance_debit: 369000,
          },
          {
            name: "繰越商品",
            trial_debit: 0,
            trial_credit: 433000,
            balance_credit: 433000,
          },
          {
            name: "仕入",
            trial_debit: 324000,
            trial_credit: 0,
            income_debit: 324000,
          },
          {
            name: "売上",
            trial_debit: 0,
            trial_credit: 156000,
            income_credit: 156000,
          },
          {
            name: "支払手形",
            trial_debit: 0,
            trial_credit: 149000,
            balance_credit: 149000,
          },
          {
            name: "買掛金",
            trial_debit: 0,
            trial_credit: 759000,
            balance_credit: 759000,
          },
          {
            name: "貸倒引当金繰入",
            adjust_debit: 935000,
            income_debit: 935000,
          },
          { name: "貸倒引当金", adjust_credit: 935000, balance_credit: 935000 },
          { name: "減価償却費", adjust_debit: 268000, income_debit: 268000 },
          {
            name: "減価償却累計額",
            adjust_credit: 268000,
            balance_credit: 268000,
          },
        ],
        totals: {
          trial: { debit: 1434000, credit: 3222000 },
          adjustments: { debit: 1203000, credit: 1203000 },
          income: { debit: 1527000, credit: 156000 },
          balance: { debit: 1110000, credit: 4425000 },
        },
      },
    },
  },
  {
    id: "Q_T_006",
    template: worksheetTemplate,
    correctAnswer: {
      worksheet: {
        accounts: [
          {
            name: "現金",
            trial_debit: 680000,
            trial_credit: 0,
            balance_debit: 680000,
          },
          {
            name: "小口現金",
            trial_debit: 0,
            trial_credit: 423000,
            balance_credit: 423000,
          },
          {
            name: "当座預金",
            trial_debit: 0,
            trial_credit: 854000,
            balance_credit: 854000,
          },
          {
            name: "普通預金",
            trial_debit: 0,
            trial_credit: 344000,
            balance_credit: 344000,
          },
          {
            name: "受取手形",
            trial_debit: 0,
            trial_credit: 382000,
            balance_credit: 382000,
          },
          {
            name: "売掛金",
            trial_debit: 943000,
            trial_credit: 0,
            balance_debit: 943000,
          },
          {
            name: "商品",
            trial_debit: 953000,
            trial_credit: 0,
            balance_debit: 953000,
          },
          {
            name: "繰越商品",
            trial_debit: 0,
            trial_credit: 447000,
            balance_credit: 447000,
          },
          {
            name: "仕入",
            trial_debit: 241000,
            trial_credit: 0,
            income_debit: 241000,
          },
          {
            name: "売上",
            trial_debit: 0,
            trial_credit: 933000,
            income_credit: 933000,
          },
          {
            name: "支払手形",
            trial_debit: 0,
            trial_credit: 488000,
            balance_credit: 488000,
          },
          {
            name: "買掛金",
            trial_debit: 0,
            trial_credit: 565000,
            balance_credit: 565000,
          },
          { name: "前払費用", adjust_debit: 875000, balance_debit: 875000 },
          { name: "保険料", adjust_credit: 875000, income_credit: 875000 },
          {
            name: "貸倒引当金繰入",
            adjust_debit: 728000,
            income_debit: 728000,
          },
          { name: "貸倒引当金", adjust_credit: 728000, balance_credit: 728000 },
          { name: "減価償却費", adjust_debit: 536000, income_debit: 536000 },
          {
            name: "減価償却累計額",
            adjust_credit: 536000,
            balance_credit: 536000,
          },
        ],
        totals: {
          trial: { debit: 2817000, credit: 4436000 },
          adjustments: { debit: 2139000, credit: 2139000 },
          income: { debit: 1505000, credit: 1808000 },
          balance: { debit: 3451000, credit: 4470000 },
        },
      },
    },
  },
  {
    id: "Q_T_007",
    template: worksheetTemplate,
    correctAnswer: {
      worksheet: {
        accounts: [
          {
            name: "現金",
            trial_debit: 992000,
            trial_credit: 0,
            balance_debit: 992000,
          },
          {
            name: "小口現金",
            trial_debit: 0,
            trial_credit: 488000,
            balance_credit: 488000,
          },
          {
            name: "当座預金",
            trial_debit: 0,
            trial_credit: 242000,
            balance_credit: 242000,
          },
          {
            name: "普通預金",
            trial_debit: 0,
            trial_credit: 979000,
            balance_credit: 979000,
          },
          {
            name: "受取手形",
            trial_debit: 0,
            trial_credit: 854000,
            balance_credit: 854000,
          },
          {
            name: "売掛金",
            trial_debit: 841000,
            trial_credit: 0,
            balance_debit: 841000,
          },
          {
            name: "商品",
            trial_debit: 594000,
            trial_credit: 0,
            balance_debit: 594000,
          },
          {
            name: "繰越商品",
            trial_debit: 0,
            trial_credit: 960000,
            balance_credit: 960000,
          },
          {
            name: "仕入",
            trial_debit: 650000,
            trial_credit: 0,
            income_debit: 650000,
          },
          {
            name: "売上",
            trial_debit: 0,
            trial_credit: 363000,
            income_credit: 363000,
          },
          {
            name: "支払手形",
            trial_debit: 0,
            trial_credit: 540000,
            balance_credit: 540000,
          },
          {
            name: "買掛金",
            trial_debit: 0,
            trial_credit: 679000,
            balance_credit: 679000,
          },
          { name: "前払費用", adjust_debit: 153000, balance_debit: 153000 },
          { name: "保険料", adjust_credit: 153000, income_credit: 153000 },
          {
            name: "貸倒引当金繰入",
            adjust_debit: 947000,
            income_debit: 947000,
          },
          { name: "貸倒引当金", adjust_credit: 947000, balance_credit: 947000 },
          { name: "減価償却費", adjust_debit: 744000, income_debit: 744000 },
          {
            name: "減価償却累計額",
            adjust_credit: 744000,
            balance_credit: 744000,
          },
        ],
        totals: {
          trial: { debit: 3077000, credit: 5105000 },
          adjustments: { debit: 1844000, credit: 1844000 },
          income: { debit: 2341000, credit: 516000 },
          balance: { debit: 2580000, credit: 6433000 },
        },
      },
    },
  },
  {
    id: "Q_T_008",
    template: worksheetTemplate,
    correctAnswer: {
      worksheet: {
        accounts: [
          {
            name: "現金",
            trial_debit: 863000,
            trial_credit: 0,
            balance_debit: 863000,
          },
          {
            name: "小口現金",
            trial_debit: 0,
            trial_credit: 875000,
            balance_credit: 875000,
          },
          {
            name: "当座預金",
            trial_debit: 0,
            trial_credit: 508000,
            balance_credit: 508000,
          },
          {
            name: "普通預金",
            trial_debit: 0,
            trial_credit: 488000,
            balance_credit: 488000,
          },
          {
            name: "受取手形",
            trial_debit: 0,
            trial_credit: 310000,
            balance_credit: 310000,
          },
          {
            name: "売掛金",
            trial_debit: 797000,
            trial_credit: 0,
            balance_debit: 797000,
          },
          {
            name: "商品",
            trial_debit: 977000,
            trial_credit: 0,
            balance_debit: 977000,
          },
          {
            name: "繰越商品",
            trial_debit: 0,
            trial_credit: 328000,
            balance_credit: 328000,
          },
          {
            name: "仕入",
            trial_debit: 636000,
            trial_credit: 0,
            income_debit: 636000,
          },
          {
            name: "売上",
            trial_debit: 0,
            trial_credit: 624000,
            income_credit: 624000,
          },
          {
            name: "支払手形",
            trial_debit: 0,
            trial_credit: 741000,
            balance_credit: 741000,
          },
          {
            name: "買掛金",
            trial_debit: 0,
            trial_credit: 972000,
            balance_credit: 972000,
          },
          { name: "前払費用", adjust_debit: 263000, balance_debit: 263000 },
          { name: "保険料", adjust_credit: 263000, income_credit: 263000 },
          {
            name: "貸倒引当金繰入",
            adjust_debit: 693000,
            income_debit: 693000,
          },
          { name: "貸倒引当金", adjust_credit: 693000, balance_credit: 693000 },
          { name: "減価償却費", adjust_debit: 178000, income_debit: 178000 },
          {
            name: "減価償却累計額",
            adjust_credit: 178000,
            balance_credit: 178000,
          },
        ],
        totals: {
          trial: { debit: 3273000, credit: 4646000 },
          adjustments: { debit: 1134000, credit: 1134000 },
          income: { debit: 1507000, credit: 887000 },
          balance: { debit: 2900000, credit: 5018000 },
        },
      },
    },
  },

  // パターン3: 試算表作成（Q_T_009-012）
  {
    id: "Q_T_009",
    template: trialBalanceTemplate,
    correctAnswer: {
      trial_balance: {
        accounts: [
          {
            name: "現金",
            debit_total: 1524000,
            credit_total: 2378000,
            balance: -854000,
          },
          {
            name: "商品",
            debit_total: 151000,
            credit_total: 0,
            balance: 151000,
          },
          {
            name: "売掛金",
            debit_total: 1064000,
            credit_total: 0,
            balance: 1064000,
          },
          {
            name: "買掛金",
            debit_total: 461000,
            credit_total: 1721000,
            balance: -1260000,
          },
          {
            name: "資本金",
            debit_total: 0,
            credit_total: 796000,
            balance: -796000,
          },
          {
            name: "借入金",
            debit_total: 663000,
            credit_total: 414000,
            balance: 249000,
          },
          {
            name: "売上",
            debit_total: 0,
            credit_total: 996000,
            balance: -996000,
          },
          {
            name: "仕入",
            debit_total: 923000,
            credit_total: 0,
            balance: 923000,
          },
          {
            name: "前払金",
            debit_total: 274000,
            credit_total: 0,
            balance: 274000,
          },
          {
            name: "前受金",
            debit_total: 0,
            credit_total: 705000,
            balance: -705000,
          },
          {
            name: "給料",
            debit_total: 784000,
            credit_total: 0,
            balance: 784000,
          },
          {
            name: "水道光熱費",
            debit_total: 196000,
            credit_total: 0,
            balance: 196000,
          },
        ],
        totals: {
          debit: 5578000,
          credit: 6010000,
          difference: -432000,
        },
      },
    },
  },
  {
    id: "Q_T_010",
    template: trialBalanceTemplate,
    correctAnswer: {
      trial_balance: {
        accounts: [
          {
            name: "現金",
            debit_total: 3825000,
            credit_total: 4017000,
            balance: -192000,
          },
          {
            name: "商品",
            debit_total: 283000,
            credit_total: 0,
            balance: 283000,
          },
          {
            name: "売掛金",
            debit_total: 727000,
            credit_total: 445000,
            balance: 282000,
          },
          {
            name: "買掛金",
            debit_total: 0,
            credit_total: 2247000,
            balance: -2247000,
          },
          {
            name: "資本金",
            debit_total: 0,
            credit_total: 476000,
            balance: -476000,
          },
          {
            name: "借入金",
            debit_total: 932000,
            credit_total: 1500000,
            balance: -568000,
          },
          {
            name: "売上",
            debit_total: 0,
            credit_total: 504000,
            balance: -504000,
          },
          {
            name: "仕入",
            debit_total: 1929000,
            credit_total: 0,
            balance: 1929000,
          },
          {
            name: "通信費",
            debit_total: 628000,
            credit_total: 0,
            balance: 628000,
          },
          {
            name: "消耗品費",
            debit_total: 624000,
            credit_total: 0,
            balance: 624000,
          },
          {
            name: "広告宣伝費",
            debit_total: 933000,
            credit_total: 0,
            balance: 933000,
          },
        ],
        totals: {
          debit: 9881000,
          credit: 9189000,
          difference: 692000,
        },
      },
    },
  },
  {
    id: "Q_T_011",
    template: trialBalanceTemplate,
    correctAnswer: {
      trial_balance: {
        accounts: [
          {
            name: "現金",
            debit_total: 1193000,
            credit_total: 4802000,
            balance: -3609000,
          },
          {
            name: "商品",
            debit_total: 282000,
            credit_total: 0,
            balance: 282000,
          },
          {
            name: "売掛金",
            debit_total: 794000,
            credit_total: 0,
            balance: 794000,
          },
          {
            name: "買掛金",
            debit_total: 809000,
            credit_total: 624000,
            balance: 185000,
          },
          {
            name: "資本金",
            debit_total: 0,
            credit_total: 264000,
            balance: -264000,
          },
          {
            name: "売上",
            debit_total: 0,
            credit_total: 736000,
            balance: -736000,
          },
          {
            name: "前払金",
            debit_total: 772000,
            credit_total: 0,
            balance: 772000,
          },
          {
            name: "前受金",
            debit_total: 0,
            credit_total: 383000,
            balance: -383000,
          },
          {
            name: "通信費",
            debit_total: 743000,
            credit_total: 0,
            balance: 743000,
          },
          {
            name: "消耗品費",
            debit_total: 1343000,
            credit_total: 0,
            balance: 1343000,
          },
          {
            name: "旅費交通費",
            debit_total: 401000,
            credit_total: 0,
            balance: 401000,
          },
        ],
        totals: {
          debit: 6337000,
          credit: 6809000,
          difference: -472000,
        },
      },
    },
  },
  {
    id: "Q_T_012",
    template: trialBalanceTemplate,
    correctAnswer: {
      trial_balance: {
        accounts: [
          {
            name: "現金",
            debit_total: 2294000,
            credit_total: 5383000,
            balance: -3089000,
          },
          {
            name: "商品",
            debit_total: 606000,
            credit_total: 0,
            balance: 606000,
          },
          {
            name: "売掛金",
            debit_total: 167000,
            credit_total: 1587000,
            balance: -1420000,
          },
          {
            name: "買掛金",
            debit_total: 0,
            credit_total: 1108000,
            balance: -1108000,
          },
          {
            name: "資本金",
            debit_total: 0,
            credit_total: 919000,
            balance: -919000,
          },
          {
            name: "借入金",
            debit_total: 1629000,
            credit_total: 0,
            balance: 1629000,
          },
          {
            name: "給料",
            debit_total: 1408000,
            credit_total: 0,
            balance: 1408000,
          },
          {
            name: "水道光熱費",
            debit_total: 619000,
            credit_total: 0,
            balance: 619000,
          },
          {
            name: "消耗品費",
            debit_total: 392000,
            credit_total: 0,
            balance: 392000,
          },
          {
            name: "家賃",
            debit_total: 493000,
            credit_total: 0,
            balance: 493000,
          },
        ],
        totals: {
          debit: 7608000,
          credit: 8997000,
          difference: -1389000,
        },
      },
    },
  },
];

// 各問題を更新
updates.forEach((update) => {
  const regex = new RegExp(
    `("id":\\s*"${update.id}"[^}]*?"answer_template_json":\\s*")([^"]*?)(")`,
  );

  const templateJson = JSON.stringify(update.template).replace(/"/g, '\\"');

  content = content.replace(regex, (match, p1, p2, p3) => {
    console.log(`✅ ${update.id} のテンプレートを更新`);
    return p1 + templateJson + p3;
  });

  // 正解データも更新
  const answerRegex = new RegExp(
    `("id":\\s*"${update.id}"[^}]*?"correct_answer_json":\\s*")([^"]*?)(")`,
  );

  const answerJson = JSON.stringify(update.correctAnswer).replace(/"/g, '\\"');

  content = content.replace(answerRegex, (match, p1, p2, p3) => {
    console.log(`✅ ${update.id} の正解データを更新`);
    return p1 + answerJson + p3;
  });
});

// ファイル保存
fs.writeFileSync(tsFilePath, content, "utf8");

console.log("\n✅ 第三問の修正が完了しました！");
console.log("  - Q_T_001-004: 財務諸表作成テンプレート");
console.log("  - Q_T_005-008: 精算表作成テンプレート");
console.log("  - Q_T_009-012: 試算表作成テンプレート");
