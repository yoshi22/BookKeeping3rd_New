# 勘定科目フィルタリング技術仕様書

## 概要

本仕様書は、簿記3級問題集アプリにおける勘定科目の動的フィルタリング機能の実装仕様を定義します。
現在71個の勘定科目が常に表示される問題を解決し、各問題に関連する10-15個の勘定科目のみを表示する機能を実装します。

## 目的

- 勘定科目選択時間を10-15秒から3-5秒に短縮
- ユーザーの認知負荷を軽減
- 学習効果の向上（関連科目の自然な学習）

## システム構成

### データ構造

#### 1. 問題-勘定科目マッピング

```typescript
interface QuestionAccountMapping {
  questionId: string;           // 問題ID (例: "Q_J_001")
  primaryAccounts: string[];    // 正答科目（必須表示）2-4個
  relatedAccounts: string[];    // 関連科目 5-10個
  supplementaryAccounts?: string[]; // 補完科目 0-3個
  category: AccountCategory;    // 問題カテゴリ
  keywords: string[];          // 問題文のキーワード
}

enum AccountCategory {
  CASH_DEPOSIT = 'cash_deposit',        // 現金・預金系
  MERCHANDISE = 'merchandise',          // 商品売買系
  FIXED_ASSETS = 'fixed_assets',       // 固定資産系
  PAYROLL = 'payroll',                 // 給与・人件費系
  SETTLEMENT = 'settlement',            // 決算整理系
  RECEIVABLES_PAYABLES = 'receivables_payables', // 債権債務系
  OTHER = 'other'                      // その他
}
```

#### 2. カテゴリ定義

```typescript
interface CategoryDefinition {
  category: AccountCategory;
  coreAccounts: string[];      // コア勘定科目
  relatedAccounts: string[];   // 関連勘定科目
  excludeAccounts: string[];   // 明示的に除外する科目
}
```

#### 3. フィルタリング結果

```typescript
interface FilteredAccounts {
  accounts: AccountOption[];    // 表示する勘定科目リスト
  totalCount: number;           // 総数
  hasMore: boolean;            // 「その他」表示の有無
}

interface AccountOption {
  label: string;
  value: string;
  priority: number;  // 表示優先度（1が最高）
  source: 'primary' | 'related' | 'supplementary' | 'other';
}
```

## フィルタリングアルゴリズム

### 3段階フィルタリングプロセス

#### ステップ1: 正答科目の抽出

1. 問題IDから`correct_answer_json`を取得
2. 正答に含まれる勘定科目を抽出
3. 優先度1として設定

#### ステップ2: 関連科目の追加

1. **カテゴリベース選定**
   - 問題のカテゴリを判定
   - カテゴリ定義から関連科目を取得

2. **取引フロー分析**
   - 対になる勘定科目の追加（売掛金↔買掛金など）
   - 決済手段の追加（該当する場合のみ）

3. **キーワードマッチング**（オプション）
   - 問題文から特定キーワードを検出
   - キーワードに関連する科目を追加

#### ステップ3: 補完科目の追加

1. **誤答として出やすい類似科目**
   - 学習効果を高めるため
   - 最大2個まで

2. **取引の代替パターン**
   - 同じ取引の別処理方法で使う科目
   - 最大1個まで

### フィルタリング制約

- 最大表示数: 15個（「その他を表示」を含む）
- 最小表示数: 5個
- 正答科目は必ず含める
- 関連性のない頻出科目は除外

## 実装詳細

### AccountFilterService

```typescript
class AccountFilterService {
  private mappingData: Map<string, QuestionAccountMapping>;
  private categoryDefinitions: Map<AccountCategory, CategoryDefinition>;
  private accountMaster: Map<string, AccountInfo>;

  /**
   * 問題IDから関連勘定科目を取得
   */
  public getFilteredAccounts(
    questionId: string,
    options?: FilterOptions
  ): FilteredAccounts {
    // 実装詳細は別途
  }

  /**
   * カテゴリから関連科目を取得
   */
  private getAccountsByCategory(
    category: AccountCategory
  ): string[] {
    // 実装詳細は別途
  }

  /**
   * 優先度順にソート
   */
  private sortByPriority(
    accounts: AccountOption[]
  ): AccountOption[] {
    // 実装詳細は別途
  }
}
```

### データ初期化

#### 起動時の処理

1. マッピングデータの読み込み
2. メモリキャッシュへの展開
3. 最初の10問分のプリロード

#### 非同期読み込み

1. 残りの問題のマッピングを背景で読み込み
2. 段階的にキャッシュを構築

## キャッシング戦略

### メモリキャッシュ

- LRU（Least Recently Used）方式
- 最大50問分を保持
- TTL: アプリ起動中は永続

### 永続化キャッシュ

- SQLiteに事前計算結果を保存
- アプリ更新時に再構築

## UI統合

### UnifiedAccountSelector コンポーネントの改修

#### Props拡張

```typescript
interface UnifiedAccountSelectorProps {
  // 既存props
  value?: string;
  onChange: (accountName: string) => void;

  // 新規props
  questionId?: string;
  enableFiltering?: boolean;
  maxDisplayCount?: number;
  onShowAll?: () => void;
}
```

#### 「その他を表示」機能

1. フィルタリング結果の最後に配置
2. クリック時は全71個を表示
3. 「フィルタリングに戻る」ボタンを表示

## パフォーマンス要件

- 初期表示: 100ms以内
- フィルタリング処理: 50ms以内
- メモリ使用量増加: 5MB以内

## テスト仕様

### 単体テスト

1. フィルタリングロジックのテスト
2. カテゴリ判定のテスト
3. 優先度ソートのテスト

### 統合テスト

1. 全262問でのフィルタリング動作確認
2. 正答科目の必須表示確認
3. 最大・最小表示数の確認

### パフォーマンステスト

1. 処理時間の測定
2. メモリ使用量の測定
3. 連続操作での安定性確認

## 移行計画

### Phase 1: 基本実装

- 頻出50問に対してフィルタリング適用
- フィードバック収集

### Phase 2: 全面展開

- 全262問への適用
- 最適化とチューニング

### Phase 3: 継続改善

- ユーザー行動分析
- マッピングルールの改善

## リスクと対策

| リスク | 対策 |
|--------|------|
| 必要な科目が表示されない | 正答科目は必ず含める・「その他を表示」オプション |
| パフォーマンス低下 | 事前計算とキャッシング |
| 既存ユーザーの混乱 | 設定でON/OFF可能・デフォルトON |

## 成功指標

- 勘定科目選択時間: 5秒以内
- 「その他を表示」使用率: 3%未満
- ユーザー満足度: 4.5/5.0以上

## 更新履歴

- 2025-09-23: 初版作成