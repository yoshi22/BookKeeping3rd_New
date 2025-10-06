/**
 * Phase B CBTテンプレート生成スクリプト
 * Q_L_011-040の30問に対するCBTテンプレート生成
 */

import * as fs from "fs";
import * as path from "path";
import type { CBTAnswerTemplate } from "../../src/types/models";

interface TemplateData {
  questionId: string;
  template: CBTAnswerTemplate;
}

// テンプレート生成の設定
const PHASE_B_CONFIG = {
  // Q_L_011-020: 補助元帳テンプレート（顧客・仕入先別）
  subsidiary_ledger: {
    range: { start: 11, end: 20 },
    template_type: "subsidiary_ledger" as const,
    variants: ["customer", "supplier"],
  },
  // Q_L_021-030: 伝票テンプレート（仕訳・入金・出金・振替）
  voucher: {
    range: { start: 21, end: 30 },
    template_type: "voucher" as const,
    variants: ["journal", "receipt", "payment", "transfer"],
  },
  // Q_L_031-040: 一般元帳テンプレート（レイアウトバリエーション）
  general_ledger_extended: {
    range: { start: 31, end: 40 },
    template_type: "general_ledger" as const,
    variants: ["ledger_B", "ledger_C", "ledger_D"],
  },
};

// 基本的な勘定科目リスト
const BASE_ACCOUNT_LISTS = {
  cash_bank: ["現金", "普通預金", "当座預金", "定期預金", "現金過不足"],
  receivables: ["売掛金", "受取手形", "貸付金", "前払金", "立替金"],
  inventory: ["商品", "製品", "原材料", "仕掛品", "貯蔵品"],
  fixed_assets: ["建物", "土地", "車両", "備品", "ソフトウェア"],
  payables: ["買掛金", "支払手形", "借入金", "未払金", "預り金"],
  revenue: ["売上", "受取利息", "受取配当金", "雑収入"],
  expenses: ["仕入", "給料", "家賃", "水道光熱費", "通信費", "交通費"],
};

// 補助元帳テンプレート生成
function generateSubsidiaryLedgerTemplate(
  questionNumber: number,
  variant: string,
): CBTAnswerTemplate {
  const isCustomer = variant === "customer";

  return {
    template_type: "subsidiary_ledger",
    layout_variant: variant,
    allowed_accounts: isCustomer
      ? [...BASE_ACCOUNT_LISTS.receivables, ...BASE_ACCOUNT_LISTS.revenue]
      : [...BASE_ACCOUNT_LISTS.payables, ...BASE_ACCOUNT_LISTS.expenses],
    rows: [
      {
        row_id: "r1",
        label: "期首残高",
        locked: true,
        default_values: {
          date: "4/1",
          customer_code: isCustomer ? "C001" : "S001",
          customer_name: isCustomer ? "㈱田中商事" : "㈱ABC商事",
          debit: 0,
          credit: 0,
        },
      },
      ...Array.from({ length: 8 }, (_, i) => ({
        row_id: `r${i + 2}`,
        label: `取引${i + 1}`,
        locked: false,
      })),
    ],
    columns: [
      {
        key: "date",
        label: "日付",
        input: "text" as const,
        width: 80,
        required: true,
      },
      {
        key: isCustomer ? "customer_code" : "supplier_code",
        label: isCustomer ? "顧客コード" : "仕入先コード",
        input: "code" as const,
        width: 100,
        required: true,
      },
      {
        key: isCustomer ? "customer_name" : "supplier_name",
        label: isCustomer ? "顧客名" : "仕入先名",
        input: "dropdown" as const,
        width: 160,
        required: true,
      },
      {
        key: "description",
        label: "摘要",
        input: "dropdown" as const,
        width: 120,
        options_ref: "allowed_accounts",
      },
      {
        key: "debit",
        label: "借方",
        input: "currency" as const,
        width: 120,
      },
      {
        key: "credit",
        label: "貸方",
        input: "currency" as const,
        width: 120,
      },
      {
        key: "balance",
        label: "残高",
        input: "computed" as const,
        width: 120,
        formula: "running_total",
      },
    ],
    guidance: [
      {
        stage: 1,
        title: isCustomer ? "顧客別確認" : "仕入先別確認",
        body: isCustomer
          ? "顧客ごとの売掛金残高と取引明細を確認します。"
          : "仕入先ごとの買掛金残高と取引明細を確認します。",
      },
      {
        stage: 2,
        title: "詳細記入",
        body: "日付、コード、名称、摘要を正確に記入します。",
      },
      {
        stage: 3,
        title: "残高更新",
        body: "各取引後の残高が自動更新されることを確認します。",
      },
    ],
    max_rows: 15,
    auto_calculate: true,
    validation_rules: ["required_fields", "code_format", "balance_check"],
  };
}

// 伝票テンプレート生成
function generateVoucherTemplate(
  questionNumber: number,
  variant: string,
): CBTAnswerTemplate {
  const isJournal = variant === "journal";
  const isReceipt = variant === "receipt";
  const isPayment = variant === "payment";

  return {
    template_type: "voucher",
    layout_variant: variant,
    allowed_accounts: isJournal
      ? [
          ...BASE_ACCOUNT_LISTS.cash_bank,
          ...BASE_ACCOUNT_LISTS.receivables,
          ...BASE_ACCOUNT_LISTS.payables,
          ...BASE_ACCOUNT_LISTS.revenue,
          ...BASE_ACCOUNT_LISTS.expenses,
        ]
      : isReceipt
        ? [...BASE_ACCOUNT_LISTS.cash_bank, ...BASE_ACCOUNT_LISTS.revenue]
        : [...BASE_ACCOUNT_LISTS.cash_bank, ...BASE_ACCOUNT_LISTS.expenses],
    rows: [
      {
        row_id: "r1",
        label: "明細1",
        locked: false,
      },
      {
        row_id: "r2",
        label: "明細2",
        locked: false,
      },
      {
        row_id: "r3",
        label: "明細3",
        locked: false,
      },
      {
        row_id: "r4",
        label: "明細4",
        locked: false,
      },
      {
        row_id: "r5",
        label: "合計",
        locked: true,
      },
    ],
    columns: [
      {
        key: "voucher_number",
        label: "伝票番号",
        input: "number" as const,
        width: 100,
        required: true,
      },
      {
        key: "date",
        label: "日付",
        input: "date" as const,
        width: 100,
        required: true,
      },
      {
        key: "account_name",
        label: "勘定科目",
        input: "dropdown" as const,
        width: 160,
        options_ref: "allowed_accounts",
        required: true,
      },
      {
        key: "description",
        label: "摘要",
        input: "text" as const,
        width: 160,
      },
      {
        key: "debit",
        label: "借方",
        input: "currency" as const,
        width: 120,
      },
      {
        key: "credit",
        label: "貸方",
        input: "currency" as const,
        width: 120,
      },
    ],
    guidance: [
      {
        stage: 1,
        title: "伝票種別確認",
        body: `${
          isJournal
            ? "仕訳伝票"
            : isReceipt
              ? "入金伝票"
              : isPayment
                ? "出金伝票"
                : "振替伝票"
        }の記入方法を確認します。`,
      },
      {
        stage: 2,
        title: "勘定科目選択",
        body: "適切な勘定科目を選択し、借方・貸方を正しく記入します。",
      },
      {
        stage: 3,
        title: "合計確認",
        body: isJournal
          ? "借方合計と貸方合計が一致することを確認します。"
          : "伝票の金額合計を確認します。",
      },
    ],
    max_rows: 10,
    auto_calculate: true,
    validation_rules: [
      "required_fields",
      isJournal ? "balance_check" : "voucher_total_check",
    ],
  };
}

// 一般元帳テンプレート生成（拡張版）
function generateExtendedGeneralLedgerTemplate(
  questionNumber: number,
  variant: string,
): CBTAnswerTemplate {
  return {
    template_type: "general_ledger",
    layout_variant: variant,
    allowed_accounts: [
      ...BASE_ACCOUNT_LISTS.cash_bank,
      ...BASE_ACCOUNT_LISTS.receivables,
      ...BASE_ACCOUNT_LISTS.inventory,
      ...BASE_ACCOUNT_LISTS.fixed_assets,
      ...BASE_ACCOUNT_LISTS.payables,
      ...BASE_ACCOUNT_LISTS.revenue,
      ...BASE_ACCOUNT_LISTS.expenses,
    ],
    rows: [
      {
        row_id: "r1",
        label: "前月繰越",
        locked: true,
        default_values: {
          date: "4/1",
          description: "前月繰越",
          debit: 0,
          credit: 0,
        },
      },
      ...Array.from({ length: 12 }, (_, i) => ({
        row_id: `r${i + 2}`,
        label: `取引${i + 1}`,
        locked: false,
      })),
    ],
    columns: [
      {
        key: "date",
        label: "日付",
        input: "text" as const,
        width: 80,
        required: true,
      },
      {
        key: "voucher_number",
        label: "伝票No",
        input: "number" as const,
        width: 80,
      },
      {
        key: "description",
        label: "摘要",
        input: "dropdown" as const,
        width: 160,
        options_ref: "allowed_accounts",
        required: true,
      },
      {
        key: "debit",
        label: "借方",
        input: "currency" as const,
        width: 120,
      },
      {
        key: "credit",
        label: "貸方",
        input: "currency" as const,
        width: 120,
      },
      {
        key: "balance",
        label: "残高",
        input: "computed" as const,
        width: 120,
        formula: "prev + debit - credit",
      },
    ],
    guidance: [
      {
        stage: 1,
        title: "取引整理",
        body: "月次取引を日付順に整理し、伝票番号と照合します。",
      },
      {
        stage: 2,
        title: "元帳転記",
        body: "各取引を適切な勘定科目で転記し、残高を更新します。",
      },
      {
        stage: 3,
        title: "月末残高確認",
        body: "月末残高を確認し、試算表との一致を検証します。",
      },
    ],
    max_rows: 20,
    auto_calculate: true,
    validation_rules: ["required_fields", "balance_check", "voucher_reference"],
  };
}

// Phase Bテンプレート生成メイン関数
function generatePhaseBTemplates(): TemplateData[] {
  const templates: TemplateData[] = [];

  // Q_L_011-020: 補助元帳テンプレート
  const { subsidiary_ledger } = PHASE_B_CONFIG;
  for (
    let i = subsidiary_ledger.range.start;
    i <= subsidiary_ledger.range.end;
    i++
  ) {
    const variantIndex =
      (i - subsidiary_ledger.range.start) % subsidiary_ledger.variants.length;
    const variant = subsidiary_ledger.variants[variantIndex];

    templates.push({
      questionId: `Q_L_${i.toString().padStart(3, "0")}`,
      template: generateSubsidiaryLedgerTemplate(i, variant),
    });
  }

  // Q_L_021-030: 伝票テンプレート
  const { voucher } = PHASE_B_CONFIG;
  for (let i = voucher.range.start; i <= voucher.range.end; i++) {
    const variantIndex = (i - voucher.range.start) % voucher.variants.length;
    const variant = voucher.variants[variantIndex];

    templates.push({
      questionId: `Q_L_${i.toString().padStart(3, "0")}`,
      template: generateVoucherTemplate(i, variant),
    });
  }

  // Q_L_031-040: 一般元帳テンプレート（拡張版）
  const { general_ledger_extended } = PHASE_B_CONFIG;
  for (
    let i = general_ledger_extended.range.start;
    i <= general_ledger_extended.range.end;
    i++
  ) {
    const variantIndex =
      (i - general_ledger_extended.range.start) %
      general_ledger_extended.variants.length;
    const variant = general_ledger_extended.variants[variantIndex];

    templates.push({
      questionId: `Q_L_${i.toString().padStart(3, "0")}`,
      template: generateExtendedGeneralLedgerTemplate(i, variant),
    });
  }

  return templates;
}

// メイン実行関数
async function main(): Promise<void> {
  console.log("🔄 Phase B CBTテンプレート生成を開始します...");

  try {
    // Phase Bテンプレート生成
    const phaseBTemplates = generatePhaseBTemplates();
    console.log(`📋 生成完了: ${phaseBTemplates.length}個のテンプレート`);

    // テンプレート種別統計
    const templateStats = phaseBTemplates.reduce(
      (acc, { template }) => {
        acc[template.template_type] = (acc[template.template_type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    console.log(`\\n📈 テンプレート種別統計:`);
    Object.entries(templateStats).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}問`);
    });

    // JSON出力
    const outputPath = path.join(__dirname, "phase-b-templates.json");
    fs.writeFileSync(
      outputPath,
      JSON.stringify(phaseBTemplates, null, 2),
      "utf-8",
    );
    console.log(`💾 出力完了: ${path.basename(outputPath)}`);

    console.log(`\\n🎉 Phase B CBTテンプレート生成完了!`);
    console.log(`📊 詳細:`);
    console.log(`  - Q_L_011-020: 補助元帳テンプレート (10問)`);
    console.log(`  - Q_L_021-030: 伝票テンプレート (10問)`);
    console.log(`  - Q_L_031-040: 拡張一般元帳テンプレート (10問)`);
    console.log(`  - 合計: 30問`);
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    throw error;
  }
}

// 実行
if (require.main === module) {
  main().catch(console.error);
}

export { generatePhaseBTemplates };
