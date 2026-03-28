import { moodEntryService } from './moodEntryService';
import { 
  TrendData, 
  TimePeriod, 
  DistributionData, 
  TriggerAnalysisData, 
  AIInsight,
  MoodType 
} from '../types';

class MoodAnalysisService {
  async getTrendAnalysis(period: TimePeriod): Promise<TrendData> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const entries = await moodEntryService.getEntriesByDateRange(startDate, new Date());
    
    // 简化的趋势计算
    const data = entries.map(entry => ({
      date: entry.createdAt,
      moodValue: this.mapMoodTypeToValue(entry.moodType) * (entry.moodIntensity / 10),
      entryCount: 1
    }));

    const averageMood = data.reduce((sum, point) => sum + point.moodValue, 0) / data.length || 0;
    const moodVariance = data.reduce((sum, point) => sum + Math.pow(point.moodValue - averageMood, 2), 0) / data.length || 0;

    // 简化的趋势方向判断
    let trendDirection: 'up' | 'down' | 'stable' = 'stable';
    if (data.length >= 2) {
      const firstHalf = data.slice(0, Math.floor(data.length / 2));
      const secondHalf = data.slice(Math.floor(data.length / 2));
      const firstAverage = firstHalf.reduce((sum, point) => sum + point.moodValue, 0) / firstHalf.length;
      const secondAverage = secondHalf.reduce((sum, point) => sum + point.moodValue, 0) / secondHalf.length;
      
      if (secondAverage - firstAverage > 0.1) {
        trendDirection = 'up';
      } else if (firstAverage - secondAverage > 0.1) {
        trendDirection = 'down';
      }
    }

    return {
      period,
      data,
      averageMood,
      moodVariance,
      trendDirection
    };
  }

  async getMoodDistribution(): Promise<DistributionData> {
    const entries = await moodEntryService.getEntries();

    // 情绪分布
    const moodCounts: Record<MoodType, number> = {
      happy: 0, calm: 0, anxious: 0, sad: 0, 
      angry: 0, excited: 0, tired: 0, confused: 0
    };

    const moodIntensities: Record<MoodType, number> = {
      happy: 0, calm: 0, anxious: 0, sad: 0, 
      angry: 0, excited: 0, tired: 0, confused: 0
    };

    entries.forEach(entry => {
      moodCounts[entry.moodType]++;
      moodIntensities[entry.moodType] += entry.moodIntensity;
    });

    const moodDistribution = Object.entries(moodCounts).map(([moodType, count]) => ({
      moodType: moodType as MoodType,
      count,
      percentage: (count / entries.length) * 100 || 0,
      averageIntensity: moodIntensities[moodType as MoodType] / count || 0
    }));

    // 标签分布
    const tagCounts: Record<string, number> = {};
    const tagMoods: Record<string, Set<MoodType>> = {};

    entries.forEach(entry => {
      entry.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        if (!tagMoods[tag]) {
          tagMoods[tag] = new Set();
        }
        tagMoods[tag].add(entry.moodType);
      });
    });

    const tagDistribution = Object.entries(tagCounts).map(([tag, count]) => ({
      tag,
      count,
      percentage: (count / entries.length) * 100 || 0,
      associatedMoods: Array.from(tagMoods[tag] || [])
    }));

    // 时间分布
    const timeSlots = ['morning', 'afternoon', 'evening', 'night'];
    const timeCounts: Record<string, number> = {
      morning: 0, afternoon: 0, evening: 0, night: 0
    };
    const timeMoods: Record<string, number> = {
      morning: 0, afternoon: 0, evening: 0, night: 0
    };

    entries.forEach(entry => {
      const hour = entry.createdAt.getHours();
      let timeSlot: string;
      if (hour >= 6 && hour < 12) {
        timeSlot = 'morning';
      } else if (hour >= 12 && hour < 18) {
        timeSlot = 'afternoon';
      } else if (hour >= 18 && hour < 24) {
        timeSlot = 'evening';
      } else {
        timeSlot = 'night';
      }
      timeCounts[timeSlot]++;
      timeMoods[timeSlot] += this.mapMoodTypeToValue(entry.moodType) * (entry.moodIntensity / 10);
    });

    const timeDistribution = timeSlots.map(slot => ({
      timeSlot: slot,
      count: timeCounts[slot],
      averageMood: timeMoods[slot] / timeCounts[slot] || 0
    }));

    return {
      moodDistribution,
      tagDistribution,
      timeDistribution
    };
  }

  async getTriggerAnalysis(): Promise<TriggerAnalysisData> {
    const entries = await moodEntryService.getEntries();

    // 触发因素统计
    const triggerCounts: Record<string, number> = {};
    const triggerMoods: Record<string, Set<MoodType>> = {};

    entries.forEach(entry => {
      entry.triggers?.forEach(trigger => {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
        if (!triggerMoods[trigger]) {
          triggerMoods[trigger] = new Set();
        }
        triggerMoods[trigger].add(entry.moodType);
      });
    });

    const topTriggers = Object.entries(triggerCounts)
      .map(([trigger, count]) => ({
        trigger,
        count,
        associatedMoods: Array.from(triggerMoods[trigger] || []),
        impactScore: count / entries.length * 100
      }))
      .sort((a, b) => b.impactScore - a.impactScore)
      .slice(0, 5);

    // 简化的相关性分析
    const moodTriggerCorrelation = [];
    const timeMoodCorrelation = [];

    return {
      topTriggers,
      moodTriggerCorrelation,
      timeMoodCorrelation
    };
  }

  async getAIInsights(): Promise<AIInsight[]> {
    const entries = await moodEntryService.getEntries();
    const insights: AIInsight[] = [];

    // 简化的AI洞察生成
    if (entries.length > 0) {
      // 检查是否有持续负面情绪
      const recentEntries = entries.slice(0, 7);
      const negativeMoods = recentEntries.filter(entry => 
        ['sad', 'anxious', 'angry'].includes(entry.moodType)
      );

      if (negativeMoods.length >= 5) {
        insights.push({
          id: Date.now().toString(),
          type: 'warning',
          title: '持续负面情绪',
          description: '您最近一周有较多负面情绪，建议适当休息和放松。',
          confidence: 0.85,
          actionable: true,
          actionItems: ['尝试深呼吸练习', '进行适量运动', '与朋友交流'],
          createdAt: new Date()
        });
      }

      // 检查情绪模式
      const moodCounts: Record<MoodType, number> = {
        happy: 0, calm: 0, anxious: 0, sad: 0, 
        angry: 0, excited: 0, tired: 0, confused: 0
      };

      entries.forEach(entry => {
        moodCounts[entry.moodType]++;
      });

      const mostCommonMood = Object.entries(moodCounts)
        .sort((a, b) => b[1] - a[1])[0][0] as MoodType;

      insights.push({
        id: (Date.now() + 1).toString(),
        type: 'pattern',
        title: '情绪模式',
        description: `您最常见的情绪是${this.getMoodDisplayName(mostCommonMood)}。`,
        confidence: 0.9,
        actionable: false,
        createdAt: new Date()
      });
    }

    return insights;
  }

  private mapMoodTypeToValue(moodType: MoodType): number {
    const moodValues: Record<MoodType, number> = {
      happy: 1.0,
      excited: 0.8,
      calm: 0.6,
      confused: 0.4,
      tired: 0.3,
      anxious: 0.2,
      sad: 0.1,
      angry: 0.0
    };
    return moodValues[moodType];
  }

  private getMoodDisplayName(moodType: MoodType): string {
    const moodNames: Record<MoodType, string> = {
      happy: '开心',
      calm: '平静',
      anxious: '焦虑',
      sad: '悲伤',
      angry: '愤怒',
      excited: '兴奋',
      tired: '疲惫',
      confused: '困惑'
    };
    return moodNames[moodType];
  }
}

export const moodAnalysisService = new MoodAnalysisService();