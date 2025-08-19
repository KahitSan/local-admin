// Optimized ClientCard.tsx with Performance Improvements

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { 
  Clock, 
  MapPin, 
  CreditCard, 
  Plus, 
  Check, 
  Activity, 
  Square,
  Settings,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Edit3
} from 'lucide-react';
import { type ClientCardProps } from '../../../types';
import { useSessionTimer } from '../../../hooks/useSessionTimer';

// Memoized Editable Field Component
const EditableField = memo(({ 
  fieldName, 
  displayValue, 
  type = 'text', 
  className = '', 
  style = {},
  isEditing,
  editValue,
  onEditValueChange,
  onStartEdit,
  onSaveEdit,
  onKeyDown
}: {
  fieldName: string;
  displayValue: string;
  type?: 'text' | 'number';
  className?: string;
  style?: React.CSSProperties;
  isEditing: boolean;
  editValue: string | number;
  onEditValueChange: (value: string | number) => void;
  onStartEdit: (fieldName: string, event: React.MouseEvent) => void;
  onSaveEdit: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}) => {
  if (isEditing) {
    return (
      <input
        type={type}
        value={editValue}
        onChange={(e) => onEditValueChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onSaveEdit}
        autoFocus
        className="bg-black/50 border border-white/20 rounded px-1 py-0.5 text-sm hud-mono outline-none focus:border-white/40 min-w-0"
        style={{ color: 'var(--ks-hud-text)', ...style }}
      />
    );
  }

  return (
    <div
      className={`cursor-pointer hover:bg-white/5 rounded px-1 py-0.5 transition-colors group ${className}`}
      onDoubleClick={(e) => onStartEdit(fieldName, e)}
      style={style}
      title="Double-click to edit"
    >
      <span>{displayValue}</span>
      <Edit3 className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-30 inline transition-opacity" />
    </div>
  );
});

EditableField.displayName = 'EditableField';

// Memoized Progress Bar Component
const ProgressBar = memo(({ 
  progress, 
  timeRemaining, 
  statusColor, 
  shouldPulse 
}: {
  progress: number;
  timeRemaining: string;
  statusColor: string;
  shouldPulse: boolean;
}) => (
  <div className="relative h-8 bg-black/30 rounded border border-white/10 overflow-hidden">
    <div 
      className={`h-full transition-all duration-1000 relative ${shouldPulse ? 'animate-pulse-slow' : ''}`}
      style={{
        width: `${progress}%`,
        backgroundColor: `${statusColor}40`
      }}
    >
      <div 
        className="absolute top-0 right-0 w-1 h-full animate-pulse"
        style={{ backgroundColor: statusColor }}
      />
    </div>
    <div className="absolute inset-0 flex items-center justify-between px-3">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4" style={{ color: statusColor }} />
        <span className="text-sm hud-mono" style={{ color: statusColor }}>
          {timeRemaining}
        </span>
      </div>
      <div className="text-xs hud-mono" style={{ color: 'var(--ks-hud-secondary)' }}>
        {Math.round(progress)}% done
      </div>
    </div>
  </div>
));

ProgressBar.displayName = 'ProgressBar';

export const ClientCard: React.FC<ClientCardProps> = memo(({ 
  client, 
  onExtend, 
  onComplete, 
  onShowOnMap,
  onUpdate
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { timeRemaining, progress, sessionStatus } = useSessionTimer(client);
  const autoCollapseTimer = useRef<NodeJS.Timeout | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string | number>('');

  const AUTO_COLLAPSE_DELAY = 10000;

  // Memoize expensive calculations
  const statusInfo = useMemo(() => {
    const getStatusColor = () => {
      switch (sessionStatus) {
        case 'active': return 'var(--ks-hud-green)';
        case 'warning': return 'var(--ks-hud-orange)';
        case 'urgent': return 'var(--ks-hud-red)';
        case 'editing': return 'var(--ks-hud-blue)';
        case 'completed': return 'var(--ks-hud-secondary)';
        default: return 'var(--ks-hud-primary)';
      }
    };

    const getStatusIcon = () => {
      switch (sessionStatus) {
        case 'active': return <Activity className="w-3 h-3" />;
        case 'warning': return <AlertTriangle className="w-3 h-3" />;
        case 'urgent': return <Activity className="w-3 h-3" />;
        case 'editing': return <Settings className="w-3 h-3" />;
        case 'completed': return <Square className="w-3 h-3" />;
        default: return <Clock className="w-3 h-3" />;
      }
    };

    return {
      color: getStatusColor(),
      icon: getStatusIcon(),
      shouldPulse: sessionStatus === 'warning' || sessionStatus === 'urgent'
    };
  }, [sessionStatus]);

  const paymentInfo = useMemo(() => {
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

    const getPaymentIcon = () => {
      if (client.balance > 0) return <CreditCard className="w-3 h-3" />;
      if (client.payment > 0) return <CheckCircle className="w-3 h-3" />;
      return <XCircle className="w-3 h-3" />;
    };

    return {
      color: getPaymentStatusColor(),
      text: paymentStatusText(),
      icon: getPaymentIcon()
    };
  }, [client.balance, client.payment]);

  // Memoize field values
  const fieldValues = useMemo(() => ({
    name: client.name || '',
    spaceType: client.spaceType || '',
    remarks: client.remarks || '',
    accessCode: client.accessCode || '',
    duration: client.duration || 0,
    seatId: client.seatId || '',
    payment: client.payment || 0
  }), [client]);

  const clearAutoCollapseTimer = useCallback(() => {
    if (autoCollapseTimer.current) {
      clearTimeout(autoCollapseTimer.current);
      autoCollapseTimer.current = null;
    }
  }, []);

  const startAutoCollapseTimer = useCallback(() => {
    clearAutoCollapseTimer();
    autoCollapseTimer.current = setTimeout(() => {
      if (!editingField) {
        setIsExpanded(false);
      }
    }, AUTO_COLLAPSE_DELAY);
  }, [editingField, clearAutoCollapseTimer]);

  // Throttled reset timer to prevent excessive calls on mouse move
  const resetAutoCollapseTimer = useCallback(() => {
    if (isExpanded && !editingField) {
      startAutoCollapseTimer();
    }
  }, [isExpanded, editingField, startAutoCollapseTimer]);

  const handleExpand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleCollapse = useCallback(() => {
    setIsExpanded(false);
    setEditingField(null);
    clearAutoCollapseTimer();
  }, [clearAutoCollapseTimer]);

  const getFieldValue = useCallback((fieldName: string) => {
    return fieldValues[fieldName as keyof typeof fieldValues] || '';
  }, [fieldValues]);

  const startEdit = useCallback((fieldName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const currentValue = getFieldValue(fieldName);
    setEditValue(currentValue);
    setEditingField(fieldName);
    clearAutoCollapseTimer();
  }, [getFieldValue, clearAutoCollapseTimer]);

  const saveEdit = useCallback(() => {
    if (editingField && onUpdate) {
      onUpdate(client.id, { [editingField]: editValue });
    }
    setEditingField(null);
    if (isExpanded) {
      startAutoCollapseTimer();
    }
  }, [editingField, editValue, onUpdate, client.id, isExpanded, startAutoCollapseTimer]);

  const cancelEdit = useCallback(() => {
    setEditingField(null);
    setEditValue('');
    if (isExpanded) {
      startAutoCollapseTimer();
    }
  }, [isExpanded, startAutoCollapseTimer]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      saveEdit();
    } else if (event.key === 'Escape') {
      cancelEdit();
    }
  }, [saveEdit, cancelEdit]);

  const handleEditValueChange = useCallback((value: string | number) => {
    setEditValue(value);
  }, []);

  // Throttled mouse handlers to reduce excessive timer resets
  const throttledResetTimer = useRef<NodeJS.Timeout | null>(null);
  const handleMouseInteraction = useCallback(() => {
    if (throttledResetTimer.current) return;
    
    throttledResetTimer.current = setTimeout(() => {
      resetAutoCollapseTimer();
      throttledResetTimer.current = null;
    }, 100); // Throttle to 100ms
  }, [resetAutoCollapseTimer]);

  useEffect(() => {
    if (isExpanded && !editingField) {
      startAutoCollapseTimer();
    } else {
      clearAutoCollapseTimer();
    }
    return clearAutoCollapseTimer;
  }, [isExpanded, editingField, startAutoCollapseTimer, clearAutoCollapseTimer]);

  // Cleanup throttled timer on unmount
  useEffect(() => {
    return () => {
      if (throttledResetTimer.current) {
        clearTimeout(throttledResetTimer.current);
      }
    };
  }, []);

  // Compact View
  if (!isExpanded) {
    return (
      <div className="w-full">
        <div
          className={`hud-glass hud-clip-card hud-interactive w-full transition-all duration-200 ${
            statusInfo.shouldPulse ? 'animate-pulse-slow' : ''
          }`}
        >
          <div className="p-3 pb-4">
            <div className="flex items-center justify-between mb-2">
              <EditableField
                fieldName="name"
                displayValue={fieldValues.name.toUpperCase() || 'UNNAMED'}
                className="text-sm font-medium truncate pr-2"
                style={{ color: 'var(--ks-hud-primary)' }}
                isEditing={editingField === 'name'}
                editValue={editValue}
                onEditValueChange={handleEditValueChange}
                onStartEdit={startEdit}
                onSaveEdit={saveEdit}
                onKeyDown={handleKeyDown}
              />
              <div 
                className={`text-xs px-2 py-1 rounded hud-mono flex items-center gap-1 shrink-0 ${
                  statusInfo.shouldPulse ? 'animate-pulse' : ''
                }`}
                style={{
                  backgroundColor: `${statusInfo.color}20`,
                  color: statusInfo.color,
                  border: `1px solid ${statusInfo.color}40`
                }}
              >
                {statusInfo.icon}
                {sessionStatus.toUpperCase()}
              </div>
            </div>

            <ProgressBar
              progress={progress}
              timeRemaining={timeRemaining}
              statusColor={statusInfo.color}
              shouldPulse={statusInfo.shouldPulse}
            />
            
            <div className="flex items-center justify-between text-xs mt-3">
              <div className="flex items-center gap-2">
                <EditableField
                  fieldName="spaceType"
                  displayValue={fieldValues.spaceType || 'N/A'}
                  style={{ color: 'var(--ks-hud-secondary)' }}
                  isEditing={editingField === 'spaceType'}
                  editValue={editValue}
                  onEditValueChange={handleEditValueChange}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onKeyDown={handleKeyDown}
                />
                <span>•</span>
                <EditableField
                  fieldName="seatId"
                  displayValue={fieldValues.seatId || '--'}
                  style={{ color: 'var(--ks-hud-secondary)' }}
                  isEditing={editingField === 'seatId'}
                  editValue={editValue}
                  onEditValueChange={handleEditValueChange}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onKeyDown={handleKeyDown}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1" style={{ color: paymentInfo.color }}>
                  {paymentInfo.icon}
                  <span className="text-xs hud-mono">{paymentInfo.text}</span>
                </div>
                <button
                  onClick={handleExpand}
                  className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
                  title="Expand details"
                >
                  <ChevronDown className="w-4 h-4" style={{ color: 'var(--ks-hud-primary)' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Expanded View
  return (
    <div className="w-full">
      <div
        className="hud-glass hud-clip-card hud-interactive w-full flex flex-col"
        onMouseEnter={handleMouseInteraction}
        onMouseMove={handleMouseInteraction}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <EditableField
            fieldName="name"
            displayValue={fieldValues.name.toUpperCase() || 'UNNAMED'}
            className="text-sm font-medium"
            style={{ color: 'var(--ks-hud-primary)' }}
            isEditing={editingField === 'name'}
            editValue={editValue}
            onEditValueChange={handleEditValueChange}
            onStartEdit={startEdit}
            onSaveEdit={saveEdit}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-2">
            <div 
              className={`text-xs px-2 py-1 rounded hud-mono flex items-center gap-1 ${
                statusInfo.shouldPulse ? 'animate-pulse' : ''
              }`}
              style={{
                backgroundColor: `${statusInfo.color}20`,
                color: statusInfo.color,
                border: `1px solid ${statusInfo.color}40`
              }}
            >
              {statusInfo.icon}
              {sessionStatus.toUpperCase()}
            </div>
            <button
              onClick={handleCollapse}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <ChevronUp className="w-4 h-4" style={{ color: 'var(--ks-hud-secondary)' }} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4 flex-1 flex flex-col">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs mb-1" style={{ color: 'var(--ks-hud-secondary)' }}>Client Type</div>
              <EditableField
                fieldName="spaceType"
                displayValue={fieldValues.spaceType || 'N/A'}
                className="text-sm font-medium"
                style={{ color: 'var(--ks-hud-text)' }}
                isEditing={editingField === 'spaceType'}
                editValue={editValue}
                onEditValueChange={handleEditValueChange}
                onStartEdit={startEdit}
                onSaveEdit={saveEdit}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="text-right">
              <div className="text-xs mb-1" style={{ color: 'var(--ks-hud-secondary)' }}>Access Code</div>
              <EditableField
                fieldName="accessCode"
                displayValue={fieldValues.accessCode || '----'}
                className="text-lg hud-mono px-3 py-1 rounded border inline-block"
                style={{
                  color: 'var(--ks-hud-primary)',
                  backgroundColor: 'rgba(201, 169, 97, 0.1)',
                  borderColor: 'rgba(201, 169, 97, 0.3)'
                }}
                isEditing={editingField === 'accessCode'}
                editValue={editValue}
                onEditValueChange={handleEditValueChange}
                onStartEdit={startEdit}
                onSaveEdit={saveEdit}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          
          {client.remarks && (
            <div className="text-xs opacity-70" style={{ color: 'var(--ks-hud-secondary)' }}>
              <Settings className="inline-block w-3 h-3 mr-1" />
              <EditableField
                fieldName="remarks"
                displayValue={fieldValues.remarks}
                isEditing={editingField === 'remarks'}
                editValue={editValue}
                onEditValueChange={handleEditValueChange}
                onStartEdit={startEdit}
                onSaveEdit={saveEdit}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}

          <ProgressBar
            progress={progress}
            timeRemaining={timeRemaining}
            statusColor={statusInfo.color}
            shouldPulse={statusInfo.shouldPulse}
          />

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="hud-panel p-3 rounded">
              <div className="flex items-center gap-2 mb-1" style={{ color: 'var(--ks-hud-secondary)' }}>
                <Clock className="w-3 h-3" />
                <span>Duration</span>
              </div>
              <EditableField
                fieldName="duration"
                displayValue={`${fieldValues.duration} Hours`}
                type="number"
                className="text-sm hud-mono"
                style={{ color: 'var(--ks-hud-text)' }}
                isEditing={editingField === 'duration'}
                editValue={editValue}
                onEditValueChange={handleEditValueChange}
                onStartEdit={startEdit}
                onSaveEdit={saveEdit}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="hud-panel p-3 rounded">
              <div className="flex items-center gap-2 mb-1" style={{ color: 'var(--ks-hud-secondary)' }}>
                <MapPin className="w-3 h-3" />
                <span>Seat</span>
              </div>
              <EditableField
                fieldName="seatId"
                displayValue={fieldValues.seatId || '--'}
                className="text-sm hud-mono"
                style={{ color: 'var(--ks-hud-text)' }}
                isEditing={editingField === 'seatId'}
                editValue={editValue}
                onEditValueChange={handleEditValueChange}
                onStartEdit={startEdit}
                onSaveEdit={saveEdit}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <div 
            className="p-3 rounded border"
            style={{
              backgroundColor: `${paymentInfo.color}10`,
              borderColor: `${paymentInfo.color}40`
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" style={{ color: paymentInfo.color }} />
                <span className="text-xs" style={{ color: paymentInfo.color }}>Payment Status</span>
              </div>
              <div className="text-sm hud-mono" style={{ color: paymentInfo.color }}>
                {paymentInfo.text}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span style={{ color: 'var(--ks-hud-secondary)' }}>Total: </span>
                <span className="hud-mono" style={{ color: paymentInfo.color }}>
                  ₱{client.payment + client.balance}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--ks-hud-secondary)' }}>Payment: </span>
                <EditableField
                  fieldName="payment"
                  displayValue={`₱${fieldValues.payment}`}
                  type="number"
                  className="hud-mono inline"
                  style={{ color: paymentInfo.color }}
                  isEditing={editingField === 'payment'}
                  editValue={editValue}
                  onEditValueChange={handleEditValueChange}
                  onStartEdit={startEdit}
                  onSaveEdit={saveEdit}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onExtend(client.id)}
              disabled={sessionStatus === 'completed'}
              className={`p-3 rounded border hud-scan-line transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                sessionStatus === 'warning' ? 'animate-pulse-slow' : ''
              }`}
              style={{
                backgroundColor: sessionStatus === 'warning' 
                  ? 'rgba(255, 136, 51, 0.15)' 
                  : 'rgba(201, 169, 97, 0.1)',
                borderColor: sessionStatus === 'warning'
                  ? 'rgba(255, 136, 51, 0.5)'
                  : 'rgba(201, 169, 97, 0.4)',
                color: sessionStatus === 'warning'
                  ? 'var(--ks-hud-orange)'
                  : 'var(--ks-hud-primary)'
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                <span className="text-sm">{sessionStatus === 'warning' ? 'Extend Now' : 'Extend'}</span>
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
});

ClientCard.displayName = 'ClientCard';