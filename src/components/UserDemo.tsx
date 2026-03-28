import React, { useState } from 'react';
import styled from 'styled-components';
import RecordPage from './RecordPage';
import AnalysisPage from './AnalysisPage';

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
  gap: 1rem;
  width: 100%;
  justify-content: center;
`;

const NavButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? '#667eea' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  max-width: 100px;
  
  &:hover {
    background: ${props => props.active ? '#667eea' : '#f0f0f0'};
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
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

const UserDemo: React.FC = () => {
  const [activePage, setActivePage] = useState<'record' | 'analysis'>('record');

  return (
    <Container>
      <Header>
        <Title>心情日记</Title>
        <Nav>
          <NavButton active={activePage === 'record'} onClick={() => setActivePage('record')}>
            记录
          </NavButton>
          <NavButton active={activePage === 'analysis'} onClick={() => setActivePage('analysis')}>
            分析
          </NavButton>
        </Nav>
      </Header>
      <Main>
        {activePage === 'record' && <RecordPage />}
        {activePage === 'analysis' && <AnalysisPage />}
      </Main>
      <Footer>
        © 2026 心情日记 - 关爱你的心理健康
      </Footer>
    </Container>
  );
};

export default UserDemo;