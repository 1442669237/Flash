# 闪现 - 线下即时社交组队小程序

> 基于 Taro + React + TypeScript 构建的微信小程序

## 环境变量配置

在部署到 Vercel 前，需要在 Vercel 项目设置中配置以下环境变量：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `NEXT_PUBLIC_API_BASE` | API 基础地址 | `https://api.example.com` |
| `NEXT_PUBLIC_APP_ENV` | 应用环境 | `production` |
| `NEXT_PUBLIC_USE_MOCK` | 是否使用 Mock 数据 | `false` |
| `NEXT_PUBLIC_AMAP_KEY` | 高德地图 Web API Key | `your_key` |
| `NEXT_PUBLIC_RONGLIANG_APP_KEY` | 融云 IM App Key | `your_key` |

## 本地开发

```bash
# 安装依赖
npm install

# 微信小程序开发
npm run dev:weapp

# H5 开发
npm run dev:h5
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
├── store/           # 状态管理
├── styles/          # 样式
├── types/           # TypeScript 类型
└── utils/           # 工具函数
```
