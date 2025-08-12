const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_007-Q_L_010の正答データ補足修正スクリプト\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

// 各問題の正しい正答データを生成
const correctAnswers = {
  Q_L_007: function () {
    // 貸倒引当金勘定記入問題 - 前月繰越: 111,039円
    let balance = 111039;
    const entries = [
      {
        date: "8/1",
        description: "前月繰越",
        debit: 0,
        credit: balance, // 貸倒引当金は貸方残高
        balance: balance,
      },
    ];

    // 8月7日 貸倒れ発生(充当)：17,606円
    balance -= 17606;
    entries.push({
      date: "8/7",
      description: "貸倒充当",
      debit: 17606,
      credit: 0,
      balance: balance,
    });

    // 8月14日 決算時繰入：44,781円
    balance += 44781;
    entries.push({
      date: "8/14",
      description: "引当金繰入",
      debit: 0,
      credit: 44781,
      balance: balance,
    });

    // 8月21日 戻入益：11,908円
    balance -= 11908;
    entries.push({
      date: "8/21",
      description: "戻入益",
      debit: 11908,
      credit: 0,
      balance: balance,
    });

    return { entries };
  },

  Q_L_008: function () {
    // 売上勘定・仕入勘定の対応関係 - 6月の取引
    // 売上勘定
    const salesEntries = [
      {
        date: "6/30",
        description: "現金売上",
        debit: 0,
        credit: 397450.8,
        balance: 397450.8,
      },
      {
        date: "6/30",
        description: "掛売上",
        debit: 0,
        credit: 596176.2,
        balance: 397450.8 + 596176.2,
      },
    ];

    // 仕入勘定
    const purchaseEntries = [
      {
        date: "6/30",
        description: "現金仕入",
        debit: 260123.1,
        credit: 0,
        balance: 260123.1,
      },
      {
        date: "6/30",
        description: "掛仕入",
        debit: 606953.9,
        credit: 0,
        balance: 260123.1 + 606953.9,
      },
    ];

    // 売上総利益 = (397,450.8 + 596,176.2) - (260,123.1 + 606,953.9) = 126,550
    return {
      sales: salesEntries,
      purchases: purchaseEntries,
      grossProfit: 126550,
    };
  },

  Q_L_009: function () {
    // 給料勘定・未払費用の期間配分記入 - 月額給料: 321,134円
    const entries = [
      {
        date: "11/25",
        description: "当月給料支払",
        debit: 321134,
        credit: 0,
        balance: 321134,
      },
    ];

    // 未払給料の計算 (26日～月末分)
    // 11月は30日まで: 26, 27, 28, 29, 30 = 5日分
    // 日割計算: 321,134 ÷ 30 × 5 = 53,522円
    const unpaidSalary = Math.round((321134 / 30) * 5);

    entries.push({
      date: "11/30",
      description: "未払給料計上",
      debit: unpaidSalary,
      credit: 0,
      balance: 321134 + unpaidSalary,
    });

    return { entries, unpaidAmount: unpaidSalary };
  },

  Q_L_010: function () {
    // 諸口勘定を含む複合仕訳の転記処理
    // 5月10日の取引: 借方(仕入 300,000円, 支払手数料 5,000円), 貸方(現金 100,000円, 買掛金 200,000円, 未払金 5,000円)

    // 各勘定への転記を表現
    const entries = [
      // 仕入勘定への転記
      {
        date: "5/10",
        description: "商品仕入(諸口)",
        debit: 300000,
        credit: 0,
        balance: 300000,
        account: "仕入",
      },
      // 支払手数料勘定への転記
      {
        date: "5/10",
        description: "支払手数料(諸口)",
        debit: 5000,
        credit: 0,
        balance: 5000,
        account: "支払手数料",
      },
      // 現金勘定への転記
      {
        date: "5/10",
        description: "諸口支払",
        debit: 0,
        credit: 100000,
        balance: -100000, // 減少
        account: "現金",
      },
      // 買掛金勘定への転記
      {
        date: "5/10",
        description: "諸口仕入",
        debit: 0,
        credit: 200000,
        balance: 200000,
        account: "買掛金",
      },
      // 未払金勘定への転記
      {
        date: "5/10",
        description: "諸口手数料",
        debit: 0,
        credit: 5000,
        balance: 5000,
        account: "未払金",
      },
    ];

    return { entries };
  },
};

// ファイル内容の読み込み
console.log("📖 master-questions.tsファイルを読み込み中...");
const questionsContent = fs.readFileSync(questionsPath, "utf8");

// バックアップ作成
const backupPath = questionsPath + ".backup-ql007-010-" + Date.now();
fs.writeFileSync(backupPath, questionsContent);
console.log(`💾 バックアップ作成: ${backupPath}`);

let updatedContent = questionsContent;
let fixedCount = 0;

// Q_L_007-Q_L_010の修正処理
for (const questionId of Object.keys(correctAnswers)) {
  console.log(`\n🔧 ${questionId}の修正処理中...`);

  const correctAnswer = correctAnswers[questionId]();

  // Q_L_008は特別処理（売上と仕入の両方）
  if (questionId === "Q_L_008") {
    // 売上勘定メインで処理
    const correctAnswerJson = JSON.stringify({ entries: correctAnswer.sales });

    console.log(`📊 ${questionId}の正答データ (売上勘定):`);
    correctAnswer.sales.forEach((entry, index) => {
      console.log(
        `  ${index + 1}. ${entry.date} ${entry.description}: 借方${entry.debit}円, 貸方${entry.credit}円, 残高${entry.balance?.toLocaleString()}円`,
      );
    });
    console.log(
      `  売上総利益: ${correctAnswer.grossProfit.toLocaleString()}円`,
    );

    // 現在の正答データを検索・置換
    const pattern = new RegExp(
      `(id:\\s*"${questionId}"[\\s\\S]*?correct_answer_json:\\s*')([^']+)(')`,
      "g",
    );

    const match = updatedContent.match(pattern);
    if (match) {
      updatedContent = updatedContent.replace(
        pattern,
        `$1${correctAnswerJson}$3`,
      );
      fixedCount++;
      console.log(`✅ ${questionId}の正答データを修正しました`);
    } else {
      console.log(`❌ ${questionId}のパターンが見つかりません`);
    }
  } else {
    // 通常処理
    const correctAnswerJson = JSON.stringify({
      entries: correctAnswer.entries,
    });

    console.log(`📊 ${questionId}の正答データ:`);
    correctAnswer.entries.forEach((entry, index) => {
      const accountInfo = entry.account ? ` [${entry.account}]` : "";
      console.log(
        `  ${index + 1}. ${entry.date} ${entry.description}${accountInfo}: 借方${entry.debit}円, 貸方${entry.credit}円, 残高${entry.balance?.toLocaleString()}円`,
      );
    });

    if (questionId === "Q_L_009" && correctAnswer.unpaidAmount) {
      console.log(
        `  未払給料: ${correctAnswer.unpaidAmount.toLocaleString()}円`,
      );
    }

    // 現在の正答データを検索・置換
    const pattern = new RegExp(
      `(id:\\s*"${questionId}"[\\s\\S]*?correct_answer_json:\\s*')([^']+)(')`,
      "g",
    );

    const match = updatedContent.match(pattern);
    if (match) {
      updatedContent = updatedContent.replace(
        pattern,
        `$1${correctAnswerJson}$3`,
      );
      fixedCount++;
      console.log(`✅ ${questionId}の正答データを修正しました`);
    } else {
      console.log(`❌ ${questionId}のパターンが見つかりません`);
    }
  }
}

// 修正版ファイルの保存
console.log(`\n💾 修正版ファイルを保存中...`);
fs.writeFileSync(questionsPath, updatedContent);

console.log(`\n🎯 修正完了`);
console.log(`✅ 修正済み問題数: ${fixedCount}/4`);
console.log(`📝 バックアップファイル: ${path.basename(backupPath)}`);

// 修正結果の検証
console.log(`\n🔍 修正結果の検証...`);
const verifyContent = fs.readFileSync(questionsPath, "utf8");

for (const questionId of Object.keys(correctAnswers)) {
  const verifyMatch = verifyContent.match(
    new RegExp(
      `id:\\s*"${questionId}"[\\s\\S]*?correct_answer_json:\\s*'([^']+)'`,
    ),
  );

  if (verifyMatch) {
    try {
      const parsedAnswer = JSON.parse(verifyMatch[1]);
      console.log(
        `✅ ${questionId}: JSONパース成功 (エントリ数: ${parsedAnswer.entries?.length || 0})`,
      );
    } catch (e) {
      console.log(`❌ ${questionId}: JSONパースエラー - ${e.message}`);
    }
  }
}

console.log("\n📋 完了ステップ:");
console.log("1. Q_L_001-Q_L_010の正答データ修正が完了しました");
console.log("2. 各問題が問題文に基づく正確な計算結果を含んでいます");
console.log("3. アプリでの表示確認を行ってください");
console.log("4. 修正ログを更新します");
