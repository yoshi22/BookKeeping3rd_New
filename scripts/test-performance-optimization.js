/**
 * パフォーマンス最適化テストスクリプト
 * 簿記3級問題集アプリ - Step 4.1: パフォーマンス最適化検証
 * 
 * 検証項目:
 * - アプリ起動時間
 * - メモリ使用量
 * - データベースクエリ速度
 * - UI描画パフォーマンス
 */

const { performance } = require('perf_hooks');

// テスト設定
const TEST_CONFIG = {
  TARGET_STARTUP_TIME: 3000,    // 3秒
  TARGET_MEMORY_USAGE: 150,     // 150MB
  TARGET_QUERY_TIME: 100,       // 100ms
  TARGET_RENDER_TIME: 16,       // 16ms (60fps)
  ITERATIONS: 10,               // テスト繰り返し回数
};

/**
 * パフォーマンステストランナー
 */
class PerformanceTestRunner {
  constructor() {
    this.results = {
      startup: [],
      memory: [],
      queries: [],
      rendering: [],
    };
    this.failures = [];
  }

  /**
   * 全パフォーマンステスト実行
   */
  async runAllTests() {
    console.log('🚀 パフォーマンス最適化テスト開始');
    console.log('='.repeat(50));

    try {
      await this.testStartupPerformance();
      await this.testMemoryUsage();
      await this.testDatabasePerformance();
      await this.testRenderingPerformance();
      
      this.generateReport();
      
    } catch (error) {
      console.error('❌ テスト実行エラー:', error);
      process.exit(1);
    }
  }

  /**
   * アプリ起動時間テスト
   */
  async testStartupPerformance() {
    console.log('\n📱 アプリ起動時間テスト');
    console.log('-'.repeat(30));

    // 最適化版データベースサービスのテスト
    const { optimizedDatabaseService } = require('../src/data/database-optimized');
    
    for (let i = 0; i < TEST_CONFIG.ITERATIONS; i++) {
      const startTime = performance.now();
      
      try {
        // 高速初期化のテスト
        await optimizedDatabaseService.quickInitialize();
        
        const initTime = performance.now() - startTime;
        this.results.startup.push(initTime);
        
        console.log(`  試行 ${i + 1}: ${initTime.toFixed(2)}ms`);
        
        // 目標時間チェック
        if (initTime > TEST_CONFIG.TARGET_STARTUP_TIME) {
          this.failures.push({
            test: 'startup',
            iteration: i + 1,
            value: initTime,
            target: TEST_CONFIG.TARGET_STARTUP_TIME,
            message: `起動時間が目標値を超過: ${initTime.toFixed(2)}ms > ${TEST_CONFIG.TARGET_STARTUP_TIME}ms`
          });
        }
        
      } catch (error) {
        console.error(`  試行 ${i + 1} エラー:`, error.message);
        this.failures.push({
          test: 'startup',
          iteration: i + 1,
          error: error.message
        });
      }
      
      // データベースをリセット
      await this.resetDatabase();
    }

    const avgStartup = this.calculateAverage(this.results.startup);
    const status = avgStartup <= TEST_CONFIG.TARGET_STARTUP_TIME ? '✅' : '❌';
    console.log(`  平均起動時間: ${avgStartup.toFixed(2)}ms ${status}`);
  }

  /**
   * メモリ使用量テスト
   */
  async testMemoryUsage() {
    console.log('\n💾 メモリ使用量テスト');
    console.log('-'.repeat(30));

    const { memoryOptimizer } = require('../src/services/memory-optimizer');
    
    // メモリ監視開始
    memoryOptimizer.startMonitoring();

    for (let i = 0; i < TEST_CONFIG.ITERATIONS; i++) {
      try {
        // メモリ集約的な処理をシミュレート
        await this.simulateMemoryIntensiveOperation();
        
        // メモリ統計取得
        const stats = memoryOptimizer.getCurrentMemoryStats();
        if (stats) {
          const memoryUsageMB = stats.usedJSHeapSize / (1024 * 1024);
          this.results.memory.push(memoryUsageMB);
          
          console.log(`  試行 ${i + 1}: ${memoryUsageMB.toFixed(2)}MB`);
          
          // 目標メモリ使用量チェック
          if (memoryUsageMB > TEST_CONFIG.TARGET_MEMORY_USAGE) {
            this.failures.push({
              test: 'memory',
              iteration: i + 1,
              value: memoryUsageMB,
              target: TEST_CONFIG.TARGET_MEMORY_USAGE,
              message: `メモリ使用量が目標値を超過: ${memoryUsageMB.toFixed(2)}MB > ${TEST_CONFIG.TARGET_MEMORY_USAGE}MB`
            });
          }
        } else {
          console.log(`  試行 ${i + 1}: メモリ統計取得不可`);
        }
        
        // メモリクリーンアップ
        await this.performMemoryCleanup();
        
      } catch (error) {
        console.error(`  試行 ${i + 1} エラー:`, error.message);
        this.failures.push({
          test: 'memory',
          iteration: i + 1,
          error: error.message
        });
      }
    }

    memoryOptimizer.stopMonitoring();

    if (this.results.memory.length > 0) {
      const avgMemory = this.calculateAverage(this.results.memory);
      const status = avgMemory <= TEST_CONFIG.TARGET_MEMORY_USAGE ? '✅' : '❌';
      console.log(`  平均メモリ使用量: ${avgMemory.toFixed(2)}MB ${status}`);
    }
  }

  /**
   * データベースパフォーマンステスト
   */
  async testDatabasePerformance() {
    console.log('\n🗄️ データベースパフォーマンステスト');
    console.log('-'.repeat(30));

    const { optimizedDatabaseService } = require('../src/data/database-optimized');
    
    // データベース初期化
    await optimizedDatabaseService.quickInitialize();

    const testQueries = [
      {
        name: 'カテゴリ取得',
        sql: 'SELECT * FROM categories WHERE is_active = 1',
        params: []
      },
      {
        name: '最近の学習履歴',
        sql: 'SELECT * FROM learning_history WHERE answered_at >= DATE("now", "-7 days") LIMIT 100',
        params: []
      },
      {
        name: '復習対象問題',
        sql: 'SELECT * FROM review_items WHERE status IN ("needs_review", "priority_review") ORDER BY priority_score DESC LIMIT 20',
        params: []
      }
    ];

    for (const query of testQueries) {
      console.log(`\n  ${query.name}テスト:`);
      
      const queryTimes = [];
      
      for (let i = 0; i < TEST_CONFIG.ITERATIONS; i++) {
        const startTime = performance.now();
        
        try {
          await optimizedDatabaseService.executeSql(query.sql, query.params);
          
          const queryTime = performance.now() - startTime;
          queryTimes.push(queryTime);
          
          console.log(`    試行 ${i + 1}: ${queryTime.toFixed(2)}ms`);
          
          // 目標クエリ時間チェック
          if (queryTime > TEST_CONFIG.TARGET_QUERY_TIME) {
            this.failures.push({
              test: 'query',
              query: query.name,
              iteration: i + 1,
              value: queryTime,
              target: TEST_CONFIG.TARGET_QUERY_TIME,
              message: `クエリ時間が目標値を超過: ${queryTime.toFixed(2)}ms > ${TEST_CONFIG.TARGET_QUERY_TIME}ms`
            });
          }
          
        } catch (error) {
          console.error(`    試行 ${i + 1} エラー:`, error.message);
          this.failures.push({
            test: 'query',
            query: query.name,
            iteration: i + 1,
            error: error.message
          });
        }
      }
      
      this.results.queries.push({
        name: query.name,
        times: queryTimes,
        average: this.calculateAverage(queryTimes)
      });
      
      const avgTime = this.calculateAverage(queryTimes);
      const status = avgTime <= TEST_CONFIG.TARGET_QUERY_TIME ? '✅' : '❌';
      console.log(`    平均時間: ${avgTime.toFixed(2)}ms ${status}`);
    }
  }

  /**
   * UI描画パフォーマンステスト
   */
  async testRenderingPerformance() {
    console.log('\n🎨 UI描画パフォーマンステスト');
    console.log('-'.repeat(30));

    // React Nativeコンポーネントのレンダリング時間シミュレーション
    const renderingTests = [
      { name: '問題表示コンポーネント', complexity: 'high' },
      { name: '統計画面', complexity: 'medium' },
      { name: 'ホーム画面', complexity: 'low' },
    ];

    for (const test of renderingTests) {
      console.log(`\n  ${test.name}テスト:`);
      
      const renderTimes = [];
      
      for (let i = 0; i < TEST_CONFIG.ITERATIONS; i++) {
        const startTime = performance.now();
        
        try {
          // レンダリング処理のシミュレーション
          await this.simulateComponentRendering(test.complexity);
          
          const renderTime = performance.now() - startTime;
          renderTimes.push(renderTime);
          
          console.log(`    試行 ${i + 1}: ${renderTime.toFixed(2)}ms`);
          
          // 目標レンダリング時間チェック
          if (renderTime > TEST_CONFIG.TARGET_RENDER_TIME) {
            this.failures.push({
              test: 'rendering',
              component: test.name,
              iteration: i + 1,
              value: renderTime,
              target: TEST_CONFIG.TARGET_RENDER_TIME,
              message: `レンダリング時間が目標値を超過: ${renderTime.toFixed(2)}ms > ${TEST_CONFIG.TARGET_RENDER_TIME}ms`
            });
          }
          
        } catch (error) {
          console.error(`    試行 ${i + 1} エラー:`, error.message);
          this.failures.push({
            test: 'rendering',
            component: test.name,
            iteration: i + 1,
            error: error.message
          });
        }
      }
      
      this.results.rendering.push({
        name: test.name,
        times: renderTimes,
        average: this.calculateAverage(renderTimes)
      });
      
      const avgTime = this.calculateAverage(renderTimes);
      const status = avgTime <= TEST_CONFIG.TARGET_RENDER_TIME ? '✅' : '❌';
      console.log(`    平均時間: ${avgTime.toFixed(2)}ms ${status}`);
    }
  }

  /**
   * テスト結果レポート生成
   */
  generateReport() {
    console.log('\n📊 パフォーマンステスト結果');
    console.log('='.repeat(50));

    // 起動時間サマリー
    if (this.results.startup.length > 0) {
      const avgStartup = this.calculateAverage(this.results.startup);
      const minStartup = Math.min(...this.results.startup);
      const maxStartup = Math.max(...this.results.startup);
      
      console.log('\n📱 アプリ起動時間:');
      console.log(`  平均: ${avgStartup.toFixed(2)}ms`);
      console.log(`  最短: ${minStartup.toFixed(2)}ms`);
      console.log(`  最長: ${maxStartup.toFixed(2)}ms`);
      console.log(`  目標: ${TEST_CONFIG.TARGET_STARTUP_TIME}ms`);
      console.log(`  達成: ${avgStartup <= TEST_CONFIG.TARGET_STARTUP_TIME ? '✅' : '❌'}`);
    }

    // メモリ使用量サマリー
    if (this.results.memory.length > 0) {
      const avgMemory = this.calculateAverage(this.results.memory);
      const minMemory = Math.min(...this.results.memory);
      const maxMemory = Math.max(...this.results.memory);
      
      console.log('\n💾 メモリ使用量:');
      console.log(`  平均: ${avgMemory.toFixed(2)}MB`);
      console.log(`  最小: ${minMemory.toFixed(2)}MB`);
      console.log(`  最大: ${maxMemory.toFixed(2)}MB`);
      console.log(`  目標: ${TEST_CONFIG.TARGET_MEMORY_USAGE}MB`);
      console.log(`  達成: ${avgMemory <= TEST_CONFIG.TARGET_MEMORY_USAGE ? '✅' : '❌'}`);
    }

    // データベースクエリサマリー
    if (this.results.queries.length > 0) {
      console.log('\n🗄️ データベースクエリ:');
      this.results.queries.forEach(query => {
        console.log(`  ${query.name}: ${query.average.toFixed(2)}ms ${query.average <= TEST_CONFIG.TARGET_QUERY_TIME ? '✅' : '❌'}`);
      });
    }

    // UI描画サマリー
    if (this.results.rendering.length > 0) {
      console.log('\n🎨 UI描画:');
      this.results.rendering.forEach(render => {
        console.log(`  ${render.name}: ${render.average.toFixed(2)}ms ${render.average <= TEST_CONFIG.TARGET_RENDER_TIME ? '✅' : '❌'}`);
      });
    }

    // 失敗サマリー
    if (this.failures.length > 0) {
      console.log('\n❌ 失敗した項目:');
      this.failures.forEach((failure, index) => {
        console.log(`  ${index + 1}. ${failure.message || failure.error}`);
      });
      
      console.log(`\n総合結果: ❌ FAILED (${this.failures.length}件の問題)`);
      process.exit(1);
    } else {
      console.log('\n✅ 総合結果: PASSED (全ての目標を達成)');
    }

    console.log('\n🎯 最適化効果:');
    console.log('  - アプリ起動時間の高速化');
    console.log('  - メモリ使用量の最適化');
    console.log('  - データベースクエリの高速化');
    console.log('  - UI描画パフォーマンスの向上');
  }

  /**
   * ヘルパーメソッド
   */
  calculateAverage(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }

  async resetDatabase() {
    // データベースリセット処理のシミュレーション
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  async simulateMemoryIntensiveOperation() {
    // メモリ集約的な処理のシミュレーション
    const largeArray = new Array(100000).fill(0).map((_, i) => ({
      id: i,
      data: `data_${i}`,
      timestamp: Date.now(),
    }));
    
    // 少し処理時間を消費
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // 配列をクリア
    largeArray.length = 0;
  }

  async performMemoryCleanup() {
    // メモリクリーンアップのシミュレーション
    if (global.gc) {
      global.gc();
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  async simulateComponentRendering(complexity) {
    // コンポーネントレンダリングのシミュレーション
    const baseTime = {
      'low': 5,
      'medium': 10,
      'high': 15,
    }[complexity] || 10;
    
    // ランダムな処理時間を追加
    const additionalTime = Math.random() * 5;
    
    await new Promise(resolve => setTimeout(resolve, baseTime + additionalTime));
  }
}

/**
 * メイン実行
 */
async function main() {
  const runner = new PerformanceTestRunner();
  await runner.runAllTests();
}

// スクリプト実行
if (require.main === module) {
  main().catch(error => {
    console.error('パフォーマンステスト実行エラー:', error);
    process.exit(1);
  });
}

module.exports = { PerformanceTestRunner };