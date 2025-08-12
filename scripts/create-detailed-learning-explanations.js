#!/usr/bin/env node

/**
 * 各問題の具体的な学習ポイント・間違えやすい勘定科目・理解のコツを含む詳細解説を作成
 * ウェブ調査結果に基づく実用的な学習アドバイスを提供
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

console.log("🎯 各問題の詳細学習解説を作成中...\n");

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

// 問題固有の詳細学習解説を生成する関数
function generateDetailedLearningExplanation(question) {
  const questionText = question.question_text;
  const questionId = question.id;

  try {
    const correctAnswer = JSON.parse(question.correct_answer_json);
    const answerTemplate = JSON.parse(question.answer_template_json);

    // 金額を抽出
    const amounts = [];
    const amountMatches = questionText.match(/[\\d,]+円/g);
    if (amountMatches) {
      amounts.push(...amountMatches);
    }

    // 勘定科目を抽出（正答から）
    let accounts = [];
    if (correctAnswer && correctAnswer.entries) {
      correctAnswer.entries.forEach((entry) => {
        if (entry.debit_account) accounts.push(entry.debit_account);
        if (entry.credit_account) accounts.push(entry.credit_account);
      });
    }

    // 第1問（仕訳問題）の詳細学習解説
    if (questionId.startsWith("Q_J_")) {
      let explanation = "";
      let mistakePoints = "";
      let learningTips = "";

      // 現金過不足関連
      if (
        questionText.includes("現金過不足") ||
        questionText.includes("現金実査")
      ) {
        explanation = `現金実査による過不足処理。実際有高と帳簿残高の差額を「現金過不足」で調整します。`;
        mistakePoints = `⚠️ 間違えやすいポイント：「現金過不足」は一時的な仮勘定です。借方・貸方を現金の増減と逆にしないよう注意。現金不足なら借方「現金過不足」・貸方「現金」、現金超過なら借方「現金」・貸方「現金過不足」。`;
        learningTips = `💡 学習のコツ：現金過不足は決算時処理が重要。原因判明時は該当勘定に振替（例：通信費、雑損）。原因不明時は雑損・雑益へ。現金実査＝帳簿残高の検証作業と覚えましょう。`;
      }
      // 小口現金関連
      else if (questionText.includes("小口現金")) {
        explanation = `小口現金制度（インプレスト・システム）の処理。定額資金前渡法により小口支払い資金を管理します。`;
        mistakePoints = `⚠️ 間違えやすいポイント：「小口現金」と「現金」を混同しないこと。小口現金への前渡しは借方「小口現金」・貸方「現金」。補給時も同様です。「預り金」や「仮払金」と間違えない。`;
        learningTips = `💡 学習のコツ：インプレスト・システムでは常に一定額を保持。使用分を補給して元の金額に戻す仕組み。小口現金出納帳との関連も理解しておきましょう。証憑問題で小口現金伝票が出題されることも。`;
      }
      // 売掛金・買掛金関連
      else if (
        questionText.includes("売掛金") ||
        questionText.includes("買掛金")
      ) {
        const isReceivable = questionText.includes("売掛金");
        explanation = `${isReceivable ? "売掛金" : "買掛金"}の処理。${isReceivable ? "商品売上による債権" : "商品仕入による債務"}の発生・消滅を記録します。`;
        mistakePoints = `⚠️ 間違えやすいポイント：${isReceivable ? "売掛金" : "買掛金"}は${isReceivable ? "資産" : "負債"}科目。${isReceivable ? "発生時は借方、回収時は貸方" : "発生時は貸方、支払時は借方"}。「未収金」「未払金」との区別も重要（商品売買以外の取引）。`;
        learningTips = `💡 学習のコツ：掛取引では${isReceivable ? "「売掛金」＋「売上」" : "「仕入」＋「買掛金」"}がセット。回収・支払方法（現金・小切手・手形）により相手勘定が変わる点に注意。返品・値引きは逆仕訳で処理。`;
      }
      // 手形関連
      else if (questionText.includes("手形")) {
        const isReceivable =
          questionText.includes("受取手形") || questionText.includes("受取");
        explanation = `約束手形の${isReceivable ? "受取" : "振出"}処理。${isReceivable ? "将来の現金受取権利" : "将来の現金支払義務"}として処理します。`;
        mistakePoints = `⚠️ 間違えやすいポイント：手形は満期日まで現金化できません。${isReceivable ? "受取手形は資産（借方）" : "支払手形は負債（貸方）"}。小切手と混同しない（小切手は即座に現金化可能）。不渡時の処理も覚えておきましょう。`;
        learningTips = `💡 学習のコツ：手形の当事者を整理（振出人・名宛人・受取人・支払人）。${isReceivable ? "売掛金→受取手形→現金" : "買掛金→支払手形→当座預金減少"}の流れを把握。手形記入帳との関連も重要。`;
      }
      // 小切手関連
      else if (questionText.includes("小切手")) {
        const isDrawn = questionText.includes("振出");
        explanation = `小切手${isDrawn ? "振出" : "受取"}による${isDrawn ? "支払" : "代金回収"}処理。小切手は通貨代用証券として処理します。`;
        mistakePoints = `⚠️ 間違えやすいポイント：${isDrawn ? "小切手振出は「当座預金」の減少（貸方）" : "他店振出小切手受取は「現金」の増加（借方）"}。当座借越時は「当座借越」勘定を使用。自己振出小切手の受取は相殺処理。`;
        learningTips = `💡 学習のコツ：${isDrawn ? "当座預金残高不足→当座借越（銀行からの短期借入）" : "小切手＝即座に現金化可能な証券"}。振出日・受取日の違いによる処理の変化も理解しておきましょう。`;
      }
      // 商品売買関連
      else if (
        (questionText.includes("売上") || questionText.includes("仕入")) &&
        questionText.includes("商品")
      ) {
        const isSales = questionText.includes("売上");
        explanation = `商品${isSales ? "売上" : "仕入"}の三分法処理。${isSales ? "収益" : "費用"}の計上と債権・債務の管理を行います。`;
        mistakePoints = `⚠️ 間違えやすいポイント：三分法では「${isSales ? "売上" : "仕入"}」「繰越商品」を使用。分記法・総記法と混同しない。${isSales ? "売上返品→「売上」減少" : "仕入返品→「仕入」減少"}。運賃負担の処理も要注意。`;
        learningTips = `💡 学習のコツ：${isSales ? "掛売上なら売掛金発生、現金売上なら現金増加" : "掛仕入なら買掛金発生、現金仕入なら現金減少"}。引取運賃は${isSales ? "発送費（販管費）" : "仕入原価に含める"}。期末商品棚卸で売上原価計算。`;
      }
      // 給料・給与関連
      else if (questionText.includes("給料") || questionText.includes("給与")) {
        explanation = `給料支払いの処理。総支給額の費用計上と源泉税等の預り金処理を行います。`;
        mistakePoints = `⚠️ 間違えやすいポイント：「給料」は総支給額で費用計上。源泉税・住民税・社会保険料は「預り金」（負債）。手取額のみを「給料」にしない。未払給料と給料の区別も重要。`;
        learningTips = `💡 学習のコツ：給料＝費用、預り金＝負債、現金＝手取額の関係を理解。預り金は後日税務署・自治体に納付。賞与・退職金も同様の処理。労働保険料の会社負担分は別途「福利厚生費」で計上。`;
      }
      // 減価償却関連
      else if (questionText.includes("減価償却")) {
        explanation = `固定資産の減価償却処理。使用期間に応じた価値減少を費用として計上します。`;
        mistakePoints = `⚠️ 間違えやすいポイント：間接法では「減価償却累計額」（資産のマイナス勘定）を使用。直接法と混同しない。定額法・定率法の計算式も要確認。月割計算時の端数処理に注意。`;
        learningTips = `💡 学習のコツ：帳簿価額＝取得原価－減価償却累計額。貸借対照表では累計額を控除表示。耐用年数・残存価額・償却率の関係を理解。期中取得時は月割計算が基本。`;
      }
      // 貸倒関連
      else if (questionText.includes("貸倒")) {
        explanation = `貸倒処理。債権の回収不能に対する損失計上または引当金の設定を行います。`;
        mistakePoints = `⚠️ 間違えやすいポイント：直接償却法と引当金法の違いを理解。「貸倒引当金」は資産のマイナス勘定（貸借対照表の貸方表示だが資産の減少）。繰入と取崩の処理を混同しない。`;
        learningTips = `💡 学習のコツ：引当金法では将来の貸倒れに備えて事前設定。実際の貸倒れ時は引当金から充当。不足分は「貸倒損失」で処理。債権別（売掛金・受取手形等）の引当金設定率も覚えておきましょう。`;
      }
      // 保険料関連
      else if (questionText.includes("保険料")) {
        explanation = `保険料支払いの処理。期間に応じた費用配分と経過勘定の設定を行います。`;
        mistakePoints = `⚠️ 間違えやすいポイント：「保険料」（費用）と「前払保険料」（資産）の区別。決算時の未経過分は前払処理。保険期間と会計期間のズレに注意。「支払保険料」と表記されることも。`;
        learningTips = `💡 学習のコツ：保険料の期間按分計算をマスター。月数計算は正確に（例：4月1日～翌年3月31日＝12ヶ月）。火災保険・自動車保険等、保険の種類により勘定科目名が異なる場合も。`;
      }
      // デフォルト解説
      else {
        const idNumber = parseInt(questionId.replace("Q_J_", ""));
        if (amounts.length > 0) {
          explanation = `${amounts[0]}の取引に関する仕訳処理。取引の経済的実質を理解し適切な勘定科目で処理します。`;
        } else {
          explanation = `基本的な仕訳問題（問題${idNumber}）。取引内容を正確に読み取り適切に処理してください。`;
        }

        mistakePoints = `⚠️ 間違えやすいポイント：勘定科目名の選択ミス（類似科目に注意）、借方・貸方の判定ミス、金額の転記ミス。問題文の「〜とした」「〜を行った」等の表現から何の仕訳かを正確に読み取る。`;
        learningTips = `💡 学習のコツ：5つの勘定科目分類（資産・負債・純資産・収益・費用）と借方・貸方のルールを完全習得。仕訳は「原因→結果」で考える。反復練習で仕訳パターンを体に覚え込ませましょう。`;
      }

      return explanation + "\\n\\n" + mistakePoints + "\\n\\n" + learningTips;
    }

    // 第2問（帳簿問題）の詳細学習解説
    else if (questionId.startsWith("Q_L_")) {
      let explanation = "";
      let mistakePoints = "";
      let learningTips = "";

      if (questionText.includes("総勘定元帳")) {
        explanation = `総勘定元帳への転記処理。仕訳帳から勘定科目別に分類転記し、各勘定の残高を管理します。`;
        mistakePoints = `⚠️ 間違えやすいポイント：転記の借方・貸方を間違える、摘要欄に相手勘定科目を記載し忘れ、日付の転記ミス、残高の計算間違い。「元丁」欄の記載も忘れずに。`;
        learningTips = `💡 学習のコツ：「仕訳→転記→残高計算」の流れを確実に。勘定口座の左側＝借方、右側＝貸方。残高は借方・貸方のどちらに残るか（勘定の性質）を理解して計算。`;
      } else if (questionText.includes("現金出納帳")) {
        explanation = `現金出納帳への記入処理。現金の収入・支出を時系列で記録し、現金残高を管理します。`;
        mistakePoints = `⚠️ 間違えやすいポイント：収入（借方取引）と支出（貸方取引）の区別、残高の累計計算ミス、摘要の記載不備。現金以外の取引（振替等）は記入しない。`;
        learningTips = `💡 学習のコツ：現金出納帳は現金勘定の補助簿。収入＝現金の増加、支出＝現金の減少と考える。残高は前日残高±当日増減。現金実査との照合で差異チェック。`;
      } else if (questionText.includes("売上帳")) {
        explanation = `売上帳への記入処理。得意先別の掛売上を記録し、売掛金の詳細を管理します。`;
        mistakePoints = `⚠️ 間違えやすいポイント：現金売上は記入しない（掛売上のみ）、返品・値引きの△表示を忘れる、得意先名の記載ミス、合計金額の計算間違い。`;
        learningTips = `💡 学習のコツ：売上帳は売掛金元帳の基礎資料。売上＝収益、売掛金＝資産の関係を理解。返品・値引きで売上・売掛金が減少。得意先別残高管理に活用。`;
      } else if (questionText.includes("仕入帳")) {
        explanation = `仕入帳への記入処理。仕入先別の掛仕入を記録し、買掛金の詳細を管理します。`;
        mistakePoints = `⚠️ 間違えやすいポイント：現金仕入は記入しない（掛仕入のみ）、返品・値引きの△表示を忘れる、仕入先名の記載ミス、引取運賃等の付帯費用の処理。`;
        learningTips = `💡 学習のコツ：仕入帳は買掛金元帳の基礎資料。仕入＝費用、買掛金＝負債の関係を理解。引取運賃は仕入原価に含める。仕入先別残高管理に活用。`;
      } else if (questionText.includes("商品有高帳")) {
        explanation = `商品有高帳への記入処理。商品の受入・払出・残高を継続記録し、在庫を管理します。`;
        mistakePoints = `⚠️ 間違えやすいポイント：先入先出法と移動平均法の計算違い、払出単価の算定ミス、数量と金額の不一致、期末商品棚卸高との照合不備。`;
        learningTips = `💡 学習のコツ：評価方法（先入先出法・移動平均法）を正確に適用。受入＝仕入時、払出＝売上時。常に「数量×単価＝金額」をチェック。棚卸資産管理の重要な帳簿。`;
      } else if (questionText.includes("受取手形記入帳")) {
        explanation = `受取手形記入帳への記入処理。約束手形の受取から決済まで管理し、手形の流れを追跡します。`;
        mistakePoints = `⚠️ 間違えやすいポイント：振出人と支払人の混同、満期日の計算ミス、決済・不渡りの記載漏れ、裏書・割引時の処理不備。`;
        learningTips = `💡 学習のコツ：手形の当事者関係を整理（振出人→受取人、支払人→支払銀行）。満期日計算は正確に（支払期日）。決済時に手形から現金へ変換。`;
      } else if (questionText.includes("支払手形記入帳")) {
        explanation = `支払手形記入帳への記入処理。約束手形の振出から決済まで管理し、支払義務を追跡します。`;
        mistakePoints = `⚠️ 間違えやすいポイント：受取人と支払銀行の記載ミス、満期日の管理不備、当座預金残高との関連把握不足、不渡り時の処理。`;
        learningTips = `💡 学習のコツ：支払手形＝将来の支払義務。満期日に当座預金から自動引落し。資金繰り計画との連動が重要。手形不渡りは信用問題に直結。`;
      } else {
        explanation = `帳簿記入問題（${questionId}）。各種帳簿の特性と記入ルールを理解し、適切に処理してください。`;
        mistakePoints = `⚠️ 間違えやすいポイント：主要簿と補助簿の区別、各帳簿の記入ルール違い、転記・記入の方向性ミス、残高計算の誤り。帳簿間の整合性確保も重要。`;
        learningTips = `💡 学習のコツ：仕訳帳→総勘定元帳への転記の流れを理解。補助簿は詳細管理用。各帳簿の目的・機能を把握し、実務での活用法も学習しましょう。`;
      }

      return explanation + "\\n\\n" + mistakePoints + "\\n\\n" + learningTips;
    }

    // 第3問（表作成問題）の詳細学習解説
    else if (questionId.startsWith("Q_T_")) {
      let explanation = "";
      let mistakePoints = "";
      let learningTips = "";

      if (questionText.includes("合計試算表")) {
        explanation = `合計試算表の作成。各勘定科目の期中借方合計・貸方合計を集計し、仕訳の正確性を検証します。`;
        mistakePoints = `⚠️ 間違えやすいポイント：借方合計と貸方合計の不一致、勘定科目の分類ミス、集計の計算間違い、期中取引の計上漏れ。試算表の貸借平均が成立しない場合は計算見直し。`;
        learningTips = `💡 学習のコツ：合計試算表は「仕訳の検証」が目的。全勘定の借方合計＝全勘定の貸方合計が成立。各勘定の合計額から取引の妥当性をチェック可能。`;
      } else if (questionText.includes("残高試算表")) {
        explanation = `残高試算表の作成。各勘定科目の期末残高を算定し、借方・貸方に分類して表示します。`;
        mistakePoints = `⚠️ 間違えやすいポイント：残高の借方・貸方判定ミス、勘定の性質（資産・負債等）の理解不足、計算間違い、貸借合計額の不一致。ゼロ残高勘定の取扱い。`;
        learningTips = `💡 学習のコツ：資産・費用は借方残高、負債・純資産・収益は貸方残高が原則。残高＝期首残高＋当期増加－当期減少。貸借対照表作成の基礎資料として活用。`;
      } else if (questionText.includes("精算表")) {
        explanation = `精算表の作成。試算表に決算整理を加えて修正し、損益計算書・貸借対照表の基礎を作成します。`;
        mistakePoints = `⚠️ 間違えやすいポイント：修正記入欄の借方・貸方間違い、損益・貸借への振分けミス、決算整理仕訳の理解不足、勘定科目名の変更（未払○○→未払費用等）忘れ。`;
        learningTips = `💡 学習のコツ：決算整理仕訳を完璧にマスター。精算表は決算書作成の下書き。修正記入→損益・貸借への分類→合計の流れを確実に。繰越商品・減価償却等の典型パターンを習得。`;
      } else if (questionText.includes("損益計算書")) {
        explanation = `損益計算書の作成。収益・費用を適切に分類し、段階利益（売上総利益・営業利益等）を算出します。`;
        mistakePoints = `⚠️ 間違えやすいポイント：収益・費用の分類ミス、売上原価の算定間違い、営業外損益の区分不備、特別損益の判定ミス。当期純利益の計算確認は必須。`;
        learningTips = `💡 学習のコツ：「売上高－売上原価＝売上総利益」「売上総利益－販管費＝営業利益」等の段階利益計算をマスター。決算整理による影響（減価償却費・貸倒引当金等）も理解。`;
      } else if (questionText.includes("貸借対照表")) {
        explanation = `貸借対照表の作成。資産・負債・純資産を流動・固定に分類し、財政状態を表示します。`;
        mistakePoints = `⚠️ 間違えやすいポイント：流動・固定の分類基準（1年基準）の適用ミス、貸倒引当金等の控除項目表示、純資産の部の計算間違い、資産合計≠負債・純資産合計。`;
        learningTips = `💡 学習のコツ：「資産＝負債＋純資産」の基本等式を確認。流動性配列（資産の換金性順）・固定性配列（負債の支払期限順）で配列。当期純利益は純資産を増加させる。`;
      } else {
        explanation = `表作成問題（${questionId}）。各種財務諸表・試算表の作成原理を理解し、正確に作成してください。`;
        mistakePoints = `⚠️ 間違えやすいポイント：各表の作成目的の理解不足、計算ミス、分類ミス、貸借不一致。決算整理事項の反映漏れ、勘定科目の表示方法間違い。`;
        learningTips = `💡 学習のコツ：決算整理仕訳→精算表→財務諸表の流れを完全理解。各表の相互関係（精算表の損益計算書欄→損益計算書、貸借対照表欄→貸借対照表）を把握。反復練習で計算スピード向上。`;
      }

      return explanation + "\\n\\n" + mistakePoints + "\\n\\n" + learningTips;
    }

    return "問題固有の学習ポイントを理解し、簿記の基本原理に従って処理してください。";
  } catch (error) {
    return `問題${questionId}の学習ポイント。取引内容を理解し、適切な処理を行ってください。間違えやすいポイントと学習のコツを意識して取り組みましょう。`;
  }
}

// 全問題の解説を詳細学習版に更新
let updatedCount = 0;
const updatedQuestions = [];

questions.forEach((question) => {
  const newExplanation = generateDetailedLearningExplanation(question);

  if (newExplanation !== question.explanation) {
    const oldExplanation = question.explanation;
    question.explanation = newExplanation;
    updatedCount++;

    updatedQuestions.push({
      id: question.id,
      questionText: question.question_text.substring(0, 50) + "...",
      oldExplanation: oldExplanation.substring(0, 60) + "...",
      newExplanation: newExplanation.substring(0, 100) + "...",
    });
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
  .join(",\\n");

const newContent =
  beforeData + "[\\n" + formattedQuestions + "\\n]" + afterData;
fs.writeFileSync(tsFilePath, newContent, "utf8");

console.log(`✅ ${updatedCount}問の解説を詳細学習版に更新しました！\\n`);

// 更新された解説の例を表示
console.log("🎯 詳細学習解説の例:\\n");

updatedQuestions.slice(0, 5).forEach((item, index) => {
  console.log(`${index + 1}. ${item.id}:`);
  console.log(`   問題: ${item.questionText}`);
  console.log(`   旧解説: ${item.oldExplanation}`);
  console.log(`   新解説: ${item.newExplanation}`);
  console.log("");
});

if (updatedQuestions.length > 5) {
  console.log(
    `   ... 他 ${updatedQuestions.length - 5}問も詳細学習版に更新\\n`,
  );
}

console.log("✨ 詳細学習解説の作成が完了しました！");
console.log("📚 改善内容:");
console.log("  - 間違えやすい勘定科目・ポイントを明記");
console.log("  - 理解のための具体的な学習のコツを提供");
console.log("  - 簿記3級受験生向けの実用的アドバイス");
console.log("  - 問題固有の注意点とよくあるミスを解説");
