import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Activity, Play, Pause, Home } from 'lucide-react';
import { useHealth } from '../../hooks/useHealth';
import { useDemo } from '../../context/DemoContext';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../auth/AuthContext';

export const TopNavbar: React.FC = () => {
  const { isHealthy } = useHealth(15000);
  const { isDemoMode, toggleDemoMode } = useDemo();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-sm border-b border-slate-200/80 px-6 flex items-center justify-between shadow-2xs">
      {/* Left: Home Link & Search Bar */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          title="Return to Public Landing Page"
        >
          <Home className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline">Landing Page</span>
        </button>

        <div className="relative w-64 sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders, markets, parameters..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-12 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-2xs"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-mono font-semibold bg-white text-slate-400 rounded border border-slate-200 pointer-events-none">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Demo Mode Toggle */}
        <button
          onClick={toggleDemoMode}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-semibold transition-all cursor-pointer ${
            isDemoMode
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
          title="Toggle Simulated Real-time Telemetry Pulse"
        >
          {isDemoMode ? <Pause className="w-3 h-3 text-emerald-600" /> : <Play className="w-3 h-3" />}
          <span className="hidden sm:inline">{isDemoMode ? 'Demo Mode Live' : 'Demo Paused'}</span>
        </button>

        {/* Backend API Health Status */}
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200">
          <Activity className={`w-3.5 h-3.5 ${isHealthy ? 'text-emerald-600 animate-pulse' : 'text-rose-600'}`} />
          <span className="text-slate-500 hidden sm:inline">FastAPI:</span>
          <span className={`font-semibold text-[11px] ${isHealthy ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isHealthy === null ? 'Connecting...' : isHealthy ? 'Online' : 'Offline'}
          </span>
        </div>

        {/* Notifications */}
        <button className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <Avatar name={user?.name || 'Bhanu Sreekar'} size="sm" />
          <div className="hidden md:block text-left text-xs leading-none">
            <p className="font-bold text-slate-900 text-[11px]">{user?.name || 'Bhanu Sreekar'}</p>
            <p className="text-[9px] text-slate-500 mt-0.5">Executive Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};
