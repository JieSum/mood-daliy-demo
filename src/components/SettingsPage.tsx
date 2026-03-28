import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { settingsService } from '../services/settingsService';
import { UserSettings } from '../types';
import ReminderSettings from './ReminderSettings';

const Container = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: 80vh;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 2rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  color: ${props => props.active ? '#667eea' : '#666'};
  border-bottom: 2px solid ${props => props.active ? '#667eea' : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    color: #667eea;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
`;

const SettingForm = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: #667eea;
  }
  
  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'reminders' | 'backup'>('profile');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await settingsService.getSettings('current-user');
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (updatedSettings: Partial<UserSettings>) => {
    if (!settings) return;

    try {
      const data = await settingsService.updateSettings('current-user', updatedSettings);
      setSettings(data);
      alert('设置已保存');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('保存失败，请重试');
    }
  };

  if (loading) {
    return (
      <Container>
        <Title>设置</Title>
        <div>加载中...</div>
      </Container>
    );
  }

  if (!settings) {
    return (
      <Container>
        <Title>设置</Title>
        <div>无法加载设置</div>
      </Container>
    );
  }

  return (
    <Container>
      <Title>设置</Title>

      <Tabs>
        <Tab active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>个人信息</Tab>
        <Tab active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}>通知设置</Tab>
        <Tab active={activeTab === 'reminders'} onClick={() => setActiveTab('reminders')}>提醒设置</Tab>
        <Tab active={activeTab === 'backup'} onClick={() => setActiveTab('backup')}>备份设置</Tab>
      </Tabs>

      {activeTab === 'profile' && (
        <Section>
          <SectionTitle>个人信息</SectionTitle>
          <SettingForm>
            <FormGroup>
              <Label>姓名</Label>
              <Input
                value={settings.name}
                onChange={(e) => handleUpdateSettings({ name: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label>邮箱</Label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => handleUpdateSettings({ email: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label>主题</Label>
              <Select
                value={settings.theme}
                onChange={(e) => handleUpdateSettings({ theme: e.target.value as 'light' | 'dark' })}
              >
                <option value="light">浅色</option>
                <option value="dark">深色</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>语言</Label>
              <Select
                value={settings.language}
                onChange={(e) => handleUpdateSettings({ language: e.target.value })}
              >
                <option value="zh-CN">简体中文</option>
                <option value="en-US">English</option>
              </Select>
            </FormGroup>
          </SettingForm>
        </Section>
      )}

      {activeTab === 'notifications' && (
        <Section>
          <SectionTitle>通知设置</SectionTitle>
          <SettingForm>
            <FormGroup style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Label>启用通知</Label>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={settings.notificationEnabled}
                  onChange={(e) => handleUpdateSettings({ notificationEnabled: e.target.checked })}
                />
                <ToggleSlider />
              </ToggleSwitch>
            </FormGroup>
            <FormGroup style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Label>启用提醒</Label>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={settings.reminderEnabled}
                  onChange={(e) => handleUpdateSettings({ reminderEnabled: e.target.checked })}
                />
                <ToggleSlider />
              </ToggleSwitch>
            </FormGroup>
            <FormGroup style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Label>隐私模式</Label>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={settings.privacyMode}
                  onChange={(e) => handleUpdateSettings({ privacyMode: e.target.checked })}
                />
                <ToggleSlider />
              </ToggleSwitch>
            </FormGroup>
          </SettingForm>
        </Section>
      )}

      {activeTab === 'reminders' && (
        <ReminderSettings />
      )}

      {activeTab === 'backup' && (
        <Section>
          <SectionTitle>备份设置</SectionTitle>
          <SettingForm>
            <FormGroup style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Label>自动备份</Label>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={settings.autoBackup}
                  onChange={(e) => handleUpdateSettings({ autoBackup: e.target.checked })}
                />
                <ToggleSlider />
              </ToggleSwitch>
            </FormGroup>
            <FormGroup>
              <Label>备份频率</Label>
              <Select
                value={settings.backupFrequency}
                onChange={(e) => handleUpdateSettings({ backupFrequency: e.target.value as 'daily' | 'weekly' | 'monthly' })}
                disabled={!settings.autoBackup}
              >
                <option value="daily">每天</option>
                <option value="weekly">每周</option>
                <option value="monthly">每月</option>
              </Select>
            </FormGroup>
            <Button>立即备份</Button>
            <Button style={{ marginLeft: '1rem', background: '#607D8B' }}>恢复备份</Button>
          </SettingForm>
        </Section>
      )}
    </Container>
  );
};

export default SettingsPage;