/**
 * 模試システムの動作テスト
 */

console.log("🧪 模試システムテスト開始");

async function testMockExamSystem() {
  try {
    // 1. 基本モジュールのインポート確認
    console.log("\n1️⃣ モジュールインポート確認:");

    try {
      const sampleMockExams = require("./src/data/sample-mock-exams");
      console.log("✅ sample-mock-exams.ts - インポート成功");
      console.log(
        `   - 模試定義数: ${sampleMockExams.sampleMockExams?.length || 0}`,
      );

      if (
        sampleMockExams.sampleMockExams &&
        sampleMockExams.sampleMockExams.length > 0
      ) {
        const firstExam = sampleMockExams.sampleMockExams[0];
        console.log(`   - 最初の模試: ${firstExam.name} (${firstExam.id})`);

        // 構造解析
        const structure = JSON.parse(firstExam.structure_json);
        console.log(
          `   - 第1問問題数: ${structure.section1?.questions?.length || 0}`,
        );
        if (structure.section1?.questions) {
          console.log(
            `   - 問題ID例: ${structure.section1.questions.slice(0, 3).join(", ")}`,
          );
        }
      }
    } catch (error) {
      console.log(`❌ sample-mock-exams.ts - エラー: ${error.message}`);
    }

    // 2. 問題データの確認
    console.log("\n2️⃣ 問題データ確認:");
    try {
      const sampleQuestions = require("./src/data/sample-questions");
      if (sampleQuestions.sampleQuestions) {
        console.log(
          `✅ sample-questions.ts - 問題数: ${sampleQuestions.sampleQuestions.length}`,
        );

        // 仕訳問題を確認
        const journalQuestions = sampleQuestions.sampleQuestions.filter((q) =>
          q.id.startsWith("Q_J_"),
        );
        console.log(`   - 仕訳問題: ${journalQuestions.length}問`);

        // 特定のIDをチェック
        const testIds = ["Q_J_001", "Q_J_015", "Q_J_025"];
        testIds.forEach((id) => {
          const exists = sampleQuestions.sampleQuestions.some(
            (q) => q.id === id,
          );
          console.log(`   - ${id}: ${exists ? "存在" : "未存在"}`);
        });
      }
    } catch (error) {
      console.log(`❌ sample-questions.ts - エラー: ${error.message}`);
    }

    // 3. サンプル模試実行フロー
    console.log("\n3️⃣ 模試実行フロー確認:");
    console.log("✅ 想定フロー:");
    console.log("   1. ホーム → CBT模擬試験");
    console.log("   2. 模試一覧表示 (5つ)");
    console.log("   3. 模試選択 → 確認ダイアログ");
    console.log("   4. 開始 → 問題データ読み込み");
    console.log("   5. 仕訳入力フォーム表示");

    console.log("\n🔍 考えられる問題:");
    console.log("   - データベース初期化未完了");
    console.log("   - 問題データの読み込み失敗");
    console.log("   - モジュール解決エラー");
  } catch (error) {
    console.error("❌ システムテストエラー:", error);
  }
}

// 実行
testMockExamSystem();
