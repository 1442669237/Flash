import { createClient } from '@supabase/supabase-js';
import { Activity, User, Message } from '../types';

// Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 创建客户端实例
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 类型扩展 - Supabase 返回的数据类型
export interface DbUser {
  id: string;
  nickname: string;
  avatar: string;
  gender: 'male' | 'female' | 'unknown';
  tags: string[];
  credit_score: number;
  created_at: string;
  updated_at: string;
}

export interface DbActivity {
  id: string;
  creator_id: string;
  title: string;
  tags: string[];
  latitude: number;
  longitude: number;
  address: string;
  max_people: number;
  current_people: number;
  status: 'active' | 'full' | 'expired' | 'cancelled';
  created_at: string;
  expires_at: string;
}

export interface DbParticipant {
  id: string;
  activity_id: string;
  user_id: string;
  joined_at: string;
}

export interface DbMessage {
  id: string;
  activity_id: string;
  sender_id: string;
  type: 'text' | 'location' | 'system' | 'image';
  content: string;
  created_at: string;
}

// 转换函数 - 数据库模型转应用模型
export const transformUser = (dbUser: DbUser): User => ({
  id: dbUser.id,
  nickname: dbUser.nickname,
  avatar: dbUser.avatar,
  gender: dbUser.gender,
  tags: dbUser.tags || [],
  creditScore: dbUser.credit_score,
  createdAt: new Date(dbUser.created_at).getTime(),
});

export const transformActivity = (
  dbActivity: DbActivity,
  creator: User,
  participants: User[] = []
): Activity => ({
  id: dbActivity.id,
  creatorId: dbActivity.creator_id,
  creator,
  title: dbActivity.title,
  tags: dbActivity.tags,
  latitude: dbActivity.latitude,
  longitude: dbActivity.longitude,
  address: dbActivity.address,
  maxPeople: dbActivity.max_people,
  currentPeople: dbActivity.current_people,
  participants,
  status: dbActivity.status,
  createdAt: new Date(dbActivity.created_at).getTime(),
  expiresAt: new Date(dbActivity.expires_at).getTime(),
});

export const transformMessage = (
  dbMessage: DbMessage,
  sender?: User
): Message => ({
  id: dbMessage.id,
  activityId: dbMessage.activity_id,
  senderId: dbMessage.sender_id,
  sender: sender,
  type: dbMessage.type as Message['type'],
  content: dbMessage.content,
  createdAt: new Date(dbMessage.created_at).getTime(),
});

// 辅助函数：计算距离 (米)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // 地球半径（米）
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// 辅助函数：生成随机 ID
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export default supabase;
