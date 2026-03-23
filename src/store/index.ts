import { create } from 'zustand';
import { Activity, User, Message, Location } from '../types';

interface AppState {
  // 用户信息
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // 当前位置
  currentLocation: Location | null;
  setCurrentLocation: (location: Location | null) => void;

  // 活动列表
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
  addActivity: (activity: Activity) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  removeActivity: (id: string) => void;

  // 当前活动详情
  currentActivity: Activity | null;
  setCurrentActivity: (activity: Activity | null) => void;

  // 聊天室消息
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;

  // UI 状态
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // TabBar 当前选中
  currentTab: number;
  setCurrentTab: (tab: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // 用户信息
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  // 当前位置
  currentLocation: null,
  setCurrentLocation: (location) => set({ currentLocation: location }),

  // 活动列表
  activities: [],
  setActivities: (activities) => set({ activities }),
  addActivity: (activity) =>
    set((state) => ({ activities: [activity, ...state.activities] })),
  updateActivity: (id, updates) =>
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
      currentActivity:
        state.currentActivity?.id === id
          ? { ...state.currentActivity, ...updates }
          : state.currentActivity,
    })),
  removeActivity: (id) =>
    set((state) => ({
      activities: state.activities.filter((a) => a.id !== id),
    })),

  // 当前活动详情
  currentActivity: null,
  setCurrentActivity: (activity) => set({ currentActivity: activity }),

  // 聊天室消息
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),

  // UI 状态
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // TabBar 当前选中
  currentTab: 0,
  setCurrentTab: (tab) => set({ currentTab: tab }),
}));
