import React from 'react';

// ============================================================================
// CORE DOMAIN TYPES
// ============================================================================

export interface Client {
  id: number;
  name: string;
  remarks: string;
  startTime: Date;
  duration: number;
  spaceType: SpaceType;
  seatId: string | null;
  accessCode: string;
  status: ClientStatus;
  payment: number;
  balance: number;
}

export type ClientStatus = 'active' | 'editing' | 'completed' | 'booked' | 'urgent';

export type SpaceType = 'Entrance' | 'Inner' | 'Call Booth' | 'Whole Area';

export interface Seat {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  status: SeatStatus;
  area: string;
  desk: string;
  price: number;
  clientId: number | null;
}

export type SeatStatus = 'available' | 'occupied' | 'maintenance';

export interface Area {
  name: string;
  x: number;
  y: number;
  color: string;
}

export interface Booking {
  space: string;
  client: string;
  time: string;
}

export interface BookingsByDate {
  [date: string]: Booking[];
}

export interface AccessCode {
  name: string;
  invalid_time: number;
}

export interface ServerStats {
  cpuTemp: number;
  memUsage: string;
  cpuUsage: number;
  diskUsage: string;
  networkIO: string;
  uptime: string;
}

export interface PricingConfig {
  base: number;
  baseHours: number;
  extension: number;
  discountBlock?: {
    hours: number;
    price: number;
  };
}

export interface PricingConfigs {
  [spaceType: string]: PricingConfig;
}

export interface ViewType {
  current: 'card' | 'table' | 'map';
}

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

// Base Component Types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'panel';
  accentColor?: string;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  className?: string;
  containerClassName?: string;
}

export interface StatusBadgeProps {
  status: BadgeStatus;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export type BadgeStatus = 'active' | 'inactive' | 'warning' | 'error' | 'info';

export interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  variant?: 'default' | 'timer' | 'status';
  className?: string;
  showValue?: boolean;
  icon?: React.ReactNode;
  label?: string;
}

// Composite Component Types
export interface ClientCardProps {
  client: Client;
  onUpdate: (clientId: number, field: keyof Client, value: any) => void;
  onStart: (clientId: number) => void;
  onExtend: (clientId: number) => void;
  onComplete: (clientId: number) => void;
  onDelete: (clientId: number) => void;
  onShowOnMap: (clientId: number) => void;
}

export interface PricingDisplayProps {
  price: number;
  payment?: number;
  spaceType?: string;
  duration?: number;
}

// Section Component Types
export interface NavigationProps {
  activeSessionsCount?: number;
  onLogout?: () => void;
}

export interface LockControlProps {
  onLockChange?: (isLocked: boolean) => void;
}

export interface SystemStatsProps {
  updateInterval?: number;
}

export interface AccessCodesProps {
  accessCodes: AccessCode[];
  onRefresh?: () => void;
}

export interface QuickStatsProps {
  activeClients: number;
  occupancyRate: number;
  todayRevenue: number;
  totalSpaces: number;
}

export interface FloorPlanProps {
  seats: Seat[];
  areas: Area[];
  clients: Client[];
  selectedClientId?: number | null;
  onSeatClick: (seat: Seat) => void;
  onClientHighlight: (clientId: number) => void;
}

export interface CalendarProps {
  bookings: BookingsByDate;
  currentMonth?: Date;
  onDayClick?: (date: string, bookings: Booking[]) => void;
}

export interface NotesSectionProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  onSave?: () => void;
}

// ============================================================================
// HOOK TYPES
// ============================================================================

export interface UseClientsReturn {
  clients: Client[];
  addClient: () => void;
  updateClient: (clientId: number, field: keyof Client, value: any) => void;
  startSession: (clientId: number) => void;
  extendSession: (clientId: number) => void;
  completeSession: (clientId: number) => void;
  deleteClient: (clientId: number) => void;
  getActiveCount: () => number;
}

export type LocalStorageValue<T> = [T, (value: T) => void];

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface StatusConfig {
  color: string;
  icon: React.ComponentType<any>;
  label: string;
  bgColor: string;
  borderColor: string;
}

export interface StatItem {
  label: string;
  value: string;
  percentage: number;
  icon: React.ComponentType<any>;
  color: string;
  description?: string;
}

export interface QuickStat {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

export type UrgencyLevel = 'normal' | 'warning' | 'urgent';

export type AnimationType = 'pulse' | 'flicker' | 'timerGlow' | 'progressPulse' | 'urgentBlink' | 'digitalFlicker';

// ============================================================================
// API & DATA TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface FilterOptions {
  status?: ClientStatus[];
  spaceType?: SpaceType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface SortOptions {
  field: keyof Client;
  direction: 'asc' | 'desc';
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface ClientFormData {
  name: string;
  remarks: string;
  duration: number;
  spaceType: SpaceType;
  payment: number;
}

export interface ClientFormErrors {
  name?: string;
  duration?: string;
  spaceType?: string;
  payment?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SettingsFormData {
  autoLockTime: number;
  notifications: boolean;
  theme: 'dark' | 'light';
  language: string;
}

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface ClientEvent {
  type: 'created' | 'updated' | 'started' | 'completed' | 'deleted';
  clientId: number;
  timestamp: Date;
  data?: Partial<Client>;
}

export interface SystemEvent {
  type: 'lock_changed' | 'stats_updated' | 'error' | 'warning';
  timestamp: Date;
  data?: any;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface AppConfig {
  apiUrl: string;
  wsUrl: string;
  refreshInterval: number;
  autoSave: boolean;
  theme: {
    primary: string;
    secondary: string;
    mode: 'dark' | 'light';
  };
}

export interface FeatureFlags {
  realTimeUpdates: boolean;
  smartLock: boolean;
  analytics: boolean;
  floorPlan: boolean;
  notifications: boolean;
}

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

export interface NavItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  path?: string;
  badge?: string | number;
  disabled?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  current?: boolean;
}

// ============================================================================
// THEME TYPES
// ============================================================================

export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  fonts: {
    primary: string;
    mono: string;
  };
  spacing: {
    [key: string]: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// ============================================================================
// LAYOUT TYPES
// ============================================================================

export interface LayoutProps {
  children: React.ReactNode;
  activeSessionsCount?: number;
  onLogout?: () => void;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
}

export interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationSchema {
  [field: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

// Re-export React types that are commonly used
export type { FC, ReactNode, ComponentType } from 'react';