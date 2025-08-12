const fs = require("fs");
const path = require("path");

console.log("🔍 Q_L_011〜Q_L_040修正内容の検証スクリプト\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

// 検証対象の問題ID
const ledgerProblems = [
  "Q_L_011",
  "Q_L_012",
  "Q_L_013",
  "Q_L_014",
  "Q_L_015",
  "Q_L_016",
  "Q_L_017",
  "Q_L_018",
  "Q_L_019",
  "Q_L_020",
];

const voucherProblems = ["Q_L_030"];

const theoryProblems = [
  "Q_L_031",
  "Q_L_032",
  "Q_L_033",
  "Q_L_034",
  "Q_L_035",
  "Q_L_036",
  "Q_L_037",
  "Q_L_038",
  "Q_L_039",
  "Q_L_040",
];

let questionsContent = fs.readFileSync(questionsPath, "utf8");

console.log("📊 検証結果:\n");

// 1. Q_L_011-Q_L_020（帳簿記入問題）の検証
console.log("🏦 【帳簿記入問題 Q_L_011-Q_L_020】");
let ledgerPassCount = 0;

ledgerProblems.forEach((problemId) => {
  console.log(`\n🔧 ${problemId}の検証中...`);

  // 問題文に具体的な取引内容があるかチェック
  const questionRegex = new RegExp(
    `id: "${problemId}",[\\s\\S]*?question_text:\\s*"([\\s\\S]*?)"`,
    "g",
  );
  const questionMatch = questionRegex.exec(questionsContent);

  if (questionMatch) {
    const questionText = questionMatch[1];
    const hasSpecificContent =
      !questionText.includes("複数の収入・支出取引（詳細は問題文参照）") &&
      questionText.includes("円") &&
      questionText.includes("月") &&
      questionText.length > 200;

    console.log(
      `  📝 問題文: ${hasSpecificContent ? "✅ 具体的な内容" : "❌ 汎用テンプレート"}`,
    );

    // 正答データに実際のデータがあるかチェック
    const answerRegex = new RegExp(
      `id: "${problemId}",[\\s\\S]*?correct_answer_json:\\s*'([^']*)'`,
      "g",
    );
    const answerMatch = answerRegex.exec(questionsContent);

    if (answerMatch) {
      const answerJson = answerMatch[1];
      try {
        const answerData = JSON.parse(answerJson);
        const hasValidEntries =
          answerData.entries &&
          answerData.entries.length > 1 &&
          !answerJson.includes('"date":"2025-08-11"') &&
          !answerJson.includes('"description":"ledgerEntry"');

        console.log(
          `  💰 正答データ: ${hasValidEntries ? "✅ 実際のデータ" : "❌ 汎用テンプレート"}`,
        );
        console.log(
          `  📊 エントリ数: ${answerData.entries ? answerData.entries.length : 0}件`,
        );

        if (hasSpecificContent && hasValidEntries) {
          ledgerPassCount++;
          console.log(`  🎯 ${problemId}: 修正完了`);
        } else {
          console.log(`  ⚠️ ${problemId}: 修正不完全`);
        }
      } catch (e) {
        console.log(`  ❌ 正答データ: JSONパースエラー`);
      }
    }
  }

  // 元のregexの位置をリセット
  questionRegex.lastIndex = 0;
});

console.log(
  `\n📈 帳簿記入問題の修正状況: ${ledgerPassCount}/${ledgerProblems.length}問完了`,
);

// 2. Q_L_030（5伝票制問題）の検証
console.log("\n\n🎫 【5伝票制問題 Q_L_030】");
let voucherPassCount = 0;

voucherProblems.forEach((problemId) => {
  console.log(`\n🔧 ${problemId}の検証中...`);

  const questionRegex = new RegExp(
    `id: "${problemId}",[\\s\\S]*?question_text:\\s*"([\\s\\S]*?)"`,
    "g",
  );
  const questionMatch = questionRegex.exec(questionsContent);

  if (questionMatch) {
    const questionText = questionMatch[1];
    const hasVoucherContent =
      questionText.includes("5伝票制") &&
      questionText.includes("現金") &&
      questionText.includes("前月繰越") &&
      questionText.length > 300;

    console.log(
      `  📝 問題文: ${hasVoucherContent ? "✅ 5伝票制の具体的内容" : "❌ 内容不十分"}`,
    );

    const answerRegex = new RegExp(
      `id: "${problemId}",[\\s\\S]*?correct_answer_json:\\s*'([^']*)'`,
      "g",
    );
    const answerMatch = answerRegex.exec(questionsContent);

    if (answerMatch) {
      const answerJson = answerMatch[1];
      try {
        const answerData = JSON.parse(answerJson);
        const hasValidDates =
          !answerJson.includes('"date":"8/33"') &&
          !answerJson.includes('"date":"8/40"');

        console.log(
          `  📅 日付: ${hasValidDates ? "✅ 実在する日付" : "❌ 不可能な日付"}`,
        );
        console.log(
          `  📊 エントリ数: ${answerData.entries ? answerData.entries.length : 0}件`,
        );

        if (hasVoucherContent && hasValidDates) {
          voucherPassCount++;
          console.log(`  🎯 ${problemId}: 修正完了`);
        }
      } catch (e) {
        console.log(`  ❌ 正答データ: JSONパースエラー`);
      }
    }
  }

  questionRegex.lastIndex = 0;
});

console.log(
  `\n📈 5伝票制問題の修正状況: ${voucherPassCount}/${voucherProblems.length}問完了`,
);

// 3. Q_L_031-Q_L_040（理論問題）の検証
console.log("\n\n📚 【理論問題 Q_L_031-Q_L_040】");
let theoryPassCount = 0;

theoryProblems.forEach((problemId) => {
  console.log(`\n🔧 ${problemId}の検証中...`);

  // テンプレートがmultiple_choiceに変更されているかチェック
  const templateRegex = new RegExp(
    `id: "${problemId}",[\\s\\S]*?answer_template_json:\\s*'([^']*)'`,
    "g",
  );
  const templateMatch = templateRegex.exec(questionsContent);

  if (templateMatch) {
    const templateJson = templateMatch[1];
    const isMultipleChoice = templateJson.includes('"type":"multiple_choice"');
    console.log(
      `  🎯 テンプレート: ${isMultipleChoice ? "✅ multiple_choice" : "❌ まだledger_entry"}`,
    );

    if (isMultipleChoice) {
      const hasDropdowns = templateJson.includes('"type":"dropdown"');
      console.log(
        `  📋 フィールド: ${hasDropdowns ? "✅ dropdown形式" : "❌ 形式不正"}`,
      );
    }
  }

  // 正答データが選択肢形式に変更されているかチェック
  const answerRegex = new RegExp(
    `id: "${problemId}",[\\s\\S]*?correct_answer_json:\\s*'([^']*)'`,
    "g",
  );
  const answerMatch = answerRegex.exec(questionsContent);

  if (answerMatch) {
    const answerJson = answerMatch[1];
    try {
      const answerData = JSON.parse(answerJson);
      const hasChoiceAnswers =
        answerData.answers &&
        answerData.answers.ア &&
        answerData.answers.イ &&
        answerData.answers.ウ &&
        answerData.answers.エ &&
        !answerJson.includes('"entries":[') &&
        !answerJson.includes('"date":"8/33"');

      console.log(
        `  ✅ 正答形式: ${hasChoiceAnswers ? "✅ 選択肢形式" : "❌ まだ帳簿形式"}`,
      );

      if (templateMatch && answerMatch) {
        const templateIsCorrect = templateMatch[1].includes(
          '"type":"multiple_choice"',
        );
        if (templateIsCorrect && hasChoiceAnswers) {
          theoryPassCount++;
          console.log(`  🎯 ${problemId}: 修正完了`);
        }
      }
    } catch (e) {
      console.log(`  ❌ 正答データ: JSONパースエラー`);
    }
  }

  // regex位置リセット
  templateRegex.lastIndex = 0;
  answerRegex.lastIndex = 0;
});

console.log(
  `\n📈 理論問題の修正状況: ${theoryPassCount}/${theoryProblems.length}問完了`,
);

// 総合結果
const totalProblems =
  ledgerProblems.length + voucherProblems.length + theoryProblems.length;
const totalPassed = ledgerPassCount + voucherPassCount + theoryPassCount;

console.log("\n\n🎯 【総合検証結果】");
console.log(
  `- 帳簿記入問題（Q_L_011-020）: ${ledgerPassCount}/${ledgerProblems.length}問 ${ledgerPassCount === ledgerProblems.length ? "✅" : "⚠️"}`,
);
console.log(
  `- 5伝票制問題（Q_L_030）: ${voucherPassCount}/${voucherProblems.length}問 ${voucherPassCount === voucherProblems.length ? "✅" : "⚠️"}`,
);
console.log(
  `- 理論問題（Q_L_031-040）: ${theoryPassCount}/${theoryProblems.length}問 ${theoryPassCount === theoryProblems.length ? "✅" : "⚠️"}`,
);
console.log(
  `\n🏆 全体的な修正成功率: ${totalPassed}/${totalProblems}問 (${((totalPassed / totalProblems) * 100).toFixed(1)}%)`,
);

if (totalPassed === totalProblems) {
  console.log("\n🎉 すべての修正が正常に完了しています！");
  console.log("✅ 学習機能が完全に回復しました");
} else {
  console.log(`\n⚠️ ${totalProblems - totalPassed}問に修正が必要です`);
}
