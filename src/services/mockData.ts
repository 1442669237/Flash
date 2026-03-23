/**
 * @deprecated 此文件已弃用，请使用 src/services/api.ts 替代
 * Mock 数据仅用于本地开发无网络环境
 */
import { Activity, User, Message } from '../types';
import { generateId as utilGenerateId } from '../utils';

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: 'user_1',
    nickname: '小明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    gender: 'male',
    tags: ['INTP', '咖啡爱好者', '夜猫'],
    creditScore: 95,
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'user_2',
    nickname: '小红',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
    gender: 'female',
    tags: ['ENFP', '社交达人', '吃货'],
    creditScore: 88,
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: 'user_3',
    nickname: '阿杰',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
    gender: 'male',
    tags: ['ISTJ', '运动', '早起'],
    creditScore: 100,
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: 'user_4',
    nickname: '小雪',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4',
    gender: 'female',
    tags: ['INFJ', '音乐', '电影'],
    creditScore: 92,
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'user_5',
    nickname: '老王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user5',
    gender: 'male',
    tags: ['ESFP', '社牛', '旅行'],
    creditScore: 85,
    createdAt: Date.now() - 86400000 * 5,
  },
];

// 当前登录用户
export const currentUser: User = {
  id: 'current_user',
  nickname: '我',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=currentUser',
  gender: 'male',
  tags: ['INTJ', '科技', '阅读'],
  creditScore: 90,
  createdAt: Date.now() - 86400000 * 7,
};

// 生成模拟活动
const generateMockActivities = (): Activity[] => {
  const now = Date.now();
  const activities: Activity[] = [
    {
      id: 'act_1',
      creatorId: 'user_2',
      creator: mockUsers[1],
      title: '星巴克拼单',
      tags: ['喝咖啡'],
      latitude: 31.232416,
      longitude: 121.475701,
      address: '上海市静安区南京西路1788号',
      maxPeople: 3,
      currentPeople: 2,
      participants: [mockUsers[1], mockUsers[0]],
      status: 'active',
      createdAt: now - 3600000,
      expiresAt: now + 3600000,
      distance: 850,
    },
    {
      id: 'act_2',
      creatorId: 'user_3',
      creator: mockUsers[2],
      title: '滨江夜跑',
      tags: ['散步'],
      latitude: 31.228416,
      longitude: 121.478701,
      address: '上海市黄浦区外滩',
      maxPeople: 4,
      currentPeople: 1,
      participants: [mockUsers[2]],
      status: 'active',
      createdAt: now - 1800000,
      expiresAt: now + 5400000,
      distance: 1200,
    },
    {
      id: 'act_3',
      creatorId: 'user_4',
      creator: mockUsers[3],
      title: '周末火锅约',
      tags: ['干饭'],
      latitude: 31.235416,
      longitude: 121.470701,
      address: '上海市徐汇区淮海中路999号',
      maxPeople: 4,
      currentPeople: 3,
      participants: [mockUsers[3], mockUsers[1], mockUsers[4]],
      status: 'active',
      createdAt: now - 7200000,
      expiresAt: now + 1800000,
      distance: 2100,
    },
    {
      id: 'act_4',
      creatorId: 'user_1',
      creator: mockUsers[0],
      title: '当代艺术博物馆看展',
      tags: ['看展'],
      latitude: 31.225416,
      longitude: 121.480701,
      address: '上海市黄浦区花园港路200号',
      maxPeople: 2,
      currentPeople: 1,
      participants: [mockUsers[0]],
      status: 'active',
      createdAt: now - 5400000,
      expiresAt: now + 1800000,
      distance: 3200,
    },
    {
      id: 'act_5',
      creatorId: 'user_5',
      creator: mockUsers[4],
      title: '随便聊聊',
      tags: ['闲聊'],
      latitude: 31.240416,
      longitude: 121.465701,
      address: '上海市长宁区愚园路',
      maxPeople: 3,
      currentPeople: 2,
      participants: [mockUsers[4], mockUsers[3]],
      status: 'active',
      createdAt: now - 2700000,
      expiresAt: now + 4500000,
      distance: 4100,
    },
  ];
  return activities;
};

export const mockActivities = generateMockActivities();

// 生成模拟消息
export const generateMockMessages = (activityId: string): Message[] => {
  const now = Date.now();
  return [
    {
      id: 'msg_1',
      activityId,
      senderId: 'user_2',
      sender: mockUsers[1],
      type: 'system',
      content: '聊天室已创建',
      createdAt: now - 3600000,
    },
    {
      id: 'msg_2',
      activityId,
      senderId: 'user_2',
      sender: mockUsers[1],
      type: 'text',
      content: '大家好！我在星巴克门口等你们~',
      createdAt: now - 3500000,
    },
    {
      id: 'msg_3',
      activityId,
      senderId: 'user_1',
      sender: mockUsers[0],
      type: 'text',
      content: '好的，马上到！还有5分钟',
      createdAt: now - 3400000,
    },
    {
      id: 'msg_4',
      activityId,
      senderId: 'user_2',
      sender: mockUsers[1],
      type: 'location',
      content: '我的位置：星巴克上海商城店门口',
      createdAt: now - 3300000,
    },
  ];
};

// 模拟 API 延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API 服务（已弃用）
export const mockApi = {
  async getActivities(location?: { latitude: number; longitude: number }): Promise<Activity[]> {
    await delay(500);
    return mockActivities.filter(activity => {
      if (activity.status !== 'active') return false;
      if (location && activity.distance !== undefined && activity.distance > 5000) {
        return false;
      }
      return true;
    });
  },

  async getActivityById(id: string): Promise<Activity | null> {
    await delay(300);
    return mockActivities.find(a => a.id === id) || null;
  },

  async createActivity(data: Partial<Activity>): Promise<Activity> {
    await delay(500);
    const newActivity: Activity = {
      id: utilGenerateId(),
      creatorId: currentUser.id,
      creator: currentUser,
      title: data.title || '',
      tags: data.tags || [],
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      address: data.address || '',
      maxPeople: data.maxPeople || 2,
      currentPeople: 1,
      participants: [currentUser],
      status: 'active',
      createdAt: Date.now(),
      expiresAt: Date.now() + 2 * 60 * 60 * 1000,
    };
    mockActivities.unshift(newActivity);
    return newActivity;
  },

  async joinActivity(activityId: string): Promise<Activity> {
    await delay(300);
    const activity = mockActivities.find(a => a.id === activityId);
    if (!activity) throw new Error('活动不存在');
    if (activity.currentPeople >= activity.maxPeople) throw new Error('名额已满');
    if (activity.participants.some(p => p.id === currentUser.id)) {
      throw new Error('您已加入该活动');
    }
    activity.participants.push(currentUser);
    activity.currentPeople++;
    if (activity.currentPeople >= activity.maxPeople) {
      activity.status = 'full';
    }
    return activity;
  },

  async leaveActivity(activityId: string): Promise<void> {
    await delay(300);
    const activity = mockActivities.find(a => a.id === activityId);
    if (!activity) throw new Error('活动不存在');
    activity.participants = activity.participants.filter(p => p.id !== currentUser.id);
    activity.currentPeople--;
    if (activity.status === 'full') {
      activity.status = 'active';
    }
  },

  async getMessages(activityId: string): Promise<Message[]> {
    await delay(300);
    return generateMockMessages(activityId);
  },

  async sendMessage(activityId: string, content: string, type: 'text' | 'location' = 'text'): Promise<Message> {
    await delay(200);
    const message: Message = {
      id: utilGenerateId(),
      activityId,
      senderId: currentUser.id,
      sender: currentUser,
      type,
      content,
      createdAt: Date.now(),
    };
    return message;
  },

  async getUserInfo(): Promise<User> {
    await delay(200);
    return currentUser;
  },

  async updateUserInfo(data: Partial<User>): Promise<User> {
    await delay(300);
    Object.assign(currentUser, data);
    return currentUser;
  },

  async getUserActivities(userId: string): Promise<{ created: Activity[]; joined: Activity[] }> {
    await delay(400);
    const created = mockActivities.filter(a => a.creatorId === userId);
    const joined = mockActivities.filter(a =>
      a.participants.some(p => p.id === userId) && a.creatorId !== userId
    );
    return { created, joined };
  },
};
