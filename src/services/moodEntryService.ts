import { db } from '../utils/database';
import { MoodEntry, EntryFilters } from '../types';
import crypto from 'crypto';

class MoodEntryService {
  private generateId(): string {
    return crypto.randomUUID();
  }

  async createEntry(entry: Omit<MoodEntry, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>): Promise<MoodEntry> {
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const insertStmt = db.prepare(`
      INSERT INTO mood_entries (
        id, user_id, mood_type, mood_intensity, tags, content, 
        voice_note_path, images, triggers, body_state, environment, 
        location, weather, duration, created_at, updated_at, template_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      id,
      entry.userId,
      entry.moodType,
      entry.moodIntensity,
      JSON.stringify(entry.tags),
      entry.content || null,
      entry.voiceNotePath || null,
      entry.images ? JSON.stringify(entry.images) : null,
      entry.triggers ? JSON.stringify(entry.triggers) : null,
      entry.bodyState ? JSON.stringify(entry.bodyState) : null,
      entry.environment ? JSON.stringify(entry.environment) : null,
      entry.location || null,
      entry.weather || null,
      entry.duration || null,
      now,
      now,
      entry.templateId || null
    );

    return this.getEntry(id);
  }

  async updateEntry(id: string, entry: Partial<MoodEntry>): Promise<MoodEntry> {
    const updateStmt = db.prepare(`
      UPDATE mood_entries SET 
        mood_type = ?, mood_intensity = ?, tags = ?, content = ?, 
        voice_note_path = ?, images = ?, triggers = ?, body_state = ?, 
        environment = ?, location = ?, weather = ?, duration = ?, 
        updated_at = ?, template_id = ?
      WHERE id = ?
    `);

    updateStmt.run(
      entry.moodType || null,
      entry.moodIntensity || null,
      entry.tags ? JSON.stringify(entry.tags) : null,
      entry.content || null,
      entry.voiceNotePath || null,
      entry.images ? JSON.stringify(entry.images) : null,
      entry.triggers ? JSON.stringify(entry.triggers) : null,
      entry.bodyState ? JSON.stringify(entry.bodyState) : null,
      entry.environment ? JSON.stringify(entry.environment) : null,
      entry.location || null,
      entry.weather || null,
      entry.duration || null,
      new Date().toISOString(),
      entry.templateId || null,
      id
    );

    return this.getEntry(id);
  }

  async deleteEntry(id: string): Promise<void> {
    const deleteStmt = db.prepare('UPDATE mood_entries SET is_deleted = true, updated_at = ? WHERE id = ?');
    deleteStmt.run(new Date().toISOString(), id);
  }

  async getEntry(id: string): Promise<MoodEntry> {
    const getStmt = db.prepare('SELECT * FROM mood_entries WHERE id = ? AND is_deleted = false');
    const row = getStmt.get(id) as any;

    if (!row) {
      throw new Error('Entry not found');
    }

    return this.mapRowToEntry(row);
  }

  async getEntries(filters: EntryFilters = {}): Promise<MoodEntry[]> {
    let query = 'SELECT * FROM mood_entries WHERE is_deleted = false';
    const params: any[] = [];

    if (filters.startDate) {
      query += ' AND created_at >= ?';
      params.push(filters.startDate.toISOString());
    }

    if (filters.endDate) {
      query += ' AND created_at <= ?';
      params.push(filters.endDate.toISOString());
    }

    if (filters.moodTypes && filters.moodTypes.length > 0) {
      query += ' AND mood_type IN (' + filters.moodTypes.map(() => '?').join(',') + ')';
      params.push(...filters.moodTypes);
    }

    if (filters.minIntensity) {
      query += ' AND mood_intensity >= ?';
      params.push(filters.minIntensity);
    }

    if (filters.maxIntensity) {
      query += ' AND mood_intensity <= ?';
      params.push(filters.maxIntensity);
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const rows = stmt.all(params) as any[];

    return rows.map(row => this.mapRowToEntry(row));
  }

  async getEntriesByDateRange(startDate: Date, endDate: Date): Promise<MoodEntry[]> {
    return this.getEntries({ startDate, endDate });
  }

  async searchEntries(query: string): Promise<MoodEntry[]> {
    const searchStmt = db.prepare(`
      SELECT * FROM mood_entries 
      WHERE is_deleted = false AND 
      (content LIKE ? OR tags LIKE ? OR triggers LIKE ?)
      ORDER BY created_at DESC
    `);

    const rows = searchStmt.all(`%${query}%`, `%${query}%`, `%${query}%`) as any[];

    return rows.map(row => this.mapRowToEntry(row));
  }

  private mapRowToEntry(row: any): MoodEntry {
    return {
      id: row.id,
      userId: row.user_id,
      moodType: row.mood_type,
      moodIntensity: row.mood_intensity,
      tags: row.tags ? JSON.parse(row.tags) : [],
      content: row.content,
      voiceNotePath: row.voice_note_path,
      images: row.images ? JSON.parse(row.images) : [],
      triggers: row.triggers ? JSON.parse(row.triggers) : [],
      bodyState: row.body_state ? JSON.parse(row.body_state) : undefined,
      environment: row.environment ? JSON.parse(row.environment) : undefined,
      location: row.location,
      weather: row.weather,
      duration: row.duration,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      templateId: row.template_id,
      isDeleted: row.is_deleted
    };
  }
}

export const moodEntryService = new MoodEntryService();