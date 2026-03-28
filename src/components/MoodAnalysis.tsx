import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { moodAnalysisService } from '../services/moodAnalysisService';
import { TimePeriod } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 1000px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: 80vh;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h3`
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
`;

const ChartContainer = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const PeriodSelector = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
`;

const PeriodButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: 1px solid ${props => props.active ? '#667eea' : '#e0e0e0'};
  border-radius: 20px;
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  cursor: pointer;
  font-size: 0.9rem;
`;

const InsightCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const InsightTitle = styled.h4`
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const InsightDescription = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

const ActionItems = styled.ul`
  color: #666;
  margin-left: 1.5rem;
`;

const MoodAnalysis: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('week');
  const [trendData, setTrendData] = useState<any>(null);
  const [distributionData, setDistributionData] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysisData();
  }, [selectedPeriod]);

  const loadAnalysisData = async () => {
    setLoading(true);
    try {
      const [trend, distribution, aiInsights] = await Promise.all([
        moodAnalysisService.getTrendAnalysis(selectedPeriod),
        moodAnalysisService.getMoodDistribution(),
        moodAnalysisService.getAIInsights()
      ]);
      setTrendData(trend);
      setDistributionData(distribution);
      setInsights(aiInsights);
    } catch (error) {
      console.error('Error loading analysis data:', error);
    } finally {
      setLoading(false);
    }
  };

  const moodColors = {
    happy: '#4CAF50',
    calm: '#2196F3',
    anxious: '#FF9800',
    sad: '#9C27B0',
    angry: '#F44336',
    excited: '#FF5722',
    tired: '#607D8B',
    confused: '#795548'
  };

  if (loading) {
    return (
      <Container>
        <Title>情绪分析</Title>
        <div>加载中...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Title>情绪分析</Title>

      <Section>
        <SectionTitle>情绪趋势</SectionTitle>
        <PeriodSelector>
          <PeriodButton active={selectedPeriod === 'day'} onClick={() => setSelectedPeriod('day')}>日</PeriodButton>
          <PeriodButton active={selectedPeriod === 'week'} onClick={() => setSelectedPeriod('week')}>周</PeriodButton>
          <PeriodButton active={selectedPeriod === 'month'} onClick={() => setSelectedPeriod('month')}>月</PeriodButton>
          <PeriodButton active={selectedPeriod === 'year'} onClick={() => setSelectedPeriod('year')}>年</PeriodButton>
        </PeriodSelector>
        <ChartContainer>
          <LineChart
            width={800}
            height={300}
            data={trendData?.data || []}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="moodValue" stroke="#667eea" activeDot={{ r: 8 }} />
          </LineChart>
        </ChartContainer>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <p>平均情绪值: {trendData?.averageMood.toFixed(2)}</p>
          <p>情绪趋势: {trendData?.trendDirection === 'up' ? '上升' : trendData?.trendDirection === 'down' ? '下降' : '稳定'}</p>
        </div>
      </Section>

      <Section>
        <SectionTitle>情绪分布</SectionTitle>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <ChartContainer style={{ flex: 1, minWidth: '300px' }}>
            <PieChart width={300} height={300}>
              <Pie
                data={distributionData?.moodDistribution || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {distributionData?.moodDistribution?.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={moodColors[entry.moodType]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartContainer>
          
          <ChartContainer style={{ flex: 1, minWidth: '300px' }}>
            <BarChart
              width={400}
              height={300}
              data={distributionData?.tagDistribution?.slice(0, 10) || []}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tag" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#667eea" />
            </BarChart>
          </ChartContainer>
        </div>
      </Section>

      <Section>
        <SectionTitle>AI洞察</SectionTitle>
        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <InsightCard key={index}>
              <InsightTitle>{insight.title}</InsightTitle>
              <InsightDescription>{insight.description}</InsightDescription>
              {insight.actionItems && insight.actionItems.length > 0 && (
                <ActionItems>
                  {insight.actionItems.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ActionItems>
              )}
            </InsightCard>
          ))
        ) : (
          <p style={{ color: '#666', textAlign: 'center' }}>暂无洞察数据，请先记录一些情绪</p>
        )}
      </Section>
    </Container>
  );
};

export default MoodAnalysis;