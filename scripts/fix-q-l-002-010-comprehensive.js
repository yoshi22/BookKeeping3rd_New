const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_002-Q_L_010の正答データ包括修正スクリプト\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

// 各問題の正しい正答データを生成
const correctAnswers = {
  Q_L_002: function () {
    // 売掛金勘定記入問題 - 前月繰越: 564,069円
    let balance = 564069;
    const entries = [
      {
        date: "1/1",
        description: "前月繰越",
        debit: balance,
        credit: 0,
        balance: balance,
      },
    ];

    // 1月3日 掛売上：190,909円
    balance += 190909;
    entries.push({
      date: "1/3",
      description: "掛売上",
      debit: 190909,
      credit: 0,
      balance: balance,
    });

    // 1月8日 現金回収：51,829円
    balance -= 51829;
    entries.push({
      date: "1/8",
      description: "現金回収",
      debit: 0,
      credit: 51829,
      balance: balance,
    });

    // 1月15日 掛売上：179,338円
    balance += 179338;
    entries.push({
      date: "1/15",
      description: "掛売上",
      debit: 179338,
      credit: 0,
      balance: balance,
    });

    // 1月22日 手形回収：111,922円
    balance -= 111922;
    entries.push({
      date: "1/22",
      description: "手形回収",
      debit: 0,
      credit: 111922,
      balance: balance,
    });

    // 1月28日 貸倒発生：35,813円 (貸倒引当金30,000円充当、不足分は貸倒損失)
    balance -= 35813;
    entries.push({
      date: "1/28",
      description: "貸倒損失",
      debit: 0,
      credit: 35813,
      balance: balance,
    });

    return { entries };
  },

  Q_L_003: function () {
    // 商品勘定記入問題（三分法） - 期首商品棚卸高: 914,556円
    const entries = [
      {
        date: "10/1",
        description: "期首商品棚卸高",
        debit: 914556,
        credit: 0,
        balance: 914556,
      },
      {
        date: "10/31",
        description: "当月仕入高",
        debit: 1404670,
        credit: 0,
        balance: 914556 + 1404670,
      },
      {
        date: "10/31",
        description: "期末商品棚卸高",
        debit: 0,
        credit: 558925,
        balance: 914556 + 1404670 - 558925,
      },
    ];

    // 売上原価 = 期首 + 仕入 - 期末 = 914,556 + 1,404,670 - 558,925 = 1,760,301

    return { entries };
  },

  Q_L_004: function () {
    // 建物勘定・減価償却累計額勘定記入問題
    // 取得原価: 4,960,026円, 耐用年数: 20年, 定額法, 使用19年経過
    // 年間減価償却費 = 4,960,026 ÷ 20 = 248,001円
    const entries = [
      {
        date: "3/31",
        description: "減価償却費",
        debit: 248001,
        credit: 0,
        balance: 4960026 - 4464018 - 248001, // 帳簿価額
      },
    ];

    return { entries };
  },

  Q_L_005: function () {
    // 買掛金勘定記入問題 - 前月繰越: 523,589円
    let balance = 523589;
    const entries = [
      {
        date: "11/1",
        description: "前月繰越",
        debit: 0,
        credit: balance,
        balance: balance,
      },
    ];

    // 11月7日 掛仕入：393,285円
    balance += 393285;
    entries.push({
      date: "11/7",
      description: "掛仕入",
      debit: 0,
      credit: 393285,
      balance: balance,
    });

    // 11月14日 現金支払：227,553円
    balance -= 227553;
    entries.push({
      date: "11/14",
      description: "現金支払",
      debit: 227553,
      credit: 0,
      balance: balance,
    });

    // 11月21日 買掛金相殺：66,069円
    balance -= 66069;
    entries.push({
      date: "11/21",
      description: "買掛金相殺",
      debit: 66069,
      credit: 0,
      balance: balance,
    });

    return { entries };
  },

  Q_L_006: function () {
    // 借入金勘定・支払利息勘定記入問題 - 前月繰越: 725,963円
    let balance = 725963;
    const entries = [
      {
        date: "3/1",
        description: "前月繰越",
        debit: 0,
        credit: balance,
        balance: balance,
      },
    ];

    // 3月7日 借入金返済（元本）：227,258円
    balance -= 227258;
    entries.push({
      date: "3/7",
      description: "借入金返済",
      debit: 227258,
      credit: 0,
      balance: balance,
    });

    // 3月21日 追加借入：135,870円
    balance += 135870;
    entries.push({
      date: "3/21",
      description: "追加借入",
      debit: 0,
      credit: 135870,
      balance: balance,
    });

    return { entries };
  },

  // Q_L_007-Q_L_010については問題文を詳細確認してから実装
  Q_L_007: function () {
    // プレースホルダー - 実際の問題文に基づいて後で実装
    return { entries: [] };
  },

  Q_L_008: function () {
    // プレースホルダー - 実際の問題文に基づいて後で実装
    return { entries: [] };
  },

  Q_L_009: function () {
    // プレースホルダー - 実際の問題文に基づいて後で実装
    return { entries: [] };
  },

  Q_L_010: function () {
    // プレースホルダー - 実際の問題文に基づいて後で実装
    return { entries: [] };
  },
};

// ファイル内容の読み込み
console.log("📖 master-questions.tsファイルを読み込み中...");
const questionsContent = fs.readFileSync(questionsPath, "utf8");

// バックアップ作成
const backupPath = questionsPath + ".backup-ql002-010-" + Date.now();
fs.writeFileSync(backupPath, questionsContent);
console.log(`💾 バックアップ作成: ${backupPath}`);

let updatedContent = questionsContent;
let fixedCount = 0;

// Q_L_002-Q_L_010の修正処理
for (const questionId of Object.keys(correctAnswers)) {
  if (
    questionId === "Q_L_007" ||
    questionId === "Q_L_008" ||
    questionId === "Q_L_009" ||
    questionId === "Q_L_010"
  ) {
    console.log(`⏭️  ${questionId} はスキップ（問題文確認後に実装予定）`);
    continue;
  }

  console.log(`\n🔧 ${questionId}の修正処理中...`);

  const correctAnswer = correctAnswers[questionId]();
  const correctAnswerJson = JSON.stringify(correctAnswer);

  console.log(`📊 ${questionId}の正答データ:`);
  correctAnswer.entries.forEach((entry, index) => {
    console.log(
      `  ${index + 1}. ${entry.date} ${entry.description}: 借方${entry.debit}円, 貸方${entry.credit}円, 残高${entry.balance?.toLocaleString()}円`,
    );
  });

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

// 修正版ファイルの保存
console.log(`\n💾 修正版ファイルを保存中...`);
fs.writeFileSync(questionsPath, updatedContent);

console.log(`\n🎯 修正完了`);
console.log(`✅ 修正済み問題数: ${fixedCount}/6`);
console.log(`📝 バックアップファイル: ${path.basename(backupPath)}`);

// 修正結果の検証
console.log(`\n🔍 修正結果の検証...`);
const verifyContent = fs.readFileSync(questionsPath, "utf8");

for (const questionId of Object.keys(correctAnswers)) {
  if (
    questionId === "Q_L_007" ||
    questionId === "Q_L_008" ||
    questionId === "Q_L_009" ||
    questionId === "Q_L_010"
  ) {
    continue;
  }

  const verifyMatch = verifyContent.match(
    new RegExp(
      `id:\\s*"${questionId}"[\\s\\S]*?correct_answer_json:\\s*'([^']+)'`,
    ),
  );

  if (verifyMatch) {
    try {
      const parsedAnswer = JSON.parse(verifyMatch[1]);
      console.log(
        `✅ ${questionId}: JSONパース成功 (エントリ数: ${parsedAnswer.entries.length})`,
      );
    } catch (e) {
      console.log(`❌ ${questionId}: JSONパースエラー - ${e.message}`);
    }
  }
}

console.log("\n📋 次のステップ:");
console.log("1. Q_L_007-Q_L_010の問題文を確認して追加修正実施");
console.log("2. アプリでの表示確認");
console.log("3. 修正ログの更新");
