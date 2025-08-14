#!/usr/bin/env bash
set -euo pipefail

# ログファイル
LOG_FILE=".logs/chatgpt/ime-switch.log"
mkdir -p "$(dirname "$LOG_FILE")"

# ログ関数
log_msg() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') $1" >> "$LOG_FILE"
}

log_msg "IME切替開始"

# ChatGPT を前面化（任意。失敗しても続行）
osascript -e 'tell application "ChatGPT" to activate' >/dev/null 2>&1 || true

# im-select の場所を自動検出
IMSEL=""
for p in /opt/homebrew/bin/im-select /usr/local/bin/im-select; do
  if [ -x "$p" ]; then IMSEL="$p"; break; fi
done

if [ -z "$IMSEL" ]; then
  log_msg "ERROR: im-select が見つかりません"
  echo "im-select が見つかりません。brew install im-select を実行してください。" >&2
  exit 1
fi

# 現在のIME状態をログ
CURRENT_IME=$("$IMSEL")
log_msg "切替前IME: $CURRENT_IME"

# 英数(ABC)へ切替。失敗したら US を試す
if "$IMSEL" com.apple.keylayout.ABC >/dev/null 2>&1; then
    log_msg "ABC切替成功"
elif "$IMSEL" com.apple.keylayout.US >/dev/null 2>&1; then
    log_msg "US切替成功"
else
    log_msg "ERROR: IME切替失敗"
    exit 1
fi

# 切替後の状態確認
NEW_IME=$("$IMSEL")
log_msg "切替後IME: $NEW_IME"

# 短い待機
sleep 0.1

log_msg "IME切替完了"