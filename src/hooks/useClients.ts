// src/hooks/useClients.ts - Enhanced Client Management Hook

import { useState, useCallback } from 'react';
import { type Client, type SpaceType, type Seat, type UseClientsReturn } from '../types';
import { generateAccessCode, calculatePrice } from '../utils';

export const useClients = (initialClients: Client[], seats: Seat[]): UseClientsReturn => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [nextClientId, setNextClientId] = useState(
    Math.max(...initialClients.map(c => c.id), 0) + 1
  );

  // Assign seat to client based on space type
  const assignSeatToClient = useCallback((clientId: number, spaceType: SpaceType): string | null => {
    const availableSeats = seats.filter(seat => 
      seat.status === 'available' && 
      seat.area.toLowerCase().includes(spaceType.toLowerCase().split(' ')[0])
    );
    
    if (availableSeats.length > 0) {
      const assignedSeat = availableSeats[0];
      assignedSeat.status = 'occupied';
      assignedSeat.clientId = clientId;
      return assignedSeat.id;
    }
    return null;
  }, [seats]);

  // Free up seat when client session ends
  const freeSeat = useCallback((seatId: string | null) => {
    if (seatId) {
      const seat = seats.find(s => s.id === seatId);
      if (seat) {
        seat.status = 'available';
        seat.clientId = null;
      }
    }
  }, [seats]);

  // Add new client
  const addClient = useCallback(() => {
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
  }, [nextClientId]);

  // Update client information
  const updateClient = useCallback((clientId: number, field: keyof Client, value: any) => {
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
  }, []);

  // Start client session
  const startSession = useCallback((clientId: number) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId) {
        const seatId = assignSeatToClient(clientId, client.spaceType);
        return {
          ...client,
          status: 'active' as const,
          startTime: new Date(),
          seatId: seatId || client.seatId
        };
      }
      return client;
    }));
  }, [assignSeatToClient]);

  // Extend client session
  const extendSession = useCallback((clientId: number) => {
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
  }, []);

  // Complete client session
  const completeSession = useCallback((clientId: number) => {
    setClients(prev => prev.map(client => {
      if (client.id === clientId) {
        freeSeat(client.seatId);
        return { ...client, status: 'completed' as const };
      }
      return client;
    }));
  }, [freeSeat]);

  // Delete client
  const deleteClient = useCallback((clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    const needsConfirmation = client && (client.status === "active" || client.status === "completed");
    
    if (needsConfirmation) {
      if (!confirm(`Are you sure you want to delete ${client.name || 'this client'}? This action cannot be undone.`)) {
        return;
      }
    }
    
    if (client?.seatId) {
      freeSeat(client.seatId);
    }
    
    setClients(prev => prev.filter(c => c.id !== clientId));
  }, [clients, freeSeat]);

  // Get active clients count
  const getActiveCount = useCallback(() => {
    return clients.filter(c => c.status === 'active').length;
  }, [clients]);

  return {
    clients,
    addClient,
    updateClient,
    startSession,
    extendSession,
    completeSession,
    deleteClient,
    getActiveCount
  };
};
