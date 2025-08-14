# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

これは Expo、TypeScript、SQLite で構築された React Native 簿記練習アプリ（簿記3級問題集「確実復習」）です。間違えた問題の反復練習を通してユーザーの簿記習得を支援することに焦点を当てています。最新版では CBT 形式の模試機能が完全実装済みです。

**主要なアーキテクチャ決定:**

- **データベース**: SQLite（ローカルのみ、プライバシー重視）
- **状態管理**: React Context + カスタムフック
- **ナビゲーション**: Expo Router（ファイルベースルーティング）
- **テスト**: Jest + React Testing Library + E2E用Detox
- **パターン**: データアクセス用Repository Pattern + ビジネスロジック用Service層

## 開発環境セットアップ

**必要な環境:**

- Node.js 18以上
- npm または yarn
- Xcode (iOS開発用) または Android Studio (Android開発用)
- Expo CLI (`npm install -g expo-cli`)

**初期セットアップ:**

```bash
npm install                # 依存関係インストール
npx expo doctor           # 環境診断
npm start                 # 開発サーバー起動
```

## よく使う開発コマンド

```bash
# プロジェクト把握
node scripts/utilities/scan.js   # プロジェクト概要をクイックスキャン (/scan コマンド)

# 開発
npm start              # Expo開発サーバー起動
npm run ios            # iOSシミュレーター実行
npm run android        # Androidエミュレーター実行
npm run web            # Web版実行（開発用のみ）

# 品質管理・テスト
npm test               # Jestテスト実行
npm run lint           # ESLint実行
npm run check:quick    # TypeScript型チェック + lint + test (完全な品質チェック)
npx tsc --noEmit       # TypeScript型チェックのみ

# 特定テスト実行
npm test -- --testPathPattern=data         # データ層テストのみ
npm test -- --testPathPattern=integration  # 統合テストのみ
npm test -- --watch                        # ウォッチモード
npm test -- --coverage                     # カバレッジ付き実行

# Expoコマンド
npx expo doctor        # 環境セットアップ確認
npx expo run:ios       # iOS開発ビルドの作成・実行
npx expo run:android   # Android開発ビルドの作成・実行
npx expo prebuild      # ネイティブコード生成

# E2Eテスト (Detox)
npx detox build --configuration ios.sim.debug    # iOS E2Eテスト用ビルド
npx detox test --configuration ios.sim.debug     # iOS E2Eテスト実行
npx detox build --configuration android.emu.debug # Android E2Eテスト用ビルド
npx detox test --configuration android.emu.debug  # Android E2Eテスト実行

# デバッグ・ユーティリティ
node scripts/testing/test-database.js              # データベース接続テスト
node scripts/testing/test-review-system.js         # 復習システム単体テスト
node scripts/testing/test-answer-service.js        # 解答サービステスト
node scripts/testing/test-mock-exam-system.js      # 模試システムテスト
node scripts/testing/test-statistics-system.js     # 統計システムテスト
node scripts/data/insert-sample-questions.js       # サンプル問題データ投入
node scripts/testing/web-smoke-test.js             # Web版スモークテスト
scripts/utilities/ensure-english.sh                # 入力言語を英語に切り替え（macOS）
```

## コードアーキテクチャ

### プロジェクト構造

```
├── app/               # Expo Router - ファイルベースルーティング
│   ├── (tabs)/       # タブナビゲーション（学習・復習・統計・模試等）
│   ├── question/     # 動的ルート（問題詳細）
│   ├── mock-exam.tsx # 模試実行画面
│   └── _layout.tsx   # ルートレイアウト
├── src/              # メインソースコード
│   ├── data/         # データアクセス層
│   ├── services/     # ビジネスロジック層
│   ├── components/   # UIコンポーネント
│   ├── hooks/        # カスタムReactフック
│   ├── context/      # React Contextプロバイダー
│   ├── types/        # TypeScript型定義
│   ├── theme/        # デザインシステム
│   └── utils/        # ユーティリティ・ヘルパー
├── scripts/         # 開発・テスト用スクリプト
│   ├── testing/     # テスト関連スクリプト
│   ├── data/        # データ生成・操作スクリプト
│   ├── utilities/   # ユーティリティスクリプト
│   ├── dev-tools/   # 開発ツール
│   └── data-tools/  # データ操作ツール
├── __tests__/       # 単体・統合テスト
├── e2e/             # Detox E2Eテスト
└── docs/            # プロジェクト文書
    ├── analysis/        # 分析レポート
    ├── development-logs/ # 開発ログ
    ├── engineering/     # エンジニアリング文書
    └── architecture/    # アーキテクチャ設計
```

### src/層構造

```
src/
├── data/              # データアクセス層
│   ├── database.ts    # SQLite接続・サービス
│   ├── repositories/  # Repositoryパターン（CRUD操作）
│   ├── migrations/    # データベーススキーマ管理
│   └── models/        # データモデル定義
├── services/          # ビジネスロジック層
│   ├── answer-service.ts     # 解答処理・採点
│   ├── review-service.ts     # 復習アルゴリズム・優先度管理
│   ├── statistics-service.ts # 統計計算
│   ├── mock-exam-service.ts  # 模試実行
│   ├── statistics-cache.ts   # 統計キャッシュ
│   └── memory-optimizer.ts   # メモリ最適化
├── components/        # UIコンポーネント
│   ├── ui/           # 再利用可能UIコンポーネント
│   ├── layout/       # レイアウトコンポーネント
│   ├── feedback/     # エラーバウンダリ・ローディング状態
│   ├── onboarding/   # オンボーディング関連
│   └── help/         # ヘルプシステム
├── hooks/            # カスタムReactフック
├── context/          # React Contextプロバイダー
├── types/            # TypeScript型定義
├── theme/            # テーマ・デザインシステム
├── constants/        # アプリ定数
└── utils/            # ユーティリティ・ヘルパー
```

### 主要パターン

**Repository Pattern**: すべてのデータベースアクセスは `src/data/repositories/` 内のリポジトリを経由します。共通のCRUD操作にはベースリポジトリを使用してください。

**Service層**: ビジネスロジックは `src/services/` 内のサービスに分離されています。コンポーネントはリポジトリを直接呼び出さず、サービスを呼び出してください。

**TypeScriptパス**: クリーンなインポートのためにパスエイリアスを使用:

- `@/*` → `src/*` (一般的なパス)
- `@/components/*` → `src/components/*`
- `@/services/*` → `src/services/*`
- `@/types/*` → `src/types/*`

**エラーハンドリング**: `src/utils/error-handler.ts` の集中エラーハンドラーを使用してください。すべての非同期操作は `safeAsyncOperation` でラップしてください。

**コンポーネント構造**:

- TypeScript付き関数コンポーネントを使用
- Propsインターフェースを明示的に定義
- スタイルには StyleSheet.create() を使用
- 適切なローディング・エラー状態を実装

## データベーススキーマ

アプリは10個の主要テーブルを持つSQLiteを使用:

- `questions` - 問題内容とメタデータ
- `learning_history` - ユーザーの解答記録
- `review_items` - 復習対象項目（優先度付き）
- `mock_exams` - 模試定義
- `mock_exam_results` - 模試完了記録
- `categories` - 問題カテゴリ管理
- `account_items` - 勘定科目マスタ
- `user_progress` - 学習進捗管理
- `mock_exam_questions` - 模試問題関連
- `app_settings` - アプリ設定

**重要**: データベースアクセスには必ずリポジトリ層を使用してください。コンポーネント内で生SQLを書いてはいけません。

**データベースマイグレーション**: `src/data/migrations/` でスキーマ変更を管理。新しいマイグレーションは連番で作成し、`migration-manager.ts` で実行。

**サンプルデータ**: 開発用のサンプル問題は `src/data/sample-questions.ts`、模試は `src/data/sample-mock-exams.ts` で管理。サンプルデータは `src/data/migrations/index.ts` の `loadSampleData()` 関数で自動読み込みされます。

## テスト戦略

**テスト計画**: 詳細なテスト戦略・手順は `docs/engineering/test-plan.md` を参照
**単体テスト**: Jest + React Testing Library を使用し `__tests__/` 内に配置
**統合テスト**: リポジトリ-サービス間の統合をテスト
**E2Eテスト**: 重要なユーザーフロー用のDetoxテストを `e2e/` ディレクトリに配置
**アクセシビリティテスト**: a11y準拠のため jest-axe を使用

**テストピラミッド**: 単体テスト(70%) > 統合テスト(25%) > E2Eテスト(5%)

特定のテストタイプの実行は上記の「よく使う開発コマンド」セクションを参照してください。

## 主要開発ガイドライン

**コードスタイル:**

- TypeScript strictモードを使用
- ESLint設定に従う（TypeScript + React Nativeルール）
- コンポーネントにはPascalCase、関数・変数にはcamelCaseを使用
- コンポーネントにはdefault exportと併せてnamed exportを推奨

**パフォーマンス:**

- 重い処理には最適化コンポーネント（\*.optimized.tsx）を使用
- 大きなコンポーネントツリーには遅延読み込みを実装（LazyComponent参照）
- 高負荷計算はサービス内でキャッシュ（statistics-cache.ts参照）
- 大きなデータセットにはページネーションを使用
- メモリ最適化: `memory-optimizer.ts` を使用してメモリ使用量を監視・制御
- データベース最適化: `database-optimized.ts` と `base-repository.optimized.ts` を重い処理に使用

**状態管理:**

- グローバル状態（テーマ、ユーザー設定）にはReact Contextを使用
- コンポーネントレベルの状態ロジックにはカスタムフックを使用
- ビジネスロジックはコンポーネント内ではなくサービス内に保持

**データフロー:**
コンポーネント → カスタムフック → サービス → リポジトリ → データベース

**CBT（Computer-Based Testing）システム:**
このアプリの核心は簿記検定試験のCBT形式に対応した問題形式です:

- **仕訳問題**: 複数の仕訳エントリを入力する形式
- **帳簿問題**: 仕訳から帳簿への転記問題
- **試算表問題**: 勘定残高を計算する問題

**復習システムのアルゴリズム:**
間隔反復学習に基づく優先度システムを実装:

1. 問題の誤答回数に基づく基本スコア
2. 時間経過による減衰処理
3. 連続正解による優先度減点
4. カテゴリ別の重要度ボーナス
5. 連続2回正解で復習対象から除外（「克服済み」）

## 特別なファイル・設定

**TypeScript**: `tsconfig.json` - strictモードとパスマッピングで設定
**Jest**: `jest.config.js` - React Nativeプリセットとカスタム変換設定
**ESLint**: `.eslintrc.js` - TypeScript + React Nativeルール
**Expo**: `app.json` - ルータープラグイン付きアプリ設定
**Detox**: `.detoxrc.js` - E2Eテスト設定（iOS/Android対応）
**Babel**: `babel.config.js` - React Native + TypeScript変換
**Metro**: `metro.config.js` - React Nativeバンドラー設定

## テーマシステム

**統一されたデザインシステム**: `src/theme/` ディレクトリで管理

- `colors.ts` - カラーパレット定義
- `typography.ts` - フォントスタイル定義
- `spacing.ts` - マージン・パディング統一
- `ThemeContext.tsx` - テーマ状態管理

**重要**: 新しいUIコンポーネントは必ずテーマシステムから値を取得してください。

## 開発ワークフロー

1. **機能開発**: 適切なサブディレクトリにコンポーネント作成、サービスにビジネスロジック実装、テスト追加
2. **データベース変更**: `src/data/migrations/` にマイグレーション追加、リポジトリメソッド更新
3. **UIコンポーネント**: `src/components/ui/` の既存パターンに従い、テーマシステムを使用
4. **テスト**: 実装と併せてテストを作成、アクセシビリティ準拠を確保

## 重要な注意事項

- このアプリは完全オフライン - ネットワークリクエストを行ってはいけません
- すべてのデータはSQLiteにローカル保存する必要があります
- プライバシーが重要 - 個人データは収集しません
- UI全体で日本語テキストサポートが必須です
- アプリは間隔反復アルゴリズムを復習スケジューリングに使用します

## シミュレーター操作ガイドライン

**重要**: Claude Codeでシミュレーター動作確認を行う際は、以下のガイドラインを**厳格に遵守**してください：

### 座標ベース操作の禁止

- **x, y座標を使った直接的なタップ・クリック操作は絶対に行わないでください**
- `tap`, `click_on_screen_at_coordinates` 等の座標指定ツールの使用を禁止します
- スクリーンショットから目視で座標を推測する操作も禁止です

### 推奨するアクセス方法

1. **UI階層ベースのアクセス**:

   ```bash
   # 良い例: UI要素の説明テキストやラベルでアクセス
   mobile_list_elements_on_screen  # 要素一覧を取得
   mobile_click_on_element_by_text "学習を開始"  # テキストベース
   ```

2. **describe_ui ツールの活用**:

   ```bash
   # UI構造を理解してからアクセス
   mcp__xcodebuild__describe_ui --simulatorUuid "SIMULATOR_UUID"
   ```

3. **アクセシビリティID・TestID の利用**:
   ```bash
   # 開発時に設定されたテストIDを使用
   mobile_click_on_element_by_id "learning_start_button"
   ```

### 許可される操作

- `mobile_list_elements_on_screen` - 画面要素の取得
- `mobile_click_on_element_by_text` - テキスト内容によるクリック
- `mobile_click_on_element_by_id` - ID指定によるクリック
- `mcp__xcodebuild__describe_ui` - UI構造の詳細取得
- `mobile_press_button` - ハードウェアボタン操作
- `mobile_swipe_on_screen` - スワイプジェスチャー（方向指定）

### 動作確認の推奨フロー

1. **画面構造の理解**: `describe_ui`でUI階層を把握
2. **要素の特定**: `list_elements_on_screen`で操作対象を確認
3. **安全な操作**: テキストやIDベースでの要素操作
4. **結果の確認**: 操作後の画面状態を再度確認

この方針により、座標変化に依存しない安定したテスト自動化を実現し、UI変更に対する耐性を確保します。

## ナビゲーション構造

**メインタブ (app/(tabs)/):**

1. **home.tsx** - ホーム画面（統計サマリー・学習継続日数）
2. **learning.tsx** - 学習画面（新規問題の学習）
3. **review.tsx** - 復習画面（間違えた問題の優先復習）
4. **statistics.tsx** - 統計画面（詳細な学習進捗）
5. **mock-exams.tsx** - 模試一覧画面

**問題解答フロー:**

- 学習/復習タブ → 問題選択 → `app/question/[id].tsx` で解答
- 模試タブ → 模試選択 → `app/mock-exam.tsx` で時間制限付き解答

---

## 復習システムの動作原理

このアプリの核心機能である復習システムの理解が重要です:

**復習アイテム作成の流れ:**

1. ユーザーが学習タブで問題に正解 → 復習対象にならない
2. ユーザーが学習タブで問題に不正解 → `review_items` テーブルに復習アイテム作成
3. 復習タブでは `review_items` テーブルから復習対象問題を優先度順に表示
4. 連続2回正解すると復習アイテムが削除され「克服済み」になる

**重要**: 新規環境では復習タブが空なのは正常な動作です。まず学習タブで間違えた問題がある場合のみ復習タブに表示されます。

**データフローアーキテクチャ:**

```
ユーザー操作 → コンポーネント → カスタムフック → サービス層 → リポジトリ層 → SQLite
                    ↑                                                    ↓
                    └────────────── 状態更新 ←──────────────────────────┘
```

**クリティカルパス（解答処理）:**

1. `app/question/[id].tsx` - 問題画面UI
2. `src/services/answer-service.ts` - 解答の正誤判定・記録
3. `src/services/review-service.ts` - 復習状況の更新
4. `src/data/repositories/review-item-repository.ts` - データベース操作

## よくある問題とトラブルシューティング

**復習タブに問題が表示されない: ✅ 解決済み（2025-08-14）**

**修正内容:**

- データベース強制更新による復習データ削除問題を修正
- `src/data/migrations/index.ts`でforceUpdateフラグをfalseに固定
- ユーザーデータ（learning_history, review_items）の保護を実装

**過去のデバッグ手順（参考）:**

1. `review_items` テーブルのデータを確認: 直接SQLクエリでデバッグ
2. `answer-service.ts` → `review-service.ts` → `review-item-repository.ts` の順でデバッグログを確認
3. 学習タブで意図的に間違えた解答をして、復習アイテム作成プロセスを追跡

**データベース初期化エラー:**

1. SQLite接続確認: `src/data/database.ts` のログを確認
2. マイグレーション実行状況: `src/data/migrations/migration-manager.ts` のログ確認
3. Web環境ではモック実装を使用（`WebDatabaseMock` クラス）

**TypeScript コンパイルエラー:**
多くの最適化ファイル（`*.optimized.tsx`）でTypeScriptエラーが発生することがありますが、これらは開発用最適化版なので、基本版（`*.tsx`）を使用してください。

**パフォーマンス問題:**

- 大量データ処理: `database-optimized.ts` と `base-repository.optimized.ts` を使用
- メモリ使用量監視: `memory-optimizer.ts` でメモリリークをチェック
- 統計計算キャッシュ: `statistics-cache.ts` で重い計算をキャッシュ

## アプリ固有の実装詳細

**Detox E2Eテスト設定:**

- iOS: `BookKeeping3rd.app` (iPhone 12 シミュレーター)
- Android: `app-debug.apk` (Pixel 4 API 30 エミュレーター)
- ワークスペース名に注意: `ios/BookKeeping3rd.xcworkspace`

**Web版の制限事項:**

- SQLiteはモック実装（`WebDatabaseMock`）を使用
- 開発・デバッグ用途のみ、本番利用は想定外
- Expo WebビューでのUI確認が主目的

**アプリ識別子:**

- Bundle ID: `com.example.bookkeepingapp`
- Package Name: `bookkeeping-app`
- Display Name: `簿記3級問題集`
- Project ID: `3` (iOS), `BookKeeping3rd` (Workspace)

**サンプルデータ構成:**

- 仕訳問題: 300問以上（基礎〜応用）
- 帳簿問題: 50問（各種帳簿転記）
- 試算表問題: 20問（合計・残高試算表）
- 模試: 5セット（基礎〜総合レベル）

## データ修正とログ管理

**重要**: 問題データ（master-questions.ts）を修正した後は、必ず修正ログを残してください：

### 修正ログの記録方法

1. **修正内容の記録**：修正スクリプトを作成した場合は `scripts/` ディレクトリに保存
2. **修正履歴ファイルの作成**：`docs/development-logs/` ディレクトリに日付形式のファイル名で記録
   - ファイル名形式: `YYYY-MM-DD-修正内容概要.md`
   - 例: `2025-08-11-question-data-fixes.md`
3. **記録する内容**：
   - 日時
   - 修正対象（問題ID等）
   - 修正内容（正答修正、説明文修正等）
   - 修正理由
   - 実施したスクリプト名
   - 検証結果

### 最新の修正履歴

最新の修正内容は `docs/development-logs/` ディレクトリを参照してください。

**2025-08-14 重要な修正:**

- **復習リスト表示問題の完全修復**: データベース強制更新によるユーザーデータ削除問題を解決
- **コードベース構造整理**: ドキュメントとスクリプトファイルの論理的再配置を実行
- **環境変数問題の回避**: `forceUpdate`フラグを一時的にハードコード化

**過去の修正例:**

- `docs/development-logs/2025-08-13-answer-format-japanese-fix.md`
- `docs/development-logs/2025-08-13-subsidiary-book-format-fix.md`

## 最終バリデーション

コード変更後は必ず以下を実行して品質を確保してください：

```bash
npm run check:quick   # TypeScript + ESLint + テスト
```

失敗時は各コマンドを個別実行して問題を特定：

```bash
npx tsc --noEmit      # 型エラー確認
npm run lint          # ESLintエラー確認
npm test              # テスト失敗確認
```

## 既知の問題と対処法

**TypeScript コンパイルエラー:**
`npm run check:quick` 実行時に多数のTypeScriptエラーが発生することがありますが、以下の対処を行ってください：

1. 最適化ファイル（`*.optimized.tsx`）のエラーは無視可（開発用の最適化版のため）
2. `node_modules` の型定義エラーは `npm install` で解決
3. 実際の実行には影響しない型エラーも含まれています

**復習タブの分野別弱点表示の不整合:**
`review_items` テーブルの統計クエリで `mastered` ステータスを除外するよう修正済み。`src/data/repositories/review-item-repository.ts` の `getReviewStatistics` メソッドを参照。

**Expo開発サーバーポート競合:**
ポート 8081 が使用中の場合は、既存プロセスを終了：

```bash
kill -9 $(lsof -ti:8081)
```
