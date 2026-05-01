import { useEffect, useRef } from "react";
import { AppState, Platform } from "react-native";
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from "expo-tracking-transparency";
import { logger } from "@/utils/logger";

const ATT_JS_FALLBACK_DELAY_MS = 2500;

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
        // Native 側の ATT request と権限ダイアログ競合を避けるため、JS は遅延フォールバックにする。
        await new Promise<void>((r) => setTimeout(r, ATT_JS_FALLBACK_DELAY_MS));

        const current = await getTrackingPermissionsAsync();
        logger.info("ATT現在ステータス(JS fallback)", {
          status: current.status,
          granted: current.granted,
          canAskAgain: current.canAskAgain,
        });

        if (current.status !== "undetermined") {
          logger.info("ATT許可リクエストをスキップ", {
            reason: "already-determined",
            status: current.status,
            granted: current.granted,
            canAskAgain: current.canAskAgain,
            note:
              current.status === "denied"
                ? "端末設定、Apple ID、MDM、年齢制限、または既存の拒否状態によりATTが表示されない可能性があります"
                : undefined,
          });
          return;
        }

        const result = await requestTrackingPermissionsAsync();
        logger.info("ATT許可リクエスト結果", {
          status: result.status,
          granted: result.granted,
          canAskAgain: result.canAskAgain,
        });
      } catch (e) {
        logger.error("ATT許可リクエストエラー", e as Error);
      }
    })();
  }, []);

  return null;
}
