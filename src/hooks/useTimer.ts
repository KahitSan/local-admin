// src/hooks/useTimer.ts - Real-time Timer Hook

import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (interval: number = 1000) => {
  const [tick, setTick] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTick(prev => prev + 1);
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, isActive]);

  const pause = useCallback(() => setIsActive(false), []);
  const resume = useCallback(() => setIsActive(true), []);
  const reset = useCallback(() => setTick(0), []);

  return { tick, pause, resume, reset, isActive };
};
