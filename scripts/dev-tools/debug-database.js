/**
 * データベース状態デバッグスクリプト
 */
const { DatabaseService } = require("./src/data/database");
const {
  MockExamRepository,
} = require("./src/data/repositories/mock-exam-repository");
const {
  QuestionRepository,
} = require("./src/data/repositories/question-repository");

async function debugDatabase() {
  console.log("🔍 データベース状態デバッグ開始");

  try {
    const db = DatabaseService.getInstance();

    // 模試データの確認
    console.log("\n📋 模試データ確認:");
    const mockExamRepo = new MockExamRepository();
    const mockExams = await mockExamRepo.findAll();
    console.log(`模試数: ${mockExams.length}`);

    if (mockExams.length > 0) {
      const firstExam = mockExams[0];
      console.log(`最初の模試: ${firstExam.name} (ID: ${firstExam.id})`);
      console.log(`構造JSON: ${firstExam.structure_json.substring(0, 200)}...`);

      // 構造を解析
      try {
        const structure = JSON.parse(firstExam.structure_json);
        console.log(
          `第1問問題数: ${structure.section1?.questions?.length || 0}`,
        );
        if (structure.section1?.questions) {
          console.log(
            `問題ID例: ${structure.section1.questions.slice(0, 3).join(", ")}`,
          );
        }
      } catch (error) {
        console.log(`❌ 構造JSON解析エラー: ${error.message}`);
      }
    }

    // 問題データの確認
    console.log("\n📝 問題データ確認:");
    const questionRepo = new QuestionRepository();
    const totalQuestions = await db.getFirstRow(
      "SELECT COUNT(*) as count FROM questions",
    );
    console.log(`総問題数: ${totalQuestions.count}`);

    // 仕訳問題の確認
    const journalQuestions = await db.getAllRows(
      "SELECT id, question_text FROM questions WHERE id LIKE 'Q_J_%' LIMIT 5",
    );
    console.log(`仕訳問題サンプル (${journalQuestions.length}件):`);
    journalQuestions.forEach((q, i) => {
      console.log(
        `  ${i + 1}. ${q.id}: ${q.question_text.substring(0, 50)}...`,
      );
    });

    // 特定の問題IDをチェック
    const testQuestionIds = ["Q_J_001", "Q_J_015", "Q_J_025"];
    console.log("\n🎯 特定問題ID確認:");
    for (const id of testQuestionIds) {
      const question = await questionRepo.findById(id);
      console.log(`${id}: ${question ? "存在" : "未存在"}`);
    }
  } catch (error) {
    console.error("❌ デバッグエラー:", error);
  }
}

// 実行
if (require.main === module) {
  debugDatabase();
}
