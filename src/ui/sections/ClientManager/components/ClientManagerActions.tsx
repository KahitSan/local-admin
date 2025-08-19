import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../base';

interface ClientManagerActionsProps {
  showAllTransactions: boolean;
  onToggleShowAll: () => void;
  onAddClient: () => void;
}

export function ClientManagerActions({ 
  showAllTransactions, 
  onToggleShowAll, 
  onAddClient 
}: ClientManagerActionsProps) {
  return (
    <>
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
    </>
  );
}
