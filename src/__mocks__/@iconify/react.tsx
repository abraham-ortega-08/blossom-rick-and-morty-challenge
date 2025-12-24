import React from 'react';

interface IconProps {
  icon: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ icon, width, height, className, style }) => {
  return (
    <svg
      data-icon={icon}
      width={width}
      height={height}
      className={className}
      style={style}
      data-testid="iconify-icon"
    >
      <title>{icon}</title>
    </svg>
  );
};

