import React, { useState } from 'react';
import styled from 'styled-components';
import { moodEntryService } from '../services/moodEntryService';
import { MoodType } from '../types';

const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const MoodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
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

const MoodButton = styled.button<{ selected: boolean; moodType: MoodType }>`
  padding: 1.5rem 1rem;
  border: 2px solid ${props => props.selected ? '#667eea' : '#e0e0e0'};
  border-radius: 15px;
  background: ${props => props.selected ? getMoodColor(props.moodType) : '#f5f5f5'};
  color: ${props => props.selected ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const IntensitySlider = styled.div`
  margin: 2rem 0;
`;

const SliderLabel = styled.div`
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
`;

const Slider = styled.input`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #e0e0e0;
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
  }
`;

const TagsContainer = styled.div`
  margin: 2rem 0;
`;

const TagsTitle = styled.div`
  color: #333;
  margin-bottom: 1rem;
`;

const TagButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TagButton = styled.button<{ selected: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.selected ? '#667eea' : '#e0e0e0'};
  border-radius: 20px;
  background: ${props => props.selected ? '#667eea' : 'white'};
  color: ${props => props.selected ? 'white' : '#333'};
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
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

const QuickMoodRecord: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

  const tags = ['工作', '家庭', '健康', '财务', '社交', '学习'];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
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
        tags: selectedTags
      });
      // 重置表单
      setSelectedMood(null);
      setIntensity(5);
      setSelectedTags([]);
      alert('情绪记录成功！');
    } catch (error) {
      console.error('Error creating mood entry:', error);
      alert('记录失败，请重试');
    }
  };

  return (
    <Container>
      <Title>快速记录情绪</Title>
      
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

      <IntensitySlider>
        <SliderLabel>情绪强度: {intensity}/10</SliderLabel>
        <Slider
          type="range"
          min="1"
          max="10"
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
        />
      </IntensitySlider>

      <TagsContainer>
        <TagsTitle>标签</TagsTitle>
        <TagButtons>
          {tags.map(tag => (
            <TagButton
              key={tag}
              selected={selectedTags.includes(tag)}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </TagButton>
          ))}
        </TagButtons>
      </TagsContainer>

      <SubmitButton onClick={handleSubmit}>
        保存记录
      </SubmitButton>
    </Container>
  );
};

export default QuickMoodRecord;