
import React from 'react';
import { type ProgressBarProps } from '../../../types';

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color = 'var(--ks-hud-primary)',
  className = '',
}) => {
  return (
    <div className={`progress-bar ${className}`}>
      <div
        className="progress-fill"
        style={{
          width: `${Math.min(100, Math.max(0, percentage))}%`,
          background: color
        }}
      />
    </div>
  );
};