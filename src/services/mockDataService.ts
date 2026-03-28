// 模拟数据服务
import { MoodEntry, MoodType, TrendData, DistributionData, TriggerAnalysisData, AIInsight } from '../types';
import { generateMockData, generateMockInsights } from '../utils/mockDataGenerator';

class MockDataService {
  private mockData: MoodEntry[] = [];
  private userId: string = 'demo-user-1';

  constructor() {
    // 初始化模拟数据
    this.mockData = generateMockData(this.userId, 30);
  }

  // 获取所有情绪记录
  async getMoodEntries(): Promise<MoodEntry[]> {
    return this.mockData;
  }

  // 根据日期范围获取情绪记录
  async getMoodEntriesByDateRange(startDate: Date, endDate: Date): Promise<MoodEntry[]> {
    return this.mockData.filter(entry => {
      const entryDate = entry.createdAt;
      return entryDate >= startDate && entryDate <= endDate;
    });
  }

  // 获取情绪趋势数据
  async getMoodTrend(period: 'day' | 'week' | 'month' | 'year'): Promise<TrendData> {
    // 生成模拟趋势数据
    const data = this.mockData
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .map((entry, index) => ({
        date: entry.createdAt,
        moodValue: this.moodTypeToValue(entry.moodType),
        entryCount: 1
      }));

    return {
      period,
      data,
      averageMood: data.reduce((sum, point) => sum + point.moodValue, 0) / data.length,
      moodVariance: 0.5,
      trendDirection: 'up'
    };
  }

  // 获取情绪分布数据
  async getMoodDistribution(): Promise<DistributionData> {
    // 计算情绪分布
    const moodCounts = this.mockData.reduce((acc, entry) => {
      acc[entry.moodType] = (acc[entry.moodType] || 0) + 1;
      return acc;
    }, {} as Record<MoodType, number>);

    const totalCount = this.mockData.length;
    const moodDistribution = Object.entries(moodCounts).map(([moodType, count]) => ({
      moodType: moodType as MoodType,
      count,
      percentage: (count / totalCount) * 100,
      averageIntensity: this.mockData
        .filter(entry => entry.moodType === moodType)
        .reduce((sum, entry) => sum + entry.moodIntensity, 0) / count
    }));

    // 计算标签分布
    const tagCounts = this.mockData.flatMap(entry => entry.tags).reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tagDistribution = Object.entries(tagCounts).map(([tag, count]) => {
      const associatedMoods = [...new Set(
        this.mockData
          .filter(entry => entry.tags.includes(tag))
          .map(entry => entry.moodType)
      )];
      
      return {
        tag,
        count,
        percentage: (count / totalCount) * 100,
        associatedMoods
      };
    });

    // 计算时间分布
    const timeSlots = ['morning', 'afternoon', 'evening', 'night'];
    const timeDistribution = timeSlots.map(timeSlot => {
      const entries = this.mockData.filter(entry => 
        entry.environment?.timeOfDay === timeSlot
      );
      
      return {
        timeSlot,
        count: entries.length,
        averageMood: entries.length > 0 
          ? entries.reduce((sum, entry) => sum + this.moodTypeToValue(entry.moodType), 0) / entries.length
          : 0
      };
    });

    return {
      moodDistribution,
      tagDistribution,
      timeDistribution
    };
  }

  // 获取触发因素分析
  async getTriggerAnalysis(): Promise<TriggerAnalysisData> {
    // 计算触发因素统计
    const triggerCounts = this.mockData.flatMap(entry => entry.triggers || []).reduce((acc, trigger) => {
      acc[trigger] = (acc[trigger] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topTriggers = Object.entries(triggerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([trigger, count]) => {
        const associatedMoods = [...new Set(
          this.mockData
            .filter(entry => entry.triggers?.includes(trigger))
            .map(entry => entry.moodType)
        )];
        
        return {
          trigger,
          count,
          associatedMoods,
          impactScore: Math.random() * 10
        };
      });

    return {
      topTriggers,
      moodTriggerCorrelation: [],
      timeMoodCorrelation: []
    };
  }

  // 获取AI洞察
  async getAIInsights(): Promise<AIInsight[]> {
    return generateMockInsights();
  }

  // 情绪类型转数值（用于趋势分析）
  private moodTypeToValue(moodType: MoodType): number {
    const moodValues: Record<MoodType, number> = {
      happy: 8,
      calm: 7,
      excited: 7.5,
      tired: 4,
      confused: 3,
      anxious: 2,
      sad: 1,
      angry: 2
    };
    return moodValues[moodType];
  }

  // 新增情绪记录
  async addMoodEntry(entry: Omit<MoodEntry, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>): Promise<MoodEntry> {
    const newEntry: MoodEntry = {
      ...entry,
      id: `mock-entry-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false
    };
    
    this.mockData.unshift(newEntry);
    return newEntry;
  }

  // 更新情绪记录
  async updateMoodEntry(id: string, updates: Partial<MoodEntry>): Promise<MoodEntry> {
    const index = this.mockData.findIndex(entry => entry.id === id);
    if (index === -1) {
      throw new Error('Entry not found');
    }

    this.mockData[index] = {
      ...this.mockData[index],
      ...updates,
      updatedAt: new Date()
    };

    return this.mockData[index];
  }

  // 删除情绪记录
  async deleteMoodEntry(id: string): Promise<void> {
    const index = this.mockData.findIndex(entry => entry.id === id);
    if (index === -1) {
      throw new Error('Entry not found');
    }

    this.mockData[index].isDeleted = true;
  }
}

export const mockDataService = new MockDataService();
