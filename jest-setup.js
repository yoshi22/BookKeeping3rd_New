// Jest setup file for React Native + Expo
// React Native関連のモック設定

// React Nativeのグローバル変数を設定
global.__DEV__ = true;

// React Native modules のシンプルなモック
jest.mock("react-native", () => ({
  Platform: {
    OS: "ios",
    select: jest.fn((obj) => obj.ios),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 667 })),
  },
  Alert: {
    alert: jest.fn(),
  },
  NativeModules: {},
  NativeEventEmitter: jest.fn(),
}));

// Expo SQLite のモック
jest.mock("expo-sqlite", () => ({
  openDatabase: jest.fn(() => ({
    transaction: jest.fn((callback) => {
      const mockTx = {
        executeSql: jest.fn((sql, params, success, error) => {
          if (success) {
            success(mockTx, {
              rows: { length: 0, item: () => ({}) },
              rowsAffected: 0,
            });
          }
        }),
      };
      callback(mockTx);
    }),
    close: jest.fn((success) => success && success()),
  })),
}));

// Console のモック（テスト時のログ制御）
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
