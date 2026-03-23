import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { formatCountdown } from '../../../utils';
import './CountdownTimer.scss';

interface CountdownTimerProps {
  expiresAt: number;
  onExpire?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  expiresAt,
  onExpire,
}) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const diff = expiresAt - now;

      if (diff <= 0) {
        setTimeLeft('已结束');
        setIsExpired(true);
        setIsUrgent(false);
        onExpire?.();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      let timeStr = '';
      if (hours > 0) {
        timeStr = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }

      setTimeLeft(timeStr);
      setIsUrgent(diff < 10 * 60 * 1000);
      setIsExpired(false);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpire]);

  const getTimerClass = () => {
    if (isExpired) return 'countdown-timer countdown-timer--expired';
    if (isUrgent) return 'countdown-timer countdown-timer--urgent';
    return 'countdown-timer countdown-timer--normal';
  };

  return (
    <View className={getTimerClass()}>
      <Text className="countdown-timer__icon">⏱</Text>
      <Text className="countdown-timer__text">{timeLeft}</Text>
    </View>
  );
};

export default CountdownTimer;
