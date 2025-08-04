---
name: web-smoke
description: Expo Webでの軽量スモーク（画面遷移と主要UIのクリック）。puppeteer MCPで自動化し、重いiOS前に早期検知。
tools: Bash, Read, Edit, Grep, Glob
---

# 任務
1) `npx expo start --web` を起動し、http://localhost:8081 を対象にpuppeteerで以下を実行:
   - タイトル/ヘッダ表示の検証
   - 「学習開始」クリック、タブ「模試」「統計」への遷移検証
   - 必要に応じてスクリーンショットを .logs/web/ に保存
2) エラー時はログを要約し、fixerへ修正を委譲。
EOF < /dev/null