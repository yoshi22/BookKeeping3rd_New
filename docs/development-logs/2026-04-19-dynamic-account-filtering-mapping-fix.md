# 2026-04-19 - 動的勘定科目フィルタ生成データ修正

## 概要

動的勘定科目フィルタの生成スクリプトが一部の正答 JSON 形式を取りこぼしており、`primaryAccounts` が空になる問題が多発していた。  
`scripts/data/generate-question-mappings.js` の抽出ロジックを拡張し、生成データを再作成した。

**実施日**: 2026-04-19  
**対象機能**: 動的勘定科目フィルタリング  
**関連ファイル**:

- `scripts/data/generate-question-mappings.js`
- `src/data/question-accounts-mapping-generated.ts`
- `app.json`

## 問題

修正前は次の形式を十分に扱えていなかった。

- `journalEntries` 配列
- `type` なしの `journalEntry`
- トップレベル配列の仕訳 JSON
- `type` なしの `entries` 配列

その結果、勘定科目ドロップダウンの絞り込みに使う `primaryAccounts` が大量に空になっていた。

## 実装内容

### 1. 抽出ロジック拡張

`extractAccountsFromAnswer` に以下を追加した。

- `journalEntries` 配列の抽出
- `type` が無くても `journalEntry` / `journalEntries` / `entries` を持つ回答の抽出
- トップレベル配列 JSON の抽出
- 借方・貸方・旧形式 `account` を共通処理で抽出

### 2. 生成データ更新

以下を実行して生成ファイルを更新した。

```bash
node scripts/data/generate-question-mappings.js
```

### 3. TestFlight準備

`eas.json` の `appVersionSource` は `local` のため、iOS の `buildNumber` を `16` から `17` に更新した。
また、ネイティブ iOS ディレクトリが存在するため、`ios/3Alpha/Info.plist` の `CFBundleVersion` と
`ios/3Alpha.xcodeproj/project.pbxproj` の `CURRENT_PROJECT_VERSION` / `MARKETING_VERSION` も同期した。

## 結果

### 生成結果

- 総問題数: `370`
- `primaryAccounts` 非空: `246`
- `primaryAccounts` 空: `124`
- 平均正答科目数: `1.5`

### 改善の内訳

- 初回修正後: 空 `331 -> 162`
- 追加修正後: 空 `162 -> 124`

### 代表確認

- `Q_J_075`: `売掛金`, `売上`, `現金`
- `Q_J_139`: `退職給付費用`, `預り金`, `普通預金`
- `Q_J_107`: 仕訳不要のため空のまま維持
- `Q2_V_001`: 非仕訳問題のため空のまま維持

## 残件の判断

残る `124` 件の大半は、以下の理由で空のままで妥当と判断した。

- `Q2_*`, `Q3_*` の非仕訳問題
- `note` のみで「仕訳不要」を示す問題
- 借方・貸方が空のテンプレート回答

## 検証

実施済み:

- 生成スクリプト実行成功
- 代表ケースの `primaryAccounts` 目視確認
- 空件数の再集計

未実施:

- `npm test`
- `npm run check:quick`

## 次アクション

- GitHub にコミット・プッシュ
- EAS で iOS production build を作成
- 必要に応じて App Store Connect / TestFlight へ submit

---

**Author**: Codex  
**Status**: 実装・生成データ更新完了
