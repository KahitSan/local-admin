
import React from 'react';
import { cn } from '../../../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'md',
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";
  
  const variantClasses = {
    default: "border hud-scan-line",
    primary: "hud-clip-button hud-scan-line",
    success: "border hud-scan-line",
    danger: "border hud-scan-line",
    outline: "border-2 hover:bg-white/5"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const variantStyles = {
    default: {
      backgroundColor: 'rgba(201, 169, 97, 0.1)',
      borderColor: 'rgba(201, 169, 97, 0.4)',
      color: 'var(--ks-hud-primary)'
    },
    primary: {
      backgroundColor: 'rgba(201, 169, 97, 0.2)',
      border: '1px solid rgba(201, 169, 97, 0.6)',
      color: 'var(--ks-hud-primary)'
    },
    success: {
      backgroundColor: 'rgba(0, 204, 136, 0.1)',
      borderColor: 'rgba(0, 204, 136, 0.4)',
      color: 'var(--ks-hud-green)'
    },
    danger: {
      backgroundColor: 'rgba(255, 68, 68, 0.1)',
      borderColor: 'rgba(255, 68, 68, 0.4)',
      color: 'var(--ks-hud-red)'
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: 'rgba(201, 169, 97, 0.4)',
      color: 'var(--ks-hud-primary)'
    }
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      style={variantStyles[variant]}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};