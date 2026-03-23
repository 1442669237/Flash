# 闪现 - 线下即时社交组队小程序

> 基于 Taro + React + TypeScript + Supabase 构建的微信小程序

## 环境变量配置

在 Vercel 项目 Settings → Environment Variables 中配置：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | `eyJhbGci...` |
| `NEXT_PUBLIC_AMAP_KEY` | 高德地图 Web API Key | `your_key` |
| `NEXT_PUBLIC_RONGLIANG_APP_KEY` | 融云 IM App Key | `your_key` |

## Supabase 初始化

### 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 进入项目 → Settings → API
4. 复制 `Project URL` 和 `anon public` key

### 2. 创建数据库表

在 Supabase 后台 SQL Editor 中执行 `supabase/schema.sql` 文件内容。

或者手动创建：

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR(50) NOT NULL DEFAULT '匿名用户',
  avatar TEXT DEFAULT '',
  gender VARCHAR(20) DEFAULT 'unknown',
  tags TEXT[] DEFAULT '{}',
  credit_score INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 活动表
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  max_people INTEGER NOT NULL DEFAULT 2,
  current_people INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- 活动参与者表
CREATE TABLE activity_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id),
  user_id UUID NOT NULL REFERENCES users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(activity_id, user_id)
);

-- 消息表
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID NOT NULL REFERENCES activities(id),
  sender_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(20) DEFAULT 'text',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. 启用 RLS 策略

```sql
-- 启用 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取
CREATE POLICY "允许读取" ON users FOR SELECT USING (true);
CREATE POLICY "允许读取" ON activities FOR SELECT USING (true);
CREATE POLICY "允许读取" ON activity_participants FOR SELECT USING (true);
CREATE POLICY "允许读取" ON messages FOR SELECT USING (true);

-- 允许已登录用户写入
CREATE POLICY "允许创建" ON activities FOR INSERT WITH CHECK (true);
CREATE POLICY "允许创建" ON activity_participants FOR INSERT WITH CHECK (true);
CREATE POLICY "允许创建" ON messages FOR INSERT WITH CHECK (true);
```

## 本地开发

```bash
# 安装依赖
npm install

# 微信小程序开发
npm run dev:weapp

# H5 开发
npm run dev:h5
```

### 本地环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 构建

```bash
# 构建微信小程序
npm run build:weapp

# 构建 H5
npm run build:h5
```

## 项目结构

```
src/
├── components/     # 组件
│   ├── business/    # 业务组件
│   └── common/      # 通用组件
├── constants/       # 常量
├── pages/           # 页面
│   ├── index/       # 首页
│   ├── publish/     # 发布页
│   ├── event-detail/# 活动详情
│   ├── chat/        # 聊天室
│   └── profile/     # 个人中心
├── services/        # 服务层
│   ├── supabase.ts  # Supabase 客户端
│   ├── api.ts       # API 服务
│   └── mockData.ts  # Mock 数据（开发用）
├── store/           # 状态管理
├── styles/          # 样式
├── types/           # TypeScript 类型
└── utils/           # 工具函数

supabase/
└── schema.sql      # 数据库表结构
```
