import Database from 'better-sqlite3';
import path from 'path';

let dbPath: string;

if (typeof window === 'undefined') {
  const { fileURLToPath } = require('url');
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  dbPath = path.join(__dirname, '../../mood_daily.db');
} else {
  dbPath = ':memory:';
}

class DatabaseManager {
  private db: Database.Database;

  constructor() {
    this.db = new Database(dbPath);
    this.initTables();
  }

  private initTables() {
    // 创建情绪记录表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS mood_entries (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        mood_type TEXT NOT NULL,
        mood_intensity INTEGER NOT NULL,
        tags TEXT,
        content TEXT,
        voice_note_path TEXT,
        images TEXT,
        triggers TEXT,
        body_state TEXT,
        environment TEXT,
        location TEXT,
        weather TEXT,
        duration INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        template_id TEXT,
        is_deleted BOOLEAN DEFAULT FALSE
      );
    `);

    // 创建用户设置表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_settings (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        theme TEXT DEFAULT 'light',
        language TEXT DEFAULT 'zh-CN',
        reminder_times TEXT,
        reminder_enabled BOOLEAN DEFAULT TRUE,
        privacy_level TEXT DEFAULT 'high',
        sync_enabled BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 创建模板表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        fields TEXT NOT NULL,
        is_default BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 创建提醒记录表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS reminders (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        reminder_time TEXT NOT NULL,
        message TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 创建习惯统计表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS habit_stats (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        stat_date DATE NOT NULL,
        entries_count INTEGER DEFAULT 0,
        streak_days INTEGER DEFAULT 0,
        completion_rate REAL DEFAULT 0.0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, stat_date)
      );
    `);
  }

  getDB(): Database.Database {
    return this.db;
  }

  close() {
    this.db.close();
  }
}

export const dbManager = new DatabaseManager();
export const db = dbManager.getDB();