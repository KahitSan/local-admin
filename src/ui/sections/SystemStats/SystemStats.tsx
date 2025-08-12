
import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Wifi, Clock, Thermometer, MemoryStick } from 'lucide-react';
import { Card, ProgressBar } from '../../base';
import { generateServerStats } from '../../../utils';

interface SystemStatsProps {
  updateInterval?: number;
}

export const SystemStats: React.FC<SystemStatsProps> = ({ 
  updateInterval = 5000 
}) => {
  const [stats, setStats] = useState(generateServerStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(generateServerStats());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

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
      value: `${stats.memUsage}GB`,
      percentage: (parseFloat(stats.memUsage) / 8) * 100,
      icon: MemoryStick,
      color: 'var(--ks-hud-blue)'
    },
    {
      label: 'Temperature',
      value: `${stats.cpuTemp}°C`,
      percentage: ((stats.cpuTemp - 30) / 50) * 100,
      icon: Thermometer,
      color: stats.cpuTemp > 75 ? 'var(--ks-hud-red)' : 'var(--ks-hud-green)'
    },
    {
      label: 'Disk Usage',
      value: `${stats.diskUsage}GB`,
      percentage: (parseInt(stats.diskUsage) / 200) * 100,
      icon: HardDrive,
      color: 'var(--ks-hud-purple)'
    },
    {
      label: 'Network I/O',
      value: `${stats.networkIO}MB/s`,
      percentage: (parseFloat(stats.networkIO) / 10) * 100,
      icon: Wifi,
      color: 'var(--ks-hud-primary)'
    },
    {
      label: 'Uptime',
      value: stats.uptime,
      percentage: 100,
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
