#!/usr/bin/env node

/**
 * 解説改善スクリプト
 * master-questions.tsの解説を新しいフォーマットで強化
 */

const fs = require("fs");
const path = require("path");

// 解説テンプレート定義
const explanationTemplates = {
  現金過不足: {
    basicConcept:
      "現金の実際有高と帳簿残高に差額が生じた場合に使用する一時的な勘定科目です。帳簿上の現金残高と実際の現金有高を照合（現金実査）して差額を調整します。",
    dailyExample:
      "コンビニのレジで、営業終了後にレジの現金を数えたら売上記録と金額が合わない状況をイメージしてください。この差額を一時的に記録するための勘定科目が「現金過不足」です。",
    journalPatterns: [
      "実際有高 < 帳簿残高（現金不足）: 借方に現金過不足、貸方に現金",
      "実際有高 > 帳簿残高（現金過剰）: 借方に現金、貸方に現金過不足",
    ],
    commonMistakes: [
      "実際有高と帳簿残高の大小関係を逆に覚えがち",
      "現金過不足は決算時に必ず他の勘定に振り替える必要がある",
      "原因判明時は適切な勘定科目に、不明時は雑損・雑益に振り替え",
    ],
    memoryTricks: [
      "「実際に数えて少ない」→「現金が減った」→「貸方に現金」",
      "「帳簿より多い」→「現金が増えた」→「借方に現金」",
      "現金過不足は「仮の勘定」で、必ず決算で整理される",
    ],
  },
  小口現金: {
    basicConcept:
      "日常の少額支払いに備えて、担当者に前渡しする現金です。定額資金前渡制度（インプレスト・システム）で管理されます。",
    dailyExample:
      "会社の事務用品購入や交通費支払いのために、経理担当者が一定額の現金を机の引き出しに保管している状況をイメージしてください。",
    journalPatterns: [
      "前渡し時: 借方に小口現金、貸方に現金",
      "補給時: 借方に各種費用、貸方に小口現金（使用分のみ）",
    ],
    commonMistakes: [
      "「前渡し」と「補給」の処理を混同しやすい",
      "補給時は使用した金額分だけを処理する",
      "小口現金は資産勘定で、常に一定額を保持する",
    ],
    memoryTricks: [
      "「小口現金を渡す」→「小口現金が増える（借方）」",
      "「小さな支払い用の現金」→「小口現金」",
      "定額制なので、使った分だけ補給する",
    ],
  },
  売掛金: {
    basicConcept:
      "商品を掛け（信用）で売り上げた際に発生する、代金を回収する権利を表す資産勘定です。",
    dailyExample:
      "ツケで食事をした時の、お店側が持つ「代金をもらう権利」をイメージしてください。お客様に請求書を渡して、後日代金を回収します。",
    journalPatterns: [
      "掛売上時: 借方に売掛金、貸方に売上",
      "代金回収時: 借方に現金、貸方に売掛金",
    ],
    commonMistakes: [
      "売掛金（資産）と買掛金（負債）を混同しやすい",
      "回収時に売掛金を借方に書いてしまうミス",
      "未収入金との区別（本業以外の収入は未収入金）",
    ],
    memoryTricks: [
      "「売」掛金 = 「売った」ツケ = もらう権利（資産）",
      "「権利」は資産、「義務」は負債",
      "回収すると売掛金は減る（貸方）",
    ],
  },
  買掛金: {
    basicConcept:
      "商品を掛け（信用）で仕入れた際に発生する、代金を支払う義務を表す負債勘定です。",
    dailyExample:
      "ツケで食事をした時の、お客側が持つ「代金を払う義務」をイメージしてください。後日、お店に代金を支払います。",
    journalPatterns: [
      "掛仕入時: 借方に仕入、貸方に買掛金",
      "代金支払時: 借方に買掛金、貸方に現金",
    ],
    commonMistakes: [
      "買掛金（負債）と売掛金（資産）を混同しやすい",
      "支払時に買掛金を貸方に書いてしまうミス",
      "未払金との区別（本業以外の支出は未払金）",
    ],
    memoryTricks: [
      "「買」掛金 = 「買った」ツケ = 払う義務（負債）",
      "支払うと買掛金は減る（借方）",
      "「義務」は負債、「権利」は資産",
    ],
  },
  当座預金: {
    basicConcept:
      "銀行に開設した決済専用の預金口座で、小切手や手形の決済に使用されます。利息は付きません。",
    dailyExample:
      "法人が開設する専用の銀行口座で、小切手を振り出したり、取引先からの振込を受けたりする口座をイメージしてください。",
    journalPatterns: [
      "入金時: 借方に当座預金、貸方に売掛金等",
      "支払時: 借方に買掛金等、貸方に当座預金",
    ],
    commonMistakes: [
      "普通預金と当座預金を混同しやすい",
      "他人振出小切手は「現金」として扱う",
      "当座借越の処理方法",
    ],
    memoryTricks: [
      "「当座」= その場での決済用",
      "小切手 = 当座預金から支払う",
      "入金で当座預金増加（借方）",
    ],
  },
};

// 優先対応リスト（重要度と頻出度に基づく）
const priorityQuestions = [
  "Q_J_001",
  "Q_J_005", // 現金過不足
  "Q_J_002",
  "Q_J_006", // 小口現金
  "Q_J_003",
  "Q_J_004", // 当座預金・当座借越
  "Q_J_007",
  "Q_J_008", // 売掛金
  "Q_J_009",
  "Q_J_010", // 買掛金
];

// 解説生成関数
function generateEnhancedExplanation(question, template) {
  if (!template) return question.explanation;

  let enhanced = "";

  // 基本概念
  enhanced += `【基本概念】\n${template.basicConcept}\n\n`;

  // 具体例・イメージ
  enhanced += `【具体例・イメージ】\n${template.dailyExample}\n\n`;

  // 仕訳パターン
  enhanced += `【仕訳パターン】\n`;
  template.journalPatterns.forEach((pattern) => {
    enhanced += `・${pattern}\n`;
  });
  enhanced += "\n";

  // 間違えやすいポイント
  enhanced += `【間違えやすいポイント】\n`;
  template.commonMistakes.forEach((mistake) => {
    enhanced += `・${mistake}\n`;
  });
  enhanced += "\n";

  // 覚え方のコツ
  enhanced += `【覚え方のコツ】\n`;
  template.memoryTricks.forEach((trick) => {
    enhanced += `・${trick}\n`;
  });
  enhanced += "\n";

  // 実際の仕訳（既存の仕訳情報を抽出）
  try {
    const answerData = JSON.parse(question.correct_answer_json);
    const journalEntry = answerData.journalEntry;

    enhanced += `【この問題の仕訳】\n`;
    enhanced += `借方：${journalEntry.debit_account} ${journalEntry.debit_amount.toLocaleString("ja-JP")}円\n`;
    enhanced += `貸方：${journalEntry.credit_account} ${journalEntry.credit_amount.toLocaleString("ja-JP")}円`;
  } catch (error) {
    console.log(
      `仕訳データエラー: ${question.id} - ${question.correct_answer_json}`,
    );
    enhanced += `【この問題の仕訳】\n（仕訳データの解析に失敗しました）`;
  }

  return enhanced;
}

// パターン分類関数
function classifyQuestionPattern(question) {
  try {
    const tagsData = JSON.parse(question.tags_json);
    const pattern = tagsData.pattern || "";

    // パターンに基づいてテンプレートを選択
    if (pattern.includes("現金過不足")) return "現金過不足";
    if (pattern.includes("小口現金")) return "小口現金";
    if (pattern.includes("売掛金") || pattern.includes("掛売上"))
      return "売掛金";
    if (pattern.includes("買掛金") || pattern.includes("掛仕入"))
      return "買掛金";
    if (pattern.includes("当座預金") || pattern.includes("当座借越"))
      return "当座預金";
  } catch (error) {
    console.log(`JSONパースエラー: ${question.id} - ${question.tags_json}`);
  }

  return null;
}

// メイン処理
function enhanceExplanations() {
  console.log("解説改善スクリプト開始...");

  // master-questions.tsを読み込み
  const masterQuestionsPath = path.join(
    __dirname,
    "../src/data/master-questions.ts",
  );

  // バックアップ作成
  const backupPath = `${masterQuestionsPath}.backup-${Date.now()}`;
  fs.copyFileSync(masterQuestionsPath, backupPath);
  console.log(`バックアップ作成: ${backupPath}`);

  let content = fs.readFileSync(masterQuestionsPath, "utf-8");
  let enhancedCount = 0;

  // 各問題の解説を改善
  const questionPattern = /{[\s\S]*?id:\s*"([^"]+)"[\s\S]*?}/g;
  let match;
  const replacements = [];

  // まず全ての問題を解析
  while ((match = questionPattern.exec(content)) !== null) {
    const questionId = match[1];

    // 優先リストに含まれる問題のみ処理
    if (!priorityQuestions.includes(questionId)) {
      continue;
    }

    const questionData = extractQuestionData(match[0]);
    const patternType = classifyQuestionPattern(questionData);
    const template = explanationTemplates[patternType];

    if (template) {
      const enhancedExplanation = generateEnhancedExplanation(
        questionData,
        template,
      );
      const escapedExplanation = enhancedExplanation
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n");

      replacements.push({
        questionId,
        oldExplanation: questionData.explanation,
        newExplanation: escapedExplanation,
        patternType,
      });

      enhancedCount++;
      console.log(`解説改善: ${questionId} (${patternType})`);
    }
  }

  // 置換実行
  replacements.forEach(({ oldExplanation, newExplanation }) => {
    const escapedOld = oldExplanation.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    content = content.replace(
      new RegExp(`explanation:\\s*"${escapedOld}"`, "g"),
      `explanation: "${newExplanation}"`,
    );
  });

  // 変更を保存
  fs.writeFileSync(masterQuestionsPath, content, "utf-8");

  console.log(`解説改善完了！${enhancedCount}問の解説を改善しました。`);
  console.log(`バックアップファイル: ${backupPath}`);
}

// 問題データ抽出ヘルパー関数
function extractQuestionData(questionMatch) {
  const idMatch = questionMatch.match(/id:\s*"([^"]+)"/);
  const explanationMatch = questionMatch.match(
    /explanation:\s*"([^"]*(?:\\.[^"]*)*)"/,
  );
  const answerMatch = questionMatch.match(
    /correct_answer_json:\s*'([^']*(?:\\.[^']*)*)'/,
  );
  const tagsMatch = questionMatch.match(/tags_json:\s*'([^']*(?:\\.[^']*)*)'/);

  return {
    id: idMatch ? idMatch[1] : "",
    explanation: explanationMatch ? explanationMatch[1] : "",
    correct_answer_json: answerMatch ? answerMatch[1] : "{}",
    tags_json: tagsMatch ? tagsMatch[1] : "{}",
  };
}

// スクリプト実行
if (require.main === module) {
  enhanceExplanations();
}

module.exports = { enhanceExplanations, explanationTemplates };
