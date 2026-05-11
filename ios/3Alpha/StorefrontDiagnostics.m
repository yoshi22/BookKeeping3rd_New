#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(StorefrontDiagnostics, NSObject)
RCT_EXTERN_METHOD(getCurrentStorefront:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
