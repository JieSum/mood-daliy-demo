import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { alertService } from '../services/alertService';
import type { AnalystAlert } from '../services/alertService';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h1`
  color: #667eea;
  margin: 0;
  font-size: 1.2rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  justify-content: center;
`;

const NavButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 0.8rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? '#667eea' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  max-width: 120px;
  text-align: center;
  
  &:hover {
    background: ${props => props.active ? '#667eea' : '#f0f0f0'};
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1rem;
  overflow-y: auto;
`;

const Footer = styled.footer`
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem;
  text-align: center;
  color: #666;
  font-size: 0.8rem;
`;

const AdminContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 1rem;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
`;

const Section = styled.section`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const OverviewCard = styled.div`
  background: #f9f9f9;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
`;

const OverviewItem = styled.div`
  text-align: center;
`;

const OverviewValue = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 0.3rem;
`;

const OverviewLabel = styled.div`
  color: #666;
  font-size: 0.8rem;
`;

const AlertCard = styled.div`
  background: #fef3e7;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const AlertItem = styled.div`
  background: white;
  border-radius: 8px;
  padding: 0.8rem;
  margin-bottom: 0.8rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const AlertInfo = styled.div`
  flex: 1;
`;

const AlertActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.4rem 0.6rem;
  border: none;
  border-radius: 4px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 80px;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const ViewButton = styled(Button)`
  background: #667eea;
  color: white;
`;

const MessageButton = styled(Button)`
  background: #28a745;
  color: white;
`;

const ResolveButton = styled(Button)`
  background: #ffc107;
  color: #333;
`;

const UserCard = styled.div`
  background: #f9f9f9;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const SearchBar = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
`;

const AddButton = styled(Button)`
  background: #28a745;
  color: white;
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
`;

const TableHeader = styled.th`
  background: #f0f0f0;
  padding: 0.5rem;
  text-align: left;
  border-bottom: 2px solid #e0e0e0;
  font-size: 0.7rem;
`;

const TableRow = styled.tr`
  &:hover {
    background: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.1rem 0.4rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'high_risk': return '#f5c6cb';
      case 'normal': return '#c3e6cb';
      default: return '#cce7ff';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'high_risk': return '#721c24';
      case 'normal': return '#155724';
      default: return '#004085';
    }
  }};
`;

const AlertBadge = styled.span<{ level: string }>`
  padding: 0.1rem 0.4rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
  background: ${props => {
    switch (props.level) {
      case 'severe': return '#f5c6cb';
      case 'moderate': return '#ffeaa7';
      case 'mild': return '#cce7ff';
      case 'none': return '#c3e6cb';
      default: return '#f8f9fa';
    }
  }};
  color: ${props => {
    switch (props.level) {
      case 'severe': return '#721c24';
      case 'moderate': return '#856404';
      case 'mild': return '#004085';
      case 'none': return '#155724';
      default: return '#333';
    }
  }};
`;

const CheckInBadge = styled.span<{ checked: boolean }>`
  padding: 0.1rem 0.4rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
  background: ${props => props.checked ? '#c3e6cb' : '#f5c6cb'};
  color: ${props => props.checked ? '#155724' : '#721c24'};
`;

const AdminDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'alerts'>('dashboard');
  const [alerts, setAlerts] = useState<AnalystAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // 模拟用户数据
  const users = [
    {
      id: '1',
      name: '张三',
      status: 'high_risk',
      alertLevel: 'moderate',
      lastCheckIn: '2026-03-23',
      checkInToday: false
    },
    {
      id: '2',
      name: '李四',
      status: 'normal',
      alertLevel: 'mild',
      lastCheckIn: '2026-03-27',
      checkInToday: false
    },
    {
      id: '3',
      name: '王五',
      status: 'normal',
      alertLevel: 'none',
      lastCheckIn: '2026-03-28',
      checkInToday: true
    }
  ];

  // 模拟系统概览数据
  const overviewData = {
    totalUsers: 25,
    checkedInToday: 18,
    pendingAlerts: 5,
    highRiskUsers: 2
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const alertsData = await alertService.getAnalystAlerts();
      setAlerts(alertsData);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
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
        <Header>
          <Title>情绪监测管理系统</Title>
          <Nav>
            <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
              系统概览
            </NavButton>
            <NavButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
              用户管理
            </NavButton>
            <NavButton active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')}>
              预警中心
            </NavButton>
          </Nav>
        </Header>
        <Main>
          <AdminContainer>
            <div style={{ textAlign: 'center', padding: '2rem' }}>加载中...</div>
          </AdminContainer>
        </Main>
        <Footer>
          © 2026 情绪监测管理系统 - 关爱心理健康
        </Footer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>情绪监测管理系统</Title>
        <Nav>
          <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')}>
            系统概览
          </NavButton>
          <NavButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
            用户管理
          </NavButton>
          <NavButton active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')}>
            预警中心
          </NavButton>
        </Nav>
      </Header>
      <Main>
        <AdminContainer>
          {activeTab === 'dashboard' && (
            <>
              <Section>
                <SectionTitle>系统概览</SectionTitle>
                <OverviewCard>
                  <OverviewGrid>
                    <OverviewItem>
                      <OverviewValue>{overviewData.totalUsers}</OverviewValue>
                      <OverviewLabel>总用户数</OverviewLabel>
                    </OverviewItem>
                    <OverviewItem>
                      <OverviewValue>{overviewData.checkedInToday}/{overviewData.totalUsers}</OverviewValue>
                      <OverviewLabel>今日打卡</OverviewLabel>
                    </OverviewItem>
                    <OverviewItem>
                      <OverviewValue>{overviewData.pendingAlerts}</OverviewValue>
                      <OverviewLabel>未处理预警</OverviewLabel>
                    </OverviewItem>
                    <OverviewItem>
                      <OverviewValue>{overviewData.highRiskUsers}</OverviewValue>
                      <OverviewLabel>高风险用户</OverviewLabel>
                    </OverviewItem>
                  </OverviewGrid>
                </OverviewCard>
              </Section>
              
              <Section>
                <SectionTitle>预警信息</SectionTitle>
                <AlertCard>
                  {alerts.length > 0 ? (
                    alerts.map(alert => (
                      <AlertItem key={alert.id}>
                        <AlertInfo>
                          <h4>{alert.userDisplayName} - {alert.reason}</h4>
                          <p style={{ fontSize: '0.9rem', color: '#666' }}>
                            {alert.createdAt.toLocaleString()}
                          </p>
                        </AlertInfo>
                        <AlertActions>
                          <ViewButton onClick={() => handleUserClick(alert.userId)}>
                            查看详情
                          </ViewButton>
                          <MessageButton>
                            发送消息
                          </MessageButton>
                          {!alert.resolvedAt && (
                            <ResolveButton onClick={() => handleMarkAsResolved(alert.id)}>
                              标记已处理
                            </ResolveButton>
                          )}
                        </AlertActions>
                      </AlertItem>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                      暂无预警信息
                    </div>
                  )}
                </AlertCard>
              </Section>
            </>
          )}
          
          {activeTab === 'users' && (
            <Section>
              <SectionTitle>用户管理</SectionTitle>
              <UserCard>
                <SearchBar>
                  <SearchInput placeholder="搜索用户..." />
                  <AddButton>添加用户</AddButton>
                </SearchBar>
                <UserTable>
                  <thead>
                    <tr>
                      <TableHeader>ID</TableHeader>
                      <TableHeader>姓名</TableHeader>
                      <TableHeader>状态</TableHeader>
                      <TableHeader>预警</TableHeader>
                      <TableHeader>打卡</TableHeader>
                      <TableHeader>操作</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          <StatusBadge status={user.status}>
                            {user.status === 'high_risk' ? '高风险' : '正常'}
                          </StatusBadge>
                        </TableCell>
                        <TableCell>
                          <AlertBadge level={user.alertLevel}>
                            {user.alertLevel === 'severe' ? '重度' : 
                             user.alertLevel === 'moderate' ? '中度' : 
                             user.alertLevel === 'mild' ? '轻度' : '无'}
                          </AlertBadge>
                        </TableCell>
                        <TableCell>
                          <CheckInBadge checked={user.checkInToday}>
                            {user.checkInToday ? '已打卡' : '未打卡'}
                          </CheckInBadge>
                        </TableCell>
                        <TableCell>
                          <ViewButton onClick={() => handleUserClick(user.id)}>
                            详情
                          </ViewButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </UserTable>
              </UserCard>
            </Section>
          )}
          
          {activeTab === 'alerts' && (
            <Section>
              <SectionTitle>预警中心</SectionTitle>
              <AlertCard>
                {alerts.length > 0 ? (
                  alerts.map(alert => (
                    <AlertItem key={alert.id}>
                      <AlertInfo>
                        <h4>{alert.userDisplayName} - {alert.reason}</h4>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>
                          {alert.createdAt.toLocaleString()}
                        </p>
                      </AlertInfo>
                      <AlertActions>
                        <ViewButton onClick={() => handleUserClick(alert.userId)}>
                          查看详情
                        </ViewButton>
                        <MessageButton>
                          发送消息
                        </MessageButton>
                        {!alert.resolvedAt && (
                          <ResolveButton onClick={() => handleMarkAsResolved(alert.id)}>
                            标记已处理
                          </ResolveButton>
                        )}
                      </AlertActions>
                    </AlertItem>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    暂无预警信息
                  </div>
                )}
              </AlertCard>
            </Section>
          )}
        </AdminContainer>
      </Main>
      <Footer>
        © 2026 情绪监测管理系统 - 关爱心理健康
      </Footer>
    </Container>
  );
};

export default AdminDemo;