import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Lock, Unlock, Clock, Shield, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Card } from '../../base';

interface LockControlProps {
  onLockChange?: (isLocked: boolean) => void;
}

type WSMessageType = 'status' | 'command_ack' | 'command_result';

interface WSMessage {
  type: WSMessageType;
  success?: boolean;
  locked?: boolean | null;
  timestamp?: number;
  error?: string;
  status?: string;
  autoLockEnabled?: boolean;
  autoLockTime?: number;
}

const WS_HOST = import.meta.env.VITE_WS_HOST || 'ws://localhost:3001';

export const LockControl: React.FC<LockControlProps> = React.memo(({ onLockChange }) => {
  const [state, setState] = useState({
    isLocked: null as boolean | null,
    deviceAutoLockEnabled: false,
    deviceAutoLockTime: 0,
    isLoading: true,
    isExecuting: false,
    error: null as string | null,
    wsConnected: false,
    lastUpdate: null as Date | null,
  });

  const [autoLockTime, setAutoLockTime] = useState(5);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const commandTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastLockStateRef = useRef<boolean | null>(null);
  const stateUpdateBufferRef = useRef<Partial<typeof state> | null>(null);
  const stateUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const autoLockOptions = useMemo(() => [
    { label: 'Never', value: 0 },
    { label: '3 seconds', value: 3 },
    { label: '5 seconds', value: 5 },
    { label: '10 seconds', value: 10 },
    { label: '1 minute', value: 60 },
  ], []);

  // Batch state updates to prevent flickering (immediate for critical updates)
  const updateState = useCallback((updates: Partial<typeof state>, immediate = false) => {
    if (immediate) {
      // Apply immediately for critical updates like initial connection
      setState(prev => ({
        ...prev,
        ...updates
      }));
      return;
    }

    // Clear any pending update
    if (stateUpdateTimeoutRef.current) {
      clearTimeout(stateUpdateTimeoutRef.current);
    }

    // Merge updates into buffer
    stateUpdateBufferRef.current = {
      ...stateUpdateBufferRef.current,
      ...updates
    };

    // Apply updates after a short delay to batch multiple changes
    stateUpdateTimeoutRef.current = setTimeout(() => {
      if (stateUpdateBufferRef.current) {
        setState(prev => ({
          ...prev,
          ...stateUpdateBufferRef.current!
        }));
        stateUpdateBufferRef.current = null;
      }
    }, 10);
  }, []);

  // Send one-push command via WebSocket
  const sendOnePushCommand = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      updateState({ error: 'Not connected to device' });
      return;
    }
    
    updateState({ isExecuting: true, error: null });

    wsRef.current.send(
      JSON.stringify({
        type: 'command',
        autoLockSeconds: autoLockTime,
      })
    );

    if (commandTimeoutRef.current) {
      clearTimeout(commandTimeoutRef.current);
    }
    
    commandTimeoutRef.current = setTimeout(() => {
      updateState({ 
        isExecuting: false, 
        error: 'Command timeout - please try again' 
      });
    }, 5000);
  }, [autoLockTime, updateState]);

  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const data: WSMessage = JSON.parse(event.data);

      switch (data.type) {
        case 'status': {
          if (data.success) {
            const incomingLocked = data.locked;
            const incomingEnabled = !!data.autoLockEnabled;
            const incomingTime = typeof data.autoLockTime === 'number' ? data.autoLockTime : 0;

            if (incomingLocked !== undefined && incomingLocked !== null) {
              // Check if this is initial state or actual change
              const isInitialState = lastLockStateRef.current === null;
              const hasStateChanged = lastLockStateRef.current !== incomingLocked;
              
              // Always update the ref to track current state
              lastLockStateRef.current = incomingLocked;
              
              // Notify parent on actual change (not initial state)
              if (!isInitialState && hasStateChanged && onLockChange) {
                onLockChange(incomingLocked);
              }

              // Always update UI state to stay in sync with device
              // Use immediate update for initial state or state changes
              updateState({
                isLocked: incomingLocked,
                deviceAutoLockEnabled: incomingEnabled,
                deviceAutoLockTime: incomingTime,
                lastUpdate: new Date(),
                isLoading: false,
                error: null
              }, isInitialState || hasStateChanged);
            }
          } else {
            updateState({
              error: data.error || 'Device status unavailable',
              isLoading: false
            }, true);
          }
          break;
        }

        case 'command_result':
          if (commandTimeoutRef.current) {
            clearTimeout(commandTimeoutRef.current);
            commandTimeoutRef.current = null;
          }
          
          updateState({
            isExecuting: false,
            error: data.success ? null : (data.error || 'Failed to execute command')
          });
          break;
      }
    } catch (err) {
      console.error('Error parsing WebSocket message:', err);
    }
  }, [onLockChange, updateState]);

  const connectWebSocket = useCallback(() => {
    if (!WS_HOST) {
      updateState({ 
        error: 'WebSocket host not configured.', 
        isLoading: false 
      });
      return;
    }

    // Close existing connection if any
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    try {
      const ws = new WebSocket(`${WS_HOST}/tuya-device-status`);
      wsRef.current = ws;

      ws.onopen = () => {
        updateState({ 
          wsConnected: true, 
          error: null 
        }, true); // Immediate update for connection status
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = handleWebSocketMessage;

      ws.onerror = () => {
        updateState({ 
          wsConnected: false, 
          error: 'Connection error' 
        }, true); // Immediate update for connection errors
      };

      ws.onclose = () => {
        wsRef.current = null;
        
        if (commandTimeoutRef.current) {
          clearTimeout(commandTimeoutRef.current);
          commandTimeoutRef.current = null;
        }
        
        updateState({ 
          wsConnected: false, 
          isExecuting: false 
        }, true); // Immediate update for connection close

        const attempts = reconnectAttemptsRef.current;
        if (attempts < 5) {
          const delay = Math.min(1000 * Math.pow(2, attempts), 10000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connectWebSocket();
          }, delay);
        } else {
          updateState({ 
            error: 'Unable to maintain connection. Please refresh the page.' 
          }, true);
        }
      };
    } catch (err) {
      updateState({ 
        error: 'Failed to establish real-time connection', 
        isLoading: false 
      });
    }
  }, [handleWebSocketMessage, updateState]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
      if (stateUpdateTimeoutRef.current) clearTimeout(stateUpdateTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connectWebSocket]);

  const handleLockToggle = useCallback(() => {
    if (!state.wsConnected || state.isExecuting) return;
    sendOnePushCommand();
  }, [state.wsConnected, state.isExecuting, sendOnePushCommand]);

  const handleAutoLockChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setAutoLockTime(Number(e.target.value));
  }, []);

  const formatLastUpdate = useMemo(() => {
    if (!state.lastUpdate) return null;
    const seconds = Math.floor((Date.now() - state.lastUpdate.getTime()) / 1000);
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  }, [state.lastUpdate]);

  const lockButtonClass = useMemo(() => `
    relative rounded-full border-2 p-1
    transition-all duration-300
    w-[clamp(3.5rem,10vw,4.5rem)] h-[clamp(2rem,6vw,2.5rem)]
    ${state.isLocked
      ? 'bg-[rgba(255,68,68,0.2)] border-[var(--ks-hud-red)]'
      : 'bg-[rgba(0,204,136,0.2)] border-[var(--ks-hud-green)]'}
    ${(state.isExecuting || !state.wsConnected) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
  `, [state.isLocked, state.isExecuting, state.wsConnected]);

  const lockIndicatorClass = useMemo(() => `
    absolute rounded-full transition-all duration-300
    flex items-center justify-center
    w-[clamp(1.25rem,4vw,1.75rem)] h-[clamp(1.25rem,4vw,1.75rem)]
    top-1/2 -translate-y-1/2
    ${state.isLocked ? 'bg-[var(--ks-hud-red)] translate-x-0' : 'bg-[var(--ks-hud-green)] translate-x-[clamp(1.5rem,4vw,2rem)]'}
    ${state.isExecuting ? 'animate-pulse' : ''}
  `, [state.isLocked, state.isExecuting]);

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

          <div className="flex items-center gap-2">
            {state.wsConnected ? (
              <>
                <Wifi className="w-4 h-4 text-[var(--ks-hud-green)]" />
                <span className="text-xs text-[var(--ks-hud-secondary)]">
                  Live {formatLastUpdate && `• ${formatLastUpdate}`}
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

        {/* Loading */}
        {state.isLoading && state.isLocked === null && (
          <div className="flex items-center gap-2 text-[var(--ks-hud-secondary)]">
            <Clock className="animate-spin" />
            <span>Connecting to device...</span>
          </div>
        )}

        {/* Error */}
        {state.error && (
          <div className="flex items-center gap-2 text-[var(--ks-hud-red)] mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{state.error}</span>
          </div>
        )}

        {/* Main */}
        {state.isLocked !== null && (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-[clamp(1rem,3vw,1.5rem)]">
            {/* Toggle */}
            <div className="flex items-center gap-[clamp(0.75rem,3vw,1rem)]">
              <button
                onClick={handleLockToggle}
                disabled={state.isExecuting || !state.wsConnected}
                className={lockButtonClass}
              >
                <div className={lockIndicatorClass}>
                  {state.isLocked ? (
                    <Lock className="w-[clamp(0.75rem,2vw,1rem)] h-[clamp(0.75rem,2vw,1rem)] text-white" />
                  ) : (
                    <Unlock className="w-[clamp(0.75rem,2vw,1rem)] h-[clamp(0.75rem,2vw,1rem)] text-white" />
                  )}
                </div>
              </button>
              <div className="flex-grow">
                <div
                  className={`text-[clamp(1rem,3vw,1.25rem)] font-bold transition-colors duration-300 ${
                    state.isLocked ? 'text-[var(--ks-hud-red)]' : 'text-[var(--ks-hud-green)]'
                  }`}
                >
                  {state.isLocked ? 'Locked' : 'Unlocked'}
                  {state.isExecuting && <span className="text-xs ml-2 opacity-60">(updating...)</span>}
                </div>
                <div className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-[var(--ks-hud-secondary)]">
                  {state.isLocked ? 'Access is restricted' : 'Access is available'}
                </div>
              </div>
            </div>

            {/* Auto-lock Settings */}
            <div className="flex items-center gap-[clamp(0.5rem,2vw,0.75rem)] w-full md:w-auto mt-[clamp(0.5rem,2vw,0.75rem)] md:mt-0">
              <Clock className="w-[clamp(1rem,4vw,1.25rem)] h-[clamp(1rem,4vw,1.25rem)] text-[var(--ks-hud-secondary)]" />
              <span className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-[var(--ks-hud-secondary)] whitespace-nowrap">
                Auto-lock after
              </span>
              <select
                value={autoLockTime}
                onChange={handleAutoLockChange}
                disabled={!state.wsConnected}
                className="bg-transparent border border-[var(--ks-hud-secondary)] rounded-md px-2 py-1 text-[clamp(0.75rem,1.5vw,0.875rem)] text-[var(--ks-hud-secondary)] focus:outline-none focus:border-[var(--ks-hud-primary)] disabled:opacity-50"
              >
                {autoLockOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="text-[clamp(0.7rem,1.3vw,0.8rem)] text-[var(--ks-hud-secondary)] ml-2">
                Device: {state.deviceAutoLockEnabled ? `${state.deviceAutoLockTime || 0}s` : 'Never'}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
});