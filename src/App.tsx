// App.tsx
import React, { useState } from 'react';
import { Plus, Users, Calendar, Map, Settings } from 'lucide-react';
// import { Navigation } from './ui/sections/Navigation/Navigation';
import { ClientCard } from './ui/composite/ClientCard/ClientCard';
import { LockControl, SystemStats, AccessCodes, QuickStats } from './ui/sections/';
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

  // Filter clients based on view preference
  const getFilteredClients = () => {
    if (showAllTransactions) {
      return clients;
    } else {
      return clients.filter(c => c.status === 'active' || c.status === 'editing');
    }
  };

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

  const filteredClients = getFilteredClients();

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
                    onClick={() => setCurrentView('card')}
                  >
                    <Users className="w-4 h-4" />
                    Cards
                  </Button>
                  <Button
                    size="sm"
                    variant={currentView === 'table' ? 'primary' : 'outline'}
                    onClick={() => setCurrentView('table')}
                  >
                    <Calendar className="w-4 h-4" />
                    Table
                  </Button>
                  <Button
                    size="sm"
                    variant={currentView === 'map' ? 'primary' : 'outline'}
                    onClick={() => setCurrentView('map')}
                  >
                    <Map className="w-4 h-4" />
                    Map
                  </Button>
                </div>
                
                {/* Action Buttons */}
                <Button
                  variant={showAllTransactions ? 'primary' : 'outline'}
                  onClick={toggleShowAll}
                >
                  {showAllTransactions ? 'Show Active' : 'Show All'}
                </Button>
                
                <Button 
                  variant="success" 
                  onClick={addClient}
                >
                  <Plus className="w-4 h-4" />
                  New Client
                </Button>
              </div>
            </div>
            
           {/* Client Grid */}
            {currentView === 'card' && (
              /* ensure each mapped item is a grid child and allow responsive columns */
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
                        <Button variant="primary" onClick={addClient}>
                          <Plus className="w-4 h-4" />
                          Add First Client
                        </Button>
                      </div>
                    </Card>
                  </div>
                ) : (
                  filteredClients.map(client => (
                    /* wrap each card in a grid child container so it doesn't auto-span */
                    <div key={client.id} className="col-span-1 h-full">
                      <ClientCard
                        client={client}
                        onUpdate={updateClient}
                        onStart={startSession}
                        onExtend={extendSession}
                        onComplete={completeSession}
                        onDelete={deleteClient}
                        onShowOnMap={showSeatOnMap}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

            <SystemStats updateInterval={5000} />

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
