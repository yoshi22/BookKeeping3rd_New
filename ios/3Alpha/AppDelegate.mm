#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <AppTrackingTransparency/AppTrackingTransparency.h>

static NSString *const ATTNativeRequestAttemptedDefaultsKey = @"ATTNativeRequestAttempted";
static NSInteger const ATTNativeMaxRetryCount = 3;
static BOOL ATTNativeRequestInFlight = NO;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"main";

  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  if (@available(iOS 14, *)) {
    // build 23 の診断用永続フラグが残っていると再試行を阻害するため、build 24 以降で破棄する。
    [NSUserDefaults.standardUserDefaults removeObjectForKey:ATTNativeRequestAttemptedDefaultsKey];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(attSceneDidActivate:)
                                                 name:UISceneDidActivateNotification
                                               object:nil];
  }

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@".expo/.virtual-metro-entry"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// ATT: Scene が完全に active になった後にプロンプトを表示する。
// JS 経由より信頼性が高く、iPadOS 26 の Stage Manager / SceneDelegate でも確実に動作する。
- (void)applicationDidBecomeActive:(UIApplication *)application
{
  NSLog(@"[ATT] applicationDidBecomeActive called");
  [super applicationDidBecomeActive:application];

  [self requestATTIfNeededFromSource:@"applicationDidBecomeActive"];
}

- (void)attSceneDidActivate:(NSNotification *)notification
{
  NSLog(@"[ATT] UISceneDidActivateNotification received");
  [self requestATTIfNeededFromSource:@"UISceneDidActivateNotification"];
}

- (void)requestATTIfNeededFromSource:(NSString *)source
{
  [self requestATTIfNeededFromSource:source attempt:1];
}

- (void)requestATTIfNeededFromSource:(NSString *)source attempt:(NSInteger)attempt
{
  if (@available(iOS 14, *)) {
    UIApplicationState applicationState = UIApplication.sharedApplication.applicationState;
    ATTrackingManagerAuthorizationStatus currentStatus = ATTrackingManager.trackingAuthorizationStatus;
    NSLog(@"[ATT] evaluate request. source=%@ attempt=%ld appState=%ld status=%ld",
          source,
          (long)attempt,
          (long)applicationState,
          (long)currentStatus);

    if (ATTNativeRequestInFlight) {
      NSLog(@"[ATT] native request already in flight. source=%@ attempt=%ld status=%ld",
            source,
            (long)attempt,
            (long)currentStatus);
      return;
    }

    if (currentStatus != ATTrackingManagerAuthorizationStatusNotDetermined) {
      NSLog(@"[ATT] status already determined. skip native request. source=%@ attempt=%ld status=%ld",
            source,
            (long)attempt,
            (long)currentStatus);
      return;
    }

    if (applicationState != UIApplicationStateActive) {
      NSLog(@"[ATT] application is not active. schedule retry. source=%@ attempt=%ld appState=%ld",
            source,
            (long)attempt,
            (long)applicationState);
      [self scheduleATTRequestRetryFromSource:source attempt:attempt];
      return;
    }

    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)),
                   dispatch_get_main_queue(), ^{
      UIApplicationState delayedApplicationState = UIApplication.sharedApplication.applicationState;
      ATTrackingManagerAuthorizationStatus delayedStatus = ATTrackingManager.trackingAuthorizationStatus;
      NSLog(@"[ATT] delayed evaluation before native request. source=%@ attempt=%ld appState=%ld status=%ld",
            source,
            (long)attempt,
            (long)delayedApplicationState,
            (long)delayedStatus);

      if (ATTNativeRequestInFlight) {
        NSLog(@"[ATT] native request became in flight during delay. source=%@ attempt=%ld status=%ld",
              source,
              (long)attempt,
              (long)delayedStatus);
        return;
      }

      if (delayedStatus != ATTrackingManagerAuthorizationStatusNotDetermined) {
        NSLog(@"[ATT] delayed status already determined. skip native request. source=%@ attempt=%ld status=%ld",
              source,
              (long)attempt,
              (long)delayedStatus);
        return;
      }

      if (delayedApplicationState != UIApplicationStateActive) {
        NSLog(@"[ATT] delayed application state is not active. schedule retry. source=%@ attempt=%ld appState=%ld",
              source,
              (long)attempt,
              (long)delayedApplicationState);
        [self scheduleATTRequestRetryFromSource:source attempt:attempt];
        return;
      }

      ATTNativeRequestInFlight = YES;
      [ATTrackingManager requestTrackingAuthorizationWithCompletionHandler:^(ATTrackingManagerAuthorizationStatus status) {
        dispatch_async(dispatch_get_main_queue(), ^{
          ATTNativeRequestInFlight = NO;
          NSLog(@"[ATT] native request completed. source=%@ attempt=%ld status=%ld",
                source,
                (long)attempt,
                (long)status);

          if (status == ATTrackingManagerAuthorizationStatusNotDetermined) {
            [self scheduleATTRequestRetryFromSource:source attempt:attempt];
          }
        });
      }];
    });
  } else {
    NSLog(@"[ATT] ATT is unavailable before iOS 14. source=%@", source);
  }
}

- (void)scheduleATTRequestRetryFromSource:(NSString *)source attempt:(NSInteger)attempt
{
  if (attempt >= ATTNativeMaxRetryCount) {
    NSLog(@"[ATT] native request retry limit reached. source=%@ attempt=%ld",
          source,
          (long)attempt);
    return;
  }

  NSInteger nextAttempt = attempt + 1;
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.0 * NSEC_PER_SEC)),
                 dispatch_get_main_queue(), ^{
    [self requestATTIfNeededFromSource:source attempt:nextAttempt];
  });
}

// Linking API
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [super application:application openURL:url options:options] || [RCTLinkingManager application:application openURL:url options:options];
}

// Universal Links
- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
  BOOL result = [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
  return [super application:application continueUserActivity:userActivity restorationHandler:restorationHandler] || result;
}

// Explicitly define remote notification delegates to ensure compatibility with some third-party libraries
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  return [super application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

// Explicitly define remote notification delegates to ensure compatibility with some third-party libraries
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  return [super application:application didFailToRegisterForRemoteNotificationsWithError:error];
}

// Explicitly define remote notification delegates to ensure compatibility with some third-party libraries
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  return [super application:application didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

@end
