import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Lock, Unlock, Clock, Shield, AlertTriangle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
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
    connectionFailed: false,
  });

  const [autoLockTime, setAutoLockTime] = useState(5);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const commandTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastLockStateRef = useRef<boolean | null>(null);
  const optimisticStateRef = useRef<{ value: boolean; timestamp: number } | null>(null);
  const statusDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const currentStateRef = useRef(state); // Keep track of current state in ref
  
  // Update ref whenever state changes
  useEffect(() => {
    currentStateRef.current = state;
  }, [state]);

  const autoLockOptions = useMemo(() => [
    { label: 'Never', value: 0 },
    { label: '3 seconds', value: 3 },
    { label: '5 seconds', value: 5 },
    { label: '10 seconds', value: 10 },
    { label: '1 minute', value: 60 },
  ], []);

  // All state updates are now immediate for instant UI response
  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);



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
              // Check if we have an optimistic update in progress
              const hasOptimisticUpdate = optimisticStateRef.current !== null;
              const optimisticAge = hasOptimisticUpdate 
                ? Date.now() - optimisticStateRef.current!.timestamp 
                : 0;
              
              // If we have a recent optimistic update (less than 500ms old)
              // and the incoming state matches our optimistic state, just confirm it
              if (hasOptimisticUpdate && optimisticAge < 500 && 
                  incomingLocked === optimisticStateRef.current!.value) {
                // Server confirmed our optimistic update
                optimisticStateRef.current = null;
                lastLockStateRef.current = incomingLocked;
                
                // Update without flickering
                updateState({
                  deviceAutoLockEnabled: incomingEnabled,
                  deviceAutoLockTime: incomingTime,
                  lastUpdate: new Date(),
                  isLoading: false,
                  error: null
                });
                
                // Notify parent of confirmed change
                if (onLockChange) {
                  onLockChange(incomingLocked);
                }
                break;
              }
              
              // If we have an optimistic update but server disagrees, debounce the revert
              if (hasOptimisticUpdate && incomingLocked !== optimisticStateRef.current!.value) {
                // Clear any pending status debounce
                if (statusDebounceRef.current) {
                  clearTimeout(statusDebounceRef.current);
                }
                
                // Wait a bit before reverting to prevent flicker
                statusDebounceRef.current = setTimeout(() => {
                  // Only revert if the optimistic state is still active
                  if (optimisticStateRef.current) {
                    optimisticStateRef.current = null;
                    lastLockStateRef.current = incomingLocked;
                    
                    updateState({
                      isLocked: incomingLocked,
                      deviceAutoLockEnabled: incomingEnabled,
                      deviceAutoLockTime: incomingTime,
                      lastUpdate: new Date(),
                      isLoading: false,
                      error: null
                    });
                    
                    if (onLockChange) {
                      onLockChange(incomingLocked);
                    }
                  }
                }, 300); // Wait 300ms to debounce rapid changes
                break;
              }
              
              // Normal status update (no optimistic state)
              const isInitialState = lastLockStateRef.current === null;
              const hasStateChanged = lastLockStateRef.current !== incomingLocked;
              
              lastLockStateRef.current = incomingLocked;
              
              if (!isInitialState && hasStateChanged && onLockChange) {
                onLockChange(incomingLocked);
              }

              updateState({
                isLocked: incomingLocked,
                deviceAutoLockEnabled: incomingEnabled,
                deviceAutoLockTime: incomingTime,
                lastUpdate: new Date(),
                isLoading: false,
                error: null
              });
            }
          } else {
            updateState({
              error: data.error || 'Device status unavailable',
              isLoading: false
            });
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
          
          // Clear optimistic state on command result
          if (!data.success) {
            // If command failed, we might need to revert the optimistic update
            // The next status message will handle this
            optimisticStateRef.current = null;
          }
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
          error: null,
          connectionFailed: false 
        });
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = handleWebSocketMessage;

      ws.onerror = () => {
        updateState({ 
          wsConnected: false, 
          error: 'Connection error'
        });
      };

      ws.onclose = () => {
        wsRef.current = null;
        
        if (commandTimeoutRef.current) {
          clearTimeout(commandTimeoutRef.current);
          commandTimeoutRef.current = null;
        }
        
        const attempts = reconnectAttemptsRef.current;
        
        if (attempts < 5) {
          // Still trying to reconnect automatically
          updateState({ 
            wsConnected: false, 
            isExecuting: false 
          });
          
          const delay = Math.min(1000 * Math.pow(2, attempts), 10000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connectWebSocket();
          }, delay);
        } else {
          // Failed after 5 attempts - show retry button
          updateState({ 
            wsConnected: false,
            isExecuting: false,
            connectionFailed: true,
            error: null
          });
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
      if (statusDebounceRef.current) clearTimeout(statusDebounceRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connectWebSocket]);

  const handleLockToggle = useCallback(() => {
    const current = currentStateRef.current;
    if (!current.wsConnected || current.isExecuting || current.isLocked === null) return;
    
    // Immediately flip the state in UI - don't wait for anything
    const newLockState = !current.isLocked;
    
    // Store optimistic state
    optimisticStateRef.current = {
      value: newLockState,
      timestamp: Date.now()
    };
    
    // IMMEDIATELY update UI - synchronous state update
    setState(prev => ({
      ...prev,
      isLocked: newLockState,
      isExecuting: true,
      error: null,
      lastUpdate: new Date()
    }));

    // Then send the command to the server
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
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
        setState(prev => ({ 
          ...prev,
          isExecuting: false, 
          error: 'Command timeout - please try again' 
        }));
        optimisticStateRef.current = null;
      }, 5000);
    }
  }, [autoLockTime]);

  const handleAutoLockChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setAutoLockTime(Number(e.target.value));
  }, []);

  const handleManualRetry = useCallback(() => {
    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    // Reset connection state and retry
    reconnectAttemptsRef.current = 0;
    updateState({
      connectionFailed: false,
      error: null,
      isLoading: true,
      isLocked: null // Reset lock state when retrying
    });
    connectWebSocket();
  }, [connectWebSocket]);

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
            {state.connectionFailed ? (
              <>
                <WifiOff className="w-4 h-4 text-[var(--ks-hud-red)]" />
                <span className="text-xs text-[var(--ks-hud-red)]">Disconnected</span>
              </>
            ) : state.wsConnected ? (
              <>
                <Wifi className="w-4 h-4 text-[var(--ks-hud-green)]" />
                <span className="text-xs text-[var(--ks-hud-secondary)]">
                  Live {formatLastUpdate && `• ${formatLastUpdate}`}
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-orange-500 animate-pulse" />
                <span className="text-xs text-[var(--ks-hud-secondary)]">Reconnecting...</span>
              </>
            )}
          </div>
        </div>

        {/* Connection Failed State */}
        {state.connectionFailed && (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="flex items-center gap-3">
              <WifiOff className="w-8 h-8 text-[var(--ks-hud-red)]" />
              <div>
                <div className="text-[clamp(1.2rem,3vw,1.5rem)] font-bold text-[var(--ks-hud-red)]">
                  Disconnected
                </div>
                <div className="text-[clamp(0.75rem,1.5vw,0.875rem)] text-[var(--ks-hud-secondary)]">
                  Unable to connect to lock device
                </div>
              </div>
            </div>
            <button
              onClick={handleManualRetry}
              className="flex items-center gap-2 px-6 py-2.5 bg-[var(--ks-hud-primary)] text-white rounded-lg hover:opacity-90 hover:scale-105 transition-all font-medium text-[clamp(0.875rem,2vw,1rem)]"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
          </div>
        )}

        {/* Loading */}
        {state.isLoading && state.isLocked === null && !state.connectionFailed && (
          <div className="flex items-center justify-center gap-2 text-[var(--ks-hud-secondary)] py-8">
            <Clock className="animate-spin w-5 h-5" />
            <span className="text-[clamp(0.875rem,2vw,1rem)]">Connecting to device...</span>
          </div>
        )}

        {/* Error (only show if not connection failed) */}
        {state.error && !state.connectionFailed && (
          <div className="flex items-center gap-2 text-[var(--ks-hud-red)] mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{state.error}</span>
          </div>
        )}

        {/* Main Lock Control - only show when connected and not in failed state */}
        {state.isLocked !== null && !state.connectionFailed && (
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