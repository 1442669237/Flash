import React from 'react';
import { View, Text } from '@tarojs/components';
import { Activity } from '../../../types';
import { formatDistance } from '../../../utils';
import UserAvatar from '../../common/UserAvatar';
import CountdownTimer from '../../common/CountdownTimer';
import TagChip from '../../common/TagChip';
import './ActivityCard.scss';

interface ActivityCardProps {
  activity: Activity;
  onClick?: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onClick }) => {
  const getStatusText = () => {
    if (activity.status === 'full') return '名额已满';
    if (activity.currentPeople === activity.maxPeople - 1) return '差1人';
    return `${activity.maxPeople - activity.currentPeople}人可加入`;
  };

  const getStatusClass = () => {
    if (activity.status === 'full') return 'activity-card__status--full';
    if (activity.currentPeople === activity.maxPeople - 1) return 'activity-card__status--almost';
    return 'activity-card__status--available';
  };

  return (
    <View className="activity-card" onClick={onClick}>
      {/* 头部 */}
      <View className="activity-card__header">
        <UserAvatar user={activity.creator} size="normal" showGender />
        <View className="activity-card__info">
          <View className="activity-card__row">
            <Text className="activity-card__creator">{activity.creator.nickname}</Text>
            <CountdownTimer expiresAt={activity.expiresAt} />
          </View>
          <Text className="activity-card__address">{activity.address}</Text>
        </View>
      </View>

      {/* 内容 */}
      <View className="activity-card__content">
        <Text className="activity-card__title">{activity.title}</Text>
        <View className="activity-card__tags">
          {activity.tags.map((tag) => (
            <TagChip key={tag} label={tag} />
          ))}
        </View>
      </View>

      {/* 底部 */}
      <View className="activity-card__footer">
        <View className="activity-card__distance">
          <Text className="activity-card__distance-icon">📍</Text>
          <Text className="activity-card__distance-text">
            {formatDistance(activity.distance || 0)}
          </Text>
        </View>
        <View className={`activity-card__status ${getStatusClass()}`}>
          <Text className="activity-card__status-text">{getStatusText()}</Text>
        </View>
        <View className="activity-card__people">
          <Text className="activity-card__people-icon">👥</Text>
          <Text className="activity-card__people-text">
            {activity.currentPeople}/{activity.maxPeople}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ActivityCard;
