# App Store提出エラー修正 - 2025-08-24

## 問題の発生

App Store Connect への提出時にビルド番号重複エラーが発生しました。

### エラー内容

```
✖ Something went wrong when submitting your app to Apple App Store Connect.

You've already submitted this build of the app.
Builds are identified by CFBundleVersion from Info.plist (expo.ios.buildNumber in app.json).
If you're submitting an Expo project built with EAS Build, increment the build number (expo.ios.buildNumber) in app.json and build the project again.
```

### 提出状況

- **App Version**: 1.0.3
- **Build Number**: 4（既に提出済み）
- **Bundle ID**: com.yoshi.Boki3rdReviewMaster.alpha

## 根本原因

同じビルド番号（buildNumber: "4"）が既にApp Store Connectに提出済みのため、Apple側で重複として拒否された。

## 実装した修正

### ファイル修正

**ファイル**: `/app.json`

**修正内容**:

```json
// 修正前
"ios": {
  "supportsTablet": true,
  "bundleIdentifier": "com.yoshi.Boki3rdReviewMaster.alpha",
  "buildNumber": "4"
}

// 修正後
"ios": {
  "supportsTablet": true,
  "bundleIdentifier": "com.yoshi.Boki3rdReviewMaster.alpha",
  "buildNumber": "5"
}
```

## ビルド・提出手順

### 1. 新しいビルド作成

```bash
eas build -p ios --profile production
```

### 2. App Store Connect提出

```bash
eas submit --platform ios --profile production
```

## 学習・改善点

### ビルド番号管理のベストプラクティス

1. **提出前チェック**: 毎回buildNumberが前回より大きいことを確認
2. **履歴管理**: 提出したbuildNumberと内容を記録
3. **自動化検討**: CI/CDでbuildNumber自動インクリメント設定

### 今後の提出履歴

| 提出日         | Version | Build Number | 内容                 | ステータス |
| -------------- | ------- | ------------ | -------------------- | ---------- |
| 2025-08-24以前 | 1.0.3   | 4            | フィルター機能修正版 | 提出済み   |
| 2025-08-24     | 1.0.3   | 5            | buildNumber修正版    | 提出予定   |

## 技術的詳細

### Apple App Storeのビルド識別

- ビルドは`CFBundleVersion`（app.jsonの`expo.ios.buildNumber`）で識別
- 同じBundle IDで同じbuildNumberの重複提出は不可
- バージョン（`CFBundleShortVersionString`）は同じでも、buildNumberが異なれば提出可能

### EAS Buildでの注意点

- `ios`ディレクトリが存在する場合、app.jsonの値は無視される場合がある
- 今回はapp.jsonの値が正しく使用されている状態

## 影響範囲

- **変更対象**: app.json（1ファイル）
- **影響範囲**: iOS App Store提出プロセスのみ
- **ユーザー影響**: なし（内部管理用の番号変更）
- **機能変更**: なし

## 検証結果

修正完了後の状態：

- ✅ buildNumber: "4" → "5" への変更完了
- ✅ app.json構文チェック：問題なし
- ⏳ 新しいビルド作成・提出：実行待ち

---

**修正者**: Claude Code  
**作業日時**: 2025-08-24  
**ステータス**: ✅ 完了・新しいビルド提出準備完了  
**次のアクション**: `eas build -p ios --profile production` でビルド作成後、`eas submit --platform ios --profile production` で提出

---

## 追加修正（2025-08-24 00:48 重要）

### 継続エラーの原因判明

初回修正後も同じエラーが発生していた根本原因：

```
Specified value for "ios.bundleIdentifier" in app.json is ignored because an ios directory was detected in the project.
EAS Build will use the value found in the native code.
```

**iosディレクトリが存在する場合、EAS Buildはapp.jsonの値を無視し、ネイティブコード（Info.plist）の値を使用する**

### 追加ファイル修正

**ファイル**: `ios/3Alpha/Info.plist`

```xml
<!-- 修正前 -->
<key>CFBundleVersion</key>
<string>4</string>

<!-- 修正後 -->
<key>CFBundleVersion</key>
<string>5</string>
```

### 修正完了状態

- ✅ app.json buildNumber: "4" → "5"
- ✅ Info.plist CFBundleVersion: "4" → "5" **（新規追加）**
- ✅ 両ファイル修正完了

### 教訓

Expoプロジェクトでiosディレクトリが存在する場合：

1. **app.jsonとInfo.plist両方**のビルド番号を更新する必要がある
2. EAS Buildは**Info.plistを優先**する
3. `npx expo prebuild --clean`での再生成も選択肢の一つ
