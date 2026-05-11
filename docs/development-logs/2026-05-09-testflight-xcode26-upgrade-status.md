# 2026-05-09 TestFlight / Xcode 26 対応進捗

## 目的
- 最新コードを含む iOS build を TestFlight で使える状態にする
- TestFlight sandbox の価格診断強化を含む最新版を配布する

## コード側の状態
- IAP storefront 診断強化は実装済み
- `StoreKit 2` ベースの storefront 診断を表示する実装あり
- 設定画面に `ストア情報を再取得` ボタン追加済み
- `buildNumber` は `29`
- `version` は `1.1.3`

## build 29 の状態
- `macOS 26.4.1 / Xcode 26.4.1 / iOS 26.4 SDK` でローカル `eas build --local --platform ios --profile production` は成功
- 生成済み IPA:
  - `/private/tmp/3Alpha-build29.ipa`
- App Store Connect への提出も成功
- Apple 側の処理完了待ち:
  - https://appstoreconnect.apple.com/apps/6751177724/testflight/ios

## build 30 の状態
- App Review 指摘対応として、アプリ内の固定価格表示を削除
  - 設定画面の `¥500` 表示を削除
  - セッション結果画面の `広告を削除（¥500）` 表示を `広告を非表示` に変更
  - 価格は Apple の購入シートで確認する方針に変更
- ユーザー向け文言を `広告削除` から `広告を非表示` / `広告非表示` へ整理
- `buildNumber` / `CFBundleVersion` / `CURRENT_PROJECT_VERSION` を `30` に更新
- ローカル build 成功:
  - `/private/tmp/3Alpha-build30.ipa`
- App Store Connect への提出成功:
  - https://expo.dev/accounts/yoshi22/projects/fukushumaster-alpha/submissions/6db110cf-3863-4764-8dd3-35d94de2843c

## build 31 の状態
- build 30 の TestFlight 確認で、リリース画面に StoreKit 診断値が表示されていることを確認
- リリース用 UI から以下を削除
  - `StoreKit 診断値を表示しています...`
  - `currency` / `countryCode` / `storefrontId` / `receipt environment` / `診断ソース`
  - `ストア情報を再取得` ボタン
  - `今すぐ更新` / `再取得中...`
  - sandbox storefront が USA の注意文
- 購入ボタン、購入復元、内部の IAP 商品取得処理は維持
- 購入完了アラートを `広告が非表示になりました。ありがとうございます！` に修正
- `buildNumber` / `CFBundleVersion` / `CURRENT_PROJECT_VERSION` を `31` に更新
- ローカル build 成功:
  - `/private/tmp/3Alpha-build31.ipa`
- App Store Connect への提出成功:
  - https://expo.dev/accounts/yoshi22/projects/fukushumaster-alpha/submissions/85e5f809-d27d-4dd4-9a1c-1a4267aa4596
- TestFlight 確認先:
  - https://appstoreconnect.apple.com/apps/6751177724/testflight/ios

## build 31 検証
- `npx tsc --noEmit`: 成功
- `npm run lint -- --quiet`: 成功
- `npm test -- --runInBand`: 成功
  - 4 suites passed
  - 3 suites skipped
  - 78 tests passed
  - 15 tests skipped
- 診断 UI 文言の残存確認:
  - `rg 'StoreKit 診断値|ストア情報を再取得|今すぐ更新|receipt environment|sandbox storefront|settings-refresh-storefront-button|価格情報を再取得' app src -n`
  - 該当なし

## 2026-05-10 App Store Connect 提出対応
- Apple Review 指摘:
  - `Guideline 2.1(b) - Performance - App Completeness`
  - アプリ内に `広告削除` への参照があるが、対応する App 内課金が審査提出されていない、という指摘
- App 内課金 `広告を削除`:
  - App Store Connect の左タブ `アプリ内購入` で `提出準備完了` になったことを確認
- バージョン `1.1` の `アプリ内購入とサブスクリプション`:
  - 当初は `このアプリバージョンに追加するアプリ内購入またはサブスクリプションを選択してください。（オプション）` の下に選択 UI が表示されなかった
  - バージョン `1.1` のビルド欄から build `31` を一度削除したところ、App 内課金の選択 UI が表示された
  - `広告を削除` をバージョン `1.1` に追加
- 提出:
  - App 本体と App 内課金 `広告を削除` を紐づけた状態で審査提出済み
  - これにより、前回レビューコメントの「In-App Purchase products have not been submitted for review」への対応を完了

## 提出失敗の原因
- Apple の受け入れ条件が変わっており、`iOS 26 SDK / Xcode 26 以降` でのビルドが必要
- 失敗時点のローカル環境は `Xcode 16.4 / iOS 18.5 SDK`
- Apple からの実エラー要旨:
  - `This app was built with the iOS 18.5 SDK`
  - `All iOS and iPadOS apps must be built with the iOS 26 SDK or later`
- 2026-05-09 に `Xcode 26.4.1 / iOS 26.4 SDK` へ更新後、再提出成功

## Xcode 26 追加対応
- `Pods/fmt` が Xcode 26 の C++20 `consteval` 判定で archive 失敗した
- `ios/Podfile` の `post_install` で `Pods/fmt/include/fmt/base.h` の `FMT_USE_CONSTEVAL` 判定を無効化するパッチを追加
- この対応後、`fmt` のコンパイルを通過し IPA export まで成功

## マシン状態
- 現在 OS:
  - `macOS 15.5`
- ハードウェア:
  - `MacBook Pro (M3 / Mac15,3)`
- `softwareupdate --list` では以下が利用可能
  - `macOS Tahoe 26.4.1`
  - `macOS Sequoia 15.7.5`

## Xcode インストール状況
- `/Applications/Xcode.app` は `Xcode 26.4.1`
- `xcodebuild -showsdks` で `iphoneos26.4` を確認済み
- 確認コマンド:
  - `xcodebuild -version`
  - `xcodebuild -showsdks`

## 空き容量確保で実施済み
- 削除済み:
  - `~/Library/Developer/Xcode/DerivedData`
  - `~/Library/Developer/CoreSimulator`
  - `~/Library/Developer/Xcode/iOS DeviceSupport`
  - `~/Library/Developer/Xcode/Archives`
  - `~/Projects/BookKeeping3rd/ios/build`
- ゴミ箱も空にした
- 空き容量は約 `78GB`

## 確認済み環境
1. `sw_vers`:
   - `ProductVersion: 26.4.1`
2. `xcodebuild -version`:
   - `Xcode 26.4.1`
   - `Build version 17E202`
3. `xcode-select -p`:
   - `/Applications/Xcode.app/Contents/Developer`

## 実行済み手順
1. macOS を `26.4.1` へ更新
2. `Xcode 26.4.1` をインストール
3. Xcode Components から `iOS 26.4` SDK をインストール
4. 再ビルド
   - `EAS_SKIP_AUTO_FINGERPRINT=1 eas build --local --platform ios --profile production --output /private/tmp/3Alpha-build29.ipa --non-interactive`
5. 再提出
   - `eas submit --platform ios --path /private/tmp/3Alpha-build29.ipa --profile production --non-interactive`

## 代替案
- EAS cloud build を使う
- ただし前回は Free plan の iOS build 上限で停止
- build 枠が使えるなら `production` profile は `image: "latest"` のため有力

## 補足
- `mas install 497799835` は管理者パスワード要求で自動完了できなかった
- EAS Submit:
  - https://expo.dev/accounts/yoshi22/projects/fukushumaster-alpha/submissions/4bc25b52-6221-4b4e-ad18-1d480e0c8c8f
- `react-native-google-mobile-ads` の build script が `ios_app_id key not found` 警告を出したが、生成対象の `ios/3Alpha/Info.plist` には `GADApplicationIdentifier` が入っていることを確認済み
