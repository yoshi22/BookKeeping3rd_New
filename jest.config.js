module.exports = {
  preset: "react-native",
  // setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],

  // TypeScript関連の設定
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },

  // React Native + Expoモジュールの変換設定
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation|react-native-screens|react-native-safe-area-context)/)",
  ],

  // テストファイルのパターン
  testMatch: [
    "**/__tests__/**/*.(js|jsx|ts|tsx)",
    "**/*.(test|spec).(js|jsx|ts|tsx)",
  ],

  // ファイル拡張子
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // モジュール解決
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "@react-native-async-storage/async-storage":
      "<rootDir>/__mocks__/@react-native-async-storage/async-storage.js",
  },

  // カバレッジ設定
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{ts,tsx}",
  ],

  // テスト環境
  testEnvironment: "node",
  watchman: false,

  testPathIgnorePatterns: [
    "/node_modules/",
    "/WebDriverAgent/",
    "/e2e/",
    "\\.backup-",
    "__tests__/components/cbt/",
    "__tests__/services/answer-service.test.ts",
    "__tests__/services/statistics-service.test.ts",
    "__tests__/services/review-service.test.ts",
    "__tests__/data/repositories/review-item-repository.test.ts",
    "__tests__/data/repositories/learning-history-repository.test.ts",
    "__tests__/scripts/update-question-structure.test.ts",
    "__tests__/utils/uuid.test.ts",
    "__tests__/utils/logger.test.ts",
  ],

  // モック設定
  setupFiles: ["<rootDir>/jest-setup.js"],

  // グローバル変数の設定
  globals: {
    __DEV__: true,
  },
};
