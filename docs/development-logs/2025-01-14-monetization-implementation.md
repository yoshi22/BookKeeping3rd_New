# マネタイズ機能実装ログ

**日時**: 2025-01-14
**実施者**: Claude Code (AI Assistant)
**バージョン**: 1.0.0

## 概要

簿記3級問題集「確実復習」アプリにマネタイズ機能を実装。以下の3つの主要機能を追加。

1. **AdMob広告**: バナー広告 + インタースティシャル広告
2. **IAP (アプリ内課金)**: 広告削除の買い切り購入
3. **レビュー依頼**: In-App Review APIによるレビュー促進

## 設計方針

- **UX最優先**: 学習体験を損なわない広告表示
  - アプリ起動時のフルスクリーン広告は禁止
  - インタースティシャルは10問完了後の「次へ」ボタン押下時のみ
  - 頻度キャップで過度な広告を防止
- **非モーダル広告削除カード**: 結果画面に自然に統合
- **プライバシー重視**: 個人データ収集なし

## 追加/変更ファイル一覧

### 新規作成ファイル

#### 型定義・設定

- `src/types/monetization.ts` - マネタイズ関連の型定義
- `src/config/monetization.ts` - AdMob/IAP設定、頻度キャップ設定

#### データ層

- `src/data/repositories/settings-repository.ts` - app_settings永続化

#### サービス層

- `src/services/analytics-service.ts` - イベントログ
- `src/services/ad-service.ts` - 広告表示・頻度制御
- `src/services/session-service.ts` - 10問セッション管理
- `src/services/review-prompt-service.ts` - レビュー依頼制御

#### Context

- `src/context/PurchaseContext.tsx` - 購入状態グローバル管理
- `src/context/AdContext.tsx` - 広告状態グローバル管理

#### フック

- `src/hooks/useSession.ts` - セッション管理フック

#### コンポーネント

- `src/components/ads/BannerAdWrapper.tsx` - バナー広告ラッパー
- `src/components/session/SessionResultScreen.tsx` - セッション結果画面

#### ルート画面

- `app/(tabs)/learning/session-result.tsx` - 学習セッション結果画面
- `app/(tabs)/review/session-result.tsx` - 復習セッション結果画面

### 変更ファイル

- `package.json` - 依存パッケージ追加
- `app.json` - AdMobプラグイン、SKAdNetwork設定追加
- `app/_layout.tsx` - PurchaseProvider, AdProvider追加
- `app/(tabs)/settings.tsx` - 広告削除購入UI追加
- `app/(tabs)/learning/question/[id].tsx` - 10問バッチセッション対応、バナー広告追加
- `app/(tabs)/review/question/[id].tsx` - 10問バッチセッション対応、バナー広告追加

## 主要な設計判断

### 1. セッションサイズ: 10問

ユーザー要件により15問から10問に変更。`SESSION_BATCH_SIZE`定数で一元管理。

### 2. インタースティシャル頻度キャップ

```typescript
export const INTERSTITIAL_FREQUENCY_CAP = {
  maxPerSession: 1, // 1セッションにつき最大1回
  maxPerDay: 2, // 1日最大2回
  minIntervalMs: 10 * 60 * 1000, // 最低10分間隔
};
```

### 3. レビュー依頼条件

```typescript
export const REVIEW_PROMPT_CONDITIONS = {
  requiredSessionCounts: [3, 5], // 3回目と5回目
  cooldownDays: 7, // 7日間クールダウン
  postPurchaseWaitHours: 24, // 購入後24時間待機
};
```

### 4. プロバイダー階層

```
SafeAreaProvider
  └─ ThemeProvider
       └─ PurchaseProvider
            └─ AdProvider
                 └─ Stack (Router)
```

AdProviderはPurchaseProviderに依存（isPremium確認のため）。

## 依存パッケージ

```json
{
  "expo-secure-store": "~14.0.1",
  "react-native-google-mobile-ads": "^14.5.0",
  "react-native-iap": "^12.15.5",
  "react-native-in-app-review": "^4.3.3"
}
```

## 今後のTODO

### 即時対応が必要

1. ~~**問題画面への10問バッチ対応統合**~~ ✅ 完了
   - ~~既存の問題画面にuseSessionフック統合~~
   - ~~バナー広告コンポーネント追加~~
   - ~~セッション完了時の結果画面遷移~~
   - **対象ファイル**: `app/(tabs)/learning/question/[id].tsx`, `app/(tabs)/review/question/[id].tsx`

2. **依存パッケージのインストール** ⚠️ 未実行
   - `npm install` を実行して新規パッケージをインストール
   - 必要パッケージ: `react-native-google-mobile-ads`, `react-native-iap`, `react-native-in-app-review`

3. **本番AdMob広告IDの設定**
   - `src/config/monetization.ts`のPROD_AD_UNITSを本番IDに更新
   - `app.json`のAdMob App IDを本番IDに更新

### ストア設定

#### iOS (App Store Connect)

1. App内課金の設定
   - 製品ID: `remove_ads`
   - タイプ: 非消耗型
   - 価格: Tier 5 (¥500相当)
2. SKAdNetworkの確認（app.jsonで設定済み）
3. ATT説明文の審査対応

#### Android (Google Play Console)

1. アプリ内アイテムの設定
   - 製品ID: `remove_ads`
   - タイプ: 管理対象アイテム
   - 価格: ¥500

### 動作確認チェックリスト

> **注意**: `npm install` 実行後に動作確認を行うこと

- [ ] バナー広告が問題画面下部に表示される（学習・復習両方）
- [ ] プレミアムユーザーは全広告非表示
- [ ] 10問完了でセッション結果画面に遷移
- [ ] セッション進捗表示（例: 「セッション: 3/10問」）が正しく動作
- [ ] 「次の10問へ」でインタースティシャル表示（頻度キャップ内）
- [ ] 広告削除購入フローが動作
- [ ] 購入復元が機能
- [ ] 3回目/5回目セッション完了でレビュー依頼
- [ ] エラー時もクラッシュせず学習継続可能

## アーキテクチャ図

```
┌─────────────────────────────────────────────────────┐
│                    UI Layer                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐    │
│  │ Question   │  │ Session    │  │ Settings   │    │
│  │ Screen     │  │ Result     │  │ Screen     │    │
│  └────────────┘  └────────────┘  └────────────┘    │
│         │              │               │            │
│         └──────────────┼───────────────┘            │
│                        │                            │
├────────────────────────┼────────────────────────────┤
│                  Context Layer                       │
│  ┌────────────┐  ┌────────────┐                    │
│  │ Purchase   │  │ Ad         │                    │
│  │ Context    │  │ Context    │                    │
│  └────────────┘  └────────────┘                    │
│         │              │                            │
├─────────┼──────────────┼────────────────────────────┤
│         │       Service Layer                        │
│  ┌──────┴─────┐  ┌─────┴──────┐  ┌────────────┐   │
│  │ Session    │  │ Ad         │  │ Review     │   │
│  │ Service    │  │ Service    │  │ Prompt     │   │
│  └────────────┘  └────────────┘  └────────────┘   │
│         │              │               │            │
├─────────┼──────────────┼───────────────┼────────────┤
│         │        Data Layer           │            │
│  ┌──────┴──────────────┴───────────────┴──────┐   │
│  │           Settings Repository               │   │
│  └──────────────────────────────────────────────┘   │
│                        │                            │
│              ┌─────────┴─────────┐                 │
│              │   SQLite          │                 │
│              │  (app_settings)   │                 │
│              └───────────────────┘                 │
└─────────────────────────────────────────────────────┘
```

## テスト用設定

### Sandbox/テスト環境

- **AdMob**: `__DEV__`環境では自動的にテスト広告IDを使用
- **IAP iOS**: App Store Connect → Sandbox Testerを設定
- **IAP Android**: Google Play Console → ライセンステスターを設定

## 参考資料

- [react-native-google-mobile-ads](https://github.com/invertase/react-native-google-mobile-ads)
- [react-native-iap](https://github.com/dooboolab/react-native-iap)
- [react-native-in-app-review](https://github.com/MinaSamir11/react-native-in-app-review)
- [AdMob Test IDs](https://developers.google.com/admob/ios/test-ads)
