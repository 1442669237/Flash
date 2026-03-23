import React, { useState, useEffect } from 'react';
import { View, Text, Input, Map } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { navigateBack } from '@tarojs/taro';
import { Activity, PublishFormData } from '../../types';
import { api } from '../../services/mockData';
import { useAppStore } from '../../store';
import { ACTIVITY_TAGS } from '../../constants';
import TagChip from '../../components/common/TagChip';
import ActionButton from '../../components/common/ActionButton';
import './index.scss';

export const Publish = () => {
  const [formData, setFormData] = useState<PublishFormData>({
    title: '',
    customTitle: '',
    tags: [],
    latitude: 0,
    longitude: 0,
    address: '上海市',
    maxPeople: 2,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number }>({
    latitude: 31.230416,
    longitude: 121.473701,
  });

  // 获取当前位置
  const getCurrentLocation = () => {
    Taro.getLocation({
      type: 'gcj02',
      success: (res) => {
        setLocation({
          latitude: res.latitude,
          longitude: res.longitude,
        });
        setFormData((prev) => ({
          ...prev,
          latitude: res.latitude,
          longitude: res.longitude,
        }));
      },
    });
  };

  // 选择标签
  const handleTagSelect = (tagLabel: string) => {
    setFormData((prev) => {
      const isSelected = prev.tags.includes(tagLabel);
      if (isSelected) {
        return { ...prev, tags: prev.tags.filter((t) => t !== tagLabel) };
      } else {
        if (prev.tags.length >= 3) {
          Taro.showToast({
            title: '最多选择3个标签',
            icon: 'none',
          });
          return prev;
        }
        return { ...prev, tags: [...prev.tags, tagLabel] };
      }
    });
  };

  // 切换人数
  const handlePeopleChange = (delta: number) => {
    setFormData((prev) => {
      const newCount = prev.maxPeople + delta;
      if (newCount < 2) return prev;
      if (newCount > 4) return prev;
      return { ...prev, maxPeople: newCount };
    });
  };

  // 自定义标题
  const handleCustomTitleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      customTitle: e.detail.value.slice(0, 20),
    }));
  };

  // 选择位置
  const handleChooseLocation = () => {
    Taro.chooseLocation({
      success: (res) => {
        setFormData((prev) => ({
          ...prev,
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.address || '未知位置',
        }));
      },
    });
  };

  // 发布活动
  const handlePublish = async () => {
    const { title, tags, latitude, longitude, maxPeople } = formData;

    if (!title && !formData.customTitle) {
      Taro.showToast({ title: '请选择或输入活动目的', icon: 'none' });
      return;
    }

    if (tags.length === 0) {
      Taro.showToast({ title: '请至少选择一个标签', icon: 'none' });
      return;
    }

    setIsLoading(true);

    try {
      const activityTitle = title || formData.customTitle;
      const newActivity = await api.createActivity({
        title: activityTitle,
        tags,
        latitude,
        longitude,
        address: formData.address,
        maxPeople,
      });

      // 添加到全局状态
      useAppStore.getState().addActivity(newActivity);

      Taro.showToast({
        title: '发布成功！',
        icon: 'success',
      });

      setTimeout(() => {
        navigateBack();
      }, 1500);
    } catch (error) {
      Taro.showToast({
        title: '发布失败，请重试',
        icon: 'none',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View className="publish-page">
      {/* 标题 */}
      <View className="publish-page__section">
        <Text className="publish-page__section-title">活动目的</Text>
        <View className="publish-page__tags">
          {ACTIVITY_TAGS.map((tag) => (
            <View
              key={tag.label}
              className="publish-page__tag-wrapper"
              onClick={() => handleTagSelect(tag.label)}
            >
              <TagChip
                label={tag.label}
                emoji={tag.emoji}
                selected={formData.tags.includes(tag.label)}
              />
            </View>
          ))}
        </View>
        <View className="publish-page__custom">
          <Input
            className="publish-page__custom-input"
            placeholder="或者自定义简短描述（选填，最多20字）"
            value={formData.customTitle}
            onInput={handleCustomTitleChange}
            maxlength={20}
          />
        </View>
      </View>

      {/* 位置 */}
      <View className="publish-page__section">
        <Text className="publish-page__section-title">活动地点</Text>
        <View className="publish-page__location" onClick={handleChooseLocation}>
          <View className="publish-page__location-info">
            <Text className="publish-page__location-icon">📍</Text>
            <Text className="publish-page__location-text">{formData.address}</Text>
          </View>
          <Text className="publish-page__location-change">修改</Text>
        </View>
        <Map
          className="publish-page__map"
          latitude={location.latitude}
          longitude={location.longitude}
          scale={16}
          markers={[
            {
              id: 1,
              latitude: location.latitude,
              longitude: location.longitude,
              width: 30,
              height: 30,
            },
          ]}
        />
      </View>

      {/* 人数 */}
      <View className="publish-page__section">
        <Text className="publish-page__section-title">人数限制</Text>
        <View className="publish-page__people">
          <View
            className="publish-page__people-btn publish-page__people-btn--minus"
            onClick={() => handlePeopleChange(-1)}
          >
            <Text>-</Text>
          </View>
          <View className="publish-page__people-count">
            <Text className="publish-page__people-number">{formData.maxPeople}</Text>
            <Text className="publish-page__people-label">人</Text>
          </View>
          <View
            className="publish-page__people-btn publish-page__people-btn--plus"
            onClick={() => handlePeopleChange(1)}
          >
            <Text>+</Text>
          </View>
        </View>
        <Text className="publish-page__people-hint">最少2人，最多4人</Text>
      </View>

      {/* 时长说明 */}
      <View className="publish-page__section">
        <View className="publish-page__notice">
          <Text className="publish-page__notice-icon">⏱</Text>
          <View className="publish-page__notice-content">
            <Text className="publish-page__notice-title">活动时长</Text>
            <Text className="publish-page__notice-text">
              发布后2小时内自动结束，超时未成局将自动从列表消失
            </Text>
          </View>
        </View>
      </View>

      {/* 发布按钮 */}
      <View className="publish-page__footer">
        <ActionButton
          text="立即发布"
          type="primary"
          loading={isLoading}
          onClick={handlePublish}
        />
      </View>
    </View>
  );
};

export default Publish;
