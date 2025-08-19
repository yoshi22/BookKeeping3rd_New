#!/bin/bash

# 完了通知音を再生するhook
# macOSのsayコマンドとafplayを使用

# 処理完了を音声で通知
say "処理が完了しました" &

# システム通知音を再生
afplay /System/Library/Sounds/Glass.aiff &

# 完了時刻をログ出力
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Phase B 作業完了通知"

exit 0