import { db } from '../utils/database';
import { Reminder } from '../types';
import crypto from 'crypto';

class ReminderService {
  private generateId(): string {
    return crypto.randomUUID();
  }

  async createReminder(reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reminder> {
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const insertStmt = db.prepare(`
      INSERT INTO reminders (id, user_id, reminder_time, message, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      id,
      reminder.userId,
      reminder.reminderTime,
      reminder.message,
      reminder.isActive,
      now,
      now
    );

    return this.getReminder(id);
  }

  async updateReminder(id: string, reminder: Partial<Reminder>): Promise<Reminder> {
    const updateStmt = db.prepare(`
      UPDATE reminders SET 
        reminder_time = ?, message = ?, is_active = ?, updated_at = ?
      WHERE id = ?
    `);

    updateStmt.run(
      reminder.reminderTime || null,
      reminder.message || null,
      reminder.isActive !== undefined ? reminder.isActive : null,
      new Date().toISOString(),
      id
    );

    return this.getReminder(id);
  }

  async deleteReminder(id: string): Promise<void> {
    const deleteStmt = db.prepare('DELETE FROM reminders WHERE id = ?');
    deleteStmt.run(id);
  }

  async getReminder(id: string): Promise<Reminder> {
    const getStmt = db.prepare('SELECT * FROM reminders WHERE id = ?');
    const row = getStmt.get(id) as any;

    if (!row) {
      throw new Error('Reminder not found');
    }

    return this.mapRowToReminder(row);
  }

  async getReminders(userId: string): Promise<Reminder[]> {
    const getStmt = db.prepare('SELECT * FROM reminders WHERE user_id = ? ORDER BY reminder_time');
    const rows = getStmt.all(userId) as any[];

    return rows.map(row => this.mapRowToReminder(row));
  }

  async checkDueReminders(): Promise<Reminder[]> {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const dayOfWeek = now.getDay();

    const getStmt = db.prepare(`
      SELECT * FROM reminders 
      WHERE is_active = true AND reminder_time = ?
    `);
    const rows = getStmt.all(currentTime) as any[];

    return rows.map(row => this.mapRowToReminder(row));
  }

  private mapRowToReminder(row: any): Reminder {
    return {
      id: row.id,
      userId: row.user_id,
      reminderTime: row.reminder_time,
      message: row.message,
      isActive: row.is_active,
      daysOfWeek: [], // 简化实现，暂不支持按周几提醒
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
}

export const reminderService = new ReminderService();