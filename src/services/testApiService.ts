import { moodEntryService } from './moodEntryService';
import { moodAnalysisService } from './moodAnalysisService';
import { MoodEntry, TimePeriod } from '../types';

class TestApiService {
  // 测试情绪记录的创建
  async createTestEntry(entry: Omit<MoodEntry, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>): Promise<MoodEntry> {
    return moodEntryService.createEntry(entry);
  }

  // 测试获取所有情绪记录
  async getAllEntries() {
    return moodEntryService.getEntries();
  }

  // 测试按日期范围获取情绪记录
  async getEntriesByDateRange(startDate: Date, endDate: Date) {
    return moodEntryService.getEntriesByDateRange(startDate, endDate);
  }

  // 测试更新情绪记录
  async updateEntry(id: string, updates: Partial<MoodEntry>) {
    return moodEntryService.updateEntry(id, updates);
  }

  // 测试删除情绪记录
  async deleteEntry(id: string) {
    return moodEntryService.deleteEntry(id);
  }

  // 测试搜索情绪记录
  async searchEntries(query: string) {
    return moodEntryService.searchEntries(query);
  }

  // 测试趋势分析
  async getTrendAnalysis(period: TimePeriod) {
    return moodAnalysisService.getTrendAnalysis(period);
  }

  // 测试情绪分布分析
  async getMoodDistribution() {
    return moodAnalysisService.getMoodDistribution();
  }

  // 测试触发因素分析
  async getTriggerAnalysis() {
    return moodAnalysisService.getTriggerAnalysis();
  }

  // 测试AI洞察
  async getAIInsights() {
    return moodAnalysisService.getAIInsights();
  }

  // 测试批量创建测试数据
  async createTestData(count: number = 10) {
    const testData = [];
    const moodTypes: MoodEntry['moodType'][] = ['happy', 'calm', 'anxious', 'sad', 'angry', 'excited', 'tired', 'confused'];
    const tags = ['工作', '家庭', '健康', '财务', '社交', '学习'];
    const triggers = ['工作压力', '家庭矛盾', '健康问题', '财务压力', '社交活动', '学习压力'];

    for (let i = 0; i < count; i++) {
      const entry = {
        userId: 'test-user',
        moodType: moodTypes[Math.floor(Math.random() * moodTypes.length)],
        moodIntensity: Math.floor(Math.random() * 10) + 1,
        tags: tags.filter(() => Math.random() > 0.5),
        content: `测试内容 ${i + 1}`,
        triggers: triggers.filter(() => Math.random() > 0.5),
        duration: Math.floor(Math.random() * 120) + 1
      };

      const createdEntry = await moodEntryService.createEntry(entry);
      testData.push(createdEntry);
    }

    return testData;
  }

  // 测试清空测试数据
  async clearTestData() {
    const entries = await moodEntryService.getEntries();
    for (const entry of entries) {
      if (entry.userId === 'test-user') {
        await moodEntryService.deleteEntry(entry.id);
      }
    }
    return { message: 'Test data cleared' };
  }
}

export const testApiService = new TestApiService();