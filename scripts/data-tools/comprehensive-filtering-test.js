#!/usr/bin/env node
/* eslint-disable */

/**
 * problemsStrategy.md準拠の総合フィルタリング機能テスト
 * 全カテゴリ・全機能の動作検証
 */

const fs = require("fs");
const path = require("path");

console.log("🧪 problemsStrategy.md準拠 総合フィルタリング機能テスト開始\n");

// アプリと同じ分類ロジック
function getQuestionTypeFromQuestion(question, categoryId) {
  try {
    if (categoryId === "journal") {
      // problemsStrategy.md準拠のバランス調整分類（排他的ID指定）
      const questionId = question.id;

      // 現金・預金取引 (42問)
      if (
        [
          "Q_J_066",
          "Q_J_067",
          "Q_J_068",
          "Q_J_069",
          "Q_J_070",
          "Q_J_071",
          "Q_J_072",
          "Q_J_073",
          "Q_J_074",
          "Q_J_075",
          "Q_J_076",
          "Q_J_077",
          "Q_J_078",
          "Q_J_079",
          "Q_J_080",
          "Q_J_081",
          "Q_J_082",
          "Q_J_083",
          "Q_J_084",
          "Q_J_085",
          "Q_J_086",
          "Q_J_087",
          "Q_J_088",
          "Q_J_089",
          "Q_J_090",
          "Q_J_091",
          "Q_J_092",
          "Q_J_093",
          "Q_J_094",
          "Q_J_095",
          "Q_J_096",
          "Q_J_097",
          "Q_J_098",
          "Q_J_099",
          "Q_J_100",
          "Q_J_101",
          "Q_J_102",
          "Q_J_103",
          "Q_J_104",
          "Q_J_105",
          "Q_J_017",
          "Q_J_018",
        ].includes(questionId)
      ) {
        return ["cash_deposit"];
      }

      // 商品売買取引 (45問)
      if (
        [
          "Q_J_016",
          "Q_J_019",
          "Q_J_022",
          "Q_J_025",
          "Q_J_028",
          "Q_J_031",
          "Q_J_034",
          "Q_J_037",
          "Q_J_040",
          "Q_J_043",
          "Q_J_046",
          "Q_J_049",
          "Q_J_052",
          "Q_J_055",
          "Q_J_058",
          "Q_J_061",
          "Q_J_064",
          "Q_J_020",
          "Q_J_021",
          "Q_J_023",
          "Q_J_024",
          "Q_J_026",
          "Q_J_027",
          "Q_J_029",
          "Q_J_030",
          "Q_J_032",
          "Q_J_033",
          "Q_J_035",
          "Q_J_036",
          "Q_J_038",
          "Q_J_039",
          "Q_J_041",
          "Q_J_042",
          "Q_J_044",
          "Q_J_045",
          "Q_J_047",
          "Q_J_048",
          "Q_J_050",
          "Q_J_051",
          "Q_J_053",
          "Q_J_054",
          "Q_J_056",
          "Q_J_057",
          "Q_J_059",
          "Q_J_060",
        ].includes(questionId)
      ) {
        return ["sales_purchase"];
      }

      // 債権・債務 (41問)
      if (
        [
          "Q_J_136",
          "Q_J_137",
          "Q_J_138",
          "Q_J_139",
          "Q_J_140",
          "Q_J_141",
          "Q_J_142",
          "Q_J_143",
          "Q_J_144",
          "Q_J_145",
          "Q_J_146",
          "Q_J_147",
          "Q_J_148",
          "Q_J_149",
          "Q_J_150",
          "Q_J_151",
          "Q_J_152",
          "Q_J_153",
          "Q_J_154",
          "Q_J_155",
          "Q_J_156",
          "Q_J_157",
          "Q_J_158",
          "Q_J_159",
          "Q_J_160",
          "Q_J_106",
          "Q_J_107",
          "Q_J_108",
          "Q_J_109",
          "Q_J_110",
          "Q_J_111",
          "Q_J_112",
          "Q_J_113",
          "Q_J_114",
          "Q_J_115",
          "Q_J_116",
          "Q_J_117",
          "Q_J_118",
          "Q_J_119",
          "Q_J_120",
          "Q_J_121",
        ].includes(questionId)
      ) {
        return ["receivable_payable"];
      }

      // 給与・税金 (42問)
      if (
        [
          "Q_J_243",
          "Q_J_246",
          "Q_J_249",
          "Q_J_062",
          "Q_J_063",
          "Q_J_065",
          "Q_J_122",
          "Q_J_123",
          "Q_J_124",
          "Q_J_125",
          "Q_J_126",
          "Q_J_127",
          "Q_J_128",
          "Q_J_129",
          "Q_J_130",
          "Q_J_131",
          "Q_J_132",
          "Q_J_133",
          "Q_J_134",
          "Q_J_135",
          "Q_J_161",
          "Q_J_162",
          "Q_J_163",
          "Q_J_164",
          "Q_J_165",
          "Q_J_166",
          "Q_J_167",
          "Q_J_168",
          "Q_J_169",
          "Q_J_170",
          "Q_J_171",
          "Q_J_172",
          "Q_J_173",
          "Q_J_174",
          "Q_J_175",
          "Q_J_176",
          "Q_J_177",
          "Q_J_178",
          "Q_J_179",
          "Q_J_180",
          "Q_J_181",
          "Q_J_182",
        ].includes(questionId)
      ) {
        return ["salary_tax"];
      }

      // 固定資産 (40問)
      if (
        [
          "Q_J_183",
          "Q_J_184",
          "Q_J_185",
          "Q_J_186",
          "Q_J_187",
          "Q_J_188",
          "Q_J_189",
          "Q_J_190",
          "Q_J_191",
          "Q_J_192",
          "Q_J_193",
          "Q_J_194",
          "Q_J_195",
          "Q_J_241",
          "Q_J_244",
          "Q_J_247",
          "Q_J_250",
          "Q_J_196",
          "Q_J_197",
          "Q_J_198",
          "Q_J_199",
          "Q_J_200",
          "Q_J_201",
          "Q_J_202",
          "Q_J_203",
          "Q_J_204",
          "Q_J_205",
          "Q_J_206",
          "Q_J_207",
          "Q_J_208",
          "Q_J_209",
          "Q_J_210",
          "Q_J_211",
          "Q_J_212",
          "Q_J_213",
          "Q_J_214",
          "Q_J_215",
          "Q_J_216",
          "Q_J_217",
          "Q_J_218",
        ].includes(questionId)
      ) {
        return ["fixed_asset"];
      }

      // 決算整理 (25問) - 残りの問題
      if (
        [
          "Q_J_219",
          "Q_J_220",
          "Q_J_221",
          "Q_J_222",
          "Q_J_223",
          "Q_J_224",
          "Q_J_225",
          "Q_J_226",
          "Q_J_227",
          "Q_J_228",
          "Q_J_229",
          "Q_J_230",
          "Q_J_231",
          "Q_J_232",
          "Q_J_233",
          "Q_J_234",
          "Q_J_235",
          "Q_J_236",
          "Q_J_237",
          "Q_J_238",
          "Q_J_239",
          "Q_J_240",
          "Q_J_242",
          "Q_J_245",
          "Q_J_248",
        ].includes(questionId)
      ) {
        return ["adjustment"];
      }
    } else if (categoryId === "ledger") {
      const questionId = question.id;

      // パターン1: 勘定記入問題 (10問)
      if (
        [
          "Q_L_001",
          "Q_L_002",
          "Q_L_003",
          "Q_L_004",
          "Q_L_005",
          "Q_L_006",
          "Q_L_007",
          "Q_L_008",
          "Q_L_009",
          "Q_L_010",
        ].includes(questionId)
      ) {
        return ["account_entry"];
      }

      // パターン2: 補助簿記入問題 (10問)
      if (
        [
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
        ].includes(questionId)
      ) {
        return ["subsidiary_books"];
      }

      // パターン3: 伝票記入問題 (10問)
      if (
        [
          "Q_L_021",
          "Q_L_022",
          "Q_L_023",
          "Q_L_024",
          "Q_L_025",
          "Q_L_026",
          "Q_L_027",
          "Q_L_028",
          "Q_L_029",
          "Q_L_030",
        ].includes(questionId)
      ) {
        return ["voucher_entry"];
      }

      // パターン4: 理論・選択問題 (10問)
      if (
        [
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
        ].includes(questionId)
      ) {
        return ["theory_selection"];
      }

      return ["theory_selection"]; // デフォルト
    } else if (categoryId === "trial_balance") {
      const questionId = question.id;

      // パターン1: 財務諸表作成 (4問)
      if (["Q_T_001", "Q_T_002", "Q_T_003", "Q_T_004"].includes(questionId)) {
        return ["financial_statements"];
      }

      // パターン2: 精算表作成 (4問)
      if (["Q_T_005", "Q_T_006", "Q_T_007", "Q_T_008"].includes(questionId)) {
        return ["worksheet"];
      }

      // パターン3: 試算表作成 (4問)
      if (["Q_T_009", "Q_T_010", "Q_T_011", "Q_T_012"].includes(questionId)) {
        return ["trial_balance"];
      }

      return ["trial_balance"]; // デフォルト
    }
    return ["other"];
  } catch (e) {
    return ["other"];
  }
}

// 期待される問題数（problemsStrategy.md準拠）
const expectedCounts = {
  journal: {
    cash_deposit: 42,
    sales_purchase: 45,
    receivable_payable: 41,
    salary_tax: 42,
    fixed_asset: 40,
    adjustment: 40,
    total: 250,
  },
  ledger: {
    account_entry: 10,
    subsidiary_books: 10,
    voucher_entry: 10,
    theory_selection: 10,
    total: 40,
  },
  trial_balance: {
    financial_statements: 4,
    worksheet: 4,
    trial_balance: 4,
    total: 12,
  },
};

const categoryNames = {
  journal: {
    cash_deposit: "現金・預金取引",
    sales_purchase: "商品売買取引",
    receivable_payable: "債権・債務",
    salary_tax: "給与・税金",
    fixed_asset: "固定資産",
    adjustment: "決算整理",
  },
  ledger: {
    account_entry: "勘定記入問題",
    subsidiary_books: "補助簿記入問題",
    voucher_entry: "伝票記入問題",
    theory_selection: "理論・選択問題",
  },
  trial_balance: {
    financial_statements: "財務諸表作成",
    worksheet: "精算表作成",
    trial_balance: "試算表作成",
  },
};

try {
  const generatedQuestionsPath = path.join(
    __dirname,
    "src/data/generated-questions.ts",
  );
  const content = fs.readFileSync(generatedQuestionsPath, "utf8");

  console.log("📊 総合テスト結果:\n");

  // 各カテゴリをテスト
  for (const [categoryId, expected] of Object.entries(expectedCounts)) {
    console.log(
      `🔸 ${categoryId.toUpperCase()} (第${categoryId === "journal" ? "1" : categoryId === "ledger" ? "2" : "3"}問):`,
    );

    // 問題を抽出
    const questions = [];
    const pattern = new RegExp(
      `"?id"?: "(Q_${categoryId === "journal" ? "J" : categoryId === "ledger" ? "L" : "T"}_\\d+)"[\\s\\S]*?"?difficulty"?: (\\d+)`,
      "g",
    );
    let match;

    while ((match = pattern.exec(content)) !== null) {
      questions.push({
        id: match[1],
        difficulty: parseInt(match[2], 10),
      });
    }

    console.log(
      `  総問題数: ${questions.length}問 (期待値: ${expected.total}問)`,
    );

    // 問題類型別分類テスト
    const typeCounts = {};
    questions.forEach((question) => {
      const types = getQuestionTypeFromQuestion(question, categoryId);
      const type = types[0] || "other";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    console.log("  問題類型別分類:");
    Object.entries(expected).forEach(([type, expectedCount]) => {
      if (type === "total") return;

      const actualCount = typeCounts[type] || 0;
      const status = actualCount === expectedCount ? "✅" : "❌";
      const categoryName = categoryNames[categoryId][type] || type;

      console.log(
        `    ${status} ${categoryName}: ${actualCount}問 / ${expectedCount}問`,
      );

      if (actualCount !== expectedCount) {
        const diff = actualCount - expectedCount;
        console.log(`      ⚠️  差異: ${diff > 0 ? "+" : ""}${diff}問`);
      }
    });

    // 難易度分布テスト
    console.log("  難易度分布 (1:基礎, 2:標準, 3:応用):");
    const diffCounts = {};
    questions.forEach((q) => {
      diffCounts[q.difficulty] = (diffCounts[q.difficulty] || 0) + 1;
    });

    [1, 2, 3].forEach((level) => {
      const count = diffCounts[level] || 0;
      const levelName = level === 1 ? "基礎" : level === 2 ? "標準" : "応用";
      const percentage =
        questions.length > 0
          ? ((count / questions.length) * 100).toFixed(1)
          : "0.0";
      console.log(
        `    難易度${level}(${levelName}): ${count}問 (${percentage}%)`,
      );
    });

    // 無効な難易度チェック
    const invalidDiffs = Object.keys(diffCounts).filter(
      (d) => !["1", "2", "3"].includes(d),
    );
    if (invalidDiffs.length > 0) {
      console.log(`    ❌ 無効な難易度: ${invalidDiffs.join(", ")}`);
    }

    console.log("");
  }

  // 総合評価
  console.log("🎯 総合評価:");

  let allTestsPassed = true;
  let totalExpected = 0;
  let totalActual = 0;

  for (const [categoryId, expected] of Object.entries(expectedCounts)) {
    const questions = [];
    const pattern = new RegExp(
      `"?id"?: "(Q_${categoryId === "journal" ? "J" : categoryId === "ledger" ? "L" : "T"}_\\d+)"`,
      "g",
    );
    let match;

    while ((match = pattern.exec(content)) !== null) {
      questions.push({ id: match[1] });
    }

    totalExpected += expected.total;
    totalActual += questions.length;

    if (questions.length !== expected.total) {
      allTestsPassed = false;
    }

    // 各問題類型のチェック
    const typeCounts = {};
    questions.forEach((question) => {
      const types = getQuestionTypeFromQuestion(question, categoryId);
      const type = types[0] || "other";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    Object.entries(expected).forEach(([type, expectedCount]) => {
      if (type === "total") return;
      const actualCount = typeCounts[type] || 0;
      if (actualCount !== expectedCount) {
        allTestsPassed = false;
      }
    });
  }

  console.log(`  📊 総問題数: ${totalActual}問 / ${totalExpected}問`);
  console.log(
    `  🎯 problemsStrategy.md準拠: ${allTestsPassed ? "✅ 完全準拠" : "❌ 要調整"}`,
  );

  if (allTestsPassed) {
    console.log("\n🎉 総合フィルタリング機能テスト完了!");
    console.log("✅ 全てのカテゴリがproblemsStrategy.mdに完全準拠しています");
    console.log("✅ 難易度3分類システム正常動作");
    console.log("✅ 排他的分類システム正常動作");
  } else {
    console.log("\n⚠️ 一部調整が必要です。上記の差異を確認してください。");
  }
} catch (error) {
  console.error("❌ テスト実行エラー:", error.message);
  process.exit(1);
}
