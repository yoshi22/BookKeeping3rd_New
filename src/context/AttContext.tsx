import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AppState, Linking, Platform, type AppStateStatus } from "react-native";
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
  type PermissionResponse,
} from "expo-tracking-transparency";
import { logger } from "@/utils/logger";

const ATT_INITIAL_REQUEST_DELAY_MS = 1200;

type AttPermissionStatus =
  | "granted"
  | "denied"
  | "undetermined"
  | "restricted"
  | "unavailable";

interface AttState {
  status: AttPermissionStatus;
  granted: boolean;
  canAskAgain: boolean;
  appState: AppStateStatus;
  lastCheckedAt: string | null;
  isLoading: boolean;
  isRequesting: boolean;
  isInitialCheckComplete: boolean;
}

interface AttContextType extends AttState {
  refreshStatus: () => Promise<void>;
  requestPermission: (source?: string) => Promise<void>;
  openAppSettings: () => Promise<void>;
}

const defaultAttState: AttState = {
  status: Platform.OS === "ios" ? "undetermined" : "unavailable",
  granted: false,
  canAskAgain: false,
  appState: AppState.currentState,
  lastCheckedAt: null,
  isLoading: false,
  isRequesting: false,
  isInitialCheckComplete: Platform.OS !== "ios",
};

const AttContext = createContext<AttContextType | undefined>(undefined);

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

const normalizeAttStatus = (
  status: PermissionResponse["status"],
): AttPermissionStatus => {
  const normalized = String(status);
  if (
    normalized === "granted" ||
    normalized === "denied" ||
    normalized === "undetermined" ||
    normalized === "restricted"
  ) {
    return normalized;
  }

  return "unavailable";
};

const toAttState = (permission: PermissionResponse): Pick<
  AttState,
  "status" | "granted" | "canAskAgain" | "lastCheckedAt"
> => ({
  status: normalizeAttStatus(permission.status),
  granted: permission.granted,
  canAskAgain: permission.canAskAgain,
  lastCheckedAt: new Date().toISOString(),
});

export function AttProvider({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  const [state, setState] = useState<AttState>(defaultAttState);
  const hasAutoRequested = useRef(false);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (appState) => {
      setState((current) => ({ ...current, appState }));
    });

    return () => {
      sub.remove();
    };
  }, []);

  const refreshStatus = useCallback(async () => {
    if (Platform.OS !== "ios") {
      setState((current) => ({
        ...current,
        status: "unavailable",
        granted: false,
        canAskAgain: false,
        isInitialCheckComplete: true,
        lastCheckedAt: new Date().toISOString(),
      }));
      return;
    }

    setState((current) => ({ ...current, isLoading: true }));

    try {
      const permission = await getTrackingPermissionsAsync();
      const nextState = toAttState(permission);
      logger.info("ATT現在ステータス", {
        status: nextState.status,
        granted: nextState.granted,
        canAskAgain: nextState.canAskAgain,
        appState: AppState.currentState,
      });

      setState((current) => ({
        ...current,
        ...nextState,
        appState: AppState.currentState,
        isLoading: false,
        isInitialCheckComplete: true,
      }));
    } catch (error) {
      logger.error("ATTステータス取得エラー", error as Error);
      setState((current) => ({
        ...current,
        isLoading: false,
        isInitialCheckComplete: true,
      }));
    }
  }, []);

  const requestPermission = useCallback(
    async (source = "manual") => {
      if (Platform.OS !== "ios") {
        setState((current) => ({
          ...current,
          status: "unavailable",
          isInitialCheckComplete: true,
        }));
        return;
      }

      await waitForActive();
      setState((current) => ({
        ...current,
        appState: AppState.currentState,
        isRequesting: true,
        isLoading: true,
      }));

      try {
        const current = await getTrackingPermissionsAsync();
        logger.info("ATT要求前ステータス", {
          source,
          status: current.status,
          granted: current.granted,
          canAskAgain: current.canAskAgain,
          appState: AppState.currentState,
        });

        if (current.status !== "undetermined") {
          setState((previous) => ({
            ...previous,
            ...toAttState(current),
            appState: AppState.currentState,
            isLoading: false,
            isRequesting: false,
            isInitialCheckComplete: true,
          }));
          return;
        }

        const result = await requestTrackingPermissionsAsync();
        logger.info("ATT許可リクエスト結果", {
          source,
          status: result.status,
          granted: result.granted,
          canAskAgain: result.canAskAgain,
          appState: AppState.currentState,
        });

        setState((previous) => ({
          ...previous,
          ...toAttState(result),
          appState: AppState.currentState,
          isLoading: false,
          isRequesting: false,
          isInitialCheckComplete: true,
        }));
      } catch (error) {
        logger.error("ATT許可リクエストエラー", error as Error);
        setState((current) => ({
          ...current,
          isLoading: false,
          isRequesting: false,
          isInitialCheckComplete: true,
        }));
      }
    },
    [],
  );

  const openAppSettings = useCallback(async () => {
    await Linking.openSettings();
  }, []);

  useEffect(() => {
    if (Platform.OS !== "ios" || hasAutoRequested.current) {
      return;
    }

    hasAutoRequested.current = true;
    const timer = setTimeout(() => {
      void requestPermission("startup");
    }, ATT_INITIAL_REQUEST_DELAY_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [requestPermission]);

  const value = useMemo<AttContextType>(
    () => ({
      ...state,
      refreshStatus,
      requestPermission,
      openAppSettings,
    }),
    [openAppSettings, refreshStatus, requestPermission, state],
  );

  return <AttContext.Provider value={value}>{children}</AttContext.Provider>;
}

export function useAtt(): AttContextType {
  const context = useContext(AttContext);
  if (!context) {
    throw new Error("useAtt must be used within an AttProvider");
  }
  return context;
}
