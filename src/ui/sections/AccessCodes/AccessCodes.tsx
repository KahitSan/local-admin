
import React, { useState, useEffect } from 'react';
import { Key, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { Card, Button, StatusBadge } from '../../base';
import { type AccessCode } from '../../../types';

// Helper function
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

interface AccessCodesProps {
  accessCodes: AccessCode[];
  onRefresh?: () => void;
}

export const AccessCodes: React.FC<AccessCodesProps> = ({
  accessCodes,
  onRefresh
}) => {
  const [activeCodes, setActiveCodes] = useState<AccessCode[]>([]);

  useEffect(() => {
    const now = Date.now() / 1000;
    const active = accessCodes.filter(code => code.invalid_time > now);
    setActiveCodes(active);
  }, [accessCodes]);

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const isExpiringSoon = (invalidTime: number): boolean => {
    const now = Date.now() / 1000;
    return (invalidTime - now) < 3600; // Expires within 1 hour
  };

  const getCodeStatus = (code: AccessCode) => {
    if (isExpiringSoon(code.invalid_time)) {
      return { status: 'warning' as const, label: 'Expires Soon' };
    }
    return { status: 'active' as const, label: 'Active' };
  };

  return (
    <Card variant="glass" accentColor="var(--ks-hud-green)">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Key className="w-6 h-6" style={{ color: 'var(--ks-hud-green)' }} />
            <h2 className="text-xl font-medium" style={{ color: 'var(--ks-hud-green)' }}>
              Active Access Codes
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm hud-mono" style={{ color: 'var(--ks-hud-secondary)' }}>
              {activeCodes.length} Active
            </span>
            <Button size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Codes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activeCodes.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Key className="w-12 h-12 mx-auto mb-4 opacity-50" 
                   style={{ color: 'var(--ks-hud-secondary)' }} />
              <p style={{ color: 'var(--ks-hud-secondary)' }}>
                No active access codes
              </p>
            </div>
          ) : (
            activeCodes.map((code, index) => {
              const expiryDate = new Date(code.invalid_time * 1000);
              const codeStatus = getCodeStatus(code);
              
              return (
                <div key={index} className="hud-panel p-4 rounded-lg text-center">
                  <div className="mb-3">
                    <div 
                      className="text-lg font-bold hud-mono mb-1"
                      style={{ 
                        color: codeStatus.status === 'warning' 
                          ? 'var(--ks-hud-orange)' 
                          : 'var(--ks-hud-green)' 
                      }}
                    >
                      {code.name}
                    </div>
                    <StatusBadge status={codeStatus.status}>
                      {codeStatus.status === 'warning' && <AlertCircle className="w-3 h-3" />}
                      {codeStatus.label}
                    </StatusBadge>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-xs" 
                       style={{ color: 'var(--ks-hud-secondary)' }}>
                    <Clock className="w-3 h-3" />
                    <span>Expires { formatTime(expiryDate)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
};