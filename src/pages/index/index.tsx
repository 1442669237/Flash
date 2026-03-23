import React, { useState, useEffect } from 'react';
import { View, Text, Map, CoverView, CoverImage } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { navigateTo } from '@tarojs/taro';
import { Activity } from '../../types';
import { api, currentUser } from '../../services/mockData';
import { useAppStore } from '../../store';
import { formatDistance } from '../../utils';
import ActivityCard from '../../components/business/ActivityCard';
import EmptyState from '../../components/common/EmptyState';
import './index.scss';

type ViewMode = 'map' | 'list';

export const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number }>({
    latitude: 31.230416,
    longitude: 121.473701,
  });
  const [isLoading, setIsLoading] = useState(false);

  // 获取位置
  const getLocation = () => {
    setIsLoading(true);
    Taro.getLocation({
      type: 'gcj02',
      success: (res) => {
        setLocation({
          latitude: res.latitude,
          longitude: res.longitude,
        });
        fetchActivities(res.latitude, res.longitude);
      },
      fail: () => {
        Taro.showToast({
          title: '定位失败，使用默认位置',
          icon: 'none',
        });
        fetchActivities(location.latitude, location.longitude);
      },
    });
  };

  // 获取活动列表
  const fetchActivities = async (lat: number, lon: number) => {
    try {
      const data = await api.getActivities({ latitude: lat, longitude: lon });
      setActivities(data);
    } catch (error) {
      Taro.showToast({
        title: '获取活动失败',
        icon: 'none',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 刷新数据
  const onRefresh = () => {
    getLocation();
  };

  // 切换视图模式
  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'map' ? 'list' : 'map'));
  };

  // 跳转到活动详情
  const goToActivityDetail = (activity: Activity) => {
    navigateTo({
      url: `/pages/event-detail/index?id=${activity.id}`,
    });
  };

  // 跳转到发布页
  const goToPublish = () => {
    navigateTo({
      url: '/pages/publish/index',
    });
  };

  // 地图标记点击
  const onMarkerTap = (e: any) => {
    const { markerId } = e.detail;
    const activity = activities.find((a) => a.id === markerId);
    if (activity) {
      setSelectedActivity(activity);
    }
  };

  // 地图点击
  const onMapTap = () => {
    setSelectedActivity(null);
  };

  // 创建地图标记
  const createMarkers = () => {
    return activities.map((activity) => ({
      id: activity.id,
      latitude: activity.latitude,
      longitude: activity.longitude,
      width: 40,
      height: 40,
      iconPath: '/assets/marker.png',
    }));
  };

  useEffect(() => {
    // 初始化用户信息
    useAppStore.getState().setCurrentUser(currentUser);
    getLocation();
  }, []);

  return (
    <View className="index-page">
      {/* 顶部状态栏 */}
      <View className="index-page__header">
        <View className="index-page__location">
          <Text className="index-page__location-icon">📍</Text>
          <Text className="index-page__location-text">附近闪现</Text>
        </View>
        <View className="index-page__actions">
          <View className="index-page__refresh" onClick={onRefresh}>
            <Text className="index-page__refresh-icon">🔄</Text>
          </View>
          <View className="index-page__mode-toggle" onClick={toggleViewMode}>
            <Text className="index-page__mode-icon">
              {viewMode === 'map' ? '📋' : '🗺️'}
            </Text>
          </View>
        </View>
      </View>

      {/* 内容区域 */}
      {viewMode === 'map' ? (
        /* 地图模式 */
        <View className="index-page__map-container">
          <Map
            id="map"
            className="index-page__map"
            latitude={location.latitude}
            longitude={location.longitude}
            scale={14}
            markers={createMarkers()}
            onMarkerTap={onMarkerTap}
            onClick={onMapTap}
            showLocation
          />

          {/* 当前定位点 */}
          <CoverView className="index-page__current-location">
            <CoverImage src="/assets/current-location.png" className="index-page__current-icon" />
          </CoverView>

          {/* 选中活动预览 */}
          {selectedActivity && (
            <View className="index-page__map-preview animate-fadeIn">
              <ActivityCard
                activity={selectedActivity}
                onClick={() => goToActivityDetail(selectedActivity)}
              />
            </View>
          )}
        </View>
      ) : (
        /* 列表模式 */
        <View className="index-page__list-container">
          {isLoading ? (
            <View className="index-page__loading">
              <Text className="index-page__loading-text">加载中...</Text>
            </View>
          ) : activities.length === 0 ? (
            <EmptyState
              icon="🎉"
              title="附近暂无闪现"
              description="成为第一个发起闪现的人吧！"
              actionText="发起闪现"
              onAction={goToPublish}
            />
          ) : (
            <View className="index-page__list">
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onClick={() => goToActivityDetail(activity)}
                />
              ))}
            </View>
          )}
        </View>
      )}

      {/* 悬浮发布按钮 */}
      <View className="index-page__fab" onClick={goToPublish}>
        <Text className="index-page__fab-icon">+</Text>
      </View>
    </View>
  );
};

export default Index;
