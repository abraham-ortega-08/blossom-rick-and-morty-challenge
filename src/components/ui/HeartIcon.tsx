'use client';

import { memo } from 'react';
import { Icon } from '@iconify/react';

interface HeartIconProps {
  filled: boolean;
  size?: number;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export const HeartIcon = memo(function HeartIcon({ 
  filled, 
  size = 24, 
  onClick,
  className = ''
}: HeartIconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`transition-transform hover:scale-110 focus:outline-none ${className}`}
      aria-label={filled ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Icon 
        icon={filled ? "mdi:heart" : "mdi:heart-outline"}
        width={size}
        height={size}
        style={{ color: filled ? '#63D838' : '#9CA3AF' }}
      />
    </button>
  );
});

