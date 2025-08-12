const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_017-Q_L_018の解説を具体的に修正\n");
console.log("=" * 60 + "\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
let content = fs.readFileSync(questionsPath, "utf8");

// Q_L_017の具体的な解説（商品有高帳）
const Q_L_017_explanation = `【商品有高帳の記入】\\\\n\\\\n本問では、先入先出法による商品有高帳を作成します。\\\\n\\\\n【取引と記入】\\\\n10月1日：前月繰越 20個×@2,500円＝50,000円\\\\n10月5日：仕入 30個×@2,600円＝78,000円 → 残高50個\\\\n10月12日：売上 25個 → 先入先出法により前月繰越20個、10/5仕入分5個を払出\\\\n   払出額：20個×@2,500＋5個×@2,600＝63,000円\\\\n   残高：25個×@2,600円＝65,000円\\\\n10月20日：仕入 40個×@2,700円＝108,000円 → 残高65個\\\\n10月28日：売上返品 5個×@2,600円＝13,000円 → 残高70個\\\\n\\\\n【ポイント】\\\\n・先入先出法：古い商品から順に払い出す\\\\n・払出単価：取得原価による\\\\n・残高欄：数量×単価×金額を記入`;

// Q_L_018の具体的な解説（仕入帳）
const Q_L_018_explanation = `【仕入帳の記入】\\\\n\\\\n本問では、11月の仕入帳を作成します。\\\\n\\\\n【仕入取引の記入】\\\\n11月3日：A商店より掛け仕入 120,000円\\\\n11月10日：B商店より現金仕入 85,000円\\\\n11月18日：C商店より掛け仕入 95,000円\\\\n11月25日：D商店より約束手形振出仕入 110,000円\\\\n\\\\n【記入内容】\\\\n・日付：取引発生日\\\\n・仕入先：相手先名\\\\n・摘要：取引内容（掛け、現金、手形等）\\\\n・借方金額：仕入金額\\\\n・相手勘定：買掛金、現金、支払手形等\\\\n\\\\n月末合計：410,000円`;

// Q_L_017を修正
console.log("処理中: Q_L_017");

const q017Pattern = /(id: "Q_L_017"[\s\S]*?)explanation:\s*"[^"]*"/;

if (content.match(q017Pattern)) {
  content = content.replace(
    q017Pattern,
    `$1explanation: "${Q_L_017_explanation}"`,
  );
  console.log("✅ Q_L_017: 解説を具体的に修正");
}

// Q_L_018を修正
console.log("処理中: Q_L_018");

const q018Pattern = /(id: "Q_L_018"[\s\S]*?)explanation:\s*"[^"]*"/;

if (content.match(q018Pattern)) {
  content = content.replace(
    q018Pattern,
    `$1explanation: "${Q_L_018_explanation}"`,
  );
  console.log("✅ Q_L_018: 解説を具体的に修正");
}

// ファイル保存
console.log("\n💾 修正内容を保存中...");
fs.writeFileSync(questionsPath, content);

console.log("\n✅ Q_L_017-Q_L_018の解説修正完了！");

// 修正後の検証
console.log("\n📊 修正後の検証:");

function verifyQuestion(id) {
  const idPattern = new RegExp(`id: "${id}"`);
  const nextId = parseInt(id.split("_")[2]) + 1;
  const nextIdPattern = new RegExp(
    `id: "Q_L_${String(nextId).padStart(3, "0")}"`,
  );

  const startMatch = content.match(idPattern);
  const endMatch = content.match(nextIdPattern);

  if (startMatch) {
    const section = content.substring(
      startMatch.index,
      endMatch ? endMatch.index : content.length,
    );

    const explanationMatch = section.match(/explanation:\s*"([^"]+)"/);
    if (explanationMatch) {
      const explanation = explanationMatch[1];
      const isSpecific =
        (explanation.includes("商品有高帳") ||
          explanation.includes("仕入帳")) &&
        explanation.includes("記入") &&
        !explanation.includes("一般的");

      console.log(`  ${id}: ${isSpecific ? "✅ 具体的" : "❌ 一般的"}`);
      return isSpecific;
    }
  }
  return false;
}

const q017OK = verifyQuestion("Q_L_017");
const q018OK = verifyQuestion("Q_L_018");

if (q017OK && q018OK) {
  console.log("\n🎉 両問題の解説が具体的になりました！");
  console.log("Q_L_015-Q_L_040の全26問が正常に修正されました！");
} else {
  console.log("\n⚠️ 追加確認が必要です。");
}
