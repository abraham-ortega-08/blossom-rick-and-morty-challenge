'use client';

import Image from 'next/image';
import { memo } from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 40,
  md: 48,
  lg: 80,
};

export const Avatar = memo(function Avatar({ 
  src, 
  alt, 
  size = 'md',
  className = ''
}: AvatarProps) {
  const pixelSize = sizeMap[size];
  
  return (
    <div 
      className={`relative overflow-hidden rounded-full flex-shrink-0 ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${pixelSize}px`}
        className="object-cover"
        priority={size === 'lg'}
      />
    </div>
  );
});

