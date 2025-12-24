'use client';

import { memo } from 'react';

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
      {filled ? (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="#63D838"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      ) : (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9CA3AF"
          strokeWidth="2"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      )}
    </button>
  );
});

