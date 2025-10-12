const fs = require("fs");

function main() {
  const path = "src/data/master-questions.ts.backup-1759646478";
  const s = fs.readFileSync(path, "utf8");
  const issues = [];
  const reBlock = /\{\s*id:\s*\"(Q_[A-Z0-9_]+)\"[\s\S]*?answer_template_json:\s*'([\s\S]*?)',[\s\S]*?correct_answer_json:\s*'([\s\S]*?)',[\s\S]*?\}/g;
  let m;
  while ((m = reBlock.exec(s))) {
    const id = m[1];
    const tmplStr = m[2];
    const corrStr = m[3];
    const out = { id, problems: [] };

    // 第一問: 仕訳の典型不整合
    if (tmplStr.includes('"type":"journal_entry"')) {
      const tJE = tmplStr.match(/"journalEntry":(\[|\{)/);
      const cJE = corrStr.match(/"journalEntry":(\[|\{)/);
      if (tJE && cJE && tJE[1] !== cJE[1]) {
        out.problems.push("journalEntry 形状不一致(テンプレートと正答)");
      }
      if (/"credit_account":0/.test(tmplStr)) {
        out.problems.push("typo: credit_account:0");
      }
    }

    // 第三問など: blanks/correctIndex の基本整合性チェック
    try {
      const tmplObj = JSON.parse(tmplStr);
      const corrObj = JSON.parse(corrStr);
      if (Array.isArray(tmplObj?.blanks) && Array.isArray(corrObj?.blanks)) {
        for (const b of corrObj.blanks) {
          if (typeof b.index !== "number" || typeof b.correctIndex !== "number") {
            out.problems.push("正答定義の型不正");
            continue;
          }
          const tBlank = tmplObj.blanks[b.index];
          if (!tBlank) {
            out.problems.push(`blanks.index=${b.index} がテンプレートに不存在`);
            continue;
          }
          const choices = Array.isArray(tBlank.choices) ? tBlank.choices : [];
          if (!(b.correctIndex >= 0 && b.correctIndex < choices.length)) {
            out.problems.push(`correctIndex 範囲外 index=${b.index}`);
          }
        }
      }
    } catch (e) {
      // 非 JSON テンプレート（journalなど）はスキップ
    }

    if (out.problems.length) issues.push(out);
  }
  console.log(JSON.stringify({ count: issues.length, issues }, null, 2));
}

main();

