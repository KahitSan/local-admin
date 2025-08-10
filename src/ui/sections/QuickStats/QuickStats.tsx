
import React from 'react';
import { TrendingUp, Users, MapPin, DollarSign } from 'lucide-react';
import { Card } from '../../base';

interface Stat {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface QuickStatsProps {
  activeClients: number;
  occupancyRate: number;
  todayRevenue: number;
  totalSpaces: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({
  activeClients,
  occupancyRate,
  todayRevenue,
  totalSpaces
}) => {
  const stats: Stat[] = [
    {
      label: 'Active Sessions',
      value: activeClients.toString(),
      change: '+2 from yesterday',
      trend: 'up',
      icon: Users,
      color: 'var(--ks-hud-green)'
    },
    {
      label: 'Occupancy Rate',
      value: `${occupancyRate}%`,
      change: '+5% from yesterday',
      trend: 'up',
      icon: MapPin,
      color: 'var(--ks-hud-blue)'
    },
    {
      label: 'Today\'s Revenue',
      value: `₱${todayRevenue.toLocaleString()}`,
      change: '+12% from yesterday',
      trend: 'up',
      icon: DollarSign,
      color: 'var(--ks-hud-primary)'
    },
    {
      label: 'Available Spaces',
      value: (totalSpaces - Math.round((totalSpaces * occupancyRate) / 100)).toString(),
      change: `${totalSpaces} total`,
      trend: 'neutral',
      icon: TrendingUp,
      color: 'var(--ks-hud-purple)'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <Card key={index} variant="glass">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <IconComponent className="w-5 h-5" style={{ color: stat.color }} />
                {stat.trend === 'up' && (
                  <TrendingUp className="w-4 h-4" style={{ color: 'var(--ks-hud-green)' }} />
                )}
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold hud-mono" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: 'var(--ks-hud-text)' }}>
                  {stat.label}
                </div>
                {stat.change && (
                  <div className="text-xs" style={{ color: 'var(--ks-hud-secondary)' }}>
                    {stat.change}
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};