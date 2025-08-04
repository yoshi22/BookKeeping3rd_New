#!/usr/bin/env bash
set -euo pipefail

# ChatGPT自動コピペスクリプト
# 使用方法: scripts/chatgpt-autopaste.sh "プロンプトテキスト"

if [ $# -eq 0 ]; then
    echo "使用方法: $0 \"プロンプトテキスト\"" >&2
    exit 1
fi

PROMPT="$1"

# IME を英数に切替
scripts/ensure-english.sh

# ChatGPT を前面化
osascript -e 'tell application "ChatGPT" to activate' || {
    echo "ChatGPTアプリが見つかりません。Webブラウザを試します..." >&2
    osascript -e 'tell application "Safari" to activate' || \
    osascript -e 'tell application "Google Chrome" to activate' || \
    echo "ブラウザも見つかりません" >&2
}

# 短い待機
sleep 1

# プロンプトをクリップボードにコピー
echo "$PROMPT" | pbcopy

# Cmd+V でペースト
osascript -e 'tell application "System Events" to keystroke "v" using command down'

sleep 0.5

# Enter で送信
osascript -e 'tell application "System Events" to keystroke return'

echo "プロンプトを送信しました。ChatGPTでの応答をお待ちください。"