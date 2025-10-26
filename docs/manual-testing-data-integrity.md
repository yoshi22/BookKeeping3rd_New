# データ整合性 - 手動テスト手順書

**作成日**: 2025-10-19
**対象**: BookKeeping3rd (簿記3級問題集アプリ)
**目的**: review_items と learning_history の整合性確認および検証手順

---

## 概要

本ドキュメントは、データベース整合性修正（`ensureReviewItemsIntegrity()`）の動作確認と、問題発生時のトラブルシューティングを目的とした手動テスト手順書です。

### 実装済み機能

1. **orphaned review_items のクリーンアップ** - 存在しない問題を参照する review_items を削除
2. **欠損 review_items の復元** - learning_history から不正解問題の review_items を再構築
3. **統計キャッシュのクリア** - 整合性修復後に統計を最新化

### 自動実行タイミング

- アプリ起動時（setupDatabase）
- 問題データ更新時（forceUpdate || needsUpdate）
- 既存データスキップ時（通常の起動）

---

## 前提条件

### 必要なツール

- **sqlite3** コマンドラインツール（macOS標準搭載）
- **iOSシミュレーター** または **実機デバッグ環境**

### テスト環境

```bash
# シミュレーター確認
xcrun simctl list devices | grep Booted

# プロジェクトディレクトリ
cd /Users/muroiyousuke/Projects/BookKeeping3rd
```

---

## テスト手順

### Phase 1: データベースファイルの位置確認

#### Step 1-1: シミュレーターのデータベースファイル検索

```bash
# iPhone 16 シミュレーターのDB検索（UUID: 571E87BC-4607-4A44-90FC-8AA650BCB8DF）
find ~/Library/Developer/CoreSimulator/Devices/571E87BC-4607-4A44-90FC-8AA650BCB8DF \
  -name "SQLite.db" -type f

# 期待される結果例:
# ~/Library/Developer/CoreSimulator/Devices/571E87BC-4607-4A44-90FC-8AA650BCB8DF/data/Containers/Data/Application/[UUID]/Library/LocalDatabase/SQLite.db
```

#### Step 1-2: データベースファイルへのアクセス確認

```bash
# 変数に保存（以降のコマンドで使用）
DB_PATH=$(find ~/Library/Developer/CoreSimulator/Devices/571E87BC-4607-4A44-90FC-8AA650BCB8DF \
  -name "SQLite.db" -type f | head -1)

echo "データベースパス: $DB_PATH"

# ファイル存在確認
ls -lh "$DB_PATH"
```

**期待される結果**:

- ファイルサイズが 0 KB より大きい
- 権限が読み取り可能（-rw-r--r-- など）

---

### Phase 2: テーブル件数の確認

#### Step 2-1: 基本テーブル件数チェック

```bash
sqlite3 "$DB_PATH" <<EOF
.headers on
.mode column

-- 1. 問題データ件数
SELECT 'questions' AS table_name, COUNT(*) AS count FROM questions;

-- 2. 学習履歴件数
SELECT 'learning_history' AS table_name, COUNT(*) AS count FROM learning_history;

-- 3. 復習アイテム件数
SELECT 'review_items' AS table_name, COUNT(*) AS count FROM review_items;
EOF
```

**期待される結果**:

```
table_name        count
----------------  ----------
questions         370        ← サンプルデータ全問（第一問250 + 第二問70 + 第三問50）
learning_history  [0以上]    ← ユーザーの学習履歴に依存
review_items      [0以上]    ← 不正解問題の数に依存
```

**異常なパターン**:

- `questions = 0` → サンプルデータ未読み込み（初回起動前）
- `learning_history > 0` かつ `review_items = 0` → 整合性問題の可能性

#### Step 2-2: カテゴリ別問題数の確認

```bash
sqlite3 "$DB_PATH" <<EOF
.headers on
.mode column

SELECT
  category_id,
  COUNT(*) AS total_questions
FROM questions
GROUP BY category_id
ORDER BY category_id;
EOF
```

**期待される結果**:

```
category_id      total_questions
---------------  ---------------
journal          250             ← 第一問（仕訳問題）
ledger           70              ← 第二問（帳簿問題）
trial_balance    50              ← 第三問（試算表問題）
```

---

### Phase 3: データ整合性の検証

#### Step 3-1: orphaned review_items の検出

```bash
sqlite3 "$DB_PATH" <<EOF
.headers on
.mode column

-- 存在しない問題を参照している review_items を検出
SELECT
  ri.question_id,
  ri.status,
  ri.priority_score,
  ri.updated_at
FROM review_items ri
LEFT JOIN questions q ON ri.question_id = q.id
WHERE q.id IS NULL;
EOF
```

**期待される結果**:

- **正常**: 結果が0件（orphaned なし）
- **異常**: 結果が1件以上 → `cleanupOrphanedItems()` が未実行または失敗

#### Step 3-2: 復元が必要な review_items の検出

```bash
sqlite3 "$DB_PATH" <<EOF
.headers on
.mode column

-- learning_history に不正解があるが review_items が存在しない問題を検出
SELECT
  lh.question_id,
  SUM(CASE WHEN lh.is_correct = 0 THEN 1 ELSE 0 END) AS incorrect_attempts,
  SUM(CASE WHEN lh.is_correct = 1 THEN 1 ELSE 0 END) AS correct_attempts,
  MAX(lh.answered_at) AS last_answered_at
FROM learning_history lh
INNER JOIN questions q ON lh.question_id = q.id
LEFT JOIN review_items ri ON lh.question_id = ri.question_id
GROUP BY lh.question_id
HAVING incorrect_attempts > 0 AND ri.question_id IS NULL;
EOF
```

**期待される結果**:

- **正常**: 結果が0件（復元対象なし）
- **異常**: 結果が1件以上 → `restoreReviewItemsFromHistory()` が未実行または失敗

#### Step 3-3: カテゴリ別 review_items 分布の確認

```bash
sqlite3 "$DB_PATH" <<EOF
.headers on
.mode column

SELECT
  q.category_id,
  ri.status,
  COUNT(*) AS count
FROM review_items ri
INNER JOIN questions q ON ri.question_id = q.id
GROUP BY q.category_id, ri.status
ORDER BY q.category_id, ri.status;
EOF
```

**期待される結果**:

```
category_id      status          count
---------------  --------------  -----
journal          needs_review    [N]   ← 要復習の仕訳問題
journal          priority_review [M]   ← 重点復習の仕訳問題
ledger           needs_review    [X]
...
```

---

### Phase 4: 統計表示の検証

#### Step 4-1: 統計サービスの生データ確認

**Metro bundler ログの確認**:

```bash
# Metro bundler のログをフィルタリング
tail -f ~/Library/Developer/CoreSimulator/Devices/*/data/Containers/Data/Application/*/tmp/expo-logs/*.log \
  | grep -E "\[StatisticsService\]|\[ReviewService\]"
```

**期待されるログ出力**:

```
[StatisticsService] 全体学習統計取得完了
[StatisticsService] 統計データ: { totalQuestions: 370, answeredQuestions: X, correctAnswers: Y }
[ReviewService] 復習リスト生成完了: Z/Z件（orphaned: 0件）
```

**異常なログパターン**:

- `orphaned: N件` (N > 0) → クリーンアップが未実行
- `answeredQuestions: 0` かつ learning_history に履歴あり → 統計計算エラー

#### Step 4-2: UIでの統計表示確認

**手順**:

1. アプリを起動
2. 「復習・進捗」タブに移動
3. 「統計」サブタブを選択

**確認項目**:

- ✅ **解答済み**: `statisticsData?.overall?.totalAnswered` が 0 以外の値
- ✅ **正答率**: `0-100%` の範囲で表示
- ✅ **学習時間(分)**: 0 以上の値
- ✅ **分野別進捗**: 各カテゴリの正答率が正しく表示

**異常パターン**:

- すべて `0` または `undefined` → `loadStatisticsData()` がエラー
- 正答率が `100` を超える → 正規化の計算ミス

---

## トラブルシューティング

### 問題1: review_items が0件（学習履歴があるのに）

**症状**:

- learning_history に不正解の記録がある
- review_items テーブルが空
- 復習タブに「復習対象問題がありません」と表示

**原因**:

- `restoreReviewItemsFromHistory()` が実行されていない
- または questions テーブルが空の状態で実行された

**解決手順**:

```bash
# Step 1: アプリを完全終了
# Step 2: Metro bundler を再起動
npx expo start --clear

# Step 3: データベースを強制リセット（最終手段）
# 設定画面 → データベースリセット → 確認
```

**検証**:

```bash
# review_items が復元されたか確認
sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM review_items;"
```

### 問題2: orphaned review_items が残存

**症状**:

- review_items に存在しない question_id が含まれる
- Phase 3-1 のSQLで結果が返る

**原因**:

- `cleanupOrphanedItems()` が questions テーブルが空の時にスキップされた
- または削除処理でエラーが発生

**解決手順**:

```bash
# Step 1: Metro bundler ログで確認
tail -f [LOG_PATH] | grep "cleanupOrphanedItems"

# 期待されるログ:
# [ReviewItemRepository] orphaned review_items検出: N件
# [ReviewItemRepository] orphaned review_itemsクリーンアップ完了: N件削除
```

```bash
# Step 2: 手動でクリーンアップSQL実行（慎重に！）
sqlite3 "$DB_PATH" <<EOF
BEGIN TRANSACTION;

DELETE FROM review_items
WHERE NOT EXISTS (
  SELECT 1 FROM questions
  WHERE questions.id = review_items.question_id
);

SELECT changes() AS deleted_count;

COMMIT;
EOF
```

### 問題3: 統計が0のまま更新されない

**症状**:

- 学習履歴があるのに統計タブが「0問」表示
- データベースには正しくデータが存在

**原因**:

- 統計キャッシュが古い状態でロック
- `statisticsCache.clearAll()` が実行されていない

**解決手順**:

```bash
# Step 1: 統計タブで「データ更新」ボタンをタップ
# （testID: refresh-statistics-button）

# Step 2: アプリを再起動
# Step 3: Metro bundler ログで確認
tail -f [LOG_PATH] | grep "StatisticsCache"

# 期待されるログ:
# [StatisticsCache] 全キャッシュクリア
# [StatisticsService] 全体学習統計取得開始
```

### 問題4: データベースファイルが見つからない

**症状**:

- `find` コマンドで SQLite.db が検出されない
- アプリが初回起動前

**解決手順**:

```bash
# Step 1: アプリを起動して初回セットアップを完了
# Step 2: 再度検索
find ~/Library/Developer/CoreSimulator/Devices/571E87BC-4607-4A44-90FC-8AA650BCB8DF \
  -name "SQLite.db" -type f

# Step 3: それでも見つからない場合はシミュレーター全体を検索
find ~/Library/Developer/CoreSimulator/Devices \
  -name "SQLite.db" -path "*/BookKeeping3rd/*" -type f
```

---

## 自動整合性チェックのログ確認

### 正常なログパターン

**アプリ起動時**:

```
[Database] データベース初期化開始
[Database] マイグレーション実行
[Database] サンプルデータ読み込み開始
[Database] 既存データをスキップ
[Database] orphaned review_itemsクリーンアップ開始
[ReviewItemRepository] orphaned review_itemsなし - データ整合性正常
[Database] review_items復元対象なし
[Database] review_items整合性チェック完了: 変更なし
[Database] データベース初期化完了
```

**問題発見時**:

```
[Database] orphaned review_itemsクリーンアップ開始
[ReviewItemRepository] orphaned review_items検出: 5件
[ReviewItemRepository] orphaned review_itemsクリーンアップ完了: 5件削除
[Database] review_items復元完了: 3件生成
[Database] review_items整合性チェック後に統計キャッシュをクリア
[Database] review_items整合性チェック完了: 削除5件 / 復元3件
```

---

## 検証チェックリスト

### 初期セットアップ検証

- [ ] データベースファイルが存在する
- [ ] questions テーブルに 370 件のデータがある
- [ ] categories テーブルに正しいカテゴリ名が設定されている

### 整合性機能検証

- [ ] orphaned review_items が 0 件（Phase 3-1）
- [ ] 復元対象の review_items が 0 件（Phase 3-2）
- [ ] review_items のカテゴリ分布が正しい（Phase 3-3）

### UI表示検証

- [ ] 統計タブで「解答済み」が正しく表示される
- [ ] 統計タブで「正答率」が 0-100% で表示される
- [ ] 統計タブで「学習時間」が正しく表示される
- [ ] 分野別進捗が各カテゴリで表示される

### ログ検証

- [ ] Metro bundler ログで整合性チェック完了が確認できる
- [ ] orphaned 検出が 0 件と表示される
- [ ] エラーログが出力されていない

---

## よくある質問 (FAQ)

### Q1: 整合性チェックはいつ実行される？

**A**: 以下の3つのタイミングで自動実行されます：

1. アプリ起動時（setupDatabase）
2. 問題データ更新時（forceUpdate || needsUpdate が true）
3. 既存データスキップ時（通常起動、forceUpdate=false）

### Q2: 手動で整合性チェックを実行できる？

**A**: 統計タブの「データ更新」ボタンで統計は再計算されますが、整合性チェック自体はアプリ再起動が必要です。

### Q3: review_items を完全にリセットするには？

**A**: 設定画面の「データベースリセット」機能を使用します。ただし、**すべての学習履歴が削除される**ため注意してください。

### Q4: sqlite3 コマンドでデータを直接修正してもよい？

**A**: 開発時のデバッグ目的であれば可能ですが、本番環境では推奨しません。アプリのロジックとの整合性が崩れる可能性があります。

---

## 付録: よく使うSQLクエリ集

### A1: カテゴリ別学習状況サマリー

```sql
SELECT
  c.name AS カテゴリ名,
  COUNT(DISTINCT lh.question_id) AS 回答済み問題数,
  SUM(CASE WHEN lh.is_correct = 1 THEN 1 ELSE 0 END) AS 正解数,
  SUM(CASE WHEN lh.is_correct = 0 THEN 1 ELSE 0 END) AS 不正解数,
  ROUND(
    CAST(SUM(CASE WHEN lh.is_correct = 1 THEN 1 ELSE 0 END) AS FLOAT) /
    COUNT(lh.id) * 100, 2
  ) AS 正答率パーセント
FROM categories c
LEFT JOIN questions q ON c.id = q.category_id
LEFT JOIN learning_history lh ON q.id = lh.question_id
GROUP BY c.id, c.name
ORDER BY c.sort_order;
```

### A2: 復習対象問題の優先度分布

```sql
SELECT
  CASE
    WHEN ri.priority_score >= 80 THEN 'Critical (80+)'
    WHEN ri.priority_score >= 60 THEN 'High (60-79)'
    WHEN ri.priority_score >= 40 THEN 'Medium (40-59)'
    ELSE 'Low (<40)'
  END AS 優先度レベル,
  COUNT(*) AS 問題数
FROM review_items ri
GROUP BY
  CASE
    WHEN ri.priority_score >= 80 THEN 'Critical (80+)'
    WHEN ri.priority_score >= 60 THEN 'High (60-79)'
    WHEN ri.priority_score >= 40 THEN 'Medium (40-59)'
    ELSE 'Low (<40)'
  END
ORDER BY MIN(ri.priority_score) DESC;
```

### A3: 最近の学習履歴（上位10件）

```sql
SELECT
  q.id AS 問題ID,
  q.question_text AS 問題文_抜粋,
  CASE WHEN lh.is_correct = 1 THEN '正解' ELSE '不正解' END AS 結果,
  datetime(lh.answered_at, 'localtime') AS 回答日時
FROM learning_history lh
INNER JOIN questions q ON lh.question_id = q.id
ORDER BY lh.answered_at DESC
LIMIT 10;
```

---

## 変更履歴

| 日付       | バージョン | 変更内容                                |
| ---------- | ---------- | --------------------------------------- |
| 2025-10-19 | 1.0        | 初版作成 - 基本的な手動テスト手順を記載 |

---

**問い合わせ**: 本ドキュメントに関する質問は、開発ログ `docs/development-logs/2025-10-19-review-items-data-consistency-fix.md` を参照してください。
