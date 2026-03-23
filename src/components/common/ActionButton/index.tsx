import React from 'react';
import { View, Text } from '@tarojs/components';
import './ActionButton.scss';

interface ActionButtonProps {
  text: string;
  type?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  type = 'primary',
  disabled = false,
  loading = false,
  onClick,
}) => {
  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <View
      className={`action-button action-button--${type} ${disabled || loading ? 'action-button--disabled' : ''}`}
      onClick={handleClick}
    >
      {loading ? (
        <Text className="action-button__loading">...</Text>
      ) : (
        <Text className="action-button__text">{text}</Text>
      )}
    </View>
  );
};

export default ActionButton;
