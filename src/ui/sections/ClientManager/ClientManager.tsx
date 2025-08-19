// ClientManager.tsx - Section Component (Refactored)
import React from 'react';
import { type ViewType, type Client } from '../../../types';
import {
  ClientManagerHeader,
  ViewToggle,
  ClientManagerActions,
  ClientGridView,
  ClientTableView,
  ClientMapView
} from './components';

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
        <ClientManagerHeader />
        
        <div className="flex flex-wrap items-center gap-3">
          <ViewToggle 
            currentView={currentView} 
            onViewChange={onViewChange} 
          />
          
          <ClientManagerActions
            showAllTransactions={showAllTransactions}
            onToggleShowAll={onToggleShowAll}
            onAddClient={onAddClient}
          />
        </div>
      </div>
      
      {/* Client Grid */}
      {currentView === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ClientGridView
            clients={filteredClients}
            showAllTransactions={showAllTransactions}
            onAddClient={onAddClient}
            onUpdateClient={onUpdateClient}
            onStartSession={onStartSession}
            onExtendSession={onExtendSession}
            onCompleteSession={onCompleteSession}
            onDeleteClient={onDeleteClient}
            onShowOnMap={onShowOnMap}
          />
        </div>
      )}

      {/* Table View */}
      {currentView === 'table' && <ClientTableView />}

      {/* Map View */}
      {currentView === 'map' && (
        <ClientMapView 
          clients={clients}
          selectedClientForMap={selectedClientForMap}
        />
      )}
    </section>
  );
}
