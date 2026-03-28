# 心情日记 (Mood Daily)

一个智能、极简的情绪监测助手，通过AI自动分析用户的情绪状态，帮助用户了解自己的情绪变化，及时发现潜在的心理健康问题。

## ✨ 核心功能

### 🎯 智能情绪分析
- **多模态输入**：支持文字、语音、照片三种方式记录情绪
- **AI自动分析**：无需手动选择情绪类型，AI自动识别情绪状态
- **情绪评估**：分析情绪倾向（积极/消极/中性）和强度（1-10）
- **关键词提取**：自动提取情绪相关关键词和标签

### 📊 情绪趋势分析
- **历史记录**：按时间查看情绪记录
- **趋势图表**：展示情绪变化趋势
- **统计分析**：情绪分布、关键词统计
- **模式识别**：发现情绪规律和触发因素

### ⚠️ 智能预警
- **持续监测**：分析长期情绪趋势
- **预警级别**：轻度、中度、重度预警
- **及时提醒**：发现负面情绪模式时主动提醒
- **专业建议**：提供心理健康资源和建议

### 👥 双端设计
- **用户端**：极简界面，轻松记录情绪
- **管理端**：分析师视角，监测多用户情绪状态
- **远程监测**：适合监测长期在外人员的情绪
- **打卡提醒**：确保用户持续记录

## 🛠️ 技术栈

### 前端
- **框架**：React 18 + TypeScript
- **状态管理**：Zustand（轻量级）
- **UI组件**：Ant Design + 自定义组件
- **样式**：Tailwind CSS + styled-components
- **构建工具**：Vite
- **图表库**：ECharts

### 后端
- **运行时**：Node.js 18+
- **数据库**：SQLite 3.x（better-sqlite3）
- **ORM**：Prisma
- **加密**：crypto-js（AES-256）
- **文件系统**：fs-extra

### AI/ML
- **文本分析**：基于TensorFlow.js的简化BERT模型
- **语音分析**：Web Speech API + 情绪识别
- **图像分析**：face-api.js（面部表情识别）
- **多模态融合**：综合分析结果

### 跨平台
- **框架**：Electron
- **打包**：electron-builder
- **自动更新**：electron-updater
- **支持平台**：Windows、macOS、Linux

## 📦 安装方法

### 从源码安装

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-repo/mood-daily-demo.git
   cd mood-daily`
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **开发模式运行**
   ```bash
   # 启动开发服务器
   npm run dev
   
   # 启动Electron应用（在另一个终端）
   npm run electron:dev
   ```

4. **构建应用**
   ```bash
   # 构建Web版本
   npm run build
   
   # 构建Electron应用
   npm run electron:build
   ```

### 直接下载

前往[发布页面](https://github.com/your-repo/mood-daily/releases)下载对应平台的安装包。

## 🚀 使用说明

### 用户端

1. **启动应用**：打开心情日记应用
2. **记录情绪**：选择文字、语音或照片方式记录
3. **查看分析**：AI会自动分析情绪状态
4. **保存记录**：点击保存按钮保存记录
5. **查看历史**：点击历史按钮查看过往记录
6. **接收建议**：查看系统提供的健康建议

### 管理端

1. **登录系统**：使用分析师账号登录
2. **查看概览**：了解系统整体状态和预警信息
3. **管理用户**：查看和管理多个用户
4. **处理预警**：查看和处理用户情绪预警
5. **发送消息**：向用户发送提醒和关怀消息
6. **查看分析**：查看用户的情绪趋势和统计数据

## 📁 项目结构

```
mood-daily/
├── public/            # 静态资源
├── src/
│   ├── components/    # React组件
│   │   ├── UserApp/   # 用户端组件
│   │   ├── AdminApp/  # 管理端组件
│   │   └── common/    # 通用组件
│   ├── services/      # 服务层
│   │   ├── aiAnalysisService.ts    # AI分析服务
│   │   ├── alertService.ts         # 预警服务
│   │   ├── recordService.ts        # 记录服务
│   │   └── userService.ts          # 用户服务
│   ├── types/         # TypeScript类型定义
│   ├── utils/         # 工具函数
│   │   ├── database.ts     # 数据库操作
│   │   └── aiModels.ts     # AI模型
│   ├── App.tsx        # 应用入口
│   └── main.tsx       # React入口
├── main.js           # Electron主进程
├── preload.js        # Electron预加载
├── package.json      # 项目配置
└── README.md         # 项目说明
```

## 🔧 配置说明

### 环境变量

创建 `.env` 文件配置以下环境变量：

```env
# 数据库配置
DATABASE_URL="./data/mood-daily.db"

# 应用配置
APP_NAME="Mood Daily"
APP_VERSION="1.0.0"

# 预警配置
ALERT_MILD_DAYS=3
ALERT_MODERATE_DAYS=7
ALERT_SEVERE_DAYS=14
```

### 数据库初始化

首次运行时，系统会自动创建数据库和表结构。

## 🤝 贡献指南

1. **Fork 仓库**
2. **创建分支**：`git checkout -b feature/your-feature`
3. **提交更改**：`git commit -m 'Add your feature'`
4. **推送分支**：`git push origin feature/your-feature`
5. **创建 PR**：在 GitHub 上创建 Pull Request

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 📞 联系方式

- **项目主页**：[https://github.com/your-repo/mood-daily](https://github.com/your-repo/mood-daily)
- **问题反馈**：[https://github.com/your-repo/mood-daily/issues](https://github.com/your-repo/mood-daily/issues)
- **邮箱**：contact@mood-daily.com

---

**心情日记** - 守护你的心理健康，连接爱的桥梁 ❤️