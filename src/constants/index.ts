// 主题颜色
export const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  accent: '#FFE66D',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  textPrimary: '#2D3436',
  textSecondary: '#636E72',
  danger: '#FF4757',
  success: '#2ED573',
  border: '#E9ECEF',
  gradientStart: '#FF6B6B',
  gradientEnd: '#FF8E53',
} as const;

// 字体大小
export const FONT_SIZES = {
  xs: '20rpx',
  sm: '24rpx',
  md: '28rpx',
  lg: '30rpx',
  xl: '36rpx',
} as const;

// 间距
export const SPACING = {
  xs: '8rpx',
  sm: '16rpx',
  md: '24rpx',
  lg: '32rpx',
  xl: '48rpx',
  xxl: '64rpx',
} as const;

// 活动预设标签
export const ACTIVITY_TAGS = [
  { label: '喝咖啡', emoji: '☕️' },
  { label: '散步', emoji: '🚶' },
  { label: '干饭', emoji: '🍜' },
  { label: '看展', emoji: '🏛️' },
  { label: '闲聊', emoji: '💬' },
] as const;

// LBS 限制
export const LBS_CONFIG = {
  maxDistance: 5000, // 5km
  defaultLatitude: 31.230416,
  defaultLongitude: 121.473701,
} as const;

// 活动生命周期
export const ACTIVITY_CONFIG = {
  duration: 2 * 60 * 60 * 1000, // 2小时
  urgentThreshold: 10 * 60 * 1000, // 10分钟
} as const;

// 信誉分
export const CREDIT_CONFIG = {
  max: 100,
  min: 0,
  normal: 80,
  low: 60,
  critical: 40,
} as const;

// 用户个性标签
export const USER_TAGS = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
  '社恐', '社牛', '早起', '夜猫',
  '吃货', '运动', '音乐', '电影',
] as const;
