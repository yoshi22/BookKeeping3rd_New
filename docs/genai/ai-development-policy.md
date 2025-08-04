# GenAI開発ポリシー

## 1. ポリシー概要

### 1.1 目的
簿記3級問題集アプリの開発において、生成AI（GenAI）を安全かつ効果的に活用するためのガイドラインを定める。品質向上と開発効率化を実現しつつ、リスクを適切に管理する。

### 1.2 適用範囲
- アプリケーション開発のすべてのフェーズ
- ドキュメント作成・維持
- コード生成・レビュー
- テスト設計・実行
- 問題解決・調査活動

### 1.3 基本原則
- **人間主導**: AIは支援ツールであり、最終判断は人間が行う
- **品質重視**: AI生成物は必ず人間によるレビュー・検証を実施
- **セキュリティ確保**: 機密情報の適切な保護
- **透明性**: AI利用の明確な記録・開示

## 2. 利用可能なGenAI ツール

### 2.1 承認済みツール

#### 2.1.1 開発支援ツール
| ツール | 用途 | 利用条件 | 制限事項 |
|---|---|---|---|
| GitHub Copilot | コード生成・補完 | 有料ライセンス | 機密情報入力禁止 |
| Claude (Anthropic) | 設計相談・ドキュメント作成 | 公式API利用 | プロジェクト固有情報の制限 |
| ChatGPT (OpenAI) | 一般的な技術相談 | プラス契約 | 詳細仕様の入力禁止 |
| Cursor IDE | 統合開発環境でのAI支援 | 商用ライセンス | プライベートモード使用 |

#### 2.1.2 ドキュメント支援ツール
| ツール | 用途 | 利用条件 | 制限事項 |
|---|---|---|---|
| Grammarly | 英語ドキュメント校正 | ビジネスプラン | 技術仕様書除く |
| DeepL | 翻訳支援 | Pro契約 | 機密度の低い文書のみ |
| Notion AI | 議事録・企画書作成 | ワークスペース契約 | 社外秘情報除く |

### 2.2 禁止ツール・サービス

#### 2.2.1 利用禁止理由
```typescript
// 禁止ツール分類
interface ProhibitedTools {
  dataRetention: {
    description: 'ユーザーデータを学習に利用するツール'
    examples: ['無料版ChatGPT', 'Bard（データ保存設定時）']
    risk: 'プロジェクト情報の外部流出'
  }
  
  unverifiedSecurity: {
    description: 'セキュリティ要件が不明確なツール'
    examples: ['新興AIサービス', 'オープンソースローカルLLM']
    risk: 'データ保護レベルの不透明性'
  }
  
  unlicensedTools: {
    description: 'ライセンス条件が不適切なツール'
    examples: ['著作権侵害の可能性があるコード生成ツール']
    risk: '法的責任・ライセンス違反'
  }
}
```

## 3. 開発フェーズ別AI活用ガイドライン

### 3.1 要件定義・設計フェーズ

#### 3.1.1 許可される利用
```typescript
// 設計フェーズでのAI活用例
interface DesignPhaseAI {
  requirementAnalysis: {
    usage: '要件の整理・分析支援'
    example: 'ユーザーストーリーの詳細化'
    precautions: '具体的な仕様は入力しない'
  }
  
  architectureDesign: {
    usage: 'アーキテクチャパターンの相談'
    example: 'React Nativeアプリの最適な状態管理方法'
    precautions: '汎用的な技術選択のみ相談'
  }
  
  documentDrafting: {
    usage: 'ドキュメントテンプレート生成'
    example: 'PRD・設計書の構造案作成'
    precautions: 'テンプレートのみ、実際の内容は含めない'
  }
}
```

#### 3.1.2 情報取り扱い注意事項
```markdown
# 設計フェーズでの情報取り扱い

## ✅ 入力可能な情報
- 一般的な技術要件（「モバイルアプリでオフライン対応」等）
- 汎用的なアーキテクチャパターン相談
- 公開されている技術情報・ベストプラクティス

## ❌ 入力禁止情報
- 具体的なビジネスロジック
- データベース設計の詳細
- プロジェクト固有の要件
- 競合優位性に関わる情報
```

### 3.2 実装フェーズ

#### 3.2.1 コード生成利用
```typescript
// コード生成ガイドライン
interface CodeGenerationGuidelines {
  allowedUsage: {
    boilerplateCode: {
      description: 'テンプレート・定型コード生成'
      examples: [
        'React Nativeコンポーネントの基本構造',
        'SQLiteセットアップコード',
        'TypeScript型定義の基本形'
      ]
      reviewRequired: true
    }
    
    algorithmImplementation: {
      description: '汎用的なアルゴリズム実装'
      examples: [
        'データソート・フィルタリング',
        '日付・時間計算',
        'バリデーション関数'
      ]
      reviewRequired: true
    }
    
    testCodeGeneration: {
      description: 'テストコードの雛形生成'
      examples: [
        'Jestテストケースの基本構造',
        'モック関数の設定',
        'テストデータ生成'
      ]
      reviewRequired: true
    }
  }
  
  prohibitedUsage: {
    businessLogic: {
      description: 'ビジネス固有のロジック生成'
      examples: [
        '復習優先度計算アルゴリズム',
        '学習データ分析ロジック',
        '独自の暗号化実装'
      ]
      reason: 'プロジェクト固有知識・セキュリティリスク'
    }
    
    sensitiveOperations: {
      description: 'セキュリティに関わる処理'
      examples: [
        '認証・認可ロジック',
        'データ暗号化・復号化',
        'セキュリティヘッダー設定'
      ]
      reason: 'セキュリティリスク・検証困難性'
    }
  }
}
```

#### 3.2.2 コードレビュー要件
```typescript
// AI生成コードのレビュー基準
interface AICodeReviewCriteria {
  mandatory: {
    functionalReview: {
      checkpoints: [
        '要件仕様との整合性',
        '期待する動作の実現',
         'エラーハンドリングの適切性',
        'パフォーマンスへの影響'
      ]
      reviewer: 'シニア開発者'
    }
    
    securityReview: {
      checkpoints: [
        'セキュリティ脆弱性の有無',
        '入力値検証の実装',
        '機密情報の適切な取り扱い',
        'セキュアコーディング原則の遵守'
      ]
      reviewer: 'セキュリティ担当者'
    }
    
    qualityReview: {
      checkpoints: [
        'コーディング規約の遵守',
        '可読性・保守性',
        'テストカバレッジ',
        'ドキュメント化'
      ]
      reviewer: '開発チーム'
    }
  }
  
  documentation: {
    required: [
      'AI生成部分の明確な識別',
      '生成時の プロンプト内容',
      'レビュー結果・修正内容',
      '承認者・承認日時'
    ]
  }
}
```

### 3.3 テスト・QAフェーズ

#### 3.3.1 テスト支援活用
```typescript
// テストフェーズでのAI活用
interface TestPhaseAI {
  testCaseGeneration: {
    usage: 'テストケースの網羅性向上'
    examples: [
      '境界値テストケースの生成',
      '異常系テストシナリオの作成',
      'パフォーマンステスト設計'
    ]
    validation: '実際のテスト実行による検証必須'
  }
  
  testDataCreation: {
    usage: 'テストデータの大量生成'
    examples: [
      '問題データの バリエーション作成',
      '学習履歴の ダミーデータ生成',
      'エッジケース用データ作成'
    ]
    sanitization: '機密情報を含まないダミーデータのみ'
  }
  
  bugAnalysis: {
    usage: 'バグ原因分析の支援'
    examples: [
      'ログ分析・パターン認識',
      '類似事例の調査',
      '修正方針の提案'
    ]
    limitation: '最終判断は人間が実施'
  }
}
```

## 4. セキュリティ・プライバシー要件

### 4.1 情報分類・取り扱い

#### 4.1.1 AI利用時の情報分類
```typescript
// 情報分類別AI利用可否
interface InformationClassification {
  public: {
    description: '公開情報・一般知識'
    aiUsage: '制限なし'
    examples: ['公開API仕様', '技術ドキュメント', 'オープンソースコード']
  }
  
  internal: {
    description: '社内情報・プロジェクト情報'
    aiUsage: '匿名化・抽象化後のみ'
    examples: ['プロジェクト構造（匿名化後）', '技術選択理由', '開発プロセス']
  }
  
  confidential: {
    description: '機密情報・競合優位情報'
    aiUsage: '完全禁止'
    examples: ['ビジネスロジック詳細', 'アルゴリズム実装', 'ユーザーデータ']
  }
  
  restricted: {
    description: '法的制約・規制対象情報'
    aiUsage: '完全禁止'
    examples: ['個人情報', 'セキュリティ実装詳細', '暗号化キー']
  }
}
```

#### 4.1.2 データ匿名化ガイドライン
```typescript
// AI利用時の匿名化方法
interface AnonymizationGuidelines {
  identifierRemoval: {
    targets: ['プロジェクト名', '会社名', '個人名', 'URL']
    replacement: ['Project X', 'Company A', 'Developer 1', 'example.com']
  }
  
  codeAnonymization: {
    variableNames: 'generic_name_1, generic_name_2',
    functionNames: 'processData(), calculateValue()',
    classNames: 'DataProcessor, ValueCalculator'
  }
  
  businessLogicAbstraction: {
    specificAlgorithms: '「優先度計算」→「スコア算出」',
    domainKnowledge: '「簿記3級」→「学習コンテンツ」',
    userActions: '「問題解答」→「ユーザー入力」'
  }
}
```

### 4.2 外部AI サービス利用時の注意事項

#### 4.2.1 データ保護要件
```typescript
// 外部AIサービス利用基準
interface ExternalAIServiceCriteria {
  dataProcessing: {
    requirement: 'データ処理の透明性'
    verification: [
      'プライバシーポリシーの確認',
      'データ利用目的の明確化',
      'データ保存期間の制限',
      'データ削除権の保証'
    ]
  }
  
  dataResidency: {
    requirement: 'データ保存場所の管理'
    preferred: '日本国内・EU圏内',
    prohibited: '規制の不明確な地域'
  }
  
  encryptionInTransit: {
    requirement: 'HTTPS/TLS 1.3以上',
    verification: 'SSL証明書・暗号化方式の確認'
  }
  
  auditability: {
    requirement: '利用ログの記録・監査',
    retention: '最低1年間',
    content: ['利用日時', '利用者', '入力データ概要', '出力結果概要']
  }
}
```

## 5. 品質保証・検証

### 5.1 AI生成物の検証プロセス

#### 5.1.1 多段階検証
```typescript
// AI生成物検証プロセス
interface AIOutputVerification {
  stage1_automated: {
    tools: ['ESLint', 'TypeScript Compiler', 'Unit Tests']
    criteria: ['構文エラーなし', '型エラーなし', '基本動作確認']
    automation: '100%自動化'
  }
  
  stage2_human: {
    reviewer: 'コード作成者以外のエンジニア'
    criteria: [
      'ロジックの正確性',
      'セキュリティ考慮',
      'パフォーマンス影響',
      'コーディング規約準拠'
    ]
    documentation: 'レビュー結果の記録必須'
  }
  
  stage3_integration: {
    scope: '既存システムとの統合テスト'
    criteria: [
      '機能間の整合性',
      'データフロー検証',
      'エラー伝播確認',
      'ユーザビリティ影響'
    ]
    signoff: 'プロジェクトリーダー承認'
  }
}
```

#### 5.1.2 品質メトリクス
```typescript
// AI支援開発の品質指標
interface QualityMetrics {
  codeQuality: {
    aiGeneratedCodeRatio: 'number'  // AI生成コードの割合
    reviewPassRate: 'number'        // レビュー一発通過率
    bugDensity: 'number'           // AI生成コードのバグ密度
    maintainabilityIndex: 'number' // 保守性指標
  }
  
  productivity: {
    developmentSpeedUp: 'number'    // 開発速度向上率
    reviewTime: 'number'           // レビュー時間
    reworkRate: 'number'           // 手戻り率
    timeToMarket: 'number'         // 機能リリースまでの時間
  }
  
  riskMetrics: {
    securityVulnerabilities: 'number'  // セキュリティ脆弱性数
    complianceViolations: 'number'     // コンプライアンス違反数
    dataLeakageIncidents: 'number'     // 情報漏洩インシデント数
  }
}
```

### 5.2 継続的改善

#### 5.2.1 学習・フィードバックループ
```typescript
// AI活用の継続的改善プロセス
interface ContinuousImprovement {
  weeklyReview: {
    participants: ['AI利用者', 'プロジェクトリーダー']
    agenda: [
      'AI生成物の品質評価',
      '利用効率の分析',
      '問題点の特定',
      '改善提案の検討'
    ]
    outcome: '改善アクションアイテム'
  }
  
  monthlyAnalysis: {
    scope: 'AI利用全体の効果測定'
    metrics: ['生産性向上', '品質指標', 'リスク評価']
    deliverable: 'AI活用効果レポート'
  }
  
  quarterlyStrategy: {
    scope: 'AI活用戦略の見直し'
    considerations: [
      '新ツールの評価・導入',
      'ポリシーの更新',
      'チーム教育の改善',
      'プロセスの最適化'
    ]
    output: 'AI活用戦略更新版'
  }
}
```

## 6. 教育・トレーニング

### 6.1 AI活用スキル向上

#### 6.1.1 トレーニングプログラム
```typescript
// AI活用教育カリキュラム
interface AITrainingProgram {
  basicTraining: {
    duration: '4時間'
    target: '全開発者'
    topics: [
      'GenAIの基本概念・能力・限界',
      'プロンプトエンジニアリング基礎',
      'AI生成物の評価・検証方法',
      'セキュリティ・プライバシー要件'
    ]
    assessment: '実技テスト（プロンプト作成・検証）'
  }
  
  advancedTraining: {
    duration: '8時間'
    target: 'シニア開発者・AI活用リーダー'
    topics: [
      '高度なプロンプトテクニック',
      'AI支援開発ワークフロー設計',
      'リスク評価・管理手法',
      'チーム教育・サポート方法'
    ]
    assessment: 'ケーススタディ・実プロジェクト適用'
  }
  
  updateTraining: {
    frequency: '四半期毎'
    duration: '2時間'
    topics: [
      '新ツール・技術の紹介',
      'ポリシー更新内容',
      'ベストプラクティス共有',
      'トラブル事例・対策'
    ]
  }
}
```

#### 6.1.2 実践ガイド・チートシート
```markdown
# AI活用プラクティカルガイド

## 効果的なプロンプト作成
### 基本構造
```
役割: あなたは経験豊富なReact Native開発者です
タスク: SQLiteデータベース接続のセットアップコードを生成してください
制約: 
- TypeScriptで記述
- エラーハンドリングを含む
- react-native-sqlite-storageライブラリ使用
出力形式: 実装可能なコードとして出力
```

### プロンプト改善テクニック
- 具体的で明確な指示
- 期待する出力形式の明示
- 制約・条件の明確化
- 例示による意図の明確化

## コードレビューポイント
### AI生成コードの確認項目
- [ ] 要件との整合性
- [ ] セキュリティ考慮
- [ ] エラーハンドリング
- [ ] パフォーマンス影響
- [ ] 既存コードとの整合性
- [ ] テスト可能性

## トラブルシューティング
### よくある問題と対策
- AI生成コードが動作しない → 最新の構文・ライブラリ確認
- セキュリティ要件を満たさない → 具体的なセキュリティ制約をプロンプトに明記
- 既存システムと整合しない → プロジェクト固有の文脈情報を適切に提供
```

## 7. 監査・コンプライアンス

### 7.1 AI利用の記録・追跡

#### 7.1.1 利用ログ要件
```typescript
// AI利用ログ管理
interface AIUsageLogging {
  requiredFields: {
    timestamp: Date
    user: string
    aiTool: string
    purpose: string
    inputSummary: string      // 機密情報を除く概要
    outputType: string        // コード・ドキュメント・相談等
    reviewStatus: 'pending' | 'approved' | 'rejected'
    reviewer: string
  }
  
  retentionPolicy: {
    duration: '2年間'
    storage: 'セキュアなログサーバー'
    access: '承認された管理者のみ'
  }
  
  auditTrail: {
    frequency: '月次'
    scope: '全AI利用記録'
    output: 'AI利用監査レポート'
  }
}
```

### 7.2 リスク管理・評価

#### 7.2.1 定期リスク評価
```typescript
// AI利用リスク評価
interface AIRiskAssessment {
  technicalRisks: {
    codeQuality: {
      risk: 'AI生成コードの品質問題'
      mitigation: '多段階レビュープロセス'
      monitoring: '品質メトリクス測定'
    }
    
    security: {
      risk: 'セキュリティ脆弱性の見落とし'
      mitigation: 'セキュリティ専門家レビュー必須'
      monitoring: '脆弱性スキャン実施'
    }
    
    dependency: {
      risk: 'AI ツール・サービスへの過度な依存'
      mitigation: '代替手段の確保・スキル維持'
      monitoring: 'AI利用率・依存度測定'
    }
  }
  
  businessRisks: {
    intellectualProperty: {
      risk: '知的財産権侵害'
      mitigation: 'AI生成物の著作権確認'
      monitoring: 'IP侵害監視'
    }
    
    dataLeakage: {
      risk: '機密情報の外部流出'
      mitigation: '情報分類・取り扱い規則遵守'
      monitoring: 'データ利用監査'
    }
    
    skillDegradation: {
      risk: '開発者スキルの低下'
      mitigation: '継続的な教育・トレーニング'
      monitoring: 'スキル評価・成長計画'
    }
  }
}
```

---

## 更新履歴

| 日付 | バージョン | 変更内容 | 更新者 |
|---|---|---|---|
| 2025-01-27 | 1.0 | 初版作成 | - |

---

**このGenAI開発ポリシーは、AI技術の進歩・新ツールの登場・リスク環境の変化に応じて継続的に更新します。全開発者は本ポリシーを理解し、責任を持ってAIツールを活用することが求められます。**