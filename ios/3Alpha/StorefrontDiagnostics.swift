import Foundation
import StoreKit

@objc(StorefrontDiagnostics)
final class StorefrontDiagnostics: NSObject {
  @objc
  static func requiresMainQueueSetup() -> Bool {
    false
  }

  @objc(getCurrentStorefront:rejecter:)
  func getCurrentStorefront(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      let receiptFileName = Bundle.main.appStoreReceiptURL?.lastPathComponent
      let receiptEnvironment = Self.receiptEnvironment(from: receiptFileName)

      if #available(iOS 15.0, *) {
        if let storefront = await Storefront.current {
          resolve([
            "source": "storekit2",
            "countryCode": storefront.countryCode,
            "storefrontId": storefront.id,
            "receiptEnvironment": receiptEnvironment,
            "receiptFileName": Self.jsValue(receiptFileName),
            "isSandboxReceipt": receiptEnvironment == "sandbox",
          ])
          return
        }
      }

      let fallbackStorefront = SKPaymentQueue.default().storefront
      resolve([
        "source": fallbackStorefront == nil ? "unavailable" : "skpaymentqueue",
        "countryCode": Self.jsValue(fallbackStorefront?.countryCode),
        "storefrontId": Self.jsValue(fallbackStorefront?.identifier),
        "receiptEnvironment": receiptEnvironment,
        "receiptFileName": Self.jsValue(receiptFileName),
        "isSandboxReceipt": receiptEnvironment == "sandbox",
      ])
    }
  }

  private static func receiptEnvironment(from receiptFileName: String?) -> String {
    switch receiptFileName {
    case "sandboxReceipt":
      return "sandbox"
    case "receipt", "appStoreReceipt":
      return "production"
    default:
      return "unknown"
    }
  }

  private static func jsValue(_ value: String?) -> Any {
    value ?? NSNull()
  }
}
