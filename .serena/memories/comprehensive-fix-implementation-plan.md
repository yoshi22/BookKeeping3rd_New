# 包括的修正実装計画
**簿記3級問題集アプリ - 全302問題の戦略文書準拠修正**

## 修正優先度マトリックス

### Phase 1: Critical Issues (即座修正必須)
**Priority: CRITICAL - 影響: 250問**

#### 1.1 第1問Template Type修正 (Q_J_001-250)
- **問題**: 全250問が'ledger_entry'を使用、正しくは'journal_entry'
- **影響**: CBT解答フォームが全問で不適切、仕訳問題として機能不全
- **修正方法**: 
  ```sql
  UPDATE questions 
  SET answer_template_json = REPLACE(answer_template_json, '"type": "ledger_entry"', '"type": "journal_entry"')
  WHERE id LIKE 'Q_J_%';
  ```
- **検証**: validateAnswerTemplates()メソッドで確認

### Phase 2: High Priority Issues (基本機能改善)

#### 2.1 第2問Template Type & Answer Format修正 (Q_L_031-040)
- **問題**: Q_L_031-040が理論問題なのに'ledgerEntry'形式の正答データ
- **影響**: 選択肢問題として機能不全
- **修正方法**: 
  - correct_answer_jsonを選択肢形式に変更
  - `{"ledgerEntry":{"entries":[...]}}` → `{"answers": {"a": "C", "b": "A", "c": "B", "d": "D"}}`

#### 2.2 第1問会計処理エラー修正 (給与・税金分野)
- **問題**: Q_J_153,157,161,165の給与支払仕訳が不正確
- **現在**: `借方「給料」、貸方「現金」` (源泉徴収処理なし)
- **正解**: `借方「給料」、貸方「現金」+「預り金」` (複合仕訳)
- **問題**: Q_J_154,158,162,166の社会保険料処理が不正確
- **修正対象**: 8問の正答データ更新

### Phase 3: Content Diversity Issues (学習効果改善)

#### 3.1 第1問パターン多様性修正
**現在の実装不足**:
- 現金・預金(50問): 4パターンのみ → 必要19パターン不足
- 商品売買(50問): 4パターンのみ → 必要37パターン不足  
- 債権・債務(50問): 4パターンのみ → 必要41パターン不足
- 給与・税金(30問): 4パターンのみ → 必要42パターン不足
- 固定資産(30問): 4パターンのみ → 必要40パターン不足
- 決算整理(40問): 4パターンのみ → 必要40パターン不足

**戦略**:
1. problemsStrategy.mdの詳細パターン要件を満たす新問題データ作成
2. 機械的反復パターンを多様化
3. CBT試験レベルの複合処理問題を追加

#### 3.2 第2問パターン多様性修正
**欠如している重要パターン**:
- 補助簿記入15問: 現金出納帳、当座預金出納帳、売掛金元帳、買掛金元帳、仕入帳、売上帳
- 伝票記入・集計5問: 3伝票制、5伝票制
- 複合取引転記7問: 一つの仕訳から複数勘定への転記

### Phase 4: Minor Improvements (品質向上)

#### 4.1 第3問パターン改善
**改善項目**:
- 6桁精算表作成パターン追加 (現在全て8桁)
- 残高試算表作成パターン追加 (現在全て合計試算表)  
- 損益計算書単独作成パターン追加

## 実装アプローチ

### A. データ駆動修正
1. **master-questions.ts直接編集**
   - Template type修正: 一括置換
   - 正答データ修正: 該当問題の個別修正

2. **修正スクリプト作成**
   ```bash
   scripts/fix-template-types.js      # Phase 1
   scripts/fix-answer-formats.js     # Phase 2.1  
   scripts/fix-accounting-errors.js  # Phase 2.2
   scripts/generate-diverse-patterns.js # Phase 3
   ```

### B. 段階的検証
1. **各Phase完了後の検証**
   - `npm run check:quick` (TypeScript + ESLint + テスト)
   - QuestionRepository.validateAnswerTemplates()実行
   - 実際のCBT解答フォーム動作確認

2. **統合テスト**
   - E2Eテスト: 学習→復習→模試の完全フロー
   - パフォーマンステスト: 302問読み込み性能
   - UIテスト: 各問題タイプの解答フォーム表示

### C. リスク軽減策
1. **段階リリース**
   - Phase 1完了後に中間リリース (critical fix)
   - Phase 2完了後にベータ版リリース
   - Phase 3-4は継続改善

2. **ロールバック準備**
   - 修正前のmaster-questions.tsバックアップ
   - git tag付きコミット管理
   - 修正ログの詳細記録

## 成功指標

### 技術指標
- [ ] validateAnswerTemplates(): 0エラー
- [ ] 全302問のCBT解答フォーム正常動作
- [ ] パターン多様性: 戦略文書要件100%達成

### 学習効果指標  
- [ ] 復習システム正常動作 (間違え→復習対象生成)
- [ ] 模試システム正常動作 (18問構成、時間制限)
- [ ] ユーザー学習フロー完全動作

## 見積工数

| Phase | 作業内容 | 見積時間 | 優先度 |
|-------|---------|---------|--------|
| Phase 1 | Template Type修正 | 2時間 | Critical |
| Phase 2.1 | Answer Format修正 | 4時間 | High |
| Phase 2.2 | 会計処理エラー修正 | 6時間 | High | 
| Phase 3.1 | 第1問パターン多様化 | 40時間 | Medium |
| Phase 3.2 | 第2問パターン多様化 | 16時間 | Medium |
| Phase 4.1 | 第3問品質改善 | 8時間 | Low |
| **合計** | | **76時間** | |

**推奨実行順序**: Phase 1 → Phase 2.1 → Phase 2.2 → Phase 3.1 → Phase 3.2 → Phase 4.1

この計画により、critical issuesを優先解決し、段階的にアプリの品質を向上させる。