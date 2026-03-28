import { MoodRecord } from '../types';

class RecordService {
  private records: MoodRecord[] = [];

  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // 创建记录
  async createRecord(record: Omit<MoodRecord, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>): Promise<MoodRecord> {
    const newRecord: MoodRecord = {
      id: this.generateId(),
      ...record,
      userId: 'current-user',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false
    };

    this.records.unshift(newRecord);
    return newRecord;
  }

  // 获取记录列表
  async getRecords(filters?: { startDate?: Date; endDate?: Date; sentiment?: string }): Promise<MoodRecord[]> {
    let filteredRecords = this.records.filter(record => !record.isDeleted);

    if (filters) {
      if (filters.startDate) {
        filteredRecords = filteredRecords.filter(record => record.createdAt >= filters.startDate!);
      }
      if (filters.endDate) {
        filteredRecords = filteredRecords.filter(record => record.createdAt <= filters.endDate!);
      }
      if (filters.sentiment) {
        filteredRecords = filteredRecords.filter(record => record.analysis.sentiment === filters.sentiment);
      }
    }

    return filteredRecords;
  }

  // 根据ID获取记录
  async getRecordById(id: string): Promise<MoodRecord | undefined> {
    return this.records.find(record => record.id === id && !record.isDeleted);
  }

  // 删除记录（软删除）
  async deleteRecord(id: string): Promise<void> {
    const record = this.records.find(record => record.id === id);
    if (record) {
      record.isDeleted = true;
      record.updatedAt = new Date();
    }
  }

  // 搜索记录
  async searchRecords(query: string): Promise<MoodRecord[]> {
    return this.records.filter(record => {
      if (record.isDeleted) return false;
      if (record.content && record.content.includes(query)) return true;
      if (record.analysis.keywords.some(keyword => keyword.includes(query))) return true;
      if (record.analysis.emotionTags.some(tag => tag.includes(query))) return true;
      return false;
    });
  }

  // 获取今日记录
  async getTodayRecords(): Promise<MoodRecord[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.records.filter(record => {
      const recordDate = new Date(record.createdAt);
      return recordDate >= today && recordDate < tomorrow && !record.isDeleted;
    });
  }

  // 生成模拟数据
  generateMockData(): void {
    const mockData: Omit<MoodRecord, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>[] = [
      {
        userId: 'current-user',
        inputType: 'text',
        content: '今天工作很顺利，完成了所有任务，感觉很开心！',
        analysis: {
          sentiment: 'positive',
          sentimentScore: 0.85,
          intensity: 8,
          keywords: ['工作', '顺利', '完成', '任务', '开心'],
          emotionTags: ['积极', '乐观', '愉快', '工作相关'],
          context: '用户在谈论工作，情绪倾向为积极',
          confidence: 0.92
        }
      },
      {
        userId: 'current-user',
        inputType: 'text',
        content: '今天天气不好，心情有点低落，不想做任何事情。',
        analysis: {
          sentiment: 'negative',
          sentimentScore: 0.25,
          intensity: 6,
          keywords: ['天气', '不好', '心情', '低落', '不想'],
          emotionTags: ['消极', '悲观', '沮丧'],
          context: '用户在谈论一般话题，情绪倾向为消极',
          confidence: 0.88
        }
      },
      {
        userId: 'current-user',
        inputType: 'voice',
        voicePath: 'voice1.mp3',
        analysis: {
          sentiment: 'neutral',
          sentimentScore: 0.5,
          intensity: 5,
          keywords: ['语音', '情绪', '分析'],
          emotionTags: ['中性', '平静', '客观'],
          context: '通过语音分析得出的情绪结果',
          confidence: 0.85
        }
      },
      {
        userId: 'current-user',
        inputType: 'image',
        imagePaths: ['image1.jpg'],
        analysis: {
          sentiment: 'positive',
          sentimentScore: 0.75,
          intensity: 7,
          keywords: ['图像', '表情', '场景'],
          emotionTags: ['积极', '乐观', '愉快', '图像情绪'],
          context: '通过图像分析得出的情绪结果',
          confidence: 0.87
        }
      },
      {
        userId: 'current-user',
        inputType: 'text',
        content: '今天学习了新的知识，感觉收获很大，很充实。',
        analysis: {
          sentiment: 'positive',
          sentimentScore: 0.8,
          intensity: 7,
          keywords: ['学习', '知识', '收获', '充实'],
          emotionTags: ['积极', '乐观', '愉快', '学习相关'],
          context: '用户在谈论学习，情绪倾向为积极',
          confidence: 0.9
        }
      },
      {
        userId: 'current-user',
        inputType: 'text',
        content: '最近压力很大，感觉有点焦虑，不知道该怎么办。',
        analysis: {
          sentiment: 'negative',
          sentimentScore: 0.3,
          intensity: 7,
          keywords: ['压力', '很大', '焦虑', '不知道', '怎么办'],
          emotionTags: ['消极', '悲观', '沮丧'],
          context: '用户在谈论一般话题，情绪倾向为消极',
          confidence: 0.89
        }
      },
      {
        userId: 'current-user',
        inputType: 'text',
        content: '今天和朋友一起吃饭，聊了很多，很开心。',
        analysis: {
          sentiment: 'positive',
          sentimentScore: 0.85,
          intensity: 8,
          keywords: ['朋友', '吃饭', '聊天', '开心'],
          emotionTags: ['积极', '乐观', '愉快', '社交相关'],
          context: '用户在谈论人际关系，情绪倾向为积极',
          confidence: 0.91
        }
      }
    ];

    // 为每条记录添加时间戳，模拟过去7天的记录
    mockData.forEach((data, index) => {
      const record: MoodRecord = {
        id: this.generateId(),
        ...data,
        userId: 'current-user',
        createdAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
        isDeleted: false
      };
      this.records.push(record);
    });

    // 按时间倒序排序
    this.records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const recordService = new RecordService();
// 生成模拟数据
recordService.generateMockData();