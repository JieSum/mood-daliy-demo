import { db } from '../utils/database';
import { UserSettings } from '../types';
import crypto from 'crypto';

class SettingsService {
  private generateId(): string {
    return crypto.randomUUID();
  }

  async getSettings(userId: string): Promise<UserSettings> {
    const getStmt = db.prepare('SELECT * FROM user_settings WHERE user_id = ?');
    const row = getStmt.get(userId) as any;

    if (!row) {
      // 创建默认设置
      return this.createDefaultSettings(userId);
    }

    return this.mapRowToSettings(row);
  }

  async updateSettings(userId: string, settings: Partial<UserSettings>): Promise<UserSettings> {
    const updateStmt = db.prepare(`
      UPDATE user_settings SET 
        name = ?, email = ?, avatar = ?, theme = ?, language = ?, 
        notification_enabled = ?, reminder_enabled = ?, 
        auto_backup = ?, backup_frequency = ?, privacy_mode = ?, 
        updated_at = ?
      WHERE user_id = ?
    `);

    const currentSettings = await this.getSettings(userId);
    const updatedSettings = {
      ...currentSettings,
      ...settings,
      updatedAt: new Date()
    };

    updateStmt.run(
      updatedSettings.name,
      updatedSettings.email,
      updatedSettings.avatar,
      updatedSettings.theme,
      updatedSettings.language,
      updatedSettings.notificationEnabled,
      updatedSettings.reminderEnabled,
      updatedSettings.autoBackup,
      updatedSettings.backupFrequency,
      updatedSettings.privacyMode,
      updatedSettings.updatedAt.toISOString(),
      userId
    );

    return updatedSettings;
  }

  async createDefaultSettings(userId: string): Promise<UserSettings> {
    const id = this.generateId();
    const now = new Date().toISOString();
    
    const insertStmt = db.prepare(`
      INSERT INTO user_settings (
        id, user_id, name, email, avatar, theme, language, 
        notification_enabled, reminder_enabled, auto_backup, backup_frequency, privacy_mode, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      id,
      userId,
      '用户',
      '',
      '',
      'light',
      'zh-CN',
      true,
      true,
      false,
      'weekly',
      false,
      now,
      now
    );

    return {
      id,
      userId,
      name: '用户',
      email: '',
      avatar: '',
      theme: 'light',
      language: 'zh-CN',
      notificationEnabled: true,
      reminderEnabled: true,
      autoBackup: false,
      backupFrequency: 'weekly',
      privacyMode: false,
      createdAt: new Date(now),
      updatedAt: new Date(now)
    };
  }

  private mapRowToSettings(row: any): UserSettings {
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      email: row.email,
      avatar: row.avatar,
      theme: row.theme,
      language: row.language,
      notificationEnabled: row.notification_enabled,
      reminderEnabled: row.reminder_enabled,
      autoBackup: row.auto_backup,
      backupFrequency: row.backup_frequency,
      privacyMode: row.privacy_mode,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
}

export const settingsService = new SettingsService();