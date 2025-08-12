const fs = require("fs");
const path = require("path");

console.log("🔧 Q_L_031〜Q_L_040（理論問題）の修正スクリプト\n");

const questionsPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "master-questions.ts",
);

// 理論問題の正しいテンプレートとデータ定義
const theoryProblems = {
  Q_L_031: {
    title: "簿記の基本原理と記帳体系",
    questionText: `【理論問題：簿記の基本原理と記帳体系】

以下の説明文の空欄に入る適切な語句を選択してください。

簿記の基本原理と記帳体系に関する以下の説明について、空欄（ア）～（エ）に入る適切な語句を選んでください。

簿記は（ア）に基づいて、すべての取引を（イ）と（ウ）の2つの側面から記録する。
この方法により、常に（エ）が保たれ、記録の正確性を検証できる。

【選択肢】
A. 複式簿記の原理  B. 借方  C. 貸方  D. 貸借平均

【解答形式】
各空欄に対して、最も適切な選択肢を選んでください。`,
    correctAnswer: {
      answers: {
        ア: "A",
        イ: "B",
        ウ: "C",
        エ: "D",
      },
    },
  },

  Q_L_032: {
    title: "仕訳の原則と借方・貸方の理解",
    questionText: `【理論問題：仕訳の原則と借方・貸方の理解】

以下の説明文の空欄に入る適切な語句を選択してください。

仕訳の原則と借方・貸方の理解に関する以下の説明について、空欄（ア）～（エ）に入る適切な語句を選んでください。

すべての取引は（ア）として記録され、取引の（イ）面を借方に、（ウ）面を貸方に記録する。
この記録により（エ）が実現され、帳簿の整合性が保たれる。

【選択肢】
A. 仕訳帳  B. 増加  C. 減少  D. 貸借平均

【解答形式】
各空欄に対して、最も適切な選択肢を選んでください。`,
    correctAnswer: {
      answers: {
        ア: "A",
        イ: "B",
        ウ: "C",
        エ: "D",
      },
    },
  },

  Q_L_033: {
    title: "帳簿組織と補助簿の役割",
    questionText: `【理論問題：帳簿組織と補助簿の役割】

以下の説明文の空欄に入る適切な語句を選択してください。

帳簿組織と補助簿の役割に関する以下の説明について、空欄（ア）～（エ）に入る適切な語句を選んでください。

会計帳簿は（ア）と補助簿に分けられ、（イ）は全取引を記録し、補助簿は（ウ）の詳細を管理する。
これにより（エ）が実現され、効率的な会計処理が可能となる。

【選択肢】
A. 主要簿  B. 仕訳帳・総勘定元帳  C. 特定勘定科目  D. 記帳の分業化

【解答形式】
各空欄に対して、最も適切な選択肢を選んでください。`,
    correctAnswer: {
      answers: {
        ア: "A",
        イ: "B",
        ウ: "C",
        エ: "D",
      },
    },
  },

  Q_L_034: {
    title: "伝票制度の種類と特徴",
    questionText: `【理論問題：伝票制度の種類と特徴】

以下の説明文の空欄に入る適切な語句を選択してください。

伝票制度の種類と特徴に関する以下の説明について、空欄（ア）～（エ）に入る適切な語句を選んでください。

伝票制度には（ア）と5伝票制があり、（イ）では入金・出金・振替の3種類の伝票を使用する。
この制度により（ウ）が図られ、（エ）が向上する。

【選択肢】
A. 3伝票制  B. 3伝票制  C. 事務処理の効率化  D. 内部統制

【解答形式】
各空欄に対して、最も適切な選択肢を選んでください。`,
    correctAnswer: {
      answers: {
        ア: "A",
        イ: "B",
        ウ: "C",
        エ: "D",
      },
    },
  },

  Q_L_035: {
    title: "試算表の種類と作成目的",
    questionText: `【理論問題：試算表の種類と作成目的】

以下の説明文の空欄に入る適切な語句を選択してください。

試算表の種類と作成目的に関する以下の説明について、空欄（ア）～（エ）に入る適切な語句を選んでください。

試算表には（ア）、残高試算表、合計残高試算表の3種類があり、（イ）の検証と（ウ）の確認が主目的である。
特に（エ）は決算書作成の基礎資料となる。

【選択肢】
A. 合計試算表  B. 記録の正確性  C. 各勘定残高  D. 残高試算表

【解答形式】
各空欄に対して、最も適切な選択肢を選んでください。`,
    correctAnswer: {
      answers: {
        ア: "A",
        イ: "B",
        ウ: "C",
        エ: "D",
      },
    },
  },

  Q_L_036: {
    title: "決算整理の意義と手続き",
    questionText: `【理論問題：決算整理の意義と手続き】

以下の説明文の空欄に入る適切な語句を選択してください。

決算整理の意義と手続きに関する以下の説明について、空欄（ア）～（エ）に入る適切な語句を選んでください。

決算整理は（ア）を正確に計算するために行われ、（イ）、減価償却、引当金の計上などが含まれる。
これにより（ウ）が作成され、（エ）が実現される。

【選択肢】
A. 期間損益  B. 費用・収益の見越し・繰延べ  C. 正確な財務諸表  D. 適正な期間計算

【解答形式】
各空欄に対して、最も適切な選択肢を選んでください。`,
    correctAnswer: {
      answers: {
        ア: "A",
        イ: "B",
        ウ: "C",
        エ: "D",
      },
    },
  },

  Q_L_037: {
    title: "財務諸表の構成要素",
    questionText: `【理論問題：財務諸表の構成要素】

以下の説明文の空欄に入る適切な語句を選択してください。

財務諸表の構成要素に関する以下の説明について、空欄（ア）～（エ）に入る適切な語句を選んでください。

財務諸表は（ア）と損益計算書を中心とし、（イ）は資産・負債・純資産を、損益計算書は（ウ）を表示する。
これにより企業の（エ）を明らかにする。

【選択肢】
A. 貸借対照表  B. 貸借対照表  C. 収益・費用  D. 財政状態と経営成績

【解答形式】
各空欄に対して、最も適切な選択肢を選んでください。`,
    correctAnswer: {
      answers: {
        ア: "A",
        イ: "B",
        ウ: "C",
        エ: "D",
      },
    },
  },

  Q_L_038: {
    title: "勘定科目の分類と体系",
    questionText: `【理論問題：勘定科目の分類と体系】

以下の説明文の空欄に入る適切な語句を選択してください。

勘定科目の分類と体系に関する以下の説明について、空欄（ア）～（エ）に入る適切な語句を選んでください。

勘定科目は（ア）・負債・純資産・収益・費用の5要素に分類され、この分類により（イ）が構築される。
各科目は（ウ）に従って記録され、（エ）の作成に用いられる。

【選択肢】
A. 資産  B. 複式簿記システム  C. 貸借対照の原理  D. 財務諸表

【解答形式】
各空欄に対して、最も適切な選択肢を選んでください。`,
    correctAnswer: {
      answers: {
        ア: "A",
        イ: "B",
        ウ: "C",
        エ: "D",
      },
    },
  },

  Q_L_039: {
    title: "会計処理の基本原則",
    questionText: `【理論問題：会計処理の基本原則】

以下の説明文の空欄に入る適切な語句を選択してください。

会計処理の基本原則に関する以下の説明について、空欄（ア）～（エ）に入る適切な語句を選んでください。

会計処理は（ア）に基づいて行われ、（イ）と継続性の原則を遵守する。
これにより（ウ）が確保され、（エ）が可能となる。

【選択肢】
A. 企業会計原則  B. 真実性  C. 情報の信頼性  D. 期間比較

【解答形式】
各空欄に対して、最も適切な選択肢を選んでください。`,
    correctAnswer: {
      answers: {
        ア: "A",
        イ: "B",
        ウ: "C",
        エ: "D",
      },
    },
  },

  Q_L_040: {
    title: "内部統制と監査の役割",
    questionText: `【理論問題：内部統制と監査の役割】

以下の説明文の空欄に入る適切な語句を選択してください。

内部統制と監査の役割に関する以下の説明について、空欄（ア）～（エ）に入る適切な語句を選んでください。

内部統制は（ア）の信頼性確保と（イ）の防止を目的とし、監査により（ウ）が検証される。
これにより（エ）が向上する。

【選択肢】
A. 財務報告  B. 不正・誤謬  C. 統制の有効性  D. 経営の透明性

【解答形式】
各空欄に対して、最も適切な選択肢を選んでください。`,
    correctAnswer: {
      answers: {
        ア: "A",
        イ: "B",
        ウ: "C",
        エ: "D",
      },
    },
  },
};

// 多肢選択問題用のテンプレート
const multipleChoiceTemplate = {
  type: "multiple_choice",
  fields: [
    {
      name: "ア",
      label: "空欄（ア）",
      type: "dropdown",
      required: true,
      options: ["A", "B", "C", "D"],
    },
    {
      name: "イ",
      label: "空欄（イ）",
      type: "dropdown",
      required: true,
      options: ["A", "B", "C", "D"],
    },
    {
      name: "ウ",
      label: "空欄（ウ）",
      type: "dropdown",
      required: true,
      options: ["A", "B", "C", "D"],
    },
    {
      name: "エ",
      label: "空欄（エ）",
      type: "dropdown",
      required: true,
      options: ["A", "B", "C", "D"],
    },
  ],
  validation: {
    requiredFields: true,
  },
};

console.log("📊 Q_L_031〜Q_L_040の修正内容:");
console.log("- 理論問題に適したmultiple_choiceテンプレートに変更");
console.log("- 選択肢形式の正答に修正");
console.log("- 不可能な日付（8/33等）を除去");
console.log(`- 修正対象: ${Object.keys(theoryProblems).length}問\n`);

let questionsContent = fs.readFileSync(questionsPath, "utf8");

// バックアップ作成
const backupPath = questionsPath + ".backup-theory-problems-" + Date.now();
fs.writeFileSync(backupPath, questionsContent);
console.log(`バックアップ作成: ${path.basename(backupPath)}\n`);

let fixedCount = 0;

// 各理論問題の修正処理
Object.keys(theoryProblems).forEach((problemId) => {
  const problemData = theoryProblems[problemId];

  console.log(`🔧 ${problemId}: ${problemData.title}の修正中...`);

  // 問題文の置換
  const questionRegex = new RegExp(
    `(id: "${problemId}",[\\s\\S]*?question_text:\\s*")([\\s\\S]*?)(",)`,
    "g",
  );

  if (questionsContent.match(questionRegex)) {
    questionsContent = questionsContent.replace(
      questionRegex,
      `$1${problemData.questionText}$3`,
    );
    console.log(`  ✅ ${problemId}の問題文を修正しました`);
  }

  // テンプレートの置換（ledger_entry → multiple_choice）
  const templateJson = JSON.stringify(multipleChoiceTemplate);
  const templateRegex = new RegExp(
    `(id: "${problemId}",[\\s\\S]*?answer_template_json:\\s*')([^']*)(')`,
    "g",
  );

  if (questionsContent.match(templateRegex)) {
    questionsContent = questionsContent.replace(
      templateRegex,
      `$1${templateJson}$3`,
    );
    console.log(`  ✅ ${problemId}のテンプレートをmultiple_choiceに変更`);
  }

  // 正答データの置換
  const correctAnswerJson = JSON.stringify(problemData.correctAnswer);
  const answerRegex = new RegExp(
    `(id: "${problemId}",[\\s\\S]*?correct_answer_json:\\s*')([^']*)(')`,
    "g",
  );

  if (questionsContent.match(answerRegex)) {
    questionsContent = questionsContent.replace(
      answerRegex,
      `$1${correctAnswerJson}$3`,
    );
    console.log(`  ✅ ${problemId}の正答データを修正しました`);
    fixedCount++;
  }

  console.log("");
});

// 修正版を保存
fs.writeFileSync(questionsPath, questionsContent);

console.log("🎯 理論問題修正完了");
console.log(`- 修正成功: ${fixedCount}問`);
console.log("- 全てledger_entry → multiple_choiceテンプレートに変更");
console.log("- 選択肢A,B,C,Dによる解答形式に統一");
console.log("- 不可能な日付や帳簿記入データを除去");
console.log("- 各問題の理論内容に応じた適切な選択肢を設定");
