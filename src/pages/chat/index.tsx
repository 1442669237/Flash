import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { Activity, Message } from '../../types';
import { api, currentUser } from '../../services/mockData';
import { formatTime } from '../../utils';
import UserAvatar from '../../components/common/UserAvatar';
import './index.scss';

export const Chat = () => {
  const router = useRouter();
  const activityId = router.params.activityId;
  const [activity, setActivity] = useState<Activity | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef<any>(null);

  // 获取活动详情
  const fetchActivityDetail = async () => {
    try {
      const data = await api.getActivityById(activityId);
      setActivity(data);
    } catch (error) {
      Taro.showToast({
        title: '获取活动信息失败',
        icon: 'none',
      });
    }
  };

  // 获取消息列表
  const fetchMessages = async () => {
    try {
      const data = await api.getMessages(activityId);
      setMessages(data);
    } catch (error) {
      Taro.showToast({
        title: '获取消息失败',
        icon: 'none',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim()) return;

    try {
      const newMessage = await api.sendMessage(activityId, inputValue.trim());
      setMessages((prev) => [...prev, newMessage]);
      setInputValue('');
      setTimeout(() => {
        scrollViewRef.current?.scrollIntoView({ scrollTop: 9999 });
      }, 100);
    } catch (error) {
      Taro.showToast({
        title: '发送失败',
        icon: 'none',
      });
    }
  };

  // 发送位置
  const handleSendLocation = () => {
    Taro.getLocation({
      type: 'gcj02',
      success: async (res) => {
        try {
          const locationMsg = await api.sendMessage(
            activityId,
            `我的位置：${res.latitude.toFixed(6)}, ${res.longitude.toFixed(6)}`,
            'location'
          );
          setMessages((prev) => [...prev, locationMsg]);
          setTimeout(() => {
            scrollViewRef.current?.scrollIntoView({ scrollTop: 9999 });
          }, 100);
        } catch (error) {
          Taro.showToast({
            title: '发送位置失败',
            icon: 'none',
          });
        }
      },
    });
  };

  // 解散聊天室
  const handleDismiss = async () => {
    const confirm = await Taro.showModal({
      title: '确认解散',
      content: '确定要解散这个聊天室吗？',
      confirmText: '确定解散',
      confirmColor: '#FF4757',
    });

    if (confirm.confirm) {
      Taro.showToast({
        title: '聊天室已解散',
        icon: 'success',
      });
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    }
  };

  // 退出聊天室
  const handleLeave = async () => {
    const confirm = await Taro.showModal({
      title: '确认退出',
      content: '确定要退出这个聊天室吗？退出后名额将释放',
      confirmText: '确定退出',
      confirmColor: '#FF4757',
    });

    if (confirm.confirm) {
      try {
        await api.leaveActivity(activityId);
        Taro.showToast({
          title: '已退出聊天室',
          icon: 'success',
        });
        setTimeout(() => {
          Taro.navigateBack();
        }, 1500);
      } catch (error) {
        Taro.showToast({
          title: '退出失败',
          icon: 'none',
        });
      }
    }
  };

  const isCreator = activity?.creatorId === currentUser.id;

  useEffect(() => {
    fetchActivityDetail();
    fetchMessages();
  }, [activityId]);

  const renderMessage = (msg: Message) => {
    if (msg.type === 'system') {
      return (
        <View className="chat-page__message chat-page__message--system">
          <Text className="chat-page__message-system-text">{msg.content}</Text>
        </View>
      );
    }

    const isSelf = msg.senderId === currentUser.id;

    return (
      <View className={`chat-page__message ${isSelf ? 'chat-page__message--self' : ''}`}>
        {!isSelf && <UserAvatar user={msg.sender} size="small" />}
        <View className="chat-page__message-content">
          <Text className="chat-page__message-name">{isSelf ? '' : msg.sender.nickname}</Text>
          <View className={`chat-page__message-bubble ${msg.type === 'location' ? 'chat-page__message-bubble--location' : ''}`}>
            {msg.type === 'location' ? (
              <View className="chat-page__message-location">
                <Text className="chat-page__message-location-icon">📍</Text>
                <Text className="chat-page__message-location-text">{msg.content}</Text>
              </View>
            ) : (
              <Text className="chat-page__message-text">{msg.content}</Text>
            )}
          </View>
          <Text className="chat-page__message-time">{formatTime(msg.createdAt)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View className="chat-page">
      {/* 聊天室标题 */}
      <View className="chat-page__header">
        <View className="chat-page__header-info">
          <Text className="chat-page__header-title">{activity?.title || '加载中...'}</Text>
          <Text className="chat-page__header-subtitle">
            {activity?.currentPeople}/{activity?.maxPeople} 人
          </Text>
        </View>
        <View className="chat-page__header-actions">
          {isCreator ? (
            <View className="chat-page__header-btn chat-page__header-btn--danger" onClick={handleDismiss}>
              <Text>解散</Text>
            </View>
          ) : (
            <View className="chat-page__header-btn" onClick={handleLeave}>
              <Text>退出</Text>
            </View>
          )}
        </View>
      </View>

      {/* 消息列表 */}
      <ScrollView
        className="chat-page__messages"
        scrollY
        scrollWithAnimation
        scrollIntoView="msg-bottom"
      >
        {isLoading ? (
          <View className="chat-page__loading">
            <Text>加载中...</Text>
          </View>
        ) : (
          messages.map((msg, index) => (
            <View key={msg.id} id={`msg-${index}`}>
              {renderMessage(msg)}
            </View>
          ))
        )}
        <View id="msg-bottom" ref={scrollViewRef} />
      </ScrollView>

      {/* 输入区域 */}
      <View className="chat-page__input-area">
        <View className="chat-page__input-tools">
          <View className="chat-page__input-tool" onClick={handleSendLocation}>
            <Text className="chat-page__input-tool-icon">📍</Text>
          </View>
        </View>
        <Input
          className="chat-page__input"
          value={inputValue}
          onInput={(e) => setInputValue(e.detail.value)}
          placeholder="输入消息..."
          onConfirm={handleSend}
        />
        <View className="chat-page__send-btn" onClick={handleSend}>
          <Text className="chat-page__send-btn-text">发送</Text>
        </View>
      </View>
    </View>
  );
};

export default Chat;
