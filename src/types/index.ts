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

export type ClientStatus = 'active' | 'editing' | 'completed';

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

// Component Props Types
export interface HudButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'danger';
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}

export interface HudInputProps {
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'email';
  min?: number;
  max?: number;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export interface HudSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  disabled?: boolean;
}

export interface StatusBadgeProps {
  status: ClientStatus;
  children: React.ReactNode;
}

export interface ProgressBarProps {
  percentage: number;
  color?: string;
  className?: string;
}

export interface ClientCardProps {
  client: Client;
  onUpdate: (clientId: number, field: keyof Client, value: unknown) => void;
  onStart: (clientId: number) => void;
  onExtend: (clientId: number) => void;
  onComplete: (clientId: number) => void;
  onDelete: (clientId: number) => void;
  onShowOnMap: (clientId: number) => void;
}

export interface FloorPlanProps {
  seats: Seat[];
  areas: Area[];
  selectedClientId?: number | null;
  onSeatClick: (seat: Seat) => void;
}

export interface CalendarProps {
  bookings: BookingsByDate;
  currentMonth: Date;
  onDayClick: (date: string) => void;
}