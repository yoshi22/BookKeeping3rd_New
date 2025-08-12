#!/usr/bin/env node

/**
 * 仕訳問題の解答テンプレート修正スクリプト
 *
 * 問題: 全ての仕訳問題（Q_J_*）が間違った"ledger_entry"テンプレートを使用している
 * 解決: 全ての仕訳問題のanswer_template_jsonを正しい"journal_entry"フォーマットに修正
 */

const fs = require("fs");
const path = require("path");

const MASTER_QUESTIONS_PATH = path.join(
  __dirname,
  "../src/data/master-questions.js",
);

// 正しい仕訳用テンプレート
const CORRECT_JOURNAL_TEMPLATE = {
  type: "journal_entry",
  fields: [
    {
      name: "debit_account",
      label: "借方科目",
      type: "dropdown",
      required: true,
      options: [
        "現金",
        "当座預金",
        "普通預金",
        "小口現金",
        "売掛金",
        "受取手形",
        "商品",
        "前払金",
        "前払費用",
        "仮払金",
        "貸付金",
        "建物",
        "備品",
        "土地",
        "車両運搬具",
        "投資有価証券",
        "買掛金",
        "支払手形",
        "前受金",
        "前受収益",
        "仮受金",
        "未払金",
        "未払費用",
        "借入金",
        "預り金",
        "貸倒引当金",
        "減価償却累計額",
        "資本金",
        "繰越利益剰余金",
        "引出金",
        "売上",
        "受取利息",
        "受取手数料",
        "受取配当金",
        "固定資産売却益",
        "雑収入",
        "仕入",
        "給料",
        "支払利息",
        "支払手数料",
        "減価償却費",
        "貸倒引当金繰入",
        "租税公課",
        "水道光熱費",
        "通信費",
        "旅費交通費",
        "消耗品費",
        "修繕費",
        "固定資産売却損",
        "雑損失",
        "現金過不足",
        "当座借越",
      ],
    },
    {
      name: "debit_amount",
      label: "借方金額",
      type: "number",
      required: true,
      format: "currency",
    },
    {
      name: "credit_account",
      label: "貸方科目",
      type: "dropdown",
      required: true,
      options: [
        "現金",
        "当座預金",
        "普通預金",
        "小口現金",
        "売掛金",
        "受取手形",
        "商品",
        "前払金",
        "前払費用",
        "仮払金",
        "貸付金",
        "建物",
        "備品",
        "土地",
        "車両運搬具",
        "投資有価証券",
        "買掛金",
        "支払手形",
        "前受金",
        "前受収益",
        "仮受金",
        "未払金",
        "未払費用",
        "借入金",
        "預り金",
        "貸倒引当金",
        "減価償却累計額",
        "資本金",
        "繰越利益剰余金",
        "引出金",
        "売上",
        "受取利息",
        "受取手数料",
        "受取配当金",
        "固定資産売却益",
        "雑収入",
        "仕入",
        "給料",
        "支払利息",
        "支払手数料",
        "減価償却費",
        "貸倒引当金繰入",
        "租税公課",
        "水道光熱費",
        "通信費",
        "旅費交通費",
        "消耗品費",
        "修繕費",
        "固定資産売却損",
        "雑損失",
        "現金過不足",
        "当座借越",
      ],
    },
    {
      name: "credit_amount",
      label: "貸方金額",
      type: "number",
      required: true,
      format: "currency",
    },
  ],
  allowMultipleEntries: true,
  maxEntries: 4,
  validation: {
    debitCreditBalance: true,
    noSameAccount: true,
  },
};

function fixJournalTemplates() {
  console.log("🔧 仕訳問題のテンプレート修正を開始します...");

  try {
    // ファイルを読み込み
    const content = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf8");

    let fixedCount = 0;
    let totalJournalQuestions = 0;

    // 各Q_J_問題のanswer_template_jsonを修正
    const fixedContent = content.replace(
      /^(\s*)(id: "Q_J_\d+",[\s\S]*?)answer_template_json: '([^']*)',/gm,
      (match, indent, beforeTemplate, oldTemplate) => {
        totalJournalQuestions++;

        try {
          // 現在のテンプレートを解析
          const currentTemplate = JSON.parse(oldTemplate);

          // ledger_entryテンプレートを使用している場合のみ修正
          if (currentTemplate.type === "ledger_entry") {
            const newTemplateJson = JSON.stringify(CORRECT_JOURNAL_TEMPLATE);
            fixedCount++;

            console.log(
              `✅ ${totalJournalQuestions}問目: Q_J_* - テンプレート修正完了`,
            );

            return `${indent}${beforeTemplate}answer_template_json: '${newTemplateJson}',`;
          } else {
            console.log(
              `⏭️  ${totalJournalQuestions}問目: Q_J_* - 既に正しいテンプレート`,
            );
            return match;
          }
        } catch (error) {
          console.warn(
            `⚠️  ${totalJournalQuestions}問目: テンプレート解析エラー:`,
            error.message,
          );
          return match;
        }
      },
    );

    // バックアップを作成
    const backupPath = MASTER_QUESTIONS_PATH + ".backup-" + Date.now();
    fs.writeFileSync(backupPath, content);
    console.log(`💾 バックアップを作成: ${backupPath}`);

    // 修正したファイルを保存
    fs.writeFileSync(MASTER_QUESTIONS_PATH, fixedContent);

    console.log("\n📊 修正結果:");
    console.log(`📝 総仕訳問題数: ${totalJournalQuestions}問`);
    console.log(`🔧 修正した問題数: ${fixedCount}問`);
    console.log(`✨ 修正完了: ${MASTER_QUESTIONS_PATH}`);

    if (fixedCount > 0) {
      console.log("\n🎉 全ての仕訳問題のテンプレートが正しく修正されました！");
      console.log("📱 これで仕訳問題が適切なUIフォーマットで表示されます。");
    } else {
      console.log("\n✅ 修正が必要な問題は見つかりませんでした。");
    }
  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
    process.exit(1);
  }
}

// 実行確認
console.log("🚀 仕訳問題テンプレート修正スクリプト");
console.log("📂 対象ファイル:", MASTER_QUESTIONS_PATH);
console.log("\n⚡ 修正内容:");
console.log("  • 全てのQ_J_*問題のanswer_template_json");
console.log('  • type: "ledger_entry" → type: "journal_entry"');
console.log("  • 正しい仕訳フィールド定義に変更");
console.log("  • 複数エントリ対応を追加");

fixJournalTemplates();
