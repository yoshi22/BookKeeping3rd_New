const fs = require("fs");
const path = require("path");

const PROBLEMS_STRATEGY_PATH = path.join(
  __dirname,
  "../docs/product/problemsStrategy.md",
);

console.log("デバッグ: パターンマッチングテスト");

try {
  const content = fs.readFileSync(PROBLEMS_STRATEGY_PATH, "utf8");
  const lines = content.split("\n");
  let found = 0;

  console.log(`総行数: ${lines.length}`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^\s*-\s*\[Q_J_(\d{3})\]\s*(.+)/);
    if (match) {
      const num = parseInt(match[1]);
      if (num >= 25 && num <= 100) {
        console.log(`行${i}: ${line}`);
        console.log(`マッチ: Q_J_${match[1]} - ${match[2]}`);
        found++;
      }
    }
  }

  console.log(`Q_J_025-100で見つかった問題数: ${found}`);

  // 全体でQ_J_パターンを検索
  let totalQJ = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("[Q_J_")) {
      totalQJ++;
      if (totalQJ <= 10) {
        console.log(`Q_J全体サンプル${totalQJ}: ${line}`);
      }
    }
  }
  console.log(`Q_J_パターン総数: ${totalQJ}`);
} catch (error) {
  console.error("エラー:", error.message);
}
