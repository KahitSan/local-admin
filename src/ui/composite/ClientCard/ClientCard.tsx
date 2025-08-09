// src/ui/composite/ClientCard/ClientCard.tsx

import React from 'react';
import { type ClientCardProps } from '../../../types';
import { HudButton, HudInput, HudSelect, HudLabel, StatusBadge, FormGroup } from '../../base';
import { calculatePrice, formatTime, getTimeRemaining, getSpaceTypeOptions } from '../../../utils';
import { PricingDisplay } from '../PricingDisplay/PricingDisplay';

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onUpdate,
  onStart,
  onExtend,
  onComplete,
  onDelete,
  onShowOnMap,
}) => {
  const price = calculatePrice(client.spaceType, client.duration);
  const isActive = client.status === "active";
  const timeRemaining = isActive ? getTimeRemaining(client.startTime, client.duration) : null;

  const handleExtend = () => {
    const additionalHours = prompt("Additional hours:", "1");
    if (additionalHours && !isNaN(Number(additionalHours))) {
      onExtend(client.id);
    }
  };

  return (
    <div className="client-card" style={{
      background: 'var(--ks-bg-glass)',
      border: '1px solid rgba(201, 169, 97, 0.3)',
      borderLeft: '2px solid var(--ks-hud-primary)',
      padding: 'var(--ks-space-6)',
      backdropFilter: 'blur(10px)',
      transition: 'var(--ks-transition-hud)',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--ks-space-4)' }}>
        <div>
          <div style={{
            fontSize: 'var(--ks-font-size-xl)',
            color: 'var(--ks-hud-primary)',
            fontFamily: 'var(--ks-font-digital)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: 'var(--ks-space-1)'
          }}>
            {client.name || 'New Client'}
          </div>
          <div style={{
            fontSize: 'var(--ks-font-size-sm)',
            color: 'rgba(255, 255, 255, 0.6)',
            fontFamily: 'var(--ks-font-digital)'
          }}>
            Code: {client.accessCode} | Seat: {client.seatId || 'Unassigned'}
          </div>
        </div>
        <StatusBadge status={client.status}>
          {client.status.toUpperCase()}
        </StatusBadge>
      </div>
      
      {client.status === "editing" ? (
        <div style={{ display: 'grid', gap: 'var(--ks-space-4)' }}>
          <FormGroup>
            <HudLabel>Client Name</HudLabel>
            <HudInput
              value={client.name}
              onChange={(value) => onUpdate(client.id, 'name', value)}
              placeholder="Enter client name"
            />
          </FormGroup>
          
          <FormGroup>
            <HudLabel>Remarks</HudLabel>
            <HudInput
              value={client.remarks}
              onChange={(value) => onUpdate(client.id, 'remarks', value)}
              placeholder="Optional remarks"
            />
          </FormGroup>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--ks-space-3)' }}>
            <FormGroup>
              <HudLabel>Duration (Hours)</HudLabel>
              <HudInput
                type="number"
                value={client.duration}
                onChange={(value) => onUpdate(client.id, 'duration', parseInt(value))}
                min={1}
                max={24}
              />
            </FormGroup>
            
            <FormGroup>
              <HudLabel>Space Type</HudLabel>
              <HudSelect
                value={client.spaceType}
                onChange={(value) => onUpdate(client.id, 'spaceType', value)}
                options={getSpaceTypeOptions()}
              />
            </FormGroup>
          </div>
          
          <PricingDisplay price={price} spaceType={client.spaceType} duration={client.duration} />
          
          <div style={{ display: 'flex', gap: 'var(--ks-space-3)' }}>
            <HudButton
              variant="success"
              onClick={() => onStart(client.id)}
              disabled={!client.name}
              style={{ flex: 1 }}
            >
              Start Session
            </HudButton>
            <HudButton
              variant="danger"
              onClick={() => onDelete(client.id)}
              style={{ flex: 1 }}
            >
              Delete
            </HudButton>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: 'var(--ks-space-4)' }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: 'var(--ks-space-2)' }}>
              <strong>Space:</strong> {client.spaceType} | <strong>Duration:</strong> {client.duration}h
            </div>
            {client.remarks && (
              <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: 'var(--ks-font-size-sm)' }}>
                {client.remarks}
              </div>
            )}
            {client.seatId && (
              <div style={{
                color: 'var(--ks-hud-primary)',
                fontFamily: 'var(--ks-font-digital)',
                marginTop: 'var(--ks-space-2)'
              }}>
                Seat: {client.seatId}{' '}
                <HudButton
                  onClick={() => onShowOnMap(client.id)}
                  style={{ padding: '2px 6px', minHeight: '20px', fontSize: '8px', marginLeft: '8px' }}
                >
                  Show on Map
                </HudButton>
              </div>
            )}
          </div>
          
          {isActive && timeRemaining && (
            <>
              <div style={{
                textAlign: 'center',
                fontFamily: 'var(--ks-font-digital)',
                fontSize: 'var(--ks-font-size-2xl)',
                color: 'var(--ks-hud-green)',
                letterSpacing: '2px',
                margin: 'var(--ks-space-3) 0'
              }}>
                {timeRemaining}
              </div>
              <div style={{
                textAlign: 'center',
                fontSize: 'var(--ks-font-size-sm)',
                color: 'var(--ks-hud-secondary)',
                marginBottom: 'var(--ks-space-4)'
              }}>
                Started: {formatTime(client.startTime)}
              </div>
            </>
          )}
          
          {!isActive && (
            <div style={{
              textAlign: 'center',
              fontSize: 'var(--ks-font-size-sm)',
              color: 'var(--ks-hud-secondary)',
              marginBottom: 'var(--ks-space-4)'
            }}>
              Completed: {formatTime(client.startTime)}
            </div>
          )}
          
          <PricingDisplay price={price} payment={client.payment} />
          
          <div style={{ display: 'flex', gap: 'var(--ks-space-3)' }}>
            {isActive ? (
              <>
                <HudButton onClick={handleExtend} style={{ flex: 1 }}>
                  + Extend
                </HudButton>
                <HudButton
                  variant="success"
                  onClick={() => onComplete(client.id)}
                  style={{ flex: 1 }}
                >
                  Complete
                </HudButton>
              </>
            ) : (
              <HudButton
                variant="danger"
                onClick={() => onDelete(client.id)}
                style={{ flex: 1 }}
              >
                Delete
              </HudButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

