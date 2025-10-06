#!/bin/bash

# Q2問題のquestion_order値を1-70連番に修正（シェルスクリプト版）

set -e

MASTER_FILE="src/data/master-questions.ts"

echo "📝 Q2問題のquestion_order値を修正中..."
echo

# バックアップ作成
BACKUP_FILE="${MASTER_FILE}.backup-$(date +%s)"
cp "$MASTER_FILE" "$BACKUP_FILE"
echo "✅ バックアップ作成: $(basename $BACKUP_FILE)"
echo

# すべてのQ2問題のIDとcurrent question_orderを抽出
echo "📊 Q2問題を抽出中..."
grep -A 3 'id: "Q2_' "$MASTER_FILE" | \
  grep -E '(id: "Q2_|question_order:)' | \
  paste - - | \
  sed 's/.*id: "\(Q2_[^"]*\)".*/\1/' | \
  sed 's/.*question_order: \([0-9]*\).*/\1/' | \
  paste - - > /tmp/q2_questions_raw.txt

# ID順にソート（B問題を先に、その後V問題）
echo "🔄 ID順にソート中..."
sort -t_ -k2,2 -k3,3n /tmp/q2_questions_raw.txt > /tmp/q2_questions_sorted.txt

# 新しいorder値を計算してマッピングファイル作成
echo "📝 順序マッピング作成中..."
awk '{print $1, $2, NR}' /tmp/q2_questions_sorted.txt > /tmp/q2_order_mapping.txt

echo
echo "📊 順序調整マッピング（最初の10問）:"
head -10 /tmp/q2_order_mapping.txt | awk '{printf "   %2d. %s: order %d → %d\n", $3, $1, $2, $3}'

echo
echo "📊 順序調整マッピング（最後の10問）:"
tail -10 /tmp/q2_order_mapping.txt | awk '{printf "   %2d. %s: order %d → %d\n", $3, $1, $2, $3}'
echo

# 各問題のquestion_orderを置換
echo "🔧 question_order値を更新中..."
CHANGED_COUNT=0

while read ID OLD_ORDER NEW_ORDER; do
  if [ "$OLD_ORDER" != "$NEW_ORDER" ]; then
    # sedで該当問題のquestion_order値を置換
    # macOS版sedは -i.bak 形式が必須
    sed -i.bak "/id: \"$ID\"/,/question_order:/ s/question_order: $OLD_ORDER,/question_order: $NEW_ORDER,/" "$MASTER_FILE"
    CHANGED_COUNT=$((CHANGED_COUNT + 1))
  fi
done < /tmp/q2_order_mapping.txt

# 一時的なバックアップファイルを削除
rm -f "${MASTER_FILE}.bak"

echo "✅ question_order値の更新完了"
TOTAL_QUESTIONS=$(wc -l < /tmp/q2_order_mapping.txt | tr -d ' ')
echo "   - 変更された問題数: ${CHANGED_COUNT}/${TOTAL_QUESTIONS}問"
echo "   - 新しいorder範囲: 1 〜 ${TOTAL_QUESTIONS}"
echo

# 検証
echo "🔍 更新結果を検証中..."
VERIFICATION_ERRORS=0

while read ID OLD_ORDER NEW_ORDER; do
  # 該当問題のquestion_order値を確認
  ACTUAL_ORDER=$(grep -A 3 "id: \"$ID\"" "$MASTER_FILE" | grep "question_order:" | sed 's/.*question_order: \([0-9]*\).*/\1/')

  if [ "$ACTUAL_ORDER" != "$NEW_ORDER" ]; then
    echo "⚠️  $ID: 期待値 $NEW_ORDER, 実際 $ACTUAL_ORDER"
    VERIFICATION_ERRORS=$((VERIFICATION_ERRORS + 1))
  fi
done < /tmp/q2_order_mapping.txt

if [ $VERIFICATION_ERRORS -eq 0 ]; then
  echo "✅ 検証完了: すべての問題のorder値が正しく更新されました"
else
  echo "❌ 検証エラー: ${VERIFICATION_ERRORS}個の問題に不整合があります"
  exit 1
fi

echo
echo "📊 Phase 3完了: question_order値の1-70連番調整が完了しました"
echo "次: Expoサーバーを再起動してアプリで動作確認してください"

# 一時ファイルクリーンアップ
rm -f /tmp/q2_questions_raw.txt /tmp/q2_questions_sorted.txt /tmp/q2_order_mapping.txt
