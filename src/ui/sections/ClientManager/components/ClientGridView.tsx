import React from 'react';
import { ClientCard } from '../../../composite/ClientCard/ClientCard';
import { type Client } from '../../../../types';
import { EmptyState } from './EmptyState';

interface ClientGridViewProps {
  clients: Client[];
  showAllTransactions: boolean;
  onAddClient: () => void;
  onUpdateClient: (id: number, updates: Partial<Client>) => void;
  onStartSession: (id: number) => void;
  onExtendSession: (id: number) => void;
  onCompleteSession: (id: number) => void;
  onDeleteClient: (id: number) => void;
  onShowOnMap: (clientId: number) => void;
}

export function ClientGridView({
  clients,
  showAllTransactions,
  onAddClient,
  onUpdateClient,
  onStartSession,
  onExtendSession,
  onCompleteSession,
  onDeleteClient,
  onShowOnMap
}: ClientGridViewProps) {
  if (clients.length === 0) {
    return <EmptyState showAllTransactions={showAllTransactions} onAddClient={onAddClient} />;
  }

  return (
    <>
      {clients.map(client => (
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
      ))}
    </>
  );
}
