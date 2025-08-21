# 2025-08-20 JSON形式エラー問題分析と修正計画

## 概要

簿記3級問題集アプリにおいて、250問の仕訳問題（Q_J_001-250）のうち74問しか読み込まれない重大な問題を発見。Phase 1-20の解説更新作業は正常に完了していたが、Q_J_075以降の複数仕訳問題のJSON形式エラーによりデータベース挿入が失敗していた。

## 問題の詳細

### 症状

- **期待値**: 250問の仕訳問題が学習画面に表示される
- **実際**: 74問のみ表示（Q_J_001-074まで）
- **影響**: 176問（Q_J_075-250）がアプリで利用不可

### 根本原因

Q_J_075以降の複数仕訳エントリを持つ問題で、`correct_answer_json`フィールドのJSON形式が不正。

#### 誤った形式（現在）

```json
{
  "journalEntry": {
    "debit_account": "売掛金",
    "debit_amount": 52000,
    "credit_account": "売上",
    "credit_amount": 50000
  },
  {
    "debit_account": "",
    "debit_amount": 0,
    "credit_account": "現金",
    "credit_amount": 2000
  }
}
```

この形式はJSONとして無効（オブジェクト内に複数のキーなしオブジェクトが存在）

#### 正しい形式（必要）

```json
[
  {
    "debit_account": "売掛金",
    "debit_amount": 52000,
    "credit_account": "売上",
    "credit_amount": 50000
  },
  {
    "debit_account": "",
    "debit_amount": 0,
    "credit_account": "現金",
    "credit_amount": 2000
  }
]
```

配列形式で複数の仕訳エントリを格納

### 影響を受ける問題のリスト

初期調査で確認された問題：

- Q_J_075: 商品売買（掛売上・現金値引）
- Q_J_076: 商品売買（複数取引）
- Q_J_077: 商品売買（複数取引）
- Q_J_097: 債権・債務（複数取引）
- Q_J_111: 債権・債務（複数取引）
- Q_J_116: 債権・債務（複数取引）

※完全なリストは修正スクリプト実行時に特定予定

## 問題発生の経緯

### タイムライン

1. **2025-08-19**: Phase 1-20完了、226問の解説更新をコミット（aa2287d）
2. **2025-08-20 AM**: アプリで74問しか表示されない問題を発見
3. **初期仮説**: キャッシュ問題またはマイグレーションバージョンの問題と推測
4. **調査結果**: JSON形式エラーがデータベース挿入を阻害していることが判明
5. **検証**: コミットaa2287dでも同じ問題が存在することを確認

### なぜ発見が遅れたか

- Phase 1-20の作業は`master-questions.ts`ファイルの更新のみに焦点を当てていた
- データベースへの実際の挿入テストが各フェーズ完了時に実施されていなかった
- ログには「302問を読み込み」と表示されるが、実際にはQ_J_075でエラーが発生し残りがスキップされていた

## 修正戦略

### 1. 問題の特定とリストアップ

```bash
# 複数仕訳パターンを持つ全問題を特定
grep -n '"journalEntry":' src/data/master-questions.ts | \
  grep -v '^\[' | \
  head -20
```

### 2. JSON形式の修正ルール

#### パターンA: 単一仕訳（変更不要）

```javascript
correct_answer_json: JSON.stringify({
  debit_account: "現金",
  debit_amount: 100000,
  credit_account: "売上",
  credit_amount: 100000,
});
```

#### パターンB: 複数仕訳（要修正）

```javascript
// 修正前
correct_answer_json: '{"journalEntry":{...},{...}}';

// 修正後
correct_answer_json: JSON.stringify([
  {
    debit_account: "売掛金",
    debit_amount: 52000,
    credit_account: "売上",
    credit_amount: 50000,
  },
  {
    debit_account: "",
    debit_amount: 0,
    credit_account: "現金",
    credit_amount: 2000,
  },
]);
```

### 3. problemsStrategy.mdとの整合性確保

修正時に以下を確認：

- 勘定科目名が`problemsStrategy.md`で定義された標準名称と一致
- 金額計算ロジックが問題文と整合
- 解説内容が修正後の正答と一致

### 4. 修正スクリプトの作成

```javascript
// scripts/fixes/fix-multiple-journal-entries.js
const fs = require("fs");
const path = require("path");

function fixMultipleJournalEntries() {
  const filePath = path.join(__dirname, "../../src/data/master-questions.ts");
  let content = fs.readFileSync(filePath, "utf8");

  // パターン: {"journalEntry":{...},{...}}
  const pattern = /correct_answer_json:\s*'(\{"journalEntry":[^']+)'/g;

  let fixedCount = 0;
  content = content.replace(pattern, (match, jsonStr) => {
    // JSONパース試行
    try {
      // 不正な形式を配列に変換
      const fixed = convertToArrayFormat(jsonStr);
      fixedCount++;
      return `correct_answer_json: '${fixed}'`;
    } catch (e) {
      console.error(`Failed to fix: ${match.substring(0, 100)}...`);
      return match;
    }
  });

  console.log(`Fixed ${fixedCount} entries`);
  fs.writeFileSync(filePath, content);
}
```

### 5. 実装手順

1. **バックアップ作成**

   ```bash
   cp src/data/master-questions.ts src/data/master-questions.ts.backup-$(date +%s)
   ```

2. **修正スクリプト実行**

   ```bash
   node scripts/fixes/fix-multiple-journal-entries.js
   ```

3. **形式検証**

   ```bash
   node scripts/testing/validate-json-format.js
   ```

4. **データベース更新**
   - `SAMPLE_DATA_VERSION`を更新
   - `forceUpdate = true`を一時的に設定
   - アプリ起動して250問読み込み確認
   - `forceUpdate = false`に戻す

5. **動作確認**
   - 学習画面で250問表示を確認
   - 複数仕訳問題の解答フローを確認
   - 採点ロジックの正常動作を確認

## リスク評価と緩和策

### リスク

1. **データ損失**: ユーザーの学習履歴が削除される可能性
   - 緩和策: `forceUpdate`を最小限の時間のみ有効化

2. **採点ロジックの非互換**: 配列形式への変更で既存コードが動作しない可能性
   - 緩和策: answer-service.tsの採点ロジックを事前確認

3. **problemsStrategy.md非準拠**: 勘定科目名や金額が戦略と異なる
   - 緩和策: 修正前に全問題をproblemStrategy.mdと照合

## 成功基準

- [ ] 250問全てがデータベースに正常に挿入される
- [ ] 学習画面に「仕訳問題 (250問)」と表示される
- [ ] 複数仕訳問題（Q_J_075等）が正常に表示・解答・採点される
- [ ] problemsStrategy.mdとの整合性が保たれる
- [ ] ユーザーデータ（学習履歴・復習項目）が保護される

## 次のアクション

1. このドキュメントのレビューと承認
2. 修正スクリプトの作成と実行
3. 250問の正常読み込み確認
4. 複数仕訳問題の動作テスト
5. 最終確認とコミット

## 関連ドキュメント

- [2025-08-19 Q_J_025-250 個別修正ログ](./2025-08-19-Q_J_025-250-individual-fixes.md)
- [problemsStrategy.md](../product/problemsStrategy.md)
- [データベーススキーマ](../engineering/database-schema.md)

## 作業者

- 分析: Claude Code
- 日時: 2025-08-20
- 状態: 分析完了、修正計画策定済み
