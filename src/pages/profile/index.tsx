import React, { useState, useEffect } from 'react';
import { View, Text, Switch } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { User, Activity } from '../../types';
import { currentUser, api } from '../../services/mockData';
import { useAppStore } from '../../store';
import { USER_TAGS, CREDIT_CONFIG } from '../../constants';
import UserAvatar from '../../components/common/UserAvatar';
import ActivityCard from '../../components/business/ActivityCard';
import { navigateTo } from '@tarojs/taro';
import './index.scss';

export const Profile = () => {
  const [user, setUser] = useState<User>(currentUser);
  const [createdActivities, setCreatedActivities] = useState<Activity[]>([]);
  const [joinedActivities, setJoinedActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState<'created' | 'joined'>('created');
  const [isEditing, setIsEditing] = useState(false);

  // 获取用户参与的活动
  const fetchUserActivities = async () => {
    try {
      const { created, joined } = await api.getUserActivities(currentUser.id);
      setCreatedActivities(created);
      setJoinedActivities(joined);
    } catch (error) {
      console.error('获取活动失败', error);
    }
  };

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const userInfo = await api.getUserInfo();
      setUser(userInfo);
    } catch (error) {
      console.error('获取用户信息失败', error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchUserActivities();
  }, []);

  // 跳转到活动详情
  const goToActivityDetail = (activity: Activity) => {
    navigateTo({
      url: `/pages/event-detail/index?id=${activity.id}`,
    });
  };

  // 获取信誉分颜色
  const getCreditColor = (score: number) => {
    if (score >= CREDIT_CONFIG.normal) return '#2ED573';
    if (score >= CREDIT_CONFIG.low) return '#FFE66D';
    if (score >= CREDIT_CONFIG.critical) return '#FF6B6B';
    return '#FF4757';
  };

  // 获取信誉分等级
  const getCreditLevel = (score: number) => {
    if (score >= CREDIT_CONFIG.normal) return '优秀';
    if (score >= CREDIT_CONFIG.low) return '良好';
    if (score >= CREDIT_CONFIG.critical) return '一般';
    return '较差';
  };

  const currentActivities = activeTab === 'created' ? createdActivities : joinedActivities;

  return (
    <View className="profile-page">
      {/* 用户信息卡片 */}
      <View className="profile-page__header">
        <View className="profile-page__avatar-section">
          <UserAvatar user={user} size="large" />
          <View className="profile-page__user-info">
            <Text className="profile-page__nickname">{user.nickname}</Text>
            <View className="profile-page__tags">
              {user.tags.slice(0, 3).map((tag) => (
                <Text key={tag} className="profile-page__tag">
                  {tag}
                </Text>
              ))}
            </View>
          </View>
        </View>
        <View className="profile-page__credit">
          <View className="profile-page__credit-header">
            <Text className="profile-page__credit-label">信誉分</Text>
            <Text
              className="profile-page__credit-level"
              style={{ color: getCreditColor(user.creditScore) }}
            >
              {getCreditLevel(user.creditScore)}
            </Text>
          </View>
          <View className="profile-page__credit-score">
            <Text
              className="profile-page__credit-number"
              style={{ color: getCreditColor(user.creditScore) }}
            >
              {user.creditScore}
            </Text>
            <Text className="profile-page__credit-max">/100</Text>
          </View>
          <View className="profile-page__credit-bar">
            <View
              className="profile-page__credit-bar-fill"
              style={{
                width: `${user.creditScore}%`,
                backgroundColor: getCreditColor(user.creditScore),
              }}
            />
          </View>
        </View>
      </View>

      {/* 我的活动 */}
      <View className="profile-page__activities">
        <View className="profile-page__tabs">
          <View
            className={`profile-page__tab ${activeTab === 'created' ? 'profile-page__tab--active' : ''}`}
            onClick={() => setActiveTab('created')}
          >
            <Text className="profile-page__tab-text">我发起的</Text>
            <Text className="profile-page__tab-count">{createdActivities.length}</Text>
          </View>
          <View
            className={`profile-page__tab ${activeTab === 'joined' ? 'profile-page__tab--active' : ''}`}
            onClick={() => setActiveTab('joined')}
          >
            <Text className="profile-page__tab-text">我参加的</Text>
            <Text className="profile-page__tab-count">{joinedActivities.length}</Text>
          </View>
        </View>

        <View className="profile-page__activity-list">
          {currentActivities.length === 0 ? (
            <View className="profile-page__empty">
              <Text className="profile-page__empty-text">
                {activeTab === 'created' ? '暂无发起的活动' : '暂无参加的活动'}
              </Text>
            </View>
          ) : (
            currentActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onClick={() => goToActivityDetail(activity)}
              />
            ))
          )}
        </View>
      </View>

      {/* 设置入口 */}
      <View className="profile-page__settings">
        <View className="profile-page__setting-item">
          <Text className="profile-page__setting-text">信誉分明细</Text>
          <Text className="profile-page__setting-arrow">›</Text>
        </View>
        <View className="profile-page__setting-item">
          <Text className="profile-page__setting-text">设置</Text>
          <Text className="profile-page__setting-arrow">›</Text>
        </View>
      </View>
    </View>
  );
};

export default Profile;
