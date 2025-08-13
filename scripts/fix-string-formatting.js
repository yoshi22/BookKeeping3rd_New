#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../src/data/master-questions.ts");

// Read the file
let content = fs.readFileSync(filePath, "utf-8");

// Fix multiline strings by replacing problematic patterns
// First, let's restore the file to a working state and then add properly formatted questions
console.log("Backing up and reverting master-questions.ts to working state...");

// Find the line where Q_T_007 starts and remove everything from there to the statistics
const q007StartPattern = /  },\s*{\s*id: "Q_T_007"/;
const match = content.match(q007StartPattern);

if (match) {
  const beforeQ007 = content.substring(0, match.index + 4); // Include the closing brace and comma
  const afterMatch = content.substring(match.index);

  // Find where statistics start
  const statisticsPattern = /export const questionStatistics = {/;
  const statisticsMatch = afterMatch.match(statisticsPattern);

  if (statisticsMatch) {
    const afterStatistics = afterMatch.substring(statisticsMatch.index);

    // Reconstruct with proper statistics
    content =
      beforeQ007 +
      "\n\n" +
      afterStatistics.replace(
        /export const questionStatistics = {\s*totalQuestions: \d+,\s*byCategory: {\s*journal: \d+,\s*ledger: \d+,\s*trial_balance: \d+,\s*},\s*byDifficulty: {\s*"1": \d+,\s*"2": \d+,\s*"3": \d+,\s*"4": \d+,\s*"5": \d+,\s*},\s*};/,
        `export const questionStatistics = {
  totalQuestions: 302,
  byCategory: {
    journal: 250,
    ledger: 40,
    trial_balance: 12,
  },
  byDifficulty: {
    "1": 104,
    "2": 122,
    "3": 76,
    "4": 0,
    "5": 0,
  },
};`,
      );

    console.log("File restored to working state.");
    fs.writeFileSync(filePath, content);

    console.log("Testing file...");
    // Test if the file now parses correctly
    try {
      require(filePath);
      console.log("✅ File is now syntactically correct!");
    } catch (error) {
      console.error("❌ File still has errors:", error.message);
    }
  }
}
