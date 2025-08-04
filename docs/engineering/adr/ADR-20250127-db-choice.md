# ADR-20250127: データベース選択

## ステータス
✅ **採用済み** (2025-01-27)

## 文脈（Context）
簿記3級問題集アプリにおいて、以下のデータを永続化する必要がある：

### データ種類
- **問題データ**: 307問の問題文・CBT解答テンプレート・解説（静的データ）
- **勘定科目マスタ**: CBTプルダウンで使用する勘定科目一覧（静的データ）
- **学習履歴**: CBT解答データ（JSON形式・プルダウン選択+数値入力）・正誤・解答時間・検証エラー（動的データ）
- **進捗データ**: 分野別習熟度・復習リスト・統計情報（動的データ）
- **設定データ**: アクセシビリティ設定・アプリ設定（動的データ）

### 要件
- **オフライン完全対応**: ネットワーク接続なしで全機能利用可能
- **高速アクセス**: 問題表示2秒以内、解答記録1秒以内
- **データ整合性**: 学習履歴の確実な保存・復旧
- **プライバシー**: 個人情報の外部送信なし
- **CBT形式対応**: プルダウン項目・JSON解答データの効率的な管理
- **検証機能**: 同一仕訳内勘定科目重複防止・金額一致チェック等のリアルタイム検証
- **プルダウンデータ管理**: 問題タイプ別勘定科目の動的取得・使用済み項目フィルタ

## 選択肢（Options）

### 選択肢1: SQLite（ローカルDB）
**メリット**:
- 完全オフライン対応
- 高速なクエリ実行
- ACID特性による確実なデータ整合性
- React Nativeでの豊富な実装実績
- ローカル完結でプライバシー保護

**デメリット**:
- 複数端末間でのデータ同期困難
- バックアップ・復元の実装が必要
- 複雑なクエリでの性能限界

### 選択肢2: AsyncStorage（Key-Value）
**メリット**:
- シンプルな実装
- React Native標準サポート
- 軽量・高速

**デメリット**:
- 文字列のみ対応（JSON変換必要）
- 複雑なクエリ不可
- データ量増加時の性能劣化
- リレーション管理困難

### 選択肢3: Realm Database
**メリット**:
- オブジェクトDB・直感的なAPI
- 高性能・同期機能
- React Native対応

**デメリット**:
- 学習コスト高
- ライブラリサイズ大
- 依存性増加によるリスク

### 選択肢4: Firebase（クラウドDB）
**メリット**:
- 自動同期・リアルタイム更新
- バックアップ・拡張性

**デメリット**:
- **オフライン要件を満たさない**
- ネットワーク依存
- プライバシー懸念（データ外部送信）

## 決定（Decision）
**SQLite** を採用する。

### 採用理由
1. **要件適合度**: オフライン完全対応・高速アクセス要件を満たす
2. **技術成熟度**: React Nativeでの豊富な実装実績・安定性
3. **データ整合性**: ACID特性による確実なトランザクション処理
4. **プライバシー**: ローカル完結でデータ外部送信なし
5. **性能**: インデックス・最適化による高速クエリ実行

### 実装方針
```typescript
// expo-sqlite を使用（CBT形式対応）
import * as SQLite from 'expo-sqlite'

// CBT解答データのJSON検証
const validateCBTAnswer = (answer: CBTAnswer): boolean => {
  try {
    JSON.parse(JSON.stringify(answer))
    return true
  } catch {
    return false
  }
}

// データベース構造
interface DatabaseSchema {
  questions: QuestionTable           // 問題データ（静的）
  learning_history: HistoryTable    // 学習履歴（動的）
  progress: ProgressTable           // 進捗データ（動的）
  settings: SettingsTable           // 設定データ（動的）
}

// パフォーマンス最適化
class DatabaseService {
  async initializeDatabase() {
    // インデックス作成
    await this.createIndex('idx_question_category', 'questions', 'category')
    await this.createIndex('idx_history_date', 'learning_history', 'created_at')
  }
}
```

## 影響範囲（Consequences）

### ポジティブな影響
- ✅ オフライン要件の完全実現
- ✅ 高速な問題表示・解答記録
- ✅ 学習データの確実な保存
- ✅ プライバシー保護の実現
- ✅ 開発チームの学習コスト最小化

### ネガティブな影響
- ❌ 複数端末間でのデータ同期不可
- ❌ バックアップ・復元機能の独自実装必要
- ❌ 将来的なスケーラビリティ制限

### リスク軽減策
1. **データ同期問題**: 
   - 当面は単一端末利用を前提とする
   - 将来的にはiCloud/GoogleDriveバックアップを検討

2. **バックアップ実装**:
   - JSON形式での簡易エクスポート・インポート機能
   - 自動バックアップの定期実行

3. **性能問題**:
   - 適切なインデックス設計
   - クエリ最適化・定期的な性能測定

## 代替案（Alternatives）
将来的な見直し条件：

### 条件1: 複数端末同期需要の高まり
- **トリガー**: 60%以上のユーザーから同期要望
- **代替案**: SQLite + 独自同期ロジック or Realm同期機能

### 条件2: データ量の大幅増加
- **トリガー**: 問題数が10,000問を超える場合
- **代替案**: 分散DB・NoSQL DBの検討

### 条件3: リアルタイム機能の必要性
- **トリガー**: ソーシャル機能・リアルタイム競争の要望
- **代替案**: Firebase Firestore + オフライン対応

## 関連決定
- [ADR-20250127-auth](./ADR-20250127-auth.md): 認証不要によるシンプル化
- 将来のADR: データ同期方式検討時

## 実装ガイドライン

### 1. テーブル設計
```sql
-- 問題テーブル（静的データ・CBT形式対応）
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  question_type TEXT NOT NULL,  -- 'journal', 'ledger', 'trial_balance'
  question_text TEXT NOT NULL,
  answer_template_json TEXT NOT NULL,  -- CBT解答テンプレート
  correct_answer_json TEXT NOT NULL,   -- 正解データ（勘定科目・金額のJSON）
  explanation TEXT NOT NULL,
  difficulty INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 勘定科目マスタテーブル（CBT用）
CREATE TABLE account_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,  -- '資産', '負債', '純資産', '収益', '費用'
  question_types TEXT NOT NULL,  -- JSON: ['journal', 'ledger']
  sort_order INTEGER NOT NULL
);

-- 学習履歴テーブル（動的データ・CBT形式対応）
CREATE TABLE learning_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id TEXT NOT NULL,
  user_answer_json TEXT NOT NULL,  -- CBT解答データ（JSON形式）
  is_correct BOOLEAN NOT NULL,
  answer_time INTEGER NOT NULL,
  validation_errors_json TEXT,     -- 検証エラー履歴（JSON）
  session_id TEXT,                 -- 学習セッション識別
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions (id)
);
```

### 2. 性能最適化
```typescript
// バッチ操作での性能向上
class DatabaseService {
  async recordAnswersBatch(answers: Answer[]): Promise<void> {
    return this.transaction(async (tx) => {
      for (const answer of answers) {
        await tx.executeSql(INSERT_ANSWER_SQL, [
          answer.questionId, 
          answer.choice, 
          answer.isCorrect, 
          answer.time
        ])
      }
    })
  }
}
```

### 3. エラー処理
```typescript
// データベースエラーの適切な処理
class DatabaseErrorHandler {
  handle(error: SQLError): void {
    switch (error.code) {
      case DATABASE_LOCKED:
        // リトライ処理
        break
      case CONSTRAINT_VIOLATION:
        // データ整合性エラー
        break
      default:
        // 一般的なエラー処理
    }
  }
}
```

---

**この決定は、プロダクトの成長・要件変化に応じて定期的に見直します（次回見直し: 2025年7月）。**