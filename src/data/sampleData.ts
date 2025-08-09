import { type Client, type Seat, type Area, type BookingsByDate, type AccessCode } from '../types';

// Sample client data
export const initialClients: Client[] = [
  {
    id: 1,
    name: "John Doe",
    remarks: "Regular customer",
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    duration: 8,
    spaceType: "Inner",
    seatId: "I3",
    accessCode: "564162",
    status: "active",
    payment: 149,
    balance: 0
  },
  {
    id: 2,
    name: "Sarah Wilson",
    remarks: "First time visitor",
    startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    duration: 4,
    spaceType: "Entrance",
    seatId: "E2",
    accessCode: "231918",
    status: "active",
    payment: 99,
    balance: 0
  },
  {
    id: 3,
    name: "Mike Chen",
    remarks: "Meeting with team",
    startTime: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    duration: 5,
    spaceType: "Call Booth",
    seatId: "B2",
    accessCode: "131674",
    status: "active",
    payment: 250,
    balance: 0
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    remarks: "Regular client, prefers quiet area",
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    duration: 6,
    spaceType: "Inner",
    seatId: "I5",
    accessCode: "892345",
    status: "completed",
    payment: 149,
    balance: 0
  }
];

// Floor plan seats data
export const initialSeats: Seat[] = [
  // Entrance Area
  { id: 'E1', x: 120, y: 120, width: 25, height: 25, status: 'available', area: 'Entrance Area', desk: '1', price: 25, clientId: null },
  { id: 'E2', x: 160, y: 120, width: 25, height: 25, status: 'occupied', area: 'Entrance Area', desk: '2', price: 25, clientId: 2 },
  { id: 'E3', x: 200, y: 120, width: 25, height: 25, status: 'available', area: 'Entrance Area', desk: '3', price: 25, clientId: null },
  { id: 'E4', x: 120, y: 160, width: 25, height: 25, status: 'available', area: 'Entrance Area', desk: '4', price: 25, clientId: null },
  { id: 'E5', x: 160, y: 160, width: 25, height: 25, status: 'available', area: 'Entrance Area', desk: '5', price: 25, clientId: null },
  { id: 'E6', x: 200, y: 160, width: 25, height: 25, status: 'available', area: 'Entrance Area', desk: '6', price: 25, clientId: null },
  
  // Inner Area
  { id: 'I1', x: 130, y: 280, width: 25, height: 25, status: 'available', area: 'Inner Area', desk: '1', price: 30, clientId: null },
  { id: 'I2', x: 170, y: 280, width: 25, height: 25, status: 'available', area: 'Inner Area', desk: '2', price: 30, clientId: null },
  { id: 'I3', x: 210, y: 280, width: 25, height: 25, status: 'occupied', area: 'Inner Area', desk: '3', price: 30, clientId: 1 },
  { id: 'I4', x: 130, y: 320, width: 25, height: 25, status: 'available', area: 'Inner Area', desk: '4', price: 30, clientId: null },
  { id: 'I5', x: 170, y: 320, width: 25, height: 25, status: 'available', area: 'Inner Area', desk: '5', price: 30, clientId: null },
  { id: 'I6', x: 210, y: 320, width: 25, height: 25, status: 'available', area: 'Inner Area', desk: '6', price: 30, clientId: null },
  { id: 'I7', x: 130, y: 360, width: 25, height: 25, status: 'maintenance', area: 'Inner Area', desk: '7', price: 30, clientId: null },
  { id: 'I8', x: 170, y: 360, width: 25, height: 25, status: 'available', area: 'Inner Area', desk: '8', price: 30, clientId: null },
  
  // Call Booths
  { id: 'B1', x: 350, y: 380, width: 35, height: 35, status: 'available', area: 'Call Booth', desk: '1', price: 40, clientId: null },
  { id: 'B2', x: 350, y: 430, width: 35, height: 35, status: 'occupied', area: 'Call Booth', desk: '2', price: 40, clientId: 3 },
];

// Area definitions for floor plan
export const areas: Area[] = [
  { name: 'Entrance Area', x: 80, y: 80, color: 'var(--ks-hud-primary)' },
  { name: 'Inner Area (Quiet Zone)', x: 90, y: 240, color: 'var(--ks-hud-green)' },
  { name: 'Call Booths', x: 300, y: 340, color: 'var(--ks-hud-orange)' }
];

// Sample bookings for calendar
export const sampleBookings: BookingsByDate = {
  '2025-01-08': [ // Today (assumed current date)
    { space: 'entrance', client: 'Sarah Wilson', time: '09:00' },
    { space: 'inner', client: 'John Doe', time: '10:00' },
    { space: 'call-booth', client: 'Mike Chen', time: '14:00' }
  ],
  '2025-01-09': [
    { space: 'entrance', client: 'Morning Freelancer', time: '09:00' },
    { space: 'inner', client: 'Design Team', time: '14:00' },
    { space: 'call-booth', client: 'Client Meeting', time: '16:00' }
  ],
  '2025-01-10': [
    { space: 'inner', client: 'Workshop Group', time: '10:00' },
    { space: 'entrance', client: 'Student Study', time: '13:00' }
  ],
  '2025-01-13': [
    { space: 'whole-area', client: 'Company Training', time: '09:00' }
  ],
  '2025-01-15': [
    { space: 'entrance', client: 'Maria Santos', time: '09:00' },
    { space: 'inner', client: 'Tech Team', time: '14:00' }
  ],
  '2025-01-20': [
    { space: 'inner', client: 'Workshop', time: '09:00' },
    { space: 'call-booth', client: 'Client Call', time: '14:00' },
    { space: 'entrance', client: 'Remote Work', time: '10:00' }
  ],
  '2025-01-24': [
    { space: 'whole-area', client: 'Training Day', time: '09:00' }
  ]
};

// Sample access codes
export const sampleAccessCodes: AccessCode[] = [
  { name: "962459", invalid_time: 1754569080 },
  { name: "769287", invalid_time: 1754568540 },
  { name: "temp password-1", invalid_time: 1754576280 },
  { name: "332971", invalid_time: 1754499300 },
  { name: "582413", invalid_time: 1754490600 },
  { name: "564162", invalid_time: 1754490480 },
  { name: "231918", invalid_time: 1754488140 },
  { name: "131674", invalid_time: 1754487840 },
  { name: "244061", invalid_time: 1754483880 },
  { name: "895375", invalid_time: 1754471280 }
];

// Calendar booking space color mapping
export const spaceColorMap: Record<string, string> = {
  'entrance': 'var(--ks-hud-primary)',
  'inner': 'var(--ks-hud-green)',
  'call-booth': 'var(--ks-hud-orange)',
  'whole-area': 'var(--ks-hud-red)'
};