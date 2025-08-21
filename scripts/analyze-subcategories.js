#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Read master-questions.ts file
const filePath = path.join(__dirname, "../src/data/master-questions.ts");
const content = fs.readFileSync(filePath, "utf8");

// Extract all subcategories and count them
const subcategoryMatches = content.match(/"subcategory":"([^"]+)"/g) || [];
const subcategoryCounts = {};

subcategoryMatches.forEach((match) => {
  const subcategory = match.match(/"subcategory":"([^"]+)"/)[1];
  subcategoryCounts[subcategory] = (subcategoryCounts[subcategory] || 0) + 1;
});

// Define the subcategoryToType mapping from the app
const subcategoryToType = {
  // 現金・預金関連
  cash_deposit: "cash_deposit",

  // 商品売買関連
  sales_purchase: "sales_purchase",
  merchandise: "sales_purchase",
  shipping_special: "sales_purchase",

  // 債権・債務関連
  receivable_payable: "receivable_payable",
  bill_of_exchange: "receivable_payable",
  lending_borrowing: "receivable_payable",

  // 給与・税金関連
  salary_tax: "salary_tax",
  salary_payment: "salary_tax",
  salary_withholding: "salary_tax",
  payroll: "salary_tax",
  social_insurance: "salary_tax",
  source_tax: "salary_tax",
  corporate_tax: "salary_tax",

  // 固定資産関連
  fixed_asset: "fixed_asset",
  fixed_asset_disposal: "fixed_asset",

  // 決算整理関連
  adjustment: "adjustment",
};

// Group counts by question type
const typeCounts = {};
Object.entries(subcategoryCounts).forEach(([subcategory, count]) => {
  const type = subcategoryToType[subcategory] || "other";
  typeCounts[type] = (typeCounts[type] || 0) + count;
});

console.log("\n=== Subcategory Analysis ===");
console.log("\nSubcategory counts:");
Object.entries(subcategoryCounts)
  .sort()
  .forEach(([subcat, count]) => {
    console.log(`  ${subcat}: ${count}`);
  });

console.log("\nQuestion type counts (after mapping):");
Object.entries(typeCounts)
  .sort()
  .forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });

console.log("\n=== problemsStrategy.md Expected vs Actual ===");
const expected = {
  cash_deposit: 42,
  sales_purchase: 45,
  receivable_payable: 41,
  salary_tax: 42,
  fixed_asset: 40,
  adjustment: 40,
};

Object.entries(expected).forEach(([type, expectedCount]) => {
  const actualCount = typeCounts[type] || 0;
  const status = actualCount === expectedCount ? "✅" : "❌";
  console.log(`  ${type}: ${actualCount}/${expectedCount} ${status}`);
});

console.log(
  `\nTotal: ${Object.values(typeCounts).reduce((a, b) => a + b, 0)} questions`,
);
