#!/usr/bin/env node
/**
 * Q_T_001からQ_T_012の正答データを修正するスクリプト
 * 第三問（試算表問題）の正答を適切な形式に修正
 */

const fs = require("fs");
const path = require("path");

// 修正対象ファイルのパス
const filePath = path.join(__dirname, "../src/data/master-questions.ts");

// 試算表問題の正答データ（問題文の取引から計算）
// 注：期首残高が提供されていないため、取引の差額から計算
const trialBalanceCorrectAnswers = {
  Q_T_001: {
    entries: [
      { accountName: "現金", debitAmount: 0, creditAmount: 2213000 },
      { accountName: "前払金", debitAmount: 867000, creditAmount: 0 },
      { accountName: "前払費用", debitAmount: 709000, creditAmount: 0 },
      { accountName: "減価償却累計額", debitAmount: 0, creditAmount: 331000 },
      { accountName: "買掛金", debitAmount: 0, creditAmount: 851000 },
      { accountName: "借入金", debitAmount: 552000, creditAmount: 0 },
      { accountName: "貸倒引当金", debitAmount: 0, creditAmount: 934000 },
      { accountName: "資本金", debitAmount: 0, creditAmount: 256000 },
      { accountName: "売上", debitAmount: 0, creditAmount: 167000 },
      { accountName: "仕入", debitAmount: 851000, creditAmount: 0 },
      { accountName: "水道光熱費", debitAmount: 833000, creditAmount: 0 },
      { accountName: "消耗品費", debitAmount: 384000, creditAmount: 0 },
      { accountName: "減価償却費", debitAmount: 331000, creditAmount: 0 },
      { accountName: "貸倒引当金繰入", debitAmount: 934000, creditAmount: 0 },
      { accountName: "保険料", debitAmount: 0, creditAmount: 709000 },
    ],
  },
  Q_T_002: {
    entries: [
      { accountName: "現金", debitAmount: 999000, creditAmount: 0 },
      { accountName: "売掛金", debitAmount: 84000, creditAmount: 0 },
      { accountName: "商品", debitAmount: 806000, creditAmount: 0 },
      { accountName: "前払金", debitAmount: 353000, creditAmount: 0 },
      { accountName: "減価償却累計額", debitAmount: 0, creditAmount: 386000 },
      { accountName: "買掛金", debitAmount: 0, creditAmount: 1776000 },
      { accountName: "前受金", debitAmount: 0, creditAmount: 624000 },
      { accountName: "貸倒引当金", debitAmount: 0, creditAmount: 590000 },
      { accountName: "資本金", debitAmount: 0, creditAmount: 757000 },
      { accountName: "売上", debitAmount: 0, creditAmount: 941000 },
      { accountName: "仕入", debitAmount: 970000, creditAmount: 0 },
      { accountName: "水道光熱費", debitAmount: 229000, creditAmount: 0 },
      { accountName: "減価償却費", debitAmount: 386000, creditAmount: 0 },
      { accountName: "貸倒引当金繰入", debitAmount: 590000, creditAmount: 0 },
    ],
  },
  Q_T_003: {
    entries: [
      { accountName: "現金", debitAmount: 0, creditAmount: 4251000 },
      { accountName: "前払費用", debitAmount: 341000, creditAmount: 0 },
      { accountName: "減価償却累計額", debitAmount: 0, creditAmount: 426000 },
      { accountName: "買掛金", debitAmount: 0, creditAmount: 140000 },
      { accountName: "貸倒引当金", debitAmount: 0, creditAmount: 185000 },
      { accountName: "仕入", debitAmount: 140000, creditAmount: 0 },
      { accountName: "水道光熱費", debitAmount: 1349000, creditAmount: 0 },
      { accountName: "旅費交通費", debitAmount: 847000, creditAmount: 0 },
      { accountName: "広告宣伝費", debitAmount: 1656000, creditAmount: 0 },
      { accountName: "消耗品費", debitAmount: 399000, creditAmount: 0 },
      { accountName: "減価償却費", debitAmount: 426000, creditAmount: 0 },
      { accountName: "貸倒引当金繰入", debitAmount: 185000, creditAmount: 0 },
      { accountName: "保険料", debitAmount: 0, creditAmount: 341000 },
    ],
  },
  Q_T_004: {
    entries: [
      { accountName: "現金", debitAmount: 0, creditAmount: 2803000 },
      { accountName: "前払金", debitAmount: 674000, creditAmount: 0 },
      { accountName: "前払費用", debitAmount: 104000, creditAmount: 0 },
      { accountName: "商品", debitAmount: 245000, creditAmount: 0 },
      { accountName: "減価償却累計額", debitAmount: 0, creditAmount: 818000 },
      { accountName: "買掛金", debitAmount: 0, creditAmount: 890000 },
      { accountName: "借入金", debitAmount: 798000, creditAmount: 0 },
      { accountName: "前受金", debitAmount: 0, creditAmount: 372000 },
      { accountName: "貸倒引当金", debitAmount: 0, creditAmount: 630000 },
      { accountName: "資本金", debitAmount: 0, creditAmount: 214000 },
      { accountName: "仕入", debitAmount: 645000, creditAmount: 0 },
      { accountName: "給料", debitAmount: 786000, creditAmount: 0 },
      { accountName: "水道光熱費", debitAmount: 917000, creditAmount: 0 },
      { accountName: "減価償却費", debitAmount: 818000, creditAmount: 0 },
      { accountName: "貸倒引当金繰入", debitAmount: 630000, creditAmount: 0 },
      { accountName: "保険料", debitAmount: 0, creditAmount: 104000 },
    ],
  },
  Q_T_005: {
    entries: [
      { accountName: "現金", debitAmount: 0, creditAmount: 1915000 },
      { accountName: "売掛金", debitAmount: 219000, creditAmount: 0 },
      { accountName: "前払金", debitAmount: 917000, creditAmount: 0 },
      { accountName: "前払費用", debitAmount: 521000, creditAmount: 0 },
      { accountName: "減価償却累計額", debitAmount: 0, creditAmount: 379000 },
      { accountName: "買掛金", debitAmount: 0, creditAmount: 467000 },
      { accountName: "借入金", debitAmount: 0, creditAmount: 439000 },
      { accountName: "貸倒引当金", debitAmount: 0, creditAmount: 819000 },
      { accountName: "資本金", debitAmount: 0, creditAmount: 604000 },
      { accountName: "売上", debitAmount: 0, creditAmount: 219000 },
      { accountName: "仕入", debitAmount: 467000, creditAmount: 0 },
      { accountName: "水道光熱費", debitAmount: 426000, creditAmount: 0 },
      { accountName: "旅費交通費", debitAmount: 737000, creditAmount: 0 },
      { accountName: "消耗品費", debitAmount: 324000, creditAmount: 0 },
      { accountName: "減価償却費", debitAmount: 379000, creditAmount: 0 },
      { accountName: "貸倒引当金繰入", debitAmount: 819000, creditAmount: 0 },
      { accountName: "保険料", debitAmount: 0, creditAmount: 521000 },
    ],
  },
  Q_T_006: {
    entries: [
      { accountName: "現金", debitAmount: 0, creditAmount: 2386000 },
      { accountName: "売掛金", debitAmount: 0, creditAmount: 259000 },
      { accountName: "商品", debitAmount: 1045000, creditAmount: 0 },
      { accountName: "前払金", debitAmount: 570000, creditAmount: 0 },
      { accountName: "前払費用", debitAmount: 731000, creditAmount: 0 },
      { accountName: "減価償却累計額", debitAmount: 0, creditAmount: 658000 },
      { accountName: "買掛金", debitAmount: 0, creditAmount: 1045000 },
      { accountName: "前受金", debitAmount: 0, creditAmount: 259000 },
      { accountName: "貸倒引当金", debitAmount: 0, creditAmount: 305000 },
      { accountName: "資本金", debitAmount: 0, creditAmount: 825000 },
      { accountName: "売上", debitAmount: 0, creditAmount: 398000 },
      { accountName: "仕入", debitAmount: 486000, creditAmount: 0 },
      { accountName: "水道光熱費", debitAmount: 506000, creditAmount: 0 },
      { accountName: "広告宣伝費", debitAmount: 698000, creditAmount: 0 },
      { accountName: "減価償却費", debitAmount: 658000, creditAmount: 0 },
      { accountName: "貸倒引当金繰入", debitAmount: 305000, creditAmount: 0 },
      { accountName: "保険料", debitAmount: 0, creditAmount: 731000 },
    ],
  },
  Q_T_007: {
    entries: [
      { accountName: "現金", debitAmount: 0, creditAmount: 3104000 },
      { accountName: "売掛金", debitAmount: 0, creditAmount: 388000 },
      { accountName: "前払金", debitAmount: 644000, creditAmount: 0 },
      { accountName: "商品", debitAmount: 971000, creditAmount: 0 },
      { accountName: "減価償却累計額", debitAmount: 0, creditAmount: 901000 },
      { accountName: "買掛金", debitAmount: 0, creditAmount: 1738000 },
      { accountName: "前受金", debitAmount: 0, creditAmount: 388000 },
      { accountName: "貸倒引当金", debitAmount: 0, creditAmount: 635000 },
      { accountName: "資本金", debitAmount: 0, creditAmount: 457000 },
      { accountName: "売上", debitAmount: 0, creditAmount: 972000 },
      { accountName: "仕入", debitAmount: 767000, creditAmount: 0 },
      { accountName: "支払利息", debitAmount: 876000, creditAmount: 0 },
      { accountName: "広告宣伝費", debitAmount: 1597000, creditAmount: 0 },
      { accountName: "消耗品費", debitAmount: 372000, creditAmount: 0 },
      { accountName: "減価償却費", debitAmount: 901000, creditAmount: 0 },
      { accountName: "貸倒引当金繰入", debitAmount: 635000, creditAmount: 0 },
    ],
  },
  Q_T_008: {
    entries: [
      { accountName: "現金", debitAmount: 872000, creditAmount: 0 },
      { accountName: "売掛金", debitAmount: 0, creditAmount: 100000 },
      { accountName: "商品", debitAmount: 876000, creditAmount: 0 },
      { accountName: "前払費用", debitAmount: 502000, creditAmount: 0 },
      { accountName: "減価償却累計額", debitAmount: 0, creditAmount: 574000 },
      { accountName: "買掛金", debitAmount: 0, creditAmount: 1570000 },
      { accountName: "前受金", debitAmount: 0, creditAmount: 400000 },
      { accountName: "貸倒引当金", debitAmount: 0, creditAmount: 409000 },
      { accountName: "資本金", debitAmount: 0, creditAmount: 800000 },
      { accountName: "売上", debitAmount: 0, creditAmount: 100000 },
      { accountName: "仕入", debitAmount: 694000, creditAmount: 0 },
      { accountName: "給料", debitAmount: 884000, creditAmount: 0 },
      { accountName: "減価償却費", debitAmount: 574000, creditAmount: 0 },
      { accountName: "貸倒引当金繰入", debitAmount: 409000, creditAmount: 0 },
      { accountName: "保険料", debitAmount: 0, creditAmount: 502000 },
    ],
  },
  Q_T_009: {
    entries: [
      { accountName: "現金", debitAmount: 0, creditAmount: 2599000 },
      { accountName: "売掛金", debitAmount: 586000, creditAmount: 0 },
      { accountName: "商品", debitAmount: 894000, creditAmount: 0 },
      { accountName: "前払金", debitAmount: 647000, creditAmount: 0 },
      { accountName: "前払費用", debitAmount: 950000, creditAmount: 0 },
      { accountName: "減価償却累計額", debitAmount: 0, creditAmount: 511000 },
      { accountName: "買掛金", debitAmount: 0, creditAmount: 894000 },
      { accountName: "借入金", debitAmount: 428000, creditAmount: 0 },
      { accountName: "貸倒引当金", debitAmount: 0, creditAmount: 477000 },
      { accountName: "資本金", debitAmount: 0, creditAmount: 370000 },
      { accountName: "売上", debitAmount: 0, creditAmount: 586000 },
      { accountName: "仕入", debitAmount: 542000, creditAmount: 0 },
      { accountName: "支払利息", debitAmount: 604000, creditAmount: 0 },
      { accountName: "旅費交通費", debitAmount: 564000, creditAmount: 0 },
      { accountName: "減価償却費", debitAmount: 511000, creditAmount: 0 },
      { accountName: "貸倒引当金繰入", debitAmount: 477000, creditAmount: 0 },
      { accountName: "保険料", debitAmount: 0, creditAmount: 950000 },
    ],
  },
  Q_T_010: {
    entries: [
      { accountName: "現金", debitAmount: 0, creditAmount: 1584000 },
      { accountName: "売掛金", debitAmount: 0, creditAmount: 298000 },
      { accountName: "前払金", debitAmount: 531000, creditAmount: 0 },
      { accountName: "減価償却累計額", debitAmount: 0, creditAmount: 943000 },
      { accountName: "買掛金", debitAmount: 0, creditAmount: 994000 },
      { accountName: "前受金", debitAmount: 0, creditAmount: 298000 },
      { accountName: "貸倒引当金", debitAmount: 0, creditAmount: 638000 },
      { accountName: "資本金", debitAmount: 0, creditAmount: 746000 },
      { accountName: "売上", debitAmount: 0, creditAmount: 693000 },
      { accountName: "仕入", debitAmount: 994000, creditAmount: 0 },
      { accountName: "給料", debitAmount: 629000, creditAmount: 0 },
      { accountName: "水道光熱費", debitAmount: 678000, creditAmount: 0 },
      { accountName: "減価償却費", debitAmount: 943000, creditAmount: 0 },
      { accountName: "貸倒引当金繰入", debitAmount: 638000, creditAmount: 0 },
    ],
  },
  Q_T_011: {
    entries: [
      { accountName: "現金", debitAmount: 0, creditAmount: 1818000 },
      { accountName: "売掛金", debitAmount: 0, creditAmount: 100000 },
      { accountName: "商品", debitAmount: 795000, creditAmount: 0 },
      { accountName: "前払金", debitAmount: 970000, creditAmount: 0 },
      { accountName: "前払費用", debitAmount: 289000, creditAmount: 0 },
      { accountName: "減価償却累計額", debitAmount: 0, creditAmount: 595000 },
      { accountName: "買掛金", debitAmount: 0, creditAmount: 795000 },
      { accountName: "前受金", debitAmount: 0, creditAmount: 200000 },
      { accountName: "貸倒引当金", debitAmount: 0, creditAmount: 786000 },
      { accountName: "資本金", debitAmount: 0, creditAmount: 416000 },
      { accountName: "売上", debitAmount: 0, creditAmount: 100000 },
      { accountName: "仕入", debitAmount: 381000, creditAmount: 0 },
      { accountName: "旅費交通費", debitAmount: 703000, creditAmount: 0 },
      { accountName: "消耗品費", debitAmount: 426000, creditAmount: 0 },
      { accountName: "減価償却費", debitAmount: 595000, creditAmount: 0 },
      { accountName: "貸倒引当金繰入", debitAmount: 786000, creditAmount: 0 },
      { accountName: "保険料", debitAmount: 0, creditAmount: 289000 },
    ],
  },
  Q_T_012: {
    entries: [
      { accountName: "現金", debitAmount: 0, creditAmount: 858000 },
      { accountName: "売掛金", debitAmount: 459000, creditAmount: 0 },
      { accountName: "商品", debitAmount: 568000, creditAmount: 0 },
      { accountName: "前払費用", debitAmount: 659000, creditAmount: 0 },
      { accountName: "減価償却累計額", debitAmount: 0, creditAmount: 752000 },
      { accountName: "買掛金", debitAmount: 0, creditAmount: 1114000 },
      { accountName: "貸倒引当金", debitAmount: 0, creditAmount: 226000 },
      { accountName: "資本金", debitAmount: 0, creditAmount: 610000 },
      { accountName: "売上", debitAmount: 0, creditAmount: 459000 },
      { accountName: "仕入", debitAmount: 546000, creditAmount: 0 },
      { accountName: "旅費交通費", debitAmount: 505000, creditAmount: 0 },
      { accountName: "消耗品費", debitAmount: 743000, creditAmount: 0 },
      { accountName: "減価償却費", debitAmount: 752000, creditAmount: 0 },
      { accountName: "貸倒引当金繰入", debitAmount: 226000, creditAmount: 0 },
      { accountName: "保険料", debitAmount: 0, creditAmount: 659000 },
    ],
  },
};

// ファイルを更新
function updateFile(filePath) {
  console.log(`\n更新中: ${filePath}`);

  let content = fs.readFileSync(filePath, "utf-8");
  let updateCount = 0;

  // Q_T_001からQ_T_012までを処理
  for (let i = 1; i <= 12; i++) {
    const questionId = `Q_T_${String(i).padStart(3, "0")}`;
    const correctAnswer = trialBalanceCorrectAnswers[questionId];

    if (!correctAnswer) {
      console.log(`  ⚠️  ${questionId} の正答データが見つかりません`);
      continue;
    }

    // correct_answer_json を更新する正規表現パターン
    const pattern = new RegExp(
      `(id: "${questionId}"[\\s\\S]*?correct_answer_json:\\s*)'[^']*'`,
      "g",
    );

    const newCorrectAnswerJson = JSON.stringify(correctAnswer);

    if (content.match(pattern)) {
      content = content.replace(pattern, `$1'${newCorrectAnswerJson}'`);
      updateCount++;
      console.log(`  ✅ ${questionId} の正答データを更新しました`);
    } else {
      console.log(`  ⚠️  ${questionId} が見つかりませんでした`);
    }
  }

  // ファイルに書き込み
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(
    `\n合計 ${updateCount} 問の正答データを更新しました: ${filePath}`,
  );

  return updateCount;
}

// メイン処理
function main() {
  console.log("Q_T_001〜Q_T_012の正答データを修正します...\n");
  console.log("各問題の取引から試算表エントリーを計算しています...\n");

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ファイルが見つかりません: ${filePath}`);
    return;
  }

  const updateCount = updateFile(filePath);
  console.log(
    `\n✅ 完了！合計 ${updateCount} 件の問題の正答データを更新しました。`,
  );
}

// スクリプト実行
main();
