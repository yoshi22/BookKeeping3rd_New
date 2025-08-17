#!/usr/bin/env node

/**
 * 解説充実化スクリプト v2
 * WebFetchで収集した情報を基に解説を充実化
 */

const fs = require("fs");
const path = require("path");

// 詳細な解説テンプレート（WebFetchで収集した情報を基に）
const explanationTemplates = {
  現金過不足: {
    basicConcept:
      "現金の実際有高と帳簿残高に差額が生じた場合に使用する一時的な勘定科目です。企業では「日々チェック」し、横領リスクを防ぐために現金をかぞえ、帳簿と合っているか確認します。",
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
      "日常の少額支払いに備えて、担当者に前渡しする現金です。定額資金前渡制度（インプレスト・システム）で管理され、営業部や企画部などの各部署に、あらかじめ少額の現金を渡して、電車代などの細かな支払いをまかなってもらいます。",
    dailyExample:
      "大きな企業で、営業部の担当者が出張するための切符を買う時に、いちいち経理部まで行って現金をもらうのは大変です。そこで、各部署に一定額の現金を預けておく状況をイメージしてください。",
    journalPatterns: [
      "前渡し時: 借方に小口現金、貸方に現金",
      "支払報告時: 借方に各種費用、貸方に小口現金",
      "補給時: 借方に小口現金、貸方に現金（使用分のみ）",
      "即時補給: 借方に各種費用、貸方に現金（まとめて処理）",
    ],
    commonMistakes: [
      "「前渡し」と「補給」の処理を混同しやすい",
      "補給時は使用した金額分だけを処理する",
      "小口現金は資産勘定で、常に一定額を保持する",
      "仕訳は会計係の立場から行う（小口係の処理は仕訳対象外）",
    ],
    memoryTricks: [
      "「小口現金を渡す」→「小口現金が増える（借方）」",
      "「小さな支払い用の現金」→「小口現金」",
      "定額制なので、使った分だけ補給する",
      "①前渡し→②支払い→③報告→④補給のサイクル",
    ],
  },
  売掛金: {
    basicConcept:
      "商品やサービスの代金を将来的に受け取る権利があるお金のことで、商品を掛け（信用）で売り上げた際に発生する資産勘定です。",
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
      "売る側に発生するのが「売掛金」",
    ],
  },
  買掛金: {
    basicConcept:
      "商品やサービスを購入した際の掛け取引で使用する勘定科目で、あとから支払わなければならないお金（代金を支払う義務）を表す負債勘定です。",
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
      "買う側に発生するのが「買掛金」",
    ],
  },
  当座預金: {
    basicConcept:
      "銀行に開設した決済専用の預金口座で、小切手や手形の決済に使用されます。利息は付きません。法人が開設する専用の銀行口座です。",
    dailyExample:
      "法人が開設する専用の銀行口座で、小切手を振り出したり、取引先からの振込を受けたりする口座をイメージしてください。",
    journalPatterns: [
      "入金時: 借方に当座預金、貸方に売掛金等",
      "支払時（残高あり）: 借方に買掛金等、貸方に当座預金",
      "支払時（残高不足）: 借方に買掛金等、貸方に当座借越",
    ],
    commonMistakes: [
      "普通預金と当座預金を混同しやすい",
      "他人振出小切手は「現金」として扱う",
      "当座借越の処理方法（決算時の振替が必要）",
    ],
    memoryTricks: [
      "「当座」= その場での決済用",
      "小切手 = 当座預金から支払う",
      "入金で当座預金増加（借方）",
      "残高不足でも小切手振出可能（当座借越契約時）",
    ],
  },
  当座借越: {
    basicConcept:
      "当座預金残高を超えて引き出しを行った時に生じた銀行への支払い債務です。事前に銀行と当座借越契約を結ぶことにより、一定額までなら残高を超えても小切手を振り出すことが可能となります。",
    dailyExample:
      "クレジットカードの利用限度額のように、銀行と契約することで預金残高を超えても一定額まで支払いができる仕組みをイメージしてください。",
    journalPatterns: [
      "残高不足での支払時: 借方に費用等、貸方に当座預金（期中）",
      "決算時の振替: 借方に当座預金、貸方に当座借越",
      "翌期首の再振替: 借方に当座借越、貸方に当座預金",
    ],
    commonMistakes: [
      "期中と決算時の処理を混同しやすい",
      "当座預金の貸方残高を放置してはいけない",
      "当座借越は負債勘定であることを忘れがち",
    ],
    memoryTricks: [
      "当座預金がマイナス（貸方残高）→決算で当座借越に振替",
      "資産のマイナスは不自然→負債に移す",
      "翌期首は逆仕訳で元に戻す",
    ],
  },
};

// 問題分類のキーワードマッピング（優先順位順）
const patternKeywords = {
  当座借越: ["当座借越", "残高不足", "借越"],
  現金過不足: ["現金過不足", "現金実査", "実際有高", "帳簿残高"],
  小口現金: ["小口現金", "前渡し", "インプレスト", "定額資金"],
  当座預金: ["当座預金", "振込", "入金"],
  売掛金: ["売掛金", "掛売上"],
  買掛金: ["買掛金", "掛仕入"],
};

// 問題パターン分類関数
function classifyQuestionPattern(question) {
  try {
    const tagsData = JSON.parse(question.tags_json);
    const pattern = tagsData.pattern || "";
    const questionText = question.question_text || "";
    const accounts = tagsData.accounts || [];

    // 特定のパターンを直接チェック（最優先）
    if (
      pattern === "当座預金振込" ||
      (accounts.includes("当座預金") &&
        accounts.includes("売掛金") &&
        (questionText.includes("振り込まれた") ||
          questionText.includes("振込")))
    ) {
      return "当座預金";
    }

    if (pattern === "当座借越" || questionText.includes("当座借越")) {
      return "当座借越";
    }

    if (
      pattern === "現金過不足" ||
      questionText.includes("現金実査") ||
      questionText.includes("実際有高")
    ) {
      return "現金過不足";
    }

    if (pattern === "小口現金" || questionText.includes("小口現金")) {
      return "小口現金";
    }

    // 勘定科目ベースの分類
    if (accounts.includes("売掛金") && !accounts.includes("当座預金")) {
      return "売掛金";
    }

    if (accounts.includes("買掛金")) {
      return "買掛金";
    }

    // キーワードベースの分類（フォールバック）
    for (const [templateKey, keywords] of Object.entries(patternKeywords)) {
      for (const keyword of keywords) {
        if (pattern.includes(keyword) || questionText.includes(keyword)) {
          return templateKey;
        }
      }
    }
  } catch (error) {
    console.log(`JSONパースエラー: ${question.id} - ${question.tags_json}`);
  }

  return null;
}

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
  const questionTextMatch = questionMatch.match(
    /question_text:\s*"([^"]*(?:\\.[^"]*)*)"/,
  );

  return {
    id: idMatch ? idMatch[1] : "",
    question_text: questionTextMatch ? questionTextMatch[1] : "",
    explanation: explanationMatch ? explanationMatch[1] : "",
    correct_answer_json: answerMatch ? answerMatch[1] : "{}",
    tags_json: tagsMatch ? tagsMatch[1] : "{}",
  };
}

// メイン処理関数
function enhanceExplanations(
  startQuestionId = "Q_J_011",
  endQuestionId = "Q_J_050",
) {
  console.log(
    `解説改善スクリプト v2 開始... (${startQuestionId} - ${endQuestionId})`,
  );

  // master-questions.tsを読み込み
  const masterQuestionsPath = path.join(
    __dirname,
    "../src/data/master-questions.ts",
  );

  // バックアップ作成
  const backupPath = `${masterQuestionsPath}.backup-enhanced-${Date.now()}`;
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

    // 指定範囲の問題のみ処理
    if (questionId < startQuestionId || questionId > endQuestionId) {
      continue;
    }

    // 既に新形式の解説がある問題はスキップ
    if (match[0].includes("【基本概念】")) {
      console.log(`スキップ: ${questionId} (既に新形式)`);
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
    } else {
      console.log(`テンプレート未対応: ${questionId}`);
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

  return enhancedCount;
}

// 段階的処理関数
function enhanceExplanationsByPhase(phase = 1) {
  const phases = {
    1: { start: "Q_J_011", end: "Q_J_050", description: "基本的な仕訳問題" },
    2: { start: "Q_J_051", end: "Q_J_100", description: "応用仕訳問題" },
    3: { start: "Q_J_101", end: "Q_J_150", description: "帳簿問題" },
    4: { start: "Q_J_151", end: "Q_J_200", description: "試算表問題" },
    5: { start: "Q_J_201", end: "Q_J_302", description: "総合問題" },
  };

  if (phases[phase]) {
    const { start, end, description } = phases[phase];
    console.log(`\n=== フェーズ${phase}: ${description} ===`);
    return enhanceExplanations(start, end);
  } else {
    console.log("不正なフェーズ番号です。1-5を指定してください。");
    return 0;
  }
}

// スクリプト実行
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // デフォルト: フェーズ1を実行
    enhanceExplanationsByPhase(1);
  } else if (args[0] === "phase") {
    // フェーズ指定実行
    const phase = parseInt(args[1]) || 1;
    enhanceExplanationsByPhase(phase);
  } else if (args[0] === "range") {
    // 範囲指定実行
    const start = args[1] || "Q_J_011";
    const end = args[2] || "Q_J_050";
    enhanceExplanations(start, end);
  } else {
    console.log("使用方法:");
    console.log("  node scripts/enhance-explanations-v2.js");
    console.log("  node scripts/enhance-explanations-v2.js phase 1");
    console.log(
      "  node scripts/enhance-explanations-v2.js range Q_J_011 Q_J_050",
    );
  }
}

module.exports = {
  enhanceExplanations,
  enhanceExplanationsByPhase,
  explanationTemplates,
};
