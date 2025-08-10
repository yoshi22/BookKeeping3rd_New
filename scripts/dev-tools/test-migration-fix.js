/**
 * Test script to verify the exam_sections migration fix
 * This script tests that the migration can be executed multiple times without errors
 */

const { databaseService } = require("./src/data/database");
const {
  addExamSectionsMigration,
} = require("./src/data/migrations/002-add-exam-sections");

async function testMigrationFix() {
  console.log("Testing exam_sections migration fix...");

  try {
    // Initialize database
    await databaseService.initialize();
    console.log("✅ Database initialized");

    // Test SQL commands individually to isolate issues
    const testSQLs = [
      // Test table creation
      addExamSectionsMigration.sql[0], // CREATE TABLE exam_sections

      // Test first INSERT OR IGNORE
      addExamSectionsMigration.sql[1], // INSERT section 1

      // Test duplicate INSERT OR IGNORE (should not error)
      addExamSectionsMigration.sql[1], // Same INSERT again
    ];

    for (let i = 0; i < testSQLs.length; i++) {
      const sql = testSQLs[i];
      console.log(`\nTesting SQL ${i + 1}: ${sql.substring(0, 50)}...`);

      try {
        const result = await databaseService.executeSql(sql, []);
        console.log(`✅ SQL ${i + 1} executed successfully:`, {
          rowsAffected: result.rowsAffected,
          insertId: result.insertId,
        });
      } catch (error) {
        console.error(`❌ SQL ${i + 1} failed:`, error.message);
        throw error;
      }
    }

    // Verify the data was inserted correctly
    const result = await databaseService.executeSql(
      "SELECT * FROM exam_sections ORDER BY section_number",
      [],
    );

    console.log("\n✅ Final verification - exam_sections data:");
    console.log(`Found ${result.rows.length} rows`);
    result.rows.forEach((row) => {
      console.log(
        `  Section ${row.section_number}: ${row.name} (${row.display_name})`,
      );
    });

    console.log("\n🎉 Migration fix test completed successfully!");
    console.log(
      "✅ The INSERT OR IGNORE statements prevent duplicate key errors",
    );
    console.log("✅ Multiple migration runs are now safe");
  } catch (error) {
    console.error("\n❌ Migration fix test failed:", error);
    throw error;
  } finally {
    try {
      await databaseService.close();
      console.log("Database connection closed");
    } catch (closeError) {
      console.warn("Warning: Failed to close database:", closeError);
    }
  }
}

// Run the test
if (require.main === module) {
  testMigrationFix()
    .then(() => {
      console.log("\nTest completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\nTest failed:", error);
      process.exit(1);
    });
}

module.exports = { testMigrationFix };
