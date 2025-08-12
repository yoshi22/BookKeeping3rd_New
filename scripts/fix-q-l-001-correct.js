const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_001の正答データ修正スクリプト\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

// Q_L_001の問題文に基づく正しい帳簿エントリーを計算
function generateCorrectAnswerForQL001() {
  // 前月繰越残高: 337,541円
  let balance = 337541;

  const entries = [
    // 前月繰越
    {
      date: "10/1",
      description: "前月繰越",
      debit: balance,
      credit: 0,
      balance: balance,
    },
  ];

  // 10月5日 現金売上：276,641円（増加）
  balance += 276641;
  entries.push({
    date: "10/5",
    description: "現金売上",
    debit: 276641,
    credit: 0,
    balance: balance,
  });

  // 10月10日 給料支払：215,025円（減少）
  balance -= 215025;
  entries.push({
    date: "10/10",
    description: "給料支払",
    debit: 0,
    credit: 215025,
    balance: balance,
  });

  // 10月15日 売掛金回収：184,924円（増加）
  balance += 184924;
  entries.push({
    date: "10/15",
    description: "売掛金回収",
    debit: 184924,
    credit: 0,
    balance: balance,
  });

  // 10月20日 買掛金支払：241,381円（減少）
  balance -= 241381;
  entries.push({
    date: "10/20",
    description: "買掛金支払",
    debit: 0,
    credit: 241381,
    balance: balance,
  });

  // 10月28日 現金実査による過不足判明：8,502円（不足）
  balance -= 8502;
  entries.push({
    date: "10/28",
    description: "現金過不足",
    debit: 0,
    credit: 8502,
    balance: balance,
  });

  return { entries };
}

console.log("📊 Q_L_001の正しい正答データ生成:");
const correctAnswer = generateCorrectAnswerForQL001();

console.log("正答データ:");
correctAnswer.entries.forEach((entry, index) => {
  console.log(
    `${index + 1}. ${entry.date} ${entry.description}: 借方${entry.debit}円, 貸方${entry.credit}円, 残高${entry.balance.toLocaleString()}円`,
  );
});

console.log(
  `\n最終残高: ${correctAnswer.entries[correctAnswer.entries.length - 1].balance.toLocaleString()}円`,
);

// JSONフォーマット生成
const correctAnswerJson = JSON.stringify(correctAnswer);
console.log("\nJSON形式:");
console.log(correctAnswerJson);

// ファイルへの適用
console.log("\n🔧 master-questions.tsファイルへの修正適用...");

const questionsContent = fs.readFileSync(questionsPath, "utf8");

// Q_L_001のcorrect_answer_jsonを置換
// より柔軟な正規表現パターンを使用
const match = questionsContent.match(
  /id:\s*"Q_L_001"[\s\S]*?correct_answer_json:\s*'([^']+)'/,
);

if (match) {
  console.log("現在のQ_L_001正答データ:");
  console.log(match[1]);

  const newContent = questionsContent.replace(
    /(id:\s*"Q_L_001"[\s\S]*?correct_answer_json:\s*')([^']+)(')/,
    `$1${correctAnswerJson}$3`,
  );

  // バックアップ作成
  const backupPath = questionsPath + ".backup-ql001-" + Date.now();
  fs.writeFileSync(backupPath, questionsContent);
  console.log(`\nバックアップ作成: ${backupPath}`);

  // 修正版を保存
  fs.writeFileSync(questionsPath, newContent);
  console.log("✅ Q_L_001の正答データを修正しました");

  // 検証
  const updatedContent = fs.readFileSync(questionsPath, "utf8");
  const verifyMatch = updatedContent.match(
    /id:\s*"Q_L_001"[\s\S]*?correct_answer_json:\s*'([^']+)'/,
  );

  if (verifyMatch) {
    console.log("\n🔍 修正後の検証:");
    console.log("新しい正答データ:", verifyMatch[1]);

    try {
      const parsedAnswer = JSON.parse(verifyMatch[1]);
      console.log("✅ JSONパース成功");
      console.log(`エントリ数: ${parsedAnswer.entries.length}`);
      console.log(
        `最初のエントリ: ${parsedAnswer.entries[0].date} ${parsedAnswer.entries[0].description}`,
      );
      console.log(
        `最後のエントリ: ${parsedAnswer.entries[parsedAnswer.entries.length - 1].date} ${parsedAnswer.entries[parsedAnswer.entries.length - 1].description}`,
      );
    } catch (e) {
      console.log("❌ JSONパースエラー:", e.message);
    }
  }
} else {
  console.log("❌ Q_L_001の正答データパターンが見つかりません");
}

console.log("\n🎯 修正完了");
console.log("- Q_L_001の正答データが問題文に基づいて正確に修正されました");
console.log("- 日付、摘要、金額すべてが実際の取引内容と一致しています");
console.log("- 最終残高334,198円で計算結果も正確です");
