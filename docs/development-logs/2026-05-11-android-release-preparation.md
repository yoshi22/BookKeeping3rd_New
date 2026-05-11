# Android リリース準備 チェックリスト

**作成日**: 2026-05-11  
**対象**: Google Play Store への初回リリース  
**アプリ**: 簿記3級「確実復習」  
**applicationId**: `com.yoshi.Boki3rdReviewMaster.alpha`  
**versionCode**: 12 / **versionName**: 1.0.13

---

## 1. AdMob 本番 ID の取得・設定

本番リリース前に必ず実施。現在はテスト ID のまま。

### 手順

1. [AdMob コンソール](https://admob.google.com/) にアクセス
2. 「アプリを追加」→ Android → アプリ名「簿記3級 確実復習」
3. **アプリ ID** (形式: `ca-app-pub-XXXX~XXXX`) をコピー
4. `app.json` の `plugins > react-native-google-mobile-ads > androidAppId` に設定
5. AdMob コンソールで広告ユニット作成 (バナー・インタースティシャル各1件)
6. `src/config/monetization.ts` の `PROD_AD_UNITS.android` に各ユニット ID を設定

### 確認ファイル

- `app.json:193` — `androidAppId`（現在: Google 公式テスト ID）
- `src/config/monetization.ts:47-48` — `PROD_AD_UNITS.android`

---

## 2. Play Console アプリ登録

1. [Google Play Console](https://play.google.com/console/) でアプリを作成
2. パッケージ名: `com.yoshi.Boki3rdReviewMaster.alpha`
3. デフォルト言語: 日本語

---

## 3. IAP 商品登録

1. Play Console → 対象アプリ → 収益化 → 商品
2. 「管理対象商品」を追加:
   - **商品 ID**: `remove_ads`（iOS と共通）
   - **種別**: 買い切り（消費しない）
   - **名称**: 広告を非表示にする
   - **説明**: アプリ内の広告をすべて非表示にします
   - **価格**: iOS に準じる（例: ¥250）
3. ステータスを「有効」にする

---

## 4. リリース署名 (EAS Remote Credentials)

EAS が Google キーストアを自動管理するため、ローカル作業不要。

```bash
# 初回: EAS にキーストアを生成させる
eas credentials -p android
# 「Generate new keystore」を選択 → EAS が保管

# 確認
eas credentials -p android  # 登録済みキーストアが表示されれば OK
```

> ⚠️ キーストアを一度 Play Store に提出したら**絶対に変更不可**。
> EAS Remote Credentials を使っている限り自動的に保護される。

---

## 5. Play Console サービスアカウント設定 (EAS Submit 用)

`eas submit` で自動提出するために必要。

### 手順

1. [Google Cloud Console](https://console.cloud.google.com/) → IAM → サービスアカウント
2. 新規作成 → 名前「eas-submit」→ 役割「なし」
3. JSON キーを作成・ダウンロード → `google-service-account.json` 等で保存
4. [Play Console](https://play.google.com/console/) → 設定 → API アクセス
5. 上記サービスアカウントに「リリースマネージャー」権限を付与
6. `eas.json` に追記:

```json
"submit": {
  "production": {
    "android": {
      "track": "internal",
      "releaseStatus": "draft",
      "serviceAccountKeyPath": "./google-service-account.json"
    }
  }
}
```

> ⚠️ `google-service-account.json` は `.gitignore` に追加して絶対にコミットしない。

---

## 6. AAB ビルドと Play Console 提出

### EAS クラウドビルド

```bash
# 本番 AAB ビルド (EAS クラウド, 約 15-25 分)
npm run build:android
# = eas build --platform android --profile production

# ビルド完了後, Play Console 内部テストに提出
eas submit -p android --latest
```

### ビルド前チェックリスト

- [ ] `android/app/build.gradle` の `versionCode` をインクリメント
- [ ] `app.json` の `android.versionCode` を同期
- [ ] AdMob 本番 ID が設定済みか確認 (`PROD_AD_UNITS.android` の XXXX が残っていないか)
- [ ] `app.json` の `androidAppId` がテスト ID でないか確認

---

## 7. 実機検証チェックリスト

### 基本動作

- [ ] 学習タブ: Q_J_001 を解答 → 正答判定
- [ ] 復習タブ: 不正解後に復習問題が表示される
- [ ] 統計タブ: 学習データが正常に表示される
- [ ] 設定タブ: テーマ変更、データリセット
- [ ] 戻るキー: 意図しない画面遷移が起きない

### スクロール回帰 (Android 固有)

`docs/development-logs/2025-11-30-android-scroll-fix-phase7.md` 参照

- [ ] 問題回答モーダルがスクロール可能
- [ ] 結果画面が縦長でも正常表示

### IAP / 広告

- [ ] 広告 (バナー・インタースティシャル) が表示される
- [ ] `remove_ads` 購入 → 広告が非表示になる
- [ ] アプリ再起動後も広告非表示が維持される
- [ ] 「購入を復元」が動作する

### 端末・OS バリエーション

- [ ] Pixel (Android 14)
- [ ] Galaxy mid-range (Android 12-13)
- [ ] Android 8.x (minSdk 24 付近)
- [ ] ダークモード
- [ ] 横向きロック解除時の表示崩れなし

---

## 8. Play ストアリスティング

`docs/playstore-listing.md` を参照。

- [ ] 短い説明 (80 文字以内)
- [ ] 詳細な説明 (4000 文字以内)
- [ ] スクリーンショット 最低 2 枚 (推奨 4-8 枚, `docs/screenshots/playstore/raw/`)
- [ ] アイコン 512×512 PNG
- [ ] フィーチャーグラフィック 1024×500 PNG
- [ ] プライバシーポリシー URL
- [ ] データセーフティ入力 (収集データなし・完全オフライン)
- [ ] コンテンツレーティング質問票

---

## 9. versionCode 運用ルール

Play Store はアップロード済みの versionCode を再利用不可。

| リリース     | versionCode | 備考             |
| ------------ | ----------- | ---------------- |
| 初回 Android | 12          | 現在の設定値     |
| 次回         | 13          | 両ファイルを更新 |
| ...          | +1          | 毎リリースごと   |

更新ファイル:

- `android/app/build.gradle`: `versionCode` の数値
- `app.json`: `expo.android.versionCode` の数値

---

## 10. リリース後モニタリング

- Play Console → Android Vitals: クラッシュ率・ANR 率を確認
- AdMob コンソール: 広告の表示・収益確認
- Play Console → レビュー: ユーザーフィードバック
