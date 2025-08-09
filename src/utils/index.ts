import { type SpaceType, type PricingConfigs } from '../types';

// Pricing configuration
export const pricing: PricingConfigs = {
  "Entrance": { base: 99, baseHours: 8, extension: 15, discountBlock: { hours: 8, price: 99 } },
  "Inner": { base: 149, baseHours: 8, extension: 15, discountBlock: { hours: 8, price: 120 } },
  "Call Booth": { base: 250, baseHours: 5, extension: 50 },
  "Whole Area": { base: 500, baseHours: 2, extension: 250 }
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

// Format time for display
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

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

// ClassNames utility (similar to clsx)
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