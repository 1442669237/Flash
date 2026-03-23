# 闪现 - 线下即时社交组队小程序

## 1. Concept & Vision

**产品定位**：一款主打"即时性"和"低预期"的线下社交组队工具，让用户能在2小时内发起/加入附近5km的碎片化社交活动。

**核心理念**：打破线上社交的疲惫感，通过极短的时间窗口和地理限制，让"闪现"成为一种轻松、无负担的线下连接方式。

**视觉风格**：年轻活力、简洁明快，带有一丝紧迫感但不失趣味性。采用渐变色彩和动效营造"限时"、"即时"的氛围。

## 2. Design Language

### 2.1 Aesthetic Direction
- **风格参考**：介于 Tinder 的简约和即刻的活力感之间
- **关键词**：年轻、即时、轻松、真实

### 2.2 Color Palette
```
Primary:      #FF6B6B (珊瑚红 - 代表热情与即时)
Secondary:    #4ECDC4 (薄荷绿 - 代表活力与新鲜)
Accent:       #FFE66D (阳光黄 - 代表快乐与期待)
Background:   #F8F9FA (浅灰白 - 清爽底色)
Surface:      #FFFFFF (纯白卡片)
Text Primary: #2D3436 (深灰 - 主要文字)
Text Secondary: #636E72 (中灰 - 次要文字)
Danger:       #FF4757 (警告/放鸽子)
Success:      #2ED573 (成功加入)
Gradient:     linear-gradient(135deg, #FF6B6B, #FF8E53) (主按钮渐变)
```

### 2.3 Typography
```
字体家族：-apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif

字号层级：
- 大标题：36rpx / 700
- 副标题：30rpx / 600
- 正文：28rpx / 400
- 辅助文字：24rpx / 400
- 标签文字：20rpx / 500
```

### 2.4 Spacing System
```
基础单位：8rpx
间距规范：
- xs: 8rpx
- sm: 16rpx
- md: 24rpx
- lg: 32rpx
- xl: 48rpx
- xxl: 64rpx
```

### 2.5 Motion Philosophy
- **倒计时动效**：卡片渐入、脉冲效果表示紧迫
- **页面切换**：slide-in/slide-out, 300ms ease-out
- **按钮反馈**：scale(0.95) on press, 150ms
- **地图标记**：轻微弹跳动画吸引注意力
- **成功反馈**：check icon + 绿色光晕扩散

## 3. Layout & Structure

### 3.1 页面架构
```
├── 首页 (Home) - 流量分发核心
│   ├── 地图模式 / 列表模式切换
│   ├── 定位状态栏
│   └── 悬浮发布按钮 (+)
├── 发布页 (Publish) - 轻量发布流程
├── 活动详情页 (Event Detail)
├── 聊天室 (Chat Room) - 成局后专属
└── 个人中心 (Profile)
```

### 3.2 导航结构
- **底部 Tab Bar**：首页、发布、消息(聊天室入口)、我的
- **顶部导航**：简洁标题 + 右侧操作按钮

### 3.3 响应策略
- 适配不同手机屏幕高度
- 卡片列表支持下拉刷新、上拉加载更多
- 地图模式全屏展示，浮动操作按钮

## 4. Features & Interactions

### 4.1 首页 - 附近闪现

**核心功能**：
1. **双模式切换**
   - 地图模式：显示用户位置 + 周围活动标记点，点击标记弹出预览卡片
   - 列表模式：按距离/倒计时排序的活动卡片流

2. **定位处理**
   - 首次进入：静默定位，失败时弹窗引导开启权限
   - 手动刷新按钮重新拉取5km内数据

3. **活动卡片展示**
   - 发起人头像 + 性别标识
   - 活动标签（喝咖啡/散步/干饭等）
   - 距离（m/km）+ 倒计时（hh:mm:ss格式）
   - 已参与人数/目标人数
   - 底部标签显示活动类型

4. **快速发布入口**
   - 右下角悬浮 + 按钮，渐变背景色
   - 点击进入发布流程

**交互细节**：
- 下拉刷新数据
- 列表支持左滑快捷操作（收藏/举报）
- 地图标记点击弹出迷你预览卡片

### 4.2 发布页 - 发起闪现

**核心功能**：
1. **目的选择**
   - 预设快捷标签：喝咖啡 ☕️ | 散步 🚶 | 干饭 🍜 | 看展 🏛️ | 闲聊 💬
   - 支持自定义简短描述（限20字）

2. **时间设定**
   - 默认从当前时刻生效，2小时后自动结束
   - 显示倒计时预览

3. **地点设定**
   - 默认当前位置
   - 支持地图选点微调
   - 展示具体地址

4. **人数限制**
   - 步进器选择：2-4人
   - 默认2人（最低成局门槛）

5. **发布校验**
   - 检查登录状态
   - 检查定位权限
   - 限制每人同时只能发起一个进行中活动

**交互细节**：
- 底部固定发布按钮
- 发布成功动画 + 自动跳转

### 4.3 活动详情页

**核心功能**：
1. **动态倒计时**
   - 顶部醒目倒计时显示
   - 超时前10分钟变红提醒

2. **地图导航**
   - 展示活动位置地图
   - 点击拉起第三方地图导航

3. **参与者列表**
   - 已加入用户头像展示
   - 点击查看简单主页

4. **操作按钮**
   - 进行中未加入：显示"立即加入"
   - 已满员：显示"名额已满"
   - 已加入：显示"进入聊天室"
   - 发起人视角：显示"邀请好友" + "取消活动"

5. **安全提示**
   - 底部固定安全提醒banner
   - 首次加入弹窗确认

**交互细节**：
- 加入前二次确认弹窗
- 人数变动实时刷新

### 4.4 实时聊天室

**核心功能**：
1. **即时通讯**
   - 文本消息发送
   - 快捷表情选择
   - 发送位置功能

2. **会话管理**
   - 发起人可解散聊天室
   - 参与者可退出（释放名额）

3. **活动结束处理**
   - 2小时倒计时结束自动关闭
   - 可选择评价/举报

**交互细节**：
- 消息发送后自动滚动到底部
- 新消息提示音效（可关闭）
- 输入框自适应键盘高度

### 4.5 个人中心

**核心功能**：
1. **个人资料**
   - 头像上传/更换
   - 昵称编辑
   - 个性标签（MBTI/兴趣标签，最多3个）

2. **我的闪现**
   - 进行中：我发起和加入的活动
   - 已结束：历史记录

3. **信誉分体系**
   - 当前信誉分展示
   - 信誉分明细（加分/扣分记录）
   - 低信誉分用户限制功能

**交互细节**：
- 设置页面可编辑所有个人信息
- 退出登录/账号切换

## 5. Component Inventory

### 5.1 通用组件

| 组件 | 描述 | 状态 |
|------|------|------|
| ActivityCard | 活动卡片 | default/hover/expired/full |
| UserAvatar | 用户头像 | normal/large/small with gender badge |
| CountdownTimer | 倒计时 | normal/urgent(<10min)/expired |
| TagChip | 标签组件 | primary/secondary/custom |
| ActionButton | 主操作按钮 | default/loading/disabled |
| BottomSheet | 底部弹窗 | - |
| EmptyState | 空状态 | different contexts |
| MapMarker | 地图标记 | active/inactive/selected |

### 5.2 业务组件

| 组件 | 描述 |
|------|------|
| LocationPicker | 地图选点组件 |
| PeopleStepper | 人数步进器 |
| ChatBubble | 聊天气泡 |
| ParticipantList | 参与者列表 |
| CreditScoreCard | 信誉分卡片 |
| SafetyBanner | 安全提示条 |

## 6. Technical Approach

### 6.1 技术选型
- **框架**：Taro 3.x (React) - 支持多端小程序
- **状态管理**：Zustand
- **路由**：Taro Router
- **地图**：腾讯地图小程序SDK
- **后端模拟**：本地Mock数据 + 云开发

### 6.2 项目结构
```
src/
├── app.tsx              # 应用入口
├── app.config.ts       # 应用配置
├── pages/               # 页面目录
│   ├── index/           # 首页
│   ├── publish/         # 发布页
│   ├── event-detail/    # 活动详情
│   ├── chat/            # 聊天室
│   └── profile/         # 个人中心
├── components/          # 组件库
├── store/               # 状态管理
├── services/            # API服务
├── utils/               # 工具函数
├── constants/           # 常量定义
└── types/               # TypeScript类型
```

### 6.3 数据模型

**User**
```typescript
interface User {
  id: string;
  nickname: string;
  avatar: string;
  gender: 'male' | 'female' | 'unknown';
  tags: string[];           // 个性标签
  creditScore: number;      // 信誉分 0-100
  createdAt: number;
}
```

**Activity**
```typescript
interface Activity {
  id: string;
  creatorId: string;
  creator: User;
  title: string;           // 活动标题/目的
  tags: string[];          // 标签分类
  latitude: number;
  longitude: number;
  address: string;
  maxPeople: number;       // 最大人数
  currentPeople: number;    // 当前人数
  participants: User[];
  status: 'active' | 'full' | 'ended' | 'cancelled';
  createdAt: number;
  expiresAt: number;        // 2小时后
  distance?: number;        // 客户端计算的距离
}
```

**Message**
```typescript
interface Message {
  id: string;
  activityId: string;
  senderId: string;
  sender: User;
  type: 'text' | 'location' | 'system';
  content: string;
  createdAt: number;
}
```

### 6.4 全局规则
1. **倒计时生命周期**：所有活动创建后 expiresAt = createdAt + 2小时
2. **LBS限制**：首页仅展示直线距离 < 5km 的活动
3. **成局条件**：currentPeople === maxPeople 或 creator手动确认
4. **信誉分机制**：放鸽子举报核实后扣分，过低禁止发布/加入

## 7. 页面路由

| 页面 | 路径 | 参数 |
|------|------|------|
| 首页 | /pages/index/index | - |
| 发布 | /pages/publish/index | - |
| 活动详情 | /pages/event-detail/index | id |
| 聊天室 | /pages/chat/index | activityId |
| 个人中心 | /pages/profile/index | - |
