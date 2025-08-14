#!/usr/bin/env node

/**
 * プロジェクト概要スキャナー
 * プロジェクト立ち上げ時の構造把握用
 */

const fs = require("fs");
const path = require("path");

class ProjectScanner {
  constructor() {
    this.projectRoot = process.cwd();
    this.output = [];
  }

  log(message, indent = 0) {
    this.output.push("  ".repeat(indent) + message);
  }

  async scan() {
    console.log("📱 簿記3級問題集 - プロジェクトスキャン");
    console.log("=".repeat(40));

    // 基本情報
    await this.scanBasicInfo();

    // プロジェクト構造
    await this.scanStructure();

    // 開発状況
    await this.scanDevStatus();

    // 出力
    console.log(this.output.join("\n"));
  }

  async scanBasicInfo() {
    this.log("🏗️  基本情報");

    // package.json
    const pkg = this.readJSON("package.json");
    if (pkg) {
      this.log(`名前: ${pkg.name}`, 1);
      this.log(`バージョン: ${pkg.version}`, 1);
      this.log(`説明: ${pkg.description || "なし"}`, 1);
    }

    // app.json
    const appJson = this.readJSON("app.json");
    if (appJson?.expo) {
      this.log(`Bundle ID: ${appJson.expo.ios?.bundleIdentifier || "なし"}`, 1);
      this.log(
        `プラットフォーム: ${appJson.expo.platforms?.join(", ") || "なし"}`,
        1,
      );
    }

    this.log("");
  }

  async scanStructure() {
    this.log("📁 主要構造");

    const keyDirs = [
      { path: "app", desc: "Expo Router画面" },
      { path: "src/components", desc: "UIコンポーネント" },
      { path: "src/services", desc: "ビジネスロジック" },
      { path: "src/data", desc: "データアクセス層" },
      { path: "__tests__", desc: "テスト" },
      { path: "e2e", desc: "E2Eテスト" },
    ];

    keyDirs.forEach(({ path: dirPath, desc }) => {
      const fullPath = path.join(this.projectRoot, dirPath);
      if (fs.existsSync(fullPath)) {
        const count = this.countFiles(fullPath);
        this.log(`${desc}: ${count}ファイル`, 1);
      }
    });

    this.log("");
  }

  async scanDevStatus() {
    this.log("⚡ 開発状況");

    // Git状態
    try {
      const { execSync } = require("child_process");
      const branch = execSync("git branch --show-current", {
        encoding: "utf8",
      }).trim();
      const status = execSync("git status --porcelain", {
        encoding: "utf8",
      }).trim();

      this.log(`ブランチ: ${branch}`, 1);
      this.log(`変更ファイル: ${status ? status.split("\n").length : 0}件`, 1);
    } catch (e) {
      this.log("Git情報取得エラー", 1);
    }

    // テスト状況
    const testDirs = ["__tests__", "e2e"];
    const testCount = testDirs.reduce((sum, dir) => {
      const fullPath = path.join(this.projectRoot, dir);
      return (
        sum +
        (fs.existsSync(fullPath) ? this.countFiles(fullPath, ".test.") : 0)
      );
    }, 0);
    this.log(`テストファイル: ${testCount}件`, 1);

    // データベース関連
    const dbFiles = this.countFiles(path.join(this.projectRoot, "src/data"));
    this.log(`データ層ファイル: ${dbFiles}件`, 1);

    this.log("");
  }

  readJSON(filePath) {
    try {
      const fullPath = path.join(this.projectRoot, filePath);
      return JSON.parse(fs.readFileSync(fullPath, "utf8"));
    } catch (e) {
      return null;
    }
  }

  countFiles(dirPath, filter = "") {
    if (!fs.existsSync(dirPath)) return 0;

    try {
      return fs
        .readdirSync(dirPath, { withFileTypes: true })
        .filter((dirent) => dirent.isFile() && dirent.name.includes(filter))
        .length;
    } catch (e) {
      return 0;
    }
  }
}

// 実行
if (require.main === module) {
  const scanner = new ProjectScanner();
  scanner.scan().catch(console.error);
}

module.exports = ProjectScanner;
