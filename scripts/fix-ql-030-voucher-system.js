const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_030（5伝票制問題）の修正スクリプト\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

// 5伝票制の正しい問題データ
const fixedQ_L_030 = {
  questionText: `【5伝票制：総勘定元帳記入問題】

A商店は5伝票制を採用しています。2025年8月の以下の取引について、現金勘定の元帳記入を行ってください。

【前月繰越】
現金残高：450,000円

【8月の取引】
8月5日　商品売上（現金）　605,681円
8月12日　商品仕入（現金支払）　700,622円
8月18日　売掛金回収（現金）　764,578円
8月25日　買掛金支払（現金）　320,000円
8月30日　備品購入（現金支払）　180,000円

【作成指示】
1. 5伝票制の特徴を理解して記入
2. 現金の増加・減少を正確に記録
3. 各取引の摘要を適切に記載
4. 残高の計算確認`,

  // 正答データ生成（現金勘定の動き）
  correctAnswer: {
    entries: [
      {
        date: "8/1",
        description: "前月繰越",
        debit: 450000,
        credit: 0,
        balance: 450000,
      },
      {
        date: "8/5",
        description: "現金売上",
        debit: 605681,
        credit: 0,
        balance: 1055681,
      },
      {
        date: "8/12",
        description: "商品仕入",
        debit: 0,
        credit: 700622,
        balance: 355059,
      },
      {
        date: "8/18",
        description: "売掛金回収",
        debit: 764578,
        credit: 0,
        balance: 1119637,
      },
      {
        date: "8/25",
        description: "買掛金支払",
        debit: 0,
        credit: 320000,
        balance: 799637,
      },
      {
        date: "8/30",
        description: "備品購入",
        debit: 0,
        credit: 180000,
        balance: 619637,
      },
    ],
  },
};

console.log("📊 Q_L_030の修正内容:");
console.log("- 5伝票制の実際の取引を設定");
console.log("- 現金勘定の動きを明確化");
console.log("- 実在する日付に修正");
console.log(`- 取引数: ${fixedQ_L_030.correctAnswer.entries.length}件`);
console.log(
  `- 最終残高: ${fixedQ_L_030.correctAnswer.entries[fixedQ_L_030.correctAnswer.entries.length - 1].balance.toLocaleString()}円\n`,
);

let questionsContent = fs.readFileSync(questionsPath, "utf8");

// バックアップ作成
const backupPath = questionsPath + ".backup-ql030-" + Date.now();
fs.writeFileSync(backupPath, questionsContent);
console.log(`バックアップ作成: ${path.basename(backupPath)}\n`);

// 問題文の置換
const questionRegex = new RegExp(
  `(id: "Q_L_030",[\\s\\S]*?question_text:\\s*")([\\s\\S]*?)(",)`,
  "g",
);

if (questionsContent.match(questionRegex)) {
  questionsContent = questionsContent.replace(
    questionRegex,
    `$1${fixedQ_L_030.questionText}$3`,
  );
  console.log("✅ Q_L_030の問題文を修正しました");
}

// 正答データの置換
const correctAnswerJson = JSON.stringify(fixedQ_L_030.correctAnswer);
const answerRegex = new RegExp(
  `(id: "Q_L_030",[\\s\\S]*?correct_answer_json:\\s*')([^']*)(')`,
  "g",
);

if (questionsContent.match(answerRegex)) {
  questionsContent = questionsContent.replace(
    answerRegex,
    `$1${correctAnswerJson}$3`,
  );
  console.log("✅ Q_L_030の正答データを修正しました");
}

// 修正版を保存
fs.writeFileSync(questionsPath, questionsContent);

console.log("\n🎯 Q_L_030修正完了");
console.log("- 5伝票制の具体的取引内容を設定");
console.log("- 現金勘定の正確な動きを反映");
console.log("- 問題文の金額と正答の整合性確保");
console.log("- 実在する日付を使用（8/33→8/30等）");
