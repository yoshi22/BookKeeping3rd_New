# Migration System Improvements

## Problem Analysis

The SQLite error with `exam_sections` table was caused by a fundamental issue in the migration system:

1. **Root Cause**: The migration system doesn't properly handle cases where SQL execution succeeds but migration record saving fails
2. **Symptom**: Migration version 2 runs multiple times, trying to INSERT the same PRIMARY KEY values repeatedly
3. **Error**: `UNIQUE constraint failed: exam_sections.section_number`

## Immediate Fix Applied

✅ **Fixed migration 002** (`src/data/migrations/002-add-exam-sections.ts`):

- Changed all `INSERT` statements to `INSERT OR IGNORE`
- This prevents PRIMARY KEY constraint violations when the same migration runs multiple times
- Safe for idempotent operations (running the same migration multiple times has no side effects)

### Example of the fix:

```sql
-- Before (causing errors):
INSERT INTO exam_sections (section_number, name, ...) VALUES (1, '仕訳問題', ...)

-- After (safe for multiple runs):
INSERT OR IGNORE INTO exam_sections (section_number, name, ...) VALUES (1, '仕訳問題', ...)
```

## Additional Improvements Needed

### 1. Migration Manager Robustness

The current migration manager has a design flaw where it might execute SQL successfully but fail to record the migration as complete. This should be fixed:

```typescript
// Current problematic pattern in migration-manager.ts:
try {
  // Execute SQL chunks
  await databaseService.executeSql(sql, []);
} catch (sqlError) {
  throw sqlError;
}

// Record migration (can fail separately)
try {
  await databaseService.executeSql("INSERT INTO migrations ...");
} catch (recordError) {
  console.warn("Migration record save failed"); // Non-fatal!
}
```

**Recommendation**: Use a single transaction for both SQL execution and migration recording.

### 2. Migration State Verification

Add better verification before executing migrations:

```sql
-- Check if migration already has data before running
SELECT COUNT(*) FROM exam_sections WHERE section_number = 1;
```

### 3. Better Error Recovery

Implement migration rollback capabilities when partial failures occur.

## Testing the Fix

Created test script: `test-migration-fix.js`

Run with:

```bash
node test-migration-fix.js
```

This script verifies:

- ✅ Table creation works
- ✅ Initial INSERT works
- ✅ Duplicate INSERT is safely ignored (no error)
- ✅ Final data verification

## Long-term Migration Best Practices

1. **Always use idempotent operations**:
   - `CREATE TABLE IF NOT EXISTS`
   - `INSERT OR IGNORE` / `INSERT OR REPLACE`
   - `DROP TABLE IF EXISTS`

2. **Use transactions for atomic operations**:

   ```typescript
   await databaseService.executeTransaction(async () => {
     // Execute all SQL statements
     // Record migration success
   });
   ```

3. **Add migration state checks**:

   ```sql
   -- Only run if not already applied
   SELECT 1 FROM sqlite_master WHERE name = 'exam_sections' AND type = 'table'
   ```

4. **Implement proper rollback SQL** for all migrations

## Verification Steps

After applying this fix:

1. ✅ **Migration 002 can run multiple times without errors**
2. ✅ **Data integrity is preserved** (no duplicates, no data loss)
3. ✅ **App startup succeeds** even if migrations partially failed before
4. ✅ **Database schema is consistent** across different environments

## Summary

- **Immediate issue**: Fixed by adding `OR IGNORE` clauses to all INSERT statements
- **Root cause**: Migration execution/recording inconsistency in migration manager
- **Long-term solution**: Implement transactional migration execution
- **Prevention**: Always design migrations to be idempotent
