# 2026-04-29 App Store 再審査提出（build 20 / v1.1.1）

## 概要

審査リジェクト（ID: `aeb0a2cf-3afd-4823-9706-517151825428`）への対応を完了し、build 20 (v1.1.1) を App Store 審査へ再提出した。

---

## 本セッションで実施した作業

### SSH 認証の修正

Mac 再起動で SSH エージェントがリセットされていたため、新しい SSH 鍵を生成して GitHub に登録し直した。

- 新しい鍵: `~/.ssh/id_ed25519_new`（ED25519、パスフレーズなし）
- `~/.ssh/config` を設定し macOS Keychain 連携を有効化
- `origin` リモートを HTTPS から SSH に変更

```
git remote set-url origin git@github.com:yoshi22/BookKeeping3rd_New.git
```

### .gitignore 修正

EAS Build がローカルビルド成果物をアップロードしようとしてファイル名ケーシングエラーが発生したため除外。

追加した除外パターン:

- `ios/build-release/`
- `ios/build-release-verify/`
- `ios/build-release-launchable/`
- `docs/appstore-response/`

### EAS Build & Submit

```
eas build --profile production --platform ios --auto-submit
```

| 項目          | 値                                   |
| ------------- | ------------------------------------ |
| Build ID      | 1b1d7b69-3c9b-45ec-ba37-ea9b2e0e1fc1 |
| Submission ID | 192b2a0d-410d-4894-a957-7132d14a31e6 |
| バージョン    | 1.1.1                                |
| build 番号    | 20                                   |
| ASC App ID    | 6751177724                           |

Apple サーバーへのバイナリ提出完了。

### ATT ダイアログ録画（シミュレータ）

iPad Air 11-inch (M3) シミュレータで ATT ダイアログの表示を確認・録画。

```bash
xcrun simctl boot F9FD1811-40E9-49C7-8804-0683434653E9
xcrun simctl install F9FD1811-... ios/build-release-launchable
xcrun simctl privacy F9FD1811-... reset all com.yoshi.Boki3rdReviewMaster.alpha
xcrun simctl io F9FD1811-... recordVideo att-dialog-simulator-20260429.mp4
xcrun simctl launch F9FD1811-... com.yoshi.Boki3rdReviewMaster.alpha
```

ATT ダイアログが起動直後に表示されることを確認済み（スクリーンショットで視覚確認）。

保存先: `docs/appstore-response/videos/att-dialog-simulator-20260429.mp4`

### App Store Connect 対応（ユーザー実施）

- 審査 ID `aeb0a2cf-...` に返信（ATT 修正説明 + Support URL 復旧の報告）
- build 20 (v1.1.1) を App Store 審査に提出

---

## コミット一覧

| コミット  | 内容                                                         |
| --------- | ------------------------------------------------------------ |
| `a206093` | ATT 実装・Support URL 修正・バージョン更新（前回セッション） |
| `406fe99` | ATT を起動直後に表示するよう AdContext を改善                |
| `cf5c993` | ローカル iOS ビルド成果物を .gitignore に追加                |

---

## 現在のステータス

- App Store: v1.1.1 / build 20 が審査中
- 審査結果は通常 1〜3 営業日でメール通知
