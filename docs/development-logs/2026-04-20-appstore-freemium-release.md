# 2026-04-20 App Store フリーミアムリリース対応

## 概要

有料アプリから「無料（広告付き）+ IAP で広告削除（¥500）」のフリーミアムモデルへ移行し、v1.1.0 (build 19) を App Store 審査提出。

## 実施内容

### ビルド番号更新（18 → 19）

build 18 がすでに ASC に登録済みだったため、以下の2ファイルを更新：

- `app.json`: `ios.buildNumber` を `"18"` → `"19"`
- `ios/3Alpha/Info.plist`: `CFBundleVersion` を `18` → `19`

### EAS ビルド＆提出

```bash
eas build --profile production --platform ios --auto-submit
```

### App Store Connect プライバシー設定

`NSUserTrackingUsageDescription` を含むビルドのため、ASC のプライバシー設定で以下を回答：

| 項目               | 回答               |
| ------------------ | ------------------ |
| データ収集         | はい               |
| データの種類       | 広告データ         |
| 使用目的           | サードパーティ広告 |
| 個人情報との紐づけ | いいえ             |
| トラッキング目的   | はい               |

### 審査提出

v1.1.0 (build 19) を App Store 審査へ提出。ステータス：審査待ち。

## フリーミアム構成

- **無料プラン**: 全問題使用可能、AdMob バナー広告＋インタースティシャル広告あり
- **有料プラン**: IAP `remove_ads`（¥500、非消耗型）で広告を完全削除
- **広告制御**: `AdService` で頻度キャップ（1セッション1回・1日2回・10分間隔）

## 残タスク

- [ ] App Store Connect で IAP 商品 `remove_ads` を登録
- [ ] アプリ価格を「無料」に変更（未変更の場合）
- [ ] 審査結果を確認
- [ ] Android 版 AdMob 本番 ID 設定（`src/config/monetization.ts`）
