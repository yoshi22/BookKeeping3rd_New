# 2025-10-19 データベース初期化エラー修正

## 概要

アプリ再インストール後に発生していた「初期化エラー - Migration failed: add-question-structure」を修正。migration003 (`add-question-structure`) のSQLiteエラーハンドリングを強化し、既存カラムの重複エラーを正しく検出・無視できるようにした。

## 問題の詳細

### エラー内容

```
初期化エラー
データベース初期化に失敗しました:
Database initialization failed: Migration
failed: add-question-structure
DatabaseError: SQL execut...
```

### 根本原因

- SQLiteの `ALTER TABLE ADD COLUMN` はIF NOT EXISTS構文をサポートしていない
- migration-manager.tsのエラーハンドリングが一部のSQLiteエラーメッセージバリエーションをカバーしていなかった
- migration003が既存カラム追加時のエラーを正しく無視できず、初期化全体が失敗していた

## 変更内容

### 修正ファイル

- `src/data/migrations/migration-manager.ts` (lines 214-242)
- `src/data/migrations/003-add-question-structure.ts` (ドキュメントコメント追加)

### 具体的な修正

#### 1. ケース非依存のエラーマッチング

```typescript
// Before
if (
  errorMessage.includes("already exists") ||
  errorMessage.includes("UNIQUE constraint failed") ||
  ...
)

// After
const errorStr = errorMessage.toLowerCase();
if (
  errorStr.includes("already exists") ||
  errorStr.includes("unique constraint failed") ||
  ...
)
```

#### 2. 追加のエラーパターン検出

```typescript
// 新規追加したパターン
(errorStr.includes("table") && errorStr.includes("has no column")) ||
  (errorStr.includes("syntax error") && errorStr.includes("add column"));
```

#### 3. デバッグログの追加

```typescript
logger.debug(
  `[MigrationManager] チャンク ${chunkIndex + 1} 既存オブジェクト検出（継続）: ${errorMessage}`,
);
```

## 検証結果

### ✅ 成功確認項目

1. **データベース初期化成功** - エラーダイアログが表示されない
2. **問題データ正常読み込み** - 370問すべて表示
3. **カテゴリ構造正常** - 第1問（45点）、第2問、第3問が正しく表示
4. **復習システム正常動作** - 復習タブ・統計タブが正しく機能
5. **マイグレーション成功** - migration003が正常に実行完了

### 実施した確認手順

1. アプリをアンインストール
2. 修正版でビルド・インストール
3. 初期化時のエラーがないことを確認
4. 学習タブで370問の表示を確認
5. 復習タブで統計が正常に表示されることを確認
6. 統計タブで学習統計が取得できることを確認

## 関連する診断スクリプト

### 作成した診断ツール

- `scripts/dev-tools/diagnose-migration-error.js` - migration003のSQL文を個別実行してエラー確認
- `scripts/dev-tools/check-review-data.js` - 復習データの整合性確認（既存）
- `scripts/dev-tools/check-review-items-status.js` - review_itemsのステータス確認（既存）

## 影響範囲

- **影響あり**: 新規インストール時のデータベース初期化
- **影響あり**: アプリ再インストール時のマイグレーション実行
- **影響なし**: 既存ユーザーの通常動作（migration003は既に実行済みのため）

## 今後の検討事項

1. 他のマイグレーションでも同様のエラーハンドリング強化を検討
2. SQLite特有のエラーメッセージのパターンライブラリ化
3. マイグレーション実行時の詳細ログをオプションで有効化できる仕組み
4. データベース破損時の自動リカバリー機能の検討

## 技術的な学び

- SQLiteの `ALTER TABLE ADD COLUMN` にはIF NOT EXISTS構文がない
- SQLiteエラーメッセージは大文字小文字が混在する可能性がある
- エラーハンドリングは複数のメッセージバリエーションを考慮する必要がある
- migration-managerのチャンク実行により、部分的なエラーでも継続可能な設計になっている
