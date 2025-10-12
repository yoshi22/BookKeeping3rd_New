# Q_J_018 正解表示問題の修正（Phase 7）

**日時**: 2025-10-12
**問題**: Q_J_018（複合仕訳問題）で正解が表示されない
**ステータス**: ✅ 解決

---

## 📋 問題の概要

### 症状

- Q_J_018で解答送信後、正解表示画面に「📝 正解例」のヘッダーのみ表示され、借方・貸方の勘定科目と金額が表示されない
- 正解データは存在するが、UIに反映されていない

### 影響範囲

- Q_J_018およびその他の`journalEntry`配列形式を使用する複合仕訳問題（20問）

---

## 🔍 根本原因の特定

### データ構造の確認

Q_J_018のデータ構造（master-questions.ts:290-291）:

```typescript
correct_answer_json:
  '{"type":"journal_entry","journalEntry":[
    {"debit_account":"当座預金","debit_amount":99560,"credit_account":"","credit_amount":0},
    {"debit_account":"支払手数料","debit_amount":440,"credit_account":"","credit_amount":0},
    {"debit_account":"","debit_amount":0,"credit_account":"売掛金","credit_amount":100000}
  ]}'
```

**重要な発見**: `journalEntry`（単数形）というキーで配列が格納されている

### コンポーネント層の問題

#### 1. CorrectAnswerExample.tsx

- `journalEntries`（複数形）のみをチェック
- `journalEntry`が配列の場合を想定していなかった

#### 2. AnswerResultDialog.tsx (formatCorrectAnswer関数)

```typescript
// 旧コード（67-78行目）
if (correctAnswer.journalEntry) {
  return {
    journalEntries: [
      {
        debit_account: correctAnswer.journalEntry.debit_account,  // ❌ 配列を単一オブジェクトとして処理
        ...
      },
    ],
  };
}
```

**問題点**: `correctAnswer.journalEntry`が配列の場合、`correctAnswer.journalEntry.debit_account`は`undefined`となり、正しく変換されない

---

## 🛠️ 実施した修正

### 修正1: CorrectAnswerExample.tsx

**ファイル**: `src/components/CorrectAnswerExample.tsx`
**修正箇所**: 41-65行目

```typescript
// 修正後
const renderJournalExample = () => {
  // 複合仕訳の配列を取得（journalEntries または journalEntry が配列の場合）
  const journalArray =
    correctAnswer.journalEntries && Array.isArray(correctAnswer.journalEntries)
      ? correctAnswer.journalEntries
      : correctAnswer.journalEntry && Array.isArray(correctAnswer.journalEntry)
        ? correctAnswer.journalEntry // ← journalEntry配列にも対応
        : null;

  // 新形式: journalEntries/journalEntry 配列（複合仕訳対応）
  if (journalArray) {
    // 借方と貸方のエントリを分離
    const debits = journalArray
      .filter((entry: any) => entry.debit_account && entry.debit_amount > 0)
      .map((entry: any) => ({
        account: entry.debit_account,
        amount: entry.debit_amount,
      }));

    const credits = journalArray
      .filter((entry: any) => entry.credit_account && entry.credit_amount > 0)
      .map((entry: any) => ({
        account: entry.credit_account,
        amount: entry.credit_amount,
      }));

    // ... 表示処理
  }

  // 旧形式: journalEntry 単一オブジェクト（後方互換性）
  const entry = correctAnswer.journalEntry;
  if (!entry || Array.isArray(entry)) return null; // ← 配列の場合はスキップ

  // ... 単一オブジェクトの表示処理
};
```

**変更点**:

- `journalEntry`が配列の場合も複合仕訳として処理
- 単数形・複数形の両フォーマットに対応

---

### 修正2: AnswerResultDialog.tsx

**ファイル**: `src/components/AnswerResultDialog.tsx`
**修正箇所**: 66-85行目

```typescript
// 修正後
// journalEntry形式（配列または単一オブジェクト）
if (correctAnswer.journalEntry) {
  // journalEntryが配列の場合（複合仕訳）- そのままjournalEntriesに変換
  if (Array.isArray(correctAnswer.journalEntry)) {
    return {
      journalEntries: correctAnswer.journalEntry, // ← 配列をそのまま変換
    };
  }
  // journalEntryが単一オブジェクトの場合（旧形式・後方互換性）
  return {
    journalEntries: [
      {
        debit_account: correctAnswer.journalEntry.debit_account,
        debit_amount: correctAnswer.journalEntry.debit_amount,
        credit_account: correctAnswer.journalEntry.credit_account,
        credit_amount: correctAnswer.journalEntry.credit_amount,
      },
    ],
  };
}
```

**変更点**:

- `journalEntry`が配列かどうかをチェック
- 配列の場合は全エントリを`journalEntries`に変換
- 単一オブジェクトの場合は従来通り配列化

---

### 修正3: JournalEntryForm.tsx（元に戻す）

**ファイル**: `src/components/unified/JournalEntryForm.tsx`
**修正箇所**: 103-113行目

```typescript
// 修正後（Phase 6で追加した複数エントリ初期化を削除）
useEffect(() => {
  setFormState(createInitialJournalFormState());

  // Always initialize with single entry (users can add more as needed)
  setDebits([createInitialJournalEntry()]);
  setCredits([createInitialJournalEntry()]);

  setNumericPadVisible(false);
  setCurrentAmountEdit(null);
  setTempAmount("");
}, [questionId]);
```

**変更点**:

- テンプレートに基づく複数エントリの自動表示を削除
- デフォルトで1エントリから開始（ユーザーが必要に応じて追加）

**理由**: ユーザーからの要望「デフォルトで表示させるエントリの数を変える仕様は不要」

---

### 修正4: migrations/index.ts

**ファイル**: `src/data/migrations/index.ts`
**修正箇所**: 145行目

```typescript
// 修正後
const forceUpdate = false; // ✅ Phase 7: forceUpdateをfalseに復元（ユーザーデータ保護）
```

**変更点**: `forceUpdate = false`に復元してユーザーデータを保護

---

## ✅ 検証結果

### 期待される表示（Q_J_018）

**📝 正解例**

| 借方              | 貸方             |
| ----------------- | ---------------- |
| 当座預金 99,560円 | 売掛金 100,000円 |
| 支払手数料 440円  |                  |

**借方合計: 100,000円　貸方合計: 100,000円**

### テスト対象問題

- Q_J_018（売掛金回収・振込手数料）
- その他19問の複合仕訳問題

---

## 📊 技術的考察

### データ構造の一貫性

現在のシステムでは以下の3つのフォーマットが混在:

1. `journalEntries`（複数形）配列 - 新形式
2. `journalEntry`（単数形）配列 - 今回発見した形式
3. `journalEntry`（単数形）単一オブジェクト - 旧形式

**推奨事項**: 将来的には`journalEntries`（複数形）に統一することを検討

### 後方互換性の維持

- 3つすべてのフォーマットに対応
- 既存の単一仕訳問題（262問）には影響なし
- 複合仕訳問題（20問）の正解表示が正常化

---

## 🔄 関連する過去の修正

### Phase 6（2025-10-12）

- テンプレートエントリ数の修正
- 複合仕訳問題のテンプレートを正答と同じエントリ数に統一

### Phase 1-5（2025-08-07 - 2025-08-19）

- テンプレートタイポ修正
- JSON形式の統一
- エスケープ問題の修正

---

## 📝 まとめ

### 解決した問題

- ✅ Q_J_018の正解が表示されるようになった
- ✅ `journalEntry`配列形式に対応
- ✅ 単一エントリ・複合エントリの両方をサポート
- ✅ 後方互換性を維持

### 残存課題

なし（Phase 7で完全解決）

### 今後の改善案

1. データ形式を`journalEntries`（複数形）に統一
2. 自動検証スクリプトの強化（複合仕訳の表示検証）
3. E2Eテストの追加（複合仕訳問題の正解表示）

---

**修正者**: Claude Code
**レビュー**: 必要
**デプロイ**: シミュレーターで動作確認済み
