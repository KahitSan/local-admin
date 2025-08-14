import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Clock, Shield, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Card } from '../../base';

interface LockControlProps {
  onLockChange?: (isLocked: boolean) => void;
}

interface WSMessage {
  type: 'status' | 'command_ack' | 'command_result';
  success?: boolean;
  online?: boolean;
  locked?: boolean | null;
  timestamp?: number;
  error?: string;
  action?: 'lock' | 'unlock';
  status?: string;
}

const WS_HOST = import.meta.env.VITE_WS_HOST || 'ws://localhost:3001';

export const LockControl: React.FC<LockControlProps> = ({ onLockChange }) => {
  const [isLocked, setIsLocked] = useState<boolean | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [autoLockTime, setAutoLockTime] = useState(0);
  const [lockTimeout, setLockTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const commandTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const autoLockOptions = [
    { label: 'Never', value: 0 },
    { label: '3 seconds', value: 3 },
    { label: '5 seconds', value: 5 },
    { label: '10 seconds', value: 10 },
    { label: '1 minute', value: 60 },
  ];

  // Send command via WebSocket
  const sendCommand = (action: 'lock' | 'unlock') => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError('Not connected to device');
      return;
    }

    setIsExecuting(true);
    setError(null);

    // Send command
    wsRef.current.send(JSON.stringify({
      type: 'command',
      action: action
    }));

    // Set timeout for command response
    if (commandTimeoutRef.current) {
      clearTimeout(commandTimeoutRef.current);
    }
    
    commandTimeoutRef.current = setTimeout(() => {
      setIsExecuting(false);
      setError('Command timeout - please try again');
    }, 5000);
  };

  // WebSocket connection management
  const connectWebSocket = () => {
    if (!WS_HOST) {
      setError('WebSocket host not configured.');
      setIsLoading(false);
      return;
    }

    // Clean up existing connection
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    try {
      const ws = new WebSocket(`${WS_HOST}/tuya-device-status`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected to Tuya device');
        setWsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data: WSMessage = JSON.parse(event.data);
          
          switch (data.type) {
            case 'status':
              if (data.success) {
                setIsOnline(data.online || false);
                
                if (data.locked !== null && data.locked !== undefined) {
                  const wasLocked = isLocked;
                  setIsLocked(data.locked);
                  setLastUpdate(new Date());
                  
                  // Only trigger callback if status actually changed
                  if (wasLocked !== null && wasLocked !== data.locked && onLockChange) {
                    onLockChange(data.locked);
                  }
                }
                
                setIsLoading(false);
                setError(null);
              } else {
                setError(data.error || 'Device status unavailable');
                setIsLoading(false);
              }
              break;
              
            case 'command_ack':
              // Command acknowledged, waiting for result
              console.log(`Command ${data.action} acknowledged`);
              break;
              
            case 'command_result':
              // Clear command timeout
              if (commandTimeoutRef.current) {
                clearTimeout(commandTimeoutRef.current);
                commandTimeoutRef.current = null;
              }
              
              setIsExecuting(false);
              
              if (data.success) {
                // Command succeeded
                const newLockState = data.action === 'lock';
                setIsLocked(newLockState);
                
                if (onLockChange) {
                  onLockChange(newLockState);
                }
                
                // Handle auto-lock logic
                if (!newLockState && autoLockTime > 0) {
                  if (lockTimeout) clearTimeout(lockTimeout);
                  const timeout = setTimeout(() => {
                    sendCommand('lock');
                  }, autoLockTime * 1000);
                  setLockTimeout(timeout);
                } else if (newLockState && lockTimeout) {
                  clearTimeout(lockTimeout);
                  setLockTimeout(null);
                }
              } else {
                setError(data.error || `Failed to ${data.action} the device`);
              }
              break;
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setWsConnected(false);
        setError('Connection error');
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setWsConnected(false);
        wsRef.current = null;

        // Clear any pending command timeouts
        if (commandTimeoutRef.current) {
          clearTimeout(commandTimeoutRef.current);
          commandTimeoutRef.current = null;
        }
        setIsExecuting(false);

        // Implement exponential backoff for reconnection
        const attempts = reconnectAttemptsRef.current;
        if (attempts < 5) {
          const delay = Math.min(1000 * Math.pow(2, attempts), 10000);
          console.log(`Reconnecting in ${delay}ms (attempt ${attempts + 1})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connectWebSocket();
          }, delay);
        } else {
          setError('Unable to maintain connection. Please refresh the page.');
        }
      };
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      setError('Failed to establish real-time connection');
      setIsLoading(false);
    }
  };

  // Initialize WebSocket connection on mount
  useEffect(() => {
    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (commandTimeoutRef.current) {
        clearTimeout(commandTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (lockTimeout) {
        clearTimeout(lockTimeout);
      }
    };
  }, []);

  // Handle lock toggle
  const handleLockToggle = () => {
    if (!wsConnected || isExecuting || !isOnline) return;
    
    const action = isLocked ? 'unlock' : 'lock';
    sendCommand(action);
  };

  // Handle auto-lock change
  const handleAutoLockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAutoLockTime = Number(e.target.value);
    setAutoLockTime(newAutoLockTime);

    if (lockTimeout) {
      clearTimeout(lockTimeout);
      setLockTimeout(null);
    }
    
    if (isLocked === false && newAutoLockTime > 0) {
      const timeout = setTimeout(() => {
        sendCommand('lock');
      }, newAutoLockTime * 1000);
      setLockTimeout(timeout);
    }
  };

  // Format last update time
  const formatLastUpdate = () => {
    if (!lastUpdate) return null;
    const seconds = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  return (
    <Card variant="default" accentColor="var(--ks-hud-primary)">
      <div className="p-[clamp(1rem,3vw,1.5rem)]">
        {/* Header with connection status */}
        <div className="flex items-center justify-between mb-[clamp(0.75rem,2vw,1rem)]">
          <div className="flex items-center gap-[clamp(0.5rem,2vw,1rem)]">
            <Shield className="w-[clamp(1rem,4vw,1.5rem)] h-[clamp(1rem,4vw,1.5rem)] text-[var(--ks-hud-primary)]" />
            <span className="font-medium text-[var(--ks-hud-primary)] text-[clamp(1.2rem,4vw,1.5rem)]">
              Door Lock Control
            </span>
          </div>
          
          {/* Connection status indicator */}
          <div className="flex items-center gap-2">
            {wsConnected ? (
              <>
                <Wifi className="w-4 h-4 text-[var(--ks-hud-green)]" />
                <span className="text-xs text-[var(--ks-hud-secondary)]">
                  Live {formatLastUpdate() && `• ${formatLastUpdate()}`}
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-[var(--ks-hud-red)]" />
                <span className="text-xs text-[var(--ks-hud-secondary)]">Reconnecting...</span>
              </>
            )}
          </div>
        </div>
        
        {/* Loading state */}
        {isLoading && isLocked === null && (
          <div className="flex items-center gap-2 text-[var(--ks-hud-secondary)]">
            <Clock className="animate-spin" />
            <span>Connecting to device...</span>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="flex items-center gap-2 text-[var(--ks-hud-red)] mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        {/* Offline warning */}
        {!isOnline && (
          <div className="flex items-center gap-2 text-[var(--ks-hud-yellow)] mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Device is offline</span>
          </div>
        )}
        
        {/* Main Content */}
        {isLocked !== null && (
          <>
            {/* Compact Main Control Row */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-[clamp(1rem,3vw,1.5rem)]">
              
              {/* Lock Toggle & Status */}
              <div className="flex items-center gap-[clamp(0.75rem,3vw,1rem)]">
                <button
                  onClick={handleLockToggle}
                  disabled={isExecuting || !isOnline || !wsConnected}
                  className={`
                    relative rounded-full border-2 p-1
                    transition-all duration-300
                    w-[clamp(3.5rem,10vw,4.5rem)] h-[clamp(2rem,6vw,2.5rem)]
                    ${isLocked 
                      ? 'bg-[rgba(255,68,68,0.2)] border-[var(--ks-hud-red)]' 
                      : 'bg-[rgba(0,204,136,0.2)] border-[var(--ks-hud-green)]'}
                    ${(isExecuting || !isOnline || !wsConnected) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                  `}
                >
                  <div
                    className={`
                      absolute rounded-full transition-all duration-300
                      flex items-center justify-center
                      w-[clamp(1.25rem,4vw,1.75rem)] h-[clamp(1.25rem,4vw,1.75rem)]
                      top-1/2 -translate-y-1/2
                      ${isLocked ? 'bg-[var(--ks-hud-red)] translate-x-0' : 'bg-[var(--ks-hud-green)] translate-x-[clamp(1.5rem,4vw,2rem)]'}
                      ${isExecuting ? 'animate-pulse' : ''}
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
                    {isExecuting && <span className="text-xs ml-2 opacity-60">(updating...)</span>}
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
                  disabled={!isOnline || !wsConnected}
                  className="bg-transparent border border-[var(--ks-hud-secondary)] rounded-md px-2 py-1 text-[clamp(0.75rem,1.5vw,0.875rem)] text-[var(--ks-hud-secondary)] focus:outline-none focus:border-[var(--ks-hud-primary)] disabled:opacity-50"
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