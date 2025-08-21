#!/bin/bash

# Claude Code タスク完了時通知音Hook
# Stop イベント時にシステム音を再生

# ログ出力用のタイムスタンプ
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$TIMESTAMP] 🔊 Claude Code タスク完了 - 通知音を再生"

# macOSシステム音の再生
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOSの場合、システム音を再生
    afplay /System/Library/Sounds/Glass.aiff 2>/dev/null &
    
    # 音声通知（オプション・バックグラウンド実行）
    say "タスクが完了しました" &
    
    echo "[$TIMESTAMP] ✅ macOS通知音再生完了"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux の場合
    if command -v paplay >/dev/null 2>&1; then
        paplay /usr/share/sounds/alsa/Front_Right.wav 2>/dev/null &
    elif command -v aplay >/dev/null 2>&1; then
        aplay /usr/share/sounds/alsa/Front_Right.wav 2>/dev/null &
    else
        echo "[$TIMESTAMP] ⚠️ Linux音声再生コマンドが見つかりません"
    fi
else
    echo "[$TIMESTAMP] ⚠️ 対応していないOS: $OSTYPE"
fi

exit 0