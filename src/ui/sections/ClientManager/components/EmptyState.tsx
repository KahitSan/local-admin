import React from 'react';
import { Users, Plus } from 'lucide-react';
import { Button, Card } from '../../../base';

interface EmptyStateProps {
  showAllTransactions: boolean;
  onAddClient: () => void;
}

export function EmptyState({ showAllTransactions, onAddClient }: EmptyStateProps) {
  return (
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
  );
}
