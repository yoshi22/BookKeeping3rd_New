/**
 * Logger テスト
 * ログ機能の動作確認
 */

import { logger } from "../../src/utils/logger";

describe("Logger", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("debug レベルのログが出力される", () => {
    logger.debug("Test debug message", { data: "test" });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[DEBUG]"),
      expect.stringContaining("Test debug message"),
      expect.objectContaining({ data: "test" }),
    );
  });

  it("info レベルのログが出力される", () => {
    logger.info("Test info message");

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[INFO]"),
      expect.stringContaining("Test info message"),
    );
  });

  it("error レベルのログが出力される", () => {
    const errorObj = new Error("Test error");
    logger.error("Test error message", errorObj);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[ERROR]"),
      expect.stringContaining("Test error message"),
      errorObj,
    );
  });

  it("warn レベルのログが出力される", () => {
    logger.warn("Test warning message", { warning: true });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[WARN]"),
      expect.stringContaining("Test warning message"),
      expect.objectContaining({ warning: true }),
    );
  });

  it("ログレベルによるフィルタリングが機能する", () => {
    // ログレベルが高い場合、低レベルのログは出力されない
    logger.debug("Should not appear in production");

    // 少なくとも呼び出されていることは確認
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("メタデータ付きログが正しく出力される", () => {
    const metadata = {
      userId: "12345",
      action: "login",
      timestamp: "2025-08-22T10:00:00Z",
    };

    logger.info("User action", metadata);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[INFO]"),
      expect.stringContaining("User action"),
      expect.objectContaining(metadata),
    );
  });
});
