/**
 * UUID生成機能 テスト
 * UUID生成ユーティリティの動作確認
 */

import {
  generateUUID,
  generateStrongUUID,
  uuid,
  v4,
} from "../../src/utils/uuid";

// Helper function for testing
const isValidUUID = (str: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof str === "string" && uuidRegex.test(str);
};

describe("UUID Utils", () => {
  describe("generateUUID", () => {
    it("有効なUUID v4形式が生成される", () => {
      const uuid = generateUUID();

      expect(uuid).toBeDefined();
      expect(typeof uuid).toBe("string");
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it("複数回呼び出しで異なるUUIDが生成される", () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();

      expect(uuid1).not.toBe(uuid2);
    });

    it("生成されたUUIDが適切な長さを持つ", () => {
      const uuid = generateUUID();

      expect(uuid.length).toBe(36); // 8-4-4-4-12 + 4 hyphens = 36
    });

    it("生成されたUUIDにハイフンが正しく配置される", () => {
      const uuid = generateUUID();

      expect(uuid.charAt(8)).toBe("-");
      expect(uuid.charAt(13)).toBe("-");
      expect(uuid.charAt(18)).toBe("-");
      expect(uuid.charAt(23)).toBe("-");
    });
  });

  describe("isValidUUID", () => {
    it("有効なUUID v4形式でtrueを返す", () => {
      const validUuid = "550e8400-e29b-41d4-a716-446655440000";

      expect(isValidUUID(validUuid)).toBe(true);
    });

    it("無効な形式でfalseを返す", () => {
      const invalidCases = [
        "",
        "invalid",
        "550e8400-e29b-41d4-a716", // 短すぎる
        "550e8400-e29b-41d4-a716-446655440000-extra", // 長すぎる
        "550e8400xe29bx41d4xa716x446655440000", // ハイフンなし
        "ggge8400-e29b-41d4-a716-446655440000", // 無効な文字
      ];

      invalidCases.forEach((invalidUuid) => {
        expect(isValidUUID(invalidUuid)).toBe(false);
      });
    });

    it("大文字小文字混在でも有効と判定される", () => {
      const mixedCaseUuid = "550E8400-E29B-41D4-A716-446655440000";

      expect(isValidUUID(mixedCaseUuid)).toBe(true);
    });

    it("nullやundefinedでfalseを返す", () => {
      expect(isValidUUID(null as any)).toBe(false);
      expect(isValidUUID(undefined as any)).toBe(false);
    });

    it("数値型でfalseを返す", () => {
      expect(isValidUUID(123 as any)).toBe(false);
    });

    it("オブジェクト型でfalseを返す", () => {
      expect(isValidUUID({} as any)).toBe(false);
      expect(isValidUUID([] as any)).toBe(false);
    });
  });

  describe("generateStrongUUID", () => {
    it("有効なUUID形式が生成される", () => {
      const strongUuid = generateStrongUUID();

      expect(strongUuid).toBeDefined();
      expect(typeof strongUuid).toBe("string");
      expect(strongUuid.length).toBe(36);
    });

    it("複数回呼び出しで異なるUUIDが生成される", () => {
      const uuid1 = generateStrongUUID();
      const uuid2 = generateStrongUUID();

      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe("エイリアス関数", () => {
    it("uuid関数がgenerateUUIDと同等の結果を返す", () => {
      const result = uuid();

      expect(isValidUUID(result)).toBe(true);
      expect(result.length).toBe(36);
    });

    it("v4関数がgenerateUUIDと同等の結果を返す", () => {
      const result = v4();

      expect(isValidUUID(result)).toBe(true);
      expect(result.length).toBe(36);
    });
  });

  describe("統合テスト", () => {
    it("generateUUIDの結果がisValidUUIDでtrueになる", () => {
      const uuidResult = generateUUID();

      expect(isValidUUID(uuidResult)).toBe(true);
    });

    it("大量のUUID生成でもすべて有効", () => {
      const uuids = Array.from({ length: 100 }, () => generateUUID());

      uuids.forEach((uuidResult) => {
        expect(isValidUUID(uuidResult)).toBe(true);
      });

      // すべて異なることを確認
      const uniqueUuids = new Set(uuids);
      expect(uniqueUuids.size).toBe(100);
    });

    it("すべてのUUID関数が機能する", () => {
      const results = [generateUUID(), generateStrongUUID(), uuid(), v4()];

      results.forEach((result) => {
        expect(isValidUUID(result)).toBe(true);
        expect(result.length).toBe(36);
      });
    });
  });
});
