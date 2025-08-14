/**
 * 試算表問題の表示テスト
 * データベースから試算表問題を取得して表示をテスト
 */
const { databaseService } = require("../src/data/database");

async function testTrialBalanceDisplay() {
  try {
    console.log("=== 試算表問題表示テスト ===\n");

    // データベース初期化
    await databaseService.getDatabase();

    // 試算表問題Q_T_001を取得
    const result = await databaseService.executeSql(
      `SELECT id, question_text, correct_answer_json, answer_template_json 
       FROM questions 
       WHERE id = 'Q_T_001'`,
      [],
    );

    if (result.rows.length === 0) {
      console.log("❌ Q_T_001がデータベースに存在しません");

      // すべての問題IDをチェック
      const allQuestions = await databaseService.executeSql(
        `SELECT id FROM questions ORDER BY id`,
        [],
      );
      console.log("\n=== データベース内の問題ID一覧 ===");
      console.log(`問題数: ${allQuestions.rows.length}`);
      if (allQuestions.rows.length > 0) {
        console.log("最初の10件:");
        allQuestions.rows.slice(0, 10).forEach((row) => {
          console.log(`  - ${row.id}`);
        });
      }
      return;
    }

    const question = result.rows[0];
    console.log("問題ID:", question.id);
    console.log(
      "問題文（最初の50文字）:",
      question.question_text.substring(0, 50) + "...",
    );

    // correct_answer_jsonの確認
    console.log("\n=== 正答データ ===");
    console.log("correct_answer_json存在:", !!question.correct_answer_json);

    if (question.correct_answer_json) {
      console.log("JSONデータ長さ:", question.correct_answer_json.length);

      try {
        const correctAnswer = JSON.parse(question.correct_answer_json);
        console.log("パース成功");
        console.log("データ形式:", Object.keys(correctAnswer));

        if (correctAnswer.entries) {
          console.log("\n✅ entries形式のデータが存在");
          console.log("エントリ数:", correctAnswer.entries.length);

          if (correctAnswer.entries.length > 0) {
            console.log("\n最初の3エントリ:");
            correctAnswer.entries.slice(0, 3).forEach((entry, index) => {
              console.log(`\nエントリ ${index + 1}:`);
              console.log(`  勘定科目: ${entry.accountName}`);
              console.log(`  借方金額: ${entry.debitAmount}`);
              console.log(`  貸方金額: ${entry.creditAmount}`);
            });

            // 合計計算
            const totalDebit = correctAnswer.entries.reduce(
              (sum, e) => sum + (e.debitAmount || 0),
              0,
            );
            const totalCredit = correctAnswer.entries.reduce(
              (sum, e) => sum + (e.creditAmount || 0),
              0,
            );
            console.log("\n借方合計:", totalDebit);
            console.log("貸方合計:", totalCredit);
            console.log(
              "バランス:",
              totalDebit === totalCredit ? "✅ 一致" : "❌ 不一致",
            );
          }
        } else {
          console.log("❌ entries形式のデータが存在しません");
          console.log("実際のデータ:", JSON.stringify(correctAnswer, null, 2));
        }
      } catch (e) {
        console.log("❌ JSONパースエラー:", e.message);
        console.log(
          "生データ（最初の200文字）:",
          question.correct_answer_json.substring(0, 200),
        );
      }
    } else {
      console.log("❌ correct_answer_jsonが空またはnull");
    }

    // answer_template_jsonの確認
    console.log("\n=== テンプレートデータ ===");
    if (question.answer_template_json) {
      try {
        const template = JSON.parse(question.answer_template_json);
        console.log("テンプレートタイプ:", template.type);
        if (template.type !== "trial_balance") {
          console.log("⚠️ テンプレートタイプが trial_balance ではありません");
        }
      } catch (e) {
        console.log("❌ テンプレートJSONパースエラー:", e.message);
      }
    }
  } catch (error) {
    console.error("エラー:", error);
  } finally {
    process.exit(0);
  }
}

testTrialBalanceDisplay();
