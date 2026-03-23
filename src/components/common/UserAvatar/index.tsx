import React from 'react';
import { View, Image, Text } from '@tarojs/components';
import { User } from '../../../types';
import './UserAvatar.scss';

interface UserAvatarProps {
  user: User;
  size?: 'small' | 'normal' | 'large';
  showGender?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'normal',
  showGender = false,
}) => {
  const sizeMap = {
    small: 60,
    normal: 80,
    large: 120,
  };

  const avatarSize = sizeMap[size];

  return (
    <View className={`user-avatar user-avatar--${size}`}>
      <Image
        className="user-avatar__image"
        src={user.avatar}
        mode="aspectFill"
        style={{ width: `${avatarSize}rpx`, height: `${avatarSize}rpx` }}
      />
      {showGender && user.gender !== 'unknown' && (
        <View
          className={`user-avatar__gender user-avatar__gender--${user.gender}`}
        >
          {user.gender === 'male' ? '♂' : '♀'}
        </View>
      )}
    </View>
  );
};

export default UserAvatar;
