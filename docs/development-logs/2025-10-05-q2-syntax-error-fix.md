# Q2問題の構文エラー修正・問題タイプ表示改善 - 開発ログ

**日時**: 2025年10月5日
**作業者**: Claude Code
**カテゴリ**: データ修正・バグ修正・UI改善

## 問題の概要

### 問題1: 第2問（Q2）の問題が60問しか表示されない

第2問（Q2）の問題一覧で、本来70問あるはずが60問しか表示されず、`Q2_V_011`〜`Q2_V_013`（3問）と`Q2_V_021`〜`Q2_V_022`（2問）など、合計10問がスキップされる問題が発生していた。

#### 症状

- **期待される問題数**: 70問
- **実際の表示問題数**: 60問
- **不足問題**: 10問（Q2_V_011-013、Q2_V_021-022など）
- **発生環境**: iOSシミュレーター（iPhone 16 Pro）

### 問題2: 全ての問題が「仕訳」と表示される

問題回答画面で、全ての問題が「仕訳」カテゴリとして表示され、実際の問題タイプ（用語問題、勘定記入問題など）が正しく表示されない問題があった。

#### 症状

- **期待される表示**: 問題タイプに応じた表示（例: 「用語問題」「勘定記入問題」「補助簿記入問題」）
- **実際の表示**: すべて「仕訳」または「帳簿」などのカテゴリレベルの表示のみ
- **影響範囲**: 全問題（370問）

## 原因分析

### 問題1の原因: 大量の余分なカンマ（359個）

`src/data/master-questions.ts`に**359個**の余分なカンマのみの行が存在し、JavaScript配列の要素として`undefined`が挿入されていた。

```typescript
// 問題の箇所（修正前）
    question_type: "vocabulary",
  },
  ,  // ← この余分なカンマが原因（全体で359箇所存在）
  {
    id: "Q2_V_011",
```

**配列状態の詳細:**

- **期待**: 370個の問題オブジェクト
- **実際**: 370個の問題オブジェクト + 359個の`undefined`要素 = 729要素
- **データベース挿入**: `undefined`要素でエラーが発生し、挿入がスキップされた

**検証コマンド結果:**

```bash
$ grep -c "^  ,$" src/data/master-questions.ts
359  # 余分なカンマが359行存在

$ grep -c "^  {$" src/data/master-questions.ts
370  # 問題オブジェクトは370個
```

### 問題2の原因: 問題タイプ抽出ロジックの欠如

`src/hooks/useQuestionNavigation.ts`の`getCategoryName()`関数が、`answer_template_json`から具体的な問題タイプを抽出せず、カテゴリレベルの名称のみを返していた。

**修正前のロジック:**

```typescript
const getCategoryName = () => {
  switch (category) {
    case "journal":
      return "仕訳";
    case "ledger":
      return "帳簿";
    case "trial_balance":
      return "試算表";
  }
};
```

**問題点:**

- Q2（帳簿）カテゴリ内の全70問が「帳簿」と表示される
- 実際には`vocabulary`（用語問題）、`fill_in_ledger`（勘定記入問題）、`auxiliary_book`（補助簿記入問題）の3種類が存在

## 修正内容

### 修正1: 359個の余分なカンマ削除

**ファイル**: `src/data/master-questions.ts`
**修正方法**: `sed`コマンドで全てのカンマのみの行を一括削除

```bash
sed -i '' '/^  ,$/d' src/data/master-questions.ts
```

**修正結果:**

```bash
$ grep -c "^  ,$" src/data/master-questions.ts
0  # 余分なカンマが0個（完全削除）
```

**データベース読み込みログ（修正後）:**

```
LOG  [DEBUG] master-questions インポート成功, 問題数: 370
LOG  [DEBUG] 配列チェック: length= 370 undefined要素= 0
LOG  [DEBUG] カテゴリ別問題数: {"journal": 250, "ledger": 70, "trial_balance": 50}
LOG  [DEBUG] ledgerカテゴリ: 70問  ← 修正前は60問
```

### 修正2: 問題タイプ表示ロジックの実装

**ファイル**: `src/hooks/useQuestionNavigation.ts`

**変更内容:**

1. **Question型にanswer_template_jsonフィールドを追加**

```typescript
interface Question {
  id: string;
  category_id: string;
  question_text: string;
  explanation: string;
  difficulty: number;
  answer_template_json?: string; // ← 追加
}
```

2. **問題タイプ抽出関数を追加**

```typescript
const getQuestionType = (question: Question | null): string | null => {
  if (!question?.answer_template_json) return null;

  try {
    const template = JSON.parse(question.answer_template_json);
    return template.type || null;
  } catch {
    return null;
  }
};
```

3. **問題タイプ→日本語マッピング関数を追加**

```typescript
const getQuestionTypeLabel = (
  questionType: string | null,
  category: string,
): string => {
  const typeMapping: { [key: string]: string } = {
    // Q1 (仕訳問題)
    journal_entry: "仕訳問題",
    compound_journal_entry: "複合仕訳問題",

    // Q2 (帳簿問題)
    vocabulary: "用語問題",
    fill_in_ledger: "勘定記入問題",
    auxiliary_book: "補助簿記入問題",
    ledger_account: "勘定記入問題",
    subsidiary_book: "補助簿問題",
    ledger_entry: "帳簿記入問題",

    // Q3 (試算表問題)
    trial_balance: "試算表作成問題",
    fill_in_trial_balance: "試算表穴埋め問題",
    fill_in_comprehensive_trial_balance: "精算表穴埋め問題",
    fill_in_financial_statement: "財務諸表穴埋め問題",
    financial_statement: "財務諸表問題",

    // その他
    voucher_entry: "伝票問題",
    single_choice: "選択問題",
    multiple_choice: "複数選択問題",
  };

  return typeMapping[questionType] || questionType;
};
```

4. **getCategoryName()を拡張**

```typescript
const getCategoryName = useCallback(() => {
  const questionType = getQuestionType(currentQuestion);
  return getQuestionTypeLabel(questionType, category);
}, [category, currentQuestion]);
```

### 修正3: データバージョンの更新と復元

**ファイル**: `src/data/migrations/index.ts`

**変更履歴:**

1. データバージョン更新

   ```typescript
   const SAMPLE_DATA_VERSION = "2025-10-05-fix-trailing-commas";
   ```

2. 一時的な強制更新有効化

   ```typescript
   const forceUpdate = true; // 修正確認のため一時的にtrue
   ```

3. 修正確認後の復元
   ```typescript
   const forceUpdate = false; // ユーザーデータ保護のためfalseに復元
   ```

## 実施した作業手順

1. ✅ 余分なカンマの検出（`grep -c "^  ,$"`で359個確認）
2. ✅ `sed`コマンドで全ての余分なカンマを一括削除
3. ✅ `useQuestionNavigation.ts`に問題タイプ抽出・マッピングロジックを追加
4. ✅ `SAMPLE_DATA_VERSION`を更新
5. ✅ `forceUpdate = true`に設定（一時的）
6. ✅ アプリの再ビルドと再インストール
7. ✅ iOSシミュレーターでの動作確認（70問表示、タイプ表示）
8. ✅ `forceUpdate = false`に復元
9. ✅ 本ドキュメントの作成

## 影響範囲

### 修正前

- **Q2表示される問題**: 60問（10問不足）
- **問題タイプ表示**: 全問「帳簿」と表示
- **ユーザー影響**: 学習者が10問分の練習機会を失い、問題タイプが区別できない

### 修正後

- **Q2表示される問題**: 70問（全問正常）
- **問題タイプ表示**:
  - 用語問題（30問）→「用語問題」
  - 勘定記入問題（20問）→「勘定記入問題」
  - 補助簿記入問題（20問）→「補助簿記入問題」
- **ユーザー影響**: なし

## 問題タイプの分類（修正後）

### Q2（帳簿）の問題タイプ内訳

| 問題タイプ     | 問題数   | 表示名         |
| -------------- | -------- | -------------- |
| vocabulary     | 30問     | 用語問題       |
| fill_in_ledger | 20問     | 勘定記入問題   |
| auxiliary_book | 20問     | 補助簿記入問題 |
| **合計**       | **70問** | -              |

### 全カテゴリの問題タイプ

| カテゴリ     | 主要タイプ                          | 表示名           |
| ------------ | ----------------------------------- | ---------------- |
| Q1（仕訳）   | journal_entry                       | 仕訳問題         |
|              | compound_journal_entry              | 複合仕訳問題     |
| Q2（帳簿）   | vocabulary                          | 用語問題         |
|              | fill_in_ledger                      | 勘定記入問題     |
|              | auxiliary_book                      | 補助簿記入問題   |
| Q3（試算表） | trial_balance                       | 試算表作成問題   |
|              | fill_in_trial_balance               | 試算表穴埋め問題 |
|              | fill_in_comprehensive_trial_balance | 精算表穴埋め問題 |

## 再発防止策

### 推奨される対策

1. **ESLint/Prettierの設定強化**
   - 配列内の余分なカンマを自動検出・削除
   - コミット前の自動フォーマット実行
   - Pre-commitフックで`grep -c "^  ,$"`を実行

2. **データ整合性チェックの追加**
   - `scripts/testing/validate-all-answers-v2.js`に問題数チェックを追加
   - 期待問題数とのバリデーション（Q2=70問など）
   - CI/CDパイプラインでの自動検証

3. **TypeScript strictモードの活用**
   - 配列定義時の型チェック強化
   - 構文エラーの早期検出
   - `undefined`要素の検出

4. **定期的なコードレビュー**
   - master-questions.tsの変更は複数人でレビュー
   - データ構造の一貫性チェック

## テスト結果

### 自動テスト

- ✅ `npm run check:quick`: PASS
- ✅ ESLint: エラーなし
- ✅ TypeScript: コンパイル成功（型エラーなし）
- ✅ 配列要素数: 370問（undefined要素0個）

### 手動テスト

- ✅ iOSシミュレーター: Q2が70問すべて表示
- ✅ 問題順序: `section_number` → `question_order`順に正常表示
- ✅ 問題タイプ表示: 用語問題、勘定記入問題、補助簿記入問題が正しく表示
- ✅ 学習履歴: 既存データ保持（forceUpdate=false復元後）

## 関連ファイル

### 修正したファイル

- `src/data/master-questions.ts` - 359個の余分なカンマを削除
- `src/hooks/useQuestionNavigation.ts` - 問題タイプ表示ロジックを追加
- `src/data/migrations/index.ts` - データバージョン管理とforceUpdate制御

### 関連スクリプト

- `scripts/testing/validate-all-answers-v2.js` - 全問題正答検証
- `scripts/fixes/add-q2-structure-fields.js` - Q2問題構造フィールド追加

## データバージョン履歴

- `2025-08-17-description` - 問題説明文更新
- `2025-10-05-q2-structure-fix` - section_number/question_order追加
- `2025-10-05-fix-trailing-commas` - **359個の余分なカンマを削除（今回）**

## 承認・レビュー

- [x] コード修正完了（2ファイル）
- [x] 動作検証完了（70問表示、タイプ表示）
- [x] ドキュメント更新完了
- [x] forceUpdate復元完了
- [x] TypeScriptエラー解消確認

---

**作業完了日時**: 2025年10月5日
**ステータス**: ✅ 完了
**修正規模**:

- master-questions.ts: 359行削除
- useQuestionNavigation.ts: 60行追加
- migrations/index.ts: 1行変更
