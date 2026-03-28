// Browser polyfill for better-sqlite3
// This provides a mock implementation for development in browser environment

class MockDatabase {
  constructor() {
    this.data = {
      mood_entries: [],
      user_settings: [],
      templates: [],
      reminders: [],
      habit_stats: []
    };
  }

  exec(sql) {
    console.log('[Mock DB] Executing SQL:', sql);
    
    // Simple SQL parsing for CREATE TABLE
    if (sql.includes('CREATE TABLE')) {
      const tableNameMatch = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/);
      if (tableNameMatch) {
        const tableName = tableNameMatch[1];
        if (!this.data[tableName]) {
          this.data[tableName] = [];
        }
      }
    }
  }

  prepare(sql) {
    return new MockStatement(this, sql);
  }

  close() {
    console.log('[Mock DB] Database closed');
  }
}

class MockStatement {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql;
    this.params = [];
  }

  bind(params) {
    this.params = params;
    return this;
  }

  run(params) {
    const boundParams = params || this.params;
    console.log('[Mock DB] Running:', this.sql, 'with params:', boundParams);
    return { changes: 1, lastInsertRowid: Date.now() };
  }

  get(params) {
    const boundParams = params || this.params;
    console.log('[Mock DB] Getting:', this.sql, 'with params:', boundParams);
    return null;
  }

  all(params) {
    const boundParams = params || this.params;
    console.log('[Mock DB] Getting all:', this.sql, 'with params:', boundParams);
    
    // Parse table name from SQL
    const tableNameMatch = this.sql.match(/FROM (\w+)/);
    if (tableNameMatch) {
      const tableName = tableNameMatch[1];
      return this.db.data[tableName] || [];
    }
    
    return [];
  }
}

export default function Database(path) {
  console.log('[Mock DB] Creating database at:', path);
  return new MockDatabase();
}