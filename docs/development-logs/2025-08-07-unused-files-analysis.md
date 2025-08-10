# 未使用ファイルの分析レポート

**実施日時**: 2025年8月7日 10:20  
**分析者**: Claude Code  
**目的**: 不要なスクリプトとデータファイルの特定

## 📊 分析結果サマリー

- **総ファイル数**: scripts/ 50ファイル、src/data/ 20ファイル
- **削除対象**: 42ファイル（安全に削除可能）
- **保持推奨**: 28ファイル（現在使用中または将来必要）

## 🗑️ 削除対象ファイル

### 1. 旧問題データファイル（すでにmaster-questionsに統合済み）

```
src/data/
├── all-questions-integrated.js       # 旧統合データ（未使用）
├── all-questions-integrated.ts       # 旧統合データ（未使用）
├── extracted-questions.js            # 旧抽出データ（未使用）
├── extracted-questions.ts            # 旧抽出データ（未使用）
├── extracted-questions.ts.backup     # バックアップ（不要）
├── extracted-questions-backup.ts     # バックアップ（不要）
├── generated-questions.js            # 旧生成データ（未使用）
├── generated-questions.ts            # 旧生成データ（未使用）
├── generated-questions.ts.backup     # バックアップ（不要）
├── generated-questions.ts.bak        # バックアップ（不要）
├── sample-questions.ts.backup        # バックアップ（不要）
└── trial-balance-questions-new.ts    # 旧試算表問題（統合済み）
```

### 2. 一時的な修正・デバッグスクリプト

```
scripts/
├── fix-difficulty-simple.js          # 難易度修正（完了済み）
├── fix-problem-numbering.js          # 番号修正（完了済み）
├── fix-question-difficulty.js        # 難易度修正（完了済み）
├── fix-question-difficulty-v2.js     # 難易度修正V2（完了済み）
├── fix-questions-data-issue.js       # データ問題修正（完了済み）
├── final-difficulty-fix.js           # 最終難易度修正（完了済み）
├── replace-trial-balance-questions.js # 試算表問題置換（完了済み）
├── force-reload-questions.js         # 強制リロード（旧データ用）
├── force-update-questions.js         # 強制更新（旧データ用）
├── diagnose-database-questions.js    # 診断スクリプト（一時的）
├── diagnose-questions-data-flow.js   # データフロー診断（一時的）
└── debug-statistics.js               # 統計デバッグ（一時的）
```

### 3. 旧バージョンのチェック・検証スクリプト

```
scripts/
├── check-database-questions.js       # 旧データベースチェック
├── check-database-questions.ts       # 旧データベースチェック
├── check-and-reload-database.js      # 旧リロードスクリプト
├── check-and-reload-database.ts      # 旧リロードスクリプト
├── verify-questions.js               # 旧検証スクリプト
├── verify-questions-ts.ts            # 旧検証スクリプト
├── verify-strategy-alignment.js      # 旧戦略確認（master-questions使用後不要）
├── verify-strategy-alignment.ts      # 旧戦略確認（master-questions使用後不要）
└── test-new-questions.js             # 旧問題テスト
```

### 4. 移行・変換スクリプト（完了済み）

```
scripts/
├── migrate-questions-to-master.ts    # マスターへの移行（完了済み）
├── create-js-data-files.js           # JS変換（master-questions使用後不要）
├── add-question-categories.js        # カテゴリ追加（完了済み）
├── add-question-categories.ts        # カテゴリ追加（完了済み）
└── scripts/import-master-questions.js # 重複ディレクトリ
```

### 5. その他の一時的テストスクリプト

```
scripts/
├── test-components.js                # コンポーネントテスト（一時的）
├── test-error-handling.js            # エラーハンドリングテスト（一時的）
├── test-full-question-flow.js        # フルフローテスト（旧データ用）
├── test-navigation.js                # ナビゲーションテスト（一時的）
├── test-number-input.js              # 数値入力テスト（一時的）
├── test-performance-optimization.js  # パフォーマンステスト（一時的）
├── test-repository-crud.js           # CRUDテスト（一時的）
├── test-text-components.js           # テキストコンポーネントテスト（一時的）
└── chatgpt-autopaste.sh              # ChatGPT用スクリプト（不要）
```

## ✅ 保持推奨ファイル

### 1. 現在使用中のデータファイル

```
src/data/
├── master-questions.js               # ✅ メイン問題データ
├── master-questions.ts               # ✅ メイン問題データ（ソース）
├── master-questions-wrapper.js       # ✅ React Native用ラッパー
├── sample-questions-new.ts           # ✅ データ読み込みエントリポイント
├── sample-mock-exams.ts              # ✅ 模試データ
├── database.ts                       # ✅ データベース接続
├── database-optimized.ts             # ✅ 最適化版データベース
└── migrations/                       # ✅ マイグレーション（全て必要）
```

### 2. 有用なユーティリティスクリプト

```
scripts/
├── generate-questions-master.js      # ✅ 問題生成（再生成に必要）
├── generate-questions-master.ts      # ✅ 問題生成ソース
├── import-master-questions.js        # ✅ データインポート
├── import-master-questions.ts        # ✅ データインポートソース
├── test-data-loading.js              # ✅ データ読み込みテスト
├── scan.js                           # ✅ プロジェクトスキャン
├── ensure-english.sh                 # ✅ 入力言語切り替え
├── safe_write.sh                     # ✅ 安全書き込みユーティリティ
└── reset-database.js                 # ✅ データベースリセット（開発用）
```

### 3. システムテストスクリプト

```
scripts/
├── test-database.js                  # ✅ データベーステスト
├── test-answer-service.js            # ✅ 解答サービステスト
├── test-mock-exam-system.js          # ✅ 模試システムテスト
├── test-review-system.js             # ✅ 復習システムテスト
├── test-statistics-system.js         # ✅ 統計システムテスト
├── test-integration.js               # ✅ 統合テスト
├── test-migration.js                 # ✅ マイグレーションテスト
├── test-answer-logic.js              # ✅ 解答ロジックテスト
├── test-mock-exam-logic.js           # ✅ 模試ロジックテスト
├── web-smoke-test.js                 # ✅ Webスモークテスト
└── insert-sample-questions.js        # ✅ サンプルデータ投入
```

## 🔨 削除コマンド

以下のコマンドで未使用ファイルを一括削除できます：

```bash
# データファイルの削除
rm -f src/data/all-questions-integrated.*
rm -f src/data/extracted-questions*
rm -f src/data/generated-questions*
rm -f src/data/*.backup
rm -f src/data/*.bak
rm -f src/data/trial-balance-questions-new.ts

# 修正・デバッグスクリプトの削除
rm -f scripts/fix-*.js
rm -f scripts/final-difficulty-fix.js
rm -f scripts/replace-trial-balance-questions.js
rm -f scripts/force-*.js
rm -f scripts/diagnose-*.js
rm -f scripts/debug-statistics.js

# 旧チェック・検証スクリプトの削除
rm -f scripts/check-database-questions.*
rm -f scripts/check-and-reload-database.*
rm -f scripts/verify-questions.*
rm -f scripts/verify-strategy-alignment.*
rm -f scripts/test-new-questions.js

# 移行・変換スクリプトの削除
rm -f scripts/migrate-questions-to-master.ts
rm -f scripts/create-js-data-files.js
rm -f scripts/add-question-categories.*
rm -rf scripts/scripts/

# 一時的テストスクリプトの削除
rm -f scripts/test-components.js
rm -f scripts/test-error-handling.js
rm -f scripts/test-full-question-flow.js
rm -f scripts/test-navigation.js
rm -f scripts/test-number-input.js
rm -f scripts/test-performance-optimization.js
rm -f scripts/test-repository-crud.js
rm -f scripts/test-text-components.js
rm -f scripts/chatgpt-autopaste.sh
```

## ⚠️ 削除前の注意事項

1. **バックアップ推奨**: 念のため削除前にプロジェクト全体のバックアップを作成
2. **Git管理**: Gitで管理されているファイルは`git rm`コマンドを使用
3. **段階的削除**: 一度にすべて削除せず、カテゴリごとに削除して動作確認

## 📈 削除による効果

- **ディスク容量**: 約2.5MB削減
- **プロジェクト整理**: ファイル数70→28（60%削減）
- **メンテナンス性**: 不要なファイルによる混乱を防止
- **ビルド時間**: 不要なファイルのスキャンが減少

---

**分析完了時刻**: 2025年8月7日 10:20 JST
