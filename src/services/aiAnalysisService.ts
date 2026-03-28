import { EmotionAnalysis, Sentiment } from '../types';

class AIAnalysisService {
  // 模拟文本情绪分析
  async analyzeText(text: string): Promise<EmotionAnalysis> {
    // 模拟分析过程
    await new Promise(resolve => setTimeout(resolve, 500));

    // 简单的情绪分析逻辑
    const positiveWords = ['开心', '高兴', '快乐', '兴奋', '满足', '幸福', '喜悦', '愉快'];
    const negativeWords = ['难过', '伤心', '悲伤', '愤怒', '焦虑', '紧张', '害怕', '担忧'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    for (const word of positiveWords) {
      if (text.includes(word)) positiveCount++;
    }
    
    for (const word of negativeWords) {
      if (text.includes(word)) negativeCount++;
    }

    let sentiment: Sentiment = 'neutral';
    let sentimentScore = 0.5;
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      sentimentScore = Math.min(0.5 + positiveCount * 0.1, 1);
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      sentimentScore = Math.max(0.5 - negativeCount * 0.1, 0);
    }

    // 模拟强度计算
    const intensity = Math.min(5 + Math.abs(positiveCount - negativeCount) * 2, 10);

    // 模拟关键词提取
    const keywords = this.extractKeywords(text);

    // 模拟情绪标签
    const emotionTags = this.generateEmotionTags(sentiment, keywords);

    // 模拟上下文理解
    const context = this.understandContext(text, sentiment);

    return {
      sentiment,
      sentimentScore,
      intensity,
      keywords,
      emotionTags,
      context,
      confidence: Math.random() * 0.2 + 0.8 // 80-100% 置信度
    };
  }

  // 模拟语音情绪分析
  async analyzeVoice(audioPath: string): Promise<EmotionAnalysis> {
    // 模拟分析过程
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 模拟结果
    return {
      sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as Sentiment,
      sentimentScore: Math.random(),
      intensity: Math.floor(Math.random() * 10) + 1,
      keywords: ['语音', '情绪', '分析'],
      emotionTags: ['语音情绪'],
      context: '通过语音分析得出的情绪结果',
      confidence: Math.random() * 0.2 + 0.8
    };
  }

  // 模拟图像情绪分析
  async analyzeImages(imagePaths: string[]): Promise<EmotionAnalysis> {
    // 模拟分析过程
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 模拟结果
    return {
      sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as Sentiment,
      sentimentScore: Math.random(),
      intensity: Math.floor(Math.random() * 10) + 1,
      keywords: ['图像', '表情', '场景'],
      emotionTags: ['图像情绪'],
      context: '通过图像分析得出的情绪结果',
      confidence: Math.random() * 0.2 + 0.8
    };
  }

  // 模拟多模态分析
  async analyzeCombined(data: { text?: string; voicePath?: string; imagePaths?: string[] }): Promise<EmotionAnalysis> {
    // 模拟分析过程
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 模拟结果
    return {
      sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as Sentiment,
      sentimentScore: Math.random(),
      intensity: Math.floor(Math.random() * 10) + 1,
      keywords: ['多模态', '综合', '分析'],
      emotionTags: ['综合情绪'],
      context: '通过多模态分析得出的情绪结果',
      confidence: Math.random() * 0.2 + 0.8
    };
  }

  // 模拟关键词提取
  private extractKeywords(text: string): string[] {
    // 简单的关键词提取逻辑
    const commonWords = ['的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这'];
    const words = text.split(/[\s，。！？；：,.!?:;]/).filter(word => word.length > 1 && !commonWords.includes(word));
    return words.slice(0, 5); // 取前5个关键词
  }

  // 模拟情绪标签生成
  private generateEmotionTags(sentiment: Sentiment, keywords: string[]): string[] {
    const tags: string[] = [];
    
    switch (sentiment) {
      case 'positive':
        tags.push('积极', '乐观', '愉快');
        break;
      case 'negative':
        tags.push('消极', '悲观', '沮丧');
        break;
      case 'neutral':
        tags.push('中性', '平静', '客观');
        break;
    }

    // 根据关键词添加标签
    if (keywords.includes('工作')) tags.push('工作相关');
    if (keywords.includes('生活')) tags.push('生活相关');
    if (keywords.includes('学习')) tags.push('学习相关');
    if (keywords.includes('朋友')) tags.push('社交相关');
    if (keywords.includes('家人')) tags.push('家庭相关');

    return tags.slice(0, 5); // 最多5个标签
  }

  // 模拟上下文理解
  private understandContext(text: string, sentiment: Sentiment): string {
    if (text.includes('工作')) {
      return `用户在谈论工作，情绪倾向为${sentiment === 'positive' ? '积极' : sentiment === 'negative' ? '消极' : '中性'}`;
    } else if (text.includes('生活')) {
      return `用户在谈论生活，情绪倾向为${sentiment === 'positive' ? '积极' : sentiment === 'negative' ? '消极' : '中性'}`;
    } else if (text.includes('学习')) {
      return `用户在谈论学习，情绪倾向为${sentiment === 'positive' ? '积极' : sentiment === 'negative' ? '消极' : '中性'}`;
    } else if (text.includes('朋友') || text.includes('家人')) {
      return `用户在谈论人际关系，情绪倾向为${sentiment === 'positive' ? '积极' : sentiment === 'negative' ? '消极' : '中性'}`;
    } else {
      return `用户在谈论一般话题，情绪倾向为${sentiment === 'positive' ? '积极' : sentiment === 'negative' ? '消极' : '中性'}`;
    }
  }
}

export const aiAnalysisService = new AIAnalysisService();