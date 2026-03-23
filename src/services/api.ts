import { supabase, transformUser, transformActivity, transformMessage, calculateDistance, type DbUser } from './supabase';
import { Activity, User, Message } from '../types';

// 获取当前用户 ID（从 localStorage 或 Taro storage）
const getCurrentUserId = (): string | null => {
  try {
    // 小程序环境
    if (typeof wx !== 'undefined' && wx.getStorageSync) {
      return wx.getStorageSync('user_id') || null;
    }
    // H5 环境
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('user_id');
    }
  } catch {
    // 静默处理
  }
  return null;
};

// 设置当前用户 ID
export const setCurrentUserId = (userId: string): void => {
  try {
    if (typeof wx !== 'undefined' && wx.setStorageSync) {
      wx.setStorageSync('user_id', userId);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('user_id', userId);
    }
  } catch {
    // 静默处理
  }
};

// 获取用户信息
const getUserById = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;
  return transformUser(data as DbUser);
};

// 获取多个用户信息
const getUsersByIds = async (userIds: string[]): Promise<Map<string, User>> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .in('id', userIds);

  if (error || !data) return new Map();

  const userMap = new Map<string, User>();
  (data as DbUser[]).forEach(dbUser => {
    userMap.set(dbUser.id, transformUser(dbUser));
  });

  return userMap;
};

// API 服务
export const api = {
  // 获取活动列表
  async getActivities(location?: { latitude: number; longitude: number }): Promise<Activity[]> {
    // 查询活跃且未过期的活动
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        creator:users!creator_id(*)
      `)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('获取活动列表失败:', error);
      return [];
    }

    if (!data || data.length === 0) return [];

    // 获取所有参与者
    const activityIds = data.map((a: any) => a.id);
    const { data: participantsData } = await supabase
      .from('activity_participants')
      .select(`
        activity_id,
        user:users(*)
      `)
      .in('activity_id', activityIds);

    // 构建参与者映射
    const participantsMap = new Map<string, User[]>();
    (participantsData || []).forEach((p: any) => {
      const user = transformUser(p.user as DbUser);
      const list = participantsMap.get(p.activity_id) || [];
      list.push(user);
      participantsMap.set(p.activity_id, list);
    });

    // 转换并计算距离
    const activities = data.map((a: any) => {
      const creator = transformUser(a.creator as DbUser);
      const participants = participantsMap.get(a.id) || [];
      const activity = transformActivity(a, creator, participants);

      // 计算距离
      if (location) {
        activity.distance = calculateDistance(
          location.latitude,
          location.longitude,
          a.latitude,
          a.longitude
        );
      }

      return activity;
    });

    // 过滤距离（如果提供了位置）
    if (location) {
      return activities.filter(a => (a.distance || 0) <= 5000);
    }

    return activities;
  },

  // 获取活动详情
  async getActivityById(id: string): Promise<Activity | null> {
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        creator:users!creator_id(*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;

    // 获取参与者
    const { data: participantsData } = await supabase
      .from('activity_participants')
      .select('user:users(*)')
      .eq('activity_id', id);

    const creator = transformUser(data.creator as DbUser);
    const participants = (participantsData || []).map((p: any) => transformUser(p.user as DbUser));

    return transformActivity(data, creator, participants);
  },

  // 创建活动
  async createActivity(data: Partial<Activity>): Promise<Activity> {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('请先登录');

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2小时后过期

    // 创建活动
    const { data: newActivity, error } = await supabase
      .from('activities')
      .insert({
        creator_id: userId,
        title: data.title || '',
        tags: data.tags || [],
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        address: data.address || '',
        max_people: data.maxPeople || 2,
        current_people: 1,
        status: 'active',
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error('创建活动失败: ' + error.message);

    // 创建者自动加入
    await supabase
      .from('activity_participants')
      .insert({
        activity_id: newActivity.id,
        user_id: userId,
      });

    const creator = await getUserById(userId);
    return transformActivity(newActivity, creator!, [creator!]);
  },

  // 加入活动
  async joinActivity(activityId: string): Promise<Activity> {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('请先登录');

    // 检查是否已满
    const { data: activity } = await supabase
      .from('activities')
      .select('*')
      .eq('id', activityId)
      .single();

    if (!activity) throw new Error('活动不存在');
    if (activity.current_people >= activity.max_people) throw new Error('名额已满');

    // 检查是否已加入
    const { data: existing } = await supabase
      .from('activity_participants')
      .select('*')
      .eq('activity_id', activityId)
      .eq('user_id', userId)
      .single();

    if (existing) throw new Error('您已加入该活动');

    // 加入活动
    const { error } = await supabase
      .from('activity_participants')
      .insert({
        activity_id: activityId,
        user_id: userId,
      });

    if (error) throw new Error('加入活动失败');

    // 添加系统消息
    const user = await getUserById(userId);
    await supabase.from('messages').insert({
      activity_id: activityId,
      sender_id: userId,
      type: 'system',
      content: `${user?.nickname || '有人'}加入了活动`,
    });

    return (await this.getActivityById(activityId))!;
  },

  // 退出活动
  async leaveActivity(activityId: string): Promise<void> {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('请先登录');

    const { error } = await supabase
      .from('activity_participants')
      .delete()
      .eq('activity_id', activityId)
      .eq('user_id', userId);

    if (error) throw new Error('退出活动失败');

    // 添加系统消息
    const user = await getUserById(userId);
    await supabase.from('messages').insert({
      activity_id: activityId,
      sender_id: userId,
      type: 'system',
      content: `${user?.nickname || '有人'}退出了活动`,
    });
  },

  // 获取消息
  async getMessages(activityId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!sender_id(*)
      `)
      .eq('activity_id', activityId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('获取消息失败:', error);
      return [];
    }

    return (data || []).map((m: any) => transformMessage(m, transformUser(m.sender as DbUser)));
  },

  // 发送消息
  async sendMessage(
    activityId: string,
    content: string,
    type: 'text' | 'location' = 'text'
  ): Promise<Message> {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('请先登录');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        activity_id: activityId,
        sender_id: userId,
        type,
        content,
      })
      .select(`
        *,
        sender:users!sender_id(*)
      `)
      .single();

    if (error) throw new Error('发送消息失败');

    return transformMessage(data, transformUser(data.sender as DbUser));
  },

  // 获取用户信息
  async getUserInfo(): Promise<User | null> {
    const userId = getCurrentUserId();
    if (!userId) return null;

    return getUserById(userId);
  },

  // 更新用户信息
  async updateUserInfo(data: Partial<User>): Promise<User> {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('请先登录');

    const updates: any = {};
    if (data.nickname !== undefined) updates.nickname = data.nickname;
    if (data.avatar !== undefined) updates.avatar = data.avatar;
    if (data.gender !== undefined) updates.gender = data.gender;
    if (data.tags !== undefined) updates.tags = data.tags;

    const { data: updated, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error('更新用户信息失败');

    return transformUser(updated as DbUser);
  },

  // 获取用户参与的活动
  async getUserActivities(userId: string): Promise<{ created: Activity[]; joined: Activity[] }> {
    // 获取创建的活动
    const { data: createdData } = await supabase
      .from('activities')
      .select(`
        *,
        creator:users!creator_id(*)
      `)
      .eq('creator_id', userId)
      .order('created_at', { ascending: false });

    // 获取参与的活动
    const { data: joinedData } = await supabase
      .from('activity_participants')
      .select(`
        activity:activities!activity_id(
          *,
          creator:users!creator_id(*)
        )
      `)
      .eq('user_id', userId);

    const created = (createdData || []).map((a: any) =>
      transformActivity(a, transformUser(a.creator as DbUser))
    );

    const joined = (joinedData || [])
      .filter((p: any) => p.activity && p.activity.creator_id !== userId)
      .map((p: any) =>
        transformActivity(p.activity, transformUser(p.activity.creator as DbUser))
      );

    return { created, joined };
  },

  // 创建用户（首次登录时调用）
  async createUser(userData: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert({
        nickname: userData.nickname || '新用户',
        avatar: userData.avatar || '',
        gender: userData.gender || 'unknown',
        tags: userData.tags || [],
        credit_score: 100,
      })
      .select()
      .single();

    if (error) throw new Error('创建用户失败');

    const user = transformUser(data as DbUser);
    setCurrentUserId(user.id);
    return user;
  },

  // 检查并获取/创建用户
  async ensureUser(): Promise<User | null> {
    let userId = getCurrentUserId();

    if (!userId) {
      // 创建新用户
      const user = await this.createUser({
        nickname: '用户' + Math.random().toString(36).substr(2, 6),
      });
      return user;
    }

    const user = await getUserById(userId);
    if (!user) {
      // 用户不存在，重新创建
      const newUser = await this.createUser({});
      return newUser;
    }

    return user;
  },
};

export default api;
