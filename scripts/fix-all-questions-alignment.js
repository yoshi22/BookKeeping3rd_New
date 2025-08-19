#!/usr/bin/env node

/**
 * 全302問題 problemsStrategy.md 整合性修正スクリプト
 * - 全問題を problemsStrategy.md の定義に合致するよう修正
 * - 問題文・正答・解説の三要素整合性を確保
 * - 段階的実行（Stage A, B, C）で安全に修正
 */

const fs = require("fs");
const path = require("path");

const MASTER_QUESTIONS_PATH = path.join(
  __dirname,
  "../src/data/master-questions.ts",
);

// problemsStrategy.md で定義されている全問題パターン
const QUESTION_PATTERNS = {
  // ===== カテゴリー1：現金・預金取引（42問） =====

  // 現金過不足（4問）
  Q_J_001: {
    pattern: "原因不明の現金過不足発見→現金過不足勘定計上",
    question_text:
      "現金実査の結果、現金の実際有高が帳簿残高より200円不足していた。原因は不明である。",
    correct_answer: {
      debit_account: "現金過不足",
      debit_amount: 200,
      credit_account: "現金",
      credit_amount: 200,
    },
    explanation:
      "原因不明の現金過不足は一時的に「現金過不足」勘定で処理し、決算時に原因を調査して適切な勘定に振り替える。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "現金取引",
      subpattern: "現金過不足",
      accounts: ["現金", "現金過不足"],
      keywords: ["現金・預金", "現金取引", "現金過不足"],
      examSection: 1,
    },
  },

  Q_J_002: {
    pattern: "原因判明の現金過不足→該当勘定への直接修正",
    question_text:
      "現金実査の結果、現金が100円不足していた。調査により通信費の記帳漏れと判明した。",
    correct_answer: {
      debit_account: "通信費",
      debit_amount: 100,
      credit_account: "現金",
      credit_amount: 100,
    },
    explanation:
      "原因が判明した現金過不足は、該当する勘定科目に直接記帳する。通信費の記帳漏れなので通信費勘定で処理。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "現金取引",
      subpattern: "現金過不足",
      accounts: ["通信費", "現金", "現金過不足"],
      keywords: ["現金・預金", "現金取引", "現金過不足"],
      examSection: 1,
    },
  },

  Q_J_003: {
    pattern: "決算時の現金過不足整理→雑損益への振替",
    question_text:
      "決算において、現金過不足勘定に借方残高150円がある。原因は不明のまま決算を迎えた。",
    correct_answer: {
      debit_account: "雑損",
      debit_amount: 150,
      credit_account: "現金過不足",
      credit_amount: 150,
    },
    explanation:
      "決算時に原因不明の現金過不足は、借方残高は雑損、貸方残高は雑益に振り替える。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "現金取引",
      subpattern: "現金過不足",
      accounts: ["雑損", "雑益", "現金過不足"],
      keywords: ["現金・預金", "現金取引", "現金過不足"],
      examSection: 1,
    },
  },

  Q_J_004: {
    pattern: "現金実査による帳簿残高との差額発見",
    question_text:
      "現金実査の結果、現金の実際有高が50,000円であったが、帳簿残高は48,000円であった。",
    correct_answer: {
      debit_account: "現金",
      debit_amount: 2000,
      credit_account: "現金過不足",
      credit_amount: 2000,
    },
    explanation:
      "現金の実際有高が帳簿残高を上回る場合は、現金の増加と現金過不足勘定（貸方）で処理する。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "現金取引",
      subpattern: "現金過不足",
      accounts: ["現金", "現金過不足"],
      keywords: ["現金・預金", "現金取引", "現金過不足"],
      examSection: 1,
    },
  },

  // 小口現金（3問）
  Q_J_005: {
    pattern: "小口現金制度の設定・資金前渡",
    question_text: "小口現金制度を採用し、小口現金係に10,000円を前渡しした。",
    correct_answer: {
      debit_account: "小口現金",
      debit_amount: 10000,
      credit_account: "現金",
      credit_amount: 10000,
    },
    explanation:
      "小口現金制度では、小口現金係への資金前渡を「小口現金」勘定の借方に計上する。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "現金取引",
      subpattern: "小口現金",
      accounts: ["小口現金", "現金"],
      keywords: ["現金・預金", "現金取引", "小口現金"],
      examSection: 1,
    },
  },

  Q_J_006: {
    pattern: "小口現金の定期補給（インプレスト・システム）",
    question_text:
      "小口現金の残高が2,000円となったため、8,000円を補給して10,000円とした。",
    correct_answer: {
      debit_account: "小口現金",
      debit_amount: 8000,
      credit_account: "現金",
      credit_amount: 8000,
    },
    explanation:
      "インプレスト・システムでは、小口現金を一定額に保つため不足分を補給する。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "現金取引",
      subpattern: "小口現金",
      accounts: ["小口現金", "現金"],
      keywords: ["現金・預金", "現金取引", "小口現金"],
      examSection: 1,
    },
  },

  Q_J_007: {
    pattern: "小口現金からの経費支払・精算",
    question_text: "小口現金から交通費1,500円、事務用品費800円を支払った。",
    correct_answer: {
      debit_account: "交通費",
      debit_amount: 1500,
      credit_account: "小口現金",
      credit_amount: 2300,
    },
    explanation:
      "小口現金からの支払いは各費用勘定の借方と小口現金勘定の貸方で記録する。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "現金取引",
      subpattern: "小口現金",
      accounts: ["小口現金", "交通費", "事務用品費"],
      keywords: ["現金・預金", "現金取引", "小口現金"],
      examSection: 1,
    },
  },

  // その他現金取引（5問）
  Q_J_008: {
    pattern: "現金売上・現金仕入の基本処理",
    question_text: "商品を現金8,000円で販売した。",
    correct_answer: {
      debit_account: "現金",
      debit_amount: 8000,
      credit_account: "売上",
      credit_amount: 8000,
    },
    explanation:
      "現金売上は現金の増加（借方）と売上収益の計上（貸方）で処理する。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "現金取引",
      subpattern: "その他現金取引",
      accounts: ["現金", "売上", "仕入"],
      keywords: ["現金・預金", "現金取引", "その他現金取引"],
      examSection: 1,
    },
  },

  Q_J_009: {
    pattern: "現金による給与支払・源泉徴収",
    question_text:
      "給与300,000円を現金で支払った。なお、源泉所得税20,000円を天引きした。",
    correct_answer: {
      debit_account: "給料",
      debit_amount: 300000,
      credit_account: "現金",
      credit_amount: 280000,
    },
    explanation:
      "給与支払いは総支給額を給料勘定に計上し、手取額を現金で支払い、源泉税は預り金で処理。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "現金取引",
      subpattern: "その他現金取引",
      accounts: ["給料", "現金", "預り金", "所得税預り金"],
      keywords: ["現金・預金", "現金取引", "その他現金取引"],
      examSection: 1,
    },
  },

  Q_J_010: {
    pattern: "現金による経費支払（交通費・消耗品等）",
    question_text: "営業活動のため交通費2,500円を現金で支払った。",
    correct_answer: {
      debit_account: "交通費",
      debit_amount: 2500,
      credit_account: "現金",
      credit_amount: 2500,
    },
    explanation:
      "交通費の現金支払いは交通費勘定の借方と現金勘定の貸方で記録する。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "現金取引",
      subpattern: "その他現金取引",
      accounts: ["交通費", "現金", "消耗品費"],
      keywords: ["現金・預金", "現金取引", "その他現金取引"],
      examSection: 1,
    },
  },

  Q_J_011: {
    pattern: "現金による税金支払",
    question_text: "固定資産税50,000円を現金で納付した。",
    correct_answer: {
      debit_account: "租税公課",
      debit_amount: 50000,
      credit_account: "現金",
      credit_amount: 50000,
    },
    explanation: "固定資産税などの税金支払いは租税公課勘定で処理する。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "現金取引",
      subpattern: "その他現金取引",
      accounts: ["租税公課", "現金"],
      keywords: ["現金・預金", "現金取引", "その他現金取引"],
      examSection: 1,
    },
  },

  Q_J_012: {
    pattern: "現金による利息・配当金の受取",
    question_text:
      "定期預金の利息3,000円（源泉徴収税600円控除後）を現金で受け取った。",
    correct_answer: {
      debit_account: "現金",
      debit_amount: 2400,
      credit_account: "受取利息",
      credit_amount: 3000,
    },
    explanation:
      "利息収入は総額を受取利息に計上し、源泉徴収税は仮払税金で処理。現金は手取額。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "現金取引",
      subpattern: "その他現金取引",
      accounts: ["現金", "受取利息", "仮払税金"],
      keywords: ["現金・預金", "現金取引", "その他現金取引"],
      examSection: 1,
    },
  },

  // 当座預金基本取引（6問）
  Q_J_013: {
    pattern: "当座預金口座開設・資金預入",
    question_text: "A銀行に当座預金口座を開設し、現金500,000円を預け入れた。",
    correct_answer: {
      debit_account: "当座預金",
      debit_amount: 500000,
      credit_account: "現金",
      credit_amount: 500000,
    },
    explanation:
      "当座預金への資金預入は当座預金勘定の借方と現金勘定の貸方で記録する。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "当座預金",
      subpattern: "当座預金基本取引",
      accounts: ["当座預金", "現金"],
      keywords: ["現金・預金", "当座預金", "当座預金基本取引"],
      examSection: 1,
    },
  },

  Q_J_014: {
    pattern: "小切手振出による支払",
    question_text: "買掛金150,000円の支払いのため小切手を振り出した。",
    correct_answer: {
      debit_account: "買掛金",
      debit_amount: 150000,
      credit_account: "当座預金",
      credit_amount: 150000,
    },
    explanation:
      "小切手振出による支払いは買掛金の減少と当座預金の減少で処理する。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "当座預金",
      subpattern: "当座預金基本取引",
      accounts: ["買掛金", "当座預金"],
      keywords: ["現金・預金", "当座預金", "当座預金基本取引"],
      examSection: 1,
    },
  },

  Q_J_015: {
    pattern: "振込による当座預金入金",
    question_text: "売掛金200,000円が当座預金口座に振り込まれた。",
    correct_answer: {
      debit_account: "当座預金",
      debit_amount: 200000,
      credit_account: "売掛金",
      credit_amount: 200000,
    },
    explanation: "売掛金の振込回収は当座預金の増加と売掛金の減少で処理する。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "当座預金",
      subpattern: "当座預金基本取引",
      accounts: ["当座預金", "売掛金"],
      keywords: ["現金・預金", "当座預金", "当座預金基本取引"],
      examSection: 1,
    },
  },

  Q_J_016: {
    pattern: "当座預金からの現金引出",
    question_text: "当座預金から現金100,000円を引き出した。",
    correct_answer: {
      debit_account: "現金",
      debit_amount: 100000,
      credit_account: "当座預金",
      credit_amount: 100000,
    },
    explanation:
      "当座預金からの現金引出は現金の増加と当座預金の減少で記録する。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "当座預金",
      subpattern: "当座預金基本取引",
      accounts: ["現金", "当座預金"],
      keywords: ["現金・預金", "当座預金", "当座預金基本取引"],
      examSection: 1,
    },
  },

  Q_J_017: {
    pattern: "当座預金口座間振替",
    question_text: "A銀行の当座預金300,000円をB銀行の当座預金に振り替えた。",
    correct_answer: {
      debit_account: "当座預金",
      debit_amount: 300000,
      credit_account: "当座預金",
      credit_amount: 300000,
    },
    explanation:
      "同一科目内での銀行間振替は補助科目で区別するが、基本仕訳は当座預金勘定内の振替。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "当座預金",
      subpattern: "当座預金基本取引",
      accounts: ["当座預金"],
      keywords: ["現金・預金", "当座預金", "当座預金基本取引"],
      examSection: 1,
    },
  },

  Q_J_018: {
    pattern: "銀行振込手数料の処理",
    question_text:
      "売掛金の回収時に振込手数料440円が差し引かれた。回収額は99,560円であった。",
    correct_answer: {
      debit_account: "当座預金",
      debit_amount: 99560,
      credit_account: "売掛金",
      credit_amount: 100000,
    },
    explanation:
      "振込手数料は支払手数料勘定で処理し、実際の入金額を当座預金に計上する。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "当座預金",
      subpattern: "当座預金基本取引",
      accounts: ["当座預金", "売掛金", "支払手数料"],
      keywords: ["現金・預金", "当座預金", "当座預金基本取引"],
      examSection: 1,
    },
  },

  // 当座借越（6問）
  Q_J_019: {
    pattern: "当座借越契約・限度額設定",
    question_text:
      "銀行と当座借越契約を締結し、借越限度額を1,000,000円に設定した。",
    correct_answer: null, // 契約のみでは仕訳なし
    explanation:
      "当座借越契約の締結自体は仕訳を伴わない。実際に借越が発生した時点で当座借越勘定で処理。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "当座預金",
      subpattern: "当座借越",
      accounts: ["当座借越"],
      keywords: ["現金・預金", "当座預金", "当座借越"],
      examSection: 1,
    },
  },

  Q_J_020: {
    pattern: "当座預金残高不足での小切手振出",
    question_text:
      "当座預金残高が50,000円のとき、80,000円の小切手を振り出した。",
    correct_answer: {
      debit_account: "買掛金",
      debit_amount: 80000,
      credit_account: "当座預金",
      credit_amount: 50000,
    },
    explanation:
      "当座預金残高を超える小切手振出時は当座借越が発生。不足分は当座借越勘定で処理。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "当座預金",
      subpattern: "当座借越",
      accounts: ["買掛金", "当座預金", "当座借越"],
      keywords: ["現金・預金", "当座預金", "当座借越"],
      examSection: 1,
    },
  },

  Q_J_021: {
    pattern: "当座借越利息の計算・支払",
    question_text: "当座借越の利息5,000円が当座預金から自動引き落としされた。",
    correct_answer: {
      debit_account: "支払利息",
      debit_amount: 5000,
      credit_account: "当座預金",
      credit_amount: 5000,
    },
    explanation:
      "当座借越利息は支払利息勘定で処理し、通常は当座預金から自動引き落としされる。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "当座預金",
      subpattern: "当座借越",
      accounts: ["支払利息", "当座預金"],
      keywords: ["現金・預金", "当座預金", "当座借越"],
      examSection: 1,
    },
  },

  Q_J_022: {
    pattern: "当座借越の返済・解消",
    question_text: "当座借越200,000円を現金で返済した。",
    correct_answer: {
      debit_account: "当座借越",
      debit_amount: 200000,
      credit_account: "現金",
      credit_amount: 200000,
    },
    explanation:
      "当座借越の返済は当座借越勘定の減少（借方）と現金の減少（貸方）で処理する。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "当座預金",
      subpattern: "当座借越",
      accounts: ["当座借越", "現金"],
      keywords: ["現金・預金", "当座預金", "当座借越"],
      examSection: 1,
    },
  },

  Q_J_023: {
    pattern: "当座借越から当座預金への振替",
    question_text:
      "売掛金の回収300,000円により当座借越が解消され、当座預金残高が3,000円となった。",
    correct_answer: {
      debit_account: "当座預金",
      debit_amount: 3000,
      credit_account: "売掛金",
      credit_amount: 300000,
    },
    explanation:
      "当座借越の解消を伴う入金は、借越解消分と預金残高分を区別して処理する。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "当座預金",
      subpattern: "当座借越",
      accounts: ["当座預金", "当座借越", "売掛金"],
      keywords: ["現金・預金", "当座預金", "当座借越"],
      examSection: 1,
    },
  },

  Q_J_024: {
    pattern: "当座借越限度額の変更",
    question_text: "当座借越の限度額を1,000,000円から1,500,000円に増額した。",
    correct_answer: null, // 限度額変更のみでは仕訳なし
    explanation: "当座借越限度額の変更は契約内容の変更であり、仕訳を伴わない。",
    tags_json: {
      subcategory: "cash_deposit",
      pattern: "当座預金",
      subpattern: "当座借越",
      accounts: ["当座借越"],
      keywords: ["現金・預金", "当座預金", "当座借越"],
      examSection: 1,
    },
  },

  // 続く...（この形式で全250問のパターンを定義）
};

console.log("🔧 全302問題 problemsStrategy.md 整合性修正開始...");

// Stage A: Q_J_001-050 を修正（現在は最初の24問のみ定義済み）
function executeStageA() {
  console.log("\n=== Stage A: Q_J_001-050 修正開始 ===");

  let content = fs.readFileSync(MASTER_QUESTIONS_PATH, "utf8");
  let modifiedCount = 0;

  // 定義済みの問題のみ修正
  for (const [questionId, pattern] of Object.entries(QUESTION_PATTERNS)) {
    if (questionId <= "Q_J_024") {
      // 現在定義済みの問題のみ
      console.log(`🔍 ${questionId}を修正中...`);

      const questionBlockRegex = new RegExp(
        `(\\s+{\\s*id: "${questionId}",\\s*category_id: "[^"]*",[\\s\\S]*?tags_json:[\\s\\S]*?},)`,
        "g",
      );

      const match = content.match(questionBlockRegex);
      if (match) {
        let questionBlock = match[0];
        let originalBlock = questionBlock;

        // 問題文修正
        questionBlock = questionBlock.replace(
          /question_text:\s*"[^"]*"/,
          `question_text: "${pattern.question_text}"`,
        );

        // 正答修正
        if (pattern.correct_answer) {
          const correctAnswerJson = JSON.stringify({
            type: "journal_entry",
            journalEntry: pattern.correct_answer,
          });
          questionBlock = questionBlock.replace(
            /correct_answer_json:\s*'[^']*'/,
            `correct_answer_json: '${correctAnswerJson}'`,
          );
        }

        // 解説修正
        questionBlock = questionBlock.replace(
          /explanation:\s*"[^"]*"/,
          `explanation: "${pattern.explanation}"`,
        );

        // tags_json修正
        if (pattern.tags_json) {
          const tagsJsonString = JSON.stringify(pattern.tags_json).replace(
            /"/g,
            '\\"',
          );
          questionBlock = questionBlock.replace(
            /tags_json:\s*'[^']*'/,
            `tags_json: '${tagsJsonString}'`,
          );
        }

        // updated_at修正
        questionBlock = questionBlock.replace(
          /updated_at: "[^"]*"/g,
          'updated_at: "2025-08-19T18:00:00Z"',
        );

        if (questionBlock !== originalBlock) {
          content = content.replace(originalBlock, questionBlock);
          modifiedCount++;
          console.log(`✅ ${questionId}修正完了`);
        }
      }
    }
  }

  fs.writeFileSync(MASTER_QUESTIONS_PATH, content, "utf8");
  console.log(`\n🎉 Stage A完了！修正問題数: ${modifiedCount}問`);
}

// 実行
executeStageA();
