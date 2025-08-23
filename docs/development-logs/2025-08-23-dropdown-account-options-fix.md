# 2025-08-23 勘定科目ドロップダウン選択肢修正

## 概要

プルダウン形式の問題で正答勘定科目が選択肢にない問題を発見・修正

## 問題の発見

- ユーザーから「第二問について、プルダウンから回答を選択する形式の問題について、正答が選択肢にない場合がある」との報告
- 当初Q_J_002（通信費）の問題と推測したが、「通信費」は既存
- 調査の結果、Q_J_003等で使用される「雑損」「雑益」が選択肢にないことを発見

## 問題の詳細

### 不足していた勘定科目

- **雑損** (zatsu-son) - 個別の雑損
- **雑益** (zatsu-eki) - 個別の雑益

### 既存の類似勘定科目（混同しやすい）

- **雑損失** (zatsu-sonshitsu) - 雑多な損失の総称
- **雑収入** (zatsu-shunyu) - 雑多な収入

### 実際の使用例（master-questions.ts）

- Q_J_003: `"雑損","debit_amount":150` （現金過不足の決算処理）
- その他問題: `"雑益","credit_amount":8000` （現金過不足の振替処理）

## 実施した修正

### 1. AccountOptions.ts の更新

```typescript
// 収益勘定セクションに追加
{ label: "雑益", value: "雑益" },

// 費用勘定セクションに追加
{ label: "雑損", value: "雑損" },
```

### 2. 分類関数の更新

- `getAccountsByCategory()` の revenue/expense配列に追加
- `getAccountType()` の revenueAccounts/expenseAccounts配列に追加

### 3. UnifiedAccountSelector.tsx の更新

```typescript
// EXTENDED_ACCOUNT_ITEMS に追加
{ code: "415", name: "雑益", category: "revenue" },
{ code: "525", name: "雑損", category: "expense" },
```

## 簿記用語の区別

- **雑損失**: 包括的な雑多な損失（複数形的概念）
- **雑損**: 具体的・個別の雑損（単体の損失）
- **雑収入**: 包括的な雑多な収入
- **雑益**: 具体的・個別の雑益（単体の利益）

## 検証方法

問題データ調査により以下を確認：

```bash
grep -n "雑損\|雑益\|雑収" src/data/master-questions.ts
```

## 影響範囲

- 仕訳問題（journal_entry）のドロップダウン選択
- 現金過不足の決算処理問題
- CBT形式での勘定科目選択

## テスト結果

- Q_J_003で「雑損」が選択可能になることを確認
- 既存の「雑損失」「雑収入」との併存を確認
- ドロップダウンの正常動作を確認

## 修正日時

2025-08-23 15:30 JST

## 関連ファイル

- `src/components/shared/AccountOptions.ts`
- `src/components/unified/UnifiedAccountSelector.tsx`
- `src/data/master-questions.ts` (参照)
