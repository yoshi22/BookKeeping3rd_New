/**
 * 勘定科目オプション定義
 * 簿記3級問題集アプリ - 勘定科目選択肢統一管理
 */

import { AccountOption } from "./FormTypes";

/**
 * 標準勘定科目オプション
 */
export const STANDARD_ACCOUNT_OPTIONS: AccountOption[] = [
  { label: "勘定科目を選択", value: "" },

  // 資産勘定
  { label: "現金", value: "現金" },
  { label: "現金過不足", value: "現金過不足" },
  { label: "当座預金", value: "当座預金" },
  { label: "当座借越", value: "当座借越" },
  { label: "普通預金", value: "普通預金" },
  { label: "小口現金", value: "小口現金" },
  { label: "売掛金", value: "売掛金" },
  { label: "受取手形", value: "受取手形" },
  { label: "商品", value: "商品" },
  { label: "繰越商品", value: "繰越商品" },
  { label: "貸倒引当金", value: "貸倒引当金" },
  { label: "建物", value: "建物" },
  { label: "建物減価償却累計額", value: "建物減価償却累計額" },
  { label: "車両運搬具", value: "車両運搬具" },
  { label: "車両運搬具減価償却累計額", value: "車両運搬具減価償却累計額" },
  { label: "備品", value: "備品" },
  { label: "備品減価償却累計額", value: "備品減価償却累計額" },
  { label: "土地", value: "土地" },
  { label: "特許権", value: "特許権" },
  { label: "のれん", value: "のれん" },
  { label: "前払費用", value: "前払費用" },
  { label: "前払金", value: "前払金" },
  { label: "立替金", value: "立替金" },
  { label: "仮払金", value: "仮払金" },
  { label: "貸付金", value: "貸付金" },
  { label: "有価証券", value: "有価証券" },
  { label: "保険積立金", value: "保険積立金" },

  // 負債勘定
  { label: "買掛金", value: "買掛金" },
  { label: "支払手形", value: "支払手形" },
  { label: "借入金", value: "借入金" },
  { label: "未払金", value: "未払金" },
  { label: "未払費用", value: "未払費用" },
  { label: "前受金", value: "前受金" },
  { label: "預り金", value: "預り金" },
  { label: "仮受金", value: "仮受金" },
  { label: "退職給付引当金", value: "退職給付引当金" },

  // 純資産勘定
  { label: "資本金", value: "資本金" },
  { label: "繰越利益剰余金", value: "繰越利益剰余金" },
  { label: "資本準備金", value: "資本準備金" },

  // 収益勘定
  { label: "売上", value: "売上" },
  { label: "受取利息", value: "受取利息" },
  { label: "受取配当金", value: "受取配当金" },
  { label: "受取手数料", value: "受取手数料" },
  { label: "有価証券売却益", value: "有価証券売却益" },
  { label: "雑収入", value: "雑収入" },

  // 費用勘定
  { label: "仕入", value: "仕入" },
  { label: "給料", value: "給料" },
  { label: "法定福利費", value: "法定福利費" },
  { label: "旅費交通費", value: "旅費交通費" },
  { label: "水道光熱費", value: "水道光熱費" },
  { label: "通信費", value: "通信費" },
  { label: "消耗品費", value: "消耗品費" },
  { label: "減価償却費", value: "減価償却費" },
  { label: "貸倒損失", value: "貸倒損失" },
  { label: "支払利息", value: "支払利息" },
  { label: "支払手数料", value: "支払手数料" },
  { label: "有価証券売却損", value: "有価証券売却損" },
  { label: "雑損失", value: "雑損失" },
  { label: "租税公課", value: "租税公課" },
  { label: "保険料", value: "保険料" },
  { label: "広告宣伝費", value: "広告宣伝費" },
  { label: "修繕費", value: "修繕費" },
  { label: "外注費", value: "外注費" },
];

/**
 * カテゴリ別勘定科目フィルター
 */
export const getAccountsByCategory = (
  category: "asset" | "liability" | "equity" | "revenue" | "expense",
): AccountOption[] => {
  const assetAccounts = STANDARD_ACCOUNT_OPTIONS.filter((option) =>
    [
      "現金",
      "現金過不足",
      "当座預金",
      "当座借越",
      "普通預金",
      "小口現金",
      "売掛金",
      "受取手形",
      "商品",
      "繰越商品",
      "貸倒引当金",
      "建物",
      "建物減価償却累計額",
      "車両運搬具",
      "車両運搬具減価償却累計額",
      "備品",
      "備品減価償却累計額",
      "土地",
      "特許権",
      "のれん",
      "前払費用",
      "前払金",
      "立替金",
      "仮払金",
      "貸付金",
      "有価証券",
      "保険積立金",
    ].includes(option.value),
  );

  const liabilityAccounts = STANDARD_ACCOUNT_OPTIONS.filter((option) =>
    [
      "買掛金",
      "支払手形",
      "借入金",
      "未払金",
      "未払費用",
      "前受金",
      "預り金",
      "仮受金",
      "退職給付引当金",
    ].includes(option.value),
  );

  const equityAccounts = STANDARD_ACCOUNT_OPTIONS.filter((option) =>
    ["資本金", "繰越利益剰余金", "資本準備金"].includes(option.value),
  );

  const revenueAccounts = STANDARD_ACCOUNT_OPTIONS.filter((option) =>
    [
      "売上",
      "受取利息",
      "受取配当金",
      "受取手数料",
      "有価証券売却益",
      "雑収入",
    ].includes(option.value),
  );

  const expenseAccounts = STANDARD_ACCOUNT_OPTIONS.filter((option) =>
    [
      "仕入",
      "給料",
      "法定福利費",
      "旅費交通費",
      "水道光熱費",
      "通信費",
      "消耗品費",
      "減価償却費",
      "貸倒損失",
      "支払利息",
      "支払手数料",
      "有価証券売却損",
      "雑損失",
      "租税公課",
      "保険料",
      "広告宣伝費",
      "修繕費",
      "外注費",
    ].includes(option.value),
  );

  switch (category) {
    case "asset":
      return [STANDARD_ACCOUNT_OPTIONS[0], ...assetAccounts];
    case "liability":
      return [STANDARD_ACCOUNT_OPTIONS[0], ...liabilityAccounts];
    case "equity":
      return [STANDARD_ACCOUNT_OPTIONS[0], ...equityAccounts];
    case "revenue":
      return [STANDARD_ACCOUNT_OPTIONS[0], ...revenueAccounts];
    case "expense":
      return [STANDARD_ACCOUNT_OPTIONS[0], ...expenseAccounts];
    default:
      return STANDARD_ACCOUNT_OPTIONS;
  }
};

/**
 * 勘定科目の性質を取得
 */
export const getAccountType = (
  account: string,
): "asset" | "liability" | "equity" | "revenue" | "expense" | "unknown" => {
  const assetAccounts = [
    "現金",
    "現金過不足",
    "当座預金",
    "当座借越",
    "普通預金",
    "小口現金",
    "売掛金",
    "受取手形",
    "商品",
    "繰越商品",
    "貸倒引当金",
    "建物",
    "建物減価償却累計額",
    "車両運搬具",
    "車両運搬具減価償却累計額",
    "備品",
    "備品減価償却累計額",
    "土地",
    "特許権",
    "のれん",
    "前払費用",
    "前払金",
    "立替金",
    "仮払金",
    "貸付金",
    "有価証券",
    "保険積立金",
  ];

  const liabilityAccounts = [
    "買掛金",
    "支払手形",
    "借入金",
    "未払金",
    "未払費用",
    "前受金",
    "預り金",
    "仮受金",
    "退職給付引当金",
  ];

  const equityAccounts = ["資本金", "繰越利益剰余金", "資本準備金"];

  const revenueAccounts = [
    "売上",
    "受取利息",
    "受取配当金",
    "受取手数料",
    "有価証券売却益",
    "雑収入",
  ];

  const expenseAccounts = [
    "仕入",
    "給料",
    "法定福利費",
    "旅費交通費",
    "水道光熱費",
    "通信費",
    "消耗品費",
    "減価償却費",
    "貸倒損失",
    "支払利息",
    "支払手数料",
    "有価証券売却損",
    "雑損失",
    "租税公課",
    "保険料",
    "広告宣伝費",
    "修繕費",
    "外注費",
  ];

  if (assetAccounts.includes(account)) return "asset";
  if (liabilityAccounts.includes(account)) return "liability";
  if (equityAccounts.includes(account)) return "equity";
  if (revenueAccounts.includes(account)) return "revenue";
  if (expenseAccounts.includes(account)) return "expense";
  return "unknown";
};
