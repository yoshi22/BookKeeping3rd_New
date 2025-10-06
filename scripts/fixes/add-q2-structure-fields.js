/**
 * Q2問題にsection_numberとquestion_orderを追加するスクリプト
 * master-questions.tsの全Q2問題に対して、適切な構造フィールドを追加します
 */

const fs = require("fs");
const path = require("path");

const masterQuestionsPath = path.join(
  __dirname,
  "../../src/data/master-questions.ts",
);

// Q2問題のマッピング（IDとquestion_orderの対応）
const q2Mapping = {
  // Vocabulary問題（Q2_V_001〜030）: order 1〜27
  Q2_V_001: 1,
  Q2_V_002: 2,
  Q2_V_003: 3,
  Q2_V_004: 4,
  Q2_V_005: 5,
  Q2_V_006: 6,
  Q2_V_007: 7,
  Q2_V_008: 8,
  Q2_V_009: 9,
  Q2_V_010: 10,
  Q2_V_011: 11,
  Q2_V_012: 12,
  Q2_V_013: 13,
  Q2_V_014: 14,
  Q2_V_015: 15,
  Q2_V_016: 16,
  Q2_V_017: 17,
  Q2_V_018: 18,
  Q2_V_019: 19,
  Q2_V_020: 20,
  Q2_V_023: 21,
  Q2_V_024: 22,
  Q2_V_025: 23,
  Q2_V_027: 24,
  Q2_V_028: 25,
  Q2_V_029: 26,
  Q2_V_030: 27,

  // Auxiliary Book問題（Q2_B_001〜020）: order 28〜43
  Q2_B_001: 28,
  Q2_B_004: 29,
  Q2_B_005: 30,
  Q2_B_006: 31,
  Q2_B_007: 32,
  Q2_B_009: 33,
  Q2_B_010: 34,
  Q2_B_011: 35,
  Q2_B_012: 36,
  Q2_B_013: 37,
  Q2_B_014: 38,
  Q2_B_016: 39,
  Q2_B_017: 40,
  Q2_B_018: 41,
  Q2_B_019: 42,
  Q2_B_020: 43,

  // Ledger問題（Q2_L_001〜020）: order 44〜63
  Q2_L_001: 44,
  Q2_L_002: 45,
  Q2_L_003: 46,
  Q2_L_004: 47,
  Q2_L_005: 48,
  Q2_L_006: 49,
  Q2_L_007: 50,
  Q2_L_008: 51,
  Q2_L_009: 52,
  Q2_L_010: 53,
  Q2_L_011: 54,
  Q2_L_012: 55,
  Q2_L_013: 56,
  Q2_L_014: 57,
  Q2_L_015: 58,
  Q2_L_016: 59,
  Q2_L_017: 60,
  Q2_L_018: 61,
  Q2_L_019: 62,
  Q2_L_020: 63,
};

function addStructureFields() {
  try {
    console.log("📖 master-questions.tsを読み込み中...");
    let content = fs.readFileSync(masterQuestionsPath, "utf8");

    let updatedCount = 0;
    let skippedCount = 0;

    // 各Q2問題に対して、section_numberとquestion_orderを追加
    Object.entries(q2Mapping).forEach(([id, order]) => {
      // 既に追加済みかチェック
      const checkPattern = new RegExp(
        `id: "${id}",\\s+category_id: "ledger",\\s+section_number:`,
        "",
      );

      if (checkPattern.test(content)) {
        console.log(`⏭️  スキップ: ${id} (既に追加済み)`);
        skippedCount++;
        return;
      }

      // id: "Q2_XXX", の後にcategory_id: "ledger",があるパターンを見つけて、
      // その後ろにsection_numberとquestion_orderを挿入
      const regex = new RegExp(`(id: "${id}",\\s+category_id: "ledger",)`, "g");

      const before = content;
      content = content.replace(regex, (match) => {
        return `${match}\n    section_number: 2,\n    question_order: ${order},`;
      });

      if (before !== content) {
        console.log(`✅ 追加: ${id} → question_order: ${order}`);
        updatedCount++;
      } else {
        console.log(`⚠️  警告: ${id} が見つかりませんでした`);
      }
    });

    if (updatedCount > 0) {
      console.log("\n💾 ファイルを保存中...");
      fs.writeFileSync(masterQuestionsPath, content, "utf8");
      console.log(`\n✅ 完了: ${updatedCount}問にフィールドを追加しました`);
      console.log(`⏭️  スキップ: ${skippedCount}問（既に追加済み）`);
      console.log(`📊 総対象: ${Object.keys(q2Mapping).length}問`);
    } else {
      console.log("\n⚠️  変更なし: すべての問題が既に更新済みです");
    }
  } catch (error) {
    console.error("❌ エラー:", error.message);
    process.exit(1);
  }
}

// 実行
addStructureFields();
