# 2025-09-30 今後の開発方針

## 1. 方針サマリー
- **CBT準拠学習体験の確立**: 第2問・第3問のフォーム刷新とヘッダー/ナビ共通化で本番同等の操作感を提供する。
- **データ駆動のテンプレート移行**: `template_type`・`layout_variant`・`allowed_accounts` を全問題へ適用し、UIと採点を統一フォーマットで管理する。
- **学習効率と継続率の追跡**: 指標（滞在時間、正答率、セクション別完了率）をダッシュボード化し、改善施策の効果測定を継続する。
- **段階的リリースとリスク低減**: Feature Flag と A/B テストを活用し、既存学習ユーザーへの影響を最小化する。

## 2. ロードマップの骨子
| フェーズ | 期間目安 | 主要テーマ | 完了基準 |
| --- | --- | --- | --- |
| Phase A | 2025/10/01-10/15 | 第2問・第3問 UI刷新 PoC | 模試モードのCBTレイアウト化、既存問題20%適用、Detox回帰 | 
| Phase B | 2025/10/16-10/31 | テンプレート全量移行 & 採点ロジック対応 | `master-questions.ts` 302問変換、`answer-service`互換テスト完了 | 
| Phase C | 2025/11/01-11/15 | メモ/手書き機能 + 視覚的進捗 | 手書きパッドβ、ラーニングチャートβ、NPSアンケ50件収集 | 
| Phase D | 2025/11/16-12/15 | AI推薦 & 継続率施策 | 出題レコメンド導入、7日継続率+10%、A/Bテスト完了 |

## 3. ワークストリーム詳細
### 3.1 Experience & UI
- `docs/engineering/wireframes/2025-09-30-ledger-trial-wireframes.md` を基準にCBTデザインをFigmaへ再現し、デザイナー/教育監修者でレビュー。
- 共通ヘッダー・タイマー・メモタブを `app/(tabs)/mock-exam` 系レイアウトへ導入。レスポンシブ（390×844 / 1024×768）で検証。
- 段階ガイド (`guidance`) を UI にバインドし、学習履歴に応じて初期開閉状態を保存。

### 3.2 Data & Templates
- `docs/engineering/ledger-trial-template-spec-2025-09.md` に従いテンプレート変換スクリプトを追加 (`scripts/data/update-question-structure.ts` にマイグレーション関数を実装)。
- `allowed_accounts` が空の問題は手動レビュー隊列へ送る（`docs/dev-logs/template-backlog.md` を新設しトラッキング）。
- 8桁精算表は `layout_variant: trial_v2` として UI 側列幅を固定。既存回答履歴は JSON マイグレーションテーブルで互換性維持。

### 3.3 Platform & Performance
- Expo SDK 52 → 最新 LTS へのアップグレード検討 (Phase B)。Hermes 有効化を条件に起動時間計測。
- Detox 並列実行最適化（iOS/Android 各1台 → iOS 2台並列）。CI パイプラインは Phase A 終了までに所要時間30%削減を目標。
- エラーログ集約を Sentry Releases と紐付け、CBT フォーム周りの例外率を監視。

### 3.4 Testing & Quality
- Jest: 第2問/第3問のテンプレート別スナップショットを追加 (`__tests__/components/ledger-form.spec.tsx` 等)。
- Detox: 模試フローでの差分検知を `detox-expect` 拡張で可視化。異なる layout_variant をカバーするテストケースを追加。
- 手書き機能導入前に端末別入力遅延を計測し、閾値（150ms以下）を目標に最適化。

## 4. ガバナンスとプロセス
- **Weekly Sync**: PM/リードエンジニア/教育監修/QA で毎週 30 分。進捗、リスク、データ指標を共有。
- **Design Critique**: Figma プロトタイプ完成時にデザインレビュー。教育監修者からのCBT準拠チェックを必須化。
- **Release Gate**: Feature Flag ON 条件は「模試モードE2E成功」「NPS-βヒアリング10件で不満率<20%」。
- **ドキュメント更新**: 主要実装の完了時に `development-logs` と `improvement-plan` を更新し、履歴を残す。

## 5. 指標とモニタリング
| カテゴリ | KPI | 目標値 | 計測方法 |
| --- | --- | --- | --- |
| 学習効率 | 第2問平均解答時間 | -20% (現状比) | Firebase Analytics / Custom event |
| 継続率 | 7日継続率 | +10pt | BigQuery セッション分析 |
| 品質 | CBTフォーム例外率 | <0.5% | Sentry Releases |
| UX | NPS（第2問/第3問専用） | +15pt | インアプリアンケート |

## 6. リスクと対策
- **テンプレート移行の互換性リスク**: 既存回答履歴が新テンプレに適合しない可能性 → マッピングテーブルとバックアップ (`master-questions.ts.backup-yyyymmdd`) を維持。
- **CBT準拠の法的制約**: 画面模倣が規約違反となる可能性 → 日本商工会議所の利用規約を確認し、文言/レイアウトの差別化を事前レビュー。
- **手書き機能の技術選定**: Expo互換のキャンバスライブラリ不足 → `react-native-sketch-canvas` と Expo Ink を比較検証、端末対応表を整備。
- **スケジュール遅延**: Phase AでクリティカルなUI課題が出る場合 → Phase B を1週間後ろ倒しし、テンプレ移行を2スプリントに分割。

## 7. ドキュメントリンク
- `docs/feedback/2025-09-23-beta-feedback.md`
- `docs/feedback/2025-09-30-q2-q3-redesign-plan.md`
- `docs/engineering/ledger-trial-template-spec-2025-09.md`
- `docs/engineering/wireframes/2025-09-30-ledger-trial-wireframes.md`
- `docs/development-logs/2025-09-30-q2-q3-redesign-prep.md`
