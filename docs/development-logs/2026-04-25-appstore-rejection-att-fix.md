# 2026-04-25 App Store 審査リジェクト対応（ATT タイミング修正）

## 概要

審査 ID `aeb0a2cf-3afd-4823-9706-517151825428`（v1.1.0 / build 19）のリジェクトを受け、前回セッション（2026-04-21〜22）の作業を引き継いで完了させた。

## リジェクト内容

| ガイドライン | 内容                                              |
| ------------ | ------------------------------------------------- |
| 2.1          | iPadOS 26.4.1 で ATT 許可ダイアログが表示されない |
| 1.5          | Support URL がエラー                              |

---

## 前回セッション（2026-04-21〜22）で完了していた対応

コミット `a206093` に集約。

- `expo-tracking-transparency@~5.1.1` を追加
- `app.json` に expo-tracking-transparency プラグイン追加
- `NSUserTrackingUsageDescription` 文言を 3 箇所で統一
- `src/context/AdContext.tsx` に ATT 処理を実装（初版）
- `docs/privacy-policy.html` を広告・IAP・ATT 仕様に合わせて全面改訂
- `docs/support.html` の「完全オフライン」表記を修正（Support URL 復旧）
- バージョン 1.1.1 / build 20 へ更新

---

## 本セッション（2026-04-25）で実施した対応

### コミット `406fe99`

**ファイル:** `src/context/AdContext.tsx`, `ios/3Alpha.xcodeproj/project.pbxproj`, `ios/Podfile.lock`

#### ATT タイミングの根本修正

前回実装は ATT を AdMob 初期化フローの中に組み込んでおり、`usePurchase().isPurchaseLoading` が false になるまで待ってから初期化していた。IAP 接続に時間がかかる場合、ATT が遅延して Apple 審査時に「ダイアログが出ない」と判定される恐れがあった。

変更内容:

- `requestTrackingPermission()` を独立した `useEffect` に切り出し、`AdProvider` マウント直後に呼び出す
- `isTrackingPermissionResolved` フラグで ATT 解決後にのみ AdMob を初期化
- `hasRequestedTrackingPermissionRef`（useRef）で多重呼び出しを防止
- `isPurchaseLoading` への依存を完全に除去

#### Pod install 副生成物のコミット

`pod install` で生成された以下を含める（ビルド再現性のため）:

- `ios/3Alpha.xcodeproj/project.pbxproj` — RNGoogleMobileAds の `[CP-User]` ビルドフェーズ追加
- `ios/Podfile.lock` — ExpoTrackingTransparency / Google-Mobile-Ads-SDK 等のロック更新

### 品質確認

- TypeScript エラー: 0
- ESLint: warnings のみ（既存の pre-existing 問題、0 errors）
- Jest: 78 tests passed

---

## 残タスク（ユーザー実施）

| #   | 内容                                                                                          |
| --- | --------------------------------------------------------------------------------------------- |
| U1  | git push 後、`eas build --profile production --platform ios --auto-submit` で build 20 を提出 |
| U2  | 実機（iPhone/iPad）で ATT ダイアログを画面収録（Apple が物理デバイスでの録画を明示要求）      |
| U3  | ASC 上の審査 ID `aeb0a2cf-...` へ返信し、Notes 欄に動画を添付                                 |
| U4  | ASC アプリプライバシー設定「トラッキングあり」を再確認                                        |

### U2 実機録画の手順メモ

1. 「設定 → プライバシーとセキュリティ → トラッキング」でアプリ許可をリセット
2. 画面収録を開始
3. アプリ起動 → ATT ダイアログ → タップ → ホーム画面まで撮影

### ASC 返信文テンプレート

```
Thank you for your review. We have addressed both issues:

[Guideline 2.1 – ATT]
We identified that the App Tracking Transparency prompt was delayed
due to an in-app purchase loading dependency. We have now decoupled
the ATT request from IAP initialization so it appears immediately
on first launch. Please see the attached screen recording captured
on a physical device demonstrating the ATT prompt flow.

[Guideline 1.5 – Support URL]
The support URL (https://yoshi22.github.io/BookKeeping3rd_New/support.html)
is now fully functional and has been since April 21, 2026.

Build 20 (v1.1.1) contains all fixes.
```

---

## バージョン情報

| 項目                       | 値                                   |
| -------------------------- | ------------------------------------ |
| CFBundleShortVersionString | 1.1.1                                |
| CFBundleVersion (build)    | 20                                   |
| 提出予定 bundle ID         | com.yoshi.Boki3rdReviewMaster.alpha  |
| EAS project ID             | 257418fd-fb59-4a5a-8b3c-194bd15706ad |
| ASC App ID                 | 6751177724                           |
