/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface DemoEvent {
  id: string;
  time: string;
  type: 'risk' | 'weather' | 'ai' | 'reroute';
  title: string;
  desc: string;
}

interface DemoContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  liveEvents: DemoEvent[];
  healthScore: number;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [healthScore, setHealthScore] = useState<number>(93);

  const [liveEvents, setLiveEvents] = useState<DemoEvent[]>([
    { id: '1', time: '11:03 AM', type: 'reroute', title: 'Shipment ORD-812 Rerouted', desc: 'Air freight upgrade saved 2.5 transit days.' },
    { id: '2', time: '10:55 AM', type: 'ai', title: 'AI Recommendation Generated', desc: 'Prescribed carrier swap for LATAM route.' },
    { id: '3', time: '10:48 AM', type: 'weather', title: 'Singapore Port Weather Detected', desc: 'Heavy rain delay +12 hours.' },
    { id: '4', time: '10:42 AM', type: 'risk', title: 'Shipment ORD-812 Risk Increased', desc: 'CatBoost detected 78% delay probability.' },
  ]);

  useEffect(() => {
    if (!isDemoMode) return;

    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newEvent: DemoEvent = {
        id: Date.now().toString(),
        time: now,
        type: 'ai',
        title: 'Live Telemetry Pulse Synced',
        desc: `CatBoost inference re-verified ${Math.floor(180000 + Math.random() * 1000)} shipment vectors.`,
      };

      setLiveEvents((prev) => [newEvent, ...prev.slice(0, 7)]);
      setHealthScore((prev) => Math.min(99, Math.max(88, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 6000);

    return () => clearInterval(interval);
  }, [isDemoMode]);

  const toggleDemoMode = () => setIsDemoMode((prev) => !prev);

  return (
    <DemoContext.Provider value={{ isDemoMode, toggleDemoMode, liveEvents, healthScore }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
