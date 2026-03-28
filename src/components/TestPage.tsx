import React, { useEffect, useState } from 'react';
import { mockDataService } from '../services/mockDataService';
import { MoodEntry, TrendData, DistributionData, TriggerAnalysisData, AIInsight } from '../types';
import styled from 'styled-components';

const TestPage = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [distributionData, setDistributionData] = useState<DistributionData | null>(null);
  const [triggerData, setTriggerData] = useState<TriggerAnalysisData | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = async () => {
    try {
      setLoading(true);
      
      // 并行加载所有模拟数据
      const [entries, trend, distribution, triggers, aiInsights] = await Promise.all([
        mockDataService.getMoodEntries(),
        mockDataService.getMoodTrend('month'),
        mockDataService.getMoodDistribution(),
        mockDataService.getTriggerAnalysis(),
        mockDataService.getAIInsights()
      ]);

      setMoodEntries(entries);
      setTrendData(trend);
      setDistributionData(distribution);
      setTriggerData(triggers);
      setInsights(aiInsights);
    } catch (error) {
      console.error('Failed to load mock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const MoodCard = ({ entry }: { entry: MoodEntry }) => {
    const getMoodColor = (moodType: string) => {
      const colors: Record<string, string> = {
        happy: '#4CAF50',
        calm: '#2196F3',
        excited: '#FF9800',
        tired: '#9E9E9E',
        confused: '#9C27B0',
        anxious: '#FF5722',
        sad: '#3F51B5',
        angry: '#F44336'
      };
      return colors[moodType] || '#607D8B';
    };

    return (
      <Card style={{ borderLeftColor: getMoodColor(entry.moodType) }}>
        <CardHeader>
          <MoodType>{entry.moodType}</MoodType>
          <Intensity>{entry.moodIntensity}/10</Intensity>
        </CardHeader>
        <CardContent>
          <Content>{entry.content}</Content>
          <MetaInfo>
            <span>{new Date(entry.createdAt).toLocaleString()}</span>
            {entry.location && <span>• {entry.location}</span>}
          </MetaInfo>
          {entry.tags.length > 0 && (
            <Tags>
              {entry.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Tags>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return <Loading>加载模拟数据中...</Loading>;
  }

  return (
    <Container>
      <Title>模拟数据测试页面</Title>
      <Subtitle>展示从模拟数据服务获取的数据</Subtitle>

      <Section>
        <SectionTitle>最近的情绪记录</SectionTitle>
        <CardGrid>
          {moodEntries.slice(0, 5).map(entry => (
            <MoodCard key={entry.id} entry={entry} />
          ))}
        </CardGrid>
      </Section>

      <Section>
        <SectionTitle>情绪分布</SectionTitle>
        {distributionData && (
          <DistributionContainer>
            {distributionData.moodDistribution.map(item => (
              <DistributionItem key={item.moodType}>
                <DistributionLabel>{item.moodType}</DistributionLabel>
                <DistributionBar
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.moodType === 'happy' ? '#4CAF50' : 
                                    item.moodType === 'sad' ? '#3F51B5' : 
                                    item.moodType === 'angry' ? '#F44336' : 
                                    item.moodType === 'anxious' ? '#FF5722' : '#607D8B'
                  }}
                />
                <DistributionValue>{item.percentage.toFixed(1)}%</DistributionValue>
              </DistributionItem>
            ))}
          </DistributionContainer>
        )}
      </Section>

      <Section>
        <SectionTitle>AI 洞察</SectionTitle>
        <InsightsContainer>
          {insights.map(insight => (
            <InsightCard key={insight.id}>
              <InsightType>{insight.type}</InsightType>
              <InsightTitle>{insight.title}</InsightTitle>
              <InsightDescription>{insight.description}</InsightDescription>
              {insight.actionItems && insight.actionItems.length > 0 && (
                <ActionItems>
                  {insight.actionItems.map((item, index) => (
                    <ActionItem key={index}>• {item}</ActionItem>
                  ))}
                </ActionItems>
              )}
            </InsightCard>
          ))}
        </InsightsContainer>
      </Section>

      <Section>
        <SectionTitle>触发因素分析</SectionTitle>
        {triggerData && (
          <TriggersContainer>
            {triggerData.topTriggers.map(item => (
              <TriggerItem key={item.trigger}>
                <TriggerName>{item.trigger}</TriggerName>
                <TriggerCount>{item.count} 次</TriggerCount>
                <TriggerMoods>
                  {item.associatedMoods.map(mood => (
                    <MoodBadge key={mood}>{mood}</MoodBadge>
                  ))}
                </TriggerMoods>
              </TriggerItem>
            ))}
          </TriggersContainer>
        )}
      </Section>

      <Button onClick={loadMockData}>刷新模拟数据</Button>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
  border-left: 4px solid #607D8B;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const MoodType = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  text-transform: capitalize;
`;

const Intensity = styled.span`
  font-size: 0.9rem;
  color: #666;
  background: #f0f0f0;
  padding: 4px 12px;
  border-radius: 12px;
`;

const CardContent = styled.div`
  margin-top: 10px;
`;

const Content = styled.p`
  color: #444;
  line-height: 1.5;
  margin-bottom: 15px;
`;

const MetaInfo = styled.div`
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 10px;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const Tag = styled.span`
  font-size: 0.8rem;
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 12px;
`;

const DistributionContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const DistributionItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 15px;
`;

const DistributionLabel = styled.span`
  width: 100px;
  font-size: 0.9rem;
  color: #666;
  text-transform: capitalize;
`;

const DistributionBar = styled.div`
  flex: 1;
  height: 20px;
  border-radius: 10px;
  transition: width 0.3s ease;
`;

const DistributionValue = styled.span`
  width: 60px;
  font-size: 0.9rem;
  color: #666;
  text-align: right;
`;

const InsightsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const InsightCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-top: 4px solid #2196F3;
`;

const InsightType = styled.div`
  font-size: 0.8rem;
  color: #2196F3;
  font-weight: 600;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InsightTitle = styled.h4`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 10px;
`;

const InsightDescription = styled.p`
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
`;

const ActionItems = styled.div`
  margin-top: 10px;
`;

const ActionItem = styled.div`
  font-size: 0.9rem;
  color: #444;
  margin-bottom: 5px;
`;

const TriggersContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const TriggerItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 20px;
`;

const TriggerName = styled.span`
  width: 150px;
  font-size: 0.9rem;
  color: #333;
`;

const TriggerCount = styled.span`
  width: 80px;
  font-size: 0.9rem;
  color: #666;
`;

const TriggerMoods = styled.div`
  flex: 1;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const MoodBadge = styled.span`
  font-size: 0.8rem;
  background: #f5f5f5;
  color: #666;
  padding: 2px 8px;
  border-radius: 10px;
  text-transform: capitalize;
`;

const Button = styled.button`
  background: #2196F3;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #1976D2;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 100px 0;
  font-size: 1.2rem;
  color: #666;
`;

export default TestPage;
