import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Clock, Shield } from 'lucide-react';
import { Card } from '../../base';

interface LockControlProps {
  onLockChange?: (isLocked: boolean) => void;
}

export const LockControl: React.FC<LockControlProps> = ({ onLockChange }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [autoLockTime, setAutoLockTime] = useState(0);
  const [lockTimeout, setLockTimeout] = useState<NodeJS.Timeout | null>(null);

  const autoLockOptions = [
    { label: 'Never', value: 0 },
    { label: '3 seconds', value: 3 },
    { label: '5 seconds', value: 5 },
    { label: '10 seconds', value: 10 },
    { label: '1 minute', value: 60 },
  ];

  const handleLockToggle = () => {
    const newLockState = !isLocked;
    setIsLocked(newLockState);
    if (onLockChange) {
      onLockChange(newLockState);
    }

    if (lockTimeout) {
      clearTimeout(lockTimeout);
      setLockTimeout(null);
    }

    if (!newLockState && autoLockTime > 0) {
      const timeout = setTimeout(() => {
        setIsLocked(true);
        if (onLockChange) {
          onLockChange(true);
        }
      }, autoLockTime * 1000);
      setLockTimeout(timeout);
    }
  };

  const handleAutoLockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAutoLockTime = Number(e.target.value);
    setAutoLockTime(newAutoLockTime);

    if (lockTimeout) {
      clearTimeout(lockTimeout);
      setLockTimeout(null);
    }
    
    if (!isLocked && newAutoLockTime > 0) {
      const timeout = setTimeout(() => {
        setIsLocked(true);
        if (onLockChange) {
          onLockChange(true);
        }
      }, newAutoLockTime * 1000);
      setLockTimeout(timeout);
    }
  };

  useEffect(() => {
    return () => {
      if (lockTimeout) {
        clearTimeout(lockTimeout);
      }
    };
  }, [lockTimeout]);

  return (
    <Card variant="glass" accentColor="var(--ks-hud-primary)">
      <div className="p-[clamp(1rem,3vw,1.5rem)]">
        {/* Header */}
        <div className="flex items-center gap-[clamp(0.5rem,2vw,1rem)] mb-[clamp(0.75rem,2vw,1rem)]">
          <Shield className="w-[clamp(1rem,4vw,1.5rem)] h-[clamp(1rem,4vw,1.5rem)] text-[var(--ks-hud-primary)]" />
          <h2 className="font-medium text-[var(--ks-hud-primary)] text-[clamp(1.2rem,4vw,1.5rem)]">
            Smart Access Control
          </h2>
        </div>
        
        {/* Compact Main Control Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-[clamp(1rem,3vw,1.5rem)]">
          
          {/* Lock Toggle & Status */}
          <div className="flex items-center gap-[clamp(0.75rem,3vw,1rem)]">
            <button
              onClick={handleLockToggle}
              className={`
                relative rounded-full border-2 p-1
                transition-all duration-300 hover:scale-105
                w-[clamp(3.5rem,10vw,4.5rem)] h-[clamp(2rem,6vw,2.5rem)]
                ${isLocked 
                  ? 'bg-[rgba(255,68,68,0.2)] border-[var(--ks-hud-red)]' 
                  : 'bg-[rgba(0,204,136,0.2)] border-[var(--ks-hud-green)]'}
              `}
            >
              <div
                className={`
                  absolute rounded-full transition-all duration-300
                  flex items-center justify-center
                  w-[clamp(1.25rem,4vw,1.75rem)] h-[clamp(1.25rem,4vw,1.75rem)]
                  top-1/2 -translate-y-1/2
                  ${isLocked ? 'bg-[var(--ks-hud-red)] translate-x-0' : 'bg-[var(--ks-hud-green)] translate-x-[clamp(1.5rem,4vw,2rem)]'}
                `}
              >
                {isLocked ? (
                  <Lock className="w-[clamp(0.75rem,2vw,1rem)] h-[clamp(0.75rem,2vw,1rem)] text-white" />
                ) : (
                  <Unlock className="w-[clamp(0.75rem,2vw,1rem)] h-[clamp(0.75rem,2vw,1rem)] text-white" />
                )}
              </div>
            </button>
            <div className="flex-grow">
              <div 
                className={`text-[clamp(1rem,3vw,1.25rem)] font-bold transition-colors duration-300 ${isLocked ? 'text-[var(--ks-hud-red)]' : 'text-[var(--ks-hud-green)]'}`}
              >
                {isLocked ? 'Locked' : 'Unlocked'}
              </div>
              <div className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-[var(--ks-hud-secondary)]">
                {isLocked ? 'Access is restricted' : 'Access is available'}
              </div>
            </div>
          </div>

          {/* Auto-lock Settings */}
          <div className="flex items-center gap-[clamp(0.5rem,2vw,0.75rem)] w-full md:w-auto mt-[clamp(0.5rem,2vw,0.75rem)] md:mt-0">
            <Clock className="w-[clamp(1rem,4vw,1.25rem)] h-[clamp(1rem,4vw,1.25rem)] text-[var(--ks-hud-secondary)]" />
            <span className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-[var(--ks-hud-secondary)] whitespace-nowrap">Auto-lock after</span>
            <select
              value={autoLockTime}
              onChange={handleAutoLockChange}
              className="bg-transparent border border-[var(--ks-hud-secondary)] rounded-md px-2 py-1 text-[clamp(0.75rem,1.5vw,0.875rem)] text-[var(--ks-hud-secondary)] focus:outline-none focus:border-[var(--ks-hud-primary)]"
            >
              {autoLockOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </Card>
  );
};