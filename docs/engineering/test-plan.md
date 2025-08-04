# テスト計画書

## 1. テスト概要

### 1.1 テストの目的
簿記3級問題集アプリの品質を確保し、ユーザーが安心して学習を継続できるよう、以下の観点から体系的なテストを実施する：

- **機能品質**: 要求仕様通りの動作確認
- **非機能品質**: パフォーマンス・ユーザビリティの確認
- **安全性**: データ保護・プライバシー保護の確認
- **信頼性**: 継続的な学習を支える安定性の確認

### 1.2 テスト方針
- **リスクベーステスト**: 学習継続に影響の大きい機能を重点テスト
- **継続的テスト**: 開発プロセス全体を通じたテスト実施
- **実ユーザー視点**: 学習者の実際の使用パターンを重視
- **自動化優先**: 効率的・継続的な品質保証の実現

### 1.3 品質目標
| 品質特性 | 目標値 | 測定方法 |
|---|---|---|
| 機能適合性 | 要件カバレッジ100% | 要件トレーサビリティ |
| 性能効率性 | 応答時間要件内 | パフォーマンステスト |
| 使用性 | タスク成功率95%以上 | ユーザビリティテスト |
| 信頼性 | クラッシュ率0.1%以下 | 安定性テスト |
| セキュリティ | 脆弱性0件 | セキュリティテスト |

## 2. テスト戦略

### 2.1 テストレベル

#### 2.1.1 テストピラミッド
```
        E2E Tests (5%)
       /              \
      Integration Tests (25%)
     /                      \
    Unit Tests (70%)
```

**単体テスト（70%）**:
- ビジネスロジック・ユーティリティ関数
- データ変換・計算処理
- エラーハンドリング

**結合テスト（25%）**:
- コンポーネント間の連携
- データフロー・状態管理
- API呼び出し

**E2Eテスト（5%）**:
- 主要ユーザーフロー
- クリティカルパス

### 2.2 テスト種別

#### 2.2.1 機能テスト
| テスト種別 | 目的 | 実施タイミング | 自動化率 |
|---|---|---|---|
| 単体テスト | 個別機能の動作確認 | コミット毎 | 100% |
| 結合テスト | モジュール間連携確認 | PR毎 | 80% |
| システムテスト | 全体機能確認 | ビルド毎 | 60% |
| 受入テスト | ユーザー要件確認 | リリース前 | 20% |

#### 2.2.2 非機能テスト
| テスト種別 | 目的 | 実施タイミング | 自動化率 |
|---|---|---|---|
| パフォーマンステスト | 応答時間・スループット | 週次 | 100% |
| ロードテスト | 大量データ処理確認 | リリース前 | 100% |
| ユーザビリティテスト | 使いやすさ確認 | スプリント毎 | 0% |
| アクセシビリティテスト | 利用可能性確認 | リリース前 | 40% |
| セキュリティテスト | 脆弱性・データ保護 | リリース前 | 80% |

## 3. テスト環境・データ

### 3.1 テスト環境

#### 3.1.1 環境構成
| 環境 | 用途 | 構成 | データ |
|---|---|---|---|
| 開発環境 | 単体・結合テスト | 開発端末 | 合成データ |
| テスト環境 | システムテスト | 実機・エミュレータ | テストデータ |
| ステージング環境 | 受入テスト | 本番同等 | 匿名化データ |
| 本番環境 | 本番監視 | 本番 | 実データ |

#### 3.1.2 対象デバイス・OS
```typescript
// テスト対象デバイス
interface TestDevices {
  ios: [
    { device: 'iPhone SE (2nd)', os: 'iOS 14.0' },
    { device: 'iPhone 12', os: 'iOS 15.0' },
    { device: 'iPhone 14', os: 'iOS 16.0' },
    { device: 'iPad (9th)', os: 'iOS 15.0' }
  ]
  
  android: [
    { device: 'Pixel 4', os: 'Android 11' },
    { device: 'Pixel 6', os: 'Android 12' },
    { device: 'Galaxy S21', os: 'Android 12' },
    { device: 'Galaxy Tab S7', os: 'Android 11' }
  ]
}
```

### 3.2 テストデータ

#### 3.2.1 テストデータ分類
```typescript
// テストデータ構造
interface TestDataSet {
  // 問題データ
  questions: {
    valid: QuestionData[]      // 正常な問題データ
    invalid: QuestionData[]    // 異常な問題データ
    edge: QuestionData[]       // 境界値データ
  }
  
  // 学習履歴データ
  learningHistory: {
    normal: HistoryData[]      // 通常の学習パターン
    intensive: HistoryData[]   // 集中学習パターン
    sporadic: HistoryData[]    // 断続的学習パターン
  }
  
  // ユーザーデータ
  users: {
    beginner: UserProfile      // 初心者プロファイル
    intermediate: UserProfile  // 中級者プロファイル
    advanced: UserProfile      // 上級者プロファイル
  }
}
```

#### 3.2.2 データ生成・管理
```typescript
// 新学習コンテンツ構成対応テストデータジェネレータ
class TestDataGenerator {
  // 学習コンテンツ構成定義
  private static readonly CONTENT_CONFIG = {
    journal: { total: 250, patterns: 25, questionsPerPattern: 10 },
    ledger: { total: 40, patterns: 4, questionsPerPattern: 10 },
    trial_balance: { total: 12, patterns: 3, questionsPerPattern: 4 }
  }
  
  // 分野別問題生成
  generateQuestionsByCategory(category: keyof typeof TestDataGenerator.CONTENT_CONFIG): Question[] {
    const config = TestDataGenerator.CONTENT_CONFIG[category]
    const questions: Question[] = []
    
    for (let pattern = 1; pattern <= config.patterns; pattern++) {
      for (let q = 1; q <= config.questionsPerPattern; q++) {
        const questionNumber = (pattern - 1) * config.questionsPerPattern + q
        questions.push({
          id: `Q_${category.toUpperCase().charAt(0)}_${String(questionNumber).padStart(3, '0')}`,
          category_id: category,
          question_text: `${category}テスト問題 パターン${pattern}-${q}`,
          choices_json: JSON.stringify({
            A: `選択肢A (パターン${pattern})`,
            B: `選択肢B (パターン${pattern})`,
            C: `選択肢C (パターン${pattern})`,
            D: `選択肢D (パターン${pattern})`
          }),
          correct_answer: ['A', 'B', 'C', 'D'][questionNumber % 4] as 'A' | 'B' | 'C' | 'D',
          explanation: `${category} パターン${pattern} の解説`,
          difficulty: Math.min(5, Math.floor(questionNumber / config.questionsPerPattern) + 1),
          tags: [`pattern_${pattern}`, category, `difficulty_${Math.floor(questionNumber / 10) + 1}`],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }
    }
    
    return questions
  }
  
  // 全問題セット生成（302問）
  generateFullQuestionSet(): Question[] {
    return [
      ...this.generateQuestionsByCategory('journal'),      // 250問
      ...this.generateQuestionsByCategory('ledger'),       // 40問
      ...this.generateQuestionsByCategory('trial_balance') // 12問
    ]
  }
  
  // 模試用問題セット生成（5セット）
  generateMockExamSets(): MockExam[] {
    const allQuestions = this.generateFullQuestionSet()
    const journalQuestions = allQuestions.filter(q => q.category_id === 'journal')
    const ledgerQuestions = allQuestions.filter(q => q.category_id === 'ledger')
    const trialBalanceQuestions = allQuestions.filter(q => q.category_id === 'trial_balance')
    
    return Array.from({ length: 5 }, (_, i) => ({
      id: `MOCK_${String(i + 1).padStart(3, '0')}`,
      name: `模試セット${i + 1}`,
      description: `レベル${i + 1}の総合模試`,
      time_limit_minutes: 60,
      total_score: 100,
      passing_score: 70,
      questions: {
        section1: {
          question_ids: this.selectRandomQuestions(journalQuestions, 15).map(q => q.id),
          max_score: 60
        },
        section2: {
          question_ids: this.selectRandomQuestions(ledgerQuestions, 2).map(q => q.id),
          max_score: 20
        },
        section3: {
          question_ids: this.selectRandomQuestions(trialBalanceQuestions, 1).map(q => q.id),
          max_score: 20
        }
      },
      created_at: new Date().toISOString()
    }))
  }
  
  // ランダム問題選択
  private selectRandomQuestions(questions: Question[], count: number): Question[] {
    const shuffled = [...questions].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }
  
  // 学習履歴生成（新構成対応）
  generateLearningHistory(sessionCount: number = 10): LearningHistory[] {
    const allQuestions = this.generateFullQuestionSet()
    const history: LearningHistory[] = []
    
    for (let session = 1; session <= sessionCount; session++) {
      const sessionQuestions = this.selectRandomQuestions(allQuestions, 20)
      
      sessionQuestions.forEach((question, index) => {
        history.push({
          id: history.length + 1,
          question_id: question.id,
          user_answer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)] as 'A' | 'B' | 'C' | 'D',
          is_correct: Math.random() > 0.3, // 70%正答率
          answer_time_ms: 30000 + Math.random() * 60000, // 30-90秒
          session_id: `SESSION_${session}`,
          session_type: ['learning', 'review'][Math.floor(Math.random() * 2)] as 'learning' | 'review',
          answered_at: new Date(Date.now() - (sessionCount - session) * 24 * 60 * 60 * 1000).toISOString()
        })
      })
    }
    
    return history
  }
}
```

## 4. 機能テスト詳細

### 4.1 単体テスト

#### 4.1.1 テスト対象・方針
```typescript
// 単体テストの構造
describe('QuestionService', () => {
  describe('getNextQuestion', () => {
    it('未学習問題を優先的に返す', async () => {
      // Arrange
      const mockData = createMockQuestions()
      const service = new QuestionService(mockData)
      
      // Act
      const question = await service.getNextQuestion('journal')
      
      // Assert
      expect(question).toBeDefined()
      expect(question.category_id).toBe('journal')
      expect(isUnstudied(question.id)).toBe(true)
    })
    
    it('全問学習済みの場合は復習問題を返す', async () => {
      // 全問学習済みの状態を作成
      const service = createServiceWithAllStudied()
      
      const question = await service.getNextQuestion('journal')
      
      expect(question).toBeDefined()
      expect(isReviewTarget(question.id)).toBe(true)
    })
  })
})
```

#### 4.1.2 優先テスト項目
| コンポーネント | テスト観点 | 期待値 |
|---|---|---|
| QuestionService | 問題取得ロジック | 適切な問題選択 |
| ProgressCalculator | 進捗計算 | 正確な統計値 |
| ReviewManager | 復習優先度計算 | 学習効果の最大化 |
| DatabaseService | データ操作 | CRUD操作の正確性 |
| ValidationUtils | 入力検証 | 不正データの検出 |

### 4.2 結合テスト

#### 4.2.1 コンポーネント間連携テスト
```typescript
// 結合テストの例
describe('学習フロー結合テスト', () => {
  it('問題解答から統計更新まで正常に動作する', async () => {
    // Arrange: 初期状態の設定
    const initialProgress = await getProgressData()
    
    // Act: 問題解答の実行
    await answerQuestion('Q001', 'A', true)
    
    // Assert: 各コンポーネントの状態確認
    const updatedHistory = await getLearningHistory()
    const updatedProgress = await getProgressData()
    const reviewItems = await getReviewItems()
    
    expect(updatedHistory).toHaveLength(initialProgress.answeredCount + 1)
    expect(updatedProgress.accuracy).toBeGreaterThan(initialProgress.accuracy)
    expect(reviewItems).not.toContain({ questionId: 'Q001' })
  })
})
```

#### 4.2.2 データフロー検証
```typescript
// データフロー整合性テスト
describe('データ整合性テスト', () => {
  it('解答記録後のデータ整合性が保たれる', async () => {
    const testScenarios = [
      { questionId: 'Q001', answer: 'A', isCorrect: true },
      { questionId: 'Q002', answer: 'B', isCorrect: false },
      { questionId: 'Q003', answer: 'C', isCorrect: true }
    ]
    
    for (const scenario of testScenarios) {
      await recordAnswer(scenario)
      
      // データ整合性の確認
      await verifyDataConsistency(scenario.questionId)
    }
  })
})
```

### 4.3 模試機能テスト（新コンテンツ構成対応）

#### 4.3.1 模試機能単体テスト
```typescript
describe('MockExamService', () => {
  describe('模試問題構成テスト', () => {
    it('模試が正しい問題構成で生成される', async () => {
      const mockExam = await MockExamService.generateMockExam('MOCK_001')
      
      // 第1問：仕訳15問
      expect(mockExam.questions.section1.question_ids).toHaveLength(15)
      expect(mockExam.questions.section1.max_score).toBe(60)
      
      // 第2問：帳簿2問
      expect(mockExam.questions.section2.question_ids).toHaveLength(2)
      expect(mockExam.questions.section2.max_score).toBe(20)
      
      // 第3問：試算表1問
      expect(mockExam.questions.section3.question_ids).toHaveLength(1)
      expect(mockExam.questions.section3.max_score).toBe(20)
      
      // 総合確認
      expect(mockExam.total_score).toBe(100)
      expect(mockExam.passing_score).toBe(70)
    })
    
    it('5セットすべてで異なる問題が選択される', async () => {
      const mockExams = await Promise.all([
        MockExamService.generateMockExam('MOCK_001'),
        MockExamService.generateMockExam('MOCK_002'),
        MockExamService.generateMockExam('MOCK_003'),
        MockExamService.generateMockExam('MOCK_004'),
        MockExamService.generateMockExam('MOCK_005')
      ])
      
      // 各セクションで問題の重複がないことを確認
      const section1Questions = mockExams.flatMap(exam => exam.questions.section1.question_ids)
      const uniqueSection1 = new Set(section1Questions)
      expect(uniqueSection1.size).toBeGreaterThan(section1Questions.length * 0.8) // 80%以上は異なる問題
    })
  })
  
  describe('模試採点・結果計算', () => {
    it('模試結果が正確に計算される', async () => {
      const mockAnswers = {
        section1: Array(15).fill('A'), // 仕訳15問全てA
        section2: ['B', 'C'],          // 帳簿2問
        section3: ['D']                // 試算表1問
      }
      
      const result = await MockExamService.scoreMockExam('MOCK_001', mockAnswers)
      
      expect(result.total_score).toBeGreaterThanOrEqual(0)
      expect(result.total_score).toBeLessThanOrEqual(100)
      expect(result.is_passed).toBe(result.total_score >= 70)
      expect(result.detailed_results_json).toContain('section1')
      expect(result.detailed_results_json).toContain('section2')
      expect(result.detailed_results_json).toContain('section3')
    })
  })
})
```

#### 4.3.2 模試機能結合テスト
```typescript
describe('模試フロー結合テスト', () => {
  it('模試開始→解答→採点→復習登録の一連フローが正常動作する', async () => {
    // 1. 模試開始
    const exam = await MockExamService.startMockExam('MOCK_001')
    expect(exam.status).toBe('in_progress')
    
    // 2. 各セクションの解答
    const answers = await submitAllAnswers(exam, {
      section1: Array(15).fill('A'),
      section2: ['B', 'C'],
      section3: ['D']
    })
    
    // 3. 模試完了・採点
    const result = await MockExamService.completeMockExam(exam.id, answers)
    expect(result.is_completed).toBe(true)
    
    // 4. 間違い問題の自動復習登録確認
    const reviewItems = await ReviewService.getReviewItems()
    const wrongAnswers = getWrongAnswers(result)
    
    wrongAnswers.forEach(questionId => {
      expect(reviewItems.some(item => item.question_id === questionId)).toBe(true)
    })
  })
  
  it('時間制限による自動終了が正常動作する', async () => {
    jest.useFakeTimers()
    
    const exam = await MockExamService.startMockExam('MOCK_001')
    
    // 60分経過をシミュレート
    jest.advanceTimersByTime(60 * 60 * 1000)
    
    const result = await MockExamService.checkTimeLimit(exam.id)
    expect(result.auto_submitted).toBe(true)
    expect(result.remaining_time).toBe(0)
    
    jest.useRealTimers()
  })
})
```

### 4.4 システムテスト

#### 4.4.1 主要ユーザーフロー（新コンテンツ構成対応）
```typescript
// E2Eテストシナリオ - 基本学習フロー
describe('学習完了フローE2E', () => {
  it('分野別学習フロー（仕訳250問）', async () => {
    await device.launchApp()
    await expect(element(by.id('home-screen'))).toBeVisible()
    
    // 仕訳分野選択
    await element(by.id('category-journal')).tap()
    await expect(element(by.text('仕訳 250問'))).toBeVisible()
    
    // 学習開始
    await element(by.id('start-learning-button')).tap()
    await expect(element(by.id('question-screen'))).toBeVisible()
    
    // 問題番号の確認（Q_J_xxx形式）
    await expect(element(by.id('question-id'))).toHaveText(expect.stringMatching(/Q_J_\d{3}/))
    
    // 解答→解説→次問題のフロー
    await element(by.id('choice-A')).tap()
    await element(by.id('submit-answer-button')).tap()
    await expect(element(by.id('explanation-screen'))).toBeVisible()
    await element(by.id('next-question-button')).tap()
  })
  
  it('帳簿学習フロー（40問）', async () => {
    await device.launchApp()
    
    // 帳簿分野選択
    await element(by.id('category-ledger')).tap()
    await expect(element(by.text('帳簿 40問'))).toBeVisible()
    
    await element(by.id('start-learning-button')).tap()
    await expect(element(by.id('question-id'))).toHaveText(expect.stringMatching(/Q_L_\d{3}/))
  })
  
  it('試算表学習フロー（12問）', async () => {
    await device.launchApp()
    
    // 試算表分野選択
    await element(by.id('category-trial-balance')).tap()
    await expect(element(by.text('試算表 12問'))).toBeVisible()
    
    await element(by.id('start-learning-button')).tap()
    await expect(element(by.id('question-id'))).toHaveText(expect.stringMatching(/Q_T_\d{3}/))
  })
})

// 模試機能E2Eテスト
describe('模試機能E2E', () => {
  it('模試受験完了フロー', async () => {
    await device.launchApp()
    
    // 1. 模試画面へ移動
    await element(by.id('tab-mock-exam')).tap()
    await expect(element(by.id('mock-exam-screen'))).toBeVisible()
    
    // 2. 模試選択（5セットから選択）
    await element(by.id('mock-exam-001')).tap()
    await expect(element(by.text('基礎レベル模試'))).toBeVisible()
    
    // 3. 模試開始
    await element(by.id('start-mock-exam-button')).tap()
    await expect(element(by.id('timer-display'))).toBeVisible()
    await expect(element(by.text('60:00'))).toBeVisible()
    
    // 4. 第1問（仕訳15問）解答
    for (let i = 1; i <= 15; i++) {
      await expect(element(by.text(`第1問 ${i}/15`))).toBeVisible()
      await element(by.id('choice-A')).tap()
      await element(by.id('next-question-button')).tap()
    }
    
    // 5. 第2問（帳簿2問）解答
    for (let i = 1; i <= 2; i++) {
      await expect(element(by.text(`第2問 ${i}/2`))).toBeVisible()
      await element(by.id('choice-B')).tap()
      await element(by.id('next-question-button')).tap()
    }
    
    // 6. 第3問（試算表1問）解答
    await expect(element(by.text('第3問 1/1'))).toBeVisible()
    await element(by.id('choice-C')).tap()
    await element(by.id('finish-exam-button')).tap()
    
    // 7. 結果表示確認
    await expect(element(by.id('exam-result-screen'))).toBeVisible()
    await expect(element(by.id('total-score'))).toBeVisible()
    await expect(element(by.id('pass-fail-status'))).toBeVisible()
    
    // 8. 詳細結果確認
    await element(by.id('detailed-results-button')).tap()
    await expect(element(by.text('第1問: 60点中'))).toBeVisible()
    await expect(element(by.text('第2問: 20点中'))).toBeVisible()
    await expect(element(by.text('第3問: 20点中'))).toBeVisible()
  })
  
  it('模試時間制限テスト', async () => {
    await device.launchApp()
    await element(by.id('tab-mock-exam')).tap()
    await element(by.id('mock-exam-002')).tap()
    
    // 時間を59分59秒に設定してテスト開始
    await element(by.id('start-mock-exam-button')).tap()
    
    // 時間切れアラート確認（実際の実装では時間を操作）
    // await expect(element(by.text('時間切れです'))).toBeVisible()
    // await expect(element(by.id('auto-submit-result'))).toBeVisible()
  })
})

// 復習機能E2Eテスト
describe('復習機能E2E', () => {
  it('間違い問題復習フロー', async () => {
    await device.launchApp()
    
    // 事前に間違い問題を作成（別のテストで実行済みと仮定）
    await element(by.id('tab-review')).tap()
    await expect(element(by.id('review-screen'))).toBeVisible()
    
    // 復習問題リスト確認
    await expect(element(by.id('review-count'))).toBeVisible()
    await expect(element(by.text('優先度順'))).toBeVisible()
    
    // 復習開始
    await element(by.id('start-review-button')).tap()
    
    // 復習問題解答（優先度順）
    await expect(element(by.id('question-screen'))).toBeVisible()
    await expect(element(by.id('review-priority-indicator'))).toBeVisible()
    
    await element(by.id('choice-A')).tap()
    await element(by.id('submit-answer-button')).tap()
    
    // 正解後の復習リスト更新確認
    await element(by.id('back-to-review-list')).tap()
    // 復習対象から除外されていることを確認
  })
})
```

## 5. 非機能テスト詳細

### 5.1 パフォーマンステスト

#### 5.1.1 応答時間テスト
```typescript
// パフォーマンステストスイート
describe('パフォーマンステスト', () => {
  it('問題表示が2秒以内に完了する', async () => {
    const startTime = Date.now()
    
    await displayQuestion('Q001')
    
    const endTime = Date.now()
    const responseTime = endTime - startTime
    
    expect(responseTime).toBeLessThan(2000) // 2秒以内
  })
  
  it('大量データでの統計計算が1秒以内に完了する', async () => {
    // 1000件の学習履歴データを準備
    const largeDataSet = generateLearningHistory(1000)
    await setupTestData(largeDataSet)
    
    const startTime = performance.now()
    const statistics = await calculateStatistics()
    const endTime = performance.now()
    
    expect(endTime - startTime).toBeLessThan(1000) // 1秒以内
  })
})
```

#### 5.1.2 メモリ使用量テスト
```typescript
// メモリリークテスト
describe('メモリ使用量テスト', () => {
  it('長時間使用でメモリリークが発生しない', async () => {
    const initialMemory = await getMemoryUsage()
    
    // 100回の学習セッションを実行
    for (let i = 0; i < 100; i++) {
      await simulateLearningSession()
      await performGarbageCollection()
    }
    
    const finalMemory = await getMemoryUsage()
    const memoryIncrease = finalMemory - initialMemory
    
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024) // 10MB未満
  })
})
```

### 5.2 ユーザビリティテスト

#### 5.2.1 タスク完了テスト
```typescript
// ユーザビリティテストシナリオ
interface UsabilityTask {
  name: string
  description: string
  successCriteria: string[]
  maxTime: number // 秒
}

const usabilityTasks: UsabilityTask[] = [
  {
    name: '学習開始',
    description: 'アプリを起動し、仕訳の学習を開始する',
    successCriteria: [
      '問題画面が表示される',
      '選択肢が明確に表示される'
    ],
    maxTime: 30
  },
  {
    name: '復習実行',
    description: '間違えた問題を復習する',
    successCriteria: [
      '復習リストが表示される',
      '優先度順に問題が表示される'
    ],
    maxTime: 60
  }
]
```

#### 5.2.2 アクセシビリティテスト
```typescript
// アクセシビリティ自動テスト
describe('アクセシビリティテスト', () => {
  it('全画面でWCAG 2.1 AA基準を満たす', async () => {
    const screens = ['home', 'learning', 'review', 'statistics']
    
    for (const screen of screens) {
      await navigateToScreen(screen)
      const violations = await runAxeAccessibilityCheck()
      
      expect(violations.filter(v => v.impact === 'critical')).toHaveLength(0)
      expect(violations.filter(v => v.impact === 'serious')).toHaveLength(0)
    }
  })
  
  it('スクリーンリーダーで操作可能', async () => {
    await enableScreenReader()
    
    // タブオーダーの確認
    const focusableElements = await getFocusableElements()
    expect(focusableElements.length).toBeGreaterThan(0)
    
    // aria-labelの確認
    for (const element of focusableElements) {
      const label = await element.getAttribute('aria-label')
      expect(label).toBeTruthy()
    }
  })
})
```

### 5.3 セキュリティテスト

#### 5.3.1 データ保護テスト
```typescript
// データ保護テスト
describe('セキュリティテスト', () => {
  it('個人情報が外部に送信されない', async () => {
    // ネットワークトラフィック監視
    const networkMonitor = startNetworkMonitoring()
    
    // 学習セッション実行
    await completeLearningSession()
    
    const networkRequests = networkMonitor.getRequests()
    
    // 外部通信が発生していないことを確認
    expect(networkRequests).toHaveLength(0)
  })
  
  it('ローカルデータが適切に暗号化される', async () => {
    // 機密データの保存
    await saveSensitiveData({ studyHistory: 'test-data' })
    
    // ファイルシステムからの直接読み取り
    const rawData = await readRawFileData(DATA_FILE_PATH)
    
    // 暗号化されていることを確認
    expect(rawData).not.toContain('test-data')
    expect(isEncrypted(rawData)).toBe(true)
  })
})
```

#### 5.3.2 脆弱性テスト
```typescript
// 入力検証テスト
describe('入力検証テスト', () => {
  it('SQLインジェクション攻撃を防ぐ', async () => {
    const maliciousInputs = [
      "'; DROP TABLE questions; --",
      "1' OR '1'='1",
      "UNION SELECT * FROM sqlite_master"
    ]
    
    for (const input of maliciousInputs) {
      const result = await searchQuestions(input)
      
      // データベースが破損していないことを確認
      expect(await verifyDatabaseIntegrity()).toBe(true)
      // 正常な結果が返されることを確認
      expect(result).toBeInstanceOf(Array)
    }
  })
})
```

## 6. テスト自動化

### 6.1 CI/CD統合

#### 6.1.1 テストパイプライン
```yaml
# .github/workflows/test.yml
name: Test Pipeline

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm ci
      - name: Run unit tests
        run: npm run test:unit
      - name: Upload coverage
        uses: codecov/codecov-action@v2

  integration-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    steps:
      - name: Run integration tests
        run: npm run test:integration

  e2e-tests:
    runs-on: macos-latest
    needs: integration-tests
    steps:
      - name: Setup iOS Simulator
        run: xcrun simctl boot "iPhone 12"
      - name: Run E2E tests
        run: npm run test:e2e:ios
```

#### 6.1.2 テスト品質ゲート
```typescript
// テスト品質チェック
interface QualityGate {
  unitTestCoverage: number      // 80%以上
  integrationTestPass: boolean  // 100%パス
  e2eTestPass: boolean         // 既存テスト100%パス
  performanceRegression: boolean // 性能劣化なし
  securityScan: boolean        // 脆弱性なし
}

const qualityGateCheck = (results: TestResults): QualityGate => {
  return {
    unitTestCoverage: results.coverage.statements >= 80,
    integrationTestPass: results.integration.failureCount === 0,
    e2eTestPass: results.e2e.failureCount === 0,
    performanceRegression: results.performance.regressionDetected === false,
    securityScan: results.security.vulnerabilities.length === 0
  }
}
```

### 6.2 テストツール・フレームワーク

#### 6.2.1 ツールチェーン
| テスト種別 | ツール | 用途 |
|---|---|---|
| 単体テスト | Jest | JavaScript/TypeScript単体テスト |
| React コンポーネント | React Testing Library | コンポーネントテスト |
| E2Eテスト | Detox | React Native E2Eテスト |
| パフォーマンス | Flipper | パフォーマンス計測 |
| アクセシビリティ | axe-core | アクセシビリティチェック |
| セキュリティ | ESLint Security | 静的セキュリティ解析 |

#### 6.2.2 カスタムテストユーティリティ
```typescript
// テストユーティリティ
export class TestHelper {
  // データベーステストヘルパー
  static async setupTestDatabase(): Promise<Database> {
    const db = await SQLite.openDatabase(':memory:')
    await this.runMigrations(db)
    await this.seedTestData(db)
    return db
  }
  
  // モックデータ生成
  static createMockQuestion(overrides: Partial<Question> = {}): Question {
    return {
      id: 'Q001',
      category_id: 'journal',
      question_text: 'テスト問題',
      choices_json: JSON.stringify({
        A: '選択肢A',
        B: '選択肢B',
        C: '選択肢C', 
        D: '選択肢D'
      }),
      correct_answer: 'A',
      explanation: 'テスト解説',
      difficulty: 1,
      ...overrides
    }
  }
  
  // 学習状態シミュレーション
  static async simulateLearningProgress(
    questionCount: number,
    accuracyRate: number
  ): Promise<void> {
    for (let i = 0; i < questionCount; i++) {
      const isCorrect = Math.random() < accuracyRate
      await recordAnswer(`Q${i + 1}`, 'A', isCorrect)
    }
  }
}
```

## 7. テスト実行・管理

### 7.1 テストスケジュール

#### 7.1.1 実行頻度
| テスト種別 | 実行頻度 | 実行トリガー | 所要時間 |
|---|---|---|---|
| 単体テスト | コミット毎 | git push | 5分 |
| 結合テスト | PR毎 | pull request | 15分 |
| E2Eテスト | 日次 | スケジュール実行 | 30分 |
| パフォーマンステスト | 週次 | スケジュール実行 | 60分 |
| セキュリティテスト | リリース前 | 手動実行 | 30分 |

#### 7.1.2 テスト環境スケジュール
```typescript
// テスト環境ローテーション
interface TestEnvironmentSchedule {
  daily: {
    smokeTesting: '06:00'      // スモークテスト
    regressionTesting: '20:00' // リグレッションテスト
  }
  
  weekly: {
    performanceTesting: 'Sunday 02:00'  // パフォーマンステスト
    securityScanning: 'Saturday 03:00'  // セキュリティスキャン
  }
  
  release: {
    fullRegressionTest: 'manual'        // 全回帰テスト
    userAcceptanceTest: 'manual'        // ユーザー受入テスト
  }
}
```

### 7.2 欠陥管理

#### 7.2.1 欠陥分類・優先度
| 重要度 | 内容 | 対応期限 | 担当 |
|---|---|---|---|
| 致命的 | アプリクラッシュ・データ損失 | 24時間以内 | 開発リーダー |
| 重要 | 主要機能の不具合 | 3日以内 | 開発チーム |
| 軽微 | UI不具合・軽微な動作不良 | 次リリース | 開発チーム |
| 改善要望 | ユーザビリティ向上 | 検討 | プロダクトオーナー |

#### 7.2.2 欠陥追跡
```typescript
// 欠陥レポート構造
interface DefectReport {
  id: string                    // 欠陥ID
  title: string                 // 問題の概要
  severity: 'critical' | 'major' | 'minor' | 'enhancement'
  priority: 'high' | 'medium' | 'low'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  
  // 再現情報
  reproduction: {
    steps: string[]             // 再現手順
    environment: string         // テスト環境
    testData: any              // テストデータ
  }
  
  // 分析情報
  analysis: {
    rootCause: string          // 根本原因
    impact: string             // カスタマーインパクト
    riskAssessment: string     // リスク評価
  }
  
  // 対応情報
  resolution: {
    solution: string           // 解決策
    estimatedEffort: number    // 工数見積もり
    implementationPlan: string // 実装計画
  }
}
```

## 8. テスト完了基準

### 8.1 リリース判定基準

#### 8.1.1 定量的基準
| 項目 | 基準値 | 現在値 | ステータス |
|---|---|---|---|
| 単体テストカバレッジ | 80%以上 | - | - |
| 結合テスト成功率 | 100% | - | - |
| E2Eテスト成功率 | 95%以上 | - | - |
| 致命的欠陥数 | 0件 | - | - |
| 重要欠陥数 | 2件以下 | - | - |
| パフォーマンス要件適合率 | 100% | - | - |

#### 8.1.2 定性的基準
- [ ] 全ユーザーストーリーの受入基準を満たしている
- [ ] アクセシビリティガイドライン（WCAG 2.1 AA）に準拠している
- [ ] セキュリティ要件を満たしている
- [ ] ユーザビリティテストで重大な問題が発見されていない
- [ ] パフォーマンス要件を満たしている

### 8.2 品質メトリクス

#### 8.2.1 テスト効率指標
```typescript
// テスト効率メトリクス
interface TestEfficiencyMetrics {
  // テスト実行効率
  executionTime: {
    total: number              // 総テスト実行時間
    automated: number          // 自動テスト実行時間
    manual: number            // 手動テスト実行時間
  }
  
  // 欠陥検出効率
  defectDetection: {
    foundInTesting: number     // テスト段階で発見
    foundInProduction: number  // 本番で発見
    escapeRate: number        // 欠陥流出率
  }
  
  // テストROI
  roi: {
    testCost: number          // テスト実行コスト
    bugFixCost: number        // 欠陥修正コスト
    preventedCost: number     // 予防できたコスト
  }
}
```

## 9. テスト継続改善

### 9.1 テストプロセス改善

#### 9.1.1 振り返り観点
- **テスト効率**: 自動化率・実行時間の改善
- **欠陥予防**: 早期発見・根本原因対策
- **品質向上**: ユーザー満足度・安定性向上
- **プロセス最適化**: 開発フローとの統合

#### 9.1.2 改善サイクル
```typescript
// テスト改善PDCAサイクル
interface TestImprovementCycle {
  plan: {
    currentIssues: string[]     // 現在の課題
    improvementGoals: string[]  // 改善目標
    actionItems: string[]       // アクションアイテム
  }
  
  do: {
    implementation: string[]    // 実装内容
    timeline: string           // 実施期間
    responsible: string        // 責任者
  }
  
  check: {
    metrics: Record<string, number>  // 測定結果
    evaluation: string              // 評価
    lessonsLearned: string[]        // 学び
  }
  
  act: {
    standardization: string[]   // 標準化項目
    nextActions: string[]      // 次のアクション
    scaling: string[]          // 展開計画
  }
}
```

---

## 更新履歴

| 日付 | バージョン | 変更内容 | 更新者 |
|---|---|---|---|
| 2025-01-27 | 1.0 | 初版作成 | - |

---

**このテスト計画は、プロダクトの成長と学習に応じて継続的に更新します。特にユーザーフィードバックに基づくテストケースの追加・改善を重視します。**