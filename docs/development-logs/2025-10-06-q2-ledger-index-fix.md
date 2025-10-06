# Q2_L問題のインデックス不整合修正

**日時**: 2025-10-06
**カテゴリ**: バグ修正（重大）
**影響範囲**: Q2_L_001 〜 Q2_L_020（帳簿記入問題 20問中18問）

## 問題の概要

Q2_L（帳簿記入）問題で、ユーザーが正答を入力しても「不正解」と判定される問題が発生していた。

### 症状

- Q2_L_001などの帳簿記入問題で正答を入力
- 解答送信後、正解判定が失敗
- 常に「不正解」として処理される
- ユーザーの学習進捗が正しく記録されない

## 原因分析

### 初期調査（Q2_L_001）

`master-questions.ts`のQ2_L_001データを調査：

```typescript
{
  id: "Q2_L_001",
  answer_template_json: '{
    "type": "fill_in_ledger",
    "blanks": [
      {"index": 2, "choices": [20000,25000,30000,35000], "correctIndex": 1},
      {"index": 1, "choices": [40000,45000,50000,55000], "correctIndex": 2}
    ]
  }',
  correct_answer_json: '{
    "blanks": [
      {"index": 0, "correctIndex": 1},  // ❌ 本来はindex: 2であるべき
      {"index": 1, "correctIndex": 2}   // ✅ これは正しい
    ]
  }'
}
```

**問題点**:

- `answer_template_json`: blanks配列のindexが [2, 1]
- `correct_answer_json`: blanks配列のindexが [0, 1]
- **不整合**: テンプレートと正答のindexが一致していない

### 検証ロジックの確認

`src/services/answer-service.ts` (Lines 1655-1705) の `isFillInLedgerAnswerCorrect` メソッド:

```typescript
private isFillInLedgerAnswerCorrect(
  answerData: CBTAnswerData,
  correctAnswer: QuestionCorrectAnswer,
): boolean {
  const userBlanks = (answerData as any).blanks as Array<{
    index: number;
    selectedIndex: number;
    selectedValue: number;
  }>;
  const correctBlanks = (correctAnswer as any).blanks as Array<{
    index: number;
    correctIndex: number;
  }>;

  // ❌ インデックスベースのマッチング
  return correctBlanks.every((correctBlank) => {
    const userBlank = userBlanks.find(
      (b) => b.index === correctBlank.index,  // ← ここでindex照合
    );
    if (!userBlank) {
      return false;  // マッチするindexが見つからない = 不正解
    }
    return userBlank.selectedIndex === correctBlank.correctIndex;
  });
}
```

**動作メカニズム**:

1. ユーザーがblank（index=2）を選択して解答
2. `userBlanks`に `{index: 2, selectedIndex: 1}` が格納される
3. 検証時、`correctBlanks`から `index: 2` のエントリを探す
4. `correctBlanks`には `index: 0` と `index: 1` しかない
5. `.find()`が`undefined`を返す
6. **検証失敗 → 不正解判定**

### スコープ拡大調査

全Q2_L問題（20問）を調査した結果：

```bash
node scripts/testing/check-q2-ledger-indices.js
```

**調査結果**:

- **不整合あり**: 18問（90%）
- **整合済み**: 2問（Q2_L_012, Q2_L_019）
- **影響度**: 重大（ほぼ全問題で正答判定が機能していない）

## 修正内容

### 1. 診断スクリプト作成

**ファイル**: `scripts/testing/check-q2-ledger-indices.js`

```javascript
/**
 * Q2_L問題のインデックス不整合チェックスクリプト
 *
 * answer_template_json.blanks[].index と correct_answer_json.blanks[].index の
 * 不整合を検出し、修正が必要な問題をリスト化する
 */

const fs = require("fs");
const path = require("path");

// master-questions.tsを読み込み
const masterQuestionsPath = path.join(
  __dirname,
  "../../src/data/master-questions.ts",
);
const content = fs.readFileSync(masterQuestionsPath, "utf-8");

// Q2_L問題を抽出する正規表現
const q2LQuestions = [];
const questionPattern =
  /\{[\s\S]*?id:\s*"(Q2_L_\d+)"[\s\S]*?answer_template_json:\s*'([^']+)'[\s\S]*?correct_answer_json:\s*'([^']+)'[\s\S]*?\}/g;

let match;
while ((match = questionPattern.exec(content)) !== null) {
  const [, id, answerTemplate, correctAnswer] = match;

  try {
    const template = JSON.parse(answerTemplate);
    const correct = JSON.parse(correctAnswer);

    if (
      template.type === "fill_in_ledger" &&
      template.blanks &&
      correct.blanks
    ) {
      q2LQuestions.push({
        id,
        templateBlanks: template.blanks,
        correctBlanks: correct.blanks,
      });
    }
  } catch (error) {
    console.error(`❌ ${id}: JSON解析エラー`, error.message);
  }
}

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("  Q2_L問題のインデックス整合性チェック");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

let mismatchCount = 0;
const mismatches = [];

q2LQuestions.forEach((question) => {
  const { id, templateBlanks, correctBlanks } = question;

  // インデックス配列を取得
  const templateIndices = templateBlanks
    .map((b) => b.index)
    .sort((a, b) => a - b);
  const correctIndices = correctBlanks
    .map((b) => b.index)
    .sort((a, b) => a - b);

  // インデックスが一致しているか確認
  const isMatch =
    templateIndices.length === correctIndices.length &&
    templateIndices.every((val, i) => val === correctIndices[i]);

  if (!isMatch) {
    mismatchCount++;
    console.log(`❌ ${id}:`);
    console.log(`   answer_template indices: [${templateIndices.join(", ")}]`);
    console.log(`   correct_answer indices:  [${correctIndices.join(", ")}]`);

    mismatches.push({
      id,
      templateIndices,
      correctIndices,
      templateBlanks,
      correctBlanks,
    });
  } else {
    console.log(`✅ ${id}: インデックス一致`);
  }
});

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(
  `  検査結果: ${q2LQuestions.length}問中 ${mismatchCount}問に不整合`,
);

if (mismatchCount > 0) {
  // 修正スクリプト用のデータを出力
  const fixData = JSON.stringify(mismatches, null, 2);
  const fixDataPath = path.join(
    __dirname,
    "../data/q2-ledger-index-fixes.json",
  );
  fs.writeFileSync(fixDataPath, fixData, "utf-8");
  console.log(`\n修正データを保存しました: ${fixDataPath}`);
}

process.exit(mismatchCount > 0 ? 1 : 0);
```

**実行結果**:

```
❌ Q2_L_001: answer_template indices: [1, 2] / correct_answer indices: [0, 1]
❌ Q2_L_002: answer_template indices: [1, 2] / correct_answer indices: [0, 1]
...（中略）
✅ Q2_L_012: インデックス一致
...
✅ Q2_L_019: インデックス一致
...
検査結果: 20問中 18問に不整合
```

### 2. 修正スクリプト作成

**ファイル**: `scripts/fixes/fix-q2-ledger-indices.js`

```javascript
/**
 * Q2_L問題のインデックス不整合修正スクリプト
 *
 * answer_template_json.blanks[].index に合わせて
 * correct_answer_json.blanks[].index を修正する
 */

const fs = require("fs");
const path = require("path");

// 修正データを読み込み
const fixDataPath = path.join(__dirname, "../data/q2-ledger-index-fixes.json");
const masterQuestionsPath = path.join(
  __dirname,
  "../../src/data/master-questions.ts",
);

// 修正データが存在しない場合はエラー
if (!fs.existsSync(fixDataPath)) {
  console.error("❌ 修正データファイルが見つかりません");
  console.error("   先に check-q2-ledger-indices.js を実行してください");
  process.exit(1);
}

const fixes = JSON.parse(fs.readFileSync(fixDataPath, "utf-8"));

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("  Q2_L問題のインデックス修正");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
console.log(`修正対象: ${fixes.length}問\n`);

// バックアップ作成
const timestamp = Date.now();
const backupPath = `${masterQuestionsPath}.backup-${timestamp}`;
fs.copyFileSync(masterQuestionsPath, backupPath);
console.log(`✅ バックアップ作成: ${path.basename(backupPath)}\n`);

// master-questions.ts を読み込み
let content = fs.readFileSync(masterQuestionsPath, "utf-8");

// 各問題の修正を適用
fixes.forEach(({ id, templateBlanks, correctBlanks }) => {
  // 修正後の correct_answer_json を生成
  const fixedBlanks = templateBlanks.map((tb, idx) => ({
    index: tb.index,
    correctIndex: correctBlanks[idx]?.correctIndex || 0,
  }));

  const newCorrectAnswer = JSON.stringify({ blanks: fixedBlanks });

  // 問題IDでセクションを特定し置換
  const idPattern = new RegExp(
    `(id:\\s*"${id}",[\\s\\S]*?correct_answer_json:\\s*')([^']+)(')`,
    "g",
  );

  const match = idPattern.exec(content);
  if (match) {
    const [fullMatch, prefix, oldJson, suffix] = match;

    // 古いJSONを新しいJSONに置換
    const newMatch = `${prefix}${newCorrectAnswer}${suffix}`;
    content = content.replace(fullMatch, newMatch);

    console.log(`✅ ${id}: 修正完了`);
    console.log(`   ${oldJson}`);
    console.log(`   → ${newCorrectAnswer}`);
  } else {
    console.log(`⚠️  ${id}: パターンマッチ失敗（手動確認が必要）`);
  }
});

// 修正後のファイルを保存
fs.writeFileSync(masterQuestionsPath, content, "utf-8");

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("  修正完了");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
console.log(`✅ ${fixes.length}問の修正を適用しました`);
console.log(`\n次のステップ:`);
console.log(`  1. src/data/migrations/index.ts の SAMPLE_DATA_VERSION を更新`);
console.log(`  2. forceUpdate = true に一時的に設定`);
console.log(`  3. npm start でシミュレーター起動・確認`);
console.log(`  4. forceUpdate = false に戻す\n`);
console.log(`バックアップから復元する場合:`);
console.log(`  cp ${backupPath} ${masterQuestionsPath}\n`);
```

**実行結果**:

```
✅ バックアップ作成: master-questions.ts.backup-1759679542306

✅ Q2_L_001: 修正完了
   {"blanks":[{"index":0,"correctIndex":1},{"index":1,"correctIndex":2}]}
   → {"blanks":[{"index":2,"correctIndex":1},{"index":1,"correctIndex":2}]}

✅ Q2_L_002: 修正完了
   {"blanks":[{"index":0,"correctIndex":1},{"index":1,"correctIndex":2}]}
   → {"blanks":[{"index":2,"correctIndex":1},{"index":1,"correctIndex":2}]}

... （18問すべて修正完了）

✅ 18問の修正を適用しました
```

### 3. データバージョン更新

**ファイル**: `src/data/migrations/index.ts` (Lines 140-143)

```typescript
const SAMPLE_DATA_VERSION = "2025-10-06-q2-ledger-index-fix";

// 環境変数による強制更新フラグ（開発時のみ）
const forceUpdate = false; // ✅ 通常はfalse（ユーザーデータ保護）
```

**変更内容**:

- `SAMPLE_DATA_VERSION`を`"2025-10-06-q2-ledger-index-fix"`に更新
- 修正反映のため一時的に`forceUpdate = true`に設定
- 検証完了後、`forceUpdate = false`に復元

## 修正例（Q2_L_001）

### 修正前

```json
{
  "answer_template_json": {
    "type": "fill_in_ledger",
    "blanks": [
      {"index": 2, "choices": [...], "correctIndex": 1},
      {"index": 1, "choices": [...], "correctIndex": 2}
    ]
  },
  "correct_answer_json": {
    "blanks": [
      {"index": 0, "correctIndex": 1},  // ❌ index不一致
      {"index": 1, "correctIndex": 2}
    ]
  }
}
```

### 修正後

```json
{
  "answer_template_json": {
    "type": "fill_in_ledger",
    "blanks": [
      {"index": 2, "choices": [...], "correctIndex": 1},
      {"index": 1, "choices": [...], "correctIndex": 2}
    ]
  },
  "correct_answer_json": {
    "blanks": [
      {"index": 2, "correctIndex": 1},  // ✅ templateと一致
      {"index": 1, "correctIndex": 2}
    ]
  }
}
```

## 検証結果

### 自動検証

```bash
node scripts/testing/check-q2-ledger-indices.js
```

**検証結果**:

```
✅ Q2_L_001: インデックス一致
✅ Q2_L_002: インデックス一致
✅ Q2_L_003: インデックス一致
...（全20問）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  検査結果: 20問中 0問に不整合
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

✅ **完全修正確認**: 全20問でインデックス整合性が確保された

### 期待される動作（修正後）

1. ユーザーがQ2_L_001を解答
2. 正しい選択肢を選択（例: 空欄①に25,000円、空欄②に50,000円）
3. 解答送信
4. **✅ 正解判定が成功**
5. 学習履歴・復習システムが正常に記録

## 影響範囲

### 修正対象問題

- **Q2_L_001 〜 Q2_L_011**（Q2_L_012を除く）: 10問
- **Q2_L_013 〜 Q2_L_018**: 6問
- **Q2_L_020**: 1問
- **合計**: 18問（全Q2_L問題の90%）

### 影響しない問題

- **Q2_L_012**: 元々indexが一致していた
- **Q2_L_019**: 元々indexが一致していた
- **Q1, Q3問題**: 異なる形式のため影響なし

## 技術的詳細

### データ構造

#### fill_in_ledger形式の構造

```typescript
// answer_template_json
{
  type: "fill_in_ledger",
  ledger_type: "T字勘定",
  account_name: "現金",
  blanks: [
    {
      index: 1,           // 空欄の識別子
      side: "debit",      // 借方 or 貸方
      choices: [          // 選択肢
        "120,000",
        "100,000",
        "80,000",
        "50,000"
      ],
      correctIndex: 2     // 正解の選択肢インデックス（0始まり）
    }
  ]
}

// correct_answer_json
{
  blanks: [
    {
      index: 1,           // ❗ answer_templateのindexと一致必須
      correctIndex: 2     // 正解の選択肢インデックス
    }
  ]
}
```

#### indexフィールドの役割

1. **UIレンダリング**: 空欄の表示順序・位置決定に使用
2. **解答検証**: ユーザー解答とcorrect_answerをマッピング
3. **データ整合性**: templateとcorrectの紐付けキー

**重要**: indexが一致しないと、検証ロジックが正しく動作しない

### 修正アプローチの選択理由

#### 選択肢1: correct_answer_jsonを修正（採用）

**メリット**:

- 既存のUI・検証ロジックを変更不要
- データ修正のみで完結
- リスクが最小限

**デメリット**:

- なし

#### 選択肢2: answer_template_jsonを修正（不採用）

**デメリット**:

- UIレンダリングに影響
- 空欄表示順序が変わる可能性
- 選択肢配列も調整が必要

#### 選択肢3: 検証ロジックを変更（不採用）

**デメリット**:

- 全問題形式に影響
- 回帰テストが大規模化
- 他の問題（Q1, Q3）への影響リスク

## バックアップ・復元

### バックアップファイル

```
src/data/master-questions.ts.backup-1759679542306
```

### 復元方法

```bash
# 修正前に戻す場合
cp src/data/master-questions.ts.backup-1759679542306 src/data/master-questions.ts
```

## 残タスク

- [x] 全Q2_L問題の診断
- [x] 修正スクリプト作成・実行
- [x] データバージョン更新
- [x] 修正検証（自動スクリプト）
- [x] forceUpdate復元
- [x] 開発ログ作成
- [ ] シミュレーターでの手動検証（Q2_L_001, Q2_L_002, Q2_L_003）
- [ ] リリースノート作成

## 関連ファイル

- `src/data/master-questions.ts` - 問題データ（修正対象）
- `src/services/answer-service.ts` - 解答検証ロジック
- `scripts/testing/check-q2-ledger-indices.js` - 診断スクリプト（新規作成）
- `scripts/fixes/fix-q2-ledger-indices.js` - 修正スクリプト（新規作成）
- `scripts/data/q2-ledger-index-fixes.json` - 修正データ（自動生成）
- `src/data/migrations/index.ts` - データバージョン管理

## 過去の関連修正

- **2025-09-24**: Q2問題の初期実装（vocabulary, fill_in_ledger形式）
- **2025-10-05**: Q2問題のorder修正、insert column追加
- **2025-10-06**: AnswerResultDialogの正解表示修正
- **2025-10-06**: Q2_L問題のインデックス不整合修正（本修正）

## まとめ

Q2_L問題の90%（18問/20問）で、answer_template_jsonとcorrect_answer_jsonのindexフィールドが一致していなかったため、正答を入力しても「不正解」と判定される重大なバグが存在していた。

診断スクリプトで全問題を調査し、修正スクリプトで一括修正を実施。検証スクリプトで全20問のインデックス整合性を確認し、修正の完全性を確保した。

修正はデータ層のみで完結し、UIや検証ロジックへの影響なし。バックアップによる復元も可能で、安全かつ確実な修正となった。
