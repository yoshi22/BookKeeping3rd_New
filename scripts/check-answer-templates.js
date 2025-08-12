const fs = require("fs");
const path = require("path");

console.log("🔍 全問題の入力フォーム適切性チェック\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
const content = fs.readFileSync(questionsPath, "utf8");

// 問題パターンと適切なフォームタイプの定義
const expectedFormTypes = {
  "パターン1：勘定記入問題": {
    range: [1, 10],
    expectedType: "ledger_entry",
    description: "T字勘定への記入",
  },
  "パターン2：補助簿記入問題": {
    range: [11, 20],
    expectedType: "ledger_entry",
    description: "各種補助簿への記入",
  },
  "パターン3：伝票記入問題": {
    range: [21, 30],
    expectedType: "voucher_entry",
    description: "伝票への記入",
  },
  "パターン4：理論・選択問題": {
    range: [31, 40],
    expectedType: ["single_choice", "multiple_choice"],
    description: "選択式問題",
  },
};

const issues = [];

// 各問題をチェック
for (let i = 1; i <= 40; i++) {
  const id = `Q_L_${String(i).padStart(3, "0")}`;

  // 問題文の抽出
  const questionRegex = new RegExp(
    `id:\\s*"${id}"[\\s\\S]*?question_text:\\s*"([^"]*(?:\\\\.[^"]*)*)"`,
    "s",
  );
  const questionMatch = content.match(questionRegex);

  // answer_template_jsonの抽出
  const templateRegex = new RegExp(
    `id:\\s*"${id}"[\\s\\S]*?answer_template_json:\\s*'([^']*)'`,
    "s",
  );
  const templateMatch = content.match(templateRegex);

  if (!templateMatch) {
    console.log(`❌ ${id}: テンプレートが見つかりません`);
    continue;
  }

  try {
    const template = JSON.parse(templateMatch[1]);
    const actualType = template.type;

    // パターンを判定
    let patternName = "";
    let expectedType = "";

    if (i <= 10) {
      patternName = "パターン1：勘定記入問題";
      expectedType = expectedFormTypes[patternName].expectedType;
    } else if (i <= 20) {
      patternName = "パターン2：補助簿記入問題";
      expectedType = expectedFormTypes[patternName].expectedType;
    } else if (i <= 30) {
      patternName = "パターン3：伝票記入問題";
      expectedType = expectedFormTypes[patternName].expectedType;
    } else {
      patternName = "パターン4：理論・選択問題";
      expectedType = expectedFormTypes[patternName].expectedType;
    }

    // 問題文から実際の問題タイプを判定
    let problemType = "";
    if (questionMatch) {
      const questionText = questionMatch[1];
      if (
        questionText.includes("選びなさい") ||
        questionText.includes("選択")
      ) {
        problemType = "選択問題";
      } else if (questionText.includes("伝票")) {
        problemType = "伝票問題";
      } else if (questionText.includes("勘定")) {
        problemType = "勘定記入";
      } else if (questionText.includes("帳")) {
        problemType = "帳簿記入";
      }
    }

    // 適切性をチェック
    let isAppropriate = false;
    if (Array.isArray(expectedType)) {
      isAppropriate = expectedType.includes(actualType);
    } else {
      isAppropriate = actualType === expectedType;
    }

    if (!isAppropriate) {
      issues.push({
        id,
        pattern: patternName,
        problemType,
        actualType,
        expectedType,
        fields: template.fields
          ? template.fields.map((f) => f.name).join(", ")
          : "N/A",
      });
      console.log(`❌ ${id}: 不適切なフォーム`);
      console.log(`   問題タイプ: ${problemType}`);
      console.log(`   実際: ${actualType}`);
      console.log(
        `   期待: ${Array.isArray(expectedType) ? expectedType.join(" or ") : expectedType}`,
      );
    } else {
      console.log(`✅ ${id}: 適切なフォーム (${actualType})`);
    }
  } catch (e) {
    console.log(`❌ ${id}: JSONパースエラー`);
    issues.push({
      id,
      error: "JSONパースエラー",
    });
  }
}

// サマリー出力
console.log("\n" + "=".repeat(60));
console.log("📊 チェック結果サマリー");
console.log("=".repeat(60));
console.log(`総問題数: 40`);
console.log(`不適切なフォーム: ${issues.length}問`);

if (issues.length > 0) {
  console.log("\n🔧 修正が必要な問題:");
  issues.forEach((issue) => {
    if (issue.error) {
      console.log(`  • ${issue.id}: ${issue.error}`);
    } else {
      console.log(`  • ${issue.id} (${issue.pattern})`);
      console.log(`    - 問題タイプ: ${issue.problemType}`);
      console.log(`    - 現在: ${issue.actualType}`);
      console.log(
        `    - 期待: ${Array.isArray(issue.expectedType) ? issue.expectedType.join(" or ") : issue.expectedType}`,
      );
      console.log(`    - フィールド: ${issue.fields}`);
    }
  });
}

// 結果をファイルに保存
fs.writeFileSync(
  path.join(__dirname, "answer-template-issues.json"),
  JSON.stringify(issues, null, 2),
);

console.log("\n📝 問題リスト保存: answer-template-issues.json");
console.log("\n✅ チェック完了");
