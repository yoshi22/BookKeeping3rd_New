#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <AppTrackingTransparency/AppTrackingTransparency.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"main";

  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  if (@available(iOS 14, *)) {
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

- (void)applicationDidBecomeActive:(UIApplication *)application
{
  if (@available(iOS 14, *)) {
    NSLog(@"[ATT] applicationDidBecomeActive called. status=%ld appState=%ld",
          (long)ATTrackingManager.trackingAuthorizationStatus,
          (long)application.applicationState);
  } else {
    NSLog(@"[ATT] applicationDidBecomeActive called. ATT unavailable before iOS 14");
  }
  [super applicationDidBecomeActive:application];
}

- (void)attSceneDidActivate:(NSNotification *)notification
{
  if (@available(iOS 14, *)) {
    NSLog(@"[ATT] UISceneDidActivateNotification received. status=%ld appState=%ld",
          (long)ATTrackingManager.trackingAuthorizationStatus,
          (long)UIApplication.sharedApplication.applicationState);
  } else {
    NSLog(@"[ATT] UISceneDidActivateNotification received. ATT unavailable before iOS 14");
  }
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
