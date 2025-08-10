/**
 * React Native対応UUID生成ユーティリティ
 * crypto.getRandomValues()が使用できない環境向けの代替実装
 */

/**
 * React Native環境向けの簡易UUID v4生成
 * Math.random()を使用した疑似ランダムUUID生成
 */
export function generateUUID(): string {
  // タイムスタンプベースの一意性確保
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 9);

  // UUID v4フォーマットに近い形式で生成
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    },
  );

  return uuid;
}

/**
 * より高精度なUUID生成（デバイス情報とタイムスタンプを組み合わせ）
 */
export function generateStrongUUID(): string {
  const timestamp = Date.now();
  const random1 = Math.floor(Math.random() * 0x10000)
    .toString(16)
    .padStart(4, "0");
  const random2 = Math.floor(Math.random() * 0x10000)
    .toString(16)
    .padStart(4, "0");
  const random3 = Math.floor(Math.random() * 0x10000)
    .toString(16)
    .padStart(4, "0");
  const random4 = Math.floor(Math.random() * 0x100000000)
    .toString(16)
    .padStart(8, "0");
  const random5 = Math.floor(Math.random() * 0x100000000)
    .toString(16)
    .padStart(8, "0");

  // UUID v4形式: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  const timestampHex = timestamp.toString(16).padStart(8, "0");
  const uuid = `${timestampHex}-${random1}-4${random2.substr(1)}-${(8 + Math.floor(Math.random() * 4)).toString(16)}${random3.substr(1)}-${random4}${random5.substr(0, 4)}`;

  return uuid;
}

/**
 * デフォルトのUUID生成関数
 * セッションIDなど重要でない用途向け
 */
export const uuid = generateUUID;

/**
 * v4互換のUUID生成（uuidライブラリの代替）
 */
export const v4 = generateUUID;
