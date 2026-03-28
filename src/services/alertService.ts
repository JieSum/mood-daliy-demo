import { Alert, MoodRecord, AlertType } from '../types';

// 分析师提醒类型
export interface AnalystAlert {
  id: string;
  userId: string;
  userDisplayName: string;
  type: 'missing_checkin' | 'negative_pattern' | 'severe_alert';
  reason: string;
  data: any;
  isRead: boolean;
  createdAt: Date;
  resolvedAt?: Date;
}

class AlertService {
  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // 检查负面情绪模式
  async checkNegativePattern(entries: MoodRecord[]): Promise<Alert[]> {
    const alerts: Alert[] = [];

    if (entries.length < 3) {
      return alerts;
    }

    // 检查连续负面情绪
    const recentEntries = entries.slice(0, 7);
    const negativeEntries = recentEntries.filter(entry => entry.analysis.sentiment === 'negative');

    // 轻度预警：连续3-7天负面情绪
    if (negativeEntries.length >= 3 && negativeEntries.length <= 7) {
      alerts.push(await this.generateAlert('mild', '连续3-7天负面情绪', { days: negativeEntries.length }));
    }

    // 中度预警：连续7-14天负面情绪或负面情绪占比>60%
    const twoWeekEntries = entries.slice(0, 14);
    const twoWeekNegativeEntries = twoWeekEntries.filter(entry => entry.analysis.sentiment === 'negative');
    const negativeRatio = twoWeekNegativeEntries.length / twoWeekEntries.length;

    if (twoWeekNegativeEntries.length >= 7 || negativeRatio > 0.6) {
      alerts.push(await this.generateAlert('moderate', '连续7-14天负面情绪或负面情绪占比>60%', { ratio: negativeRatio }));
    }

    // 重度预警：连续>14天负面情绪或负面情绪占比>80%
    const threeWeekEntries = entries.slice(0, 21);
    const threeWeekNegativeEntries = threeWeekEntries.filter(entry => entry.analysis.sentiment === 'negative');
    const threeWeekNegativeRatio = threeWeekNegativeEntries.length / threeWeekEntries.length;

    if (threeWeekNegativeEntries.length > 14 || threeWeekNegativeRatio > 0.8) {
      alerts.push(await this.generateAlert('severe', '连续>14天负面情绪或负面情绪占比>80%', { ratio: threeWeekNegativeRatio }));
    }

    // 检查情绪强度持续下降
    if (entries.length >= 5) {
      const intensityTrend = entries.slice(0, 5).map(entry => entry.analysis.intensity);
      const isDeclining = intensityTrend.every((intensity, index) => {
        if (index === 0) return true;
        return intensity <= intensityTrend[index - 1];
      });

      if (isDeclining) {
        alerts.push(await this.generateAlert('mild', '情绪强度持续下降', { trend: intensityTrend }));
      }
    }

    return alerts;
  }

  // 生成预警
  async generateAlert(type: AlertType, reason: string, data: any): Promise<Alert> {
    const alert: Alert = {
      id: this.generateId(),
      userId: 'current-user',
      type,
      reason,
      data,
      isRead: false,
      isResolved: false,
      createdAt: new Date()
    };

    // 在实际应用中，这里应该将预警保存到数据库
    // 现在使用模拟数据
    console.log('Generated alert:', alert);

    return alert;
  }

  // 标记预警为已读
  async markAsRead(alertId: string): Promise<void> {
    // 在实际应用中，这里应该更新数据库中的预警状态
    console.log('Marked alert as read:', alertId);
  }

  // 标记预警为已解决
  async markAsResolved(alertId: string): Promise<void> {
    // 在实际应用中，这里应该更新数据库中的预警状态
    console.log('Marked alert as resolved:', alertId);
  }

  // 获取未读预警
  async getUnreadAlerts(): Promise<Alert[]> {
    // 模拟未读预警
    return [
      {
        id: '1',
        userId: 'current-user',
        type: 'mild',
        reason: '连续3天负面情绪',
        data: { days: 3 },
        isRead: false,
        isResolved: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        userId: 'current-user',
        type: 'moderate',
        reason: '负面情绪占比>60%',
        data: { ratio: 0.65 },
        isRead: false,
        isResolved: false,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000)
      }
    ];
  }

  // 获取所有预警
  async getAllAlerts(): Promise<Alert[]> {
    // 模拟所有预警
    return [
      {
        id: '1',
        userId: 'current-user',
        type: 'mild',
        reason: '连续3天负面情绪',
        data: { days: 3 },
        isRead: false,
        isResolved: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        userId: 'current-user',
        type: 'moderate',
        reason: '负面情绪占比>60%',
        data: { ratio: 0.65 },
        isRead: false,
        isResolved: false,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000)
      },
      {
        id: '3',
        userId: 'current-user',
        type: 'mild',
        reason: '情绪强度持续下降',
        data: { trend: [7, 6, 5, 4, 3] },
        isRead: true,
        isResolved: true,
        createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
        resolvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ];
  }

  // 检查用户是否多日未打卡
  async checkMissingCheckin(entries: MoodRecord[]): Promise<AnalystAlert | null> {
    if (entries.length === 0) {
      // 新用户，没有记录
      return null;
    }

    const latestEntry = entries[0];
    const daysSinceLastEntry = Math.floor((Date.now() - latestEntry.createdAt.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceLastEntry >= 3) {
      return this.generateAnalystAlert('missing_checkin', '用户多日未打卡', {
        daysSinceLastEntry,
        lastEntryDate: latestEntry.createdAt
      });
    }

    return null;
  }

  // 生成分析师提醒
  async generateAnalystAlert(type: 'missing_checkin' | 'negative_pattern' | 'severe_alert', reason: string, data: any): Promise<AnalystAlert> {
    const alert: AnalystAlert = {
      id: this.generateId(),
      userId: 'current-user',
      userDisplayName: '用户',
      type,
      reason,
      data,
      isRead: false,
      createdAt: new Date()
    };

    // 在实际应用中，这里应该将提醒保存到数据库
    // 现在使用模拟数据
    console.log('Generated analyst alert:', alert);

    return alert;
  }

  // 获取分析师提醒
  async getAnalystAlerts(): Promise<AnalystAlert[]> {
    // 模拟分析师提醒
    return [
      {
        id: 'a1',
        userId: 'current-user',
        userDisplayName: '用户',
        type: 'missing_checkin',
        reason: '用户多日未打卡',
        data: { daysSinceLastEntry: 3, lastEntryDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
        isRead: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: 'a2',
        userId: 'user2',
        userDisplayName: '用户2',
        type: 'negative_pattern',
        reason: '用户连续7天负面情绪',
        data: { days: 7 },
        isRead: false,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000)
      },
      {
        id: 'a3',
        userId: 'user3',
        userDisplayName: '用户3',
        type: 'severe_alert',
        reason: '用户出现严重负面情绪',
        data: { sentiment: 'negative', intensity: 9 },
        isRead: true,
        createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
        resolvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    ];
  }

  // 标记分析师提醒为已读
  async markAnalystAlertAsRead(alertId: string): Promise<void> {
    // 在实际应用中，这里应该更新数据库中的提醒状态
    console.log('Marked analyst alert as read:', alertId);
  }

  // 标记分析师提醒为已解决
  async markAnalystAlertAsResolved(alertId: string): Promise<void> {
    // 在实际应用中，这里应该更新数据库中的提醒状态
    console.log('Marked analyst alert as resolved:', alertId);
  }
}

export const alertService = new AlertService();