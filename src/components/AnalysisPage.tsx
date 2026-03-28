import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { recordService } from '../services/recordService';
import { alertService } from '../services/alertService';
import { MoodRecord, StatisticsData, Alert } from '../types';

const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 1rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.2rem;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1rem;
  flex-wrap: wrap;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.5rem 0.8rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? '#f0f0ff' : 'transparent'};
  color: ${props => props.active ? '#667eea' : '#666'};
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  max-width: 100px;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background: #f9f9f9;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 0.3rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.8rem;
`;

const ChartContainer = styled.div`
  background: #f9f9f9;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const DistributionContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const PieChart = styled.div`
  text-align: center;
`;

const PieChartTitle = styled.h4`
  color: #666;
  margin-bottom: 1rem;
`;

const PieChartSvg = styled.svg`
  width: 200px;
  height: 200px;
  margin: 0 auto;
`;

const KeywordsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const KeywordTag = styled.span`
  padding: 0.3rem 0.8rem;
  background: #e3e7ff;
  color: #667eea;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const AlertsContainer = styled.div`
  background: #fef3e7;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const AlertItem = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const AlertHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const AlertTitle = styled.h4<{ type: string }>`
  color: ${props => props.type === 'mild' ? '#f59e0b' : props.type === 'moderate' ? '#ef4444' : '#b91c1c'};
  margin: 0;
`;

const AlertTime = styled.span`
  color: #666;
  font-size: 0.8rem;
`;

const AlertContent = styled.p`
  color: #333;
  margin: 0.5rem 0;
`;

const AlertActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const AlertButton = styled.button`
  padding: 0.3rem 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
  color: #666;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f0f0f0;
  }
`;

const RecordsContainer = styled.div`
  background: #f9f9f9;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const RecordItem = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const RecordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const RecordType = styled.span<{ type: string }>`
  padding: 0.2rem 0.6rem;
  background: ${props => props.type === 'text' ? '#e3e7ff' : props.type === 'voice' ? '#d1fae5' : '#fef3c7'};
  color: ${props => props.type === 'text' ? '#667eea' : props.type === 'voice' ? '#059669' : '#d97706'};
  border-radius: 12px;
  font-size: 0.8rem;
`;

const RecordTime = styled.span`
  color: #666;
  font-size: 0.8rem;
`;

const RecordContent = styled.p`
  color: #333;
  margin: 0.5rem 0;
`;

const RecordAnalysis = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SentimentTag = styled.span<{ sentiment: string }>`
  padding: 0.2rem 0.6rem;
  background: ${props => props.sentiment === 'positive' ? '#d1fae5' : props.sentiment === 'negative' ? '#fee2e2' : '#e5e7eb'};
  color: ${props => props.sentiment === 'positive' ? '#059669' : props.sentiment === 'negative' ? '#dc2626' : '#4b5563'};
  border-radius: 12px;
  font-size: 0.8rem;
`;

const Loading = styled.div`
  text-align: center;
  padding: 4rem;
  color: #666;
`;

const AnalysisPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [records, setRecords] = useState<MoodRecord[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recordsData, alertsData] = await Promise.all([
        recordService.getRecords(),
        alertService.getAllAlerts()
      ]);
      setRecords(recordsData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 计算统计数据
  const calculateStatistics = (): StatisticsData => {
    const totalEntries = records.length;
    
    const sentimentDistribution = {
      positive: records.filter(r => r.analysis.sentiment === 'positive').length,
      negative: records.filter(r => r.analysis.sentiment === 'negative').length,
      neutral: records.filter(r => r.analysis.sentiment === 'neutral').length
    };

    // 计算关键词
    const keywordMap = new Map<string, { count: number; sentiment: string }>();
    records.forEach(record => {
      record.analysis.keywords.forEach(keyword => {
        if (keywordMap.has(keyword)) {
          const data = keywordMap.get(keyword)!;
          data.count++;
        } else {
          keywordMap.set(keyword, { count: 1, sentiment: record.analysis.sentiment });
        }
      });
    });

    const topKeywords = Array.from(keywordMap.entries())
      .map(([keyword, data]) => ({
        keyword,
        count: data.count,
        associatedSentiment: data.sentiment
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 计算情绪标签
    const tagMap = new Map<string, { count: number; totalIntensity: number }>();
    records.forEach(record => {
      record.analysis.emotionTags.forEach(tag => {
        if (tagMap.has(tag)) {
          const data = tagMap.get(tag)!;
          data.count++;
          data.totalIntensity += record.analysis.intensity;
        } else {
          tagMap.set(tag, { count: 1, totalIntensity: record.analysis.intensity });
        }
      });
    });

    const emotionTags = Array.from(tagMap.entries())
      .map(([tag, data]) => ({
        tag,
        count: data.count,
        averageIntensity: data.totalIntensity / data.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 计算时间分布
    const timeSlots = ['00:00-06:00', '06:00-12:00', '12:00-18:00', '18:00-24:00'];
    const timeDistribution = timeSlots.map(slot => {
      const [start, end] = slot.split('-').map(t => parseInt(t.split(':')[0]));
      const slotRecords = records.filter(record => {
        const hour = new Date(record.createdAt).getHours();
        return hour >= start && hour < end;
      });
      const averageSentiment = slotRecords.length > 0
        ? slotRecords.reduce((sum, r) => sum + r.analysis.sentimentScore, 0) / slotRecords.length
        : 0;
      return {
        timeSlot: slot,
        count: slotRecords.length,
        averageSentiment
      };
    });

    return {
      totalEntries,
      sentimentDistribution,
      topKeywords,
      emotionTags,
      timeDistribution
    };
  };

  const statistics = calculateStatistics();

  if (loading) {
    return (
      <Container>
        <Loading>加载中...</Loading>
      </Container>
    );
  }

  return (
    <Container>
      <Title>情绪分析</Title>

      <TabsContainer>
        <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
          概览
        </Tab>
        <Tab active={activeTab === 'records'} onClick={() => setActiveTab('records')}>
          记录
        </Tab>
        <Tab active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')}>
          预警
        </Tab>
      </TabsContainer>

      {activeTab === 'overview' && (
        <>
          <Section>
            <SectionTitle>统计概览</SectionTitle>
            <StatsGrid>
              <StatCard>
                <StatValue>{statistics.totalEntries}</StatValue>
                <StatLabel>总记录数</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{statistics.sentimentDistribution.positive}</StatValue>
                <StatLabel>积极记录</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{statistics.sentimentDistribution.negative}</StatValue>
                <StatLabel>消极记录</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{statistics.sentimentDistribution.neutral}</StatValue>
                <StatLabel>中性记录</StatLabel>
              </StatCard>
            </StatsGrid>
          </Section>

          <Section>
            <SectionTitle>情绪分布</SectionTitle>
            <DistributionContainer>
              <PieChart>
                <PieChartTitle>情绪倾向分布</PieChartTitle>
                <PieChartSvg>
                  <circle cx="100" cy="100" r="80" fill="#f0f0f0" />
                  <path
                    d="M100,100 L100,20 A80,80 0 0,1 180,100 Z"
                    fill="#10b981"
                  />
                  <path
                    d="M100,100 L180,100 A80,80 0 0,1 100,180 Z"
                    fill="#ef4444"
                  />
                  <path
                    d="M100,100 L100,180 A80,80 0 0,1 20,100 Z"
                    fill="#6b7280"
                  />
                </PieChartSvg>
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '2px' }} />
                      <span>积极</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '2px' }} />
                      <span>消极</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#6b7280', borderRadius: '2px' }} />
                      <span>中性</span>
                    </div>
                  </div>
                </div>
              </PieChart>
            </DistributionContainer>
          </Section>

          <Section>
            <SectionTitle>关键词分析</SectionTitle>
            <KeywordsContainer>
              {statistics.topKeywords.map((keyword, index) => (
                <KeywordTag key={index}>{keyword.keyword} ({keyword.count})</KeywordTag>
              ))}
            </KeywordsContainer>
          </Section>

          <Section>
            <SectionTitle>时间分布</SectionTitle>
            <ChartContainer>
              {statistics.timeDistribution.map((timeSlot, index) => (
                <div key={index} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>{timeSlot.timeSlot}</span>
                    <span>{timeSlot.count} 条记录</span>
                  </div>
                  <div style={{ height: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        backgroundColor: '#667eea',
                        width: `${(timeSlot.averageSentiment * 100)}%`,
                        borderRadius: '10px'
                      }}
                    />
                  </div>
                  <div style={{ marginTop: '0.3rem', fontSize: '0.8rem', color: '#666' }}>
                    平均情绪倾向: {(timeSlot.averageSentiment * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </ChartContainer>
          </Section>
        </>
      )}

      {activeTab === 'records' && (
        <Section>
          <SectionTitle>历史记录</SectionTitle>
          <RecordsContainer>
            {records.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                暂无记录
              </div>
            ) : (
              records.map((record, index) => (
                <RecordItem key={index}>
                  <RecordHeader>
                    <RecordType type={record.inputType}>
                      {record.inputType === 'text' ? '文字' : record.inputType === 'voice' ? '语音' : '照片'}
                    </RecordType>
                    <RecordTime>
                      {new Date(record.createdAt).toLocaleString('zh-CN')}
                    </RecordTime>
                  </RecordHeader>
                  {record.content && (
                    <RecordContent>{record.content}</RecordContent>
                  )}
                  <RecordAnalysis>
                    <SentimentTag sentiment={record.analysis.sentiment}>
                      {record.analysis.sentiment === 'positive' ? '积极' : record.analysis.sentiment === 'negative' ? '消极' : '中性'}
                    </SentimentTag>
                    <span style={{ color: '#666', fontSize: '0.8rem' }}>强度: {record.analysis.intensity}/10</span>
                  </RecordAnalysis>
                  <KeywordsContainer style={{ marginTop: '0.5rem' }}>
                    {record.analysis.keywords.map((keyword, idx) => (
                      <KeywordTag key={idx}>{keyword}</KeywordTag>
                    ))}
                  </KeywordsContainer>
                </RecordItem>
              ))
            )}
          </RecordsContainer>
        </Section>
      )}

      {activeTab === 'alerts' && (
        <Section>
          <SectionTitle>情绪预警</SectionTitle>
          {alerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              暂无预警
            </div>
          ) : (
            <AlertsContainer>
              {alerts.map((alert, index) => (
                <AlertItem key={index}>
                  <AlertHeader>
                    <AlertTitle type={alert.type}>
                      {alert.type === 'mild' ? '轻度预警' : alert.type === 'moderate' ? '中度预警' : '重度预警'}
                    </AlertTitle>
                    <AlertTime>
                      {new Date(alert.createdAt).toLocaleString('zh-CN')}
                    </AlertTime>
                  </AlertHeader>
                  <AlertContent>{alert.reason}</AlertContent>
                  <AlertActions>
                    {!alert.isRead && (
                      <AlertButton onClick={() => alertService.markAsRead(alert.id)}>
                        标记为已读
                      </AlertButton>
                    )}
                    {!alert.isResolved && (
                      <AlertButton onClick={() => alertService.markAsResolved(alert.id)}>
                        标记为已解决
                      </AlertButton>
                    )}
                  </AlertActions>
                </AlertItem>
              ))}
            </AlertsContainer>
          )}
        </Section>
      )}
    </Container>
  );
};

export default AnalysisPage;