#!/usr/bin/env node

/**
 * 修正実行後のシンタックスエラー修復スクリプト
 * Q_L_037-040の不正な改行文字を修正
 */

const fs = require("fs");
const path = require("path");

function fixSyntaxErrors() {
  console.log("🔧 シンタックスエラー修正開始");
  console.log("=================================");

  const filePath = path.join(__dirname, "../src/data/master-questions.ts");
  let fileContent = fs.readFileSync(filePath, "utf8");

  // Q_L_037の修正
  const q037Pattern =
    /id: "Q_L_037",[\s\S]*?updated_at: "2025-08-07T00:31:25\.369Z",\s*\},/g;
  const q037Replacement = `id: "Q_L_037",
    category_id: "ledger",
    question_text:
      "【理論問題：財務諸表の構成要素】\\n\\n以下の説明文の空欄に入る適切な語句を選択してください。\\n\\n財務諸表の構成要素に関する以下の説明について、空欄（ア）～（エ）に入る適切な語句を選んでください。\\n\\n簿記は（ア）に基づいて、すべての取引を（イ）と（ウ）の2つの側面から記録する。\\nこの方法により、常に（エ）が保たれ、記録の正確性を検証できる。\\n\\n【選択肢】\\nA. 複式簿記\\nB. 負債\\nC. 収益\\nD. 工業簿記\\n\\n【解答形式】\\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","questions":[{"id":"a","label":"（ア）","options":["A","B","C","D"]},{"id":"b","label":"（イ）","options":["A","B","C","D"]},{"id":"c","label":"（ウ）","options":["A","B","C","D"]},{"id":"d","label":"（エ）","options":["A","B","C","D"]}]}',
    correct_answer_json:
      '{"answers": {"a": "B", "b": "C", "c": "D", "d": "A"}}',
    explanation: "簿記理論に関する問題です。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },`;

  if (fileContent.match(q037Pattern)) {
    fileContent = fileContent.replace(q037Pattern, q037Replacement);
    console.log("✅ Q_L_037: シンタックス修正完了");
  }

  // Q_L_038の修正
  const q038Pattern =
    /id: "Q_L_038",[\s\S]*?updated_at: "2025-08-07T00:31:25\.369Z",\s*\},/g;
  const q038Replacement = `id: "Q_L_038",
    category_id: "ledger",
    question_text:
      "【理論問題：勘定科目の分類と体系】\\n\\n以下の説明文の空欄に入る適切な語句を選択してください。\\n\\n勘定科目の分類と体系に関する以下の説明について、空欄（ア）～（エ）に入る適切な語句を選んでください。\\n\\n簿記は（ア）に基づいて、すべての取引を（イ）と（ウ）の2つの側面から記録する。\\nこの方法により、常に（エ）が保たれ、記録の正確性を検証できる。\\n\\n【選択肢】\\nA. 借方\\nB. 負債\\nC. 商業簿記\\nD. 試算表\\n\\n【解答形式】\\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","questions":[{"id":"a","label":"（ア）","options":["A","B","C","D"]},{"id":"b","label":"（イ）","options":["A","B","C","D"]},{"id":"c","label":"（ウ）","options":["A","B","C","D"]},{"id":"d","label":"（エ）","options":["A","B","C","D"]}]}',
    correct_answer_json:
      '{"answers": {"a": "A", "b": "D", "c": "B", "d": "C"}}',
    explanation: "簿記理論に関する問題です。",
    difficulty: 2,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },`;

  if (fileContent.match(q038Pattern)) {
    fileContent = fileContent.replace(q038Pattern, q038Replacement);
    console.log("✅ Q_L_038: シンタックス修正完了");
  }

  // Q_L_039の修正
  const q039Pattern =
    /id: "Q_L_039",[\s\S]*?updated_at: "2025-08-07T00:31:25\.369Z",\s*\},/g;
  const q039Replacement = `id: "Q_L_039",
    category_id: "ledger",
    question_text:
      "【理論問題：会計処理原則と記録体系】\\n\\n以下の説明文の空欄に入る適切な語句を選択してください。\\n\\n会計処理原則と記録体系に関する以下の説明について、空欄（ア）～（エ）に入る適切な語句を選んでください。\\n\\n簿記は（ア）に基づいて、すべての取引を（イ）と（ウ）の2つの側面から記録する。\\nこの方法により、常に（エ）が保たれ、記録の正確性を検証できる。\\n\\n【選択肢】\\nA. 貸方\\nB. 複式簿記\\nC. 資産\\nD. 貸借平均\\n\\n【解答形式】\\n各空欄に対して、最も適切な選択肢を選んでください。",
    answer_template_json:
      '{"type":"multiple_choice","questions":[{"id":"a","label":"（ア）","options":["A","B","C","D"]},{"id":"b","label":"（イ）","options":["A","B","C","D"]},{"id":"c","label":"（ウ）","options":["A","B","C","D"]},{"id":"d","label":"（エ）","options":["A","B","C","D"]}]}',
    correct_answer_json:
      '{"answers": {"a": "D", "b": "A", "c": "C", "d": "B"}}',
    explanation: "簿記理論に関する問題です。",
    difficulty: 3,
    tags_json:
      '{"subcategory":"theory","pattern":"簿記理論","accounts":[],"keywords":["5要素","理論","勘定科目"],"examSection":2}',
    created_at: "2025-08-07T00:31:25.369Z",
    updated_at: "2025-08-07T00:31:25.369Z",
  },`;

  if (fileContent.match(q039Pattern)) {
    fileContent = fileContent.replace(q039Pattern, q039Replacement);
    console.log("✅ Q_L_039: シンタックス修正完了");
  }

  // ファイルに書き戻し
  fs.writeFileSync(filePath, fileContent, "utf8");

  console.log("\\n🎉 シンタックスエラー修正が完了しました！");
  console.log("💡 TypeScriptコンパイラーでの構文検証を推奨します。");
}

// 実行
try {
  fixSyntaxErrors();
  process.exit(0);
} catch (error) {
  console.error("❌ シンタックス修正エラー:", error);
  process.exit(1);
}
