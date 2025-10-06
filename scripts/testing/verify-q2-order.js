const sqlite3 = require("better-sqlite3");
const path = require("path");
const os = require("os");

// Find the database file
const dbPath = path.join(
  os.homedir(),
  "Library/Developer/CoreSimulator/Devices/",
  "C3FCED38-6CF4-4AA8-BBB4-3FF3ECEAE908",
  "data/Containers/Data/Application",
);

const fs = require("fs");

function findDatabase(dir, depth = 0) {
  if (depth > 5) return null;

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile() && entry.name === "SQLite.db") {
        return path.join(dir, entry.name);
      }
      if (entry.isDirectory() && !entry.name.startsWith(".")) {
        const found = findDatabase(path.join(dir, entry.name), depth + 1);
        if (found) return found;
      }
    }
  } catch (err) {
    // Ignore permission errors
  }

  return null;
}

const dbFile = findDatabase(dbPath);
if (!dbFile) {
  console.log("Database not found");
  process.exit(1);
}

console.log("Found database:", dbFile);

const db = sqlite3(dbFile, { readonly: true });

// Query Q2 questions with order 10-14
const questions = db
  .prepare(
    `
  SELECT id, section_number, question_order, question_text
  FROM questions
  WHERE section_number = 2 AND question_order BETWEEN 10 AND 14
  ORDER BY question_order
`,
  )
  .all();

console.log("\nQ2 Questions (order 10-14):");
console.log("=".repeat(80));
questions.forEach((q) => {
  const preview = q.question_text.substring(0, 50);
  console.log(`Order ${q.question_order}: ${q.id} - ${preview}...`);
});

db.close();
