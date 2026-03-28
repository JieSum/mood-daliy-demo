import React, { useState } from 'react';
import styled from 'styled-components';
import { aiAnalysisService } from '../services/aiAnalysisService';
import { recordService } from '../services/recordService';
import { InputType, EmotionAnalysis } from '../types';

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

const Subtitle = styled.h3`
  color: #666;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1rem;
`;

const InputTypeContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const InputTypeButton = styled.button<{ active: boolean }>`
  padding: 0.8rem;
  border: 2px solid ${props => props.active ? '#667eea' : '#e0e0e0'};
  border-radius: 10px;
  background: ${props => props.active ? '#f0f0ff' : 'white'};
  color: ${props => props.active ? '#667eea' : '#666'};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 80px;
  flex: 1;
  max-width: 120px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
  }
`;

const InputContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: vertical;
  min-height: 150px;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
`;

const VoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const VoiceButton = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
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

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ImageUpload = styled.input`
  display: none;
`;

const ImageUploadButton = styled.label`
  padding: 2rem;
  border: 2px dashed #e0e0e0;
  border-radius: 10px;
  background: #f9f9f9;
  color: #666;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 150px;
  
  &:hover {
    border-color: #667eea;
    background: #f0f0ff;
  }
`;

const AnalysisContainer = styled.div`
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const AnalysisTitle = styled.h4`
  color: #333;
  margin-bottom: 1rem;
`;

const AnalysisItem = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
`;

const AnalysisLabel = styled.span`
  color: #666;
`;

const AnalysisValue = styled.span`
  font-weight: 500;
  color: #333;
`;

const KeywordsContainer = styled.div`
  margin-top: 1rem;
`;

const KeywordTag = styled.span`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: #e3e7ff;
  color: #667eea;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.8rem 2rem;
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
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`;

const RecordPage: React.FC = () => {
  const [inputType, setInputType] = useState<InputType>('text');
  const [content, setContent] = useState('');
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<EmotionAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleInputTypeChange = (type: InputType) => {
    setInputType(type);
    setAnalysis(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      let result: EmotionAnalysis;

      switch (inputType) {
        case 'text':
          if (!content.trim()) {
            throw new Error('请输入文字内容');
          }
          result = await aiAnalysisService.analyzeText(content);
          break;
        case 'voice':
          // 模拟语音分析
          result = await aiAnalysisService.analyzeVoice('voice.mp3');
          break;
        case 'image':
          if (imagePaths.length === 0) {
            throw new Error('请上传至少一张照片');
          }
          result = await aiAnalysisService.analyzeImages(imagePaths);
          break;
        default:
          throw new Error('请选择输入类型');
      }

      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!analysis) return;

    try {
      await recordService.createRecord({
        userId: 'current-user',
        inputType,
        content: inputType === 'text' ? content : undefined,
        voicePath: inputType === 'voice' ? 'voice.mp3' : undefined,
        imagePaths: inputType === 'image' ? imagePaths : undefined,
        analysis
      });

      // 重置表单
      setContent('');
      setImagePaths([]);
      setAnalysis(null);
      alert('记录保存成功！');
    } catch (err) {
      setError('保存失败，请重试');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const paths = Array.from(files).map(file => URL.createObjectURL(file));
      setImagePaths(prev => [...prev, ...paths].slice(0, 3)); // 最多3张
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    // 模拟录音
    setTimeout(() => {
      setIsRecording(false);
      alert('录音完成');
    }, 3000);
  };

  return (
    <Container>
      <Title>记录心情</Title>
      <Subtitle>今天感觉如何？</Subtitle>

      <InputTypeContainer>
        <InputTypeButton active={inputType === 'text'} onClick={() => handleInputTypeChange('text')}>
          文字
        </InputTypeButton>
        <InputTypeButton active={inputType === 'voice'} onClick={() => handleInputTypeChange('voice')}>
          语音
        </InputTypeButton>
        <InputTypeButton active={inputType === 'image'} onClick={() => handleInputTypeChange('image')}>
          照片
        </InputTypeButton>
      </InputTypeContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <InputContainer>
        {inputType === 'text' && (
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="请输入你的心情..."
          />
        )}

        {inputType === 'voice' && (
          <VoiceContainer>
            <VoiceButton onClick={handleStartRecording} disabled={isRecording}>
              {isRecording ? '录音中...' : '开始录音'}
            </VoiceButton>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>最长录音时间：3分钟</p>
          </VoiceContainer>
        )}

        {inputType === 'image' && (
          <>
            <ImageContainer>
              {imagePaths.map((path, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img src={path} alt={`上传图片 ${index + 1}`} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                  <button
                    onClick={() => setImagePaths(prev => prev.filter((_, i) => i !== index))}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      background: 'rgba(255, 255, 255, 0.8)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {imagePaths.length < 3 && (
                <ImageUploadButton htmlFor="image-upload">
                  <input id="image-upload" type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  上传照片
                </ImageUploadButton>
              )}
            </ImageContainer>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>最多上传3张照片</p>
          </>
        )}
      </InputContainer>

      <ButtonContainer>
        <Button onClick={handleAnalyze} disabled={loading}>
          {loading ? '分析中...' : '分析情绪'}
        </Button>
      </ButtonContainer>

      {loading && <Loading>AI正在分析你的情绪...</Loading>}

      {analysis && (
        <AnalysisContainer>
          <AnalysisTitle>AI分析结果</AnalysisTitle>
          <AnalysisItem>
            <AnalysisLabel>情绪倾向：</AnalysisLabel>
            <AnalysisValue>
              {analysis.sentiment === 'positive' ? '积极' : analysis.sentiment === 'negative' ? '消极' : '中性'}
            </AnalysisValue>
          </AnalysisItem>
          <AnalysisItem>
            <AnalysisLabel>情绪强度：</AnalysisLabel>
            <AnalysisValue>{analysis.intensity}/10</AnalysisValue>
          </AnalysisItem>
          <AnalysisItem>
            <AnalysisLabel>置信度：</AnalysisLabel>
            <AnalysisValue>{(analysis.confidence * 100).toFixed(0)}%</AnalysisValue>
          </AnalysisItem>
          <AnalysisItem>
            <AnalysisLabel>上下文：</AnalysisLabel>
            <AnalysisValue>{analysis.context}</AnalysisValue>
          </AnalysisItem>
          <KeywordsContainer>
            <AnalysisLabel>关键词：</AnalysisLabel>
            <div>
              {analysis.keywords.map((keyword, index) => (
                <KeywordTag key={index}>{keyword}</KeywordTag>
              ))}
            </div>
          </KeywordsContainer>
          <KeywordsContainer>
            <AnalysisLabel>情绪标签：</AnalysisLabel>
            <div>
              {analysis.emotionTags.map((tag, index) => (
                <KeywordTag key={index}>{tag}</KeywordTag>
              ))}
            </div>
          </KeywordsContainer>
          <ButtonContainer style={{ marginTop: '1.5rem' }}>
            <Button onClick={handleSave}>保存记录</Button>
          </ButtonContainer>
        </AnalysisContainer>
      )}
    </Container>
  );
};

export default RecordPage;