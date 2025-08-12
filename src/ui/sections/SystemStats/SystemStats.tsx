import React, { useState, useEffect, useCallback } from 'react';
import { Cpu, HardDrive, Wifi, Clock, Thermometer, MemoryStick } from 'lucide-react';
import { Card, ProgressBar } from '../../base'; // Assuming these are in your base components

// Define the shape of the system stats data received from the WebSocket
interface SystemStatsData {
  cpuUsage: number;
  temperature: number;
  memoryUsed: number; // Raw bytes
  memoryTotal: number; // Raw bytes
  uptime: number; // In seconds
  diskUsed: number; // Raw bytes
  diskTotal: number; // Raw bytes
  networkRxBytes: number; // Raw bytes
  networkTxBytes: number; // Raw bytes
}

// Initial state for system stats
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

// Component for displaying system statistics
export const SystemStats: React.FC = () => { // websocketUrl prop removed
  const [stats, setStats] = useState<SystemStatsData>(initialStats);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_INTERVAL_MS = 3000; // 3 seconds

  // Define the WebSocket URL internally
  const WEBSOCKET_URL = import.meta.env.VITE_WS_HOST + '/system-info'; // Hardcoded WebSocket URL

  const connectWebSocket = useCallback(() => {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('Max reconnect attempts reached. Not attempting to connect further.');
      return;
    }

    console.log(`Attempting to connect to WebSocket: ${WEBSOCKET_URL} (Attempt ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);
    const ws = new WebSocket(WEBSOCKET_URL); // Use the internally defined URL

    ws.binaryType = 'arraybuffer'; // Crucial for receiving binary data

    ws.onopen = () => {
      console.log('WebSocket connected!');
      setIsConnected(true);
      setReconnectAttempts(0); // Reset attempts on successful connection
    };

    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        // Decode the binary data based on the server's byte layout (68 bytes total)
        const buffer = event.data;
        const view = new DataView(buffer);
        let offset = 0;

        const cpuUsage = view.getFloat64(offset, true); offset += 8;        // 8 bytes
        const temperature = view.getFloat32(offset, true); offset += 4;      // 4 bytes
        const memoryUsed = view.getFloat64(offset, true); offset += 8;       // 8 bytes
        const memoryTotal = view.getFloat64(offset, true); offset += 8;      // 8 bytes
        const uptime = view.getFloat64(offset, true); offset += 8;          // 8 bytes
        const diskUsed = view.getFloat64(offset, true); offset += 8;        // 8 bytes
        const diskTotal = view.getFloat64(offset, true); offset += 8;       // 8 bytes
        const networkRxBytes = view.getFloat64(offset, true); offset += 8;   // 8 bytes
        const networkTxBytes = view.getFloat64(offset, true); offset += 8;   // 8 bytes

        setStats(prevStats => ({
          ...prevStats,
          cpuUsage: parseFloat(cpuUsage.toFixed(2)),
          temperature: parseFloat(temperature.toFixed(2)),
          memoryUsed: memoryUsed,
          memoryTotal: memoryTotal,
          uptime: uptime,
          diskUsed: diskUsed,
          diskTotal: diskTotal,
          networkRxBytes: networkRxBytes,
          networkTxBytes: networkTxBytes,
        }));
      } else {
        // Handle non-binary messages (e.g., error messages from server)
        try {
          const message = JSON.parse(event.data);
          console.warn('Received non-binary message:', message);
          // Potentially display server-side errors to the user
        } catch (e) {
          console.warn('Received unparseable non-binary message:', event.data);
        }
      }
    };

    ws.onclose = (event) => {
      console.log(`WebSocket disconnected (Code: ${event.code}, Reason: ${event.reason})`);
      setIsConnected(false);
      setReconnectAttempts(prev => prev + 1);
      setTimeout(connectWebSocket, RECONNECT_INTERVAL_MS); // Attempt to reconnect
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      ws.close(); // Force close to trigger onclose and reconnect logic
    };

    // Clean up WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, [reconnectAttempts]); // Re-run effect if reconnectAttempts changes

  useEffect(() => {
    connectWebSocket(); // Initial connection attempt when component mounts
  }, [connectWebSocket]);

  // Helper to format uptime from seconds to readable string
  const formatUptime = (seconds: number): string => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    let parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`); // Always show seconds for granularity

    return parts.join(' ');
  };

  // Helper to convert bytes to a human-readable format (Bytes, KB, MB, GB, TB)
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
      // Ensure percentage is not negative if temp is below 30, and caps at 100
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
      // Displaying combined received and transmitted bytes
      value: `${formatBytes(stats.networkRxBytes + stats.networkTxBytes)}`,
      // Percentage against an arbitrary max (e.g., 100 MB/s total throughput)
      // Ensure percentage is not negative or above 100
      percentage: Math.max(0, Math.min(100, ((stats.networkRxBytes + stats.networkTxBytes) / (100 * 1024 * 1024)) * 100)), 
      icon: Wifi,
      color: 'var(--ks-hud-primary)'
    },
    {
      label: 'Uptime',
      value: formatUptime(stats.uptime),
      percentage: 100, // Uptime percentage is always 100% of 'running'
      icon: Clock,
      color: 'var(--ks-hud-green)'
    }
  ];

  return (
    <Card variant="panel" accentColor="var(--ks-hud-purple)">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Cpu className="w-6 h-6" style={{ color: 'var(--ks-hud-purple)' }} />
          <h2 className="text-xl font-medium" style={{ color: 'var(--ks-hud-purple)' }}>
            Server Statistics
          </h2>
        </div>

        {!isConnected && (
          <div className="text-center text-red-500 mb-4">
            Connecting to server... (Attempt {reconnectAttempts}/{MAX_RECONNECT_ATTEMPTS})
            <br />
            Ensure server is running and WebSocket URL is correct: <code>{WEBSOCKET_URL}</code>
          </div>
        )}

        {/* Stats Grid */}
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
      </div>
    </Card>
  );
};
