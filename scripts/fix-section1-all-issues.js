const fs = require("fs");
const path = require("path");

// ファイルパス
const filePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

// ファイル読み込み
let content = fs.readFileSync(filePath, "utf8");

// 修正カウンター
let fixCount = 0;

// 1. Q_J_006の正答を修正（定期預金満期）
const q006Fix = {
  old: '"journalEntry":{"debit_account":"小口現金","debit_amount":241000,"credit_account":"現金","credit_amount":241000}',
  new: '"journalEntry":{"entries":[{"debit_account":"普通預金","debit_amount":152000},{"credit_account":"定期預金","credit_amount":150000},{"credit_account":"受取利息","credit_amount":2000}]}',
};

if (content.includes(q006Fix.old)) {
  content = content.replace(q006Fix.old, q006Fix.new);
  fixCount++;
  console.log("✅ Q_J_006の正答を修正しました（定期預金満期）");
}

// 2. Q_J_007の正答を修正（現金過不足原因判明）
const q007Fix = {
  old: '"journalEntry":{"debit_account":"当座預金","debit_amount":263000,"credit_account":"売掛金","credit_amount":263000}',
  new: '"journalEntry":{"entries":[{"debit_account":"通信費","debit_amount":30000},{"debit_account":"雑損","debit_amount":20000},{"credit_account":"現金過不足","credit_amount":50000}]}',
};

if (content.includes(q007Fix.old)) {
  content = content.replace(q007Fix.old, q007Fix.new);
  fixCount++;
  console.log("✅ Q_J_007の正答を修正しました（現金過不足原因判明）");
}

// 3. 汎用的な説明文を具体的な内容に置き換える
const explanationFixes = [
  {
    id: "Q_J_006",
    oldExplanation:
      "基本的な仕訳問題（問題6）。取引内容を正確に読み取り適切に処理してください。",
    newExplanation:
      "定期預金の満期処理。定期預金150,000円と利息2,000円（税引後）が普通預金に振り替えられます。借方に普通預金152,000円、貸方に定期預金150,000円と受取利息2,000円を計上。",
  },
  {
    id: "Q_J_007",
    oldExplanation:
      "現金実査による過不足処理。実際有高と帳簿残高の差額を「現金過不足」で調整します。",
    newExplanation:
      "現金過不足の原因判明処理。借方残高50,000円のうち、通信費30,000円の記入漏れが判明したので通信費を計上。残額20,000円は原因不明なので雑損で処理。貸方は現金過不足50,000円を消去。",
  },
];

// 各説明文の修正
explanationFixes.forEach((fix) => {
  const regex = new RegExp(
    `(id: "${fix.id}"[\\s\\S]*?explanation:\\s*")[^"]*(")`,
  );
  const match = content.match(regex);
  if (match && match[0].includes(fix.oldExplanation)) {
    content = content.replace(regex, `$1${fix.newExplanation}$2`);
    fixCount++;
    console.log(`✅ ${fix.id}の説明文を修正しました`);
  }
});

// 汎用説明文のパターンを検出して修正
const genericPatterns = [
  /基本的な仕訳問題（問題\d+）。取引内容を正確に読み取り適切に処理してください。/g,
];

// 各問題IDとその説明を個別に修正する必要がある問題のリスト
const specificExplanations = {
  Q_J_011:
    "前払金を含む商品仕入の処理。以前支払った前払金200,000円を仕入に振り替え、追加の代金600,000円を掛けとします。借方「仕入」800,000円、貸方「前払金」200,000円と「買掛金」600,000円。",
  Q_J_012:
    "貸倒引当金の設定。売掛金残高に対して一定率の貸倒引当金を設定します。借方「貸倒引当金繰入」、貸方「貸倒引当金」で計上。",
  Q_J_013:
    "貸倒処理と引当金の利用。前期に設定した貸倒引当金を使用して貸倒を処理。引当金不足分は当期の貸倒損失として計上。",
  Q_J_014:
    "建物の購入と付随費用。建物本体価格に仲介手数料等の付随費用を加えて取得原価とし、未払金で処理します。",
  Q_J_015:
    "備品購入（現金・掛け）。備品代金の一部を現金で支払い、残額を掛けとする複合仕訳。",
  Q_J_016:
    "固定資産の売却（売却益）。帳簿価額より高く売却した場合は固定資産売却益を計上。",
  Q_J_017:
    "固定資産の売却（売却損）。帳簿価額より低く売却した場合は固定資産売却損を計上。",
  Q_J_018: "借入金の返済と利息支払い。元本返済と利息を同時に処理する複合仕訳。",
  Q_J_019:
    "社債の発行（平価発行）。額面金額で社債を発行し、代金を当座預金で受け取る処理。",
  Q_J_020:
    "給料の支払いと源泉徴収。総額から所得税と社会保険料を差し引いて手取額を支払う。",
};

// 具体的な説明文に置き換え
Object.entries(specificExplanations).forEach(([id, explanation]) => {
  const regex = new RegExp(
    `(id: "${id}"[\\s\\S]*?explanation:\\s*")([^"]*基本的な仕訳問題[^"]*)(")`,
    "g",
  );
  if (regex.test(content)) {
    content = content.replace(
      regex,
      `$1${explanation}\\\\n\\\\n⚠️ 間違えやすいポイント：勘定科目名の選択、借方・貸方の判定、金額の正確性に注意。$3`,
    );
    fixCount++;
    console.log(`✅ ${id}の汎用説明文を具体的な内容に修正しました`);
  }
});

// ファイル書き込み
fs.writeFileSync(filePath, content, "utf8");

console.log(`\n✨ 合計 ${fixCount} 箇所の修正を完了しました`);
console.log("📝 修正内容:");
console.log("  - Q_J_006: 定期預金満期の正答を修正");
console.log("  - Q_J_007: 現金過不足の正答を修正");
console.log("  - 汎用的な説明文を具体的な内容に置き換え");
