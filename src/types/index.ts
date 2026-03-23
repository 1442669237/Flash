// 用户类型
export interface User {
  id: string;
  nickname: string;
  avatar: string;
  gender: 'male' | 'female' | 'unknown';
  tags: string[];
  creditScore: number;
  createdAt: number;
}

// 活动类型
export interface Activity {
  id: string;
  creatorId: string;
  creator: User;
  title: string;
  tags: string[];
  latitude: number;
  longitude: number;
  address: string;
  maxPeople: number;
  currentPeople: number;
  participants: User[];
  status: 'active' | 'full' | 'ended' | 'cancelled';
  createdAt: number;
  expiresAt: number;
  distance?: number;
}

// 消息类型
export interface Message {
  id: string;
  activityId: string;
  senderId: string;
  sender: User;
  type: 'text' | 'location' | 'system';
  content: string;
  createdAt: number;
}

// 位置类型
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

// 活动标签
export type ActivityTag = '喝咖啡' | '散步' | '干饭' | '看展' | '闲聊' | '自定义';

// 发布表单数据
export interface PublishFormData {
  title: string;
  customTitle?: string;
  tags: string[];
  latitude: number;
  longitude: number;
  address: string;
  maxPeople: number;
}
