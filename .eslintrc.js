module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: ["expo"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "no-console": "warn",
    "import/no-unresolved": "off", // TypeScriptパスマッピングの問題を回避
    "@typescript-eslint/no-empty-object-type": "off", // この規則は存在しないため無効化
    "@typescript-eslint/no-wrapper-object-types": "off", // この規則は存在しないため無効化
  },
  overrides: [
    {
      files: ["e2e/**/*.ts"],
      rules: {
        "no-console": "off", // E2Eテストではconsoleログを許可
      },
    },
    {
      files: ["scripts/**/*.js"],
      rules: {
        "no-console": "off", // スクリプトファイルではconsoleログを許可
      },
    },
  ],
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "build/",
    ".expo/",
    "**/*.d.ts",
    "backup/",
    "extract-accounts.js",
  ],
};
