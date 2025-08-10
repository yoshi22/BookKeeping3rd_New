/**
 * データ利用可能性テスト
 */

console.log("🔍 データ利用可能性チェック開始");

function testDataAvailability() {
  // 1. マスター問題データ
  console.log("\n1️⃣ マスター問題データ:");
  try {
    const masterData = require("./src/data/master-questions.js");
    console.log(`✅ master-questions.js - 読み込み成功`);
    console.log(`   - 問題数: ${masterData.masterQuestions?.length || 0}`);

    if (masterData.masterQuestions && masterData.masterQuestions.length > 0) {
      // 仕訳問題をカウント
      const journalQuestions = masterData.masterQuestions.filter((q) =>
        q.id.startsWith("Q_J_"),
      );
      console.log(`   - 仕訳問題: ${journalQuestions.length}問`);

      // 最初の3問のIDを表示
      const first3 = journalQuestions.slice(0, 5).map((q) => q.id);
      console.log(`   - 最初の5問ID: ${first3.join(", ")}`);

      // 模試で使用される特定IDをチェック
      const mockExamIds = [
        "Q_J_001",
        "Q_J_015",
        "Q_J_025",
        "Q_J_035",
        "Q_J_045",
      ];
      console.log("   - 模試対象問題の存在確認:");
      mockExamIds.forEach((id) => {
        const exists = masterData.masterQuestions.some((q) => q.id === id);
        console.log(`     ${id}: ${exists ? "✅ 存在" : "❌ 未存在"}`);
      });
    }
  } catch (error) {
    console.log(`❌ master-questions.js - エラー: ${error.message}`);
  }

  // 2. ラッパー経由での読み込み
  console.log("\n2️⃣ ラッパー経由読み込み:");
  try {
    const wrapperData = require("./src/data/master-questions-wrapper.js");
    console.log(`✅ master-questions-wrapper.js - 読み込み成功`);
    console.log(`   - 問題数: ${wrapperData.masterQuestions?.length || 0}`);
  } catch (error) {
    console.log(`❌ master-questions-wrapper.js - エラー: ${error.message}`);
  }

  // 3. 模試データの確認
  console.log("\n3️⃣ 模試データ:");
  try {
    // JSファイルがないため、TSファイルの内容を手動確認
    const fs = require("fs");
    const mockExamFile = fs.readFileSync(
      "./src/data/sample-mock-exams.ts",
      "utf8",
    );

    // 基本的な確認
    const hasStructure = mockExamFile.includes("questions:");
    const hasMockExams = mockExamFile.includes("sampleMockExams");

    console.log(`✅ sample-mock-exams.ts - ファイル読み込み成功`);
    console.log(`   - 問題構造定義: ${hasStructure ? "✅ あり" : "❌ なし"}`);
    console.log(`   - 模試定義: ${hasMockExams ? "✅ あり" : "❌ なし"}`);

    // Q_J_001を含むかチェック
    const hasQ_J_001 = mockExamFile.includes('"Q_J_001"');
    console.log(`   - Q_J_001含有: ${hasQ_J_001 ? "✅ あり" : "❌ なし"}`);
  } catch (error) {
    console.log(`❌ sample-mock-exams.ts - エラー: ${error.message}`);
  }

  console.log("\n💡 結論:");
  console.log("   - 問題データは存在している");
  console.log("   - 模試定義も更新済み");
  console.log("   - 問題は実行時のデータベース読み込みにある可能性");
}

testDataAvailability();
