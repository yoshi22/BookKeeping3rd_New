# 問題表示順序の修正

## 修正日時

2025-08-06

## 問題

データベースには正しく最新の問題データ（Q_MD_001「10桁精算表の作成」など）が入っているが、学習画面では最後の問題（Q_MD_302）から表示されていた。

## 原因

`QuestionRepository`のSQLクエリで`ORDER BY difficulty ASC, id ASC`となっており、difficultが同じ値（すべて1）の場合、ID順でソートされていた。問題IDが文字列のため、「Q_MD_302」が「Q_MD_001」より後に来ていた。

## 解決策

`src/data/repositories/question-repository.ts`の以下の箇所を修正：

1. `findByCategory`メソッド（77行目）
   - 変更前: `ORDER BY difficulty ASC, id ASC`
   - 変更後: `ORDER BY id ASC`

2. `findByTag`メソッド（218行目）
   - 変更前: `ORDER BY difficulty ASC, id ASC`
   - 変更後: `ORDER BY id ASC`

## 確認方法

アプリを再起動して、学習画面で最初に表示される問題が「Q_MD_001: 10桁精算表の作成」になっていることを確認。

## 今後の考慮事項

- IDによるソートは文字列ソートのため、数字部分が正しくソートされるようにIDの形式を統一する必要がある
- 例: Q_MD_001, Q_MD_002, ... Q_MD_299, Q_MD_300 のように0埋めする
- または、別途display_orderカラムを追加して明示的な順序管理を行う
