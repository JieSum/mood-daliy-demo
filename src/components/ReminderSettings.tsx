import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { reminderService } from '../services/reminderService';
import { Reminder } from '../types';

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

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #666;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const ReminderForm = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: vertical;
  min-height: 80px;
  font-size: 1rem;
  font-family: inherit;
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
  margin-right: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
`;

const ReminderList = styled.div`
  margin-top: 2rem;
`;

const ReminderItem = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReminderInfo = styled.div`
  flex: 1;
`;

const ReminderTime = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ReminderMessage = styled.div`
  color: #666;
  margin-bottom: 0.5rem;
`;

const ReminderStatus = styled.div<{ active: boolean }>`
  color: ${props => props.active ? '#4CAF50' : '#999'};
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
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

const ReminderSettings: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState({
    reminderTime: '',
    message: '该记录你的情绪了！',
    isActive: true
  });

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const data = await reminderService.getReminders('current-user');
      setReminders(data);
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const handleAddReminder = async () => {
    if (!newReminder.reminderTime) return;

    try {
      await reminderService.createReminder({
        userId: 'current-user',
        ...newReminder
      });
      loadReminders();
      // 重置表单
      setNewReminder({
        reminderTime: '',
        message: '该记录你的情绪了！',
        isActive: true
      });
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };

  const handleToggleReminder = async (id: string, isActive: boolean) => {
    try {
      await reminderService.updateReminder(id, { isActive: !isActive });
      loadReminders();
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      await reminderService.deleteReminder(id);
      loadReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  return (
    <Container>
      <Title>提醒设置</Title>

      <Section>
        <SectionTitle>添加新提醒</SectionTitle>
        <ReminderForm>
          <FormGroup>
            <Label>提醒时间</Label>
            <Input
              type="time"
              value={newReminder.reminderTime}
              onChange={(e) => setNewReminder({...newReminder, reminderTime: e.target.value})}
            />
          </FormGroup>
          <FormGroup>
            <Label>提醒消息</Label>
            <TextArea
              value={newReminder.message}
              onChange={(e) => setNewReminder({...newReminder, message: e.target.value})}
            />
          </FormGroup>
          <FormGroup>
            <Label>启用提醒</Label>
            <ToggleSwitch>
              <ToggleInput
                type="checkbox"
                checked={newReminder.isActive}
                onChange={(e) => setNewReminder({...newReminder, isActive: e.target.checked})}
              />
              <ToggleSlider />
            </ToggleSwitch>
          </FormGroup>
          <Button onClick={handleAddReminder}>添加提醒</Button>
        </ReminderForm>
      </Section>

      <Section>
        <SectionTitle>现有提醒</SectionTitle>
        <ReminderList>
          {reminders.length > 0 ? (
            reminders.map(reminder => (
              <ReminderItem key={reminder.id}>
                <ReminderInfo>
                  <ReminderTime>{reminder.reminderTime}</ReminderTime>
                  <ReminderMessage>{reminder.message}</ReminderMessage>
                  <ReminderStatus active={reminder.isActive}>
                    {reminder.isActive ? '已启用' : '已禁用'}
                  </ReminderStatus>
                </ReminderInfo>
                <ActionButtons>
                  <ToggleSwitch>
                    <ToggleInput
                      type="checkbox"
                      checked={reminder.isActive}
                      onChange={() => handleToggleReminder(reminder.id, reminder.isActive)}
                    />
                    <ToggleSlider />
                  </ToggleSwitch>
                  <Button onClick={() => handleDeleteReminder(reminder.id)} style={{ background: '#f44336' }}>
                    删除
                  </Button>
                </ActionButtons>
              </ReminderItem>
            ))
          ) : (
            <p style={{ color: '#666', textAlign: 'center' }}>暂无提醒设置</p>
          )}
        </ReminderList>
      </Section>
    </Container>
  );
};

export default ReminderSettings;