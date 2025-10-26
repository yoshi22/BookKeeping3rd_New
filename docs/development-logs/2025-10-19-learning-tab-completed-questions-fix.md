# 学習タブの完了問題数表示修正

## 日時

2025年10月19日

## 問題の概要

学習タブで各カテゴリの完了問題数が常に「0」と表示され、実際に正答した問題数が反映されていない問題が発生していた。

## 原因

`app/(tabs)/learning/index.tsx`で、各カテゴリオブジェクトの`completedQuestions`プロパティがハードコード（`completedQuestions: 0`）されていたため、データベースから正答数を取得しても表示に反映されていなかった。

## 修正内容

### 1. completedCounts stateの追加（lines 43-52）

カテゴリ別の完了問題数を管理するための状態を追加:

```typescript
const [completedCounts, setCompletedCounts] = useState<
  Record<QuestionCategory, number>
>({
  journal: 0,
  ledger: 0,
  trial_balance: 0,
  financial_statement: 0,
  voucher_entry: 0,
  multiple_blank_choice: 0,
});
```

### 2. LearningHistoryRepositoryのimport追加（line 6）

正答データを取得するためのリポジトリをimport:

```typescript
import { LearningHistoryRepository } from "../../../src/data/repositories/learning-history-repository";
```

### 3. useEffect内でのデータ取得ロジック実装（lines 136-152）

`getUniqueAnsweredQuestions()`メソッドを使用して、カテゴリ別の正答問題数を取得:

```typescript
// 完了した問題数の取得
const learningHistoryRepository = new LearningHistoryRepository();
const answeredQuestions =
  await learningHistoryRepository.getUniqueAnsweredQuestions();
const { categoryBreakdown } = answeredQuestions;

// カテゴリ別の正答問題数（完了問題数）を設定
setCompletedCounts({
  journal: categoryBreakdown.journal.correctUnique,
  ledger: categoryBreakdown.ledger.correctUnique,
  trial_balance: categoryBreakdown.trial_balance.correctUnique,
  financial_statement: categoryBreakdown.financial_statement.correctUnique,
  voucher_entry: categoryBreakdown.voucher_entry.correctUnique,
  multiple_blank_choice: categoryBreakdown.multiple_blank_choice.correctUnique,
});
```

### 4. カテゴリオブジェクトのcompletedQuestions修正

ハードコードされた値を動的な値に変更:

- **line 72**: `completedQuestions: 0` → `completedQuestions: completedCounts.journal`
- **line 87**: `completedQuestions: 0` → `completedQuestions: completedCounts.ledger`
- **line 101**: `completedQuestions: 0` → `completedQuestions: completedCounts.trial_balance`

### 5. エラーハンドリングの更新（lines 163-170）

エラー発生時にcompletedCountsも初期化するよう修正:

```typescript
setCompletedCounts({
  journal: 0,
  ledger: 0,
  trial_balance: 0,
  financial_statement: 0,
  voucher_entry: 0,
  multiple_blank_choice: 0,
});
```

## 使用したデータベースメソッド

`LearningHistoryRepository.getUniqueAnsweredQuestions()`（lines 493-594）:

- カテゴリ別の正答問題数（`correctUnique`）を取得
- SQLクエリで`COUNT(DISTINCT CASE WHEN EXISTS...)`を使用
- 少なくとも1回正解した一意の問題数をカウント

## 検証結果

### コンパイル確認

- TypeScriptエラー: なし
- Expoバンドル: 正常にコンパイル完了（1228モジュール、8142ms）

### 動作確認

- シミュレーターで学習タブを開き、完了問題数が正しく表示されることを確認
- 正答した問題がある場合、その数が適切に反映される
- プログレスバーも正答率に応じて正しく表示される

## 影響範囲

- **修正ファイル**: `app/(tabs)/learning/index.tsx`
- **影響する画面**: 学習タブのカテゴリ一覧画面
- **影響する機能**:
  - カテゴリ別の完了問題数表示
  - プログレスバーの表示
  - 学習進捗の可視化

## 関連する過去の修正

- 2025-10-19: 復習アイテムのデータ整合性修正（orphaned review_items問題）
- 2025-08-14: 復習リスト表示問題の修復（データベース強制更新問題）

## 備考

- この修正により、ユーザーは自分の学習進捗を正確に把握できるようになった
- 各カテゴリで正答した一意の問題数が「完了問題」として表示される
- 同じ問題を複数回正解しても、完了問題数は1つとしてカウントされる（重複排除）
