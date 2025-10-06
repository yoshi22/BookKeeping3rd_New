/**
 * Q_J_001-250仕訳問題テンプレート生成スクリプト
 * 全250問の仕訳問題に対するCBTテンプレート生成
 */

import * as fs from "fs";
import * as path from "path";
import type { CBTAnswerTemplate } from "../../src/types/models";

interface TemplateData {
  questionId: string;
  template: CBTAnswerTemplate;
}

// テンプレート生成の設定
const JOURNAL_ENTRY_CONFIG = {
  // Q_J_001-250: 仕訳問題テンプレート
  journal_entry: {
    range: { start: 1, end: 250 },
    template_type: "journal_entry" as const,
    variants: [
      "basic_entry",
      "cash_transaction",
      "credit_transaction",
      "adjustment_entry",
      "complex_entry",
    ],
  },
};

// 勘定科目カテゴリ別リスト（動的フィルタリング対応）
const ACCOUNT_CATEGORIES = {
  // 現金・預金系（62問想定）
  cash_bank: [
    "現金",
    "小口現金",
    "普通預金",
    "当座預金",
    "定期預金",
    "現金過不足",
    "当座借越",
  ],
  // 商品・売買系（75問想定）
  merchandise: [
    "商品",
    "繰越商品",
    "仕入",
    "売上",
    "売上原価",
    "期首商品棚卸高",
    "期末商品棚卸高",
  ],
  // 債権・債務系（48問想定）
  receivables_payables: [
    "売掛金",
    "買掛金",
    "受取手形",
    "支払手形",
    "貸付金",
    "借入金",
    "前払金",
    "前受金",
    "立替金",
    "預り金",
    "未払金",
    "未収金",
  ],
  // 固定資産系（25問想定）
  fixed_assets: [
    "建物",
    "土地",
    "車両運搬具",
    "工具器具備品",
    "ソフトウェア",
    "減価償却累計額",
    "建物減価償却累計額",
    "車両減価償却累計額",
  ],
  // 給与・人件費系（15問想定）
  personnel: [
    "給料",
    "役員報酬",
    "法定福利費",
    "福利厚生費",
    "所得税預り金",
    "社会保険料預り金",
  ],
  // 決算・調整系（20問想定）
  adjustment: [
    "貸倒引当金",
    "貸倒損失",
    "減価償却費",
    "前払費用",
    "未払費用",
    "前受収益",
    "未収収益",
    "引当金繰入額",
    "引当金戻入額",
  ],
  // その他費用・収益（5問想定）
  other: [
    "受取利息",
    "支払利息",
    "受取配当金",
    "雑収入",
    "雑損失",
    "水道光熱費",
    "通信費",
    "交通費",
    "消耗品費",
    "広告宣伝費",
    "家賃",
    "保険料",
    "修繕費",
    "租税公課",
  ],
};

// 全勘定科目リスト（動的フィルタリング前の完全リスト）
const ALL_ALLOWED_ACCOUNTS = [
  ...ACCOUNT_CATEGORIES.cash_bank,
  ...ACCOUNT_CATEGORIES.merchandise,
  ...ACCOUNT_CATEGORIES.receivables_payables,
  ...ACCOUNT_CATEGORIES.fixed_assets,
  ...ACCOUNT_CATEGORIES.personnel,
  ...ACCOUNT_CATEGORIES.adjustment,
  ...ACCOUNT_CATEGORIES.other,
];

// 仕訳問題テンプレート生成
function generateJournalEntryTemplate(
  questionNumber: number,
  variant: string,
): CBTAnswerTemplate {
  return {
    template_type: "journal_entry",
    layout_variant: variant,
    allowed_accounts: ALL_ALLOWED_ACCOUNTS,
    rows: [
      {
        row_id: "entry_1",
        label: "仕訳エントリ1",
        locked: false,
      },
      {
        row_id: "entry_2",
        label: "仕訳エントリ2",
        locked: false,
      },
      // 複合仕訳用の追加エントリ（必要に応じて使用）
      {
        row_id: "entry_3",
        label: "仕訳エントリ3",
        locked: false,
      },
      {
        row_id: "entry_4",
        label: "仕訳エントリ4",
        locked: false,
      },
    ],
    columns: [
      {
        key: "debit_account",
        label: "借方勘定科目",
        input: "dropdown" as const,
        width: 160,
        options_ref: "allowed_accounts",
        required: true,
      },
      {
        key: "debit_amount",
        label: "借方金額",
        input: "currency" as const,
        width: 120,
        required: true,
      },
      {
        key: "credit_account",
        label: "貸方勘定科目",
        input: "dropdown" as const,
        width: 160,
        options_ref: "allowed_accounts",
        required: true,
      },
      {
        key: "credit_amount",
        label: "貸方金額",
        input: "currency" as const,
        width: 120,
        required: true,
      },
    ],
    guidance: [
      {
        stage: 1,
        title: "取引内容の分析",
        body: getGuidanceBodyForVariant(variant, 1),
      },
      {
        stage: 2,
        title: "勘定科目の選択",
        body: getGuidanceBodyForVariant(variant, 2),
      },
      {
        stage: 3,
        title: "金額の確認",
        body: getGuidanceBodyForVariant(variant, 3),
      },
    ],
    max_rows: 6,
    auto_calculate: true,
    validation_rules: [
      "required_fields",
      "debit_credit_balance",
      "amount_match",
    ],
  };
}

// バリアント別ガイダンス本文生成
function getGuidanceBodyForVariant(variant: string, stage: number): string {
  const guidanceMap: Record<string, Record<number, string>> = {
    basic_entry: {
      1: "基本的な取引内容を理解し、資産・負債・純資産・収益・費用のどれに該当するかを判断します。",
      2: "取引で増減する勘定科目を特定し、借方・貸方の適切な配置を決定します。",
      3: "借方合計と貸方合計が一致することを確認し、金額に間違いがないかチェックします。",
    },
    cash_transaction: {
      1: "現金の増減を伴う取引を分析し、現金勘定の動きを確認します。",
      2: "現金または現金等価物の勘定科目を選択し、対応する勘定科目を決定します。",
      3: "現金の入出金額と対象取引の金額が正確に一致しているか確認します。",
    },
    credit_transaction: {
      1: "掛取引（信用取引）の内容を分析し、債権・債務の発生を確認します。",
      2: "売掛金・買掛金等の債権債務勘定を適切に選択します。",
      3: "将来の入金・支払予定額と仕訳金額が一致していることを確認します。",
    },
    adjustment_entry: {
      1: "決算整理や期間配分を要する取引内容を分析します。",
      2: "引当金、前払・未払項目等の調整勘定科目を適切に選択します。",
      3: "調整金額の計算根拠と仕訳金額が正確に対応していることを確認します。",
    },
    complex_entry: {
      1: "複数の勘定科目が関わる複合取引の全体構造を分析します。",
      2: "各構成要素に対応する勘定科目を順序立てて選択します。",
      3: "借方合計と貸方合計の均衡を確認し、各要素の金額が正確であることを検証します。",
    },
  };

  return (
    guidanceMap[variant]?.[stage] ||
    "取引の内容を確認し、適切な会計処理を行います。"
  );
}

// バリアント選択ロジック（問題番号に基づく）
function selectVariant(questionNumber: number, variants: string[]): string {
  // 問題番号の特性に基づいてバリアントを選択
  if (questionNumber <= 50) {
    // Q_J_001-050: 基本的な仕訳
    return variants[questionNumber % 2]; // basic_entry, cash_transaction
  } else if (questionNumber <= 100) {
    // Q_J_051-100: 現金・掛取引
    return variants[1 + (questionNumber % 2)]; // cash_transaction, credit_transaction
  } else if (questionNumber <= 150) {
    // Q_J_101-150: 複合取引
    return variants[2 + (questionNumber % 2)]; // credit_transaction, adjustment_entry
  } else if (questionNumber <= 200) {
    // Q_J_151-200: 決算関連
    return variants[3 + (questionNumber % 2)]; // adjustment_entry, complex_entry
  } else {
    // Q_J_201-250: 応用・複合
    return variants[4]; // complex_entry
  }
}

// 仕訳問題テンプレート生成メイン関数
function generateJournalEntryTemplates(): TemplateData[] {
  const templates: TemplateData[] = [];

  const { journal_entry } = JOURNAL_ENTRY_CONFIG;
  for (let i = journal_entry.range.start; i <= journal_entry.range.end; i++) {
    const variant = selectVariant(i, journal_entry.variants);

    templates.push({
      questionId: `Q_J_${i.toString().padStart(3, "0")}`,
      template: generateJournalEntryTemplate(i, variant),
    });
  }

  return templates;
}

// メイン実行関数
async function main(): Promise<void> {
  console.log("🔄 Q_J_001-250仕訳問題テンプレート生成を開始します...");

  try {
    // 仕訳問題テンプレート生成
    const journalEntryTemplates = generateJournalEntryTemplates();
    console.log(`📋 生成完了: ${journalEntryTemplates.length}個のテンプレート`);

    // テンプレート種別統計
    const templateStats = journalEntryTemplates.reduce(
      (acc, { template }) => {
        acc[template.template_type] = (acc[template.template_type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // バリアント別統計
    const variantStats = journalEntryTemplates.reduce(
      (acc, { template }) => {
        acc[template.layout_variant || "unknown"] =
          (acc[template.layout_variant || "unknown"] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    console.log(`\n📈 テンプレート種別統計:`);
    Object.entries(templateStats).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}問`);
    });

    console.log(`\n🔄 バリアント別統計:`);
    Object.entries(variantStats).forEach(([variant, count]) => {
      console.log(`  ${variant}: ${count}問`);
    });

    // JSON出力
    const outputPath = path.join(__dirname, "journal-entry-templates.json");
    fs.writeFileSync(
      outputPath,
      JSON.stringify(journalEntryTemplates, null, 2),
      "utf-8",
    );
    console.log(`💾 出力完了: ${path.basename(outputPath)}`);

    console.log(`\n🎉 Q_J_001-250仕訳問題テンプレート生成完了!`);
    console.log(`📊 詳細:`);
    console.log(`  - Q_J_001-050: 基本仕訳 (basic_entry/cash_transaction)`);
    console.log(
      `  - Q_J_051-100: 現金・掛取引 (cash_transaction/credit_transaction)`,
    );
    console.log(
      `  - Q_J_101-150: 複合取引 (credit_transaction/adjustment_entry)`,
    );
    console.log(`  - Q_J_151-200: 決算関連 (adjustment_entry/complex_entry)`);
    console.log(`  - Q_J_201-250: 応用・複合 (complex_entry)`);
    console.log(`  - 合計: ${journalEntryTemplates.length}問`);
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    throw error;
  }
}

// 実行
if (require.main === module) {
  main().catch(console.error);
}

export { generateJournalEntryTemplates };
