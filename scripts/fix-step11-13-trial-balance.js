#!/usr/bin/env node

/**
 * Step 11-13 (Q_T_001-Q_T_012) 試算表問題一括修正スクリプト
 * - JSON形式統一: 文字列リテラル → JSON.stringify()
 * - 不適切説明文修正: 各問題に適した試算表専用説明文適用
 * - updated_at: 2025-08-19T00:00:00Z
 */

const fs = require("fs");
const path = require("path");

const MASTER_QUESTIONS_PATH = path.join(
  __dirname,
  "../src/data/master-questions.ts",
);

// 試算表専用説明文
const TRIAL_BALANCE_EXPLANATION = `"【基本概念】\\n財務諸表（貸借対照表・損益計算書）や試算表は、企業の財政状態と経営成績を表す重要な計算書類です。すべての取引を仕訳し、各勘定の残高を集計して作成します。\\n\\n【具体例・イメージ】\\n家計簿の月末集計をイメージしてください。各項目の収入・支出を整理し、「今月の家計状況」を一覧表にまとめる作業と同様です。\\n\\n【作成の流れ】\\n・仕訳→総勘定元帳転記→試算表作成→決算整理→財務諸表作成\\n・貸借対照表：資産・負債・純資産（ある時点の財政状態）\\n・損益計算書：収益・費用（一定期間の経営成績）\\n・試算表：各勘定残高の一覧表（貸借一致の確認）\\n\\n【間違えやすいポイント】\\n・資産・負債・純資産・収益・費用の分類ミス\\n・決算整理事項の処理漏れ\\n・貸借対照表の貸借不一致\\n・試算表での転記ミス\\n\\n【覚え方のコツ】\\n・貸借対照表は「ストック」（財産の状況）\\n・損益計算書は「フロー」（儲けの状況）\\n・試算表は「貸借一致」が絶対条件\\n・決算整理は「正確な期間損益」のため\\n\\n【この問題の解き方】\\n各取引を正確に仕訳し、決算整理を行った後、勘定残高を適切な財務諸表項目に分類して表示します。"`;

console.log("🔧 Step 11-13 試算表問題一括修正スクリプト開始...");

try {
  // ファイル読み込み
  let content = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf8");
  console.log("📖 master-questions.ts読み込み完了");

  let modifiedCount = 0;

  // Q_T_001からQ_T_012の範囲で処理
  for (let i = 1; i <= 12; i++) {
    const questionId = `Q_T_${i.toString().padStart(3, "0")}`;

    // 問題ブロックを特定する正規表現
    const questionBlockRegex = new RegExp(
      `(\\s+{\\s*id: "${questionId}",\\s*category_id: "trial_balance",[\\s\\S]*?tags_json:[\\s\\S]*?},)`,
      "g",
    );

    const match = content.match(questionBlockRegex);
    if (match) {
      console.log(`🔍 ${questionId}を処理中...`);

      let questionBlock = match[0];
      let originalBlock = questionBlock;

      // 1. answer_template_json修正（文字列リテラル → JSON.stringify）
      questionBlock = questionBlock.replace(
        /answer_template_json:\\s*'({[^']+})'/g,
        "answer_template_json: JSON.stringify($1)",
      );

      // 2. correct_answer_json修正（文字列リテラル → JSON.stringify）
      questionBlock = questionBlock.replace(
        /correct_answer_json:\\s*'({[^']+})'/g,
        "correct_answer_json: JSON.stringify($1)",
      );

      // 3. tags_json修正（文字列リテラル → JSON.stringify）
      questionBlock = questionBlock.replace(
        /tags_json:\\s*'({[^']+})'/g,
        "tags_json: JSON.stringify($1)",
      );

      // 4. 説明文を試算表専用説明文に修正
      questionBlock = questionBlock.replace(
        /explanation:\\s*"[\\s\\S]*?",/g,
        `explanation:\\n      ${TRIAL_BALANCE_EXPLANATION},`,
      );

      // 5. updated_at修正
      questionBlock = questionBlock.replace(
        /updated_at: "[^"]*"/g,
        'updated_at: "2025-08-19T00:00:00Z"',
      );

      // 変更があった場合のみ置換
      if (questionBlock !== originalBlock) {
        content = content.replace(originalBlock, questionBlock);
        modifiedCount++;
        console.log(`✅ ${questionId}修正完了`);
      } else {
        console.log(`⏭️  ${questionId}は既に修正済み`);
      }
    } else {
      console.log(`⚠️  ${questionId}が見つかりません`);
    }
  }

  // ファイル書き込み
  if (modifiedCount > 0) {
    fs.writeFileSync(MASTER_QUESTIONS_PATH, content, "utf8");
    console.log(
      `\n🎉 Step 11-13試算表問題一括修正完了！修正問題数: ${modifiedCount}問`,
    );
    console.log("📝 以下の修正を実施しました:");
    console.log("   - JSON形式統一: 文字列リテラル → JSON.stringify()");
    console.log("   - 説明文修正: 試算表・財務諸表専用説明文適用");
    console.log("   - updated_at: 2025-08-19T00:00:00Z");
  } else {
    console.log("\nℹ️  修正対象の問題がありませんでした（既に修正済み）");
  }
} catch (error) {
  console.error("❌ エラーが発生しました:", error);
  process.exit(1);
}
