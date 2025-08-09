import React, { useState } from 'react';
import { AdminLayout } from './layouts/AdminLayout/AdminLayout';
import { ClientCard } from './ui/composite/ClientCard/ClientCard';
import { HudButton, HudCard } from './ui/base';
import { type Client, type ViewType } from './types';
import { initialClients } from './data/sampleData';
import { generateAccessCode, calculatePrice } from './utils';
import './styles/design-system.css';

function App() {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [currentView, setCurrentView] = useState<ViewType['current']>('card');
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [nextClientId, setNextClientId] = useState(8);

  // Get active clients count for navigation
  const activeSessionsCount = clients.filter(c => c.status === 'active').length;

  // Filter clients based on view preference
  const getFilteredClients = () => {
    if (showAllTransactions) {
      return clients;
    } else {
      return clients.filter(c => c.status === 'active' || c.status === 'editing');
    }
  };

  // Client management functions
  const updateClient = (clientId: number, field: keyof Client, value: unknown) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId) {
        const updated = { ...client, [field]: value };
        
        // Recalculate balance if price-affecting fields change
        if (field === 'spaceType' || field === 'duration') {
          const newPrice = calculatePrice(updated.spaceType, updated.duration);
          updated.balance = newPrice - updated.payment;
        }
        
        return updated;
      }
      return client;
    }));
  };

  const addNewClient = () => {
    const newClient: Client = {
      id: nextClientId,
      name: "",
      remarks: "",
      startTime: new Date(),
      duration: 8,
      spaceType: "Entrance",
      seatId: null,
      accessCode: generateAccessCode(),
      status: "editing",
      payment: 0,
      balance: 0
    };
    
    setClients(prev => [newClient, ...prev]);
    setNextClientId(prev => prev + 1);
  };

  const startSession = (clientId: number) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          status: 'active' as const,
          startTime: new Date()
        };
      }
      return client;
    }));
  };

  const extendSession = (clientId: number) => {
    const additionalHours = prompt("Additional hours:", "1");
    if (additionalHours && !isNaN(Number(additionalHours))) {
      setClients(prev => prev.map(client => {
        if (client.id === clientId) {
          const newDuration = client.duration + parseInt(additionalHours);
          const newPrice = calculatePrice(client.spaceType, newDuration);
          return {
            ...client,
            duration: newDuration,
            balance: newPrice - client.payment
          };
        }
        return client;
      }));
    }
  };

  const completeSession = (clientId: number) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId) {
        return { ...client, status: 'completed' as const };
      }
      return client;
    }));
  };

  const deleteClient = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    const needsConfirmation = client && (client.status === "active" || client.status === "completed");
    
    if (needsConfirmation) {
      if (!confirm(`Are you sure you want to delete ${client.name || 'this client'}? This action cannot be undone.`)) {
        return;
      }
    }
    
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  const showSeatOnMap = (clientId: number) => {
    // This would scroll to floor plan and highlight the seat
    alert(`Showing seat for client ${clientId} on map`);
  };

  const toggleShowAll = () => {
    setShowAllTransactions(!showAllTransactions);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      alert('Logout functionality would be implemented here');
    }
  };

  const filteredClients = getFilteredClients();

  return (
    <AdminLayout 
      activeSessionsCount={activeSessionsCount}
      onLogout={handleLogout}
    >
      {/* Demo Lock Control Section */}
      <HudCard borderColor="var(--ks-hud-primary)" style={{ marginBottom: 'var(--ks-space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ks-space-3)', marginBottom: 'var(--ks-space-5)' }}>
          <div style={{ fontSize: 'var(--ks-font-size-2xl)' }}>🔐</div>
          <div style={{
            fontSize: 'var(--ks-font-size-2xl)',
            color: 'var(--ks-hud-primary)',
            fontFamily: 'var(--ks-font-digital)',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            Smart Access Lock Control
          </div>
        </div>
        <div style={{
          padding: 'var(--ks-space-4)',
          background: 'rgba(0, 0, 0, 0.3)',
          border: 'var(--ks-border-hud-thin)',
          textAlign: 'center',
          fontFamily: 'var(--ks-font-digital)'
        }}>
          🔒 SYSTEM READY - Lock controls would be implemented here
        </div>
      </HudCard>

      {/* Client Manager Section */}
      <section>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--ks-space-6)',
          flexWrap: 'wrap',
          gap: 'var(--ks-space-3)',
          marginTop: 'var(--ks-space-8)',
        }}>
          <h2 style={{
            fontSize: 'var(--ks-font-size-3xl)',
            color: 'var(--ks-hud-primary)',
            fontFamily: 'var(--ks-font-digital)',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            Client Manager
          </h2>
          
          <div style={{
            display: 'flex',
            gap: 'var(--ks-space-3)',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', gap: 'var(--ks-space-1)' }}>
              <HudButton 
                active={currentView === 'card'}
                onClick={() => setCurrentView('card')}
                style={{ padding: 'var(--ks-space-2) var(--ks-space-4)', minHeight: '36px', fontSize: 'var(--ks-font-size-xs)' }}
              >
                📋 Cards
              </HudButton>
              <HudButton 
                active={currentView === 'table'}
                onClick={() => setCurrentView('table')}
                style={{ padding: 'var(--ks-space-2) var(--ks-space-4)', minHeight: '36px', fontSize: 'var(--ks-font-size-xs)' }}
              >
                📊 Table
              </HudButton>
              <HudButton 
                active={currentView === 'map'}
                onClick={() => setCurrentView('map')}
                style={{ padding: 'var(--ks-space-2) var(--ks-space-4)', minHeight: '36px', fontSize: 'var(--ks-font-size-xs)' }}
              >
                🗺️ Map
              </HudButton>
            </div>
            
            <HudButton
              active={showAllTransactions}
              onClick={toggleShowAll}
            >
              {showAllTransactions ? 'Show Active' : 'Show All'}
            </HudButton>
            
            <HudButton 
              variant="primary"
              onClick={addNewClient}
            >
              + Add New Client
            </HudButton>
          </div>
        </div>
        
        {currentView === 'card' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: 'var(--ks-space-6)',
            marginBottom: 'var(--ks-space-8)'
          }}>
            {filteredClients.length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: 'var(--ks-space-10)',
                color: 'rgba(255, 255, 255, 0.5)'
              }}>
                <div style={{ fontSize: 'var(--ks-font-size-4xl)', marginBottom: 'var(--ks-space-4)' }}>📋</div>
                <div style={{
                  fontFamily: 'var(--ks-font-digital)',
                  fontSize: 'var(--ks-font-size-xl)',
                  marginBottom: 'var(--ks-space-3)'
                }}>
                  {showAllTransactions ? 'NO CLIENTS FOUND' : 'NO ACTIVE CLIENTS'}
                </div>
                <div>Click "Add New Client" to start managing sessions</div>
              </div>
            ) : (
              filteredClients.map(client => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onUpdate={updateClient}
                  onStart={startSession}
                  onExtend={extendSession}
                  onComplete={completeSession}
                  onDelete={deleteClient}
                  onShowOnMap={showSeatOnMap}
                />
              ))
            )}
          </div>
        )}

        {currentView === 'table' && (
          <HudCard style={{ marginBottom: 'var(--ks-space-8)', overflowX: 'auto' }}>
            <div style={{
              padding: 'var(--ks-space-4)',
              background: 'rgba(0, 0, 0, 0.3)',
              border: 'var(--ks-border-hud-thin)',
              textAlign: 'center',
              fontFamily: 'var(--ks-font-digital)'
            }}>
              📊 TABLE VIEW - Table component would be implemented here
            </div>
          </HudCard>
        )}

        {currentView === 'map' && (
          <HudCard borderColor="var(--ks-hud-green)" style={{ marginBottom: 'var(--ks-space-8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ks-space-3)', marginBottom: 'var(--ks-space-5)' }}>
              <div style={{ fontSize: 'var(--ks-font-size-2xl)' }}>🗺️</div>
              <div style={{
                fontSize: 'var(--ks-font-size-2xl)',
                color: 'var(--ks-hud-green)',
                fontFamily: 'var(--ks-font-digital)',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                Live Seat Map
              </div>
            </div>
            <div style={{
              padding: 'var(--ks-space-8)',
              background: 'rgba(0, 0, 0, 0.3)',
              border: 'var(--ks-border-hud-thin)',
              textAlign: 'center',
              fontFamily: 'var(--ks-font-digital)',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              🗺️ FLOOR PLAN MAP - Canvas component would be implemented here
            </div>
          </HudCard>
        )}
      </section>

      {/* Demo Additional Sections */}
      <HudCard borderColor="var(--ks-hud-blue)" style={{ marginBottom: 'var(--ks-space-8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ks-space-3)', marginBottom: 'var(--ks-space-5)' }}>
          <div style={{ fontSize: 'var(--ks-font-size-2xl)' }}>📅</div>
          <div style={{
            fontSize: 'var(--ks-font-size-2xl)',
            color: 'var(--ks-hud-blue)',
            fontFamily: 'var(--ks-font-digital)',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            Booking Calendar
          </div>
        </div>
        <div style={{
          padding: 'var(--ks-space-4)',
          background: 'rgba(0, 0, 0, 0.3)',
          border: 'var(--ks-border-hud-thin)',
          textAlign: 'center',
          fontFamily: 'var(--ks-font-digital)'
        }}>
          📅 CALENDAR COMPONENT - Calendar would be implemented here
        </div>
      </HudCard>
    </AdminLayout>
  );
}

export default App;