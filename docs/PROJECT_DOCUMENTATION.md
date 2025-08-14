# 簿記3級問題集アプリ - プロジェクトドキュメント

## プロジェクト概要

**簿記3級問題集アプリ「確実復習」** - 間違えた問題を確実に潰すシンプルで効果的な学習アプリ

- **コンセプト**: 間違い問題の優先復習による効率的学習
- **価格モデル**: 買い切り型（1,480円）
- **技術**: React Native + SQLite（完全オフライン）
- **プライバシー**: 個人情報非収集・ローカル完結

## 📁 ドキュメント構成

### 🎯 プロダクト仕様

- [`docs/product/PRD.md`](docs/product/PRD.md) - プロダクト要求仕様書
- [`docs/product/user-stories.md`](docs/product/user-stories.md) - ユーザーストーリー・受入基準
- [`docs/product/glossary.md`](docs/product/glossary.md) - プロジェクト用語集

### 🎨 デザイン設計

- [`docs/design/ia.md`](docs/design/ia.md) - 情報アーキテクチャ
- [`docs/design/flows.md`](docs/design/flows.md) - ユーザーフロー設計
- [`docs/design/wireframes.md`](docs/design/wireframes.md) - ワイヤーフレーム設計

### ⚙️ エンジニアリング

- [`docs/engineering/architecture.md`](docs/engineering/architecture.md) - システムアーキテクチャ
- [`docs/engineering/data-model.md`](docs/engineering/data-model.md) - データモデル設計
- [`docs/engineering/nfr.md`](docs/engineering/nfr.md) - 非機能要件
- [`docs/engineering/test-plan.md`](docs/engineering/test-plan.md) - テスト計画書
- [`docs/engineering/adr/`](docs/engineering/adr/) - アーキテクチャ決定記録
  - [`ADR-20250127-db-choice.md`](docs/engineering/adr/ADR-20250127-db-choice.md) - データベース選択
  - [`ADR-20250127-auth.md`](docs/engineering/adr/ADR-20250127-auth.md) - 認証方式選択

### 🚀 運用・リリース

- [`docs/operations/runbook.md`](docs/operations/runbook.md) - 運用ランブック
- [`docs/operations/release-plan.md`](docs/operations/release-plan.md) - リリース計画書

### ⚖️ 法務・セキュリティ

- [`docs/legal/oss-policy.md`](docs/legal/oss-policy.md) - OSS利用ポリシー
- [`docs/legal/security-basics.md`](docs/legal/security-basics.md) - セキュリティ基本方針

### 🤖 GenAI開発ポリシー

- [`docs/genai/ai-development-policy.md`](docs/genai/ai-development-policy.md) - GenAI開発ポリシー
- [`docs/genai/ai-assisted-development-policy.md`](docs/genai/ai-assisted-development-policy.md) - AI支援開発ポリシー
- [`docs/genai/prompt-engineering-guidelines.md`](docs/genai/prompt-engineering-guidelines.md) - プロンプトエンジニアリングガイドライン
- [`docs/genai/prompt-engineering-guide.md`](docs/genai/prompt-engineering-guide.md) - プロンプトエンジニアリングガイド
- [`docs/genai/ai-code-review-guidelines.md`](docs/genai/ai-code-review-guidelines.md) - AI生成コードレビューガイドライン

### 📊 企画・ビジネス

- [`projects/簿記3級問題集アプリ/企画書.md`](projects/簿記3級問題集アプリ/企画書.md) - メインビジネス企画書
- [`ROADMAP.md`](ROADMAP.md) - プロジェクトロードマップ
- [`CHANGELOG.md`](CHANGELOG.md) - 変更履歴

## 🏗️ 開発開始時の準備

### 必読ドキュメント（開発チーム向け）

1. **プロダクト理解**: `docs/product/PRD.md` - 要求仕様の全体把握
2. **技術アーキテクチャ**: `docs/engineering/architecture.md` - システム設計方針
3. **データ設計**: `docs/engineering/data-model.md` - データベース・API設計
4. **セキュリティ要件**: `docs/legal/security-basics.md` - セキュリティ方針・実装要件
5. **GenAI活用**: `docs/genai/ai-development-policy.md` - AI支援開発ガイドライン

### 必読ドキュメント（運用チーム向け）

1. **運用手順**: `docs/operations/runbook.md` - 日常運用・障害対応
2. **リリース計画**: `docs/operations/release-plan.md` - 段階的リリース戦略
3. **品質保証**: `docs/engineering/test-plan.md` - テスト戦略・品質基準

## 🎯 主要設計決定

### アーキテクチャ決定

- **データベース**: SQLite (ローカル完結・プライバシー重視)
- **認証**: なし (完全匿名・プライバシー最優先)
- **状態管理**: React Context + Custom Hooks
- **オフライン対応**: 完全ローカル処理

### 主要機能

- **問題解答**: 800問（仕訳480・帳簿200・試算表120）
- **復習システム**: 間違い問題の優先度管理・連続正解による克服
- **模試機能**: CBT形式・時間制限・合格判定
- **統計表示**: 分野別進捗・学習履歴・弱点分析

## 📈 成功指標

| 指標                   | 初期目標（6ヶ月） | 成長目標（12ヶ月） |
| ---------------------- | ----------------- | ------------------ |
| ダウンロード数         | 1,000件           | 5,000件            |
| 月間アクティブユーザー | 500人             | 2,000人            |
| アプリ評価             | 4.0以上           | 4.3以上            |
| 学習完了率             | 70%以上           | 80%以上            |

## 🚦 開発ステータス

- ✅ **企画・設計フェーズ**: 完了（包括的ドキュメント作成済）
- 🚧 **開発フェーズ**: 進行中（MVP実装段階）
- ⏳ **テストフェーズ**: 未開始
- ⏳ **リリースフェーズ**: 未開始

### 完了項目

- ✅ プロダクト仕様書・ユーザーストーリー・用語集
- ✅ 情報アーキテクチャ・ユーザーフロー・ワイヤーフレーム
- ✅ システムアーキテクチャ・データモデル・非機能要件
- ✅ テスト計画・ADR・運用ランブック
- ✅ セキュリティ方針・OSS利用ポリシー
- ✅ GenAI開発ポリシー・プロンプトガイドライン
- ✅ プロジェクトロードマップ・変更履歴
- ✅ プロジェクト初期セットアップ・Expo環境構築
- ✅ 基本的なアプリ構成・ナビゲーション実装
- ✅ データベース設計・SQLite実装
- ✅ 主要コンポーネント・サービス層実装

## 📞 連絡先・責任者

- **プロダクトオーナー**: [要設定]
- **技術リーダー**: [要設定]
- **デザインリーダー**: [要設定]
- **QAリーダー**: [要設定]

---

**注意**: このプロジェクトは学習効果の最大化とユーザープライバシーの保護を最重要視します。すべての開発・運用活動は関連ドキュメントに記載された方針・基準に従って実施してください。

---

## 重要な姿勢

- **ultrathink** で深く考え、段階的に下書き→検証→改善を繰り返す。
- **最後まで諦めず**、未確定箇所は仮説→検証→明示的TODOの順に収束させる。
- **出典・根拠**は必ずメモし、引用の可否（著作権・利用規約）を都度判断する。

## 重要なポイント

- ultrathinkしてください
- 最後まで諦めず、全力を尽くしてください。-常に、すべてのチャットの最後に、"必要に応じてMCPのchatgpt, context7, puppeteer, serenaを利用します"という文章をつけてください

---

## 🛠️ 技術実装詳細

### 🏗️ プロジェクト構成

```
BookKeeping3rd/
├── app/                    # Expo Router ベースの画面構成
│   ├── (tabs)/            # タブナビゲーション画面
│   │   ├── _layout.tsx    # タブレイアウト定義
│   │   ├── index.tsx      # ホーム画面
│   │   ├── learning.tsx   # 学習画面
│   │   ├── review.tsx     # 復習画面
│   │   └── stats.tsx      # 統計画面
│   ├── question/          # 問題詳細画面
│   │   └── [id].tsx       # 動的ルーティング問題画面
│   ├── _layout.tsx        # ルートレイアウト
│   └── _layout.optimized.tsx # パフォーマンス最適化版レイアウト
├── src/                   # メインソースコード
│   ├── components/        # UIコンポーネント
│   │   ├── AnswerForm.tsx # 解答入力フォーム
│   │   ├── QuestionDisplay.tsx # 問題表示
│   │   ├── QuestionNavigation.tsx # 問題ナビゲーション
│   │   ├── MockExamScreen.tsx # 模試実行画面
│   │   ├── NumberInput.tsx # 数値入力コンポーネント
│   │   ├── AccountDropdown.tsx # 勘定科目選択
│   │   ├── feedback/      # フィードバック系コンポーネント
│   │   ├── help/          # ヘルプシステム
│   │   ├── layout/        # レイアウトコンポーネント
│   │   ├── onboarding/    # オンボーディング
│   │   └── ui/            # 汎用UIコンポーネント
│   ├── data/             # データ層（SQLite・リポジトリ）
│   │   ├── database.ts    # データベース接続・管理
│   │   ├── migrations/    # マイグレーション定義
│   │   ├── models/        # データモデル定義
│   │   ├── repositories/  # Repository Pattern実装
│   │   ├── sample-questions.ts # サンプル問題データ
│   │   └── sample-mock-exams.ts # サンプル模試データ
│   ├── services/         # ビジネスロジック
│   │   ├── answer-service.ts # 解答処理・採点
│   │   ├── review-service.ts # 復習アルゴリズム
│   │   ├── statistics-service.ts # 統計計算
│   │   ├── mock-exam-service.ts # 模試実行
│   │   ├── memory-optimizer.ts # メモリ最適化
│   │   └── statistics-cache.ts # 統計キャッシュ
│   ├── hooks/            # カスタムフック
│   │   ├── useAppInitialization.ts # アプリ初期化
│   │   └── useQuestionNavigation.ts # 問題ナビゲーション
│   ├── types/            # TypeScript型定義
│   │   ├── database.ts   # データベース型定義
│   │   └── models.ts     # ビジネスモデル型定義
│   ├── utils/            # ユーティリティ
│   │   ├── error-handler.ts # エラーハンドリング
│   │   └── validator.ts  # バリデーション
│   ├── theme/            # デザインシステム
│   │   ├── colors.ts     # カラーパレット
│   │   ├── spacing.ts    # スペーシング定義
│   │   └── typography.ts # タイポグラフィ
│   ├── context/          # React Context
│   │   └── ThemeContext.tsx # テーマコンテキスト
│   └── constants/        # 定数定義
├── __tests__/            # テストファイル
│   ├── accessibility/    # アクセシビリティテスト
│   ├── data/            # データ層テスト
│   ├── integration/     # 統合テスト
│   ├── security/        # セキュリティテスト
│   └── utils/           # ユーティリティテスト
├── e2e/                 # E2Eテスト
├── scripts/             # 開発・テスト用スクリプト
├── dev-logs/            # 開発ログ・進捗管理
│   ├── sessions/        # 開発セッション記録
│   ├── progress/        # 進捗トラッカー
│   └── decisions/       # 技術的決定記録
├── docs/                # 設計ドキュメント
└── assets/              # 静的アセット（アイコン等）
```

### 📦 主要技術スタック

#### フロントエンド

- **React Native**: 0.76.9 - ネイティブアプリフレームワーク
- **Expo**: ~52.0.18 - 開発・ビルド・デプロイ統合環境
- **Expo Router**: ~4.0.11 - ファイルベースルーティング
- **TypeScript**: ^5.3.3 - 型安全な開発環境

#### データ・状態管理

- **expo-sqlite**: ~15.2.14 - ローカルSQLiteデータベース
- **@react-native-async-storage/async-storage**: ^2.1.0 - 軽量データ永続化
- **React Context**: 状態管理（外部ライブラリ不使用）

#### ナビゲーション・UI

- **@react-navigation/native**: ^7.1.16 - ナビゲーション
- **@react-navigation/bottom-tabs**: ^7.4.4 - タブナビゲーション
- **react-native-reanimated**: ~3.16.1 - アニメーション

#### 開発・品質管理

- **Jest**: ^29.2.1 - テストフレームワーク
- **@testing-library/react-native**: ^11.0.0 - UIテスト
- **@testing-library/jest-native**: ^5.0.0 - Jest拡張マッチャー
- **ESLint**: ^8.57.0 + TypeScript対応 - 静的解析
- **@typescript-eslint/eslint-plugin**: ^6.0.0 - TypeScript ESLintプラグイン
- **Prettier**: ^3.0.0 - コード整形
- **Detox**: ^20.0.0 - E2Eテストフレームワーク
- **jest-axe**: ^8.0.0 - アクセシビリティテスト
- **ts-jest**: ^29.1.0 - TypeScriptテストトランスパイラー

### 🎯 アーキテクチャパターン

#### データ層（Repository Pattern）

```typescript
src/data/repositories/
├── base-repository.ts           # 基底リポジトリクラス
├── question-repository.ts       # 問題データアクセス
├── learning-history-repository.ts # 学習履歴管理
├── review-item-repository.ts    # 復習アイテム管理
└── mock-exam-repository.ts      # 模試データ管理
```

#### サービス層（Business Logic）

```typescript
src/services/
├── answer-service.ts      # 解答処理・採点ロジック
├── review-service.ts      # 復習アルゴリズム
├── statistics-service.ts  # 統計・進捗計算
├── mock-exam-service.ts   # 模試実行・結果処理
└── memory-optimizer.ts    # メモリ最適化
```

#### プレゼンテーション層（Component Architecture）

```typescript
src/components/
├── QuestionDisplay.tsx     # 問題表示コンポーネント
├── AnswerForm.tsx         # 解答入力フォーム
├── QuestionNavigation.tsx # 問題ナビゲーション
├── MockExamScreen.tsx     # 模試実行画面
├── ui/                    # 汎用UIコンポーネント
└── layout/               # レイアウトコンポーネント
```

### 🔧 開発環境・設定

#### TypeScript設定

- **厳密な型チェック**: `strict: true`
- **パスエイリアス**:
  - `@/*` で src/ 配下を参照
  - `@/components/*` でコンポーネント直接参照
  - `@/services/*` でサービス層直接参照
  - `@/types/*` で型定義直接参照
- **Expo TypeScript Base**: 公式設定を継承
- **設定ファイル**: `tsconfig.json` - noEmit対応、モジュール解決最適化

#### テスト設定

- **Jest Preset**: React Native preset使用
- **Transform設定**: Babel-jest によるTS/JSX変換
- **Transform Ignore**: React Native + Expo モジュール対応
- **モジュール解決**: TypeScriptパスエイリアス対応（`@/` → `<rootDir>/src/`）
- **カバレッジ**: src/ 配下の .ts/.tsx ファイル対象（.d.ts, .stories 除外）
- **テスト環境**: Node.js環境
- **Setup**: jest-setup.js による初期化

#### 品質管理・静的解析

- **ESLint**: TypeScript + React Native 最適化ルール
- **TypeScript ESLint**: @typescript-eslint/parser + plugin
- **Prettier**: ^3.0.0 コード整形統一
- **コンソール警告**: 本番では非表示推奨設定

#### E2Eテスト設定

- **Detox**: React Native E2Eテストフレームワーク
- **テストファイル**: e2e/ ディレクトリ
- **設定**: `.detoxrc.js` による構成管理

### 📱 アプリ設定

#### アプリ情報

- **アプリ名**: 簿記3級問題集「確実復習」
- **バンドルID**: com.bookkeepingapp.app
- **バージョン**: 1.0.0
- **対応OS**: iOS/Android

#### Expo設定

- **向き**: Portrait（縦画面固定）
- **スプラッシュ**: 白背景・アイコン中央配置
- **プラグイン**: expo-router, expo-dev-client

### 🚀 開発コマンド

```bash
# 開発サーバー起動
npm start                # Expo開発サーバー
npm run ios             # iOSシミュレーター
npm run android         # Androidエミュレーター

# 品質管理
npm run lint            # ESLint実行
npm test               # Jestテスト実行

# TypeScript
npx tsc --noEmit       # 型チェックのみ実行
```

### 🏗️ 実装進捗

#### ✅ 完了機能

**基盤・環境構築**

- ✅ Expo + TypeScript環境セットアップ（2025-07-30完了）
- ✅ プロジェクト初期化・依存関係管理
- ✅ ESLint + Prettier 品質管理設定
- ✅ Jest + Testing Library テスト環境構築

**データ基盤**

- ✅ SQLiteデータベース設計・接続実装（2025-08-01完了）
- ✅ マイグレーション管理システム
- ✅ 10テーブル完全実装（問題・学習履歴・復習・模試・統計）
- ✅ Repository Pattern 基底クラス・CRUD操作
- ✅ エラーハンドリング・統一エラーシステム
- ✅ データベーストランザクション・整合性管理

**UI・コンポーネント**

- ✅ タブベースナビゲーション（4画面：ホーム・学習・復習・統計）
- ✅ 問題表示コンポーネント（QuestionDisplay）
- ✅ 解答入力フォーム（AnswerForm）
- ✅ 数値入力コンポーネント（NumberInput）
- ✅ 勘定科目選択（AccountDropdown）
- ✅ 問題ナビゲーション（QuestionNavigation）
- ✅ 模試実行画面（MockExamScreen）
- ✅ エラーバウンダリ・ローディング状態管理
- ✅ レスポンシブレイアウト・最適化版コンポーネント

**ビジネスロジック・サービス**

- ✅ 解答処理・採点サービス（AnswerService）
- ✅ 復習アルゴリズム・優先度管理（ReviewService）
- ✅ 統計計算・進捗管理（StatisticsService）
- ✅ 模試実行・結果処理（MockExamService）
- ✅ メモリ最適化・パフォーマンス管理
- ✅ 統計キャッシュシステム

**カスタムフック・状態管理**

- ✅ アプリ初期化フック（useAppInitialization）
- ✅ 問題ナビゲーションフック（useQuestionNavigation）
- ✅ テーマコンテキスト（ThemeContext）

**テスト・品質保証**

- ✅ 単体テスト基盤（Jest + React Testing Library）
- ✅ データベーステスト（database.test.ts）
- ✅ リポジトリテスト（question-repository.test.ts）
- ✅ 統合テスト（database-integration.test.ts, learning-integration.test.ts）
- ✅ アクセシビリティテスト（accessibility.test.ts）
- ✅ セキュリティテスト（security.test.ts）
- ✅ E2Eテスト設定（Detox + learning-flow.test.ts, mock-exam-flow.test.ts）

**開発支援・運用**

- ✅ 開発ログ・セッション記録システム
- ✅ 進捗トラッカー・工数管理
- ✅ サンプルデータ・テスト用スクリプト群
- ✅ デザインシステム基盤（色・スペーシング・タイポグラフィ）

#### 🚧 開発中機能

- 🚧 UI/UXの詳細調整・デザインシステム統合
- 🚧 アプリ全体のパフォーマンス最適化
- 🚧 ヘルプシステム・オンボーディングフロー
- 🚧 アクセシビリティ完全対応

#### ⏳ 予定機能

- ⏳ 本格的なテストデータ投入・QA検証
- ⏳ アプリストア申請準備・メタデータ作成
- ⏳ ベータテスト・ユーザーフィードバック収集
- ⏳ リリース前最終検証・パフォーマンステスト

## 📊 開発管理・追跡システム

### 🗂️ 開発ログ体系

```
dev-logs/
├── sessions/              # 開発セッション記録
│   ├── setup-20250730.md           # 環境構築セッション
│   ├── database-implementation-20250801.md # DB実装セッション
│   └── [日付].md                   # 各セッションの詳細記録
├── progress/              # 進捗追跡
│   └── progress-tracker.md         # 週次進捗・統計・リスク管理
├── decisions/             # 技術的決定記録
└── testing/               # テスト実行ログ
```

### 📈 開発セッション管理

- **セッション記録**: 各開発セッションの詳細ログ（目標・実装・課題・工数）
- **進捗トラッカー**: 週次進捗・工数実績・品質メトリクス
- **技術的決定**: アーキテクチャ・実装方式の選択理由と経緯
- **工数管理**: 見積もりvs実績・差分分析・改善ポイント

### 🔧 開発支援スクリプト

```
scripts/
├── test-*.js             # 各機能別テストスクリプト
├── insert-sample-questions.js  # サンプルデータ投入
└── test-integration.js   # 統合テスト実行
```

### 📋 実装済みテストケース

- **アクセシビリティ**: A11y基準準拠テスト
- **データベース**: SQLite接続・CRUD・マイグレーション
- **リポジトリ**: Repository Pattern動作確認
- **統合**: データ層↔サービス層連携
- **セキュリティ**: SQLインジェクション・データ漏洩防止
- **E2E**: 学習フロー・模試実行の完全テスト
