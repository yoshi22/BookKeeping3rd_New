#!/usr/bin/env node

/**
 * 第1問（仕訳問題）の解説内容を充実させるスクリプト（簡略版）
 * 全250問の解説を、より詳細で学習に役立つ内容に更新
 */

const fs = require("fs");
const path = require("path");

// 解説テンプレート
const explanationTemplates = {
  現金過不足: `現金の実際有高と帳簿残高に差額が生じた場合に使用する勘定科目です。\\n\\n【間違えやすいポイント】\\n・実際有高 < 帳簿残高 → 現金が不足（借方：現金過不足／貸方：現金）\\n・実際有高 > 帳簿残高 → 現金が過剰（借方：現金／貸方：現金過不足）\\n\\n【覚え方のコツ】\\n「実際に数えたら帳簿より少ない」→「現金が減った」→「貸方に現金」`,

  小口現金: `日常の少額支払いに備えて前渡しする現金です。\\n\\n【間違えやすいポイント】\\n・小口現金の「補給」と「前渡し」を混同しやすい\\n・定額資金前渡制度（インプレスト・システム）では、使用分だけを補給\\n\\n【覚え方のコツ】\\n「小口現金を渡す」→「小口現金が増える（借方）」`,

  当座預金: `銀行の当座預金口座への入金・振込を処理する仕訳です。\\n\\n【間違えやすいポイント】\\n・当座預金と普通預金を混同しやすい\\n・他人振出小切手は「現金」として扱うことに注意\\n\\n【覚え方のコツ】\\n「当座に入金」→「当座預金が増える（借方）」`,

  売上: `商品やサービスを販売して得た収益を表す勘定科目です。\\n\\n【間違えやすいポイント】\\n・売上は「収益」勘定なので貸方に記入\\n・売掛金との混同に注意（売掛金は資産）\\n\\n【覚え方のコツ】\\n「売上が上がる」→「収益の増加」→「貸方」`,

  仕入: `販売目的で商品を購入した際の原価を表す勘定科目です。\\n\\n【間違えやすいポイント】\\n・仕入は「費用」勘定なので借方に記入\\n・買掛金との混同に注意（買掛金は負債）\\n\\n【覚え方のコツ】\\n「仕入れる」→「費用の発生」→「借方」`,

  売掛金: `商品を掛けで販売した際の、代金を受け取る権利を表す資産勘定です。\\n\\n【間違えやすいポイント】\\n・売掛金は「資産」、買掛金は「負債」\\n・回収時は売掛金が減少（貸方）\\n\\n【覚え方のコツ】\\n「売」掛金＝「売った」ツケ＝もらう権利（資産）`,

  買掛金: `商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。\\n\\n【間違えやすいポイント】\\n・買掛金は「負債」、売掛金は「資産」\\n・支払時は買掛金が減少（借方）\\n\\n【覚え方のコツ】\\n「買」掛金＝「買った」ツケ＝払う義務（負債）`,

  受取手形: `商品代金の支払いとして受け取った約束手形を表す資産勘定です。\\n\\n【間違えやすいポイント】\\n・受取手形は「資産」、支払手形は「負債」\\n・他店振出小切手は「現金」として処理\\n\\n【覚え方のコツ】\\n「受取」手形＝手形を「もらう」＝資産`,

  支払手形: `商品代金の支払いとして振り出した約束手形を表す負債勘定です。\\n\\n【間違えやすいポイント】\\n・支払手形は「負債」、受取手形は「資産」\\n・自店振出手形を受け取った場合は支払手形の減少\\n\\n【覚え方のコツ】\\n「支払」手形＝手形を「渡す」＝負債`,

  給料: `従業員に支払う給与・賃金を表す費用勘定です。\\n\\n【間違えやすいポイント】\\n・源泉所得税は「預り金」として処理\\n・手取額と総支給額の違いに注意\\n\\n【覚え方のコツ】\\n総支給額＝費用（借方）、源泉税等＝預り金（貸方）`,

  減価償却費: `固定資産の価値減少分を費用として計上する勘定科目です。\\n\\n【間違えやすいポイント】\\n・直接法と間接法の違い\\n・間接法では「減価償却累計額」を使用\\n\\n【覚え方のコツ】\\n間接法：借方）減価償却費／貸方）減価償却累計額`,

  貸倒引当金: `売掛金等の回収不能見込額に備える引当金です。\\n\\n【間違えやすいポイント】\\n・貸倒引当金は「資産のマイナス」勘定\\n・設定時は「貸倒引当金繰入」（費用）を使用\\n\\n【覚え方のコツ】\\n設定：借方）貸倒引当金繰入／貸方）貸倒引当金`,

  DEFAULT: `簿記の基本的な仕訳です。借方と貸方の勘定科目を正しく理解することが重要です。`,
};

function getEnhancedExplanation(questionId, questionText, correctAnswer, tags) {
  // パターンまたは勘定科目から適切なテンプレートを選択
  let parsedTags;
  try {
    parsedTags = JSON.parse(tags);
  } catch {
    parsedTags = {};
  }

  let parsedAnswer;
  try {
    parsedAnswer = JSON.parse(correctAnswer);
  } catch {
    parsedAnswer = {};
  }

  const pattern = parsedTags.pattern || "";
  const debitAccount = parsedAnswer.journalEntry?.debit_account || "";
  const creditAccount = parsedAnswer.journalEntry?.credit_account || "";

  // パターンや勘定科目に基づいてテンプレートを選択
  let explanation = explanationTemplates.DEFAULT;

  if (explanationTemplates[pattern]) {
    explanation = explanationTemplates[pattern];
  } else if (explanationTemplates[debitAccount]) {
    explanation = explanationTemplates[debitAccount];
  } else if (explanationTemplates[creditAccount]) {
    explanation = explanationTemplates[creditAccount];
  }

  // 基本情報を追加
  const debitAmount = parsedAnswer.journalEntry?.debit_amount || 0;
  const creditAmount = parsedAnswer.journalEntry?.credit_amount || 0;

  const fullExplanation = `${explanation}\\n\\n【仕訳】\\n借方：${debitAccount} ${debitAmount.toLocaleString()}円\\n貸方：${creditAccount} ${creditAmount.toLocaleString()}円`;

  return fullExplanation;
}

// メイン処理
function updateExplanations() {
  console.log("📚 第1問の解説内容更新を開始します");
  console.log("=====================================");

  const filePath = path.join(__dirname, "../src/data/master-questions.ts");
  let fileContent = fs.readFileSync(filePath, "utf8");
  let updatedCount = 0;

  // 各問題IDを個別に処理
  for (let i = 1; i <= 250; i++) {
    const questionId = `Q_J_${String(i).padStart(3, "0")}`;

    // 問題IDの位置を探す
    const idPattern = `id: "${questionId}"`;
    const idIndex = fileContent.indexOf(idPattern);

    if (idIndex === -1) {
      console.log(`⚠️ ${questionId}: 見つかりません`);
      continue;
    }

    // 次の問題IDまたはファイル終端までを取得
    const nextIdPattern = `id: "Q_J_${String(i + 1).padStart(3, "0")}"`;
    const nextIdIndex = fileContent.indexOf(nextIdPattern, idIndex);
    const endIndex = nextIdIndex !== -1 ? nextIdIndex : fileContent.length;

    const questionBlock = fileContent.substring(idIndex, endIndex);

    // 各フィールドを抽出
    const questionTextMatch = questionBlock.match(/question_text:\s*"([^"]*)"/);
    const correctAnswerMatch =
      questionBlock.match(/correct_answer_json:\s*'([^']*)'/) ||
      questionBlock.match(/correct_answer_json:\s*"([^"]*)"/);
    const tagsMatch =
      questionBlock.match(/tags_json:\s*'([^']*)'/) ||
      questionBlock.match(/tags_json:\s*"([^"]*)"/);
    const explanationMatch = questionBlock.match(/explanation:\s*"([^"]*)"/);

    if (
      questionTextMatch &&
      correctAnswerMatch &&
      tagsMatch &&
      explanationMatch
    ) {
      const enhancedExplanation = getEnhancedExplanation(
        questionId,
        questionTextMatch[1],
        correctAnswerMatch[1],
        tagsMatch[1],
      );

      // 既存の説明を新しい説明で置換
      const oldExplanationFull = explanationMatch[0];
      const newExplanationFull = `explanation:\n      "${enhancedExplanation}"`;

      fileContent = fileContent.replace(oldExplanationFull, newExplanationFull);
      updatedCount++;
      console.log(`✅ ${questionId}: 更新完了`);
    } else {
      console.log(`⚠️ ${questionId}: フィールドが不完全`);
    }
  }

  // ファイルに書き戻し
  fs.writeFileSync(filePath, fileContent, "utf8");

  console.log(`\n✅ 合計 ${updatedCount} 問の解説を更新しました`);
  console.log("=====================================");
}

// 実行
try {
  updateExplanations();
  process.exit(0);
} catch (error) {
  console.error("❌ エラーが発生しました:", error);
  process.exit(1);
}
