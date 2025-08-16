// App.tsx
import React, { useState } from 'react';
import { Calendar, Settings } from 'lucide-react';
// import { Navigation } from './ui/sections/Navigation/Navigation';
import { LockControl, SystemStats, AccessCodes, QuickStats, ClientManager } from './ui/sections/';
import { Button, Card, StatusBadge } from './ui/base';
import { type ViewType, type Seat } from './types';
import { 
  initialClients, 
  initialSeats, 
  sampleAccessCodes 
} from './data/sampleData';

import KAHITSAN_LOGO from './assets/logo.png';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useClients, useLocalStorage, useTimer } from './hooks';

export default function App() {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [currentView, setCurrentView] = useState<ViewType['current']>('card');
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [selectedClientForMap, setSelectedClientForMap] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useLocalStorage('adminNotes', '');

  // Use timer to update every second for real-time updates
  // const tick = useTimer(1000);

  // Use custom hooks for client management
  const {
    clients,
    addClient,
    updateClient,
    startSession,
    extendSession,
    completeSession,
    deleteClient,
    getActiveCount
  } = useClients(initialClients, seats);

  // Calculate metrics
  const activeSessionsCount = getActiveCount();
  const occupancyRate = Math.round((seats.filter(s => s.status === 'occupied').length / seats.length) * 100);
  const todayRevenue = clients
    .filter(c => c.status === 'completed' || c.status === 'active')
    .reduce((sum, c) => sum + c.payment, 0);

  // Event handlers
  const showSeatOnMap = (clientId: number) => {
    setSelectedClientForMap(clientId);
    setCurrentView('map');
    setTimeout(() => {
      const floorPlanElement = document.querySelector('[data-section="floor-plan"]');
      if (floorPlanElement) {
        floorPlanElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const toggleShowAll = () => {
    setShowAllTransactions(!showAllTransactions);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      alert('Logout functionality would be implemented here');
    }
  };

  const handleLockChange = (isLocked: boolean) => {
    console.log('Lock state changed:', isLocked);
  };

  return (
    <div className="dark min-h-screen" style={{ backgroundColor: 'var(--ks-bg-main)' }}>
      {/* <Navigation 
        activeSessionsCount={activeSessionsCount}
        onLogout={handleLogout}
      /> */}
      
      {/* Main Content */}
      <main>

        {/* Header Section */}
        <div className="border-b p-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={KAHITSAN_LOGO} alt="KahitSan Management" className="h-10 mr-2" />
          <span className="text-1xl " style={{ color: 'var(--ks-hud-primary)' }}>
            Management
          </span>
        </div>
          
          {/* System Status */}
          <div className="flex items-center gap-4">
            <StatusBadge status="active">
              <div className="w-2 h-2 rounded-full bg-current animate-pulse mr-1" />
              System Online
            </StatusBadge>
            <StatusBadge status="info">
              Real-time Updates
            </StatusBadge>
          </div>
        </div>
        
        <div className="mx-auto p-6 space-y-8 max-w-7xl">
          
          {/* System Controls Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <QuickStats
              activeClients={activeSessionsCount}
              occupancyRate={occupancyRate}
              todayRevenue={todayRevenue}
              totalSpaces={seats.length}
            />
            <LockControl onLockChange={handleLockChange} />
          </div>

          {/* Client Management Section */}
          <ClientManager
            clients={clients}
            currentView={currentView}
            showAllTransactions={showAllTransactions}
            selectedClientForMap={selectedClientForMap}
            onViewChange={setCurrentView}
            onToggleShowAll={toggleShowAll}
            onAddClient={addClient}
            onUpdateClient={updateClient}
            onStartSession={startSession}
            onExtendSession={extendSession}
            onCompleteSession={completeSession}
            onDeleteClient={deleteClient}
            onShowOnMap={showSeatOnMap}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            <SystemStats />

            {/* Access Codes Section */}
            <AccessCodes 
              accessCodes={sampleAccessCodes}
              onRefresh={() => alert('Access codes refreshed!')}
            />
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Activity */}
            <Card variant="glass" accentColor="var(--ks-hud-blue)">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2" 
                    style={{ color: 'var(--ks-hud-blue)' }}>
                  <Calendar className="w-5 h-5" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {clients
                    .filter(c => c.status === 'active' || c.status === 'completed')
                    .slice(0, 5)
                    .map((client, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div>
                          <div className="text-sm" style={{ color: 'var(--ks-hud-text)' }}>
                            {client.name} {client.status === 'active' ? 'started' : 'completed'} session
                          </div>
                          <div className="text-xs hud-mono" style={{ color: 'var(--ks-hud-secondary)' }}>
                            {client.spaceType} • {formatTime(client.startTime)}
                          </div>
                        </div>
                        <StatusBadge status={client.status === 'active' ? 'active' : 'inactive'}>
                          {client.status}
                        </StatusBadge>
                      </div>
                    ))}
                  
                  {clients.filter(c => c.status === 'active' || c.status === 'completed').length === 0 && (
                    <div className="text-center py-8" style={{ color: 'var(--ks-hud-secondary)' }}>
                      No recent activity
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Admin Notes */}
            <Card variant="glass" accentColor="var(--ks-hud-orange)">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2" 
                      style={{ color: 'var(--ks-hud-orange)' }}>
                    <Settings className="w-5 h-5" />
                    Quick Notes
                  </h3>
                  <Button size="sm" onClick={() => setAdminNotes('')}>
                    Clear
                  </Button>
                </div>
                
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add quick notes here...

• Daily observations
• Client feedback  
• System updates
• Important reminders"
                  className="w-full h-32 p-3 rounded-md border resize-none text-sm"
                  style={{
                    backgroundColor: 'var(--ks-bg-panel)',
                    borderColor: 'rgba(255, 136, 51, 0.3)',
                    color: 'var(--ks-hud-text)'
                  }}
                />
                
                <div className="mt-3 text-xs" style={{ color: 'var(--ks-hud-secondary)' }}>
                  Notes are automatically saved
                </div>
              </div>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}

// Helper function
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};