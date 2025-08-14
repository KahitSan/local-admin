import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Cpu, HardDrive, Wifi, Clock, Thermometer, MemoryStick, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { Card, ProgressBar } from '../../base';

interface SystemStatsData {
  cpuUsage: number;
  temperature: number;
  memoryUsed: number;
  memoryTotal: number;
  uptime: number;
  diskUsed: number;
  diskTotal: number;
  networkRxBytes: number;
  networkTxBytes: number;
}

type ConnectionState = 'connecting' | 'connected' | 'reconnecting' | 'failed' | 'idle';

const initialStats: SystemStatsData = {
  cpuUsage: 0,
  temperature: 0,
  memoryUsed: 0,
  memoryTotal: 0,
  uptime: 0,
  diskUsed: 0,
  diskTotal: 0,
  networkRxBytes: 0,
  networkTxBytes: 0,
};

export const SystemStats: React.FC = () => {
  const [stats, setStats] = useState<SystemStatsData>(initialStats);
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [reconnectAttempt, setReconnectAttempt] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [reconnectCountdown, setReconnectCountdown] = useState<number>(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Interval | null>(null);
  
  const MAX_RECONNECT_ATTEMPTS = 5;
  const WEBSOCKET_URL = import.meta.env.VITE_WS_HOST + '/system-info';
  
  // Exponential backoff for reconnection delays
  const getReconnectDelay = (attempt: number): number => {
    const baseDelay = 1000; // Start with 1 second
    const maxDelay = 10000; // Max 10 seconds
    return Math.min(baseDelay * Math.pow(1.5, attempt), maxDelay);
  };

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setReconnectCountdown(0);
  }, []);

  const connectWebSocket = useCallback(() => {
    // Clear any existing connections/timeouts
    cleanup();
    
    // Check if we've exceeded max attempts
    if (reconnectAttempt >= MAX_RECONNECT_ATTEMPTS) {
      setConnectionState('failed');
      setErrorMessage('Unable to connect to server after multiple attempts');
      return;
    }

    // Set appropriate connection state
    setConnectionState(reconnectAttempt === 0 ? 'connecting' : 'reconnecting');
    setErrorMessage('');
    setReconnectCountdown(0);

    const ws = new WebSocket(WEBSOCKET_URL);
    wsRef.current = ws;
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      setConnectionState('connected');
      setReconnectAttempt(0);
      setReconnectCountdown(0);
      setErrorMessage('');
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };

    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        const buffer = event.data;
        const view = new DataView(buffer);
        let offset = 0;

        const cpuUsage = view.getFloat64(offset, true); offset += 8;
        const temperature = view.getFloat32(offset, true); offset += 4;
        const memoryUsed = view.getFloat64(offset, true); offset += 8;
        const memoryTotal = view.getFloat64(offset, true); offset += 8;
        const uptime = view.getFloat64(offset, true); offset += 8;
        const diskUsed = view.getFloat64(offset, true); offset += 8;
        const diskTotal = view.getFloat64(offset, true); offset += 8;
        const networkRxBytes = view.getFloat64(offset, true); offset += 8;
        const networkTxBytes = view.getFloat64(offset, true); offset += 8;

        setStats({
          cpuUsage: parseFloat(cpuUsage.toFixed(2)),
          temperature: parseFloat(temperature.toFixed(2)),
          memoryUsed,
          memoryTotal,
          uptime,
          diskUsed,
          diskTotal,
          networkRxBytes,
          networkTxBytes,
        });
      }
    };

    ws.onclose = (event) => {
      wsRef.current = null;
      
      if (connectionState !== 'idle') {
        const nextAttempt = reconnectAttempt + 1;
        setReconnectAttempt(nextAttempt);
        
        if (nextAttempt < MAX_RECONNECT_ATTEMPTS) {
          const delay = getReconnectDelay(nextAttempt);
          setConnectionState('reconnecting');
          
          // Set up countdown
          const countdownSeconds = Math.ceil(delay / 1000);
          setReconnectCountdown(countdownSeconds);
          
          // Clear any existing countdown interval
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          
          // Start countdown interval
          countdownIntervalRef.current = setInterval(() => {
            setReconnectCountdown(prev => {
              if (prev <= 1) {
                if (countdownIntervalRef.current) {
                  clearInterval(countdownIntervalRef.current);
                  countdownIntervalRef.current = null;
                }
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, delay);
        } else {
          setConnectionState('failed');
          setErrorMessage('Connection failed. Please check if the server is running.');
        }
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [reconnectAttempt, connectionState, cleanup]);

  const handleManualRetry = useCallback(() => {
    setReconnectAttempt(0);
    setReconnectCountdown(0);
    setConnectionState('connecting');
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    connectWebSocket();
  }, [connectWebSocket]);

  useEffect(() => {
    connectWebSocket();
    
    return () => {
      setConnectionState('idle');
      cleanup();
    };
  }, []);

  const formatUptime = (seconds: number): string => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    let parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);

    return parts.join(' ');
  };

  const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const statItems = [
    {
      label: 'CPU Usage',
      value: `${stats.cpuUsage}%`,
      percentage: stats.cpuUsage,
      icon: Cpu,
      color: stats.cpuUsage > 80 ? 'var(--ks-hud-red)' : stats.cpuUsage > 60 ? 'var(--ks-hud-orange)' : 'var(--ks-hud-green)'
    },
    {
      label: 'Memory',
      value: `${formatBytes(stats.memoryUsed)} / ${formatBytes(stats.memoryTotal)}`,
      percentage: stats.memoryTotal > 0 ? (stats.memoryUsed / stats.memoryTotal) * 100 : 0,
      icon: MemoryStick,
      color: 'var(--ks-hud-blue)'
    },
    {
      label: 'Temperature',
      value: `${stats.temperature}°C`,
      percentage: Math.max(0, Math.min(100, ((stats.temperature - 30) / 50) * 100)),
      icon: Thermometer,
      color: stats.temperature > 75 ? 'var(--ks-hud-red)' : stats.temperature > 60 ? 'var(--ks-hud-orange)' : 'var(--ks-hud-green)'
    },
    {
      label: 'Disk Usage',
      value: `${formatBytes(stats.diskUsed)} / ${formatBytes(stats.diskTotal)}`,
      percentage: stats.diskTotal > 0 ? (stats.diskUsed / stats.diskTotal) * 100 : 0,
      icon: HardDrive,
      color: 'var(--ks-hud-purple)'
    },
    {
      label: 'Network I/O',
      value: `${formatBytes(stats.networkRxBytes + stats.networkTxBytes)}`,
      percentage: Math.max(0, Math.min(100, ((stats.networkRxBytes + stats.networkTxBytes) / (100 * 1024 * 1024)) * 100)),
      icon: Wifi,
      color: 'var(--ks-hud-primary)'
    },
    {
      label: 'Uptime',
      value: formatUptime(stats.uptime),
      percentage: 100,
      icon: Clock,
      color: 'var(--ks-hud-green)'
    }
  ];

  // Connection status indicator component
  const ConnectionStatus = () => {
    if (connectionState === 'connected') {
      return (
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--ks-hud-green)' }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--ks-hud-green)' }} />
          <span>Connected</span>
        </div>
      );
    }
    
    if (connectionState === 'connecting') {
      return (
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--ks-hud-orange)' }}>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Connecting...</span>
        </div>
      );
    }
    
    if (connectionState === 'reconnecting') {
      return (
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--ks-hud-orange)' }}>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>
            Reconnecting ({reconnectAttempt}/{MAX_RECONNECT_ATTEMPTS})
            {reconnectCountdown > 0 && ` in ${reconnectCountdown}s`}
          </span>
        </div>
      );
    }
    
    return null;
  };

  return (
    <Card variant="panel" accentColor="var(--ks-hud-purple)">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6" style={{ color: 'var(--ks-hud-purple)' }} />
            <h2 className="text-xl font-medium" style={{ color: 'var(--ks-hud-purple)' }}>
              Server Statistics
            </h2>
          </div>
          <ConnectionStatus />
        </div>

        {/* Connection Error State */}
        {connectionState === 'failed' && (
          <div className="hud-panel p-6 mb-6 text-center" style={{ borderColor: 'var(--ks-hud-red)' }}>
            <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--ks-hud-red)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--ks-hud-red)' }}>
              Connection Failed
            </h3>
            <p className="text-sm mb-4" style={{ color: 'var(--ks-hud-secondary)' }}>
              {errorMessage}
            </p>
            <button
              onClick={handleManualRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hud-button"
              style={{ 
                backgroundColor: 'var(--ks-hud-purple)',
                color: 'var(--ks-hud-background)'
              }}
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
          </div>
        )}

        {/* Connecting/Reconnecting State */}
        {(connectionState === 'connecting' || connectionState === 'reconnecting') && (
          <div className="hud-panel p-8 text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" style={{ color: 'var(--ks-hud-orange)' }} />
            <p className="text-sm mb-2" style={{ color: 'var(--ks-hud-secondary)' }}>
              {connectionState === 'connecting' 
                ? 'Establishing connection to server...' 
                : `Reconnecting to server (Attempt ${reconnectAttempt}/${MAX_RECONNECT_ATTEMPTS})`}
            </p>
            {reconnectCountdown > 0 && (
              <p className="text-lg font-medium hud-mono" style={{ color: 'var(--ks-hud-orange)' }}>
                {reconnectCountdown}s
              </p>
            )}
          </div>
        )}

        {/* Stats Grid - Only show when connected */}
        {connectionState === 'connected' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statItems.map((stat, index) => {
              const IconComponent = stat.icon;
              
              return (
                <div key={index} className="hud-panel p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" style={{ color: stat.color }} />
                      <span className="text-sm" style={{ color: 'var(--ks-hud-secondary)' }}>
                        {stat.label}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-lg font-medium hud-mono" style={{ color: stat.color }}>
                      {stat.value}
                    </span>
                  </div>
                  
                  <ProgressBar
                    value={stat.percentage}
                    max={100}
                    color={stat.color}
                    variant="default"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};