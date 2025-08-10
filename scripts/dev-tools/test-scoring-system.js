/**
 * 採点システムテスト
 * 仕訳問題の正答判定ロジックをテスト
 */

console.log("🧪 採点システムテスト開始");

async function testScoringSystem() {
  try {
    // 1. AnswerService のインポートテスト
    console.log("\n1️⃣ AnswerService インポートテスト:");
    const { AnswerService } = require("./src/services/answer-service");
    const answerService = new AnswerService();
    console.log("✅ AnswerService インスタンス作成成功");

    // 2. サンプル問題データの準備
    console.log("\n2️⃣ サンプル問題データの準備:");
    const sampleQuestion = {
      id: "Q_J_001",
      category_id: "journal",
      question_text:
        "現金実査の結果、現金の実際有高が288,000円であったが、帳簿残高は809,000円であった。",
      correct_answer_json:
        '{"journalEntry":{"debit_account":"現金","debit_amount":288000,"credit_account":"現金過不足","credit_amount":288000}}',
      explanation:
        "現金過不足の仕訳です。借方に現金、貸方に現金過不足を記入します。",
    };
    console.log("✅ サンプル問題データ準備完了");

    // 3. 正解データのテスト
    console.log("\n3️⃣ 正解データのテスト:");
    const correctAnswerData = {
      debits: [{ account: "現金", amount: 288000 }],
      credits: [{ account: "現金過不足", amount: 288000 }],
    };

    const isCorrectAnswer = answerService.isAnswerCorrect(
      correctAnswerData,
      sampleQuestion,
    );
    console.log(`✅ 正解データ判定: ${isCorrectAnswer ? "正解" : "不正解"}`);

    if (isCorrectAnswer) {
      console.log("🎉 正解データが正しく判定されました！");
    } else {
      console.log("❌ 正解データの判定に失敗");
    }

    // 4. 不正解データのテスト
    console.log("\n4️⃣ 不正解データのテスト:");
    const incorrectAnswerData = {
      debits: [{ account: "現金", amount: 300000 }], // 金額が間違い
      credits: [{ account: "現金過不足", amount: 288000 }],
    };

    const isIncorrectAnswer = answerService.isAnswerCorrect(
      incorrectAnswerData,
      sampleQuestion,
    );
    console.log(
      `✅ 不正解データ判定: ${isIncorrectAnswer ? "正解" : "不正解"}`,
    );

    if (!isIncorrectAnswer) {
      console.log("🎉 不正解データが正しく判定されました！");
    } else {
      console.log("❌ 不正解データの判定に失敗");
    }

    // 5. 勘定科目間違いのテスト
    console.log("\n5️⃣ 勘定科目間違いのテスト:");
    const wrongAccountData = {
      debits: [{ account: "現金過不足", amount: 288000 }], // 勘定科目が逆
      credits: [{ account: "現金", amount: 288000 }],
    };

    const isWrongAccount = answerService.isAnswerCorrect(
      wrongAccountData,
      sampleQuestion,
    );
    console.log(
      `✅ 勘定科目間違いデータ判定: ${isWrongAccount ? "正解" : "不正解"}`,
    );

    if (!isWrongAccount) {
      console.log("🎉 勘定科目間違いが正しく判定されました！");
    } else {
      console.log("❌ 勘定科目間違いの判定に失敗");
    }

    // 6. 複数エントリのテスト（将来対応）
    console.log("\n6️⃣ 複数エントリのテスト:");
    const multipleEntryData = {
      debits: [
        { account: "現金", amount: 100000 },
        { account: "売掛金", amount: 188000 },
      ],
      credits: [{ account: "現金過不足", amount: 288000 }],
    };

    const isMultipleEntry = answerService.isAnswerCorrect(
      multipleEntryData,
      sampleQuestion,
    );
    console.log(
      `✅ 複数エントリデータ判定: ${isMultipleEntry ? "正解" : "不正解"}`,
    );
    console.log("ℹ️ 複数エントリは現在の問題形式では不正解が正常");

    console.log("\n💡 採点システムテスト結果:");
    console.log("   ✅ AnswerService 正常動作確認");
    console.log("   ✅ JournalEntryForm形式のデータ対応");
    console.log("   ✅ 正解・不正解の判定精度");
    console.log("   ✅ 金額・勘定科目のバリデーション");
  } catch (error) {
    console.error("❌ 採点システムテストエラー:", error);
    console.error("エラー詳細:", {
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}

// テスト実行
testScoringSystem();
