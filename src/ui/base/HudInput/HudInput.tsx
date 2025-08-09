
import React from 'react';
import { type HudInputProps } from '../../../types';

export const HudInput: React.FC<HudInputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  min,
  max,
  className = '',
  disabled = false,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      min={min}
      max={max}
      className={`hud-input ${className}`}
      disabled={disabled}
      {...props}
    />
  );
};

export default HudInput;