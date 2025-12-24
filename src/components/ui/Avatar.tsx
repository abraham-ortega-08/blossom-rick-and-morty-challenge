'use client';

import Image from 'next/image';
import { memo } from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 40,
  md: 48,
  lg: 80,
  xl: 120,
};

export const Avatar = memo(function Avatar({ 
  src, 
  alt, 
  size = 'md',
  className = ''
}: AvatarProps) {
  const pixelSize = sizeMap[size];
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-[120px] h-[120px]',
  };
  
  return (
    <div 
      className={`relative overflow-hidden rounded-full flex-shrink-0 ${sizeClasses[size]} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${pixelSize}px`}
        className="object-cover"
        priority={size === 'lg' || size === 'xl'}
      />
    </div>
  );
});

