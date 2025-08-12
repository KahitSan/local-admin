import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Lock, Unlock, Clock, Shield, AlertTriangle } from 'lucide-react';
import { Card } from '../../base';

interface LockControlProps {
  onLockChange?: (isLocked: boolean) => void;
}

const API_HOST = import.meta.env.VITE_API_HOST;

export const LockControl: React.FC<LockControlProps> = ({ onLockChange }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [autoLockTime, setAutoLockTime] = useState(0);
  const [lockTimeout, setLockTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const autoLockOptions = [
    { label: 'Never', value: 0 },
    { label: '3 seconds', value: 3 },
    { label: '5 seconds', value: 5 },
    { label: '10 seconds', value: 10 },
    { label: '1 minute', value: 60 },
  ];

  // 1. Fetch initial lock status on component mount
  useEffect(() => {
    const fetchStatus = async () => {
      if (!API_HOST) {
        setError('API host not configured.');
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${API_HOST}/api/device-lock-status`);
        if (response.data.success) {
          const lockedStatus = !!response.data.locked;
          setIsLocked(lockedStatus);
          if (onLockChange) {
            onLockChange(lockedStatus);
          }
        } else {
          setError(response.data.code || 'Failed to fetch lock status.');
        }
      } catch (err) {
        console.error('Error fetching lock status:', err);
        setError('Failed to connect to the API.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, [onLockChange]);

  // 2. Handle lock toggle with API call
  const handleLockToggle = async () => {
    const newLockState = !isLocked;
    const endpoint = newLockState ? '/api/device/lock' : '/api/device/unlock';
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_HOST}${endpoint}`);
      if (response.data.success) {
        setIsLocked(newLockState);
        if (onLockChange) {
          onLockChange(newLockState);
        }
        
        // Handle auto-lock logic
        if (!newLockState && autoLockTime > 0) {
          if (lockTimeout) clearTimeout(lockTimeout);
          const timeout = setTimeout(() => {
            // This will trigger another API call for locking
            handleLockToggle(); 
          }, autoLockTime * 1000);
          setLockTimeout(timeout);
        } else if (newLockState && lockTimeout) {
          clearTimeout(lockTimeout);
          setLockTimeout(null);
        }
      } else {
        setError('Failed to update lock status.');
      }
    } catch (err) {
      console.error('Error updating lock status:', err);
      setError('Failed to communicate with the device.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle auto-lock change
  const handleAutoLockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAutoLockTime = Number(e.target.value);
    setAutoLockTime(newAutoLockTime);

    if (lockTimeout) {
      clearTimeout(lockTimeout);
      setLockTimeout(null);
    }
    
    if (!isLocked && newAutoLockTime > 0) {
      const timeout = setTimeout(() => {
        handleLockToggle();
      }, newAutoLockTime * 1000);
      setLockTimeout(timeout);
    }
  };
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (lockTimeout) {
        clearTimeout(lockTimeout);
      }
    };
  }, [lockTimeout]);

  return (
    <Card variant="default" accentColor="var(--ks-hud-primary)">
      <div className="p-[clamp(1rem,3vw,1.5rem)]">
        {/* Header */}
        <div className="flex items-center gap-[clamp(0.5rem,2vw,1rem)] mb-[clamp(0.75rem,2vw,1rem)]">
          <Shield className="w-[clamp(1rem,4vw,1.5rem)] h-[clamp(1rem,4vw,1.5rem)] text-[var(--ks-hud-primary)]" />
          <span className="font-medium text-[var(--ks-hud-primary)] text-[clamp(1.2rem,4vw,1.5rem)]">
            Door Lock Control
          </span>
        </div>
        
        {/* Loading and Error states */}
        {isLoading && (
          <div className="flex items-center gap-2 text-[var(--ks-hud-secondary)]">
            <Clock className="animate-spin" />
            <span>Loading...</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-[var(--ks-hud-red)]">
            <AlertTriangle />
            <span>Error: {error}</span>
          </div>
        )}
        
        {/* Main Content */}
        {!isLoading && !error && (
          <>
            {/* Compact Main Control Row */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-[clamp(1rem,3vw,1.5rem)]">
              
              {/* Lock Toggle & Status */}
              <div className="flex items-center gap-[clamp(0.75rem,3vw,1rem)]">
                <button
                  onClick={handleLockToggle}
                  disabled={isLoading}
                  className={`
                    relative rounded-full border-2 p-1
                    transition-all duration-300
                    w-[clamp(3.5rem,10vw,4.5rem)] h-[clamp(2rem,6vw,2.5rem)]
                    ${isLocked 
                      ? 'bg-[rgba(255,68,68,0.2)] border-[var(--ks-hud-red)]' 
                      : 'bg-[rgba(0,204,136,0.2)] border-[var(--ks-hud-green)]'}
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
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
          </>
        )}
      </div>
    </Card>
  );
};