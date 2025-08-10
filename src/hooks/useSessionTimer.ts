// src/hooks/useSessionTimer.ts
import { useState, useEffect } from 'react';
import { type Client, type ClientStatus } from '../types';

interface SessionTimer {
  timeRemaining: string;
  progress: number;
  isUrgent: boolean;
  sessionStatus: ClientStatus | 'urgent';
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
    if (client.status === 'completed' || client.status === 'booked') {
      const totalSeconds = client.duration * 3600;
      setSecondsRemaining(client.status === 'completed' ? 0 : totalSeconds);
      setProgress(client.status === 'completed' ? 100 : 0);
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

  const isUrgent = client.status === 'urgent' || (client.status === 'active' && progress > 90);
  const sessionStatus = isUrgent ? 'urgent' : client.status;
  const timeRemainingString = formatTime(secondsRemaining);

  return { timeRemaining: timeRemainingString, progress, isUrgent, sessionStatus };
};