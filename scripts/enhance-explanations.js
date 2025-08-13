#!/usr/bin/env node

/**
 * 第1問（仕訳問題）の解説内容を充実させるスクリプト
 * 全250問の解説を、より詳細で学習に役立つ内容に更新
 */

const fs = require("fs");
const path = require("path");

// 解説テンプレート関数
function createDetailedExplanation(question, index) {
  const { id, question_text, correct_answer_json, tags_json } = question;
  const tags = JSON.parse(tags_json);
  const correctAnswer = JSON.parse(correct_answer_json);
  const journalEntry = correctAnswer.journalEntry;

  // 勘定科目の5要素分類
  const accountClassification = {
    // 資産
    現金: "資産",
    現金過不足: "資産",
    当座預金: "資産",
    普通預金: "資産",
    小口現金: "資産",
    売掛金: "資産",
    受取手形: "資産",
    商品: "資産",
    前払金: "資産",
    前払費用: "資産",
    仮払金: "資産",
    貸付金: "資産",
    建物: "資産",
    備品: "資産",
    土地: "資産",
    車両運搬具: "資産",
    // 負債
    買掛金: "負債",
    支払手形: "負債",
    前受金: "負債",
    前受収益: "負債",
    仮受金: "負債",
    未払金: "負債",
    未払費用: "負債",
    借入金: "負債",
    預り金: "負債",
    当座借越: "負債",
    貸倒引当金: "資産のマイナス",
    減価償却累計額: "資産のマイナス",
    // 純資産
    資本金: "純資産",
    繰越利益剰余金: "純資産",
    引出金: "純資産のマイナス",
    // 収益
    売上: "収益",
    受取利息: "収益",
    受取手数料: "収益",
    受取配当金: "収益",
    固定資産売却益: "収益",
    雑収入: "収益",
    // 費用
    仕入: "費用",
    給料: "費用",
    支払利息: "費用",
    支払手数料: "費用",
    減価償却費: "費用",
    貸倒引当金繰入: "費用",
    租税公課: "費用",
    水道光熱費: "費用",
    通信費: "費用",
    旅費交通費: "費用",
    消耗品費: "費用",
    修繕費: "費用",
    固定資産売却損: "費用",
    雑損失: "費用",
  };

  // パターン別の詳細解説
  const patternExplanations = {
    現金過不足: {
      basic:
        "現金の実際有高と帳簿残高に差額が生じた場合に使用する勘定科目です。",
      mistakePoint:
        "【間違えやすいポイント】\\n・実際有高 < 帳簿残高 → 現金が不足（借方：現金過不足／貸方：現金）\\n・実際有高 > 帳簿残高 → 現金が過剰（借方：現金／貸方：現金過不足）\\n・「不足」という言葉に惑わされず、実際の金額関係を確認することが重要です。",
      memoryTip:
        "【覚え方のコツ】\\n「実際に数えたら帳簿より少ない」→「現金が減った」→「貸方に現金」\\n「帳簿と実際の差額」→「借方に現金過不足」\\n実際の現金が基準となることを覚えましょう。",
      practicalExample:
        "【実務での使用例】\\nレジの締め作業で、売上記録が10万円なのに実際の現金が9万8千円しかない場合など、日常的に発生します。原因究明後、適切な勘定科目に振り替えます。",
      relatedKnowledge:
        "【関連知識】\\n現金過不足は一時的な勘定科目です。原因が判明したら、該当する勘定科目（雑損失、雑収入など）に振り替えます。決算時に原因不明の場合は、雑損失または雑収入として処理します。",
    },
    小口現金: {
      basic:
        "日常の少額支払いに備えて、経理部門から各部署に前渡しする現金です。",
      mistakePoint:
        "【間違えやすいポイント】\\n・小口現金の「補給」と「前渡し」を混同しやすい\\n・定額資金前渡制度（インプレスト・システム）では、使用分だけを補給\\n・小口現金係からの支払報告時の処理を間違えやすい",
      memoryTip:
        "【覚え方のコツ】\\n「小口現金を渡す」→「小口現金が増える（借方）」\\n「現金が減る」→「現金が貸方」\\nインプレスト・システムは「印プレスト」→「印鑑を押して定額」と覚える",
      practicalExample:
        "【実務での使用例】\\n営業部に月初に5万円を前渡し、交通費や文具購入などの支払いに使用。月末に使用分（例：3万円）を補給して、常に5万円を保持する仕組みです。",
      relatedKnowledge:
        "【関連知識】\\n小口現金は「資産」勘定です。定額資金前渡制度では、補給時に費用計上します。小口現金出納帳で管理し、定期的に残高確認を行います。",
    },
    当座預金振込: {
      basic: "銀行の当座預金口座への入金・振込を処理する仕訳です。",
      mistakePoint:
        "【間違えやすいポイント】\\n・当座預金と普通預金を混同しやすい\\n・小切手の振出と入金のタイミングの違い\\n・他人振出小切手は「現金」として扱うことに注意",
      memoryTip:
        "【覚え方のコツ】\\n「当座に入金」→「当座預金が増える（借方）」\\n「売掛金を回収」→「売掛金が減る（貸方）」\\n当座預金は「資産」なので、増加は借方、減少は貸方",
      practicalExample:
        "【実務での使用例】\\n得意先から売掛金30万円が当座預金に振り込まれた場合。企業間取引では当座預金振込が一般的で、小切手や手形の決済にも使用されます。",
      relatedKnowledge:
        "【関連知識】\\n当座預金は小切手・手形の決済用口座です。当座借越契約があれば、残高不足でも一定額まで支払い可能です。利息は付きませんが、企業取引の要となる口座です。",
    },
    当座借越: {
      basic:
        "当座預金残高を超えて支払いをした場合の、銀行からの一時的な借入れです。",
      mistakePoint:
        "【間違えやすいポイント】\\n・当座借越は「負債」勘定であることを忘れやすい\\n・当座預金がマイナスになったときに使用\\n・二勘定制と一勘定制の処理方法の違い",
      memoryTip:
        "【覚え方のコツ】\\n「借越」＝「借りて越える」＝「負債」\\n当座預金残高を「越えて」銀行から「借りる」\\n負債の増加は貸方に記入",
      practicalExample:
        "【実務での使用例】\\n当座預金残高50万円で、80万円の小切手を振り出した場合、30万円が当座借越となります。取引銀行と当座借越契約を結んでいる場合のみ可能です。",
      relatedKnowledge:
        "【関連知識】\\n当座借越限度額は銀行との契約で決まります。利息が発生し、「支払利息」として処理します。資金繰りの一時的な調整に使用されますが、常態化は避けるべきです。",
    },
    売上: {
      basic: "商品やサービスを販売して得た収益を表す勘定科目です。",
      mistakePoint:
        "【間違えやすいポイント】\\n・売上は「収益」勘定なので貸方に記入\\n・売掛金との混同に注意（売掛金は資産）\\n・返品時は売上戻りとして借方に記入",
      memoryTip:
        "【覚え方のコツ】\\n「売上が上がる」→「収益の増加」→「貸方」\\n収益の増加は必ず貸方に記入することを覚える\\n「売上↑」＝「貸方」",
      practicalExample:
        "【実務での使用例】\\n商品10万円を現金で販売した場合、借方に現金10万円、貸方に売上10万円。掛け販売の場合は、借方が売掛金になります。",
      relatedKnowledge:
        "【関連知識】\\n売上は損益計算書の最初に表示される重要な項目です。売上高から各種費用を差し引いて利益が計算されます。",
    },
    仕入: {
      basic: "販売目的で商品を購入した際の原価を表す勘定科目です。",
      mistakePoint:
        "【間違えやすいポイント】\\n・仕入は「費用」勘定なので借方に記入\\n・買掛金との混同に注意（買掛金は負債）\\n・三分法では商品勘定を使わず仕入勘定を使用",
      memoryTip:
        "【覚え方のコツ】\\n「仕入れる」→「費用の発生」→「借方」\\n費用の増加は必ず借方に記入\\n「仕入↑」＝「借方」",
      practicalExample:
        "【実務での使用例】\\n商品5万円を掛けで仕入れた場合、借方に仕入5万円、貸方に買掛金5万円。現金仕入の場合は、貸方が現金になります。",
      relatedKnowledge:
        "【関連知識】\\n三分法では、仕入・売上・繰越商品の3つの勘定で商品売買を記録します。仕入原価は売上原価の計算に使用されます。",
    },
    売掛金: {
      basic: "商品を掛けで販売した際の、代金を受け取る権利を表す資産勘定です。",
      mistakePoint:
        "【間違えやすいポイント】\\n・売掛金は「資産」、買掛金は「負債」\\n・未収入金との違い（未収入金は商品以外）\\n・回収時は売掛金が減少（貸方）",
      memoryTip:
        "【覚え方のコツ】\\n「売」掛金＝「売った」ツケ＝もらう権利（資産）\\n「ツケで売る」→「売掛金（借方）」\\n「代金回収」→「売掛金減少（貸方）」",
      practicalExample:
        "【実務での使用例】\\n商品20万円を掛けで販売：借方）売掛金20万円／貸方）売上20万円\\n1か月後に代金回収：借方）現金20万円／貸方）売掛金20万円",
      relatedKnowledge:
        "【関連知識】\\n売掛金は貸借対照表の流動資産に表示されます。回収期限管理が重要で、長期滞留は貸倒リスクがあります。",
    },
    買掛金: {
      basic: "商品を掛けで仕入れた際の、代金を支払う義務を表す負債勘定です。",
      mistakePoint:
        "【間違えやすいポイント】\\n・買掛金は「負債」、売掛金は「資産」\\n・未払金との違い（未払金は商品以外）\\n・支払時は買掛金が減少（借方）",
      memoryTip:
        "【覚え方のコツ】\\n「買」掛金＝「買った」ツケ＝払う義務（負債）\\n「ツケで買う」→「買掛金（貸方）」\\n「代金支払」→「買掛金減少（借方）」",
      practicalExample:
        "【実務での使用例】\\n商品15万円を掛けで仕入：借方）仕入15万円／貸方）買掛金15万円\\n1か月後に代金支払：借方）買掛金15万円／貸方）現金15万円",
      relatedKnowledge:
        "【関連知識】\\n買掛金は貸借対照表の流動負債に表示されます。支払期日管理が重要で、資金繰りに直接影響します。",
    },
    受取手形: {
      basic: "商品代金の支払いとして受け取った約束手形を表す資産勘定です。",
      mistakePoint:
        "【間違えやすいポイント】\\n・受取手形は「資産」、支払手形は「負債」\\n・「受け取った」か「振り出した」かの確認\\n・他店振出小切手は「現金」として処理",
      memoryTip:
        "【覚え方のコツ】\\n「受取」手形＝手形を「もらう」＝資産\\n手形を受け取る→将来お金をもらえる権利\\n満期日に現金化される約束",
      practicalExample:
        "【実務での使用例】\\n商品30万円を販売し手形受取：借方）受取手形30万円／貸方）売上30万円\\n満期日に入金：借方）当座預金30万円／貸方）受取手形30万円",
      relatedKnowledge:
        "【関連知識】\\n受取手形は満期日まで保有するか、銀行で割引（手形割引）して早期資金化も可能です。不渡りリスクがあります。",
    },
    支払手形: {
      basic: "商品代金の支払いとして振り出した約束手形を表す負債勘定です。",
      mistakePoint:
        "【間違えやすいポイント】\\n・支払手形は「負債」、受取手形は「資産」\\n・「振り出した」か「受け取った」かの確認\\n・自店振出手形を受け取った場合は支払手形の減少",
      memoryTip:
        "【覚え方のコツ】\\n「支払」手形＝手形を「渡す」＝負債\\n手形を振り出す→将来お金を払う義務\\n満期日に支払いが発生",
      practicalExample:
        "【実務での使用例】\\n商品25万円を仕入れ手形振出：借方）仕入25万円／貸方）支払手形25万円\\n満期日に決済：借方）支払手形25万円／貸方）当座預金25万円",
      relatedKnowledge:
        "【関連知識】\\n支払手形は満期日に確実に決済する必要があります。不渡りを出すと銀行取引停止処分のリスクがあります。",
    },
    給料: {
      basic: "従業員に支払う給与・賃金を表す費用勘定です。",
      mistakePoint:
        "【間違えやすいポイント】\\n・源泉所得税は「預り金」として処理\\n・社会保険料の従業員負担分も「預り金」\\n・手取額と総支給額の違いに注意",
      memoryTip:
        "【覚え方のコツ】\\n総支給額＝費用（借方）\\n源泉税等＝預り金（貸方）\\n手取額＝現金（貸方）",
      practicalExample:
        "【実務での使用例】\\n給料30万円、源泉税3万円の場合：\\n借方）給料30万円／貸方）預り金3万円、現金27万円",
      relatedKnowledge:
        "【関連知識】\\n預り金は後日税務署等に納付します。給料は損益計算書の販売費及び一般管理費に含まれます。",
    },
    減価償却費: {
      basic: "固定資産の価値減少分を費用として計上する勘定科目です。",
      mistakePoint:
        "【間違えやすいポイント】\\n・直接法と間接法の違い\\n・間接法では「減価償却累計額」を使用\\n・月割計算の端数処理",
      memoryTip:
        "【覚え方のコツ】\\n間接法：借方）減価償却費／貸方）減価償却累計額\\n直接法：借方）減価償却費／貸方）固定資産\\n累計額は資産のマイナス勘定",
      practicalExample:
        "【実務での使用例】\\n車両100万円、耐用年数5年、定額法の場合：\\n年間20万円を減価償却費として計上",
      relatedKnowledge:
        "【関連知識】\\n減価償却は固定資産の取得原価を使用期間に配分する会計処理です。定額法が簿記3級の主要論点です。",
    },
    貸倒引当金: {
      basic:
        "売掛金等の回収不能見込額に備える引当金（資産のマイナス勘定）です。",
      mistakePoint:
        "【間違えやすいポイント】\\n・貸倒引当金は「資産のマイナス」勘定\\n・設定時は「貸倒引当金繰入」（費用）を使用\\n・実際の貸倒時の処理",
      memoryTip:
        "【覚え方のコツ】\\n設定：借方）貸倒引当金繰入／貸方）貸倒引当金\\n貸倒：借方）貸倒引当金／貸方）売掛金\\n引当金は将来の損失に備える",
      practicalExample:
        "【実務での使用例】\\n売掛金100万円の2％を貸倒引当金として設定：\\n借方）貸倒引当金繰入2万円／貸方）貸倒引当金2万円",
      relatedKnowledge:
        "【関連知識】\\n貸倒引当金は貸借対照表で売掛金から控除して表示されます。保守的な会計処理の一例です。",
    },
  };

  // 基本パターンを特定
  let pattern = tags.pattern || "基本仕訳";
  let explanationData = patternExplanations[pattern] || {};

  // デフォルトの解説を生成
  if (!explanationData.basic) {
    explanationData = {
      basic: `${journalEntry.debit_account}（借方）と${journalEntry.credit_account}（貸方）の仕訳です。`,
      mistakePoint:
        "【間違えやすいポイント】\\n借方と貸方の勘定科目を逆にしないよう注意が必要です。",
      memoryTip:
        "【覚え方のコツ】\\n取引の流れを理解し、資産・負債・純資産・収益・費用の5要素の増減を把握しましょう。",
      practicalExample:
        "【実務での使用例】\\n日常的な取引処理で使用される基本的な仕訳です。",
      relatedKnowledge: "【関連知識】\\n簿記の基本原則に基づいた処理です。",
    };
  }

  // 勘定科目の5要素分類を追加
  const debitClass =
    accountClassification[journalEntry.debit_account] || "その他";
  const creditClass =
    accountClassification[journalEntry.credit_account] || "その他";

  // 詳細な解説を構築
  const detailedExplanation = `${explanationData.basic}

【仕訳の構造】
借方：${journalEntry.debit_account}（${debitClass}） ${journalEntry.debit_amount.toLocaleString()}円
貸方：${journalEntry.credit_account}（${creditClass}） ${journalEntry.credit_amount.toLocaleString()}円

${explanationData.mistakePoint}

${explanationData.memoryTip}

${explanationData.practicalExample}

${explanationData.relatedKnowledge}`;

  return detailedExplanation;
}

// メイン処理
function enhanceExplanations() {
  console.log("📚 第1問の解説内容充実化を開始します");
  console.log("=====================================");

  const filePath = path.join(__dirname, "../src/data/master-questions.ts");
  const fileContent = fs.readFileSync(filePath, "utf8");

  // TypeScriptファイルから問題データを抽出
  const questionsMatch = fileContent.match(
    /export const masterQuestions: Question\[\] = \[([\s\S]*?)\];/,
  );
  if (!questionsMatch) {
    console.error("❌ 問題データの抽出に失敗しました");
    return;
  }

  // 問題オブジェクトを解析
  let questions = [];
  const questionPattern = /\{[\s\S]*?id: "(Q_J_\d+)"[\s\S]*?\},(?=\s*\{|$)/g;
  let match;
  let updatedCount = 0;

  // 各問題を処理
  let updatedContent = fileContent;

  for (let i = 1; i <= 250; i++) {
    const questionId = `Q_J_${String(i).padStart(3, "0")}`;
    console.log(`処理中: ${questionId}`);

    // 該当する問題を検索 - より詳細なパターンマッチング
    const questionPattern = `id: "${questionId}"[\\s\\S]*?updated_at:`;
    const questionRegex = new RegExp(questionPattern, "g");
    const questionMatches = fileContent.match(questionRegex);

    if (questionMatches && questionMatches[0]) {
      const fullMatch = questionMatches[0];

      // 各フィールドを個別に抽出
      const questionTextMatch = fullMatch.match(
        /question_text:\\s*"([^"]*(?:\\\\.[^"]*)*)"/,
      );
      const correctAnswerMatch =
        fullMatch.match(/correct_answer_json:\\s*'([^']*)'/) ||
        fullMatch.match(/correct_answer_json:\\s*"([^"]*(?:\\\\.[^"]*)*)"/);
      const tagsMatch =
        fullMatch.match(/tags_json:\\s*'([^']*)'/) ||
        fullMatch.match(/tags_json:\\s*"([^"]*(?:\\\\.[^"]*)*)"/);
      const explanationMatch = fullMatch.match(
        /explanation:\\s*"([^"]*(?:\\\\.[^"]*)*)"/,
      );

      if (
        questionTextMatch &&
        correctAnswerMatch &&
        tagsMatch &&
        explanationMatch
      ) {
        const question = {
          id: questionId,
          question_text: questionTextMatch[1],
          correct_answer_json: correctAnswerMatch[1],
          tags_json: tagsMatch[1],
        };

        const detailedExplanation = createDetailedExplanation(question, i);
        // エスケープ処理
        const escapedExplanation = detailedExplanation
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"')
          .replace(/\n/g, "\\n");

        // 既存の説明を新しい説明で置換
        const oldExplanation = explanationMatch[0];
        const newExplanation = `explanation:\\n      "${escapedExplanation}"`;

        updatedContent = updatedContent.replace(oldExplanation, newExplanation);
        updatedCount++;
      }
    }
  }

  // ファイルに書き戻し
  fs.writeFileSync(filePath, updatedContent, "utf8");

  console.log(`\n✅ 合計 ${updatedCount} 問の解説を更新しました`);
  console.log("=====================================");
}

// 実行
try {
  enhanceExplanations();
  process.exit(0);
} catch (error) {
  console.error("❌ エラーが発生しました:", error);
  process.exit(1);
}
