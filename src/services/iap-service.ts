import { Platform, NativeModules } from "react-native";
import { setup } from "react-native-iap";

export interface StorefrontDiagnostics {
  source: "storekit2" | "skpaymentqueue" | "unavailable";
  countryCode?: string;
  storefrontId?: string;
  receiptEnvironment: "sandbox" | "production" | "unknown";
  receiptFileName?: string;
  isSandboxReceipt: boolean;
}

interface StorefrontDiagnosticsModule {
  getCurrentStorefront: () => Promise<{
    source?: "storekit2" | "skpaymentqueue" | "unavailable" | null;
    countryCode?: string | null;
    storefrontId?: string | null;
    receiptEnvironment?: "sandbox" | "production" | "unknown" | null;
    receiptFileName?: string | null;
    isSandboxReceipt?: boolean | null;
  }>;
}

let isIapConfigured = false;

export function configureIap(): void {
  if (isIapConfigured || Platform.OS !== "ios") {
    return;
  }

  setup({ storekitMode: "STOREKIT2_MODE" });
  isIapConfigured = true;
}

export async function getStorefrontDiagnostics(): Promise<StorefrontDiagnostics | null> {
  if (Platform.OS !== "ios") {
    return null;
  }

  const module = NativeModules
    .StorefrontDiagnostics as StorefrontDiagnosticsModule | undefined;

  if (!module?.getCurrentStorefront) {
    return null;
  }

  const result = await module.getCurrentStorefront();

  return {
    source: result.source ?? "unavailable",
    countryCode: result.countryCode ?? undefined,
    storefrontId: result.storefrontId ?? undefined,
    receiptEnvironment: result.receiptEnvironment ?? "unknown",
    receiptFileName: result.receiptFileName ?? undefined,
    isSandboxReceipt: result.isSandboxReceipt === true,
  };
}

export function shouldShowStorefrontDiagnostics(
  diagnostics: StorefrontDiagnostics | null,
): boolean {
  return __DEV__ || diagnostics?.isSandboxReceipt === true;
}
