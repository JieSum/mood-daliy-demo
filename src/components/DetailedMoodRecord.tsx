import React, { useState } from 'react';
import styled from 'styled-components';
import { moodEntryService } from '../services/moodEntryService';
import { MoodType, BodyState, Environment } from '../types';

const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #666;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const MoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MoodButton = styled.button<{ selected: boolean; moodType: MoodType }>`
  padding: 1rem;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e0e0e0'};
  border-radius: 10px;
  background: ${props => props.selected ? getMoodColor(props.moodType) : '#f5f5f5'};
  color: ${props => props.selected ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
`;

const IntensitySlider = styled.div`
  margin: 1rem 0;
`;

const SliderLabel = styled.div`
  color: #333;
  margin-bottom: 0.5rem;
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e0e0e0;
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
  }
`;

const TagsContainer = styled.div`
  margin: 1rem 0;
`;

const TagButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TagButton = styled.button<{ selected: boolean }>`
  padding: 0.4rem 0.8rem;
  border: 1px solid ${props => props.selected ? '#667eea' : '#e0e0e0'};
  border-radius: 16px;
  background: ${props => props.selected ? '#667eea' : 'white'};
  color: ${props => props.selected ? 'white' : '#333'};
  cursor: pointer;
  font-size: 0.8rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  resize: vertical;
  min-height: 100px;
  font-size: 1rem;
  font-family: inherit;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
`;

const getMoodColor = (moodType: MoodType): string => {
  const colors: Record<MoodType, string> = {
    happy: '#4CAF50',
    calm: '#2196F3',
    anxious: '#FF9800',
    sad: '#9C27B0',
    angry: '#F44336',
    excited: '#FF5722',
    tired: '#607D8B',
    confused: '#795548'
  };
  return colors[moodType];
};

const DetailedMoodRecord: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [duration, setDuration] = useState<number | ''>('');
  
  // 身体状态
  const [bodyState, setBodyState] = useState<BodyState>({
    sleepQuality: 5,
    sleepHours: 7,
    energyLevel: 5,
    exercise: false
  });
  
  // 环境信息
  const [environment, setEnvironment] = useState<Environment>({
    weather: '',
    location: '',
    timeOfDay: 'morning'
  });

  const moodTypes: { type: MoodType; label: string }[] = [
    { type: 'happy', label: '开心' },
    { type: 'calm', label: '平静' },
    { type: 'anxious', label: '焦虑' },
    { type: 'sad', label: '悲伤' },
    { type: 'angry', label: '愤怒' },
    { type: 'excited', label: '兴奋' },
    { type: 'tired', label: '疲惫' },
    { type: 'confused', label: '困惑' }
  ];

  const commonTags = ['工作', '家庭', '健康', '财务', '社交', '学习'];
  const commonTriggers = ['工作压力', '家庭矛盾', '健康问题', '财务压力', '社交活动', '学习压力'];
  const timeOfDayOptions = ['morning', 'afternoon', 'evening', 'night'];

  const toggleTag = (tag: string, setFn: React.Dispatch<React.SetStateAction<string[]>>) => {
    setFn(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;

    try {
      await moodEntryService.createEntry({
        userId: 'current-user',
        moodType: selectedMood,
        moodIntensity: intensity,
        tags,
        content,
        triggers,
        duration: duration ? Number(duration) : undefined,
        bodyState,
        environment
      });
      
      // 重置表单
      setSelectedMood(null);
      setIntensity(5);
      setTags([]);
      setContent('');
      setTriggers([]);
      setDuration('');
      setBodyState({
        sleepQuality: 5,
        sleepHours: 7,
        energyLevel: 5,
        exercise: false
      });
      setEnvironment({
        weather: '',
        location: '',
        timeOfDay: 'morning'
      });
      
      alert('情绪记录成功！');
    } catch (error) {
      console.error('Error creating mood entry:', error);
      alert('记录失败，请重试');
    }
  };

  return (
    <Container>
      <Title>详细记录情绪</Title>
      
      <Section>
        <SectionTitle>情绪类型</SectionTitle>
        <MoodGrid>
          {moodTypes.map(mood => (
            <MoodButton
              key={mood.type}
              selected={selectedMood === mood.type}
              moodType={mood.type}
              onClick={() => setSelectedMood(mood.type)}
            >
              {mood.label}
            </MoodButton>
          ))}
        </MoodGrid>
      </Section>

      <Section>
        <SectionTitle>情绪强度</SectionTitle>
        <IntensitySlider>
          <SliderLabel>{intensity}/10</SliderLabel>
          <Slider
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
          />
        </IntensitySlider>
      </Section>

      <Section>
        <SectionTitle>标签</SectionTitle>
        <TagButtons>
          {commonTags.map(tag => (
            <TagButton
              key={tag}
              selected={tags.includes(tag)}
              onClick={() => toggleTag(tag, setTags)}
            >
              {tag}
            </TagButton>
          ))}
        </TagButtons>
      </Section>

      <Section>
        <SectionTitle>详细内容</SectionTitle>
        <TextArea
          placeholder="记录你的感受..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </Section>

      <Section>
        <SectionTitle>触发因素</SectionTitle>
        <TagButtons>
          {commonTriggers.map(trigger => (
            <TagButton
              key={trigger}
              selected={triggers.includes(trigger)}
              onClick={() => toggleTag(trigger, setTriggers)}
            >
              {trigger}
            </TagButton>
          ))}
        </TagButtons>
      </Section>

      <Grid>
        <Section>
          <SectionTitle>持续时间 (分钟)</SectionTitle>
          <Input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </Section>

        <Section>
          <SectionTitle>地点</SectionTitle>
          <Input
            type="text"
            placeholder="在哪里？"
            value={environment.location}
            onChange={(e) => setEnvironment({...environment, location: e.target.value})}
          />
        </Section>
      </Grid>

      <Section>
        <SectionTitle>身体状态</SectionTitle>
        <Grid>
          <div>
            <SliderLabel>睡眠质量: {bodyState.sleepQuality}/10</SliderLabel>
            <Slider
              type="range"
              min="1"
              max="10"
              value={bodyState.sleepQuality}
              onChange={(e) => setBodyState({...bodyState, sleepQuality: Number(e.target.value)})}
            />
          </div>
          <div>
            <SliderLabel>睡眠时长: {bodyState.sleepHours}小时</SliderLabel>
            <Slider
              type="range"
              min="1"
              max="12"
              value={bodyState.sleepHours}
              onChange={(e) => setBodyState({...bodyState, sleepHours: Number(e.target.value)})}
            />
          </div>
          <div>
            <SliderLabel>精力水平: {bodyState.energyLevel}/10</SliderLabel>
            <Slider
              type="range"
              min="1"
              max="10"
              value={bodyState.energyLevel}
              onChange={(e) => setBodyState({...bodyState, energyLevel: Number(e.target.value)})}
            />
          </div>
          <div>
            <SliderLabel>是否运动</SliderLabel>
            <input
              type="checkbox"
              checked={bodyState.exercise}
              onChange={(e) => setBodyState({...bodyState, exercise: e.target.checked})}
            />
          </div>
        </Grid>
      </Section>

      <SubmitButton onClick={handleSubmit}>
        保存详细记录
      </SubmitButton>
    </Container>
  );
};

export default DetailedMoodRecord;