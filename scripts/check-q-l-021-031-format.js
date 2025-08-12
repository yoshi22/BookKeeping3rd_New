const fs = require("fs");
const path = require("path");

console.log("🔍 Q_L_021とQ_L_031のフォーマット確認\n");
console.log("=" * 60 + "\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);
const content = fs.readFileSync(questionsPath, "utf8");

// 問題を抽出する関数
function extractQuestion(id) {
  const num = parseInt(id.split("_")[2]);
  const nextId =
    num < 40 ? `Q_L_${String(num + 1).padStart(3, "0")}` : "Q_TB_001";

  const startPattern = new RegExp(`id: "${id}"`);
  const endPattern = new RegExp(`id: "${nextId}"`);

  const startMatch = content.match(startPattern);
  const endMatch = content.match(endPattern);

  if (!startMatch) return null;

  const startIndex = startMatch.index;
  const endIndex = endMatch ? endMatch.index : content.length;

  return content.substring(startIndex, endIndex);
}

// Q_L_021の確認
console.log("📝 Q_L_021（伝票問題）の確認:");
console.log("-" * 60);

const q021Section = extractQuestion("Q_L_021");
if (q021Section) {
  // 問題文
  const questionMatch = q021Section.match(/question_text:\s*"([^"]+)"/);
  if (questionMatch) {
    console.log("\n問題文（抜粋）:");
    console.log(questionMatch[1].substring(0, 100) + "...");
  }

  // テンプレート
  const templateMatch = q021Section.match(/answer_template_json:\s*'([^']+)'/);
  if (templateMatch) {
    try {
      const template = JSON.parse(templateMatch[1]);
      console.log("\nテンプレートタイプ:", template.type);

      if (template.fields) {
        console.log("フィールド（単一入力形式）:");
        template.fields.forEach((f) => {
          console.log(`  - ${f.label} (${f.type})`);
        });
      }

      if (template.vouchers) {
        console.log("伝票タイプ（複数伝票形式）:");
        template.vouchers.forEach((v) => {
          console.log(`  - ${v.type}`);
          if (v.fields) {
            console.log("    フィールド:");
            v.fields.forEach((f) => {
              console.log(`      - ${f.label} (${f.type})`);
            });
          }
        });
      }
    } catch (e) {
      console.log("\nテンプレート解析エラー:", e.message);
    }
  }

  // 正答
  const answerMatch = q021Section.match(/correct_answer_json:\s*'([^']+)'/);
  if (answerMatch) {
    try {
      const answer = JSON.parse(answerMatch[1]);
      console.log("\n正答構造:");

      if (answer.vouchers) {
        console.log("  vouchers配列あり（伝票形式）:");
        answer.vouchers.forEach((v, i) => {
          console.log(`    伝票${i + 1}: ${v.type}`);
          if (v.entries) {
            console.log(`      エントリ数: ${v.entries.length}`);
          }
        });
      } else if (answer.entries) {
        console.log("  entries配列あり（帳簿形式）");
        console.log(`    エントリ数: ${answer.entries.length}`);
      } else {
        console.log("  不明な構造:", Object.keys(answer));
      }
    } catch (e) {
      console.log("\n正答解析エラー:", e.message);
    }
  }

  // 解説の正答表示部分を確認
  const explanationMatch = q021Section.match(/explanation:\s*"([^"]+)"/);
  if (explanationMatch) {
    const explanation = explanationMatch[1];
    console.log("\n解説内での正答表示（抜粋）:");
    // 最初の100文字を表示
    console.log(explanation.substring(0, 200) + "...");
  }
}

// Q_L_031の確認
console.log("\n\n📝 Q_L_031（選択問題）の確認:");
console.log("-" * 60);

const q031Section = extractQuestion("Q_L_031");
if (q031Section) {
  // 問題文
  const questionMatch = q031Section.match(/question_text:\s*"([^"]+)"/);
  if (questionMatch) {
    console.log("\n問題文（抜粋）:");
    console.log(questionMatch[1].substring(0, 100) + "...");
  }

  // テンプレート
  const templateMatch = q031Section.match(/answer_template_json:\s*'([^']+)'/);
  if (templateMatch) {
    try {
      const template = JSON.parse(templateMatch[1]);
      console.log("\nテンプレートタイプ:", template.type);

      if (template.fields) {
        console.log("フィールド（入力形式）:");
        template.fields.forEach((f) => {
          console.log(`  - ${f.label} (${f.type})`);
        });
      }

      if (template.options) {
        console.log("選択肢:");
        template.options.forEach((opt, i) => {
          console.log(`  ${i + 1}. ${opt}`);
        });
      }
    } catch (e) {
      console.log("\nテンプレート解析エラー:", e.message);
    }
  }

  // 正答
  const answerMatch = q031Section.match(/correct_answer_json:\s*'([^']+)'/);
  if (answerMatch) {
    try {
      const answer = JSON.parse(answerMatch[1]);
      console.log("\n正答構造:");
      console.log("  ", JSON.stringify(answer, null, 2));
    } catch (e) {
      console.log("\n正答解析エラー:", e.message);
    }
  }
}

// 問題点のサマリー
console.log("\n\n📊 問題点の分析:");
console.log("=" * 60);

console.log("\n⚠️ Q_L_021の問題:");
console.log("1. テンプレートが伝票形式（voucher_entry）でない可能性");
console.log("2. 正答のvouchersが正しくJSONシリアライズされていない可能性");
console.log("3. 解説内で[object Object]と表示される問題");

console.log("\n⚠️ Q_L_031の問題:");
console.log("1. テンプレートが選択形式（single_choice）でない可能性");
console.log("2. 入力フィールドが計算結果入力のような表示になっている");

console.log("\n🔧 必要な修正:");
console.log("- Q_L_021-030: voucher_entryテンプレートと正しいJSON形式の実装");
console.log("- Q_L_031-040: single_choice/multiple_choiceテンプレートの実装");
