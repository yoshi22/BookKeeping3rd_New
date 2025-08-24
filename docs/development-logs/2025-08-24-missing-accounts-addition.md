# 勘定科目追加修正 - 2025-08-24

## 問題の概要

ユーザーから報告された問題：Q_J_041などの問題で正答に含まれる勘定科目「為替差益」が選択肢から選択できない状況が発生。

以前の修正（2025-08-24-account-options-fix-plan.md）でEXTENDED_ACCOUNT_ITEMSを廃止してSTANDARD_ACCOUNT_OPTIONSに統一したにも関わらず、依然として一部の勘定科目が欠落していた。

## 原因分析

### 調査方法

1. `master-questions.ts`から全問題の正答に使用される勘定科目を抽出
2. `AccountOptions.ts`のSTANDARD_ACCOUNT_OPTIONSで利用可能な勘定科目を確認
3. 差分を特定して欠落している勘定科目を明確化

### 発見された欠落勘定科目

以下7つの勘定科目がSTANDARD_ACCOUNT_OPTIONSから欠落：

1. **定期預金** - 資産勘定
2. **為替差益** - 収益勘定
3. **固定資産売却益** - 収益勘定
4. **償却債権取立益** - 収益勘定
5. **為替差損** - 費用勘定
6. **固定資産売却損** - 費用勘定
7. **固定資産除却損** - 費用勘定

### 対象問題

欠落勘定科目を使用する主要問題：

- Q_J_041: 為替差益を使用
- その他複数の問題で上記勘定科目を使用

## 修正内容

### 1. STANDARD_ACCOUNT_OPTIONS配列への追加

`src/components/shared/AccountOptions.ts`の資産・収益・費用セクションに以下を追加：

```typescript
// 資産勘定
{ label: "定期預金", value: "定期預金" },

// 収益勘定
{ label: "為替差益", value: "為替差益" },
{ label: "固定資産売却益", value: "固定資産売却益" },
{ label: "償却債権取立益", value: "償却債権取立益" },

// 費用勘定
{ label: "為替差損", value: "為替差損" },
{ label: "固定資産売却損", value: "固定資産売却損" },
{ label: "固定資産除却損", value: "固定資産除却損" },
```

### 2. getAccountsByCategory関数の更新

カテゴリ別フィルター関数に追加勘定科目を含める：

- `assetAccounts`: 定期預金を追加
- `revenueAccounts`: 為替差益、固定資産売却益、償却債権取立益を追加
- `expenseAccounts`: 為替差損、固定資産売却損、固定資産除却損を追加

### 3. getAccountType関数の更新

勘定科目の性質判定関数に追加勘定科目の分類を含める。

### 4. データベースバージョン更新

`src/data/migrations/index.ts`でデータバージョンを更新：

```typescript
const SAMPLE_DATA_VERSION = "2025-08-24-additional-accounts";
```

一時的に`forceUpdate = true`に設定してデータ更新を実行後、`false`に復元してユーザーデータを保護。

## 検証結果

修正後、検証スクリプト`validate-all-answers-v2.js`を実行：

```bash
node scripts/testing/validate-all-answers-v2.js
```

**結果**: 302問全問で100%成功を確認

- 全ての勘定科目が正常にマッピング
- JSON解析エラー0件
- 解答データ構築エラー0件

## 技術的詳細

### 修正したファイル

- `src/components/shared/AccountOptions.ts` - 勘定科目オプション定義
- `src/data/migrations/index.ts` - データベースマイグレーション管理

### 検証方法

- 自動検証: 全302問の正答判定ロジック確認
- 構造検証: JSON形式と勘定科目マッピングの整合性

### データ保護対策

- `forceUpdate`フラグの適切な管理
- ユーザー学習履歴の保護（復習データ等）
- バージョン管理による段階的更新

## 今後の対策

### 予防措置

1. 新規問題追加時の勘定科目チェックリスト作成
2. 定期的な整合性検証の自動化
3. STANDARD_ACCOUNT_OPTIONSとmaster-questions.tsの同期確認

### 品質管理

- 月次での全問題検証実行
- 勘定科目マスタと問題データの一致確認
- 新機能追加時の回帰テスト実施

## 完了確認

- ✅ 欠落勘定科目7つの追加完了
- ✅ カテゴリ別フィルター関数の更新完了
- ✅ 勘定科目分類関数の更新完了
- ✅ データベースバージョン更新完了
- ✅ 全302問での検証成功確認
- ✅ ユーザーデータ保護の復元完了

この修正により、全ての問題で正答に含まれる勘定科目が選択肢から正常に選択可能になった。
