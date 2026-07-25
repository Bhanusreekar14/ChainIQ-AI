import React from 'react';
import { Search, Bell, Activity, Play, Pause } from 'lucide-react';
import { useHealth } from '../../hooks/useHealth';
import { useDemo } from '../../context/DemoContext';
import { Avatar } from '../ui/Avatar';

export const TopNavbar: React.FC = () => {
  const { isHealthy } = useHealth(15000);
  const { isDemoMode, toggleDemoMode } = useDemo();

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between">
      {/* Search Bar */}
      <div className="relative w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search orders, markets, parameters..."
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Controls: Demo Stream Toggle, API Status, Notifications & Avatar */}
      <div className="flex items-center gap-4">
        {/* Demo Data Mode Streaming Toggle */}
        <button
          onClick={toggleDemoMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
            isDemoMode
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              : 'bg-slate-950 text-slate-400 border-slate-800'
          }`}
          title="Toggle Simulated Real-time Telemetry Pulse"
        >
          {isDemoMode ? <Pause className="w-3 h-3 text-emerald-400" /> : <Play className="w-3 h-3" />}
          <span>{isDemoMode ? 'Demo Mode Live' : 'Demo Paused'}</span>
        </button>

        {/* Backend API Health Status Indicator */}
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800">
          <Activity className={`w-3.5 h-3.5 ${isHealthy ? 'text-emerald-400 animate-pulse' : 'text-rose-500'}`} />
          <span className="text-slate-400">API Status:</span>
          <span className={`font-semibold ${isHealthy ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isHealthy === null ? 'Connecting...' : isHealthy ? 'Online (CatBoost)' : 'Offline'}
          </span>
        </div>

        {/* Notifications Button */}
        <button className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <Avatar name="Bhanu Sreekar" size="sm" />
        </div>
      </div>
    </header>
  );
};
