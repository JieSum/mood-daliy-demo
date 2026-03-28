// 模拟数据生成器
import { MoodEntry, MoodType, BodyState, Environment } from '../types';

const mockMoodTypes: MoodType[] = ['happy', 'calm', 'anxious', 'sad', 'angry', 'excited', 'tired', 'confused'];
const mockTags = ['work', 'family', 'health', 'social', 'hobby', 'exercise', 'study', 'rest'];
const mockTriggers = ['stress', 'success', 'conflict', 'achievement', 'social interaction', 'physical activity', 'rest', 'boredom'];
const mockWeathers = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
const mockLocations = ['home', 'office', 'park', 'cafe', 'gym', 'school'];
const mockTimeSlots = ['morning', 'afternoon', 'evening', 'night'];

// 生成随机情绪记录
function generateMockEntry(userId: string, index: number): MoodEntry {
  const now = new Date();
  const daysAgo = index % 30; // 过去30天的数据
  const entryDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  
  // 随机调整时间
  entryDate.setHours(Math.floor(Math.random() * 24));
  entryDate.setMinutes(Math.floor(Math.random() * 60));
  
  const moodType = mockMoodTypes[Math.floor(Math.random() * mockMoodTypes.length)];
  const moodIntensity = Math.floor(Math.random() * 10) + 1; // 1-10
  
  // 根据情绪类型生成合适的内容
  const content = generateContent(moodType, moodIntensity);
  
  // 随机生成标签和触发因素
  const tags = generateRandomArray(mockTags, 1, 3);
  const triggers = generateRandomArray(mockTriggers, 0, 2);
  
  // 生成身体状态
  const bodyState: BodyState = {
    sleepQuality: Math.floor(Math.random() * 10) + 1,
    sleepHours: 6 + Math.random() * 3, // 6-9小时
    energyLevel: Math.floor(Math.random() * 10) + 1,
    exercise: Math.random() > 0.5,
    exerciseType: Math.random() > 0.5 ? ['running', 'walking', 'yoga', 'gym'][Math.floor(Math.random() * 4)] : undefined,
    exerciseDuration: Math.random() > 0.5 ? Math.floor(Math.random() * 60) + 15 : undefined // 15-75分钟
  };
  
  // 生成环境信息
  const environment: Environment = {
    weather: mockWeathers[Math.floor(Math.random() * mockWeathers.length)],
    location: mockLocations[Math.floor(Math.random() * mockLocations.length)],
    socialContext: Math.random() > 0.5 ? ['alone', 'with friends', 'with family', 'at work'][Math.floor(Math.random() * 4)] : undefined,
    timeOfDay: mockTimeSlots[Math.floor(Math.random() * mockTimeSlots.length)] as 'morning' | 'afternoon' | 'evening' | 'night'
  };
  
  return {
    id: `mock-entry-${index}`,
    userId,
    moodType,
    moodIntensity,
    tags,
    content,
    triggers,
    bodyState,
    environment,
    location: environment.location,
    weather: environment.weather,
    duration: Math.floor(Math.random() * 60) + 5, // 5-65分钟
    createdAt: entryDate,
    updatedAt: entryDate,
    isDeleted: false
  };
}

// 根据情绪类型生成内容
function generateContent(moodType: MoodType, intensity: number): string {
  const contentMap: Record<MoodType, string[]> = {
    happy: [
      '今天感觉很棒！工作顺利完成，心情愉快。',
      '和朋友聚会很开心，感觉充满活力。',
      '完成了一个重要目标，感到非常满足。',
      '天气很好，出去散步让我心情舒畅。',
      '收到了好消息，整个人都很兴奋。'
    ],
    calm: [
      '今天很平静，没有什么特别的事情发生。',
      '冥想后感觉内心很平和。',
      '安静地读了一本书，享受独处的时光。',
      '工作节奏适中，压力不大。',
      '和家人度过了温馨的一天。'
    ],
    anxious: [
      '工作压力有点大，感到焦虑不安。',
      '对未来有些担忧，无法放松。',
      '事情太多，不知道从哪里开始。',
      '社交场合让我感到紧张。',
      ' deadline临近，感到压力很大。'
    ],
    sad: [
      '今天情绪低落，提不起精神。',
      '遇到了一些挫折，感到很沮丧。',
      '想念远方的朋友，感到孤独。',
      '天气阴沉，心情也跟着不好。',
      '工作不如意，感到失落。'
    ],
    angry: [
      '遇到了不公平的事情，很生气。',
      '被人误解，感到愤怒。',
      '计划被打乱，情绪失控。',
      '遇到了交通堵塞，心情烦躁。',
      '工作中遇到了阻碍，感到恼火。'
    ],
    excited: [
      '即将开始新的项目，感到非常兴奋。',
      '收到了意外的惊喜，整个人都很激动。',
      '计划了一次旅行，期待感满满。',
      '学习了新技能，感到很有成就感。',
      '参加了有趣的活动，心情愉悦。'
    ],
    tired: [
      '工作了一整天，感到疲惫不堪。',
      '睡眠质量不好，整个人没精神。',
      '连续加班，身体有些吃不消。',
      '运动过度，肌肉酸痛。',
      '照顾家人，感到身心俱疲。'
    ],
    confused: [
      '面对选择，感到犹豫不决。',
      '工作中遇到了难题，不知道如何解决。',
      '对未来的方向感到迷茫。',
      '人际关系复杂，感到困惑。',
      '信息 overload，大脑一片混乱。'
    ]
  };
  
  const contents = contentMap[moodType];
  return contents[Math.floor(Math.random() * contents.length)];
}

// 生成随机数组
function generateRandomArray<T>(source: T[], min: number, max: number): T[] {
  const length = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...source].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, length);
}

// 生成模拟数据
function generateMockData(userId: string, count: number = 30): MoodEntry[] {
  const mockData: MoodEntry[] = [];
  
  for (let i = 0; i < count; i++) {
    mockData.push(generateMockEntry(userId, i));
  }
  
  return mockData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

// 生成模拟AI洞察
export function generateMockInsights() {
  return [
    {
      id: 'insight-1',
      type: 'pattern' as const,
      title: '情绪模式发现',
      description: '您在工作日的情绪通常比周末低，建议在工作日增加一些放松活动。',
      confidence: 0.85,
      actionable: true,
      actionItems: ['每天花10分钟冥想', '工作日结束后进行轻度运动', '合理安排工作时间'],
      createdAt: new Date()
    },
    {
      id: 'insight-2',
      type: 'suggestion' as const,
      title: '改善建议',
      description: '您的睡眠质量与情绪密切相关，提高睡眠质量可能会改善整体情绪状态。',
      confidence: 0.9,
      actionable: true,
      actionItems: ['保持规律的作息时间', '睡前减少屏幕使用', '创造舒适的睡眠环境'],
      createdAt: new Date()
    },
    {
      id: 'insight-3',
      type: 'achievement' as const,
      title: '进步发现',
      description: '您的情绪稳定性在过去一个月有所提高，继续保持当前的生活方式。',
      confidence: 0.8,
      actionable: false,
      createdAt: new Date()
    }
  ];
}

export { generateMockData };
