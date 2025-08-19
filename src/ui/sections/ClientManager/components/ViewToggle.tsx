import React from 'react';
import { Users, Calendar, Map } from 'lucide-react';
import { Button } from '../../../base';
import { type ViewType } from '../../../../types';

interface ViewToggleProps {
  currentView: ViewType['current'];
  onViewChange: (view: ViewType['current']) => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
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
  );
}
