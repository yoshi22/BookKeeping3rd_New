#!/usr/bin/env node

/**
 * 全問題の解説を学習に役立つ内容に改善するスクリプト
 * - 間違えやすい勘定科目
 * - 理解のポイント
 * - カスタマイズされた学習アドバイス
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

console.log("📚 全問題の解説を改善中...\n");

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

// 改善された解説を生成する関数
function generateImprovedExplanation(question) {
  const id = question.id;
  const questionText = question.question_text;
  const template = JSON.parse(question.answer_template_json);
  const answer = JSON.parse(question.correct_answer_json);

  // 第一問（仕訳問題）の解説
  if (id.startsWith("Q_J_")) {
    // 問題文から取引内容を判断
    if (questionText.includes("現金過不足")) {
      return (
        "現金過不足の仕訳では、実際有高と帳簿残高の差額を「現金過不足」勘定で処理します。\n\n" +
        "💡 間違えやすいポイント：\n" +
        "• 現金が不足の場合：借方「現金過不足」／貸方「現金」\n" +
        "• 現金が過剰の場合：借方「現金」／貸方「現金過不足」\n" +
        "• 決算時に原因不明の場合は「雑損」（不足）または「雑益」（過剰）に振り替え\n\n" +
        "🎯 理解のコツ：\n" +
        "現金過不足は一時的な勘定科目。原因が判明したら該当する勘定科目に振り替え、決算時まで不明なら雑損・雑益として処理します。"
      );
    }

    if (questionText.includes("小切手")) {
      const isSelfIssued =
        questionText.includes("自己振出") || questionText.includes("自社振出");
      return (
        `小切手の処理では、振出人によって勘定科目が異なります。\n\n` +
        `💡 間違えやすいポイント：\n` +
        `• 他店振出小切手を受取 → 「現金」として処理\n` +
        `• 自己振出小切手を受取 → 「当座預金」として処理\n` +
        `• 小切手を振り出す → 貸方「当座預金」\n\n` +
        `🎯 理解のコツ：\n` +
        `${
          isSelfIssued
            ? "自己振出小切手は、すでに自社の当座預金から引き落とされているため、受け取っても現金ではなく当座預金の戻りとして処理します。"
            : "他店振出小切手は、すぐに現金化できる通貨代用証券のため「現金」勘定で処理します。銀行で換金する手間を省略した処理です。"
        }`
      );
    }

    if (questionText.includes("仕入") || questionText.includes("売上")) {
      const isReturn =
        questionText.includes("返品") || questionText.includes("戻り");
      const isDiscount = questionText.includes("値引");

      return (
        `商品売買の三分法による処理です。\n\n` +
        `💡 間違えやすいポイント：\n` +
        `• 仕入時：借方「仕入」／貸方「買掛金」または「現金」\n` +
        `• 売上時：借方「売掛金」または「現金」／貸方「売上」\n` +
        `${isReturn ? "• 返品は逆仕訳で処理（仕入返品は貸方「仕入」、売上返品は借方「売上」）\n" : ""}` +
        `${isDiscount ? "• 値引も返品と同様に逆仕訳で処理\n" : ""}\n` +
        `🎯 理解のコツ：\n` +
        `三分法では「仕入」「売上」「繰越商品」の3つの勘定科目を使用。` +
        `${
          isReturn
            ? "返品・値引は元の取引と逆の仕訳をすることで取り消し効果を表現します。"
            : "期中は売上原価を計算せず、決算時に「売上原価＝期首商品＋仕入－期末商品」で算出します。"
        }`
      );
    }

    if (questionText.includes("手形")) {
      const isReceivable =
        questionText.includes("受取") || questionText.includes("受け取");
      const isPayable =
        questionText.includes("振出") || questionText.includes("振り出");

      return (
        `約束手形の処理です。\n\n` +
        `💡 間違えやすいポイント：\n` +
        `• 手形を受取 → 借方「受取手形」（資産の増加）\n` +
        `• 手形を振出 → 貸方「支払手形」（負債の増加）\n` +
        `• 小切手と違い、満期日まで現金化できない\n\n` +
        `🎯 理解のコツ：\n` +
        `${
          isReceivable
            ? "受取手形は将来お金を受け取る権利（資産）。満期日に現金化されるまで「受取手形」勘定で管理します。"
            : "支払手形は将来お金を支払う義務（負債）。約束手形は信用取引の一種で、後日支払いを約束する証券です。"
        }`
      );
    }

    if (questionText.includes("給料") || questionText.includes("給与")) {
      return (
        "給料支払いの仕訳では、源泉徴収などの天引き処理に注意が必要です。\n\n" +
        "💡 間違えやすいポイント：\n" +
        "• 総額を「給料」（費用）として計上\n" +
        "• 源泉所得税は「預り金」（負債）として処理\n" +
        "• 社会保険料も「預り金」として処理\n" +
        "• 手取額のみ「現金」または「普通預金」から支出\n\n" +
        "🎯 理解のコツ：\n" +
        "給料の総額を費用計上し、天引き分は会社が一時的に預かるため「預り金」として処理。後日、預り金を税務署等に納付します。"
      );
    }

    if (questionText.includes("家賃") || questionText.includes("保険")) {
      const isPrepaid =
        questionText.includes("前払") || questionText.includes("先払");
      const isAccrued =
        questionText.includes("未払") || questionText.includes("後払");

      return (
        `${isPrepaid ? "前払費用" : isAccrued ? "未払費用" : "経過勘定"}の処理です。\n\n` +
        `💡 間違えやすいポイント：\n` +
        `${
          isPrepaid
            ? "• 支払時：全額を費用計上\n• 決算時：翌期分を「前払○○」（資産）に振替\n• 翌期首：再振替仕訳で費用に戻す"
            : isAccrued
              ? "• 決算時：当期分の未払額を「未払○○」（負債）として計上\n• 同時に該当する費用を計上\n• 翌期首：再振替仕訳で取り消す"
              : "• 期間に応じた費用配分が必要\n• 当期分のみを費用として計上"
        }\n\n` +
        `🎯 理解のコツ：\n` +
        `発生主義により、支払時期に関係なく、サービスを受けた期間に応じて費用を計上します。` +
        `${isPrepaid ? "前払分は資産として繰り延べ、" : isAccrued ? "未払分は負債として認識し、" : ""}適正な期間損益計算を行います。`
      );
    }

    if (questionText.includes("減価償却")) {
      return (
        "固定資産の減価償却の仕訳です。\n\n" +
        "💡 間違えやすいポイント：\n" +
        "• 間接法：借方「減価償却費」／貸方「減価償却累計額」\n" +
        "• 直接法：借方「減価償却費」／貸方「固定資産」\n" +
        "• 定額法の計算：（取得原価－残存価額）÷耐用年数\n" +
        "• 月割計算が必要な場合は12で割って月数を掛ける\n\n" +
        "🎯 理解のコツ：\n" +
        "減価償却は固定資産の価値減少を費用として認識する手続き。間接法では「減価償却累計額」という資産のマイナス勘定を使用し、貸借対照表では固定資産から控除して表示します。"
      );
    }

    if (questionText.includes("貸倒")) {
      const isProvision = questionText.includes("引当金");
      const isLoss =
        questionText.includes("損失") || questionText.includes("発生");

      return (
        `貸倒れに関する処理です。\n\n` +
        `💡 間違えやすいポイント：\n` +
        `${
          isProvision
            ? "• 設定時：借方「貸倒引当金繰入」（費用）／貸方「貸倒引当金」（資産のマイナス）\n" +
              "• 差額補充法：必要額と既存残高の差額のみ繰入または戻入\n" +
              "• 洗替法：一旦全額戻入してから新たに設定"
            : isLoss
              ? "• 当期の売掛金等が貸倒：借方「貸倒損失」／貸方「売掛金」\n" +
                "• 前期以前の売掛金等が貸倒：まず引当金を使用、不足分は貸倒損失"
              : "• 引当金は見積り、損失は実際の貸倒れ"
        }\n\n` +
        `🎯 理解のコツ：\n` +
        `${
          isProvision
            ? "貸倒引当金は将来の貸倒れに備える見積り。売掛金等の回収リスクを事前に費用計上することで、健全な会計処理を実現します。"
            : "実際の貸倒れ発生時は、まず引当金を取り崩し、不足があれば貸倒損失として追加計上します。"
        }`
      );
    }

    // デフォルトの仕訳解説
    return (
      "この仕訳では、借方と貸方の金額を一致させることが重要です。\n\n" +
      "💡 間違えやすいポイント：\n" +
      "• 勘定科目の貸借を逆にしないよう注意\n" +
      "• 金額の計算ミスに注意\n" +
      "• 複合仕訳の場合は、借方合計と貸方合計を必ず一致させる\n\n" +
      "🎯 理解のコツ：\n" +
      "取引の8要素（資産・負債・純資産・収益・費用の増減）を理解し、借方・貸方のルールを確実に身につけましょう。"
    );
  }

  // 第二問（帳簿問題）の解説
  if (id.startsWith("Q_L_")) {
    if (questionText.includes("総勘定元帳") || questionText.includes("元帳")) {
      return (
        "総勘定元帳への転記問題です。\n\n" +
        "💡 間違えやすいポイント：\n" +
        "• 仕訳帳から勘定科目ごとに転記\n" +
        "• 相手勘定科目を摘要欄に記入\n" +
        "• 借方・貸方を逆にしないよう注意\n" +
        "• 諸口がある場合は「諸口」と記入\n\n" +
        "🎯 理解のコツ：\n" +
        "総勘定元帳は勘定科目別の増減明細。T字勘定の左側（借方）と右側（貸方）の位置を間違えないことが重要です。残高は借方合計と貸方合計の差額で計算します。"
      );
    }

    if (questionText.includes("現金出納帳")) {
      return (
        "現金出納帳の記帳問題です。\n\n" +
        "💡 間違えやすいポイント：\n" +
        "• 収入は借方、支出は貸方に記入\n" +
        "• 残高は収入－支出で計算（累計）\n" +
        "• 相手勘定科目を正確に記入\n" +
        "• 小切手受取も現金として処理（他店振出の場合）\n\n" +
        "🎯 理解のコツ：\n" +
        "現金出納帳は現金の入出金を時系列で記録する補助簿。残高がマイナスになることはないので、計算ミスのチェックに活用できます。"
      );
    }

    if (questionText.includes("仕入帳") || questionText.includes("売上帳")) {
      const isPurchase = questionText.includes("仕入");
      return (
        `${isPurchase ? "仕入帳" : "売上帳"}の記帳問題です。\n\n` +
        `💡 間違えやすいポイント：\n` +
        `• ${isPurchase ? "仕入先" : "得意先"}別に記録\n` +
        `• 返品・値引は赤字または△で記入\n` +
        `• 諸掛（送料等）の処理に注意\n` +
        `• 内訳欄には品名・数量・単価を記入\n\n` +
        `🎯 理解のコツ：\n` +
        `${isPurchase ? "仕入帳は商品の仕入取引" : "売上帳は商品の売上取引"}を詳細に記録する補助記入帳。` +
        `${isPurchase ? "仕入先" : "得意先"}別の取引管理や、商品別の${isPurchase ? "仕入" : "売上"}分析に使用されます。`
      );
    }

    if (questionText.includes("商品有高帳")) {
      return (
        "商品有高帳の記帳問題です。\n\n" +
        "💡 間違えやすいポイント：\n" +
        "• 先入先出法：古い商品から先に払出\n" +
        "• 移動平均法：仕入の都度、平均単価を再計算\n" +
        "• 数量・単価・金額を正確に記入\n" +
        "• 残高の数量と金額を常に計算\n\n" +
        "🎯 理解のコツ：\n" +
        "商品有高帳は商品の受入・払出・残高を管理する補助元帳。評価方法により払出単価が変わるため、指示された方法（先入先出法・移動平均法）を確実に適用しましょう。"
      );
    }

    // デフォルトの帳簿解説
    return (
      "帳簿への転記・記入問題です。\n\n" +
      "💡 間違えやすいポイント：\n" +
      "• 転記元と転記先の関係を理解\n" +
      "• 日付・摘要・金額を正確に転記\n" +
      "• 借方・貸方の位置に注意\n" +
      "• 補助簿は主要簿の内容を詳細化したもの\n\n" +
      "🎯 理解のコツ：\n" +
      "主要簿（仕訳帳・総勘定元帳）と補助簿（補助記入帳・補助元帳）の役割を理解し、それぞれの記帳目的に応じた処理を行います。"
    );
  }

  // 第三問（表作成問題）の解説
  if (id.startsWith("Q_T_")) {
    if (questionText.includes("試算表")) {
      const isTotal = questionText.includes("合計");
      const isBalance = questionText.includes("残高");

      return (
        `${isTotal ? "合計" : isBalance ? "残高" : ""}試算表の作成問題です。\n\n` +
        `💡 間違えやすいポイント：\n` +
        `• ${isTotal ? "借方合計と貸方合計をそれぞれ集計" : isBalance ? "借方と貸方の差額（残高）を計算" : "合計残高試算表は両方を記載"}\n` +
        `• 決算整理前の金額を使用\n` +
        `• 借方合計＝貸方合計（貸借一致の原則）\n` +
        `• 勘定科目の分類（資産・負債・純資産・収益・費用）を正確に\n\n` +
        `🎯 理解のコツ：\n` +
        `試算表は仕訳の正確性を検証する表。` +
        `${isTotal ? "合計試算表は取引の規模を把握でき、" : isBalance ? "残高試算表は財政状態を把握でき、" : ""}` +
        `貸借の一致により記帳の正確性を確認できます。`
      );
    }

    if (questionText.includes("精算表")) {
      return (
        "精算表の作成問題です。\n\n" +
        "💡 間違えやすいポイント：\n" +
        "• 決算整理前残高試算表から開始\n" +
        "• 決算整理仕訳を修正記入欄に記入\n" +
        "• 修正後の金額を損益計算書欄と貸借対照表欄に振り分け\n" +
        "• 当期純利益（損失）で貸借を一致させる\n\n" +
        "🎯 理解のコツ：\n" +
        "精算表は「決算整理前→決算整理→決算書作成」の流れを1枚の表にまとめたもの。各欄の貸借は必ず一致し、最終的に当期純利益で全体のバランスを取ります。順番に処理すれば必ず完成します。"
      );
    }

    if (questionText.includes("損益計算書")) {
      return (
        "損益計算書の作成問題です。\n\n" +
        "💡 間違えやすいポイント：\n" +
        "• 収益は貸方、費用は借方に記載\n" +
        "• 売上総利益＝売上高－売上原価\n" +
        "• 営業利益＝売上総利益－販売費及び一般管理費\n" +
        "• 当期純利益＝営業利益＋営業外収益－営業外費用\n\n" +
        "🎯 理解のコツ：\n" +
        "損益計算書は一定期間の経営成績を表す財務諸表。段階的に利益を計算することで、どの段階で利益が出ているか（または損失が出ているか）を分析できます。"
      );
    }

    if (questionText.includes("貸借対照表")) {
      return (
        "貸借対照表の作成問題です。\n\n" +
        "💡 間違えやすいポイント：\n" +
        "• 資産は借方（左側）、負債・純資産は貸方（右側）\n" +
        "• 流動・固定の分類基準（1年基準）を適用\n" +
        "• 減価償却累計額は資産から控除（△表示）\n" +
        "• 貸倒引当金も資産から控除\n" +
        "• 資産合計＝負債合計＋純資産合計（貸借一致）\n\n" +
        "🎯 理解のコツ：\n" +
        "貸借対照表は特定時点の財政状態を表す財務諸表。左側（資産）は資金の運用形態、右側（負債・純資産）は資金の調達源泉を示します。必ず貸借が一致することを確認しましょう。"
      );
    }

    // デフォルトの表作成解説
    return (
      "表作成問題です。\n\n" +
      "💡 間違えやすいポイント：\n" +
      "• 各勘定科目の貸借の位置を正確に\n" +
      "• 集計・転記ミスに注意\n" +
      "• 貸借一致の原則を確認\n" +
      "• 決算整理の処理を確実に反映\n\n" +
      "🎯 理解のコツ：\n" +
      "表作成問題は部分点が取りやすい問題です。完璧を目指さず、わかる部分から確実に埋めていき、最後に貸借の一致を確認しましょう。"
    );
  }

  // その他のデフォルト解説
  return question.explanation;
}

// 各問題の解説を更新
let updatedCount = 0;
questions.forEach((question) => {
  const improvedExplanation = generateImprovedExplanation(question);
  if (improvedExplanation !== question.explanation) {
    question.explanation = improvedExplanation;
    updatedCount++;
  }
});

// TypeScriptファイルを再構築
const beforeData = content.substring(0, startIndex);
const afterData = content.substring(endIndex);

// questionsをTypeScript形式の文字列に変換
const questionsString = JSON.stringify(questions, null, 2)
  .replace(/\\n/g, "\\n")
  .replace(/"/g, '\\"')
  .replace(/\\\\\\"/g, '\\\\\\"');

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

console.log(`✅ ${updatedCount}個の問題の解説を改善しました！\n`);

// サンプル出力
console.log("📝 改善例（最初の5問）:\n");
questions.slice(0, 5).forEach((q) => {
  console.log(`【${q.id}】`);
  console.log(q.explanation.substring(0, 200) + "...\n");
});

console.log("✨ 解説の改善が完了しました！");
console.log("  - 間違えやすいポイントを明記");
console.log("  - 混同しやすい勘定科目を説明");
console.log("  - 理解のためのコツを追加");
console.log("  - 問題タイプごとにカスタマイズ");
