// src/ui/composite/ClientCard/ClientCard.tsx
import React from 'react';
import { 
  Clock, 
  MapPin, 
  CreditCard, 
  Plus, 
  Check, 
  Activity, 
  Play, 
  Square,
  Settings
} from 'lucide-react';
import { type ClientCardProps } from '../../../types';
import { useSessionTimer } from '../../../hooks/useSessionTimer';

export const ClientCard: React.FC<ClientCardProps> = ({ 
  client, 
  onExtend, 
  onComplete, 
  onShowOnMap
}) => {
  const { timeRemaining, progress, isUrgent, sessionStatus } = useSessionTimer(client);

  const getStatusColor = () => {
    switch (sessionStatus) {
      case 'active': return 'var(--ks-hud-green)';
      case 'urgent': return 'var(--ks-hud-red)';
      case 'booked': return 'var(--ks-hud-blue)';
      case 'completed': return 'var(--ks-hud-secondary)';
      default: return 'var(--ks-hud-primary)';
    }
  };

  const getStatusIcon = () => {
    switch (sessionStatus) {
      case 'active':
      case 'urgent':
        return <Activity className="w-3 h-3" />;
      case 'booked':
        return <Play className="w-3 h-3" />;
      case 'completed':
        return <Square className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getPaymentStatusColor = () => {
    if (client.balance > 0) return 'var(--ks-hud-orange)';
    if (client.payment > 0 && client.balance === 0) return 'var(--ks-hud-green)';
    return 'var(--ks-hud-secondary)';
  };

  const paymentStatusText = () => {
    if (client.balance > 0) return 'PARTIAL';
    if (client.payment > 0) return 'PAID';
    return 'UNPAID';
  };

  return (
    // Make sure the card occupies the grid cell fully — no max-width forcing single-column
    <div className="w-full h-full">
      <div
        className="hud-glass hud-clip-card w-full h-full flex flex-col"
        style={{ '--accent-color': getStatusColor() } as React.CSSProperties}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium" style={{ color: 'var(--ks-hud-primary)' }}>
              {client.name?.toUpperCase() || 'UNNAMED'}
            </span>
          </div>
          <div 
            className="text-xs px-2 py-1 rounded hud-mono flex items-center gap-1"
            style={{
              backgroundColor: `${getStatusColor()}20`,
              color: getStatusColor(),
              border: `1px solid ${getStatusColor()}40`
            }}
          >
            {getStatusIcon()}
            {sessionStatus.toUpperCase()}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 flex-1 flex flex-col">
          {/* Client & Access Code Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs mb-1" style={{ color: 'var(--ks-hud-secondary)' }}>
                Client Type
              </div>
              <div className="text-sm font-medium" style={{ color: 'var(--ks-hud-text)' }}>
                {client.spaceType}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs mb-1" style={{ color: 'var(--ks-hud-secondary)' }}>
                Access Code
              </div>
              <div 
                className="text-lg hud-mono px-3 py-1 rounded border inline-block"
                style={{
                  color: 'var(--ks-hud-primary)',
                  backgroundColor: 'rgba(201, 169, 97, 0.1)',
                  borderColor: 'rgba(201, 169, 97, 0.3)'
                }}
              >
                {client.accessCode}
              </div>
            </div>
          </div>
          
          {client.remarks && (
            <div className="text-xs opacity-70" style={{ color: 'var(--ks-hud-secondary)' }}>
              <Settings className="inline-block w-3 h-3 mr-1" />
              {client.remarks}
            </div>
          )}

          {/* Progress Bar */}
          <div>
            <div className="relative h-8 bg-black/30 rounded border border-white/10 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 relative ${isUrgent ? 'animate-pulse-slow' : ''}`}
                style={{
                  width: `${progress}%`,
                  backgroundColor: `${getStatusColor()}40`
                }}
              >
                <div 
                  className="absolute top-0 right-0 w-1 h-full animate-pulse"
                  style={{ backgroundColor: getStatusColor() }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: getStatusColor() }} />
                  <span className="text-sm hud-mono" style={{ color: getStatusColor() }}>
                    {timeRemaining}
                  </span>
                </div>
                <div className="text-xs hud-mono" style={{ color: 'var(--ks-hud-secondary)' }}>
                  {Math.round(progress)}% done
                </div>
              </div>
            </div>
            {isUrgent && (
              <div className="mt-2 text-xs text-center">
                <span 
                  className="px-2 py-1 rounded hud-mono animate-pulse"
                  style={{
                    backgroundColor: 'var(--ks-hud-red)20',
                    color: 'var(--ks-hud-red)',
                    border: '1px solid var(--ks-hud-red)40'
                  }}
                >
                  ⚠️ SESSION ENDING SOON
                </span>
              </div>
            )}
          </div>

          {/* Session & Space Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="hud-panel p-3 rounded">
              <div className="flex items-center gap-2 mb-1" style={{ color: 'var(--ks-hud-secondary)' }}>
                <Clock className="w-3 h-3" />
                <span>Duration</span>
              </div>
              <div className="text-sm hud-mono" style={{ color: 'var(--ks-hud-text)' }}>
                {client.duration} Hours
              </div>
            </div>
            <button
              onClick={() => onShowOnMap(client.id)}
              className="hud-panel p-3 rounded transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1" style={{ color: 'var(--ks-hud-secondary)' }}>
                <MapPin className="w-3 h-3" />
                <span>Seat</span>
              </div>
              <div className="flex items-center justify-between text-sm hud-mono" style={{ color: 'var(--ks-hud-text)' }}>
                <span>{client.seatId || '--'}</span>
                <span className="text-xs opacity-50" style={{ color: 'var(--ks-hud-blue)' }}>
                  View Map
                </span>
              </div>
            </button>
          </div>

          {/* Payment Status */}
          <div 
            className="p-3 rounded border"
            style={{
              backgroundColor: `${getPaymentStatusColor()}10`,
              borderColor: `${getPaymentStatusColor()}40`
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" style={{ color: getPaymentStatusColor() }} />
                <span className="text-xs" style={{ color: getPaymentStatusColor() }}>
                  Payment Status
                </span>
              </div>
              <div className="text-sm hud-mono" style={{ color: getPaymentStatusColor() }}>
                {paymentStatusText()}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span style={{ color: 'var(--ks-hud-secondary)' }}>Total: </span>
                <span className="hud-mono" style={{ color: getPaymentStatusColor() }}>
                  ₱{client.payment + client.balance}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--ks-hud-secondary)' }}>Remaining: </span>
                <span 
                  className="hud-mono" 
                  style={{ color: client.balance > 0 ? 'var(--ks-hud-orange)' : 'var(--ks-hud-green)' }}
                >
                  ₱{client.balance}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onExtend(client.id)}
              disabled={sessionStatus === 'completed'}
              className="p-3 rounded border hud-scan-line transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'rgba(201, 169, 97, 0.1)',
                borderColor: 'rgba(201, 169, 97, 0.4)',
                color: 'var(--ks-hud-primary)'
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                <span className="text-sm">Extend</span>
              </div>
            </button>
            <button
              onClick={() => onComplete(client.id)}
              disabled={sessionStatus === 'completed'}
              className="hud-clip-button p-3 hud-scan-line transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: sessionStatus === 'completed' 
                  ? 'rgba(138, 138, 138, 0.1)' 
                  : 'rgba(255, 136, 51, 0.1)',
                border: `1px solid ${sessionStatus === 'completed' 
                  ? 'rgba(138, 138, 138, 0.4)' 
                  : 'rgba(255, 136, 51, 0.4)'}`,
                color: sessionStatus === 'completed' 
                  ? 'var(--ks-hud-secondary)' 
                  : 'var(--ks-hud-orange)'
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span className="text-sm">Complete</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
