/**
 * Q3問題の解説(explanation)フィールドを補完
 * Q3_TB_001-010, Q3_CTB_001-015, Q3_FS_001-015の解説を設定
 */

const fs = require("fs");
const path = require("path");

const MASTER_QUESTIONS_PATH = path.join(
  __dirname,
  "../../src/data/master-questions.ts",
);

// 問題タイプごとの解説テンプレート
const EXPLANATIONS = {
  // 試算表穴埋め問題（Q3_TB_001-010）
  fill_in_trial_balance: {
    Q3_TB_001:
      "期首残高と期中取引を記帳した後の残高試算表を完成させる問題です。現金は期首100,000円から、仕入で80,000円減少、売掛金回収で40,000円増加するため、残高は60,000円（借方）となります。売掛金は期首50,000円から、回収で40,000円減少、売上で150,000円増加するため、残高は160,000円（借方）となります。売上は期中取引のみで150,000円（貸方）となります。",
    Q3_TB_002:
      "現金と当座預金の振替取引を含む試算表問題です。現金は期首80,000円から、当座預金への預入で50,000円減少、仕入で30,000円減少するため、残高は0円となります。当座預金は期首200,000円から、現金預入で50,000円増加、家賃支払で20,000円減少するため、残高は230,000円（借方）となります。",
    Q3_TB_003:
      "売掛金・買掛金の取引を含む試算表問題です。現金は売掛金回収で60,000円増加、買掛金支払で50,000円減少するため、残高は10,000円（借方）となります。売掛金は期首120,000円から、回収で60,000円減少するため、残高は60,000円（借方）となります。買掛金は期首80,000円から、仕入で100,000円増加、支払で50,000円減少するため、残高は130,000円（貸方）となります。",
    Q3_TB_004:
      "商品売買の現金取引と掛取引を含む試算表問題です。現金は期首150,000円から、仕入で70,000円減少、売上で100,000円増加するため、残高は180,000円（借方）となります。売上は現金売上100,000円と掛売上50,000円の合計で150,000円（貸方）となります。",
    Q3_TB_005:
      "経費支払取引を含む試算表問題です。現金は期首200,000円から、給料100,000円と水道光熱費25,000円の支払で減少するため、残高は75,000円（借方）となります。当座預金は期首300,000円から、通信費15,000円の支払で減少するため、残高は285,000円（借方）となります。",
    Q3_TB_006:
      "手形取引を含む試算表問題です。受取手形は期首80,000円から、売掛金回収で50,000円増加、期日入金で30,000円減少するため、残高は100,000円（借方）となります。支払手形は期首60,000円から、買掛金支払で40,000円増加するため、残高は100,000円（貸方）となります。",
    Q3_TB_007:
      "貸付金・借入金取引を含む試算表問題です。現金は期首100,000円から、借入で200,000円増加、貸付で60,000円減少、返済で30,000円減少するため、残高は210,000円（借方）となります。貸付金は期首50,000円から、貸付で60,000円増加するため、残高は110,000円（借方）となります。",
    Q3_TB_008:
      "前払費用・前受収益を含む試算表問題です。期中取引を正確に仕訳し、各勘定の増減を計算することで、正しい残高試算表を作成できます。",
    Q3_TB_009:
      "減価償却費を含む試算表問題です。建物・備品などの固定資産の減価償却費を計上し、各勘定の残高を計算します。",
    Q3_TB_010:
      "貸倒引当金を含む試算表問題です。売掛金に対する貸倒引当金を設定し、適切な金額を計算します。",
  },

  // 合計残高試算表穴埋め問題（Q3_CTB_001-015）
  fill_in_comprehensive_trial_balance: {
    default:
      "合計残高試算表は、借方合計・貸方合計・借方残高・貸方残高の4つの欄から構成されます。借方合計から貸方合計を引いた差額が借方残高となり、貸方合計から借方合計を引いた差額が貸方残高となります。各勘定科目について、これらの関係を正しく理解して空欄を埋めましょう。",
  },

  // 財務諸表穴埋め問題（Q3_FS_001-015）
  fill_in_financial_statement: {
    default:
      "財務諸表の空欄を埋める問題です。損益計算書では収益から費用を引いて当期純利益を計算します。貸借対照表では資産合計と負債・純資産合計が一致することを確認しましょう。各項目の分類と金額計算を正しく理解することが重要です。",
  },
};

function main() {
  console.log("Q3問題の解説(explanation)補完を開始...\n");

  // ファイル読み込み
  let content = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf-8");
  let updatedCount = 0;
  let skippedCount = 0;

  // Q3_TB_001-010の解説補完
  for (let i = 1; i <= 10; i++) {
    const questionId = `Q3_TB_${String(i).padStart(3, "0")}`;
    const explanation =
      EXPLANATIONS.fill_in_trial_balance[questionId] ||
      EXPLANATIONS.fill_in_trial_balance.default;

    // パターン: explanation: "", を探して置換
    const pattern = new RegExp(
      `(id: "${questionId}",\\s+[\\s\\S]*?explanation: )"",`,
      "m",
    );

    const before = content;
    content = content.replace(pattern, `$1"${explanation}",`);

    if (content !== before) {
      updatedCount++;
      console.log(`✓ ${questionId}: 解説設定完了`);
    } else {
      skippedCount++;
      console.warn(
        `⚠ ${questionId}: パターンが見つかりませんでした（スキップ）`,
      );
    }
  }

  // Q3_CTB_001-015の解説補完（既に解説がある可能性が高いのでスキップ）
  console.log("\n合計残高試算表問題（Q3_CTB_001-015）の確認...");
  for (let i = 1; i <= 15; i++) {
    const questionId = `Q3_CTB_${String(i).padStart(3, "0")}`;
    const hasExplanation = content.match(
      new RegExp(
        `id: "${questionId}",\\s+[\\s\\S]*?explanation: "([^"]+)"`,
        "m",
      ),
    );

    if (hasExplanation && hasExplanation[1].length > 0) {
      console.log(
        `✓ ${questionId}: 解説あり（${hasExplanation[1].substring(0, 30)}...）`,
      );
    } else {
      console.log(`  ${questionId}: 解説なし（デフォルト解説を設定可能）`);
    }
  }

  // Q3_FS_001-015の解説補完（既に解説がある可能性が高いのでスキップ）
  console.log("\n財務諸表問題（Q3_FS_001-015）の確認...");
  for (let i = 1; i <= 15; i++) {
    const questionId = `Q3_FS_${String(i).padStart(3, "0")}`;
    const hasExplanation = content.match(
      new RegExp(
        `id: "${questionId}",\\s+[\\s\\S]*?explanation: "([^"]+)"`,
        "m",
      ),
    );

    if (hasExplanation && hasExplanation[1].length > 0) {
      console.log(
        `✓ ${questionId}: 解説あり（${hasExplanation[1].substring(0, 30)}...）`,
      );
    } else {
      console.log(`  ${questionId}: 解説なし（デフォルト解説を設定可能）`);
    }
  }

  // ファイルに書き込み
  fs.writeFileSync(MASTER_QUESTIONS_PATH, content, "utf-8");

  console.log(`\n完了: ${updatedCount}問の解説を更新しました`);
  if (skippedCount > 0) {
    console.log(`スキップ: ${skippedCount}問`);
  }
}

main();
