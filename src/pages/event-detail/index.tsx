import React, { useState, useEffect } from 'react';
import { View, Text, Map } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { navigateTo, navigateBack } from '@tarojs/taro';
import { Activity } from '../../types';
import { api, currentUser } from '../../services/mockData';
import { useAppStore } from '../../store';
import UserAvatar from '../../components/common/UserAvatar';
import CountdownTimer from '../../components/common/CountdownTimer';
import TagChip from '../../components/common/TagChip';
import ActionButton from '../../components/common/ActionButton';
import './index.scss';

export const EventDetail = () => {
  const router = useRouter();
  const activityId = router.params.id;
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  // 获取活动详情
  const fetchActivityDetail = async () => {
    setIsLoading(true);
    try {
      const data = await api.getActivityById(activityId);
      setActivity(data);
    } catch (error) {
      Taro.showToast({
        title: '获取活动详情失败',
        icon: 'none',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 加入活动
  const handleJoin = async () => {
    if (!activity) return;

    // 二次确认
    const confirm = await Taro.showModal({
      title: '确认加入',
      content: `确定要加入"${activity.title}"吗？`,
      confirmText: '确定加入',
      confirmColor: '#FF6B6B',
    });

    if (!confirm.confirm) return;

    setIsJoining(true);
    try {
      const updatedActivity = await api.joinActivity(activityId);
      setActivity(updatedActivity);
      useAppStore.getState().updateActivity(activityId, updatedActivity);
      Taro.showToast({
        title: '加入成功！',
        icon: 'success',
      });
    } catch (error: any) {
      Taro.showToast({
        title: error.message || '加入失败',
        icon: 'none',
      });
    } finally {
      setIsJoining(false);
    }
  };

  // 进入聊天室
  const handleEnterChat = () => {
    navigateTo({
      url: `/pages/chat/index?activityId=${activityId}`,
    });
  };

  // 分享活动
  const handleShare = () => {
    Taro.showShareMenu({
      withShareTicket: true,
    });
  };

  // 导航到活动地点
  const handleNavigate = () => {
    if (!activity) return;
    Taro.openLocation({
      latitude: activity.latitude,
      longitude: activity.longitude,
      name: activity.title,
      address: activity.address,
    });
  };

  // 判断用户是否已加入
  const hasJoined = activity?.participants.some((p) => p.id === currentUser.id);
  // 判断是否是自己创建的活动
  const isCreator = activity?.creatorId === currentUser.id;

  // 获取按钮状态
  const getButtonConfig = () => {
    if (isCreator) {
      return { text: '邀请好友', type: 'secondary' as const, disabled: false };
    }
    if (hasJoined) {
      return { text: '进入聊天室', type: 'primary' as const, disabled: false };
    }
    if (activity?.status === 'full') {
      return { text: '名额已满', type: 'secondary' as const, disabled: true };
    }
    return { text: '立即加入', type: 'primary' as const, disabled: false };
  };

  const handleButtonClick = () => {
    if (isCreator) {
      handleShare();
    } else if (hasJoined) {
      handleEnterChat();
    } else {
      handleJoin();
    }
  };

  useEffect(() => {
    fetchActivityDetail();
  }, [activityId]);

  if (isLoading) {
    return (
      <View className="event-detail__loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!activity) {
    return (
      <View className="event-detail__loading">
        <Text>活动不存在</Text>
      </View>
    );
  }

  const buttonConfig = getButtonConfig();

  return (
    <View className="event-detail">
      {/* 顶部倒计时 */}
      <View className="event-detail__countdown-bar">
        <CountdownTimer expiresAt={activity.expiresAt} />
        <Text className="event-detail__countdown-hint">后自动结束</Text>
      </View>

      {/* 地图区域 */}
      <View className="event-detail__map" onClick={handleNavigate}>
        <Map
          className="event-detail__map-content"
          latitude={activity.latitude}
          longitude={activity.longitude}
          scale={16}
          markers={[
            {
              id: 1,
              latitude: activity.latitude,
              longitude: activity.longitude,
              width: 40,
              height: 40,
            },
          ]}
        />
        <View className="event-detail__map-overlay">
          <Text className="event-detail__map-text">点击查看地图</Text>
        </View>
      </View>

      {/* 活动信息 */}
      <View className="event-detail__content">
        {/* 发起人信息 */}
        <View className="event-detail__creator">
          <UserAvatar user={activity.creator} size="large" showGender />
          <View className="event-detail__creator-info">
            <Text className="event-detail__creator-name">{activity.creator.nickname}</Text>
            <View className="event-detail__creator-tags">
              {activity.creator.tags.slice(0, 2).map((tag) => (
                <Text key={tag} className="event-detail__creator-tag">
                  {tag}
                </Text>
              ))}
            </View>
          </View>
          <View className="event-detail__creator-badge">
            <Text className="event-detail__creator-badge-text">发起人</Text>
          </View>
        </View>

        {/* 活动标题 */}
        <View className="event-detail__title-section">
          <Text className="event-detail__title">{activity.title}</Text>
          <View className="event-detail__tags">
            {activity.tags.map((tag) => (
              <TagChip key={tag} label={tag} />
            ))}
          </View>
        </View>

        {/* 活动地点 */}
        <View className="event-detail__section">
          <View className="event-detail__section-header">
            <Text className="event-detail__section-title">📍 活动地点</Text>
          </View>
          <Text className="event-detail__address">{activity.address}</Text>
        </View>

        {/* 参与者 */}
        <View className="event-detail__section">
          <View className="event-detail__section-header">
            <Text className="event-detail__section-title">👥 参与人员</Text>
            <Text className="event-detail__section-count">
              {activity.currentPeople}/{activity.maxPeople} 人
            </Text>
          </View>
          <View className="event-detail__participants">
            {activity.participants.map((participant) => (
              <View key={participant.id} className="event-detail__participant">
                <UserAvatar user={participant} size="small" showGender />
                <Text className="event-detail__participant-name">
                  {participant.nickname}
                </Text>
                {participant.id === activity.creatorId && (
                  <View className="event-detail__participant-badge">
                    <Text className="event-detail__participant-badge-text">发起</Text>
                  </View>
                )}
              </View>
            ))}
            {Array.from({ length: activity.maxPeople - activity.currentPeople }).map(
              (_, index) => (
                <View key={`empty-${index}`} className="event-detail__participant event-detail__participant--empty">
                  <Text className="event-detail__participant-empty">?</Text>
                </View>
              )
            )}
          </View>
        </View>
      </View>

      {/* 安全提示 */}
      <View className="event-detail__safety">
        <Text className="event-detail__safety-icon">⚠️</Text>
        <Text className="event-detail__safety-text">
          请注意人身和财产安全，线下见面请选择公共场所
        </Text>
      </View>

      {/* 底部操作 */}
      <View className="event-detail__footer">
        <ActionButton
          text={buttonConfig.text}
          type={buttonConfig.type}
          disabled={buttonConfig.disabled}
          loading={isJoining}
          onClick={handleButtonClick}
        />
      </View>
    </View>
  );
};

export default EventDetail;
