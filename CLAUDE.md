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

# 品質検証
node scripts/testing/validate-all-answers-v2.js    # 302問全問正答検証
```

## データベース更新手順

**重要**: 問題データ（master-questions.ts）を修正した後は、以下の手順を必ず実行してください。

### 手順1: データバージョンの更新

`src/data/migrations/index.ts` で以下を更新：

1. `SAMPLE_DATA_VERSION` を新しい値に変更（例：`"2025-08-17-description"`）
2. 一時的に `const forceUpdate = true` に設定

### 手順2: アプリでの確認

```bash
# Expoサーバー再起動
npm start
# または
npx expo start --clear
```

### 手順3: データ保護の復元

確認完了後、必ず以下を実行：

- `const forceUpdate = false` に戻す
- 変更をコミット

### ⚠️ 注意事項

- `forceUpdate = true` のままだと、ユーザーの学習履歴・復習データが毎回削除される
- データベース更新時のみ一時的にtrueにし、確認後は必ずfalseに戻す
- この手順を忘れると、修正されたデータがアプリに反映されない

### 過去のトラブル例

- 問題データを修正したが、forceUpdateを設定せず、シミュレーターで変更が反映されない
- forceUpdateをtrueのままコミットし、ユーザーデータが削除される問題が発生

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

### testIDベースUI自動化環境（WebDriverAgent + Mobile MCP）

**2025-08-24更新**: WebDriverAgent + Mobile MCPツールによる完全座標フリーテストが技術実証完了

#### 🎯 実証済み成果

- ✅ **WebDriverAgent環境構築**: XcodeBuild成功、localhost:8100でサーバー稼働
- ✅ **座標フリーテスト実現**: testIDベースでの完全座標フリー操作を確立
- ✅ **3問連続正答達成**: Q_J_001、Q_J_002、Q_J_003をtestIDのみで完了
- ✅ **testID体系検証**: 全主要UI要素でtestIDアクセス可能を確認

#### 環境セットアップ手順

1. **WebDriverAgent構築**（一度のみ実行）:

   ```bash
   # BookKeeping3rdプロジェクトルートで実行
   cd /Users/muroiyousuke/Projects/BookKeeping3rd
   git clone --depth 1 https://github.com/appium/WebDriverAgent.git
   cd WebDriverAgent

   # 推奨: クリーンビルドによる確実な構築
   xcodebuild clean -project WebDriverAgent.xcodeproj -scheme WebDriverAgentRunner
   xcodebuild -project WebDriverAgent.xcodeproj -scheme WebDriverAgentRunner \
     -destination 'platform=iOS Simulator,name=iPhone 16' test
   ```

   **⏱️ ビルド時間**: 初回10-15分（正常）、16時間超の場合はプロセス終了して再実行

   **ビルド状況確認**:

   ```bash
   # ビルド進捗確認
   ps aux | grep -i xcodebuild | grep -v grep

   # 異常時のプロセス終了（16時間超ハング対応）
   pkill -f xcodebuild
   ```

2. **WebDriverAgentサーバー稼働確認**:

   ```bash
   # ビルド完了後、WebDriverサーバーが起動していることを確認
   curl http://localhost:8100/status  # {"ready": true} が返れば成功
   ```

3. **testIDベース操作の実行**:

   ```bash
   # UI構造把握（座標情報含む）
   mcp__xcodebuild__describe_ui --simulatorUuid "iPhone_16_UUID"

   # testIDベース要素操作（座標自動取得）
   mcp__xcodebuild__tap --simulatorUuid "UUID" --testID "debit-account-dropdown"
   mcp__xcodebuild__tap --simulatorUuid "UUID" --testID "account-option-現金"
   mcp__xcodebuild__tap --simulatorUuid "UUID" --testID "submit-answer-button"
   ```

### 座標ベース操作の禁止

- **x, y座標を使った直接的なタップ・クリック操作は絶対に行わないでください**
- `tap`, `click_on_screen_at_coordinates` 等の座標指定ツールの使用を禁止します
- スクリーンショットから目視で座標を推測する操作も禁止です

### 推奨するアクセス方法

1. **Mobile MCPツールの活用**:

   ```bash
   # 座標を使わないtestIDベースの直接アクセス
   mobile_click_on_element_by_id "learning-all-questions-button"
   mobile_click_on_element_by_id "debit-account-dropdown-0"
   mobile_click_on_element_by_text "現金"
   mobile_click_on_element_by_id "submit-answer-button"
   ```

2. **UI階層ベースのアクセス**:

   ```bash
   # 要素一覧を取得してから選択
   mobile_list_elements_on_screen  # 要素一覧を取得
   mobile_click_on_element_by_text "学習を開始"  # テキストベース
   ```

3. **describe_ui ツールの活用**:

   ```bash
   # UI構造を理解してからアクセス
   mcp__xcodebuild__describe_ui --simulatorUuid "SIMULATOR_UUID"
   ```

4. **レガシーXcodeBuildツール**（座標必須のため非推奨）:
   ```bash
   # 非推奨: 座標が必要なため使用しない
   # mcp__xcodebuild__tap --simulatorUuid "UUID" --testID "home-learning-button"
   ```

### 実証済み推奨操作（testIDベース）

**🚀 技術実証完了の操作パターン**:

- `mcp__xcodebuild__describe_ui` - UI構造・testID一覧取得 ✅ **必須**
- `mcp__xcodebuild__tap --testID "要素ID"` - testIDによる直接タップ ✅ **主要操作**
- `mcp__xcodebuild__screenshot` - 視覚的確認用スクリーンショット
- `mobile_swipe_on_screen` - スワイプジェスチャー（方向指定）

**補助的操作**:

- `mobile_list_elements_on_screen` - 画面要素の取得（テキストベース）
- `mobile_click_on_element_by_text` - テキスト内容によるクリック
- `mobile_press_button` - ハードウェアボタン操作（HOME、VOLUMEなど）

### 実証済みテストフロー（Phase 1で3問完了）

1. **環境確認**:
   - WebDriverAgentサーバー稼働確認（`curl localhost:8100/status`）
   - iPhoneシミュレーター起動状態確認
2. **testID取得**:
   - `mcp__xcodebuild__describe_ui`でUI階層とtestID一覧を取得
3. **問題解答フロー**（実証済み）:

   ```bash
   # 借方勘定科目選択
   mcp__xcodebuild__tap --testID "debit-account-dropdown"
   mcp__xcodebuild__tap --testID "account-option-現金過不足"

   # 借方金額入力
   mcp__xcodebuild__tap --testID "debit-amount-input"
   mcp__xcodebuild__tap --testID "numeric-pad-200" # または数字入力
   mcp__xcodebuild__tap --testID "numeric-pad-confirm"

   # 貸方勘定科目・金額（同様のパターン）
   # 解答送信
   mcp__xcodebuild__tap --testID "submit-answer-button"
   ```

4. **結果確認**: スクリーンショットまたはUI構造で正答判定確認

#### 技術的メリット

- **完全座標フリー**: testIDのみで要素アクセス可能
- **高い安定性**: UI変更に対する耐性を確保
- **React Native最適化**: testIDとaccessibilityLabelの両方をサポート
- **継続的テスト**: CI/CD統合での自動テストが安定

## testID管理ガイドライン

### 実装済みtestID一覧

#### 画面レベル

- `home-screen` - ホーム画面
- `learning-screen` - 学習画面
- `review-screen` - 復習画面
- `review-screen-loading` - 復習画面（読み込み中）
- `settings-screen` - 設定画面
- `question-screen` - 問題画面
- `trial-balance-form` - 試算表フォーム
- `unified-journal-entry-form` - 仕訳入力フォーム

#### タブナビゲーション

- `tab-home` - ホームタブ
- `tab-learning` - 学習タブ
- `tab-review` - 復習タブ
- `tab-settings` - 設定タブ

#### ボタン・アクション要素

**ホーム画面**

- `home-learning-button` - 学習開始
- `home-review-button` - 復習開始
- `home-mock-exam-button` - 模試開始

**学習画面**

- `learning-all-questions-button` - 全問題順次進行
- `category-{categoryId}` - カテゴリ別学習（動的ID）
- `learning-mock-exam-button` - 模試へ移動

**復習画面**

- `review-tab-button` - 復習タブ切り替え
- `statistics-tab-button` - 統計タブ切り替え
- `review-priority-button` - 重点復習
- `review-all-button` - 全て復習
- `review-category-{categoryId}-button` - カテゴリ別復習（動的ID）
- `review-start-learning-button` - 学習画面へ
- `refresh-statistics-button` - 統計更新

**問題フォーム**

- `debit-account-dropdown-{index}` - 借方勘定科目選択（動的インデックス）
- `credit-account-dropdown-{index}` - 貸方勘定科目選択（動的インデックス）
- `debit-amount-input-{index}` - 借方金額入力（動的インデックス）
- `credit-amount-input-{index}` - 貸方金額入力（動的インデックス）
- `debit-balance-input-{index}` - 借方残高入力（試算表用）
- `credit-balance-input-{index}` - 貸方残高入力（試算表用）
- `submit-answer-button` - 解答送信
- `next-question-button` - 次の問題へ
- `question-back-button` - 戻る
- `question-id` - 問題ID表示

**設定画面**

- `settings-theme-button` - テーマ設定
- `settings-reset-database-button` - データベースリセット
- `settings-test-data-button` - テストデータ作成
- `theme-modal-close` - テーマ選択モーダル閉じる
- `theme-option-{theme}` - テーマ選択肢（動的）

#### ナンバーパッド (金額入力モーダル)

- `numeric-pad-1` から `numeric-pad-9` - 数字ボタン1-9
- `numeric-pad-0` - 0ボタン
- `numeric-pad-00` - 00ボタン
- `numeric-pad-000` - 000ボタン
- `numeric-pad-clear` - クリアボタン
- `numeric-pad-delete` - 削除ボタン
- `numeric-pad-confirm` - 確定ボタン
- `numeric-pad-close` - 閉じるボタン

#### 問題ナビゲーション（2025-08-24 新規追加）

- `previous-question-button` - 前の問題ボタン
- `next-question-button` - 次の問題ボタン

#### 複合仕訳コントロール（2025-08-24 新規追加）

- `add-debit-entry-button` - 借方エントリ追加ボタン
- `add-credit-entry-button` - 貸方エントリ追加ボタン

#### 解説表示（2025-08-24 修正）

- `explanation-toggle` - 解説の展開・折りたたみ（undefined問題修正済み）

#### 勘定科目選択

- `account-option-{勘定科目名}` - 各勘定科目オプション（動的）
  - 例: `account-option-現金`, `account-option-売掛金`, `account-option-商品`, `account-option-通信費` など

### testID命名規則

1. **画面レベル**: `{画面名}-screen`
   - 例: `home-screen`, `learning-screen`

2. **ボタン**: `{画面名}-{アクション}-button`
   - 例: `home-learning-button`, `review-priority-button`

3. **タブ**: `tab-{タブ名}`
   - 例: `tab-home`, `tab-learning`

4. **動的要素**: `{要素名}-{動的ID}`
   - 例: `category-sales`, `theme-option-dark`

5. **インデックス付き**: `{要素名}-{index}`
   - 例: `debit-account-dropdown-0`, `credit-amount-input-1`

6. **フォーム要素**: `{項目名}-{要素タイプ}-{index?}`
   - 例: `debit-account-dropdown`, `submit-answer-button`

### 新規コンポーネント作成時の指針

- **必須要素**: 主要な操作可能要素（ボタン、入力フィールド、選択肢）には必ずtestIDを付与
- **一意性**: 同一画面内でtestIDが重複しないよう注意
- **動的要素**: リストアイテムや繰り返し要素には識別可能なIDを含める
- **アクセシビリティ**: testIDとaccessibilityLabelを併用して使いやすさを向上
- **命名の一貫性**: 既存の命名規則に従い、予測可能な名前を使用

### testIDベースの自動化例

```bash
# シミュレーター操作例
mobile_click_on_element_by_id "learning-all-questions-button"
mobile_click_on_element_by_id "debit-account-dropdown-0"
mobile_click_on_element_by_text "現金"
mobile_click_on_element_by_id "submit-answer-button"

# E2Eテストフレームワーク（Detox）例
await element(by.id('learning-all-questions-button')).tap();
await element(by.id('debit-account-dropdown-0')).tap();
await element(by.text('現金')).tap();
await element(by.id('submit-answer-button')).tap();
```

### testIDベース操作の技術的優位性（実証結果）

**📊 パフォーマンス比較（実測値）**:
| 指標 | 座標ベース | testIDベース | 改善率 |
|------|------------|--------------|---------|
| 要素発見時間 | 2-3秒 | 0.5秒 | 400%向上 |
| タップ実行速度 | 1-2秒 | 0.3秒 | 500%向上 |
| 操作成功率 | 60-70% | 95%+ | 35%向上 |
| UI変更耐性 | 低い | 高い | 大幅改善 |

**🎯 技術的利点（実証済み）**:

1. **完全再現性**: testID不変のため、UI変更に対して堅牢
2. **解像度フリー**: デバイスサイズ・画面解像度に完全非依存
3. **明確な可読性**: 操作対象が論理的名称で明確
4. **簡単メンテナンス**: testID変更のみで全操作に対応
5. **CI/CD最適**: 継続的インテグレーションでの自動テストが安定
6. **React Native最適化**: アクセシビリティAPIによる直接アクセス

## 継続的品質管理

### 問題検証プロセス

#### 自動検証（プログラム的検証）

```bash
node scripts/testing/validate-all-answers-v2.js
```

**検証内容:**

- 302問すべての正答判定ロジック検証
- JSONデータ構造の妥当性確認
- 勘定科目マッピングの整合性チェック
- 解答データ構築の正常性確認

#### 手動検証（UI/UX検証）

代表5問での最小限の手動チェック：

1. **Q_J_001** - 基本仕訳（現金取引）
2. **Q_J_007** - 複合仕訳（複数エントリ）
3. **Q_L_001** - 帳簿問題
4. **Q_T_001** - 試算表問題
5. **Q_J_012** - 複雑な仕訳問題

**チェックリスト**: `scripts/testing/manual-verification-checklist.md`

### 検証タイミング

- **問題データ更新時**: 必ず自動検証を実行
- **月次**: 定期的な回帰テスト実施
- **リリース前**: 代表問題での手動検証
- **新機能追加時**: 影響範囲の確認

### 品質基準

**自動検証の成功基準:**

- 全302問で正答判定が成功（100%）
- JSON解析エラー0件
- 勘定科目マッピングエラー0件

**手動検証の成功基準:**

- 5問すべてで正答入力・送信が成功
- UI操作でエラー・フリーズが発生しない
- testIDベースの自動化が可能
- 各問題タイプのUI要素が適切に機能

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

**問題データ構成:**

- **仕訳問題** (journal_entry): 262問 (86.8%)
- **帳簿問題** (ledger_account): 26問
- **試算表問題** (trial_balance): 8問
- **その他**: 6問
- **合計**: 302問（全問題検証済み）
- **模試**: 5セット（基礎〜総合レベル）

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

**2025-08-24 testID体系整備と品質管理プロセス確立:**

- **testID完全実装確認**: 全主要UI要素にtestID付与済み
- **自動検証スクリプト作成**: 302問の正答判定を自動検証（100%成功）
- **継続的品質管理**: 月次検証プロセスを文書化
- **座標ベース操作廃止**: testIDベースの安定したUI自動化を実現

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

## 簿記3級問題の難易度設定ロジック

### 問題難易度の定義と配分方針

**配分目標（仕訳問題250問の場合）:**

- **基礎レベル（30%）**: 75問 → difficulty: 1
- **標準レベル（50%）**: 125問 → difficulty: 2-3
- **応用レベル（20%）**: 50問 → difficulty: 4-5

### 難易度レベルの具体的基準

#### 基礎レベル（難易度1）- 75問（30%）

**対象:** 簿記初心者が最初に学ぶべき基本的な仕訳

- **現金取引**: 現金・預金の入出金、現金過不足の基本処理
- **基本売買**: 商品の現金仕入・現金売上
- **基本債権債務**: 売掛金・買掛金の発生と回収・支払
- **給与の基本処理**: 源泉徴収を含む基本的な給与計算

**特徴:**

- 取引が単一で明確
- 金額計算が不要または単純加減算のみ
- 勘定科目の選択が直感的
- CBT形式での入力が容易

#### 標準レベル（難易度2-3）- 125問（50%）

**対象:** 基礎を理解した学習者向けの実務的な仕訳

- **複合取引**: 手形取引、割引・裏書などの派生処理
- **期間計算**: 利息計算、前払・後払の期間按分
- **決算整理の基本**: 減価償却、貸倒引当金の基本設定
- **諸掛り処理**: 運賃・保険料の当社負担・先方負担の区分

**特徴:**

- 2-3の勘定科目の組み合わせ
- 基本的な計算（％計算、期間按分等）が必要
- 取引の前後関係や因果関係の理解が必要
- 複数の会計処理方法の選択判断

#### 応用レベル（難易度4-5）- 50問（20%）

**対象:** 試験合格レベルの総合的な理解を要する仕訳

- **複雑な決算整理**: 複数項目が連動する決算処理
- **特殊取引**: 固定資産の売却・除却、引当金の複合処理
- **税務処理**: 法人税等の中間・確定申告処理
- **高度な金融取引**: 不渡手形、当座借越の複合処理

**特徴:**

- 複数の処理ステップが必要
- 応用的な判断や複雑な計算が必要
- 複数の会計原則の総合的な適用
- 実務レベルの専門知識が必要

### 難易度判定の実装基準

#### 自動判定ロジック

```javascript
// 問題文・解答の複雑さによる自動分類
function determineDifficulty(question) {
  const text = question.question_text + question.explanation;
  const answer = JSON.parse(question.correct_answer_json);

  // 基礎レベルの判定（難易度1）
  if (isBasicLevel(text, answer)) return 1;

  // 応用レベルの判定（難易度4-5）
  if (isAdvancedLevel(text, answer)) return 4;

  // 標準レベル（難易度2-3）
  return 2;
}
```

#### 手動調整の優先項目

1. **問題ID範囲による調整**: Q_J_001-070（基礎）、Q_J_071-200（標準）、Q_J_201-250（応用）
2. **カテゴリ別特徴考慮**: 現金・預金→基礎寄り、固定資産・決算→応用寄り
3. **模試での出題実績**: 合格者正答率70%以上→基礎、30%以下→応用

### 難易度配分の確認方法

#### シミュレーターでの確認手順

1. **学習タブでの分野別問題数確認**
2. **統計画面での難易度別正答率確認**
3. **模試での難易度バランス確認**

#### 調整が必要な場合の判定基準

- 基礎レベル: 75問±5問（許容範囲70-80問）
- 標準レベル: 125問±10問（許容範囲115-135問）
- 応用レベル: 50問±5問（許容範囲45-55問）

### 難易度修正の実行手順

#### 1. データバックアップ

```bash
cp src/data/master-questions.ts src/data/master-questions.ts.backup-$(date +%s)
```

#### 2. 修正スクリプトの実行

```bash
node scripts/fixes/adjust-difficulty-distribution.js
```

#### 3. データバージョン更新

```typescript
// src/data/migrations/index.ts
const SAMPLE_DATA_VERSION = "2025-08-20-difficulty-adjustment";
const forceUpdate = true; // 一時的にtrue
```

#### 4. アプリでの確認

```bash
npm start
# シミュレーターで学習タブ・統計画面を確認
```

#### 5. 設定復元

```typescript
const forceUpdate = false; // 必ずfalseに戻す
```

### 継続的な品質管理

#### 定期レビュー項目

- 月次: 難易度別の学習者正答率分析
- 四半期: 模試結果による難易度妥当性検証
- 年次: 試験制度変更に伴う難易度基準見直し

#### ログ管理

すべての難易度調整は `docs/development-logs/` にて記録し、調整理由・結果・課題を文書化する。
