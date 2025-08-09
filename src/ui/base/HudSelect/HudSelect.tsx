import React from 'react';
import { type HudSelectProps } from '../../../types/index';

export const HudSelect: React.FC<HudSelectProps> = ({
  value,
  onChange,
  options,
  className = '',
  disabled = false,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className={`hud-select ${className}`}
      disabled={disabled}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

// src/ui/base/HudLabel/HudLabel.tsx

interface HudLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

export const HudLabel: React.FC<HudLabelProps> = ({
  children,
  htmlFor,
  className = '',
  ...props
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`hud-label ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};
