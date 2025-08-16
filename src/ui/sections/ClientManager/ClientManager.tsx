// ClientManager.tsx - Section Component
import React from 'react';
import { Plus, Users, Calendar, Map, Settings } from 'lucide-react';
import { ClientCard } from '../../composite/ClientCard/ClientCard';
import { Button, Card } from '../../base';
import { type ViewType, type Client } from '../../../types';

interface ClientManagerProps {
  clients: Client[];
  currentView: ViewType['current'];
  showAllTransactions: boolean;
  selectedClientForMap: number | null;
  onViewChange: (view: ViewType['current']) => void;
  onToggleShowAll: () => void;
  onAddClient: () => void;
  onUpdateClient: (id: number, updates: Partial<Client>) => void;
  onStartSession: (id: number) => void;
  onExtendSession: (id: number) => void;
  onCompleteSession: (id: number) => void;
  onDeleteClient: (id: number) => void;
  onShowOnMap: (clientId: number) => void;
}

export function ClientManager({
  clients,
  currentView,
  showAllTransactions,
  selectedClientForMap,
  onViewChange,
  onToggleShowAll,
  onAddClient,
  onUpdateClient,
  onStartSession,
  onExtendSession,
  onCompleteSession,
  onDeleteClient,
  onShowOnMap
}: ClientManagerProps) {
  
  // Filter clients based on view preference
  const filteredClients = showAllTransactions 
    ? clients 
    : clients.filter(c => c.status === 'active' || c.status === 'editing');

  return (
    <section>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Users className="w-6 h-6" style={{ color: 'var(--ks-hud-primary)' }} />
          <div>
            <h2 className="text-2xl font-medium" style={{ color: 'var(--ks-hud-primary)' }}>
              Client Sessions
            </h2>
            <p className="text-sm" style={{ color: 'var(--ks-hud-secondary)' }}>
              Manage active workspace sessions
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg" 
               style={{ backgroundColor: 'var(--ks-bg-panel)' }}>
            <Button
              size="sm"
              variant={currentView === 'card' ? 'primary' : 'outline'}
              onClick={() => onViewChange('card')}
            >
              <Users className="w-4 h-4" />
              Cards
            </Button>
            <Button
              size="sm"
              variant={currentView === 'table' ? 'primary' : 'outline'}
              onClick={() => onViewChange('table')}
            >
              <Calendar className="w-4 h-4" />
              Table
            </Button>
            <Button
              size="sm"
              variant={currentView === 'map' ? 'primary' : 'outline'}
              onClick={() => onViewChange('map')}
            >
              <Map className="w-4 h-4" />
              Map
            </Button>
          </div>
          
          {/* Action Buttons */}
          <Button
            variant={showAllTransactions ? 'primary' : 'outline'}
            onClick={onToggleShowAll}
          >
            {showAllTransactions ? 'Show Active' : 'Show All'}
          </Button>
          
          <Button 
            variant="success" 
            onClick={onAddClient}
          >
            <Plus className="w-4 h-4" />
            New Client
          </Button>
        </div>
      </div>
      
      {/* Client Grid */}
      {currentView === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredClients.length === 0 ? (
            <div className="col-span-full">
              <Card variant="panel">
                <div className="p-12 text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" 
                        style={{ color: 'var(--ks-hud-secondary)' }} />
                  <h3 className="text-xl font-medium mb-2" 
                      style={{ color: 'var(--ks-hud-text)' }}>
                    {showAllTransactions ? 'No Clients Found' : 'No Active Sessions'}
                  </h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--ks-hud-secondary)' }}>
                    {showAllTransactions 
                      ? 'No client data available in the system'
                      : 'Start managing workspace sessions by adding a new client'
                    }
                  </p>
                  <Button variant="primary" onClick={onAddClient}>
                    <Plus className="w-4 h-4" />
                    Add First Client
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            filteredClients.map(client => (
              <div key={client.id} className="col-span-1 h-full">
                <ClientCard
                  client={client}
                  onUpdate={onUpdateClient}
                  onStart={onStartSession}
                  onExtend={onExtendSession}
                  onComplete={onCompleteSession}
                  onDelete={onDeleteClient}
                  onShowOnMap={onShowOnMap}
                />
              </div>
            ))
          )}
        </div>
      )}

      {/* Table View */}
      {currentView === 'table' && (
        <Card variant="glass">
          <div className="p-8 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4" 
                     style={{ color: 'var(--ks-hud-blue)' }} />
            <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--ks-hud-text)' }}>
              Table View
            </h3>
            <p className="mb-4" style={{ color: 'var(--ks-hud-secondary)' }}>
              Advanced table view with sorting and filtering capabilities
            </p>
            <div className="inline-flex items-center gap-2 text-sm" 
                 style={{ color: 'var(--ks-hud-blue)' }}>
              <Settings className="w-4 h-4" />
              Component ready for implementation
            </div>
          </div>
        </Card>
      )}

      {/* Map View */}
      {currentView === 'map' && (
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
      )}
    </section>
  );
}