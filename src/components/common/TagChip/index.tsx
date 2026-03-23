import React from 'react';
import { View, Text } from '@tarojs/components';
import { ACTIVITY_TAGS } from '../../../constants';
import './TagChip.scss';

interface TagChipProps {
  label: string;
  emoji?: string;
  selected?: boolean;
  onClick?: () => void;
}

export const TagChip: React.FC<TagChipProps> = ({
  label,
  emoji,
  selected = false,
  onClick,
}) => {
  const getEmoji = () => {
    if (emoji) return emoji;
    const tag = ACTIVITY_TAGS.find(t => t.label === label);
    return tag?.emoji || '📍';
  };

  return (
    <View
      className={`tag-chip ${selected ? 'tag-chip--selected' : ''}`}
      onClick={onClick}
    >
      <Text className="tag-chip__emoji">{getEmoji()}</Text>
      <Text className="tag-chip__label">{label}</Text>
    </View>
  );
};

export default TagChip;
