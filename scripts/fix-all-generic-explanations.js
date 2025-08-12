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

// 汎用説明文のパターン
const genericPattern =
  /基本的な仕訳問題（問題\d+）。取引内容を正確に読み取り適切に処理してください。/g;

// 汎用説明文を持つ問題を検出
const matches = content.matchAll(
  /id: "(Q_J_\d+)"[\s\S]*?question_text:\s*"([^"]+)"[\s\S]*?explanation:\s*"([^"]+)"/g,
);

let fixCount = 0;
const fixedQuestions = [];

for (const match of matches) {
  const [fullMatch, id, questionText, explanation] = match;

  // 汎用説明文の場合のみ処理
  if (explanation.includes("基本的な仕訳問題（問題")) {
    // 問題文から取引内容を抽出して具体的な説明を生成
    let newExplanation = "";

    // 問題文のキーワードに基づいて説明を生成
    if (questionText.includes("給料") || questionText.includes("給与")) {
      newExplanation =
        "給料の支払処理。総額から源泉所得税や社会保険料等を差し引いて手取額を支払います。借方に給料（費用）を総額で計上し、貸方に預り金（負債）と現金または預金を計上。";
    } else if (questionText.includes("家賃") && questionText.includes("支払")) {
      newExplanation =
        "家賃の支払処理。費用の発生として借方に支払家賃を計上し、貸方に現金または預金の減少を記録。前払いの場合は前払家賃（資産）として処理。";
    } else if (questionText.includes("家賃") && questionText.includes("受取")) {
      newExplanation =
        "家賃の受取処理。収益の発生として貸方に受取家賃を計上し、借方に現金または預金の増加を記録。前受けの場合は前受家賃（負債）として処理。";
    } else if (
      questionText.includes("売掛金") &&
      questionText.includes("回収")
    ) {
      newExplanation =
        "売掛金の回収処理。売掛金（資産）が減少するため貸方に計上し、現金や預金（資産）の増加を借方に計上。手形で回収した場合は受取手形を使用。";
    } else if (
      questionText.includes("買掛金") &&
      questionText.includes("支払")
    ) {
      newExplanation =
        "買掛金の支払処理。買掛金（負債）が減少するため借方に計上し、現金や預金（資産）の減少を貸方に計上。手形で支払った場合は支払手形を使用。";
    } else if (questionText.includes("貸付")) {
      newExplanation =
        "金銭の貸付処理。貸付金（資産）が増加するため借方に計上し、現金または預金（資産）の減少を貸方に計上。";
    } else if (questionText.includes("借入")) {
      newExplanation =
        "金銭の借入処理。借入金（負債）が増加するため貸方に計上し、現金または預金（資産）の増加を借方に計上。";
    } else if (questionText.includes("返済") && questionText.includes("利息")) {
      newExplanation =
        "借入金の返済と利息支払の処理。借入金（負債）の減少を借方に、支払利息（費用）を借方に、現金または預金の減少を貸方に計上。";
    } else if (questionText.includes("減価償却")) {
      newExplanation =
        "減価償却の計上処理。間接法の場合、借方に減価償却費（費用）、貸方に減価償却累計額（資産のマイナス勘定）を計上。直接法の場合は固定資産を直接減額。";
    } else if (questionText.includes("貸倒引当金")) {
      newExplanation =
        "貸倒引当金の設定処理。債権の貸倒リスクに備えて、借方に貸倒引当金繰入（費用）、貸方に貸倒引当金（資産のマイナス勘定）を計上。";
    } else if (
      questionText.includes("貸倒") &&
      !questionText.includes("引当金")
    ) {
      newExplanation =
        "貸倒の発生処理。回収不能となった債権を、貸倒引当金がある場合はまず引当金を使用し、不足分は貸倒損失として処理。";
    } else if (
      questionText.includes("消耗品") &&
      questionText.includes("購入")
    ) {
      newExplanation =
        "消耗品の購入処理。費用法では借方に消耗品費（費用）、資産法では借方に消耗品（資産）を計上し、貸方に現金または買掛金を計上。";
    } else if (questionText.includes("手形") && questionText.includes("受取")) {
      newExplanation =
        "手形の受取処理。受取手形（資産）が増加するため借方に計上し、売掛金の減少または売上の発生を貸方に計上。";
    } else if (questionText.includes("手形") && questionText.includes("支払")) {
      newExplanation =
        "手形の振出処理。支払手形（負債）が増加するため貸方に計上し、買掛金の減少または仕入の発生を借方に計上。";
    } else if (questionText.includes("手形") && questionText.includes("割引")) {
      newExplanation =
        "手形の割引処理。受取手形を銀行で割引いて現金化。借方に現金と手形売却損、貸方に受取手形を計上。";
    } else if (questionText.includes("当座借越")) {
      newExplanation =
        "当座借越の処理。当座預金残高を超えて引き出す場合、マイナス残高を当座借越（負債）として処理。";
    } else if (questionText.includes("仮払金")) {
      newExplanation =
        "仮払金の処理。用途が未確定の支出を一時的に仮払金（資産）として処理し、後日精算時に適切な勘定科目に振り替え。";
    } else if (questionText.includes("仮受金")) {
      newExplanation =
        "仮受金の処理。内容が未確定の入金を一時的に仮受金（負債）として処理し、後日内容判明時に適切な勘定科目に振り替え。";
    } else if (questionText.includes("前払") || questionText.includes("前渡")) {
      newExplanation =
        "前払金の処理。商品やサービスの対価を前払いした場合、前払金（資産）として処理し、商品受取時や役務提供時に振り替え。";
    } else if (questionText.includes("前受")) {
      newExplanation =
        "前受金の処理。商品やサービスの対価を前受けした場合、前受金（負債）として処理し、商品引渡時や役務提供時に売上に振り替え。";
    } else if (questionText.includes("未払") || questionText.includes("未収")) {
      if (questionText.includes("未払")) {
        newExplanation =
          "未払金・未払費用の処理。既に発生した費用や代金の未払分を負債として計上。";
      } else {
        newExplanation =
          "未収金・未収収益の処理。既に発生した収益や代金の未収分を資産として計上。";
      }
    } else if (questionText.includes("資本金")) {
      newExplanation =
        "資本金の処理。会社設立時や増資時の出資金を資本金（純資産）として貸方に計上し、対応する資産の増加を借方に計上。";
    } else if (questionText.includes("引出金")) {
      newExplanation =
        "引出金の処理。個人事業主が事業用資金を私用で引き出した場合、引出金（資本のマイナス）として処理。";
    } else if (
      questionText.includes("租税公課") ||
      questionText.includes("税金")
    ) {
      newExplanation =
        "租税公課の処理。事業に関する税金の支払いを費用として借方に計上し、現金または預金の減少を貸方に計上。";
    } else if (questionText.includes("保険料")) {
      newExplanation =
        "保険料の処理。支払保険料を費用として借方に計上。前払部分がある場合は前払保険料（資産）として処理。";
    } else if (questionText.includes("修繕")) {
      newExplanation =
        "修繕費の処理。建物や備品等の修理代を修繕費（費用）として借方に計上し、現金または未払金を貸方に計上。";
    } else if (questionText.includes("広告")) {
      newExplanation =
        "広告宣伝費の処理。広告や宣伝に関する支出を費用として借方に計上し、現金または未払金を貸方に計上。";
    } else if (questionText.includes("通信費")) {
      newExplanation =
        "通信費の処理。電話代やインターネット料金等を費用として借方に計上し、現金または未払金を貸方に計上。";
    } else if (questionText.includes("水道光熱費")) {
      newExplanation =
        "水道光熱費の処理。電気・ガス・水道代を費用として借方に計上し、現金または未払金を貸方に計上。";
    } else if (
      questionText.includes("旅費交通費") ||
      questionText.includes("交通費")
    ) {
      newExplanation =
        "旅費交通費の処理。出張費用や交通費を費用として借方に計上し、現金または未払金を貸方に計上。";
    } else if (questionText.includes("会議費")) {
      newExplanation =
        "会議費の処理。会議に関する支出を費用として借方に計上し、現金または未払金を貸方に計上。";
    } else if (questionText.includes("福利厚生")) {
      newExplanation =
        "福利厚生費の処理。従業員の福利厚生に関する支出を費用として借方に計上し、現金または未払金を貸方に計上。";
    } else if (
      questionText.includes("雑費") ||
      questionText.includes("雑損") ||
      questionText.includes("雑益")
    ) {
      if (questionText.includes("雑益")) {
        newExplanation =
          "雑益の処理。営業外の少額収益を雑益（収益）として貸方に計上。";
      } else if (questionText.includes("雑損")) {
        newExplanation =
          "雑損の処理。営業外の少額損失を雑損（費用）として借方に計上。";
      } else {
        newExplanation =
          "雑費の処理。他の勘定科目に該当しない少額の費用を雑費として借方に計上。";
      }
    } else if (questionText.includes("返品") || questionText.includes("値引")) {
      if (questionText.includes("仕入") || questionText.includes("購入")) {
        newExplanation =
          "仕入返品・値引の処理。仕入れた商品の返品や値引きにより、仕入（費用）を減少させる逆仕訳を行う。";
      } else if (
        questionText.includes("売上") ||
        questionText.includes("販売")
      ) {
        newExplanation =
          "売上返品・値引の処理。販売した商品の返品や値引きにより、売上（収益）を減少させる逆仕訳を行う。";
      }
    } else {
      // デフォルトの説明（問題文の内容を含める）
      const shortQuestion = questionText
        .replace(/【仕訳問題】次の取引について仕訳しなさい。\n\n/, "")
        .substring(0, 50);
      newExplanation = `この取引の仕訳処理。${shortQuestion}...に対する適切な勘定科目と金額を計上。`;
    }

    // 説明文を置き換え
    const escapedExplanation = explanation.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );
    const regex = new RegExp(
      `(id: "${id}"[\\s\\S]*?explanation:\\s*")${escapedExplanation}(")`,
    );

    if (regex.test(content)) {
      content = content.replace(
        regex,
        `$1${newExplanation}\\\\n\\\\n⚠️ 間違えやすいポイント：勘定科目の正確な選択、借方・貸方の判定、金額の計算に注意。問題文の細部まで注意深く読み取ること。$2`,
      );
      fixCount++;
      fixedQuestions.push(id);
    }
  }
}

// ファイル書き込み
fs.writeFileSync(filePath, content, "utf8");

console.log(`\n✨ 合計 ${fixCount} 個の汎用説明文を具体的な内容に修正しました`);
if (fixedQuestions.length > 0) {
  console.log("\n📝 修正した問題ID:");
  fixedQuestions.forEach((id, index) => {
    if (index % 10 === 0) console.log("");
    process.stdout.write(`${id} `);
  });
  console.log("");
}
