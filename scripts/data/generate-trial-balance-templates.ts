/**
 * Q_T_007-012試算表テンプレート生成スクリプト
 * Q_T_007-008: 8桁精算表、Q_T_009-012: 合計試算表
 */

import * as fs from "fs";
import * as path from "path";
import type { CBTAnswerTemplate } from "../../src/types/models";

interface TemplateData {
  questionId: string;
  template: CBTAnswerTemplate;
}

// テンプレート生成の設定
const TRIAL_BALANCE_CONFIG = {
  // Q_T_007-008: 8桁精算表テンプレート
  extended_trial_balance: {
    range: { start: 7, end: 8 },
    template_type: "extended_trial_balance" as const,
    variants: ["8digit_worksheet", "8digit_worksheet_alt"],
  },
  // Q_T_009-012: 合計試算表テンプレート
  total_trial_balance: {
    range: { start: 9, end: 12 },
    template_type: "total_trial_balance" as const,
    variants: ["total_balance", "total_balance_alt"],
  },
};

// 基本的な勘定科目リスト
const BASE_ACCOUNT_LISTS = {
  cash_bank: ["現金", "小口現金", "普通預金", "当座預金", "定期預金"],
  receivables: ["売掛金", "受取手形", "貸付金", "前払金", "立替金"],
  inventory: ["商品", "繰越商品", "製品", "原材料", "仕掛品"],
  fixed_assets: ["建物", "土地", "車両", "備品", "ソフトウェア"],
  payables: ["買掛金", "支払手形", "借入金", "未払金", "預り金"],
  capital: ["資本金", "利益剰余金", "繰越利益剰余金"],
  revenue: ["売上", "受取利息", "受取配当金", "雑収入"],
  expenses: [
    "仕入",
    "給料",
    "家賃",
    "水道光熱費",
    "通信費",
    "交通費",
    "消耗品費",
    "広告宣伝費",
  ],
  adjustments: ["貸倒引当金", "減価償却累計額", "前払費用", "未払費用"],
};

// 8桁精算表テンプレート生成
function generateExtendedTrialBalanceTemplate(
  questionNumber: number,
  variant: string,
): CBTAnswerTemplate {
  return {
    template_type: "extended_trial_balance",
    layout_variant: variant,
    allowed_accounts: [
      ...BASE_ACCOUNT_LISTS.cash_bank,
      ...BASE_ACCOUNT_LISTS.receivables,
      ...BASE_ACCOUNT_LISTS.inventory,
      ...BASE_ACCOUNT_LISTS.fixed_assets,
      ...BASE_ACCOUNT_LISTS.payables,
      ...BASE_ACCOUNT_LISTS.capital,
      ...BASE_ACCOUNT_LISTS.revenue,
      ...BASE_ACCOUNT_LISTS.expenses,
      ...BASE_ACCOUNT_LISTS.adjustments,
    ],
    rows: [
      // 勘定科目行を動的に生成
      ...Array.from({ length: 20 }, (_, i) => ({
        row_id: `account_${i + 1}`,
        label: `勘定科目${i + 1}`,
        locked: false,
      })),
    ],
    columns: [
      {
        key: "account_name",
        label: "勘定科目",
        input: "dropdown" as const,
        width: 160,
        options_ref: "allowed_accounts",
        required: true,
      },
      // 決算整理前試算表
      {
        key: "trial_balance_debit",
        label: "借方",
        input: "currency" as const,
        width: 120,
        group: "trial_balance",
      },
      {
        key: "trial_balance_credit",
        label: "貸方",
        input: "currency" as const,
        width: 120,
        group: "trial_balance",
      },
      // 決算整理仕訳
      {
        key: "adjustment_debit",
        label: "借方",
        input: "currency" as const,
        width: 120,
        group: "adjustment",
      },
      {
        key: "adjustment_credit",
        label: "貸方",
        input: "currency" as const,
        width: 120,
        group: "adjustment",
      },
      // 損益計算書
      {
        key: "pl_debit",
        label: "借方",
        input: "computed" as const,
        width: 120,
        group: "profit_loss",
        formula: "pl_debit_calc",
      },
      {
        key: "pl_credit",
        label: "貸方",
        input: "computed" as const,
        width: 120,
        group: "profit_loss",
        formula: "pl_credit_calc",
      },
      // 貸借対照表
      {
        key: "bs_debit",
        label: "借方",
        input: "computed" as const,
        width: 120,
        group: "balance_sheet",
        formula: "bs_debit_calc",
      },
      {
        key: "bs_credit",
        label: "貸方",
        input: "computed" as const,
        width: 120,
        group: "balance_sheet",
        formula: "bs_credit_calc",
      },
    ],
    guidance: [
      {
        stage: 1,
        title: "決算整理前試算表の転記",
        body: "問題文から各勘定科目の残高を決算整理前試算表欄に転記します。",
      },
      {
        stage: 2,
        title: "決算整理仕訳の記入",
        body: "決算整理事項に基づいて、該当する勘定科目に調整額を記入します。",
      },
      {
        stage: 3,
        title: "損益・貸借の自動計算確認",
        body: "損益計算書欄と貸借対照表欄の金額が自動計算されることを確認します。",
      },
    ],
    max_rows: 25,
    auto_calculate: true,
    validation_rules: [
      "required_fields",
      "column_balance_check",
      "pl_bs_balance",
    ],
  };
}

// 合計試算表テンプレート生成
function generateTotalTrialBalanceTemplate(
  questionNumber: number,
  variant: string,
): CBTAnswerTemplate {
  return {
    template_type: "total_trial_balance",
    layout_variant: variant,
    allowed_accounts: [
      ...BASE_ACCOUNT_LISTS.cash_bank,
      ...BASE_ACCOUNT_LISTS.receivables,
      ...BASE_ACCOUNT_LISTS.inventory,
      ...BASE_ACCOUNT_LISTS.fixed_assets,
      ...BASE_ACCOUNT_LISTS.payables,
      ...BASE_ACCOUNT_LISTS.capital,
      ...BASE_ACCOUNT_LISTS.revenue,
      ...BASE_ACCOUNT_LISTS.expenses,
    ],
    rows: [
      // 勘定科目行を動的に生成
      ...Array.from({ length: 15 }, (_, i) => ({
        row_id: `account_${i + 1}`,
        label: `勘定科目${i + 1}`,
        locked: false,
      })),
      // 合計行
      {
        row_id: "total_row",
        label: "合計",
        locked: true,
      },
    ],
    columns: [
      {
        key: "account_name",
        label: "勘定科目",
        input: "dropdown" as const,
        width: 160,
        options_ref: "allowed_accounts",
        required: true,
      },
      {
        key: "debit_total",
        label: "借方合計",
        input: "currency" as const,
        width: 140,
        required: true,
      },
      {
        key: "credit_total",
        label: "貸方合計",
        input: "currency" as const,
        width: 140,
        required: true,
      },
      {
        key: "balance_debit",
        label: "差引残高（借方）",
        input: "computed" as const,
        width: 140,
        formula: "balance_debit_calc",
      },
      {
        key: "balance_credit",
        label: "差引残高（貸方）",
        input: "computed" as const,
        width: 140,
        formula: "balance_credit_calc",
      },
    ],
    guidance: [
      {
        stage: 1,
        title: "期首残高の確認",
        body: "各勘定科目の期首残高を確認し、取引による変動を把握します。",
      },
      {
        stage: 2,
        title: "合計額の計算",
        body: "各勘定科目の借方合計・貸方合計を期首残高と期中取引から計算します。",
      },
      {
        stage: 3,
        title: "残高の算出・検証",
        body: "差引残高を算出し、借方合計と貸方合計が一致することを確認します。",
      },
    ],
    max_rows: 20,
    auto_calculate: true,
    validation_rules: [
      "required_fields",
      "total_balance_check",
      "debit_credit_match",
    ],
  };
}

// 試算表テンプレート生成メイン関数
function generateTrialBalanceTemplates(): TemplateData[] {
  const templates: TemplateData[] = [];

  // Q_T_007-008: 8桁精算表テンプレート
  const { extended_trial_balance } = TRIAL_BALANCE_CONFIG;
  for (
    let i = extended_trial_balance.range.start;
    i <= extended_trial_balance.range.end;
    i++
  ) {
    const variantIndex =
      (i - extended_trial_balance.range.start) %
      extended_trial_balance.variants.length;
    const variant = extended_trial_balance.variants[variantIndex];

    templates.push({
      questionId: `Q_T_${i.toString().padStart(3, "0")}`,
      template: generateExtendedTrialBalanceTemplate(i, variant),
    });
  }

  // Q_T_009-012: 合計試算表テンプレート
  const { total_trial_balance } = TRIAL_BALANCE_CONFIG;
  for (
    let i = total_trial_balance.range.start;
    i <= total_trial_balance.range.end;
    i++
  ) {
    const variantIndex =
      (i - total_trial_balance.range.start) %
      total_trial_balance.variants.length;
    const variant = total_trial_balance.variants[variantIndex];

    templates.push({
      questionId: `Q_T_${i.toString().padStart(3, "0")}`,
      template: generateTotalTrialBalanceTemplate(i, variant),
    });
  }

  return templates;
}

// メイン実行関数
async function main(): Promise<void> {
  console.log("🔄 Q_T_007-012試算表テンプレート生成を開始します...");

  try {
    // 試算表テンプレート生成
    const trialBalanceTemplates = generateTrialBalanceTemplates();
    console.log(`📋 生成完了: ${trialBalanceTemplates.length}個のテンプレート`);

    // テンプレート種別統計
    const templateStats = trialBalanceTemplates.reduce(
      (acc, { template }) => {
        acc[template.template_type] = (acc[template.template_type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    console.log(`\n📈 テンプレート種別統計:`);
    Object.entries(templateStats).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}問`);
    });

    // JSON出力
    const outputPath = path.join(__dirname, "trial-balance-templates.json");
    fs.writeFileSync(
      outputPath,
      JSON.stringify(trialBalanceTemplates, null, 2),
      "utf-8",
    );
    console.log(`💾 出力完了: ${path.basename(outputPath)}`);

    console.log(`\n🎉 Q_T_007-012試算表テンプレート生成完了!`);
    console.log(`📊 詳細:`);
    console.log(`  - Q_T_007-008: 8桁精算表テンプレート (2問)`);
    console.log(`  - Q_T_009-012: 合計試算表テンプレート (4問)`);
    console.log(`  - 合計: 6問`);
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    throw error;
  }
}

// 実行
if (require.main === module) {
  main().catch(console.error);
}

export { generateTrialBalanceTemplates };
