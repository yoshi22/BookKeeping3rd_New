/**
 * Q2・Q3問題変換スクリプト
 *
 * markdown形式の問題定義（docs/strategy/）から
 * master-questions.ts形式のTypeScriptコードを生成
 */

import * as fs from "fs";
import * as path from "path";

interface QuestionDefinition {
  id: string;
  type: string;
  categoryId: "ledger" | "trial_balance";
  questionText: string;
  answerTemplateJson: any;
  correctAnswerJson: any;
  explanation: string;
  difficulty: 1 | 2 | 3;
  tagsJson: any;
}

/**
 * markdown内のTypeScript定義ブロックを抽出
 */
function extractTypeScriptBlocks(markdown: string): string[] {
  const tsBlockRegex = /```typescript\n([\s\S]*?)\n```/g;
  const blocks: string[] = [];
  let match;

  while ((match = tsBlockRegex.exec(markdown)) !== null) {
    blocks.push(match[1]);
  }

  return blocks;
}

/**
 * TypeScript定義文字列をQuestionDefinitionオブジェクトに変換
 */
function parseTypeScriptBlock(
  tsCode: string,
  categoryId: "ledger" | "trial_balance",
): QuestionDefinition | null {
  try {
    // TypeScript定義をJavaScriptとして評価
    // Note: これは安全ではないため、本番環境では適切なパーサーを使用すべき
    const evaluated = eval(`(${tsCode})`);

    // 問題IDからカテゴリを判定
    const id = evaluated.id;

    // difficulty変換: "basic" → 1, "standard" → 2, "advanced" → 3
    const difficultyMap: Record<string, 1 | 2 | 3> = {
      basic: 1,
      standard: 2,
      advanced: 3,
    };
    const difficulty = difficultyMap[evaluated.difficulty] || 2;

    // answerTemplateJsonの構築（正解情報を除外）
    const answerTemplate = { ...evaluated };
    delete answerTemplate.explanation;
    delete answerTemplate.timeLimit;
    delete answerTemplate.difficulty;
    delete answerTemplate.category;
    delete answerTemplate.tags;

    // blanksから正解情報を除外
    if (answerTemplate.blanks) {
      answerTemplate.blanks = answerTemplate.blanks.map((blank: any) => {
        const { correctIndex, ...blankWithoutCorrect } = blank;
        return blankWithoutCorrect;
      });
    }

    // correctAnswerJsonの構築
    const correctAnswer: any = {};
    if (evaluated.blanks) {
      correctAnswer.blanks = evaluated.blanks.map(
        (blank: any, index: number) => ({
          index: index,
          correctIndex: blank.correctIndex,
        }),
      );
    }

    // question_text: 問題タイプによって異なる
    let questionText = "";
    if (evaluated.questionText) {
      questionText = evaluated.questionText;
    } else if (evaluated.type === "fill_in_trial_balance") {
      questionText = `次の${evaluated.date}の${evaluated.title}の空欄に当てはまる金額を選択してください。`;
      if (evaluated.context) {
        questionText += `\n\n【前提】\n${evaluated.context}`;
      }
    }

    // tags_json: 問題メタデータ
    const tagsJson = {
      subcategory: evaluated.type,
      pattern: evaluated.category || evaluated.type,
      examSection: categoryId === "ledger" ? 2 : 3,
      keywords: evaluated.tags || [],
    };

    return {
      id,
      type: evaluated.type,
      categoryId,
      questionText,
      answerTemplateJson: answerTemplate,
      correctAnswerJson: correctAnswer,
      explanation: evaluated.explanation || "",
      difficulty,
      tagsJson,
    };
  } catch (error) {
    console.error("Failed to parse TypeScript block:", error);
    return null;
  }
}

/**
 * QuestionDefinitionをmaster-questions.ts形式のコードに変換
 */
function generateQuestionCode(question: QuestionDefinition): string {
  const now = new Date().toISOString();

  return `  {
    id: "${question.id}",
    category_id: "${question.categoryId}",
    question_text: ${JSON.stringify(question.questionText)},
    answer_template_json: ${JSON.stringify(JSON.stringify(question.answerTemplateJson))},
    correct_answer_json: ${JSON.stringify(JSON.stringify(question.correctAnswerJson))},
    explanation: ${JSON.stringify(question.explanation)},
    difficulty: ${question.difficulty},
    tags_json: ${JSON.stringify(JSON.stringify(question.tagsJson))},
    created_at: "${now}",
    updated_at: "${now}",
  }`;
}

/**
 * メイン処理
 */
async function main() {
  console.log("🚀 Q2・Q3問題変換スクリプト開始\n");

  // ファイルパス
  const projectRoot = path.resolve(__dirname, "../..");
  const q2Path = path.join(
    projectRoot,
    "docs/strategy/2025-10-q2-complete-questions.md",
  );
  const q3Path = path.join(
    projectRoot,
    "docs/strategy/2025-10-q3-complete-questions.md",
  );
  const outputPath = path.join(
    projectRoot,
    "scripts/data/converted-questions.ts",
  );

  let allQuestions: QuestionDefinition[] = [];

  // Q2問題の変換
  console.log("📖 Q2問題ファイル読み込み中...");
  const q2Content = fs.readFileSync(q2Path, "utf-8");
  const q2TsBlocks = extractTypeScriptBlocks(q2Content);
  console.log(`✅ ${q2TsBlocks.length} 個のTypeScript定義を抽出\n`);

  console.log("🔄 Q2問題を変換中...");
  for (let i = 0; i < q2TsBlocks.length; i++) {
    const question = parseTypeScriptBlock(q2TsBlocks[i], "ledger");
    if (question) {
      allQuestions.push(question);
      if ((i + 1) % 10 === 0) {
        console.log(`  - ${i + 1}/${q2TsBlocks.length} 問完了`);
      }
    }
  }
  console.log(
    `✅ Q2問題変換完了: ${allQuestions.filter((q) => q.categoryId === "ledger").length} 問\n`,
  );

  // Q3問題の変換
  console.log("📖 Q3問題ファイル読み込み中...");
  const q3Content = fs.readFileSync(q3Path, "utf-8");
  const q3TsBlocks = extractTypeScriptBlocks(q3Content);
  console.log(`✅ ${q3TsBlocks.length} 個のTypeScript定義を抽出\n`);

  console.log("🔄 Q3問題を変換中...");
  const q3StartIndex = allQuestions.length;
  for (let i = 0; i < q3TsBlocks.length; i++) {
    const question = parseTypeScriptBlock(q3TsBlocks[i], "trial_balance");
    if (question) {
      allQuestions.push(question);
      if ((i + 1) % 10 === 0) {
        console.log(`  - ${i + 1}/${q3TsBlocks.length} 問完了`);
      }
    }
  }
  const q3Count = allQuestions.length - q3StartIndex;
  console.log(`✅ Q3問題変換完了: ${q3Count} 問\n`);

  // TypeScriptコード生成
  console.log("📝 TypeScriptコード生成中...");
  const questionCodes = allQuestions.map((q) => generateQuestionCode(q));
  const output = `/**
 * 自動生成された問題データ
 * 生成日時: ${new Date().toISOString()}
 *
 * Q2問題: ${allQuestions.filter((q) => q.categoryId === "ledger").length} 問
 * Q3問題: ${allQuestions.filter((q) => q.categoryId === "trial_balance").length} 問
 * 合計: ${allQuestions.length} 問
 */

import { Question } from "../../src/types/models";

export const convertedQuestions: Question[] = [
${questionCodes.join(",\n")}
];
`;

  fs.writeFileSync(outputPath, output, "utf-8");
  console.log(`✅ 変換結果を保存: ${outputPath}\n`);

  // 統計情報
  console.log("📊 変換統計:");
  console.log(
    `  - Q2問題: ${allQuestions.filter((q) => q.categoryId === "ledger").length} 問`,
  );
  console.log(
    `  - Q3問題: ${allQuestions.filter((q) => q.categoryId === "trial_balance").length} 問`,
  );
  console.log(`  - 合計: ${allQuestions.length} 問`);
  console.log(
    `  - 難易度1（基礎）: ${allQuestions.filter((q) => q.difficulty === 1).length} 問`,
  );
  console.log(
    `  - 難易度2（標準）: ${allQuestions.filter((q) => q.difficulty === 2).length} 問`,
  );
  console.log(
    `  - 難易度3（応用）: ${allQuestions.filter((q) => q.difficulty === 3).length} 問`,
  );

  console.log("\n🎉 変換完了！");
  console.log("\n次のステップ:");
  console.log("1. converted-questions.tsの内容を確認");
  console.log("2. master-questions.tsから既存Q_L/Q_T問題を削除");
  console.log("3. converted-questions.tsの内容を master-questions.tsに統合");
}

// スクリプト実行
if (require.main === module) {
  main().catch(console.error);
}
