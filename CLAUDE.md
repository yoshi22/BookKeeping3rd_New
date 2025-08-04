# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

このファイルは、Claude Code (claude.ai/code) がこのリポジトリでコード作業を行う際のガイダンスを提供します。

## プロジェクト概要

これは Expo、TypeScript、SQLite で構築された React Native 簿記練習アプリ（簿記3級問題集「確実復習」）です。間違えた問題の反復練習を通してユーザーの簿記習得を支援することに焦点を当てています。最新版では CBT 形式の模試機能が完全実装済みです。

**主要なアーキテクチャ決定:**

- **データベース**: SQLite（ローカルのみ、プライバシー重視）
- **状態管理**: React Context + カスタムフック
- **ナビゲーション**: Expo Router（ファイルベースルーティング）
- **テスト**: Jest + React Testing Library + E2E用Detox
- **パターン**: データアクセス用Repository Pattern + ビジネスロジック用Service層

## よく使う開発コマンド

```bash
# 開発
npm start              # Expo開発サーバー起動
npm run ios           # iOSシミュレーター実行
npm run android       # Androidエミュレーター実行
npm run web           # Web版実行（開発用のみ）

# 品質管理・テスト
npm test              # Jestテスト実行
npm run lint          # ESLint実行
npm run check:quick   # TypeScript型チェック + lint + test (完全な品質チェック)
npx tsc --noEmit      # TypeScript型チェックのみ

# Expoコマンド
npx expo doctor       # 環境セットアップ確認
npx expo run:ios      # iOS開発ビルドの作成・実行
npx expo run:android  # Android開発ビルドの作成・実行
npx expo prebuild     # ネイティブコード生成
```

## コードアーキテクチャ

### プロジェクト構造

```
├── app/               # Expo Router - ファイルベースルーティング
│   ├── (tabs)/       # タブナビゲーション（学習・復習・統計・模試等）
│   ├── question/     # 動的ルート（問題詳細）
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
├── __tests__/        # 単体・統合テスト
├── e2e/             # Detox E2Eテスト
└── docs/            # プロジェクト文書
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

- `@/components/*` → `src/components/*`
- `@/services/*` → `src/services/*`
- `@/types/*` → `src/types/*`
- `@/data/*` → `src/data/*`
- `@/hooks/*` → `src/hooks/*`
- `@/utils/*` → `src/utils/*`
- `@/theme/*` → `src/theme/*`

**エラーハンドリング**: `src/utils/error-handler.ts` の集中エラーハンドラーを使用してください。すべての非同期操作は `safeAsyncOperation` でラップしてください。

**コンポーネント構造**:

- TypeScript付き関数コンポーネントを使用
- Propsインターフェースを明示的に定義
- スタイルには StyleSheet.create() を使用
- 適切なローディング・エラー状態を実装

## データベーススキーマ

アプリは10個の主要テーブルを持つSQLiteを使用:

- `questions` - 問題内容とメタデータ
- `learning_histories` - ユーザーの解答記録
- `review_items` - 復習対象項目（優先度付き）
- `mock_exams` - 模試定義
- `mock_exam_results` - 模試完了記録
- その他5つのサポートテーブル

**重要**: データベースアクセスには必ずリポジトリ層を使用してください。コンポーネント内で生SQLを書いてはいけません。

**データベースマイグレーション**: `src/data/migrations/` でスキーマ変更を管理。新しいマイグレーションは連番で作成し、`migration-manager.ts` で実行。

**サンプルデータ**: 開発用のサンプル問題は `src/data/sample-questions.ts`、模試は `src/data/sample-mock-exams.ts` で管理。

## テスト戦略

**テスト計画**: 詳細なテスト戦略・手順は `docs/engineering/test-plan.md` を参照
**単体テスト**: Jest + React Testing Library を使用し `__tests__/` 内に配置
**統合テスト**: リポジトリ-サービス間の統合をテスト
**E2Eテスト**: 重要なユーザーフロー用のDetoxテストを `e2e/` ディレクトリに配置
**アクセシビリティテスト**: a11y準拠のため jest-axe を使用

**テストピラミッド**: 単体テスト(70%) > 統合テスト(25%) > E2Eテスト(5%)

特定のテストタイプの実行:

```bash
npm test                                    # 全テスト
npm test -- --testPathPattern=data         # データ層テストのみ
npm test -- --testPathPattern=integration  # 統合テストのみ
npm test -- --watch                        # ウォッチモード
npm test -- --coverage                     # カバレッジ付き実行

# E2Eテスト (Detox)
npx detox build --configuration ios.sim.debug    # iOS E2Eテスト用ビルド
npx detox test --configuration ios.sim.debug     # iOS E2Eテスト実行
npx detox build --configuration android.emu.debug # Android E2Eテスト用ビルド
npx detox test --configuration android.emu.debug  # Android E2Eテスト実行
```

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

---

## 重要な姿勢 (Important Approach)

- **ultrathink** で深く考え、段階的に下書き→検証→改善を繰り返す
- **最後まで諦めず**、未確定箇所は仮説→検証→明示的TODOの順に収束させる
- **出典・根拠**は必ずメモし、引用の可否（著作権・利用規約）を都度判断する
- **必ずultrathinkすること** - 複雑な問題は段階的に分析・検証する
- **必要に応じてMCPを利用すること** - 適切なツールを活用して効率的に作業する
- **毎回のチャットの末尾に以下を追加すること** - 必ずultrathinkして、必要に応じてMCP(context7, puppeteer, serena, chatgpt)を利用します

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

### 利用可能なMCPサーバー

- **context7**: ライブラリドキュメント・API仕様の最新情報取得
- **xcodebuild**: iOS/macOS アプリのビルド・テスト・デバイス管理
- **puppeteer**: ウェブブラウザ自動化・スクリーンショット・E2Eテスト
- **serena**: コード解析・構造把握・シンボリック編集
- **chatgpt**: ChatGPT との連携・追加の AI 支援

## ChatGPT MCP 運用ガイド

### 基本的な使用方法

ChatGPT MCPは日本語プロンプトで直接使用可能です。IME自動切替機能により文字化けを最小限に抑制します。

```bash
# 基本的な質問・分析
mcp__chatgpt__ask_chatgpt_tool: "日本語でのプロンプトテキスト"

# 応答取得
mcp__chatgpt__get_chatgpt_response_tool
```

### IME自動切替機能

ChatGPT MCPツール実行前に自動でIMEが英数モードに切り替わります：

- **対象ツール**: `mcp__chatgpt__.*` パターン
- **実行スクリプト**: `scripts/ensure-english.sh`
- **ログ確認**: `.logs/chatgpt/ime-switch.log`

### 推奨運用パターン

1. **文書レビュー・分析**:

   ```
   プロンプト: "以下の文書について分析し、改善点を指摘してください: [文書内容]"
   ```

2. **技術検証・ベストプラクティス確認**:

   ```
   プロンプト: "React Nativeアプリのテスト戦略について、最新のベストプラクティスと比較してください"
   ```

3. **コードレビュー補助**:
   ```
   プロンプト: "以下のテスト計画について、不足している観点や改善の余地を教えてください"
   ```

### トラブルシューティング

**文字化けが発生する場合**:

1. 手動でIME切替: `im-select com.apple.keylayout.ABC`
2. ログ確認: `cat .logs/chatgpt/ime-switch.log`
3. ChatGPTアプリの再起動

**応答が取得できない場合**:

1. ChatGPTアプリが起動しているか確認
2. ネットワーク接続確認
3. MCPサーバーの再起動: Claude Code再起動

### 注意事項

- 長文プロンプトは分割して送信することを推奨
- 技術的な分析には具体的な観点を指定
- 結果は常にClaude Codeで検証・整理する
- 個人情報を含むプロンプトは送信しない
