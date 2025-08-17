#!/usr/bin/env node

/**
 * 解説充実化スクリプト v3
 * 26パターンの包括的解説テンプレートで未処理164問を処理
 */

const fs = require("fs");
const path = require("path");

// 包括的解説テンプレート（既存6 + 新規20パターン）
const explanationTemplates = {
  // 既存テンプレート（v2から継承）
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

  // 新規テンプレート（20パターン）
  商品売買: {
    basicConcept:
      "商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し、仕入は費用、売上は収益、繰越商品は資産として扱います。",
    dailyExample:
      "スーパーやコンビニでの商品の仕入れと販売をイメージしてください。仕入時は商品代金を支払い、売上時は販売価格で収益を計上します。",
    journalPatterns: [
      "仕入時: 借方に仕入、貸方に現金/買掛金",
      "売上時: 借方に現金/売掛金、貸方に売上",
      "返品時: 逆仕訳で処理",
      "値引時: 売上値引/仕入値引勘定で処理",
    ],
    commonMistakes: [
      "分記法と三分法を混同しやすい",
      "期末商品の振替処理を忘れがち",
      "返品と値引の処理方法を間違える",
      "売上原価の計算方法を理解していない",
    ],
    memoryTricks: [
      "三分法は「仕入・売上・繰越商品」の3つで管理",
      "仕入は費用（左側）、売上は収益（右側）",
      "期末は「しくりくりし」（仕訳・繰越・繰越・仕訳）",
      "返品は「逆仕訳」、値引は「専用勘定」",
    ],
  },
  手形取引: {
    basicConcept:
      "約束手形による決済で、支払手形は支払いの約束（負債）、受取手形は代金回収の権利（資産）を表します。裏書・割引により手形を活用できます。",
    dailyExample:
      "「○月○日に○○円支払います」という約束の証書をイメージしてください。受け取った側は期日に代金を回収でき、振り出した側は期日に支払い義務があります。",
    journalPatterns: [
      "手形振出時: 借方に買掛金等、貸方に支払手形",
      "手形受取時: 借方に受取手形、貸方に売掛金等",
      "手形決済時: 借方に支払手形、貸方に当座預金等",
      "裏書譲渡時: 借方に買掛金等、貸方に受取手形",
      "割引時: 借方に当座預金・手形売却損、貸方に受取手形",
    ],
    commonMistakes: [
      "受取手形と支払手形を逆に理解しがち",
      "裏書と割引の処理を混同する",
      "手形の期日と決済を忘れる",
      "他人振出手形は現金扱いを知らない",
    ],
    memoryTricks: [
      "「受取」手形は資産、「支払」手形は負債",
      "裏書は「他社への支払い」、割引は「銀行で現金化」",
      "手形は「支払いの約束証書」",
      "期日が来たら必ず決済処理",
    ],
  },
  給与関連: {
    basicConcept:
      "従業員への給与支払いと関連する社会保険料・源泉徴収の処理。給与総額から各種控除額を差し引いた手取額を支給します。",
    dailyExample:
      "毎月の給与明細で天引きされる項目をイメージしてください。総支給額から健康保険料、厚生年金保険料、雇用保険料、所得税が控除されます。",
    journalPatterns: [
      "給与支給時: 借方に給料、貸方に各種預り金と現金",
      "社会保険料納付時: 借方に法定福利費・預り金、貸方に現金",
      "源泉所得税納付時: 借方に預り金、貸方に現金",
    ],
    commonMistakes: [
      "総支給額と手取額を混同する",
      "会社負担分と従業員負担分を間違える",
      "預り金の処理を忘れる",
      "賞与の社会保険料計算を間違える",
    ],
    memoryTricks: [
      "給料は「総額で計上、差額は預り金」",
      "社会保険料は「労使折半」",
      "源泉徴収は「会社が代理納付」",
      "預り金は負債（いずれ支払う義務）",
    ],
  },
  減価償却: {
    basicConcept:
      "固定資産の時間経過による価値減少を金額で表したもの。簿記3級では定額法（毎期一定額）を使用し、間接法で減価償却累計額勘定を用います。",
    dailyExample:
      "車や機械が年々古くなって価値が下がることをイメージしてください。取得原価を耐用年数で割って、毎年一定額ずつ費用計上します。",
    journalPatterns: [
      "減価償却時: 借方に減価償却費、貸方に減価償却累計額",
      "計算式: (取得原価-残存価額)÷耐用年数",
      "月割計算: 年間償却額×利用月数÷12",
    ],
    commonMistakes: [
      "直接法と間接法を混同する",
      "残存価額を忘れて計算する",
      "期中取得の月割計算を間違える",
      "土地は減価償却しないことを忘れる",
    ],
    memoryTricks: [
      "間接法は「累計額」を使用",
      "定額法は「毎年同じ金額」",
      "土地は「価値が減らない」",
      "期中取得は「月割り計算」",
    ],
  },
  貸倒引当金: {
    basicConcept:
      "将来の貸倒れに備えて売掛金等の一定割合を見積もり計上する評価勘定。差額補充法では既存残高との差額のみを調整します。",
    dailyExample:
      "クレジットカード会社が延滞リスクに備えて準備金を積む状況をイメージしてください。売掛金の一定割合を貸倒れ見込額として計上します。",
    journalPatterns: [
      "設定時（不足）: 借方に貸倒引当金繰入、貸方に貸倒引当金",
      "戻入時（過剰）: 借方に貸倒引当金、貸方に貸倒引当金戻入",
      "実際貸倒時: 借方に貸倒引当金、貸方に売掛金",
    ],
    commonMistakes: [
      "差額補充法の計算を間違える",
      "実際の貸倒れ時に引当金を使い忘れる",
      "貸借対照表の表示方法を間違える",
      "評価勘定の性質を理解していない",
    ],
    memoryTricks: [
      "差額補充法は「差額のみ調整」",
      "貸倒引当金は「評価勘定（資産のマイナス）」",
      "実際貸倒は「引当金を取り崩し」",
      "BSでは「売掛金から控除表示」",
    ],
  },
  経過勘定: {
    basicConcept:
      "収益・費用の計上時期を適正化するための勘定科目。前払費用・未払費用・前受収益・未収収益の4つがあり、期間損益計算の適正化を図ります。",
    dailyExample:
      "家賃を3か月分前払いしたり、電気代を後払いしたりする状況をイメージしてください。支払いと費用の発生時期がずれることがあります。",
    journalPatterns: [
      "前払費用: 借方に前払費用、貸方に現金（支払い時）",
      "未払費用: 借方に費用、貸方に未払費用（発生時）",
      "前受収益: 借方に現金、貸方に前受収益（受取時）",
      "未収収益: 借方に未収収益、貸方に収益（発生時）",
    ],
    commonMistakes: [
      "4つの経過勘定を混同しやすい",
      "資産・負債の分類を間違える",
      "決算整理と再振替仕訳を忘れる",
      "期間按分の計算を間違える",
    ],
    memoryTricks: [
      "前払・未収は資産、未払・前受は負債",
      "「前」がつくと時系列が逆転",
      "決算で整理、期首で再振替",
      "期間按分は「月割り計算」",
    ],
  },
  固定資産: {
    basicConcept:
      "1年を超えて使用する資産で、土地・建物・備品・車両運搬具などがあります。取得時は取得原価で計上し、土地以外は減価償却を行います。",
    dailyExample:
      "会社の事務所、机、パソコン、営業車などをイメージしてください。長期間使用する資産で、購入時に全額費用にせず、使用期間にわたって費用配分します。",
    journalPatterns: [
      "購入時: 借方に各固定資産、貸方に現金等",
      "除却時: 借方に固定資産除却損、減価償却累計額、貸方に各固定資産",
      "売却時: 借方に現金・固定資産売却損、減価償却累計額、貸方に各固定資産・固定資産売却益",
    ],
    commonMistakes: [
      "取得原価に付随費用を含め忘れる",
      "土地の減価償却をしてしまう",
      "除却と売却の処理を混同する",
      "期中売却時の減価償却計算を忘れる",
    ],
    memoryTricks: [
      "取得原価は「本体価格＋付随費用」",
      "土地は「価値が減らない」",
      "除却は「廃棄」、売却は「換金」",
      "期中売却は「売却日まで償却」",
    ],
  },
  資本取引: {
    basicConcept:
      "資本金の増加や個人事業主の引出し、当期純利益の振替など、資本（純資産）に関する取引です。個人と法人で処理方法が異なります。",
    dailyExample:
      "個人事業主が生活費を事業用口座から引き出したり、出資者が会社に資金を投入したりする状況をイメージしてください。",
    journalPatterns: [
      "資本金受入時: 借方に現金、貸方に資本金",
      "引出時（個人）: 借方に引出金、貸方に現金",
      "当期純利益振替時: 借方に損益、貸方に資本金",
    ],
    commonMistakes: [
      "個人と法人の処理を混同する",
      "引出金と費用を間違える",
      "損益振替の方向を間違える",
      "資本金と資本準備金を混同する",
    ],
    memoryTricks: [
      "引出金は「資本の減少」",
      "資本金は「出資者からの調達」",
      "損益振替は「利益なら資本増加」",
      "個人は引出金、法人は配当金",
    ],
  },
  税金関連: {
    basicConcept:
      "法人税等、消費税、固定資産税、印紙税などの税金処理。租税公課として費用計上するものと、仮払・仮受で処理するものがあります。",
    dailyExample:
      "会社が納める法人税や、商品に含まれる消費税、事務所の固定資産税などをイメージしてください。税金の種類により処理方法が異なります。",
    journalPatterns: [
      "法人税等: 借方に法人税等、貸方に未払法人税等",
      "消費税（税抜）: 借方に仮払消費税、貸方に現金",
      "固定資産税: 借方に租税公課、貸方に現金",
    ],
    commonMistakes: [
      "税込経理と税抜経理を混同する",
      "消費税の仮払・仮受を間違える",
      "法人税等の処理時期を間違える",
      "租税公課に含まれない税金を理解していない",
    ],
    memoryTricks: [
      "法人税等は「当期利益への課税」",
      "消費税は「預り・立替」",
      "租税公課は「事業活動に関する税金」",
      "税抜経理では「仮払・仮受」を使用",
    ],
  },
  決算整理: {
    basicConcept:
      "決算時に行う修正仕訳で、減価償却、貸倒引当金、経過勘定、棚卸資産などの調整を行い、適正な期間損益を計算します。",
    dailyExample:
      "年度末に家計簿を整理するように、企業も決算時に1年間の取引を見直して、正確な利益計算のための調整を行います。",
    journalPatterns: [
      "売上原価算定: 借方に仕入、貸方に繰越商品（期首）＋借方に繰越商品、貸方に仕入（期末）",
      "各種引当金・償却の計上",
      "経過勘定項目の整理",
    ],
    commonMistakes: [
      "決算整理仕訳の順序を間違える",
      "売上原価の「しくりくりし」を忘れる",
      "再振替仕訳を忘れる",
      "決算整理前後の金額を混同する",
    ],
    memoryTricks: [
      "決算整理は「期間損益の適正化」",
      "「しくりくりし」（仕入繰越商品・繰越商品仕入）",
      "決算整理→精算表→財務諸表の流れ",
      "再振替は「期首に逆仕訳」",
    ],
  },
  帳簿組織: {
    basicConcept:
      "主要簿（仕訳帳・総勘定元帳）と補助簿（補助記入帳・補助元帳）からなる記帳システム。取引の記録から財務諸表作成まで一連の流れを管理します。",
    dailyExample:
      "図書館の貸出システムのように、取引を日付順に記録（仕訳帳）し、勘定科目別に整理（総勘定元帳）して、詳細情報を補助簿で管理します。",
    journalPatterns: [
      "仕訳帳→総勘定元帳への転記",
      "補助元帳への記入",
      "試算表の作成",
      "財務諸表の作成",
    ],
    commonMistakes: [
      "転記のミスや記入漏れ",
      "勘定科目の残高計算間違い",
      "補助簿との照合を忘れる",
      "試算表の貸借不一致",
    ],
    memoryTricks: [
      "仕訳帳は「時系列の記録」",
      "総勘定元帳は「科目別の整理」",
      "補助簿は「詳細情報の管理」",
      "転記は「左は左、右は右」",
    ],
  },
  試算表: {
    basicConcept:
      "総勘定元帳の各勘定残高を一覧表にしたもので、合計試算表・残高試算表・合計残高試算表の3種類があります。帳簿記入の正確性を検証します。",
    dailyExample:
      "家計簿の月末締めのように、すべての勘定科目の残高を一覧表にして、記入ミスがないかチェックする表をイメージしてください。",
    journalPatterns: [
      "合計試算表: 各勘定の借方・貸方合計額を集計",
      "残高試算表: 各勘定の期末残高を集計",
      "合計残高試算表: 合計と残高の両方を表示",
    ],
    commonMistakes: [
      "3つの試算表の違いを理解していない",
      "残高の計算方法を間違える",
      "貸借の合計が一致しない",
      "決算整理前後の区別ができない",
    ],
    memoryTricks: [
      "合計試算表は「取引高の集計」",
      "残高試算表は「財政状態の表示」",
      "試算表は「記帳の正確性確認」",
      "借方合計＝貸方合計が原則",
    ],
  },
  精算表: {
    basicConcept:
      "決算整理前残高試算表に決算整理仕訳を加えて、損益計算書と貸借対照表を作成するための集計表です。簿記の総まとめとなる重要な表です。",
    dailyExample:
      "年末調整のように、1年間の取引記録に決算時の調整を加えて、最終的な成績表（財務諸表）を作成する作業台をイメージしてください。",
    journalPatterns: [
      "決算整理前残高→決算整理仕訳→決算整理後残高",
      "損益計算書欄: 収益・費用の集計",
      "貸借対照表欄: 資産・負債・純資産の集計",
    ],
    commonMistakes: [
      "決算整理仕訳の記入欄を間違える",
      "勘定科目の分類を間違える",
      "当期純利益の計算を間違える",
      "貸借対照表の合計が一致しない",
    ],
    memoryTricks: [
      "精算表は「決算の作業台」",
      "左から「残高→整理→PL・BS」",
      "当期純利益は「収益－費用」",
      "最終的に「借方合計＝貸方合計」",
    ],
  },
  財務諸表: {
    basicConcept:
      "損益計算書（1年間の経営成績）と貸借対照表（期末時点の財政状態）からなる企業の成績表。ステークホルダーに経営状況を報告する重要な書類です。",
    dailyExample:
      "学校の成績表のように、企業の1年間の成績（利益）と期末時点の財産状況を表にまとめたものをイメージしてください。",
    journalPatterns: [
      "損益計算書: 収益－費用＝当期純利益",
      "貸借対照表: 資産＝負債＋純資産",
      "当期純利益の貸借対照表への組み入れ",
    ],
    commonMistakes: [
      "PLとBSの役割を混同する",
      "勘定科目の分類を間違える",
      "当期純利益の表示場所を間違える",
      "貸借の均衡を理解していない",
    ],
    memoryTricks: [
      "PLは「期間の成績」、BSは「時点の状況」",
      "PLの利益はBSの純資産に加算",
      "資産＝負債＋純資産は絶対法則",
      "投資家・債権者が見る「通信簿」",
    ],
  },
};

// 問題分類のキーワードマッピング（優先順位順）
const patternKeywords = {
  // 既存パターン
  当座借越: ["当座借越", "残高不足", "借越"],
  現金過不足: ["現金過不足", "現金実査", "実際有高", "帳簿残高"],
  小口現金: ["小口現金", "前渡し", "インプレスト", "定額資金"],
  当座預金: ["当座預金", "振込", "入金"],
  売掛金: ["売掛金", "掛売上"],
  買掛金: ["買掛金", "掛仕入"],

  // 新規パターン
  商品売買: ["商品仕入", "商品売上", "売上戻り", "仕入戻し", "三分法"],
  手形取引: ["手形受取", "手形支払", "受取手形", "支払手形", "裏書", "割引"],
  給与関連: ["給料支払", "社会保険料", "源泉徴収", "法定福利費"],
  減価償却: ["減価償却", "減価償却費", "減価償却累計額", "定額法"],
  貸倒引当金: ["貸倒引当金", "貸倒引当金設定", "差額補充法"],
  経過勘定: ["前払費用", "未払費用", "前受収益", "未収収益"],
  固定資産: ["固定資産購入", "固定資産売却", "固定資産除却", "備品", "建物"],
  資本取引: ["資本金", "引出金", "当期純利益", "資本準備金"],
  税金関連: ["法人税等", "租税公課", "消費税", "固定資産税"],
  決算整理: ["売上原価算定", "期末商品", "決算整理"],
  帳簿組織: ["総勘定元帳", "仕訳帳", "補助簿", "転記"],
  試算表: ["合計試算表", "残高試算表", "試算表作成"],
  精算表: ["精算表作成", "精算表"],
  財務諸表: ["財務諸表作成", "損益計算書", "貸借対照表"],
};

// 問題パターン分類関数（拡張版）
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

    // 拡張パターンマッチング
    for (const [templateKey, keywords] of Object.entries(patternKeywords)) {
      for (const keyword of keywords) {
        if (pattern.includes(keyword) || questionText.includes(keyword)) {
          return templateKey;
        }
      }
    }

    // カテゴリベースのデフォルト分類
    const categoryId = question.category_id || "";
    if (categoryId === "journal") {
      return "商品売買"; // 仕訳問題のデフォルト
    } else if (categoryId === "ledger") {
      return "帳簿組織"; // 帳簿問題のデフォルト
    } else if (categoryId === "trial") {
      return "試算表"; // 試算表問題のデフォルト
    }
  } catch (error) {
    console.log(`JSONパースエラー: ${question.id} - ${question.tags_json}`);
  }

  return null;
}

// 解説生成関数（拡張版）
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

    if (
      journalEntry &&
      journalEntry.debit_account &&
      journalEntry.credit_account
    ) {
      enhanced += `【この問題の仕訳】\n`;
      enhanced += `借方：${journalEntry.debit_account} ${journalEntry.debit_amount.toLocaleString("ja-JP")}円\n`;
      enhanced += `貸方：${journalEntry.credit_account} ${journalEntry.credit_amount.toLocaleString("ja-JP")}円`;
    } else {
      enhanced += `【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。`;
    }
  } catch (error) {
    console.log(
      `仕訳データエラー: ${question.id} - ${question.correct_answer_json}`,
    );
    enhanced += `【この問題の解き方】\n問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。`;
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
  const tagsMatch = questionMatch.match(/tags_json:\s*'([^']*(?:\\.[^']*)*)''/);
  const questionTextMatch = questionMatch.match(
    /question_text:\s*"([^"]*(?:\\.[^"]*)*)"/,
  );
  const categoryMatch = questionMatch.match(/category_id:\s*"([^"]+)"/);

  return {
    id: idMatch ? idMatch[1] : "",
    category_id: categoryMatch ? categoryMatch[1] : "",
    question_text: questionTextMatch ? questionTextMatch[1] : "",
    explanation: explanationMatch ? explanationMatch[1] : "",
    correct_answer_json: answerMatch ? answerMatch[1] : "{}",
    tags_json: tagsMatch ? tagsMatch[1] : "{}",
  };
}

// メイン処理関数
function enhanceExplanations(
  mode = "all",
  startQuestionId = "Q_J_001",
  endQuestionId = "Q_T_012",
) {
  console.log(`解説改善スクリプト v3 開始... (モード: ${mode})`);

  // master-questions.tsを読み込み
  const masterQuestionsPath = path.join(
    __dirname,
    "../src/data/master-questions.ts",
  );

  // バックアップ作成
  const backupPath = `${masterQuestionsPath}.backup-v3-${Date.now()}`;
  fs.copyFileSync(masterQuestionsPath, backupPath);
  console.log(`バックアップ作成: ${backupPath}`);

  let content = fs.readFileSync(masterQuestionsPath, "utf-8");
  let enhancedCount = 0;
  let skippedCount = 0;
  let totalProcessed = 0;

  // 各問題の解説を改善
  const questionPattern = /{[\s\S]*?id:\s*"([^"]+)"[\s\S]*?}/g;
  let match;
  const replacements = [];

  // まず全ての問題を解析
  while ((match = questionPattern.exec(content)) !== null) {
    const questionId = match[1];
    totalProcessed++;

    // モード別の処理範囲制限
    if (mode === "test" && totalProcessed > 10) {
      break;
    }

    if (mode === "journal" && !questionId.startsWith("Q_J_")) {
      continue;
    }

    if (mode === "ledger" && !questionId.startsWith("Q_L_")) {
      continue;
    }

    if (mode === "trial" && !questionId.startsWith("Q_T_")) {
      continue;
    }

    if (
      mode === "range" &&
      (questionId < startQuestionId || questionId > endQuestionId)
    ) {
      continue;
    }

    // 既に新形式の解説がある問題はスキップ
    if (match[0].includes("【基本概念】")) {
      console.log(`スキップ: ${questionId} (既に新形式)`);
      skippedCount++;
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

  console.log(`\n=== 処理結果 ===`);
  console.log(`処理対象: ${totalProcessed}問`);
  console.log(`解説改善: ${enhancedCount}問`);
  console.log(`スキップ: ${skippedCount}問`);
  console.log(`バックアップファイル: ${backupPath}`);

  return enhancedCount;
}

// 段階的処理関数
function enhanceExplanationsByCategory(category = "journal") {
  const categories = {
    journal: { description: "仕訳問題（Q_J_*）" },
    ledger: { description: "帳簿問題（Q_L_*）" },
    trial: { description: "試算表問題（Q_T_*）" },
    all: { description: "全問題" },
    test: { description: "テスト実行（10問のみ）" },
  };

  if (categories[category]) {
    const { description } = categories[category];
    console.log(`\n=== ${description} ===`);
    return enhanceExplanations(category);
  } else {
    console.log(
      "不正なカテゴリです。journal, ledger, trial, all, test を指定してください。",
    );
    return 0;
  }
}

// スクリプト実行
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // デフォルト: テスト実行
    enhanceExplanationsByCategory("test");
  } else if (args[0] === "phase") {
    // カテゴリ別実行
    const category = args[1] || "journal";
    enhanceExplanationsByCategory(category);
  } else if (args[0] === "range") {
    // 範囲指定実行
    const start = args[1] || "Q_J_001";
    const end = args[2] || "Q_J_050";
    enhanceExplanations("range", start, end);
  } else if (args[0] === "test") {
    // テスト実行
    enhanceExplanationsByCategory("test");
  } else {
    console.log("使用方法:");
    console.log("  node scripts/enhance-explanations-v3.js test");
    console.log("  node scripts/enhance-explanations-v3.js phase journal");
    console.log("  node scripts/enhance-explanations-v3.js phase ledger");
    console.log("  node scripts/enhance-explanations-v3.js phase trial");
    console.log("  node scripts/enhance-explanations-v3.js phase all");
    console.log(
      "  node scripts/enhance-explanations-v3.js range Q_J_001 Q_J_050",
    );
  }
}

module.exports = {
  enhanceExplanations,
  enhanceExplanationsByCategory,
  explanationTemplates,
};
