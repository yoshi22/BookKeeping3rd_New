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
    project: "./tsconfig.json",
  },
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "no-console": "warn",
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
