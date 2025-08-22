# Web Search Agent System

このディレクトリには、BookKeeping3rdプロジェクト用のウェブ検索専用エージェントシステムが含まれています。

## 概要

ウェブ検索エージェントは、簿記関連の情報を効率的に検索するための専用ツールです。検索クエリの最適化、ドメインフィルタリング、結果の構造化などの機能を提供します。

## ファイル構成

- `web-search-agent.js` - ウェブ検索エージェントのコア実装
- `run-agent.js` - エージェント実行・管理ツール
- `agent-config.json` - エージェント設定ファイル
- `README.md` - このファイル

## 基本的な使用方法

### 1. エージェントランナー経由での実行

```bash
# 基本的な検索
node scripts/agents/run-agent.js --type=web-search --command=search --query="簿記3級 試験対策"

# 簿記特化検索
node scripts/agents/run-agent.js --type=web-search --command=search-bookkeeping --topic="仕訳"

# 検索候補の取得
node scripts/agents/run-agent.js --type=web-search --command=suggestions --partial="簿記"

# クエリの検証
node scripts/agents/run-agent.js --type=web-search --command=validate --query="簿記3級 試験対策"
```

### 2. 直接実行

```bash
# ウェブ検索エージェントを直接実行
node scripts/agents/web-search-agent.js "簿記3級 仕訳 基礎"
```

## 利用可能なコマンド

### search

基本的なウェブ検索を実行します。

**パラメータ:**

- `--query` - 検索クエリ（必須）

**例:**

```bash
node scripts/agents/run-agent.js --type=web-search --command=search --query="簿記3級 過去問"
```

### search-bookkeeping

簿記関連のトピックに特化した検索を実行します。

**パラメータ:**

- `--topic` - 検索トピック（必須）
- `--context` - 追加コンテキスト（デフォルト: "簿記3級"）

**例:**

```bash
node scripts/agents/run-agent.js --type=web-search --command=search-bookkeeping --topic="仕訳" --context="商業簿記"
```

### search-japanese

日本語リソースに特化した検索を実行します。

**パラメータ:**

- `--query` - 検索クエリ（必須）

**例:**

```bash
node scripts/agents/run-agent.js --type=web-search --command=search-japanese --query="簿記 勉強法"
```

### suggestions

検索クエリの候補を取得します。

**パラメータ:**

- `--partial` - 部分的なクエリ（任意）

**例:**

```bash
node scripts/agents/run-agent.js --type=web-search --command=suggestions --partial="簿記"
```

### validate

検索クエリの妥当性を検証します。

**パラメータ:**

- `--query` - 検証するクエリ（必須）

**例:**

```bash
node scripts/agents/run-agent.js --type=web-search --command=validate --query="簿記3級 試験対策"
```

## 設定のカスタマイズ

`agent-config.json`ファイルを編集することで、以下の設定をカスタマイズできます：

### 基本設定

- `maxResults` - 最大検索結果数
- `timeout` - タイムアウト時間（ミリ秒）
- `allowedDomains` - 検索対象ドメイン
- `blockedDomains` - 除外ドメイン

### プリセット検索

事前定義された検索パターンを使用できます：

- `bookkeeping-basics` - 簿記基礎
- `cbt-exam` - CBT試験
- `journal-entries` - 仕訳
- `trial-balance` - 試算表
- `past-questions` - 過去問

## プログラムからの使用

### JavaScript/Node.jsでの使用例

```javascript
const WebSearchAgent = require("./scripts/agents/web-search-agent");

// エージェントの初期化
const agent = new WebSearchAgent({
  maxResults: 5,
  allowedDomains: ["kentei.ne.jp", "tac-school.co.jp"],
});

// 検索の実行
async function searchExample() {
  const result = await agent.search("簿記3級 試験対策");
  console.log(result);

  // 簿記特化検索
  const bookkeepingResult = await agent.searchBookkeepingTopic("仕訳");
  console.log(bookkeepingResult);

  // 検索候補の取得
  const suggestions = agent.getSuggestions("簿記");
  console.log(suggestions);
}

searchExample();
```

### エージェントランナーでの使用例

```javascript
const AgentRunner = require("./scripts/agents/run-agent");

const runner = new AgentRunner();

// エージェントの実行
async function runnerExample() {
  const result = await runner.runAgent("web-search", "search", {
    query: "簿記3級 試験対策",
  });
  console.log(result);
}

runnerExample();
```

## よくある質問

### Q: 実際のウェブ検索機能を追加するには？

A: `web-search-agent.js`の`search`メソッド内で、WebSearchツールを呼び出すコードを追加してください。現在はテスト用のモック実装になっています。

### Q: 新しいドメインを検索対象に追加するには？

A: `agent-config.json`の`allowedDomains`配列に新しいドメインを追加してください。

### Q: エラー処理を改善するには？

A: `web-search-agent.js`の各メソッドにより詳細なエラーハンドリングを追加し、`agent-config.json`でリトライ設定を調整してください。

## トラブルシューティング

### エージェントが見つからない

- `run-agent.js --list-agents`でエージェントが正しく登録されているか確認
- Node.jsのバージョンが適切か確認

### 設定ファイルエラー

- `agent-config.json`のJSON構文が正しいか確認
- ファイルの読み取り権限があるか確認

### コマンドライン引数エラー

- 必須パラメータが正しく指定されているか確認
- パラメータ名のスペルミスがないか確認

## 拡張方法

新しいエージェントタイプを追加する場合：

1. 新しいエージェントクラスファイルを作成
2. `run-agent.js`でエージェントを登録
3. `agent-config.json`に設定を追加
4. 必要に応じて新しいコマンドを実装

このシステムは拡張可能な設計になっており、簿記以外の分野にも適用できます。
