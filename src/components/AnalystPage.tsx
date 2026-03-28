import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { alertService } from '../services/alertService';
import type { AnalystAlert } from '../services/alertService';
import { recordService } from '../services/recordService';
import { MoodRecord } from '../types';

const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 1.5rem;
  width: 90%;
  max-width: 1200px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1rem;
  flex-wrap: wrap;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? '#f0f0ff' : 'transparent'};
  color: ${props => props.active ? '#667eea' : '#666'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  max-width: 150px;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  color: #666;
  margin-bottom: 1rem;
  text-align: center;
`;

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AlertItem = styled.div<{ type: string }>`
  background: ${props => {
    switch (props.type) {
      case 'missing_checkin': return '#fff3cd';
      case 'negative_pattern': return '#f8d7da';
      case 'severe_alert': return '#f5c6cb';
      default: return '#f8f9fa';
    }
  }};
  border: 1px solid ${props => {
    switch (props.type) {
      case 'missing_checkin': return '#ffeaa7';
      case 'negative_pattern': return '#f5c6cb';
      case 'severe_alert': return '#f1a0a6';
      default: return '#dee2e6';
    }
  }};
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
`;

const AlertInfo = styled.div`
  flex: 1;
  min-width: 200px;
`;

const AlertActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const ReadButton = styled(Button)`
  background: #667eea;
  color: white;
`;

const ResolveButton = styled(Button)`
  background: #28a745;
  color: white;
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const UserItem = styled.div`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const UserInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const UserName = styled.h4`
  color: #333;
  margin: 0;
`;

const UserStats = styled.div`
  display: flex;
  gap: 1rem;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-weight: bold;
  color: #667eea;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const AnalystPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'users'>('alerts');
  const [alerts, setAlerts] = useState<AnalystAlert[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string; recordCount: number; lastRecordDate: Date | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'alerts') {
        const alertsData = await alertService.getAnalystAlerts();
        setAlerts(alertsData);
      } else if (activeTab === 'users') {
        // 模拟用户数据
        setUsers([
          {
            id: 'current-user',
            name: '用户',
            recordCount: 10,
            lastRecordDate: new Date(Date.now() - 24 * 60 * 60 * 1000)
          },
          {
            id: 'user2',
            name: '用户2',
            recordCount: 15,
            lastRecordDate: new Date(Date.now() - 48 * 60 * 60 * 1000)
          },
          {
            id: 'user3',
            name: '用户3',
            recordCount: 5,
            lastRecordDate: new Date(Date.now() - 72 * 60 * 60 * 1000)
          }
        ]);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (alertId: string) => {
    await alertService.markAnalystAlertAsRead(alertId);
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const handleMarkAsResolved = async (alertId: string) => {
    await alertService.markAnalystAlertAsResolved(alertId);
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, resolvedAt: new Date() } : alert
    ));
  };

  const handleUserClick = (userId: string) => {
    // 在实际应用中，这里应该导航到用户的详细页面
    console.log('Viewing user:', userId);
  };

  if (loading) {
    return (
      <Container>
        <Title>分析师视角</Title>
        <div style={{ textAlign: 'center', padding: '2rem' }}>加载中...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Title>分析师视角</Title>
      <TabsContainer>
        <Tab active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')}>
          提醒
        </Tab>
        <Tab active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          用户
        </Tab>
      </TabsContainer>
      
      {activeTab === 'alerts' && (
        <Section>
          <SectionTitle>分析师提醒</SectionTitle>
          <AlertList>
            {alerts.length > 0 ? (
              alerts.map(alert => (
                <AlertItem key={alert.id} type={alert.type}>
                  <AlertInfo>
                    <h4>{alert.userDisplayName}</h4>
                    <p>{alert.reason}</p>
                    <p style={{ fontSize: '0.8rem', color: '#666' }}>
                      {alert.createdAt.toLocaleString()}
                    </p>
                  </AlertInfo>
                  <AlertActions>
                    {!alert.isRead && (
                      <ReadButton onClick={() => handleMarkAsRead(alert.id)}>
                        标记为已读
                      </ReadButton>
                    )}
                    {!alert.resolvedAt && (
                      <ResolveButton onClick={() => handleMarkAsResolved(alert.id)}>
                        标记为已解决
                      </ResolveButton>
                    )}
                  </AlertActions>
                </AlertItem>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                暂无提醒
              </div>
            )}
          </AlertList>
        </Section>
      )}
      
      {activeTab === 'users' && (
        <Section>
          <SectionTitle>用户列表</SectionTitle>
          <UserList>
            {users.map(user => (
              <UserItem key={user.id} onClick={() => handleUserClick(user.id)}>
                <UserInfo>
                  <UserName>{user.name}</UserName>
                  <UserStats>
                    <Stat>
                      <StatValue>{user.recordCount}</StatValue>
                      <StatLabel>记录数</StatLabel>
                    </Stat>
                    <Stat>
                      <StatValue>
                        {user.lastRecordDate ? 
                          `${Math.floor((Date.now() - user.lastRecordDate.getTime()) / (1000 * 60 * 60 * 24))}天` : 
                          '无'}
                      </StatValue>
                      <StatLabel>最后记录</StatLabel>
                    </Stat>
                  </UserStats>
                </UserInfo>
              </UserItem>
            ))}
          </UserList>
        </Section>
      )}
    </Container>
  );
};

export default AnalystPage;