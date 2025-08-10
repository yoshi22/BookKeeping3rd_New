const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create database connection
const dbPath = path.join(__dirname, "bookkeeping.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
    process.exit(1);
  }
  console.log("Connected to SQLite database");
});

// Query Q_J_001 data
db.get("SELECT * FROM questions WHERE id = 'Q_J_001'", [], (err, row) => {
  if (err) {
    console.error("Query error:", err.message);
  } else if (row) {
    console.log("Q_J_001 data from database:");
    console.log("ID:", row.id);
    console.log("correct_answer_json:", row.correct_answer_json);

    try {
      const correctAnswer = JSON.parse(row.correct_answer_json);
      console.log(
        "Parsed correct answer:",
        JSON.stringify(correctAnswer, null, 2),
      );
    } catch (parseError) {
      console.error("JSON parse error:", parseError.message);
    }
  } else {
    console.log("Q_J_001 not found in database");
  }

  db.close();
});
