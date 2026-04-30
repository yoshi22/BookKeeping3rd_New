import { useEffect, useRef } from "react";
import { AppState, Platform } from "react-native";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { logger } from "@/utils/logger";

// AppState が "active" になるまで待つ。
// iPadOS 26 の Stage Manager / SceneDelegate ライフサイクルでは起動直後に
// scene が inactive を経るため、active を確認してから ATT を呼ぶ必要がある。
const waitForActive = (): Promise<void> =>
  new Promise((resolve) => {
    if (AppState.currentState === "active") {
      resolve();
      return;
    }
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        sub.remove();
        resolve();
      }
    });
  });

export function AttBootstrapper(): null {
  const hasRequested = useRef(false);

  useEffect(() => {
    if (Platform.OS !== "ios" || hasRequested.current) return;
    hasRequested.current = true;

    (async () => {
      try {
        await waitForActive();
        // SceneDelegate の activation 完了を待つ追加猶予
        await new Promise<void>((r) => setTimeout(r, 300));
        const result = await requestTrackingPermissionsAsync();
        logger.info("ATT許可リクエスト結果", { status: result.status });
      } catch (e) {
        logger.error("ATT許可リクエストエラー", e as Error);
      }
    })();
  }, []);

  return null;
}
