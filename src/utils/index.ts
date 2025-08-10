
import { type SpaceType, type PricingConfigs } from '../types';

// Enhanced pricing configuration
export const pricing: PricingConfigs = {
  "Entrance": { 
    base: 99, 
    baseHours: 8, 
    extension: 15, 
    discountBlock: { hours: 8, price: 99 } 
  },
  "Inner": { 
    base: 149, 
    baseHours: 8, 
    extension: 15, 
    discountBlock: { hours: 8, price: 120 } 
  },
  "Call Booth": { 
    base: 250, 
    baseHours: 5, 
    extension: 50 
  },
  "Whole Area": { 
    base: 500, 
    baseHours: 2, 
    extension: 250 
  }
};

// Calculate price based on space type and duration
export function calculatePrice(spaceType: SpaceType, duration: number): number {
  const config = pricing[spaceType];
  if (!config) return 0;

  if (duration <= config.baseHours) {
    return config.base;
  }

  const extraHours = duration - config.baseHours;
  let extraCost = 0;

  if (config.discountBlock && extraHours >= config.discountBlock.hours) {
    const discountBlocks = Math.floor(extraHours / config.discountBlock.hours);
    const remainingHours = extraHours % config.discountBlock.hours;
    extraCost = (discountBlocks * config.discountBlock.price) + (remainingHours * config.extension);
  } else {
    extraCost = extraHours * config.extension;
  }

  return config.base + extraCost;
}

// Generate random access code
export function generateAccessCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * FIXME: 
 * 1. The computation is wrong, minutes / 60 is not hours but rather seconds
 * 2. The first parameter should also accept date time
 */
export const formatTime = (minutes: number, showHoursMinutes = false): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (showHoursMinutes) {
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
  
  const seconds = 0; // Or calculate from actual time
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Calculate time remaining for active sessions
export function getTimeRemaining(startTime: Date, durationHours: number): string {
  const endTime = new Date(startTime.getTime() + (durationHours * 60 * 60 * 1000));
  const now = new Date();
  const remaining = Math.max(0, endTime.getTime() - now.getTime());
  
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Check if time is urgent (less than 5 minutes)
export function isTimeUrgent(timeRemaining: string): boolean {
  const [hours, minutes] = timeRemaining.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  return totalMinutes < 5;
}

// Format date to YYYY-MM-DD
export function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Check if date is today
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

// Get space type options for select components
export function getSpaceTypeOptions() {
  return [
    { value: 'Entrance', label: 'Entrance Sector' },
    { value: 'Inner', label: 'Inner Sector' },
    { value: 'Call Booth', label: 'Call Chamber' },
    { value: 'Whole Area', label: 'Whole Inner Sector' }
  ];
}

// Enhanced ClassNames utility (similar to clsx)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Generate random server stats for simulation
export function generateServerStats() {
  return {
    cpuTemp: Math.floor(Math.random() * 20) + 55, // 55-75°C
    memUsage: (Math.random() * 2 + 5).toFixed(1), // 5.0-7.0GB
    cpuUsage: Math.floor(Math.random() * 40) + 20, // 20-60%
    diskUsage: (Math.floor(Math.random() * 5) + 40).toString(), // 40-45GB
    networkIO: (Math.random() * 3 + 1).toFixed(1), // 1.0-4.0MB/s
    uptime: `${Math.floor(Math.random() * 3) + 7}D ${Math.floor(Math.random() * 24)}H`
  };
}

// Color utilities for status
export const statusColors = {
  active: 'var(--ks-hud-green)',
  warning: 'var(--ks-hud-orange)',
  error: 'var(--ks-hud-red)',
  info: 'var(--ks-hud-blue)',
  primary: 'var(--ks-hud-primary)',
  secondary: 'var(--ks-hud-secondary)'
};

// Get status color
export function getStatusColor(status: keyof typeof statusColors): string {
  return statusColors[status] || statusColors.secondary;
}

// Format currency
export function formatCurrency(amount: number): string {
  return `₱${amount.toLocaleString()}`;
}

// Format duration
export function formatDuration(hours: number): string {
  return `${hours.toString().padStart(2, '0')}:00`;
}

// Get urgency level based on time remaining
export function getUrgencyLevel(timeRemaining: string): 'normal' | 'warning' | 'urgent' {
  const [hours, minutes, seconds] = timeRemaining.split(':').map(Number);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  
  if (totalSeconds < 300) return 'urgent'; // Less than 5 minutes
  if (totalSeconds < 900) return 'warning'; // Less than 15 minutes
  return 'normal';
}

// Animation utilities
export const animations = {
  pulse: 'hud-pulse',
  flicker: 'hud-flicker',
  timerGlow: 'hud-timer-glow',
  progressPulse: 'hud-progress-pulse',
  urgentBlink: 'hud-urgent-blink',
  digitalFlicker: 'hud-digital-flicker'
};

// Get animation class based on status
export function getAnimationClass(status: 'normal' | 'warning' | 'urgent'): string {
  switch (status) {
    case 'urgent':
      return animations.urgentBlink;
    case 'warning':
      return animations.digitalFlicker;
    default:
      return animations.pulse;
  }
}

// Enhanced debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Local storage helpers
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }
};

// Validation utilities
export const validators = {
  required: (value: any): boolean => {
    return value !== null && value !== undefined && value !== '';
  },
  
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  
  phone: (value: string): boolean => {
    const phoneRegex = /^[+]?[1-9]\d{0,15}$/;
    return phoneRegex.test(value.replace(/\s/g, ''));
  },
  
  accessCode: (value: string): boolean => {
    return /^\d{6}$/.test(value);
  },
  
  duration: (value: number): boolean => {
    return value >= 1 && value <= 24;
  }
};

// API simulation helpers
export const api = {
  delay: (ms: number = 1000): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  simulateError: (chance: number = 0.1): boolean => {
    return Math.random() < chance;
  },
  
  mockResponse: <T>(data: T, delay: number = 500): Promise<T> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (api.simulateError()) {
          reject(new Error('Simulated API error'));
        } else {
          resolve(data);
        }
      }, delay);
    });
  }
};