# プロンプトエンジニアリングガイド

## 1. ガイド概要

### 1.1 目的
簿記3級問題集アプリ開発において、GenAIツールを最大限活用するための効果的なプロンプト設計・運用方法を提供する。

### 1.2 対象者
- 開発チーム全員
- AI支援開発を行うエンジニア
- ドキュメント作成者
- テスト設計者

### 1.3 基本原則
- **明確性**: 具体的で曖昧さのない指示
- **文脈提供**: 適切な背景情報の提供
- **段階的アプローチ**: 複雑なタスクの分割
- **反復改善**: フィードバックに基づく改善

## 2. プロンプト設計の基本構造

### 2.1 効果的なプロンプトの構成要素

#### 2.1.1 基本テンプレート
```markdown
# プロンプト基本構造

## 役割設定（Role）
あなたは[具体的な役割]です。

## タスク定義（Task）
[具体的に何をしてほしいか]

## 文脈・制約（Context & Constraints）
- 前提条件: [重要な背景情報]
- 制約事項: [守るべき制限]
- 対象範囲: [作業の範囲]

## 出力形式（Format）
[期待する出力の形式・構造]

## 例示（Examples）
[具体的な例（必要に応じて）]
```

#### 2.1.2 プロンプト設計チェックリスト
```typescript
// プロンプト品質チェックリスト
interface PromptQualityChecklist {
  clarity: {
    specificTask: boolean        // タスクが具体的か
    clearObjective: boolean      // 目的が明確か
    unambiguous: boolean         // 曖昧な表現がないか
    actionable: boolean          // 実行可能な指示か
  }
  
  context: {
    backgroundProvided: boolean  // 必要な背景情報があるか
    constraintsDefined: boolean  // 制約が明確か
    scopeSpecified: boolean      // 作業範囲が特定されているか
    examplesIncluded: boolean    // 例示があるか（必要に応じて）
  }
  
  format: {
    outputStructure: boolean     // 出力形式が指定されているか
    formatConsistent: boolean    // 形式が一貫しているか
    parseableOutput: boolean     // 機械処理可能な形式か
  }
  
  safety: {
    noSensitiveData: boolean     // 機密情報を含まないか
    complianceAware: boolean     // コンプライアンス要件を考慮しているか
    ethicalConsideration: boolean // 倫理的考慮があるか
  }
}
```

## 3. 開発フェーズ別プロンプト例

### 3.1 要件定義・設計フェーズ

#### 3.1.1 要件分析支援
```markdown
# 要件分析プロンプト例

あなたは経験豊富なプロダクトアナリストです。

簿記3級学習アプリの「復習機能」について、以下の初期要件を分析し、詳細化してください。

## 初期要件
- ユーザーが間違えた問題を再度学習できる機能
- 優先度をつけて効率的に復習できる仕組み

## 分析観点
1. 機能要件の詳細化
2. 非機能要件の特定
3. ユーザーシナリオの作成
4. 技術的考慮事項
5. リスク・制約の識別

## 出力形式
- 要件項目ごとに番号付きリストで整理
- 各要件に優先度（高・中・低）を付与
- 実装上の注意点を併記

## 制約
- モバイルアプリであることを考慮
- オフライン利用が前提
- シンプルな UX を重視
```

#### 3.1.2 アーキテクチャ設計相談
```markdown
# アーキテクチャ設計プロンプト例

あなたは経験豊富なモバイルアプリケーションアーキテクトです。

React Native + SQLite を使った学習アプリで、以下の要件を満たすデータ管理アーキテクチャを設計してください。

## 要件
- オフライン完全対応
- 学習履歴の効率的な管理
- 復習優先度の動的計算
- データ整合性の確保

## 検討項目
1. データベーススキーマ設計
2. 状態管理方式
3. データ同期戦略（将来的な拡張）
4. パフォーマンス最適化

## 出力形式
- アーキテクチャ図（テキストベース）
- 主要コンポーネントの説明
- 技術選択の理由
- トレードオフの明示

## 制約
- React Native 0.72+ を使用
- TypeScript で実装
- iOS/Android 両対応
- メモリ使用量は100MB以下
```

### 3.2 実装フェーズ

#### 3.2.1 コード生成
```markdown
# コード生成プロンプト例

TypeScriptで、学習履歴を管理するServiceクラスを作成してください。

## 要件
- クラス名: LearningHistoryService
- データベース: SQLite（react-native-sqlite-storage）
- 主要メソッド:
  1. 解答記録: recordAnswer(questionId, answer, isCorrect, timeMs)
  2. 履歴取得: getHistory(questionId?, limit?)
  3. 統計計算: getStatistics(period?)

## 実装要件
- 完全なエラーハンドリング
- TypeScript型定義を含む
- JSDocコメント付き
- 非同期処理はPromiseベース
- SQLインジェクション対策済み

## コード品質
- SOLID原則に従う
- テスタブルな設計
- 適切な責務分離
- パフォーマンスを考慮

## 出力形式
```typescript
// 生成されたコードをここに記載
// インターフェース定義から実装まで完全なコード
```

## 使用技術
- TypeScript 4.9+
- react-native-sqlite-storage
- 標準的なReact Nativeプロジェクト構成
```

#### 3.2.2 リファクタリング支援
```markdown
# リファクタリングプロンプト例

以下のReactコンポーネントをリファクタリングして、保守性とパフォーマンスを向上させてください。

## 現在のコード
```typescript
[既存のコード部分を貼り付け]
```

## リファクタリング目標
1. 再レンダリングの最適化
2. カスタムフックによる状態管理
3. メモ化の適切な活用
4. TypeScript型安全性の向上
5. アクセシビリティの改善

## 制約
- 既存の機能を維持
- React Native 0.72+ の機能を活用
- パフォーマンスを劣化させない
- テスト可能な構造にする

## 出力
1. リファクタリング後の完全なコード
2. 主な変更点の説明
3. パフォーマンス改善の根拠
4. 今後の拡張性について
```

### 3.3 テスト・QAフェーズ

#### 3.3.1 テストケース生成
```markdown
# テストケース生成プロンプト例

以下のLearningHistoryServiceクラスに対する包括的なテストケースを作成してください。

## 対象コード
```typescript
[テスト対象のコード]
```

## テスト要件
1. 正常系テスト（ハッピーパス）
2. 異常系テスト（エラーケース）
3. 境界値テスト
4. パフォーマンステスト
5. セキュリティテスト

## テストフレームワーク
- Jest + React Native Testing Library
- TypeScript対応
- モック・スタブを適切に使用

## 出力形式
```typescript
// 完全なテストコード
// describe/it構造での整理
// 適切なアサーション
// セットアップ・クリーンアップ含む
```

## 品質基準
- カバレッジ95%以上
- テストの可読性
- 保守しやすいテスト構造
- 実行速度の最適化
```

#### 3.3.2 バグ分析・修正提案
```markdown
# バグ分析プロンプト例

以下のバグレポートを分析し、根本原因と修正方法を提案してください。

## バグ報告
- 症状: [具体的な症状]
- 再現手順: [ステップバイステップ]
- 期待動作: [期待される結果]
- 実際の動作: [実際に起きること]
- 環境: [OS、デバイス、アプリバージョン]

## 関連コード
```typescript
[関連すると思われるコード部分]
```

## 分析項目
1. 根本原因の特定
2. 影響範囲の評価
3. 修正方法の提案
4. テスト方法の提案
5. 再発防止策

## 出力形式
1. **根本原因**: 問題の核心
2. **修正コード**: 具体的な修正内容
3. **テスト**: 修正を検証するテスト
4. **影響評価**: 他への影響
5. **予防策**: 同様の問題の防止方法
```

## 4. ドキュメント作成プロンプト

### 4.1 技術仕様書作成

#### 4.1.1 API仕様書生成
```markdown
# API仕様書生成プロンプト例

以下のTypeScriptインターフェースから、OpenAPI 3.0形式のAPI仕様書を作成してください。

## TypeScript定義
```typescript
[APIインターフェースの定義]
```

## 要件
- OpenAPI 3.0.3形式
- 完全なスキーマ定義
- エラーレスポンスの定義
- 実装例の提供
- セキュリティ要件の記載

## 出力形式
```yaml
openapi: 3.0.3
info:
  title: 簿記3級学習アプリ API
  version: 1.0.0
# 以下、完全な仕様書
```

## 品質要件
- 実装者が理解しやすい
- 自動テスト生成に対応
- バリデーション定義が完全
- セキュリティベストプラクティス準拠
```

#### 4.1.2 ユーザーマニュアル作成
```markdown
# ユーザーマニュアル作成プロンプト例

簿記3級学習アプリの「復習機能」について、エンドユーザー向けの操作マニュアルを作成してください。

## 対象機能
- 間違い問題の確認
- 復習モードでの学習
- 進捗確認・統計表示

## 対象ユーザー
- 簿記3級を目指す学習者
- ITリテラシー：一般的なスマートフォンユーザーレベル
- 年齢層：大学生〜社会人

## マニュアル要件
1. ステップバイステップの操作手順
2. スクリーンショット代替（テキストベース説明）
3. よくある質問・トラブルシューティング
4. 学習効果を高めるコツ

## 出力形式
# マニュアルタイトル
## 1. はじめに
## 2. 基本操作
## 3. 応用的な使い方
## 4. よくある質問
## 5. お問い合わせ

## 文章スタイル
- 分かりやすい日本語
- 専門用語は解説付き
- 具体例を多用
- 読み手に寄り添う表現
```

### 4.2 設計書・仕様書作成

#### 4.2.1 データベース設計書
```markdown
# データベース設計書作成プロンプト例

以下の要件を満たすSQLiteデータベースの設計書を作成してください。

## 機能要件
- 学習履歴の記録・管理
- 復習優先度の計算・更新
- 進捗統計の効率的な算出
- データの整合性確保

## 非機能要件
- レスポンス時間: 1秒以内
- 同時接続: 1（単一ユーザー）
- データ容量: 最大100MB
- 可用性: 99.9%

## 出力構成
1. **ER図**（テキストベース）
2. **テーブル定義**
   - 物理名・論理名
   - カラム定義（型、制約、説明）
   - インデックス設計
3. **関連設計**
   - 外部キー制約
   - 参照整合性
4. **パフォーマンス考慮**
   - インデックス戦略
   - クエリ最適化
5. **運用考慮**
   - バックアップ・復旧
   - データ移行

## 技術制約
- SQLite 3.x
- 正規化第3形式まで
- ACID特性の確保
```

## 5. プロンプト最適化テクニック

### 5.1 段階的プロンプト改善

#### 5.1.1 反復改善プロセス
```typescript
// プロンプト改善サイクル
interface PromptImprovementCycle {
  initial: {
    prompt: string
    expectation: string
    context: string
  }
  
  execution: {
    aiResponse: string
    actualOutput: string
    satisfactionLevel: 1 | 2 | 3 | 4 | 5
  }
  
  analysis: {
    gaps: string[]           // 期待と実際の差分
    ambiguities: string[]    // 曖昧だった部分
    missingContext: string[] // 不足していた文脈
    improvements: string[]   // 改善点
  }
  
  refinement: {
    updatedPrompt: string
    changesExplanation: string
    expectedImprovement: string
  }
  
  validation: {
    retestResult: string
    qualityImprovement: boolean
    finalSatisfaction: 1 | 2 | 3 | 4 | 5
  }
}
```

#### 5.1.2 A/Bテスト手法
```markdown
# プロンプトA/Bテスト例

## 対象タスク
TypeScriptでのバリデーション関数生成

## バージョンA（シンプル版）
```
入力値を検証するTypeScript関数を作成してください。
- 関数名: validateUserInput
- 引数: input (unknown)
- 戻り値: boolean
```

## バージョンB（詳細版）
```
ユーザー入力を検証するTypeScript関数を以下の仕様で作成してください。

**関数仕様:**
- 関数名: validateUserInput
- 引数: input (unknown)
- 戻り値: { isValid: boolean, errors: string[] }

**検証ルール:**
1. 型チェック（string, number, boolean等）
2. 長さ制限（文字列: 1-100文字）
3. フォーマット検証（必要に応じて）

**実装要件:**
- TypeScript strict mode対応
- エラーメッセージは日本語
- JSDocコメント付き
- 単体テストしやすい設計

**出力形式:**
完全に実装可能なTypeScriptコードとして出力
```

## 評価基準
1. コードの完全性
2. 要件への適合度
3. 実装品質
4. 実用性

## 結果比較
- バージョンA結果: [実際の出力]
- バージョンB結果: [実際の出力]
- 優劣判定: [理由付きで評価]
```

### 5.2 文脈エンジニアリング

#### 5.2.1 効果的な文脈設定
```markdown
# 文脈設定のベストプラクティス

## 1. 役割の明確化
❌ 悪い例: 「コードを書いてください」
✅ 良い例: 「あなたは10年の経験を持つReact Native専門エンジニアです」

## 2. 制約の具体化
❌ 悪い例: 「いい感じのコードで」
✅ 良い例: 「TypeScript strict mode、ESLint準拠、テスト可能な設計で」

## 3. 期待値の明確化
❌ 悪い例: 「関数を作って」
✅ 良い例: 「以下のインターフェースを満たす関数を、エラーハンドリング込みで作成してください」

## 4. 例示による理解促進
❌ 悪い例: 「バリデーション機能」
✅ 良い例: 「例：validateEmail('test@example.com') → {isValid: true, errors: []}」
```

#### 5.2.2 プロジェクト特有の文脈
```markdown
# 簿記3級アプリ専用文脈テンプレート

## プロジェクト文脈
```
このプロジェクトは、簿記3級合格を目指す学習者向けのモバイルアプリです。

**技術スタック:**
- React Native + Expo
- SQLite（ローカルDB）
- TypeScript strict mode

**設計方針:**
- 完全オフライン動作
- プライバシー重視（個人情報収集なし）
- シンプルで分かりやすいUX

**対象ユーザー:**
- 簿記初学者〜中級者
- 年齢層：大学生〜社会人
- ITリテラシー：一般的なスマートフォンユーザーレベル

**主要機能:**
- 問題解答（仕訳・帳簿・試算表）
- 間違い問題の優先復習
- 模試機能
- 学習統計・進捗管理
```

## 使用方法
上記の文脈を各プロンプトの冒頭に追加することで、
プロジェクト特有の要件を考慮した適切な回答を得られます。
```

## 6. 品質保証・検証

### 6.1 プロンプト品質評価

#### 6.1.1 評価フレームワーク
```typescript
// プロンプト品質評価指標
interface PromptQualityMetrics {
  clarity: {
    score: 1 | 2 | 3 | 4 | 5
    criteria: [
      '指示が明確で具体的',
      '曖昧な表現がない',
      '実行可能な内容',
      '理解しやすい構造'
    ]
  }
  
  completeness: {
    score: 1 | 2 | 3 | 4 | 5
    criteria: [
      '必要な情報が網羅されている',
      '文脈・背景が適切に提供されている',
      '制約・条件が明確',
      '期待する出力が定義されている'
    ]
  }
  
  effectiveness: {
    score: 1 | 2 | 3 | 4 | 5
    criteria: [
      '期待する結果が得られる',
      '一貫性のある出力',
      '追加質問が不要',
      '実用的な結果'
    ]
  }
  
  safety: {
    score: 1 | 2 | 3 | 4 | 5
    criteria: [
      '機密情報を含まない',
      'セキュリティリスクがない',
      '倫理的に適切',
      'コンプライアンス準拠'
    ]
  }
}
```

#### 6.1.2 自動品質チェック
```bash
#!/bin/bash
# prompt_quality_check.sh

check_prompt_quality() {
    local prompt_file=$1
    echo "=== プロンプト品質チェック: $prompt_file ==="
    
    # 1. 機密情報チェック
    echo "1. 機密情報チェック"
    if grep -i "password\|secret\|key\|token" "$prompt_file"; then
        echo "警告: 機密情報が含まれている可能性があります"
    else
        echo "OK: 機密情報は検出されませんでした"
    fi
    
    # 2. 構造チェック
    echo "2. 構造チェック"
    if grep -q "## " "$prompt_file"; then
        echo "OK: 適切な構造化がされています"
    else
        echo "注意: 構造化を推奨します"
    fi
    
    # 3. 曖昧な表現チェック
    echo "3. 曖昧表現チェック"
    ambiguous_words=("適当に" "いい感じで" "よろしく" "なんとなく")
    for word in "${ambiguous_words[@]}"; do
        if grep -q "$word" "$prompt_file"; then
            echo "警告: 曖昧な表現が含まれています: $word"
        fi
    done
    
    # 4. 長さチェック
    echo "4. 長さチェック"
    word_count=$(wc -w < "$prompt_file")
    if [ $word_count -gt 1000 ]; then
        echo "注意: プロンプトが長すぎます ($word_count words)"
    else
        echo "OK: 適切な長さです ($word_count words)"
    fi
    
    echo "品質チェック完了"
}

# 使用例
# check_prompt_quality "prompts/code_generation.md"
```

### 6.2 結果検証・改善

#### 6.2.1 出力品質評価
```typescript
// AI出力品質評価
interface AIOutputQuality {
  technical: {
    correctness: 1 | 2 | 3 | 4 | 5      // 技術的正確性
    completeness: 1 | 2 | 3 | 4 | 5     // 完全性
    efficiency: 1 | 2 | 3 | 4 | 5       // 効率性
    maintainability: 1 | 2 | 3 | 4 | 5  // 保守性
  }
  
  usability: {
    readability: 1 | 2 | 3 | 4 | 5      // 可読性
    documentation: 1 | 2 | 3 | 4 | 5    // ドキュメント品質
    testability: 1 | 2 | 3 | 4 | 5      // テスト可能性
    reusability: 1 | 2 | 3 | 4 | 5      // 再利用性
  }
  
  compliance: {
    codingStandards: 1 | 2 | 3 | 4 | 5  // コーディング規約
    security: 1 | 2 | 3 | 4 | 5         // セキュリティ
    performance: 1 | 2 | 3 | 4 | 5      // パフォーマンス
    accessibility: 1 | 2 | 3 | 4 | 5    // アクセシビリティ
  }
  
  overall: {
    satisfaction: 1 | 2 | 3 | 4 | 5     // 総合満足度
    wouldUseAgain: boolean               // 再利用意向
    recommendToOthers: boolean           // 他者推奨意向
  }
}
```

## 7. プロンプトライブラリ

### 7.1 再利用可能プロンプトテンプレート

#### 7.1.1 コード生成テンプレート
```markdown
# 【テンプレート】React Nativeコンポーネント生成

あなたは経験豊富なReact Native開発者です。

以下の仕様でReact Nativeコンポーネントを作成してください。

## コンポーネント仕様
- コンポーネント名: [COMPONENT_NAME]
- 目的・機能: [PURPOSE]
- props: [PROPS_INTERFACE]

## 技術要件
- TypeScript strict mode
- React Native 0.72+
- react-native-reanimated 3.x（アニメーション使用時）
- アクセシビリティ対応必須

## 実装要件
- 関数コンポーネント + hooks
- React.memo で最適化
- PropTypes または TypeScript interface
- JSDoc コメント付き
- スタイルは StyleSheet で定義

## 品質要件
- パフォーマンス最適化
- エラーハンドリング
- テスト可能な構造
- 再利用性を考慮

## 出力形式
```typescript
// 完全に実装されたコンポーネントコード
// 型定義、実装、スタイル、エクスポートまで
```

[使用時は [PLACEHOLDER] を実際の値に置換]
```

#### 7.1.2 テスト生成テンプレート
```markdown
# 【テンプレート】Jest + RTL テスト生成

以下のコンポーネント/関数に対する包括的なテストを作成してください。

## テスト対象
```typescript
[TARGET_CODE]
```

## テスト要件
- 正常系・異常系・境界値テスト
- カバレッジ95%以上
- 実行時間1秒以内
- メンテナンスしやすい構造

## 使用ツール
- Jest
- React Native Testing Library
- @testing-library/jest-native

## テスト種類
1. **レンダリングテスト**
   - 初期表示の確認
   - props による表示変化
   - 状態変化による表示更新

2. **インタラクションテスト**
   - ユーザー操作の検証
   - イベントハンドラーの動作
   - 状態更新の確認

3. **エラーハンドリングテスト**
   - 不正な props の処理
   - 非同期処理のエラー
   - 例外状況での動作

## 出力形式
```typescript
// 完全なテストファイル
// describe/it構造、セットアップ/クリーンアップ含む
```
```

### 7.2 プロジェクト固有プロンプト集

#### 7.2.1 簿記問題生成プロンプト
```markdown
# 簿記3級問題生成プロンプト

あなたは簿記検定の問題作成の専門家です。

日商簿記検定3級の[CATEGORY]問題を以下の仕様で作成してください。

## 問題仕様
- 分野: [CATEGORY] (仕訳/帳簿/試算表)
- 難易度: [DIFFICULTY] (基本/標準/応用)
- 制限時間: [TIME_LIMIT]分
- 形式: 4択問題

## 内容要件
- 日商簿記3級の出題範囲内
- 実務に即した具体的なシナリオ
- 段階的な思考を促す構成
- 誤答肢は学習効果を高める内容

## 品質要件
- 問題文は明確で理解しやすい
- 選択肢は適切な難易度分散
- 解説は理由付きで丁寧
- 関連論点への言及

## 出力形式
```json
{
  "id": "Q[NUMBER]",
  "category": "[CATEGORY]",
  "difficulty": "[DIFFICULTY]",
  "timeLimit": [TIME_LIMIT],
  "question": {
    "text": "問題文",
    "scenario": "具体的な取引内容"
  },
  "choices": {
    "A": "選択肢A",
    "B": "選択肢B", 
    "C": "選択肢C",
    "D": "選択肢D"
  },
  "correctAnswer": "A",
  "explanation": {
    "correct": "正解の理由",
    "incorrect": {
      "B": "Bが間違いの理由",
      "C": "Cが間違いの理由", 
      "D": "Dが間違いの理由"
    },
    "keyPoint": "重要なポイント",
    "relatedTopics": ["関連論点1", "関連論点2"]
  }
}
```

## 注意事項
- 既存問題との重複を避ける
- 著作権に配慮した独自問題
- 最新の会計基準に準拠
```

---

## 更新履歴

| 日付 | バージョン | 変更内容 | 更新者 |
|---|---|---|---|
| 2025-01-27 | 1.0 | 初版作成 | - |

---

**このプロンプトエンジニアリングガイドは、AI技術の進歩とチームの経験蓄積に応じて継続的に更新・改善していきます。効果的なプロンプト設計により、開発効率と品質の向上を実現しましょう。**