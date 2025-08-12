const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_019-Q_L_020の解説を具体的に修正\n");
console.log("=" * 60 + "\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
let content = fs.readFileSync(questionsPath, "utf8");

// Q_L_019の具体的な解説
const Q_L_019_explanation = `【売掛金元帳の記入】\\\\n\\\\n本問では、ABC商事の売掛金元帳を記入します。\\\\n\\\\n1月1日：前月繰越 250,000円\\\\n1月15日：売上（掛け）180,000円 → 残高 430,000円\\\\n1月22日：売上（掛け）95,000円 → 残高 525,000円\\\\n1月28日：現金回収 200,000円 → 残高 325,000円\\\\n\\\\n【記入のポイント】\\\\n・借方（増加）：売掛金の発生\\\\n・貸方（減少）：売掛金の回収\\\\n・相手勘定科目：売上、現金など\\\\n・残高は各取引後の売掛金残高を記入`;

// Q_L_020の具体的な解説
const Q_L_020_explanation = `【買掛金元帳の記入】\\\\n\\\\n本問では、XYZ商店の買掛金元帳を記入します。\\\\n\\\\n1月1日：前月繰越 320,000円\\\\n1月8日：仕入（掛け）150,000円 → 残高 470,000円\\\\n1月16日：仕入（掛け）85,000円 → 残高 555,000円\\\\n1月25日：小切手支払 250,000円 → 残高 305,000円\\\\n\\\\n【記入のポイント】\\\\n・貸方（増加）：買掛金の発生\\\\n・借方（減少）：買掛金の支払\\\\n・相手勘定科目：仕入、当座預金など\\\\n・残高は各取引後の買掛金残高を記入`;

// Q_L_019を修正
console.log("処理中: Q_L_019");

// まず現在の問題文を確認して適切な解説を作成
const q019StartPattern = /id: "Q_L_019"/;
const q019EndPattern = /id: "Q_L_020"/;

const q019StartMatch = content.match(q019StartPattern);
const q019EndMatch = content.match(q019EndPattern);

if (q019StartMatch && q019EndMatch) {
  const q019Section = content.substring(
    q019StartMatch.index,
    q019EndMatch.index,
  );

  // 問題文を抽出して内容を確認
  const questionMatch = q019Section.match(/question_text:\s*"([^"]+)"/);
  if (questionMatch) {
    console.log("  問題文確認: ", questionMatch[1].substring(0, 50) + "...");
  }

  // 解説部分を置換
  const explanationPattern = /(id: "Q_L_019"[\s\S]*?)explanation:\s*"[^"]*"/;

  if (content.match(explanationPattern)) {
    content = content.replace(
      explanationPattern,
      `$1explanation: "${Q_L_019_explanation}"`,
    );
    console.log("✅ Q_L_019: 解説を具体的に修正");
  }
}

// Q_L_020を修正
console.log("処理中: Q_L_020");

const q020StartPattern = /id: "Q_L_020"/;
const q020EndPattern = /id: "Q_L_021"/;

const q020StartMatch = content.match(q020StartPattern);
const q020EndMatch = content.match(q020EndPattern);

if (q020StartMatch && q020EndMatch) {
  const q020Section = content.substring(
    q020StartMatch.index,
    q020EndMatch.index,
  );

  // 問題文を抽出して内容を確認
  const questionMatch = q020Section.match(/question_text:\s*"([^"]+)"/);
  if (questionMatch) {
    console.log("  問題文確認: ", questionMatch[1].substring(0, 50) + "...");
  }

  // 解説部分を置換
  const explanationPattern = /(id: "Q_L_020"[\s\S]*?)explanation:\s*"[^"]*"/;

  if (content.match(explanationPattern)) {
    content = content.replace(
      explanationPattern,
      `$1explanation: "${Q_L_020_explanation}"`,
    );
    console.log("✅ Q_L_020: 解説を具体的に修正");
  }
}

// ファイル保存
console.log("\n💾 修正内容を保存中...");
fs.writeFileSync(questionsPath, content);

console.log("\n✅ Q_L_019-Q_L_020の解説修正完了！");

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
        (explanation.includes("売掛金元帳") ||
          explanation.includes("買掛金元帳")) &&
        explanation.includes("記入のポイント") &&
        !explanation.includes("一般的");

      console.log(`  ${id}: ${isSpecific ? "✅ 具体的" : "❌ 一般的"}`);
      return isSpecific;
    }
  }
  return false;
}

const q019OK = verifyQuestion("Q_L_019");
const q020OK = verifyQuestion("Q_L_020");

if (q019OK && q020OK) {
  console.log("\n🎉 両問題の解説が具体的になりました！");
} else {
  console.log("\n⚠️ 追加確認が必要です。");
}
