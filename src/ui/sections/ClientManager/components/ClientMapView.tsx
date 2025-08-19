import React from 'react';
import { Map, Settings } from 'lucide-react';
import { Card } from '../../../base';
import { type Client } from '../../../../types';

interface ClientMapViewProps {
  clients: Client[];
  selectedClientForMap: number | null;
}

export function ClientMapView({ clients, selectedClientForMap }: ClientMapViewProps) {
  return (
    <Card variant="glass" accentColor="var(--ks-hud-green)">
      <div className="p-8 text-center" data-section="floor-plan">
        <Map className="w-16 h-16 mx-auto mb-4" 
             style={{ color: 'var(--ks-hud-green)' }} />
        <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--ks-hud-green)' }}>
          Interactive Floor Plan
        </h3>
        <p className="mb-4" style={{ color: 'var(--ks-hud-secondary)' }}>
          Real-time workspace visualization with seat assignments
        </p>
        
        {selectedClientForMap && (
          <div className="inline-block mt-4 p-4 rounded-lg" 
               style={{ backgroundColor: 'rgba(74, 158, 255, 0.1)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" 
                   style={{ backgroundColor: 'var(--ks-hud-blue)' }} />
              <span className="text-sm" style={{ color: 'var(--ks-hud-blue)' }}>
                Selected Client: {clients.find(c => c.id === selectedClientForMap)?.name || 'Unknown'}
              </span>
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <div className="inline-flex items-center gap-2 text-sm" 
               style={{ color: 'var(--ks-hud-green)' }}>
            <Settings className="w-4 h-4" />
            Canvas component ready for floor plan implementation
          </div>
        </div>
      </div>
    </Card>
  );
}
