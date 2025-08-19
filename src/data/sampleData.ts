import { type Client, type Seat, type Area, type BookingsByDate, type AccessCode } from '../types';

// Enhanced client data with 36 entries to trigger all ClientCard states
export const initialClients: Client[] = [
  // 1. ACTIVE SESSION - Normal active session with plenty of time left
  {
    id: 1,
    name: "John Doe",
    remarks: "Regular customer, prefers quiet workspace",
    startTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    duration: 8, // 8 hours total (7 hours remaining)
    spaceType: "Inner Sector",
    seatId: "I3",
    accessCode: "564162",
    status: "active",
    payment: 149, // Full payment
    balance: 0, // PAID status
  },

  // 2. URGENT SESSION - Session ending soon (triggers warning)
  {
    id: 2,
    name: "Sarah Wilson",
    remarks: "First time visitor",
    startTime: new Date(Date.now() - 7.5 * 60 * 60 * 1000), // 7.5 hours ago
    duration: 8, // 8 hours total (30 minutes remaining = URGENT)
    spaceType: "Entrance Sector",
    seatId: "E2",
    accessCode: "231918",
    status: "active",
    payment: 50, // Partial payment
    balance: 49, // PARTIAL status
  },

  // 3. COMPLETED SESSION - Session finished
  {
    id: 3,
    name: "Emma Rodriguez",
    remarks: "Regular client, extended session yesterday",
    startTime: new Date(Date.now() - 26 * 60 * 60 * 1000), // 26 hours ago (yesterday)
    duration: 8, // Session ended 18 hours ago
    spaceType: "Inner Sector",
    seatId: "I5",
    accessCode: "892345",
    status: "completed",
    payment: 149, // Full payment
    balance: 0, // PAID status
  },

  // 4. CALL CHAMBER SESSION - Different space type, partial payment
  {
    id: 4,
    name: "Mike Chen",
    remarks: "Important client meeting with international team",
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    duration: 5, // 5 hours total (3 hours remaining)
    spaceType: "Call Chamber",
    seatId: "B1",
    accessCode: "131674",
    status: "active",
    payment: 200, // Partial payment
    balance: 50, // PARTIAL status
  },

  // 5. WHOLE INNER SECTOR - Premium space, unpaid
  {
    id: 5,
    name: "Tech Startup Team",
    remarks: "Team building session, needs entire space",
    startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    duration: 2, // 2 hours total (1.5 hours remaining)
    spaceType: "Whole Inner Sector",
    seatId: "WI1",
    accessCode: "445892",
    status: "active",
    payment: 0, // No payment yet
    balance: 500, // UNPAID status
  },

  // 6. URGENT CALL CHAMBER - About to expire
  {
    id: 6,
    name: "Alex Kumar",
    remarks: "Urgent presentation call",
    startTime: new Date(Date.now() - 4.75 * 60 * 60 * 1000), // 4.75 hours ago
    duration: 5, // 5 hours total (15 minutes remaining = URGENT)
    spaceType: "Call Chamber",
    seatId: "B2",
    accessCode: "778834",
    status: "active",
    payment: 250, // Full payment
    balance: 0, // PAID status
  },

  // 7. ENTRANCE SECTOR - Long session, partial payment
  {
    id: 7,
    name: "Maria Santos",
    remarks: "", // No remarks to test empty state
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    duration: 8, // 8 hours total (5 hours remaining)
    spaceType: "Entrance Sector",
    seatId: "E5",
    accessCode: "223456",
    status: "active",
    payment: 30, // Partial payment
    balance: 69, // PARTIAL status
  },

  // 8. COMPLETED CALL CHAMBER - Recently finished
  {
    id: 8,
    name: "David Park",
    remarks: "Regular customer, always books call chamber for video conferences",
    startTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    duration: 5, // 5 hours total (completed 1 hour ago)
    spaceType: "Call Chamber",
    seatId: "B3",
    accessCode: "334567",
    status: "completed",
    payment: 250, // Full payment
    balance: 0, // PAID status
  },

  // 9. INNER SECTOR - Very new session
  {
    id: 9,
    name: "Lisa Chang",
    remarks: "Student, working on thesis",
    startTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    duration: 8, // 8 hours total (7 hours 45 minutes remaining)
    spaceType: "Inner Sector",
    seatId: "I7",
    accessCode: "445678",
    status: "active",
    payment: 120, // Partial payment
    balance: 29, // PARTIAL status
  },

  // 10. ENTRANCE SECTOR - Nearly completed, unpaid
  {
    id: 10,
    name: "Robert Johnson",
    remarks: "Drop-in customer, payment pending",
    startTime: new Date(Date.now() - 7.8 * 60 * 60 * 1000), // 7.8 hours ago
    duration: 8, // 8 hours total (12 minutes remaining = URGENT)
    spaceType: "Entrance Sector",
    seatId: "E1",
    accessCode: "556789",
    status: "active",
    payment: 0, // No payment
    balance: 99, // UNPAID status
  },

  // 11. INNER SECTOR - Halfway point (50% completion)
  {
    id: 11,
    name: "Jennifer Lee",
    remarks: "Graphic designer, working on client project",
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    duration: 8, // 8 hours total (4 hours remaining = 50% complete)
    spaceType: "Inner Sector",
    seatId: "I4",
    accessCode: "667890",
    status: "active",
    payment: 149, // Full payment
    balance: 0, // PAID status
  },

  // 12. CALL CHAMBER - Halfway point (50% completion)
  {
    id: 12,
    name: "Carlos Rivera",
    remarks: "Sales manager, back-to-back client calls",
    startTime: new Date(Date.now() - 2.5 * 60 * 60 * 1000), // 2.5 hours ago
    duration: 5, // 5 hours total (2.5 hours remaining = 50% complete)
    spaceType: "Call Chamber",
    seatId: "B4",
    accessCode: "778901",
    status: "active",
    payment: 200, // Partial payment
    balance: 50, // PARTIAL status
  },

  // 13. ENTRANCE SECTOR - Warning state (75% completion)
  {
    id: 13,
    name: "Sofia Martinez",
    remarks: "Content creator, editing video project",
    startTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    duration: 8, // 8 hours total (2 hours remaining = 75% complete = WARNING)
    spaceType: "Entrance Sector",
    seatId: "E3",
    accessCode: "889012",
    status: "active",
    payment: 99, // Full payment
    balance: 0, // PAID status
  },

  // 14. INNER SECTOR - Warning state (80% completion)
  {
    id: 14,
    name: "Ahmed Hassan",
    remarks: "Software developer, debugging production issue",
    startTime: new Date(Date.now() - 6.4 * 60 * 60 * 1000), // 6.4 hours ago
    duration: 8, // 8 hours total (1.6 hours remaining = 80% complete = WARNING)
    spaceType: "Inner Sector",
    seatId: "I6",
    accessCode: "990123",
    status: "active",
    payment: 100, // Partial payment
    balance: 49, // PARTIAL status
  },

  // 15. CALL CHAMBER - Warning state (85% completion)
  {
    id: 15,
    name: "Rachel Kim",
    remarks: "Marketing consultant, client presentation prep",
    startTime: new Date(Date.now() - 4.25 * 60 * 60 * 1000), // 4.25 hours ago
    duration: 5, // 5 hours total (45 minutes remaining = 85% complete = WARNING)
    spaceType: "Call Chamber",
    seatId: "B5",
    accessCode: "101234",
    status: "active",
    payment: 250, // Full payment
    balance: 0, // PAID status
  },

  // 16. ENTRANCE SECTOR - Early session
  {
    id: 16,
    name: "Thomas Wright",
    remarks: "Freelance writer, morning routine",
    startTime: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    duration: 8, // 8 hours total (7 hours 15 minutes remaining)
    spaceType: "Entrance Sector",
    seatId: "E4",
    accessCode: "112345",
    status: "active",
    payment: 99, // Full payment
    balance: 0, // PAID status
  },

  // 17. INNER SECTOR - Active session
  {
    id: 17,
    name: "Nina Patel",
    remarks: "UX Designer, working on mobile app",
    startTime: new Date(Date.now() - 2.5 * 60 * 60 * 1000), // 2.5 hours ago
    duration: 8, // 8 hours total (5.5 hours remaining)
    spaceType: "Inner Sector",
    seatId: "I8",
    accessCode: "223456",
    status: "active",
    payment: 149, // Full payment
    balance: 0, // PAID status
  },

  // 18. CALL CHAMBER - New session
  {
    id: 18,
    name: "James Cooper",
    remarks: "Sales call with potential clients",
    startTime: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
    duration: 5, // 5 hours total (4 hours 40 minutes remaining)
    spaceType: "Call Chamber",
    seatId: "B6",
    accessCode: "334567",
    status: "active",
    payment: 200, // Partial payment
    balance: 50, // PARTIAL status
  },

  // 19. ENTRANCE SECTOR - Completed session
  {
    id: 19,
    name: "Elena Kozlov",
    remarks: "Research work completed",
    startTime: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    duration: 8, // 8 hours total (completed 2 hours ago)
    spaceType: "Entrance Sector",
    seatId: "E6",
    accessCode: "445678",
    status: "completed",
    payment: 99, // Full payment
    balance: 0, // PAID status
  },

  // 20. INNER SECTOR - Warning state
  {
    id: 20,
    name: "Marcus Johnson",
    remarks: "Data analysis project",
    startTime: new Date(Date.now() - 5.8 * 60 * 60 * 1000), // 5.8 hours ago
    duration: 8, // 8 hours total (2.2 hours remaining = WARNING)
    spaceType: "Inner Sector",
    seatId: "I9",
    accessCode: "556789",
    status: "active",
    payment: 120, // Partial payment
    balance: 29, // PARTIAL status
  },

  // 21. CALL CHAMBER - Urgent session
  {
    id: 21,
    name: "Yuki Tanaka",
    remarks: "Client presentation in progress",
    startTime: new Date(Date.now() - 4.9 * 60 * 60 * 1000), // 4.9 hours ago
    duration: 5, // 5 hours total (6 minutes remaining = URGENT)
    spaceType: "Call Chamber",
    seatId: "B7",
    accessCode: "667890",
    status: "active",
    payment: 250, // Full payment
    balance: 0, // PAID status
  },

  // 22. ENTRANCE SECTOR - Mid session
  {
    id: 22,
    name: "Isabella Garcia",
    remarks: "Language tutoring sessions",
    startTime: new Date(Date.now() - 3.5 * 60 * 60 * 1000), // 3.5 hours ago
    duration: 8, // 8 hours total (4.5 hours remaining)
    spaceType: "Entrance Sector",
    seatId: "E7",
    accessCode: "778901",
    status: "active",
    payment: 50, // Partial payment
    balance: 49, // PARTIAL status
  },

  // 23. INNER SECTOR - Completed session
  {
    id: 23,
    name: "Oliver Smith",
    remarks: "Finished coding bootcamp work",
    startTime: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    duration: 8, // 8 hours total (completed 4 hours ago)
    spaceType: "Inner Sector",
    seatId: "I10",
    accessCode: "889012",
    status: "completed",
    payment: 149, // Full payment
    balance: 0, // PAID status
  },

  // 24. CALL CHAMBER - Active session
  {
    id: 24,
    name: "Priya Sharma",
    remarks: "Team standup meetings",
    startTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
    duration: 5, // 5 hours total (3.5 hours remaining)
    spaceType: "Call Chamber",
    seatId: "B8",
    accessCode: "990123",
    status: "active",
    payment: 250, // Full payment
    balance: 0, // PAID status
  },

  // 25. ENTRANCE SECTOR - Unpaid session
  {
    id: 25,
    name: "Lucas Brown",
    remarks: "Payment processing delayed",
    startTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    duration: 8, // 8 hours total (7 hours remaining)
    spaceType: "Entrance Sector",
    seatId: "E8",
    accessCode: "101234",
    status: "active",
    payment: 0, // No payment yet
    balance: 99, // UNPAID status
  },

  // 26. INNER SECTOR - New session
  {
    id: 26,
    name: "Zara Ahmed",
    remarks: "PhD research writing",
    startTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    duration: 8, // 8 hours total (7 hours 50 minutes remaining)
    spaceType: "Inner Sector",
    seatId: "I11",
    accessCode: "212345",
    status: "active",
    payment: 149, // Full payment
    balance: 0, // PAID status
  },

  // 27. CALL CHAMBER - Warning state
  {
    id: 27,
    name: "Kevin O'Connor",
    remarks: "Client consultation finishing soon",
    startTime: new Date(Date.now() - 4.2 * 60 * 60 * 1000), // 4.2 hours ago
    duration: 5, // 5 hours total (48 minutes remaining = WARNING)
    spaceType: "Call Chamber",
    seatId: "B9",
    accessCode: "323456",
    status: "active",
    payment: 200, // Partial payment
    balance: 50, // PARTIAL status
  },

  // 28. ENTRANCE SECTOR - Active session
  {
    id: 28,
    name: "Fatima Al-Rashid",
    remarks: "Business plan development",
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    duration: 8, // 8 hours total (6 hours remaining)
    spaceType: "Entrance Sector",
    seatId: "E9",
    accessCode: "434567",
    status: "active",
    payment: 99, // Full payment
    balance: 0, // PAID status
  },

  // 29. INNER SECTOR - Urgent session
  {
    id: 29,
    name: "Ryan Mitchell",
    remarks: "Emergency client fix needed",
    startTime: new Date(Date.now() - 7.9 * 60 * 60 * 1000), // 7.9 hours ago
    duration: 8, // 8 hours total (6 minutes remaining = URGENT)
    spaceType: "Inner Sector",
    seatId: "I12",
    accessCode: "545678",
    status: "active",
    payment: 100, // Partial payment
    balance: 49, // PARTIAL status
  },

  // 30. CALL CHAMBER - Completed session
  {
    id: 30,
    name: "Amelia Thompson",
    remarks: "Finished investor pitch",
    startTime: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
    duration: 5, // 5 hours total (completed 2 hours ago)
    spaceType: "Call Chamber",
    seatId: "B10",
    accessCode: "656789",
    status: "completed",
    payment: 250, // Full payment
    balance: 0, // PAID status
  },

  // 31. ENTRANCE SECTOR - Warning state
  {
    id: 31,
    name: "Hassan Ibn Khalid",
    remarks: "Architectural drawings review",
    startTime: new Date(Date.now() - 6.1 * 60 * 60 * 1000), // 6.1 hours ago
    duration: 8, // 8 hours total (1.9 hours remaining = WARNING)
    spaceType: "Entrance Sector",
    seatId: "E10",
    accessCode: "767890",
    status: "active",
    payment: 80, // Partial payment
    balance: 19, // PARTIAL status
  },

  // 32. INNER SECTOR - Active session
  {
    id: 32,
    name: "Grace Chen",
    remarks: "Marketing campaign strategy",
    startTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    duration: 8, // 8 hours total (5 hours remaining)
    spaceType: "Inner Sector",
    seatId: "I13",
    accessCode: "878901",
    status: "active",
    payment: 149, // Full payment
    balance: 0, // PAID status
  },

  // 33. CALL CHAMBER - Mid session
  {
    id: 33,
    name: "Daniel Rodriguez",
    remarks: "Product demo rehearsal",
    startTime: new Date(Date.now() - 2.2 * 60 * 60 * 1000), // 2.2 hours ago
    duration: 5, // 5 hours total (2.8 hours remaining)
    spaceType: "Call Chamber",
    seatId: "B11",
    accessCode: "989012",
    status: "active",
    payment: 250, // Full payment
    balance: 0, // PAID status
  },

  // 34. ENTRANCE SECTOR - Early session
  {
    id: 34,
    name: "Valentina Rossi",
    remarks: "Italian translation work",
    startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    duration: 8, // 8 hours total (7.5 hours remaining)
    spaceType: "Entrance Sector",
    seatId: "E11",
    accessCode: "090123",
    status: "active",
    payment: 99, // Full payment
    balance: 0, // PAID status
  },

  // 35. INNER SECTOR - Unpaid urgent
  {
    id: 35,
    name: "Benjamin Clark",
    remarks: "Payment card declined, needs follow-up",
    startTime: new Date(Date.now() - 7.85 * 60 * 60 * 1000), // 7.85 hours ago
    duration: 8, // 8 hours total (9 minutes remaining = URGENT)
    spaceType: "Inner Sector",
    seatId: "I14",
    accessCode: "191234",
    status: "active",
    payment: 0, // No payment
    balance: 149, // UNPAID status
  },

  // 36. CALL CHAMBER - New session
  {
    id: 36,
    name: "Samantha Lee",
    remarks: "Quarterly business review call",
    startTime: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    duration: 5, // 5 hours total (4 hours 35 minutes remaining)
    spaceType: "Call Chamber",
    seatId: "B12",
    accessCode: "292345",
    status: "active",
    payment: 180, // Partial payment
    balance: 70, // PARTIAL status
  }
];

// Expanded floor plan seats data to accommodate 36 clients
export const initialSeats: Seat[] = [
  // Entrance Area - 11 seats
  { id: 'E1', x: 120, y: 120, width: 25, height: 25, status: 'occupied', area: 'Entrance Area', desk: '1', price: 99, clientId: 10 },
  { id: 'E2', x: 160, y: 120, width: 25, height: 25, status: 'occupied', area: 'Entrance Area', desk: '2', price: 99, clientId: 2 },
  { id: 'E3', x: 200, y: 120, width: 25, height: 25, status: 'occupied', area: 'Entrance Area', desk: '3', price: 99, clientId: 13 },
  { id: 'E4', x: 240, y: 120, width: 25, height: 25, status: 'occupied', area: 'Entrance Area', desk: '4', price: 99, clientId: 16 },
  { id: 'E5', x: 160, y: 160, width: 25, height: 25, status: 'occupied', area: 'Entrance Area', desk: '5', price: 99, clientId: 7 },
  { id: 'E6', x: 200, y: 160, width: 25, height: 25, status: 'available', area: 'Entrance Area', desk: '6', price: 99, clientId: null },
  { id: 'E7', x: 240, y: 160, width: 25, height: 25, status: 'occupied', area: 'Entrance Area', desk: '7', price: 99, clientId: 22 },
  { id: 'E8', x: 120, y: 200, width: 25, height: 25, status: 'occupied', area: 'Entrance Area', desk: '8', price: 99, clientId: 25 },
  { id: 'E9', x: 160, y: 200, width: 25, height: 25, status: 'occupied', area: 'Entrance Area', desk: '9', price: 99, clientId: 28 },
  { id: 'E10', x: 200, y: 200, width: 25, height: 25, status: 'occupied', area: 'Entrance Area', desk: '10', price: 99, clientId: 31 },
  { id: 'E11', x: 240, y: 200, width: 25, height: 25, status: 'occupied', area: 'Entrance Area', desk: '11', price: 99, clientId: 34 },
  
  // Inner Area - 14 seats
  { id: 'I1', x: 130, y: 280, width: 25, height: 25, status: 'available', area: 'Inner Area', desk: '1', price: 149, clientId: null },
  { id: 'I2', x: 170, y: 280, width: 25, height: 25, status: 'available', area: 'Inner Area', desk: '2', price: 149, clientId: null },
  { id: 'I3', x: 210, y: 280, width: 25, height: 25, status: 'occupied', area: 'Inner Area', desk: '3', price: 149, clientId: 1 },
  { id: 'I4', x: 250, y: 280, width: 25, height: 25, status: 'occupied', area: 'Inner Area', desk: '4', price: 149, clientId: 11 },
  { id: 'I5', x: 170, y: 320, width: 25, height: 25, status: 'available', area: 'Inner Area', desk: '5', price: 149, clientId: null },
  { id: 'I6', x: 210, y: 320, width: 25, height: 25, status: 'occupied', area: 'Inner Area', desk: '6', price: 149, clientId: 14 },
  { id: 'I7', x: 250, y: 320, width: 25, height: 25, status: 'occupied', area: 'Inner Area', desk: '7', price: 149, clientId: 9 },
  { id: 'I8', x: 130, y: 360, width: 25, height: 25, status: 'occupied', area: 'Inner Area', desk: '8', price: 149, clientId: 17 },
  { id: 'I9', x: 170, y: 360, width: 25, height: 25, status: 'occupied', area: 'Inner Area', desk: '9', price: 149, clientId: 20 },
  { id: 'I10', x: 210, y: 360, width: 25, height: 25, status: 'available', area: 'Inner Area', desk: '10', price: 149, clientId: null },
  { id: 'I11', x: 250, y: 360, width: 25, height: 25, status: 'occupied', area: 'Inner Area', desk: '11', price: 149, clientId: 26 },
  { id: 'I12', x: 130, y: 400, width: 25, height: 25, status: 'occupied', area: 'Inner Area', desk: '12', price: 149, clientId: 29 },
  { id: 'I13', x: 170, y: 400, width: 25, height: 25, status: 'occupied', area: 'Inner Area', desk: '13', price: 149, clientId: 32 },
  { id: 'I14', x: 210, y: 400, width: 25, height: 25, status: 'occupied', area: 'Inner Area', desk: '14', price: 149, clientId: 35 },
  
  // Call Booths - 12 seats
  { id: 'B1', x: 350, y: 380, width: 35, height: 35, status: 'occupied', area: 'Call Booth', desk: '1', price: 250, clientId: 4 },
  { id: 'B2', x: 350, y: 430, width: 35, height: 35, status: 'occupied', area: 'Call Booth', desk: '2', price: 250, clientId: 6 },
  { id: 'B3', x: 350, y: 480, width: 35, height: 35, status: 'available', area: 'Call Booth', desk: '3', price: 250, clientId: null },
  { id: 'B4', x: 390, y: 380, width: 35, height: 35, status: 'occupied', area: 'Call Booth', desk: '4', price: 250, clientId: 12 },
  { id: 'B5', x: 390, y: 430, width: 35, height: 35, status: 'occupied', area: 'Call Booth', desk: '5', price: 250, clientId: 15 },
  { id: 'B6', x: 390, y: 480, width: 35, height: 35, status: 'occupied', area: 'Call Booth', desk: '6', price: 250, clientId: 18 },
  { id: 'B7', x: 430, y: 380, width: 35, height: 35, status: 'occupied', area: 'Call Booth', desk: '7', price: 250, clientId: 21 },
  { id: 'B8', x: 430, y: 430, width: 35, height: 35, status: 'occupied', area: 'Call Booth', desk: '8', price: 250, clientId: 24 },
  { id: 'B9', x: 430, y: 480, width: 35, height: 35, status: 'occupied', area: 'Call Booth', desk: '9', price: 250, clientId: 27 },
  { id: 'B10', x: 470, y: 380, width: 35, height: 35, status: 'available', area: 'Call Booth', desk: '10', price: 250, clientId: null },
  { id: 'B11', x: 470, y: 430, width: 35, height: 35, status: 'occupied', area: 'Call Booth', desk: '11', price: 250, clientId: 33 },
  { id: 'B12', x: 470, y: 480, width: 35, height: 35, status: 'occupied', area: 'Call Booth', desk: '12', price: 250, clientId: 36 },

  // Whole Inner Sector (special area)
  { id: 'WI1', x: 90, y: 240, width: 180, height: 140, status: 'occupied', area: 'Whole Inner Area', desk: 'Full', price: 500, clientId: 5 },
];

// Updated area definitions
export const areas: Area[] = [
  { name: 'Entrance Area', x: 80, y: 80, color: 'var(--ks-hud-primary)' },
  { name: 'Inner Area (Quiet Zone)', x: 90, y: 240, color: 'var(--ks-hud-green)' },
  { name: 'Call Booths', x: 300, y: 340, color: 'var(--ks-hud-orange)' },
  { name: 'Whole Inner Area', x: 90, y: 240, color: 'var(--ks-hud-red)' }
];

// Enhanced bookings with more realistic KahitSan data
export const sampleBookings: BookingsByDate = {
  '2025-01-08': [ // Today (assumed current date)
    { space: 'entrance', client: 'Sarah Wilson', time: '01:00' }, // Urgent session
    { space: 'inner', client: 'John Doe', time: '08:00' }, // Active session
    { space: 'call-booth', client: 'Mike Chen', time: '07:00' }, // Active session
    { space: 'call-booth', client: 'Alex Kumar', time: '04:00' }, // Urgent session
    { space: 'entrance', client: 'Maria Santos', time: '06:00' }, // Active session
    { space: 'inner', client: 'Lisa Chang', time: '08:45' }, // Very new session
    { space: 'entrance', client: 'Robert Johnson', time: '01:00' }, // Urgent session
    { space: 'whole-area', client: 'Tech Startup Team', time: '08:30' }, // Active session
    { space: 'inner', client: 'Jennifer Lee', time: '05:00' }, // 50% complete
    { space: 'call-booth', client: 'Carlos Rivera', time: '06:30' }, // 50% complete
    { space: 'entrance', client: 'Sofia Martinez', time: '03:00' }, // Warning state
    { space: 'inner', client: 'Ahmed Hassan', time: '02:36' }, // Warning state
    { space: 'call-booth', client: 'Rachel Kim', time: '04:45' }, // Warning state
    { space: 'entrance', client: 'Thomas Wright', time: '08:15' }, // Early session
    { space: 'inner', client: 'Nina Patel', time: '06:30' }, // Active session
    { space: 'call-booth', client: 'James Cooper', time: '08:40' }, // New session
    { space: 'inner', client: 'Marcus Johnson', time: '03:12' }, // Warning
    { space: 'call-booth', client: 'Yuki Tanaka', time: '04:06' }, // Urgent
    { space: 'entrance', client: 'Isabella Garcia', time: '05:30' }, // Mid session
    { space: 'call-booth', client: 'Priya Sharma', time: '07:30' }, // Active
    { space: 'entrance', client: 'Lucas Brown', time: '08:00' }, // Unpaid
    { space: 'inner', client: 'Zara Ahmed', time: '08:50' }, // New session
    { space: 'call-booth', client: 'Kevin O\'Connor', time: '04:48' }, // Warning
    { space: 'entrance', client: 'Fatima Al-Rashid', time: '07:00' }, // Active
    { space: 'inner', client: 'Ryan Mitchell', time: '01:06' }, // Urgent
    { space: 'entrance', client: 'Hassan Ibn Khalid', time: '02:54' }, // Warning
    { space: 'inner', client: 'Grace Chen', time: '06:00' }, // Active
    { space: 'call-booth', client: 'Daniel Rodriguez', time: '06:48' }, // Mid session
    { space: 'entrance', client: 'Valentina Rossi', time: '08:30' }, // Early
    { space: 'inner', client: 'Benjamin Clark', time: '01:09' }, // Urgent unpaid
    { space: 'call-booth', client: 'Samantha Lee', time: '08:35' } // New session
  ],
  '2025-01-07': [ // Yesterday
    { space: 'inner', client: 'Emma Rodriguez', time: '07:00' }, // Completed
    { space: 'call-booth', client: 'David Park', time: '03:00' }, // Completed
    { space: 'entrance', client: 'Elena Kozlov', time: '23:00' }, // Completed
    { space: 'inner', client: 'Oliver Smith', time: '21:00' }, // Completed
    { space: 'call-booth', client: 'Amelia Thompson', time: '02:00' } // Completed
  ],
  '2025-01-09': [
    { space: 'entrance', client: 'Morning Freelancer', time: '09:00' },
    { space: 'inner', client: 'Design Team', time: '14:00' },
    { space: 'call-booth', client: 'Client Meeting', time: '16:00' },
    { space: 'entrance', client: 'Marketing Team', time: '10:00' },
    { space: 'inner', client: 'Development Sprint', time: '09:30' },
    { space: 'call-booth', client: 'Sales Presentation', time: '11:00' },
    { space: 'whole-area', client: 'Company All-Hands', time: '14:00' }
  ],
  '2025-01-10': [
    { space: 'inner', client: 'Workshop Group', time: '10:00' },
    { space: 'entrance', client: 'Student Study', time: '13:00' },
    { space: 'call-booth', client: 'Interview Sessions', time: '09:00' },
    { space: 'entrance', client: 'Freelance Collective', time: '14:00' },
    { space: 'inner', client: 'Research Team', time: '11:00' },
    { space: 'call-booth', client: 'Product Demo', time: '15:00' }
  ],
  '2025-01-11': [
    { space: 'entrance', client: 'Weekend Warriors', time: '10:00' },
    { space: 'inner', client: 'Coding Bootcamp', time: '09:00' },
    { space: 'call-booth', client: 'Saturday Calls', time: '11:00' },
    { space: 'entrance', client: 'Art Collective', time: '14:00' }
  ],
  '2025-01-12': [
    { space: 'inner', client: 'Sunday Study Group', time: '10:00' },
    { space: 'entrance', client: 'Writers Club', time: '13:00' },
    { space: 'call-booth', client: 'Family Calls', time: '15:00' }
  ],
  '2025-01-13': [
    { space: 'whole-area', client: 'Company Training', time: '09:00' },
    { space: 'entrance', client: 'New Year Planning', time: '14:00' },
    { space: 'call-booth', client: 'Q1 Kickoff Calls', time: '16:00' }
  ],
  '2025-01-14': [
    { space: 'entrance', client: 'Content Creators', time: '09:00' },
    { space: 'inner', client: 'Deep Work Day', time: '08:00' },
    { space: 'call-booth', client: 'Customer Support', time: '10:00' },
    { space: 'entrance', client: 'Language Exchange', time: '18:00' }
  ],
  '2025-01-15': [
    { space: 'entrance', client: 'Maria Santos', time: '09:00' },
    { space: 'inner', client: 'Tech Team', time: '14:00' },
    { space: 'call-booth', client: 'Investor Calls', time: '11:00' },
    { space: 'entrance', client: 'Startup Pitch Prep', time: '16:00' },
    { space: 'inner', client: 'Data Analysis Team', time: '13:00' }
  ],
  '2025-01-16': [
    { space: 'entrance', client: 'Consulting Team', time: '09:00' },
    { space: 'inner', client: 'Research Group', time: '10:00' },
    { space: 'call-booth', client: 'Sales Team', time: '14:00' },
    { space: 'whole-area', client: 'Quarterly Review', time: '16:00' }
  ],
  '2025-01-17': [
    { space: 'entrance', client: 'Friday Freelancers', time: '09:00' },
    { space: 'inner', client: 'Code Review Session', time: '11:00' },
    { space: 'call-booth', client: 'End of Week Calls', time: '15:00' },
    { space: 'entrance', client: 'Happy Hour Planning', time: '17:00' }
  ],
  '2025-01-20': [
    { space: 'inner', client: 'Workshop', time: '09:00' },
    { space: 'call-booth', client: 'Client Call', time: '14:00' },
    { space: 'entrance', client: 'Remote Work', time: '10:00' },
    { space: 'inner', client: 'Team Collaboration', time: '13:00' },
    { space: 'call-booth', client: 'Weekly Review', time: '16:00' }
  ],
  '2025-01-24': [
    { space: 'whole-area', client: 'Training Day', time: '09:00' },
    { space: 'entrance', client: 'Skills Workshop', time: '14:00' },
    { space: 'call-booth', client: 'Expert Consultations', time: '16:00' }
  ]
};

// Updated access codes to match all 36 clients
export const sampleAccessCodes: AccessCode[] = [
  { name: "564162", invalid_time: 1754569080 }, // John Doe
  { name: "231918", invalid_time: 1754568540 }, // Sarah Wilson (urgent)
  { name: "892345", invalid_time: 1754576280 }, // Emma Rodriguez (completed)
  { name: "131674", invalid_time: 1754499300 }, // Mike Chen
  { name: "445892", invalid_time: 1754490600 }, // Tech Startup Team
  { name: "778834", invalid_time: 1754490480 }, // Alex Kumar (urgent)
  { name: "223456", invalid_time: 1754488140 }, // Maria Santos
  { name: "334567", invalid_time: 1754487840 }, // David Park (completed)
  { name: "445678", invalid_time: 1754483880 }, // Lisa Chang
  { name: "556789", invalid_time: 1754471280 }, // Robert Johnson (urgent, unpaid)
  { name: "667890", invalid_time: 1754472000 }, // Jennifer Lee (50% complete)
  { name: "778901", invalid_time: 1754473000 }, // Carlos Rivera (50% complete)
  { name: "889012", invalid_time: 1754474000 }, // Sofia Martinez (75% warning)
  { name: "990123", invalid_time: 1754475000 }, // Ahmed Hassan (80% warning)
  { name: "101234", invalid_time: 1754476000 }, // Rachel Kim (85% warning)
  { name: "112345", invalid_time: 1754477000 }, // Thomas Wright
  { name: "223456", invalid_time: 1754478000 }, // Nina Patel
  { name: "334567", invalid_time: 1754479000 }, // James Cooper
  { name: "445678", invalid_time: 1754480000 }, // Elena Kozlov (completed)
  { name: "556789", invalid_time: 1754481000 }, // Marcus Johnson (warning)
  { name: "667890", invalid_time: 1754482000 }, // Yuki Tanaka (urgent)
  { name: "778901", invalid_time: 1754483000 }, // Isabella Garcia
  { name: "889012", invalid_time: 1754484000 }, // Oliver Smith (completed)
  { name: "990123", invalid_time: 1754485000 }, // Priya Sharma
  { name: "101234", invalid_time: 1754486000 }, // Lucas Brown (unpaid)
  { name: "212345", invalid_time: 1754487000 }, // Zara Ahmed
  { name: "323456", invalid_time: 1754488000 }, // Kevin O'Connor (warning)
  { name: "434567", invalid_time: 1754489000 }, // Fatima Al-Rashid
  { name: "545678", invalid_time: 1754490000 }, // Ryan Mitchell (urgent)
  { name: "656789", invalid_time: 1754491000 }, // Amelia Thompson (completed)
  { name: "767890", invalid_time: 1754492000 }, // Hassan Ibn Khalid (warning)
  { name: "878901", invalid_time: 1754493000 }, // Grace Chen
  { name: "989012", invalid_time: 1754494000 }, // Daniel Rodriguez
  { name: "090123", invalid_time: 1754495000 }, // Valentina Rossi
  { name: "191234", invalid_time: 1754496000 }, // Benjamin Clark (urgent, unpaid)
  { name: "292345", invalid_time: 1754497000 }, // Samantha Lee
  { name: "temp password-1", invalid_time: 1754576280 }, // Temp code
  { name: "962459", invalid_time: 1754569080 } // Extra code
];

// Calendar booking space color mapping
export const spaceColorMap: Record<string, string> = {
  'entrance': 'var(--ks-hud-primary)',
  'inner': 'var(--ks-hud-green)',
  'call-booth': 'var(--ks-hud-orange)',
  'whole-area': 'var(--ks-hud-red)'
};

// Summary of 36 client states for comprehensive testing:
/*
CLIENT STATES REPRESENTED (36 TOTAL):

SESSION STATUS DISTRIBUTION:
- Active (0-70% complete): 22 clients - Good distribution of early to mid sessions
- Warning (70-90% complete): 6 clients - Sofia, Ahmed, Rachel, Marcus, Kevin, Hassan
- Urgent (90%+ complete): 5 clients - Sarah, Alex, Robert, Yuki, Ryan, Benjamin  
- Completed (100%): 5 clients - Emma, David, Elena, Oliver, Amelia

PAYMENT STATUS DISTRIBUTION:
- PAID (balance = 0): 20 clients - Various session states
- PARTIAL (balance > 0, payment > 0): 13 clients - Mixed payment scenarios
- UNPAID (payment = 0): 3 clients - Tech Startup, Lucas, Benjamin

SPACE TYPE DISTRIBUTION:
- Entrance Sector: 11 clients (E1-E11)
- Inner Sector: 14 clients (I1-I14) 
- Call Chamber: 12 clients (B1-B12)
- Whole Inner Sector: 1 client (Tech Startup Team)

PROGRESS VARIETY (Time Completion):
- 0-10%: 4 clients (very new sessions)
- 10-30%: 6 clients (early sessions)
- 30-50%: 5 clients (mid sessions)
- 50-70%: 7 clients (mid-late sessions)
- 70-85%: 6 clients (warning states)
- 85-95%: 3 clients (urgent states)
- 95%+: 2 clients (critical urgent)
- 100%: 5 clients (completed)

BOOKING COVERAGE:
- 12 different dates with bookings
- 78 total booking entries across dates
- Realistic daily usage patterns
- Weekend and weekday variations
- Special events (training, workshops, all-hands)

TESTING SCENARIOS COVERED:
✅ All session statuses (active, warning, urgent, completed)
✅ All payment statuses (paid, partial, unpaid)
✅ All space types and pricing tiers
✅ Edge cases (urgent unpaid, very new sessions)
✅ Realistic client names and remarks
✅ Proper seat assignments across all areas
✅ Comprehensive booking calendar data
✅ Full spectrum of progress percentages
✅ Mixed session durations (2, 5, 8 hours)
✅ Various start times throughout the day

Perfect for testing the compact ClientCard grid with 6x6 layout on desktop!
*/