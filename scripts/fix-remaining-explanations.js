#!/usr/bin/env node

/**
 * 残存する汎用商品売買説明文の一括修正スクリプト（改良版）
 */

const fs = require("fs");
const path = require("path");

const MASTER_QUESTIONS_PATH = path.join(
  __dirname,
  "../src/data/master-questions.ts",
);

// 問題パターン別の専用説明文
const EXPLANATIONS = {
  salary: `"【基本概念】\\n給与関連取引は、従業員への給与支給と税金・社会保険料の天引き処理です。源泉所得税、住民税、社会保険料などを預り金として処理します。\\n\\n【具体例・イメージ】\\n会社での月末給与支給をイメージしてください。総支給額から源泉所得税や住民税を天引きし、手取り額を従業員に支払います。\\n\\n【仕訳パターン】\\n・給与支給時: 借方「給与」/貸方「預り金」「現金」\\n・税金納付時: 借方「預り金」/貸方「現金」\\n・賞与支給時: 借方「賞与」/貸方「預り金」「現金」\\n\\n【間違えやすいポイント】\\n・源泉所得税と住民税の区別\\n・預り金勘定の使い方\\n・社会保険料の会社負担分と個人負担分\\n・支給額と手取額の違い\\n\\n【覚え方のコツ】\\n・天引き分は「預り金」（会社が一時的に預かる）\\n・給与は費用、預り金は負債\\n・手取額 = 総支給額 - 天引き額\\n・源泉徴収は法的義務\\n\\n【この問題の解き方】\\n給与支給と天引き処理を適切な勘定科目で仕訳します。"`,

  asset: `"【基本概念】\\n固定資産は長期間にわたって事業で使用する資産で、取得・減価償却・売却・除却などの処理があります。減価償却により期間按分して費用化します。\\n\\n【具体例・イメージ】\\n会社の建物や機械をイメージしてください。購入時に全額費用にせず、使用期間にわたって減価償却費として費用配分します。\\n\\n【仕訳パターン】\\n・取得時: 借方「建物」「備品」/貸方「現金」「買掛金」\\n・減価償却時: 借方「減価償却費」/貸方「減価償却累計額」\\n・売却時: 借方「現金」「固定資産売却損」/貸方「建物」「減価償却累計額」\\n\\n【間違えやすいポイント】\\n・直接法と間接法の違い\\n・売却時の減価償却累計額の処理\\n・除却と売却の区別\\n・固定資産売却損益の計算\\n\\n【覚え方のコツ】\\n・固定資産は「長期」使用目的\\n・減価償却は「使用による価値減少」\\n・間接法では累計額勘定を使用\\n・売却損益 = 売却価額 - 帳簿価額\\n\\n【この問題の解き方】\\n固定資産の取得・減価償却・処分を適切に仕訳します。"`,

  adjustment: `"【基本概念】\\n決算整理は、当期の収益・費用を正確に計算するため、期末に行う修正仕訳です。前払費用、未払費用、貸倒引当金などがあります。\\n\\n【具体例・イメージ】\\n年度末の決算作業をイメージしてください。当期分と次期分の費用を正確に区分し、将来の損失に備えて引当金を設定します。\\n\\n【仕訳パターン】\\n・前払費用: 借方「前払費用」/貸方「保険料」等\\n・未払費用: 借方「支払利息」等/貸方「未払費用」\\n・貸倒引当金: 借方「貸倒引当金繰入」/貸方「貸倒引当金」\\n\\n【間違えやすいポイント】\\n・前払費用と未払費用の区別\\n・引当金の性質（資産の控除項目）\\n・期間帰属の原則の理解\\n・翌期首の振替仕訳の要否\\n\\n【覚え方のコツ】\\n・決算整理は「正確な期間損益計算」が目的\\n・前払＝先に払った、未払＝まだ払っていない\\n・引当金＝将来の損失への備え\\n・発生主義の原則に基づく処理\\n\\n【この問題の解き方】\\n決算整理の目的を理解し、適切な修正仕訳を作成します。"`,

  ledger: `"【基本概念】\\n帳簿記入は、仕訳帳の内容を総勘定元帳や補助簿に転記する作業です。複式簿記の流れに沿って正確に記録します。\\n\\n【具体例・イメージ】\\n会社の経理部での帳簿作業をイメージしてください。仕訳された取引を勘定ごとに整理し、残高を把握します。\\n\\n【仕訳パターン】\\n・総勘定元帳: 勘定科目ごとの借方・貸方・残高\\n・補助簿: 売掛金明細、買掛金明細など\\n・試算表: 各勘定の残高一覧表\\n\\n【間違えやすいポイント】\\n・転記の方向（借方・貸方）\\n・残高の計算方法\\n・補助簿と総勘定元帳の関係\\n・締切処理の手順\\n\\n【覚え方のコツ】\\n・転記は仕訳の通りに行う\\n・借方残高・貸方残高の区別\\n・補助簿は詳細記録、元帳は合計記録\\n・帳簿組織の理解が重要\\n\\n【この問題の解き方】\\n帳簿記入のルールに従って正確に転記・記入します。"`,
};

console.log("🔧 残存汎用説明文修正スクリプト開始...");

try {
  let content = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf8");
  console.log("📖 master-questions.ts読み込み完了");

  let modifiedCount = 0;

  // 汎用説明文の完全パターン
  const genericExplanationPattern =
    /explanation:\s*"【基本概念】\\n商品の仕入れと売上に関する基本的な取引。三分法では仕入・売上・繰越商品の3つの勘定を使用し[\s\S]*?問題文をよく読み、取引の内容を理解して適切な勘定科目と金額で仕訳しましょう。"/g;

  // 問題IDベースのマッピング
  const idToType = {
    Q_J_144: "salary",
    Q_J_152: "salary",
    Q_J_156: "salary",
    Q_J_160: "salary",
    Q_J_164: "salary",
    Q_J_168: "salary",
    Q_J_188: "asset",
    Q_J_192: "asset",
    Q_J_196: "asset",
    Q_J_200: "asset",
    Q_J_204: "asset",
    Q_J_208: "asset",
    Q_J_220: "adjustment",
    Q_J_221: "adjustment",
    Q_J_223: "adjustment",
    Q_J_224: "adjustment",
    Q_J_225: "adjustment",
    Q_J_227: "adjustment",
    Q_J_228: "adjustment",
    Q_J_229: "adjustment",
    Q_J_231: "adjustment",
    Q_J_232: "adjustment",
    Q_J_233: "adjustment",
    Q_J_235: "adjustment",
    Q_J_236: "adjustment",
    Q_J_237: "adjustment",
    Q_J_239: "adjustment",
    Q_J_240: "adjustment",
    Q_J_241: "adjustment",
    Q_J_243: "adjustment",
    Q_J_244: "adjustment",
    Q_J_245: "adjustment",
    Q_J_247: "adjustment",
    Q_J_248: "adjustment",
    Q_L_017: "ledger",
  };

  // 各問題IDを個別に処理
  for (const [questionId, explanationType] of Object.entries(idToType)) {
    console.log(`🔍 ${questionId}を処理中...`);

    // 問題IDの位置を見つける
    const idPosition = content.indexOf(`id: "${questionId}",`);
    if (idPosition === -1) {
      console.log(`❌ ${questionId}が見つかりません`);
      continue;
    }

    // この問題の範囲を特定
    const nextIdPosition = content.indexOf('id: "Q_', idPosition + 1);
    const problemEnd = nextIdPosition === -1 ? content.length : nextIdPosition;
    const problemSection = content.substring(idPosition, problemEnd);

    // 汎用説明文が含まれているかチェック
    if (problemSection.includes("商品の仕入れと売上に関する基本的な取引")) {
      // 説明文の範囲を特定
      const explanationStart = problemSection.indexOf("explanation:");
      const explanationEnd = problemSection.indexOf(
        "difficulty:",
        explanationStart,
      );

      if (explanationStart !== -1 && explanationEnd !== -1) {
        const beforeExplanation = problemSection.substring(0, explanationStart);
        const afterExplanation = problemSection.substring(explanationEnd);

        const newProblemSection =
          beforeExplanation +
          `explanation:\n      ${EXPLANATIONS[explanationType]},\n    ` +
          afterExplanation;

        // updated_atを更新
        const updatedSection = newProblemSection.replace(
          /updated_at: "[^"]*"/g,
          'updated_at: "2025-08-19T00:00:00Z"',
        );

        // ファイル内容を更新
        content =
          content.substring(0, idPosition) +
          updatedSection +
          content.substring(problemEnd);
        modifiedCount++;
        console.log(`✅ ${questionId}修正完了（${explanationType}説明文適用）`);
      } else {
        console.log(`⚠️  ${questionId}: 説明文範囲の特定に失敗`);
      }
    } else {
      console.log(`⏭️  ${questionId}は既に修正済み`);
    }
  }

  // ファイル書き込み
  if (modifiedCount > 0) {
    fs.writeFileSync(MASTER_QUESTIONS_PATH, content, "utf8");
    console.log(`\n🎉 汎用説明文修正完了！修正問題数: ${modifiedCount}問`);
    console.log("📝 以下の修正を実施しました:");
    console.log("   - 給与・税金問題: salary説明文適用");
    console.log("   - 固定資産問題: asset説明文適用");
    console.log("   - 決算整理問題: adjustment説明文適用");
    console.log("   - 帳簿問題: ledger説明文適用");
    console.log("   - updated_at: 2025-08-19T00:00:00Z");
  } else {
    console.log("\nℹ️  修正対象の問題がありませんでした（既に修正済み）");
  }
} catch (error) {
  console.error("❌ エラーが発生しました:", error);
  process.exit(1);
}
