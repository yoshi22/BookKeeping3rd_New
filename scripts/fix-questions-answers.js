#!/usr/bin/env node

/**
 * 問題と正答の不整合を修正するスクリプト
 * 特定された問題の正答と解説を適切な内容に修正
 */

const fs = require("fs");
const path = require("path");

// TypeScriptファイルを読み込む
const tsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
const content = fs.readFileSync(tsFilePath, "utf8");

console.log("🔧 問題と正答の不整合を修正中...\n");

// データを抽出
const startPattern = /export const masterQuestions[^=]*=\s*\[/;
const startMatch = content.match(startPattern);
const startIndex = startMatch.index + startMatch[0].length - 1;

let depth = 0;
let endIndex = -1;
let inString = false;
let escapeNext = false;

for (let i = startIndex; i < content.length; i++) {
  const char = content[i];

  if (escapeNext) {
    escapeNext = false;
    continue;
  }

  if (char === "\\") {
    escapeNext = true;
    continue;
  }

  if (char === '"' && !inString) {
    inString = true;
  } else if (char === '"' && inString) {
    inString = false;
  }

  if (!inString) {
    if (char === "[" || char === "{") {
      depth++;
    } else if (char === "]" || char === "}") {
      depth--;
      if (depth === 0 && char === "]") {
        endIndex = i + 1;
        break;
      }
    }
  }
}

const dataString = content.substring(startIndex, endIndex);
const questions = eval(dataString);

// 修正が必要な問題のマップ
const fixes = {
  Q_J_005: {
    question_text:
      "【仕訳問題】次の取引について仕訳しなさい。\\n\\n普通預金から現金380,000円を引き出した。",
    correct_answer: {
      journalEntry: {
        debit_account: "現金",
        debit_amount: 380000,
        credit_account: "普通預金",
        credit_amount: 380000,
      },
    },
    explanation:
      "普通預金から現金を引き出す基本的な取引。現金が増加（借方）、普通預金が減少（貸方）となります。\\n\\n⚠️ 間違えやすいポイント：預金の種類（普通預金・当座預金・定期預金）を正確に区別する。現金と預金の増減を逆にしないよう注意。",
  },
  Q_J_008: {
    question_text:
      "【仕訳問題】次の取引について仕訳しなさい。\\n\\n商品850,000円を仕入れ、代金は掛けとした。",
    correct_answer: {
      journalEntry: {
        debit_account: "仕入",
        debit_amount: 850000,
        credit_account: "買掛金",
        credit_amount: 850000,
      },
    },
    explanation:
      "商品の掛け仕入れ。三分法では仕入（費用）が増加（借方）、買掛金（負債）が増加（貸方）となります。\\n\\n⚠️ 間違えやすいポイント：三分法では「仕入」勘定を使用。買掛金は負債なので増加は貸方。現金仕入れと掛け仕入れを区別する。",
  },
  Q_J_009: {
    question_text:
      "【仕訳問題】次の取引について仕訳しなさい。\\n\\n商品990,000円を売り上げ、代金のうち300,000円は現金で受け取り、残額は掛けとした。",
    correct_answer: {
      journalEntry: {
        entries: [
          {
            debit_account: "現金",
            debit_amount: 300000,
          },
          {
            debit_account: "売掛金",
            debit_amount: 690000,
          },
          {
            credit_account: "売上",
            credit_amount: 990000,
          },
        ],
      },
    },
    explanation:
      "商品売上の複合仕訳。現金300,000円（借方）と売掛金690,000円（借方）で代金を受け取り、売上990,000円（貸方）を計上します。\\n\\n⚠️ 間違えやすいポイント：複数の借方科目がある場合の仕訳。現金と売掛金の金額を正確に分ける。売上は収益なので貸方に記入。",
  },
  Q_J_010: {
    question_text:
      "【仕訳問題】次の取引について仕訳しなさい。\\n\\n仕入先に商品の注文を行い、内金として200,000円を現金で支払った。",
    correct_answer: {
      journalEntry: {
        debit_account: "前払金",
        debit_amount: 200000,
        credit_account: "現金",
        credit_amount: 200000,
      },
    },
    explanation:
      "商品購入の内金（前払金）支払い。前払金（資産）が増加（借方）、現金（資産）が減少（貸方）となります。\\n\\n⚠️ 間違えやすいポイント：内金は「前払金」勘定を使用。仕入勘定ではない点に注意。商品受取時に前払金を仕入に振り替える。",
  },
  Q_J_011: {
    question_text:
      "【仕訳問題】次の取引について仕訳しなさい。\\n\\n掛けで仕入れた商品100,000円について、品質不良のため50,000円の値引きを受けた。",
    correct_answer: {
      journalEntry: {
        debit_account: "買掛金",
        debit_amount: 50000,
        credit_account: "仕入",
        credit_amount: 50000,
      },
    },
    explanation:
      "仕入値引きの処理。買掛金（負債）が減少（借方）、仕入（費用）が減少（貸方）となります。\\n\\n⚠️ 間違えやすいポイント：値引きは仕入の減少として処理。返品と値引きの違いを理解する。買掛金の減少は借方に記入。",
  },
  Q_J_012: {
    question_text:
      "【仕訳問題】次の取引について仕訳しなさい。\\n\\n商品300,000円を仕入れ、引取運賃5,000円を現金で支払った。",
    correct_answer: {
      journalEntry: {
        entries: [
          {
            debit_account: "仕入",
            debit_amount: 305000,
          },
          {
            credit_account: "買掛金",
            credit_amount: 300000,
          },
          {
            credit_account: "現金",
            credit_amount: 5000,
          },
        ],
      },
    },
    explanation:
      "商品仕入と引取運賃の処理。引取運賃は仕入原価に含めるため、仕入305,000円（借方）、買掛金300,000円（貸方）、現金5,000円（貸方）となります。\\n\\n⚠️ 間違えやすいポイント：引取運賃は仕入原価に含める。発送費（売上諸掛）とは処理が異なる。複合仕訳の作成に注意。",
  },
};

// 問題を修正
let fixedCount = 0;
questions.forEach((question) => {
  if (fixes[question.id]) {
    const fix = fixes[question.id];

    // 正答を修正
    question.correct_answer_json = JSON.stringify(fix.correct_answer);

    // 解説を修正
    question.explanation = fix.explanation;

    fixedCount++;
    console.log(`✅ ${question.id} を修正しました`);
  }
});

// TypeScriptファイルを再構築
const beforeData = content.substring(0, startIndex);
const afterData = content.substring(endIndex);

// 元のフォーマットに戻す
const formattedQuestions = questions
  .map((q) => {
    // explanationフィールドのエスケープ処理
    const escapedExplanation = q.explanation
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n");

    return `  {
    id: "${q.id}",
    category_id: "${q.category_id}",
    difficulty: ${q.difficulty},
    question_text: "${q.question_text.replace(/"/g, '\\"').replace(/\n/g, "\\n")}",
    answer_template_json: "${q.answer_template_json.replace(/"/g, '\\"')}",
    correct_answer_json: "${q.correct_answer_json.replace(/"/g, '\\"')}",
    explanation: "${escapedExplanation}",
    tags_json: "${q.tags_json.replace(/"/g, '\\"')}",
    created_at: "${q.created_at}",
    updated_at: "${q.updated_at}"
  }`;
  })
  .join(",\n");

const newContent = beforeData + "[\n" + formattedQuestions + "\n]" + afterData;
fs.writeFileSync(tsFilePath, newContent, "utf8");

console.log(`\n✨ ${fixedCount}問の不整合を修正しました！`);
console.log("\n📋 修正内容:");
console.log("  - Q_J_005: 普通預金からの現金引出し");
console.log("  - Q_J_008: 商品の掛け仕入れ");
console.log("  - Q_J_009: 現金・掛けの複合売上");
console.log("  - Q_J_010: 内金（前払金）の支払い");
console.log("  - Q_J_011: 仕入値引き");
console.log("  - Q_J_012: 仕入と引取運賃");
