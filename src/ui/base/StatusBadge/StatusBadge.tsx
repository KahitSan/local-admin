
import React from 'react';
import { type StatusBadgeProps } from '../../../types';

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
}) => {
  return (
    <span className={`status-badge ${status}`}>
      {children}
    </span>
  );
};
