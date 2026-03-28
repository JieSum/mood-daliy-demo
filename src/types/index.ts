// 情绪倾向
export type Sentiment = 'positive' | 'negative' | 'neutral';

// 输入类型
export type InputType = 'text' | 'voice' | 'image';

// 预警类型
export type AlertType = 'mild' | 'moderate' | 'severe';

// 情绪分析结果
export interface EmotionAnalysis {
  sentiment: Sentiment;
  sentimentScore: number; // 0-1
  intensity: number; // 1-10
  keywords: string[];
  emotionTags: string[];
  context: string;
  confidence: number; // 0-1
}

// 情绪记录
export interface MoodRecord {
  id: string;
  userId: string;
  inputType: InputType;
  content?: string;
  voicePath?: string;
  imagePaths?: string[];
  analysis: EmotionAnalysis;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

// 预警
export interface Alert {
  id: string;
  userId: string;
  type: AlertType;
  reason: string;
  data: any;
  isRead: boolean;
  isResolved: boolean;
  createdAt: Date;
  resolvedAt?: Date;
}

// 趋势点
export interface TrendPoint {
  date: Date;
  sentimentScore: number;
  intensity: number;
  entryCount: number;
}

// 旧的情绪类型（保留用于兼容）
export type MoodType = 
  | 'happy' 
  | 'calm' 
  | 'anxious' 
  | 'sad' 
  | 'angry' 
  | 'excited' 
  | 'tired' 
  | 'confused';

// 时间周期
export type TimePeriod = 'day' | 'week' | 'month' | 'year';

// 趋势数据
export interface TrendData {
  period: TimePeriod;
  data: TrendPoint[];
  averageSentiment: number;
  averageIntensity: number;
  trendDirection: 'up' | 'down' | 'stable';
}

// 统计数据
export interface StatisticsData {
  totalEntries: number;
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
  topKeywords: {
    keyword: string;
    count: number;
    associatedSentiment: Sentiment;
  }[];
  emotionTags: {
    tag: string;
    count: number;
    averageIntensity: number;
  }[];
  timeDistribution: {
    timeSlot: string;
    count: number;
    averageSentiment: number;
  }[];
}

// 身体状态
export interface BodyState {
  sleepQuality?: number; // 1-10
  sleepHours?: number;
  energyLevel?: number; // 1-10
  exercise?: boolean;
  exerciseType?: string;
  exerciseDuration?: number;
}

// 环境信息
export interface Environment {
  weather?: string;
  location?: string;
  socialContext?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
}

// 情绪记录
export interface MoodEntry {
  id: string;
  userId: string;
  moodType: MoodType;
  moodIntensity: number; // 1-10
  tags: string[];
  content?: string;
  voiceNotePath?: string;
  images?: string[];
  triggers?: string[];
  bodyState?: BodyState;
  environment?: Environment;
  location?: string;
  weather?: string;
  duration?: number; // minutes
  createdAt: Date;
  updatedAt: Date;
  templateId?: string;
  isDeleted: boolean;
}

// 用户设置
export interface UserSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  reminderTimes: string[];
  reminderEnabled: boolean;
  privacyLevel: 'low' | 'medium' | 'high';
  syncEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
  autoLockTimeout: number; // minutes
  biometricEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 模板字段
export interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'textarea' | 'date';
  required: boolean;
  options?: string[];
  placeholder?: string;
  defaultValue?: any;
}

// 模板
export interface Template {
  id: string;
  userId: string;
  name: string;
  description?: string;
  fields: TemplateField[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 提醒
export interface Reminder {
  id: string;
  userId: string;
  reminderTime: string; // HH:MM format
  message: string;
  isActive: boolean;
  daysOfWeek: number[]; // 0-6, Sunday to Saturday
  createdAt: Date;
  updatedAt: Date;
}



// 情绪分布
export interface MoodDistribution {
  moodType: MoodType;
  count: number;
  percentage: number;
  averageIntensity: number;
}

// 标签分布
export interface TagDistribution {
  tag: string;
  count: number;
  percentage: number;
  associatedMoods: MoodType[];
}

// 时间分布
export interface TimeDistribution {
  timeSlot: string;
  count: number;
  averageMood: number;
}

// 分布数据
export interface DistributionData {
  moodDistribution: MoodDistribution[];
  tagDistribution: TagDistribution[];
  timeDistribution: TimeDistribution[];
}

// 触发因素统计
export interface TriggerStat {
  trigger: string;
  count: number;
  associatedMoods: MoodType[];
  impactScore: number;
}

// 相关性数据
export interface CorrelationData {
  factor: string;
  moodType: MoodType;
  correlation: number; // -1 to 1
  significance: number; // 0 to 1
}

// 时间相关性数据
export interface TimeCorrelationData {
  timeSlot: string;
  moodType: MoodType;
  correlation: number;
}

// 触发因素分析数据
export interface TriggerAnalysisData {
  topTriggers: TriggerStat[];
  moodTriggerCorrelation: CorrelationData[];
  timeMoodCorrelation: TimeCorrelationData[];
}

// AI洞察类型
export type InsightType = 'pattern' | 'warning' | 'suggestion' | 'achievement';

// AI洞察
export interface AIInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  confidence: number; // 0 to 1
  actionable: boolean;
  actionItems?: string[];
  relatedData?: any;
  createdAt: Date;
}

// 预测结果
export interface PredictionResult {
  predictedMood: MoodType;
  confidence: number;
  factors: string[];
  timestamp: Date;
}

// 导出格式
export type ExportFormat = 'json' | 'csv' | 'pdf';

// 条目过滤器
export interface EntryFilters {
  startDate?: Date;
  endDate?: Date;
  moodTypes?: MoodType[];
  tags?: string[];
  minIntensity?: number;
  maxIntensity?: number;
}