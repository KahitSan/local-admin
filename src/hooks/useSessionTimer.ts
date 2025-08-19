// src/hooks/useSessionTimer.ts
import { useState, useEffect } from 'react';
import { type Client, type ClientStatus } from '../types';

// Extended session status to include warning state
type ExtendedSessionStatus = ClientStatus | 'warning' | 'urgent';

interface SessionTimer {
  timeRemaining: string;
  progress: number;
  isUrgent: boolean;
  isWarning: boolean;
  sessionStatus: ExtendedSessionStatus;
}

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return [h, m, s]
    .map(v => v.toString().padStart(2, '0'))
    .join(':');
};

export const useSessionTimer = (client: Client): SessionTimer => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (client.status === 'completed') {
      setSecondsRemaining(0);
      setProgress(100);
      return;
    }

    if (client.status === 'editing') {
      const totalSeconds = client.duration * 3600;
      setSecondsRemaining(totalSeconds);
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const startTime = new Date(client.startTime).getTime();
      const totalSessionTime = client.duration * 60 * 60 * 1000;
      const endTime = startTime + totalSessionTime;
      const remainingTime = endTime - now;
      const elapsed = now - startTime;

      const newSecondsRemaining = Math.max(0, Math.floor(remainingTime / 1000));
      const newProgress = Math.min(100, (elapsed / totalSessionTime) * 100);

      setSecondsRemaining(newSecondsRemaining);
      setProgress(newProgress);
    }, 1000);

    return () => clearInterval(interval);
  }, [client]);

  // Enhanced session status calculation with warning state
  const getSessionStatus = (currentProgress: number): ExtendedSessionStatus => {
    // Always respect the client's base status first
    if (client.status === 'completed') return 'completed';
    if (client.status === 'editing') return 'editing';
    
    // For active sessions, determine sub-status based on progress
    if (client.status === 'active') {
      if (currentProgress >= 90) return 'urgent';
      if (currentProgress >= 70) return 'warning';
      return 'active';
    }
    
    // Fallback to client's current status
    return client.status;
  };

  const sessionStatus = getSessionStatus(progress);
  const isUrgent = sessionStatus === 'urgent';
  const isWarning = sessionStatus === 'warning';
  const timeRemainingString = formatTime(secondsRemaining);

  return { 
    timeRemaining: timeRemainingString, 
    progress, 
    isUrgent, 
    isWarning,
    sessionStatus 
  };
};

// Helper function to get appropriate styling based on session status
export const getSessionStatusInfo = (sessionStatus: ExtendedSessionStatus) => {
  switch (sessionStatus) {
    case 'active':
      return {
        color: 'var(--ks-hud-green)',
        icon: 'Activity',
        label: 'ACTIVE',
        description: 'Session running normally'
      };
    case 'warning':
      return {
        color: 'var(--ks-hud-orange)',
        icon: 'AlertTriangle',
        label: 'WARNING',
        description: 'Session time running low'
      };
    case 'urgent':
      return {
        color: 'var(--ks-hud-red)',
        icon: 'Activity',
        label: 'URGENT',
        description: 'Session ending soon'
      };
    case 'completed':
      return {
        color: 'var(--ks-hud-secondary)',
        icon: 'Square',
        label: 'COMPLETED',
        description: 'Session finished'
      };
    case 'editing':
      return {
        color: 'var(--ks-hud-blue)',
        icon: 'Edit',
        label: 'EDITING',
        description: 'Setting up session'
      };
    default:
      return {
        color: 'var(--ks-hud-primary)',
        icon: 'Clock',
        label: 'UNKNOWN',
        description: 'Status unknown'
      };
  }
};

// Helper function to determine if session needs attention
export const needsAttention = (sessionStatus: ExtendedSessionStatus): boolean => {
  return sessionStatus === 'warning' || sessionStatus === 'urgent';
};

// Helper function to get time-based messaging
export const getTimeMessage = (sessionStatus: ExtendedSessionStatus, timeRemaining: string): string => {
  switch (sessionStatus) {
    case 'urgent':
      return '🚨 SESSION ENDING SOON';
    case 'warning':
      return '⚠️ SESSION TIME RUNNING LOW';
    case 'active':
      return `${timeRemaining} remaining`;
    case 'completed':
      return 'Session completed';
    case 'editing':
      return 'Preparing session';
    default:
      return timeRemaining;
  }
};

/*
USAGE EXAMPLES:

1. Basic usage in ClientCard:
```typescript
const { timeRemaining, progress, isUrgent, isWarning, sessionStatus } = useSessionTimer(client);
const statusInfo = getSessionStatusInfo(sessionStatus);
```

2. Conditional styling:
```typescript
const shouldPulse = needsAttention(sessionStatus);
const statusMessage = getTimeMessage(sessionStatus, timeRemaining);
```

3. Progress thresholds:
- 0-70%: Green (Active)
- 70-90%: Orange (Warning) 
- 90-100%: Red (Urgent)
- 100%: Gray (Completed)

4. Session status flow:
editing → active → warning → urgent → completed
*/