import React from 'react';
import { type HudButtonProps } from '../../../types';

export const HudButton: React.FC<HudButtonProps> = ({
  children,
  variant = 'default',
  active = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'primary';
      case 'success': return 'success';
      case 'danger': return 'danger';
      default: return '';
    }
  };

  const classes = [
    'hud-btn',
    getVariantClass(),
    active ? 'active' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default HudButton;