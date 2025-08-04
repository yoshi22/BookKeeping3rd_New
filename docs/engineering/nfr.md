# 非機能要件（NFR）

## 1. 要件概要

### 1.1 非機能要件の重要性
簿記3級問題集アプリは、学習者の継続的な学習をサポートする必要があり、以下の非機能要件が学習体験に直接影響します：

- **応答性**: 学習の集中を妨げない高速な応答
- **信頼性**: 学習データの確実な保存・復旧
- **使いやすさ**: あらゆるユーザーが利用可能なアクセシビリティ
- **プライバシー**: 個人情報の完全保護

### 1.2 品質特性の優先順位
1. **ユーザビリティ** - 学習継続の要
2. **パフォーマンス** - 学習体験の質
3. **信頼性** - データ保護・可用性
4. **セキュリティ** - プライバシー保護
5. **保守性** - 長期運用の実現

## 2. パフォーマンス要件

### 2.1 応答時間要件

#### 2.1.1 UI応答時間
| 操作 | 目標時間 | 最大許容時間 | 根拠 |
|---|---|---|---|
| アプリ起動 | 2秒以内 | 3秒以内 | 学習開始への即座性 |
| 画面遷移 | 0.5秒以内 | 1秒以内 | スムーズな操作感 |
| 問題表示 | 1秒以内 | 2秒以内 | 学習リズムの維持 |
| 解答記録 | 0.3秒以内 | 0.5秒以内 | 即座のフィードバック |
| 解説表示 | 0.5秒以内 | 1秒以内 | 学習フローの継続 |

#### 2.1.2 データ処理時間
| 処理 | 目標時間 | 最大許容時間 | 測定条件 |
|---|---|---|---|
| 問題検索 | 80ms以内 | 150ms以内 | 302問データベース |
| 復習リスト生成 | 250ms以内 | 400ms以内 | 100問の復習対象 |
| 統計計算 | 400ms以内 | 800ms以内 | 1000回の解答履歴 |
| 模試結果計算 | 200ms以内 | 500ms以内 | 18問の模試解答 |
| データバックアップ | 1.5秒以内 | 3秒以内 | 全学習データ |

### 2.2 スループット要件

#### 2.2.1 同時処理能力
```typescript
// 想定される同時処理シナリオ
interface ConcurrentOperations {
  // 問題表示中の解答記録処理
  problemDisplay: boolean
  answerRecording: boolean
  
  // 統計計算とデータ保存の並行処理
  statisticsCalculation: boolean
  dataPersistence: boolean
  
  // バックグラウンド処理
  dataCleanup: boolean
  cacheUpdate: boolean
}
```

#### 2.2.2 データ処理量（新コンテンツ構成対応）
- **問題データ**: 302問 × 平均2KB = 604KB
  - 仕訳: 250問 × 2KB = 500KB
  - 帳簿: 40問 × 2.5KB = 100KB
  - 試算表: 12問 × 3KB = 36KB
- **模試データ**: 5セット × 18問 × 2.2KB = 198KB
- **学習履歴**: 10,000回解答 × 120B = 1.2MB
- **復習データ**: 150問 × 250B = 37.5KB
- **統計データ**: 3分野 + 5模試 × 1.5KB = 12KB

### 2.3 パフォーマンス監視

#### 2.3.1 監視指標
```typescript
interface PerformanceMetrics {
  // 応答時間メトリクス
  responseTime: {
    average: number    // 平均応答時間
    p95: number       // 95パーセンタイル
    p99: number       // 99パーセンタイル
  }
  
  // リソース使用量
  memory: {
    current: number   // 現在使用量
    peak: number      // ピーク使用量
    limit: number     // 制限値
  }
  
  // エラー率
  errorRate: {
    database: number  // DB操作エラー率
    ui: number       // UI操作エラー率
  }
}
```

## 3. 可用性・信頼性要件

### 3.1 可用性目標

#### 3.1.1 稼働率要件
| コンポーネント | 目標稼働率 | 許容停止時間/月 | 根拠 |
|---|---|---|---|
| ローカルアプリ | 99.9% | 43分 | 学習継続性確保 |
| データベース | 99.95% | 22分 | 学習データ保護 |
| 全体システム | 99.5% | 3.6時間 | 現実的運用目標 |

#### 3.1.2 障害対応目標
| 障害レベル | 検出時間 | 復旧時間 | 対応方法 |
|---|---|---|---|
| 軽微（UIエラー） | 即座 | 1分以内 | 自動リトライ |
| 中程度（DB接続） | 30秒以内 | 5分以内 | キャッシュ利用 |
| 重大（データ破損） | 1分以内 | 10分以内 | バックアップ復元 |

### 3.2 データ整合性

#### 3.2.1 データ保護レベル
```sql
-- ACID特性の確保
BEGIN TRANSACTION;
  INSERT INTO learning_history (...);
  UPDATE review_items SET ...;
  UPDATE user_progress SET ...;
COMMIT;

-- データ検証制約
CREATE TRIGGER validate_answer_consistency
BEFORE INSERT ON learning_history
FOR EACH ROW
BEGIN
  SELECT CASE
    WHEN NEW.user_answer NOT IN ('A', 'B', 'C', 'D') THEN
      RAISE(ABORT, 'Invalid answer format')
    WHEN NEW.answer_time_ms <= 0 THEN
      RAISE(ABORT, 'Invalid answer time')
  END;
END;
```

#### 3.2.2 バックアップ・復旧
| バックアップ種別 | 頻度 | 保存期間 | 復旧時間目標 |
|---|---|---|---|
| 自動バックアップ | 学習終了時 | 30日 | 1分以内 |
| 手動バックアップ | ユーザー操作時 | 無制限 | 3分以内 |
| 緊急復旧 | 障害検出時 | 7日 | 5分以内 |

### 3.3 エラーハンドリング

#### 3.3.1 エラー分類・対応
```typescript
enum ErrorLevel {
  INFO = 'info',       // 情報レベル
  WARN = 'warn',       // 警告レベル
  ERROR = 'error',     // エラーレベル
  FATAL = 'fatal'      // 致命的レベル
}

interface ErrorHandlingStrategy {
  detection: string    // 検出方法
  recovery: string     // 復旧方法
  userImpact: string   // ユーザー影響
  monitoring: string   // 監視方法
}

const errorStrategies: Record<string, ErrorHandlingStrategy> = {
  'database_lock': {
    detection: 'SQLite BUSY エラー',
    recovery: '指数バックオフリトライ',
    userImpact: '短時間の応答遅延',
    monitoring: 'エラーカウント・応答時間'
  },
  'data_corruption': {
    detection: 'データ整合性チェック',
    recovery: 'バックアップからの復元',
    userImpact: '学習データの部分的損失',
    monitoring: '整合性チェック結果'
  }
}
```

## 4. セキュリティ要件

### 4.1 プライバシー保護

#### 4.1.1 データ収集制限
```typescript
// 収集禁止データ
interface ForbiddenData {
  // 個人識別情報
  personalInfo: never
  email: never
  phoneNumber: never
  
  // デバイス固有情報
  deviceId: never
  advertisingId: never
  
  // 位置情報
  location: never
  ipAddress: never
}

// 収集可能データ（匿名化済み）
interface AllowedData {
  // 学習統計（個人特定不可）
  studyStats: {
    questionsAnswered: number
    accuracy: number
    studyTime: number
  }
  
  // アプリ使用統計
  usageStats: {
    sessionCount: number
    featureUsage: Record<string, number>
  }
}
```

#### 4.1.2 データ暗号化
| データ種別 | 暗号化方式 | キー管理 | 対象 |
|---|---|---|---|
| 学習履歴 | AES-256 | Keychain/Keystore | 高感度データ |
| 設定情報 | なし | - | 一般設定 |
| バックアップ | AES-256 + 圧縮 | ユーザー管理 | エクスポートデータ |

### 4.2 アクセス制御

#### 4.2.1 アプリ内セキュリティ
```typescript
// セキュリティレベル定義
enum SecurityLevel {
  PUBLIC = 0,      // 公開データ
  INTERNAL = 1,    // アプリ内データ
  SENSITIVE = 2    // 機密データ
}

// データアクセス制御
class DataAccessControl {
  private checkAccess(data: any, requiredLevel: SecurityLevel): boolean {
    // アクセス権限チェック
    return this.getCurrentSecurityLevel() >= requiredLevel
  }
  
  async readUserData(): Promise<UserData> {
    if (!this.checkAccess(null, SecurityLevel.INTERNAL)) {
      throw new SecurityError('Insufficient access level')
    }
    // データ読み取り処理
  }
}
```

### 4.3 セキュリティ監視

#### 4.3.1 異常検知
```typescript
interface SecurityEvent {
  type: 'unauthorized_access' | 'data_tampering' | 'unusual_activity'
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
  details: Record<string, any>
}

class SecurityMonitor {
  detectAnomalousActivity(activity: UserActivity): SecurityEvent[] {
    const events: SecurityEvent[] = []
    
    // 異常な解答パターンの検出
    if (activity.answersPerMinute > 10) {
      events.push({
        type: 'unusual_activity',
        severity: 'medium',
        timestamp: new Date(),
        details: { reason: 'Unusually fast answering rate' }
      })
    }
    
    return events
  }
}
```

## 5. ユーザビリティ要件

### 5.1 アクセシビリティ要件

#### 5.1.1 WCAG 2.1 準拠
| ガイドライン | レベル | 具体要件 | 検証方法 |
|---|---|---|---|
| 知覚可能 | AA | コントラスト比4.5:1以上 | カラーコントラストチェッカー |
| 操作可能 | AA | タッチターゲット44×44px以上 | デザインレビュー |
| 理解可能 | AA | 明確なエラーメッセージ | ユーザビリティテスト |
| 堅牢 | AA | スクリーンリーダー対応 | VoiceOver/TalkBack テスト |

#### 5.1.2 多様なユーザーへの対応
```typescript
// アクセシビリティ設定
interface AccessibilitySettings {
  // 視覚サポート
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  highContrast: boolean
  reduceMotion: boolean
  
  // 聴覚サポート
  soundEnabled: boolean
  hapticFeedback: boolean
  
  // 運動機能サポート
  largeButtons: boolean
  extendedTimeouts: boolean
}

// 動的UI調整
class AccessibleUI {
  applySettings(settings: AccessibilitySettings): void {
    // フォントサイズ調整
    this.adjustFontSize(settings.fontSize)
    
    // コントラスト調整
    if (settings.highContrast) {
      this.applyHighContrastTheme()
    }
    
    // アニメーション制御
    if (settings.reduceMotion) {
      this.disableAnimations()
    }
  }
}
```

### 5.2 国際化対応

#### 5.2.1 多言語サポート準備
```typescript
// 文字列リソース構造
interface LocalizedStrings {
  ja: Record<string, string>    // 日本語（メイン）
  en?: Record<string, string>   // 英語（将来対応）
}

// 数値・日付フォーマット
class LocalizationService {
  formatNumber(value: number, locale: string = 'ja-JP'): string {
    return new Intl.NumberFormat(locale).format(value)
  }
  
  formatDate(date: Date, locale: string = 'ja-JP'): string {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    }).format(date)
  }
}
```

### 5.3 新コンテンツ構成対応アクセシビリティ要件

#### 5.3.1 コンテンツアクセシビリティ
```typescript
// 新コンテンツ構成対応アクセシビリティ
interface ContentAccessibility {
  // 分野別アクセシビリティ
  categories: {
    journal: {
      totalQuestions: 250
      screenReaderLabel: '仕訳問題 250問'
      navigationAnnouncement: '仕訳分野に移動しました'
      progressFormat: '250問中{current}問完了'
    }
    
    ledger: {
      totalQuestions: 40
      screenReaderLabel: '帳簿問題 40問'
      navigationAnnouncement: '帳簿分野に移動しました'
      progressFormat: '40問中{current}問完了'
    }
    
    trialBalance: {
      totalQuestions: 12
      screenReaderLabel: '試算表問題 12問'
      navigationAnnouncement: '試算表分野に移動しました'
      progressFormat: '12問中{current}問完了'
    }
  }
  
  // 模試アクセシビリティ
  mockExams: {
    totalSets: 5
    setStructure: '15問(仕訳) + 2問(帳簿) + 1問(試算表)'
    timeAnnouncement: '残り時間1分です'
    sectionTransition: '第{section}問に進みます'
    completionAnnouncement: '模試が完了しました。得点は{score}点です'
  }
}
```

#### 5.3.2 コンテンツ量に対応したナビゲーション
```typescript
// コンテンツボリューム対応ナビゲーション
interface VolumeAwareNavigation {
  // 仕訳250問のナビゲーション
  journalNavigation: {
    chunkSize: 25  // 25問ずつのブロックで表示
    jumpToQuestion: boolean  // 問題番号でジャンプ
    patternBasedGrouping: boolean  // パターン別グルーピング
    bookmarkSupport: boolean  // ブックマーク機能
  }
  
  // 帳簿40問のナビゲーション
  ledgerNavigation: {
    categorySubdivision: 4  // 4カテゴリ × 10問
    typeBasedFiltering: boolean  // 帳簿種別フィルタ
  }
  
  // 試算表12問のナビゲーション
  trialBalanceNavigation: {
    difficultyLevels: 3  // 3レベル × 4問
    templateBasedGrouping: boolean  // テンプレート別グルーピング
  }
}
```

#### 5.3.3 模試時間管理アクセシビリティ
```typescript
// 模試時間管理アクセシビリティ
interface MockExamTimeAccessibility {
  // 時間アナウンス設定
  timeAnnouncements: {
    intervals: [30, 15, 10, 5, 1]  // 分単位でのアナウンス
    format: '残り時間{minutes}分{seconds}秒です'
    urgencyLevel: {
      normal: 'minutes > 10'      // 通常アナウンス
      warning: 'minutes <= 10'    // 警告音付き
      critical: 'minutes <= 5'    // 重要な警告
    }
  }
  
  // セクション遷移サポート
  sectionTransition: {
    announcement: '第{section}問に移ります。{questions}問あります'
    remainingTime: 'このセクションの推奨時間は{time}分です'
    progress: '{total}問中{current}問目です'
  }
  
  // 見直しサポート
  reviewSupport: {
    unAnsweredAlert: '未回答の問題が{count}問あります'
    flaggedQuestions: 'チェックを付けた問題が{count}問あります'
    navigationShortcuts: 'ナビゲーションショートカットが利用できます'
  }
}
```

### 5.4 学習UX要件

#### 5.4.1 学習継続性サポート（新コンテンツ構成対応）
| 要件 | 目標 | 測定方法 | 改善指標 |
|---|---|---|---|
| 学習開始の容易さ | 3タップ以内で学習開始 | 操作ログ分析 | タップ数削減 |
| 中断・再開の自然さ | 任意のタイミングで中断可能 | ユーザーテスト | 継続率向上 |
| 進捗の可視性 | 学習状況が即座に把握可能 | 認知負荷測定 | 理解時間短縮 |
| モチベーション維持 | 適切なフィードバック提供 | 継続利用率 | リテンション向上 |

#### 5.3.2 エラー防止・回復
```typescript
// エラー防止機能
interface ErrorPrevention {
  // 操作確認
  confirmCriticalActions: boolean
  
  // 入力支援
  inputValidation: boolean
  autoSave: boolean
  
  // 状態復旧
  sessionRestore: boolean
  dataRecovery: boolean
}

// ユーザーフレンドリーエラー処理
class UserFriendlyError {
  translateError(error: SystemError): UserError {
    return {
      title: this.getLocalizedTitle(error.code),
      message: this.getLocalizedMessage(error.code),
      actions: this.getRecoveryActions(error.code),
      severity: this.mapSeverity(error.level)
    }
  }
}
```

## 6. 保守性・拡張性要件

### 6.1 コード品質要件

#### 6.1.1 静的品質指標
| 指標 | 目標値 | 測定ツール | 頻度 |
|---|---|---|---|
| テストカバレッジ | 80%以上 | Jest | ビルド毎 |
| 複雑度 | 10以下/関数 | ESLint | ビルド毎 |
| 重複コード | 5%以下 | SonarJS | 週次 |
| 技術的負債 | B評価以上 | SonarQube | 月次 |

#### 6.1.2 アーキテクチャ品質
```typescript
// 依存関係の制御
interface DependencyRules {
  // レイヤー間の依存方向
  presentation: ['business', 'data']  // プレゼンテーション → ビジネス → データ
  business: ['data']                   // ビジネス → データ
  data: []                            // データ層は他に依存しない
}

// モジュール分離度
interface ModuleCohesion {
  cohesion: 'high'     // 高い凝集度
  coupling: 'low'      // 低い結合度
  responsibility: 'single'  // 単一責任
}
```

### 6.2 変更容易性

#### 6.2.1 設定の外部化
```typescript
// 環境別設定
interface AppConfiguration {
  database: {
    maxConnections: number
    queryTimeout: number
    enableWAL: boolean
  }
  
  ui: {
    animationDuration: number
    debounceTime: number
    maxItemsPerPage: number
  }
  
  features: {
    enableAdvancedStats: boolean
    enableExportFeature: boolean
    maxBackupFiles: number
  }
}
```

#### 6.2.2 プラグイン機能
```typescript
// 拡張可能なアーキテクチャ
interface Plugin {
  name: string
  version: string
  initialize(): Promise<void>
  destroy(): Promise<void>
}

// 統計プラグインの例
class AdvancedStatsPlugin implements Plugin {
  name = 'advanced-stats'
  version = '1.0.0'
  
  async initialize(): Promise<void> {
    // 高度な統計機能を追加
  }
}
```

## 7. 運用要件

### 7.1 監視・ログ要件

#### 7.1.1 ログレベル・出力先
| レベル | 出力先 | 保存期間 | 用途 |
|---|---|---|---|
| DEBUG | 開発環境のみ | 1日 | デバッグ情報 |
| INFO | ローカルファイル | 7日 | 一般的な動作ログ |
| WARN | ローカルファイル | 30日 | 警告・注意事項 |
| ERROR | ローカルファイル | 90日 | エラー・例外 |

#### 7.1.2 構造化ログ形式
```typescript
interface LogEntry {
  timestamp: string        // ISO 8601形式
  level: LogLevel
  component: string        // コンポーネント名
  message: string         // ログメッセージ
  context?: Record<string, any>  // 追加コンテキスト
  error?: {
    name: string
    message: string
    stack?: string
  }
}

// ログ例
const logExample: LogEntry = {
  timestamp: '2025-01-27T10:30:00.000Z',
  level: 'ERROR',
  component: 'DatabaseService',
  message: 'Failed to save learning progress',
  context: {
    questionId: 'Q001',
    userId: 'anonymous-12345',
    attemptCount: 3
  },
  error: {
    name: 'SQLiteError',
    message: 'Database is locked'
  }
}
```

### 7.2 配布・更新要件

#### 7.2.1 アプリ配布
| プラットフォーム | 配布チャネル | 更新頻度 | 承認期間 |
|---|---|---|---|
| iOS | App Store | 月次 | 2-7日 |
| Android | Google Play | 月次 | 1-3日 |

#### 7.2.2 データ移行
```typescript
// バージョン間のデータ移行
interface MigrationScript {
  fromVersion: string
  toVersion: string
  migrate(data: any): Promise<any>
}

const migrations: MigrationScript[] = [
  {
    fromVersion: '1.0.0',
    toVersion: '1.1.0',
    async migrate(data) {
      // 復習アイテムテーブルに新カラム追加
      return await this.addColumn('review_items', 'last_reviewed_at', 'DATETIME')
    }
  }
]
```

## 8. 制約・前提条件

### 8.1 技術的制約

#### 8.1.1 プラットフォーム制約
| 制約項目 | iOS | Android | 影響 |
|---|---|---|---|
| 最小OS版本 | iOS 12.0+ | Android 8.0+ | 開発API制限 |
| ストレージ容量 | 100MB以下 | 100MB以下 | データ設計制約 |
| メモリ使用量 | 50MB以下 | 100MB以下 | パフォーマンス制約 |
| CPU使用率 | 20%以下 | 30%以下 | 処理効率要求 |

#### 8.1.2 開発制約
```typescript
// 外部依存関係の制限
interface DependencyConstraints {
  // 必須ライブラリのみ使用
  required: [
    'react-native',
    'react-native-sqlite-storage',
    '@react-navigation/native'
  ]
  
  // 使用禁止ライブラリ
  forbidden: [
    'react-native-firebase',  // プライバシー要件に反する
    'analytics-libraries'     // データ収集禁止
  ]
}
```

### 8.2 運用制約

#### 8.2.1 リソース制約
| リソース | 制限 | 理由 | 対策 |
|---|---|---|---|
| 開発チーム | 2-3名 | 予算制約 | 効率的な開発プロセス |
| 開発期間 | 3ヶ月 | 市場投入時期 | MVP優先開発 |
| 運用コスト | 月額5万円以下 | 収益性確保 | サーバーレス設計 |

## 9. 品質保証・テスト要件

### 9.1 テスト戦略

#### 9.1.1 テスト種別・カバレッジ
| テスト種別 | カバレッジ目標 | 実行タイミング | 自動化率 |
|---|---|---|---|
| 単体テスト | 80%以上 | コミット毎 | 100% |
| 結合テスト | 主要フロー100% | プルリクエスト毎 | 80% |
| E2Eテスト | クリティカルパス100% | リリース前 | 60% |
| パフォーマンステスト | 全API | 週次 | 100% |
| アクセシビリティテスト | 全画面 | リリース前 | 40% |

#### 9.1.2 品質ゲート
```typescript
// リリース判定基準
interface ReleaseGate {
  functionalTests: {
    passRate: number      // 95%以上
    criticalBugs: number  // 0件
  }
  
  performance: {
    responseTime: number  // 要件内
    memoryUsage: number   // 制限内
    crashRate: number     // 0.1%以下
  }
  
  security: {
    vulnerabilities: number  // 高リスク0件
    dataLeaks: number       // 0件
  }
  
  accessibility: {
    wcagViolations: number  // レベルAA違反0件
  }
}
```

## 10. NFR検証・監視

### 10.1 継続的監視

#### 10.1.1 監視ダッシュボード
```typescript
interface MonitoringDashboard {
  performance: {
    averageResponseTime: number
    p95ResponseTime: number
    errorRate: number
    memoryUsage: number
  }
  
  quality: {
    crashFreeRate: number
    userSatisfactionScore: number
    featureAdoptionRate: Record<string, number>
  }
  
  security: {
    securityIncidents: number
    dataIntegrityScore: number
    privacyComplianceStatus: boolean
  }
}
```

#### 10.1.2 アラート設定
| 指標 | 警告閾値 | 緊急閾値 | 対応者 |
|---|---|---|---|
| 応答時間 | 2秒 | 5秒 | 開発チーム |
| エラー率 | 1% | 5% | 開発チーム |
| クラッシュ率 | 0.5% | 2% | QAチーム |
| メモリ使用率 | 80% | 95% | インフラチーム |

---

## 更新履歴

| 日付 | バージョン | 変更内容 | 更新者 |
|---|---|---|---|
| 2025-01-27 | 1.0 | 初版作成 | - |

---

**これらの非機能要件は、ユーザーの学習体験を最優先に設定されています。運用開始後は実際の使用状況に基づいて継続的に見直し、最適化を図ります。**