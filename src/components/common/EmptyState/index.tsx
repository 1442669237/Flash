import React from 'react';
import { View, Text } from '@tarojs/components';
import './EmptyState.scss';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <View className="empty-state">
      <Text className="empty-state__icon">{icon}</Text>
      <Text className="empty-state__title">{title}</Text>
      {description && (
        <Text className="empty-state__description">{description}</Text>
      )}
      {actionText && onAction && (
        <View className="empty-state__action" onClick={onAction}>
          <Text className="empty-state__action-text">{actionText}</Text>
        </View>
      )}
    </View>
  );
};

export default EmptyState;
