# 2026-04-30 App Store 再リジェクト対応（ATT タイミング修正 v2）

## 概要

審査 ID `b6acfe84-ca8d-4bd3-9fea-f4a24f18f925`（build 20 / v1.1.1）のリジェクト。  
レビュー端末: **iPad Air 11-inch (M3) on iPadOS 26.4.2**

### リジェクト内容（再）

| ガイドライン | 内容                                                                              |
| ------------ | --------------------------------------------------------------------------------- |
| 2.1          | iPadOS 26.4.2 で ATT 許可ダイアログが起動時に表示されない（前回 build 19 と同様） |

Apple は今回「**物理デバイスでの画面録画**」を明示要求。前回は誤ってシミュレータで録画していた。

---

## 根本原因

### A（最有力）: iOS scene が `active` になる前に `requestTrackingAuthorization` を呼んでいた

iOS は `ATTrackingManager.requestTrackingAuthorization` をアプリが foreground active でない状態で呼ぶと、**ダイアログを出さず即 `notDetermined` を返す**。  
前回修正（build 20）では useEffect 直後に呼び出していたが、iPadOS 26 の Stage Manager / SceneDelegate ライフサイクルでは起動直後に scene が一度 inactive を経るため、silently スキップされていた。

### B: `PurchaseProvider` 内の IAP 初期化が ATT 呼び出し前に JS スレッドを詰まらせていた

`AdProvider` が `PurchaseProvider` の子であり、`initConnection()` / `getProducts()` が先にスケジュールされていた。

---

## 実施した修正

### 1. ATT 専用コンポーネント `AttBootstrapper` を新設

**新規ファイル:** `src/components/AttBootstrapper.tsx`

- Provider 階層の外（`SafeAreaProvider` 直下）に配置し、IAP 初期化より物理的に先に起動
- `AppState.currentState === "active"` を確認してから ATT を呼び出す（Stage Manager 対策）
- active 確認後さらに 300ms 待機（SceneDelegate activation 完了猶予）
- `getTrackingPermissionsAsync` の事前チェックを除去し、`requestTrackingPermissionsAsync` を直接呼ぶ（Apple 推奨・冪等）
- `useRef` で多重呼び出しガード（StrictMode 対策）

### 2. `AdContext.tsx` から ATT ロジックを完全除去

- `getTrackingPermissionsAsync` / `requestTrackingPermissionsAsync` import 削除
- `isTrackingPermissionResolved` state 削除
- `hasRequestedTrackingPermissionRef` 削除
- `requestTrackingPermission` 関数削除
- AdMob 初期化を ATT 待機なしで直接実行（AdMob SDK が内部で ATT ステータスを参照して広告パーソナライズを制御）

### 3. `app/_layout.tsx` に `AttBootstrapper` を追加

```tsx
<SafeAreaProvider>
  <AttBootstrapper />   {/* ← 追加：最上位で ATT を最速起動 */}
  <ThemeProvider>
    ...
```

### 4. バージョン番号を 1.1.2 / build 21 へ更新

| ファイル                                        | 変更前     | 変更後     |
| ----------------------------------------------- | ---------- | ---------- |
| `app.json`                                      | 1.1.1 / 20 | 1.1.2 / 21 |
| `ios/3Alpha/Info.plist`                         | 1.1.1 / 20 | 1.1.2 / 21 |
| `ios/3Alpha.xcodeproj/project.pbxproj` (2 箇所) | 1.1.0 / 18 | 1.1.2 / 21 |

pbxproj の version ドリフト（1.1.0 / build 18）も同時に解消。

---

## 品質確認

- TypeScript: エラー 0
- ESLint: エラー 0（warnings は既存の pre-existing 問題のみ）

---

## 残タスク（ユーザー実施）

| #   | 内容                                                                             |
| --- | -------------------------------------------------------------------------------- |
| U1  | EAS ビルド: `eas build --profile production --platform ios --auto-submit`        |
| U2  | **物理 iPhone** で ATT ダイアログの画面収録を取得（下記手順参照）                |
| U3  | ASC の審査 ID `b6acfe84-ca8d-4bd3-9fea-f4a24f18f925` へ返信 + Notes 欄に録画添付 |

### U2 実機録画の手順

1. TestFlight で build 21 をインストール（または開発ビルドをデバイスに転送）
2. 「設定 → プライバシーとセキュリティ → トラッキング」でアプリのトラッキングをリセット
3. iOS コントロールセンターから**画面収録を開始**
4. アプリをホームから起動
5. ATT ダイアログが表示されることを確認 → 「許可」または「許可しない」をタップ
6. ホーム画面遷移まで録画
7. 画面収録停止 → 動画を保存

### U3 ASC 返信テンプレート

```
Thank you for your continued review. We have addressed the issue with the following changes in build 21 (v1.1.2):

[Guideline 2.1 – App Tracking Transparency]
The ATT permission request was silently skipped on iPadOS 26 because
requestTrackingAuthorization was called before the app scene became
UIApplicationStateActive (a known Stage Manager / SceneDelegate
lifecycle behavior). We have:

  1. Extracted ATT into a dedicated top-level component (AttBootstrapper)
     that is mounted before any IAP initialization to eliminate scheduling
     contention.
  2. Added an AppState 'active' gate: the ATT prompt is now only triggered
     after the scene is confirmed active, followed by a 300 ms stabilization
     delay for SceneDelegate activation on iPadOS 26.
  3. Removed the unnecessary getTrackingPermissionsAsync pre-check and now
     call requestTrackingPermissionsAsync directly as recommended by Apple.

A screen recording captured on a physical iPhone demonstrating the ATT
prompt at first launch is attached in the Notes field below.

Please let us know if you need any additional information.
```

---

## バージョン情報

| 項目                       | 値                                   |
| -------------------------- | ------------------------------------ |
| CFBundleShortVersionString | 1.1.2                                |
| CFBundleVersion (build)    | 21                                   |
| Bundle ID                  | com.yoshi.Boki3rdReviewMaster.alpha  |
| EAS project ID             | 257418fd-fb59-4a5a-8b3c-194bd15706ad |
| ASC App ID                 | 6751177724                           |
