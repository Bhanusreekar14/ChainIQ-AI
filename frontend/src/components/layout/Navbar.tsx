import React from 'react';
import {
  LayoutDashboard,
  Search,
  BarChart3,
  SlidersHorizontal,
  Bot,
  Activity,
  Cpu,
} from 'lucide-react';
import type { TabType } from '../../types';
import { useHealth } from '../../hooks/useHealth';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { isHealthy } = useHealth(15000);

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Executive Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'shipment', label: 'Shipment Analysis', icon: <Search className="w-4 h-4" /> },
    { id: 'analytics', label: 'Intelligence Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'scenario', label: 'What-If Simulator', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: 'copilot', label: 'AI Copilot', icon: <Bot className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 via-cyan-500 to-blue-500 rounded-xl shadow-lg shadow-indigo-500/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
                ChainIQ<span className="text-cyan-400">.AI</span>
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v1.5 Enterprise
              </span>
            </div>
            <p className="text-xs text-slate-400">Supply Chain Decision Intelligence Platform</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Backend Status Indicator */}
        <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
          <Activity className={`w-3.5 h-3.5 ${isHealthy ? 'text-emerald-400 animate-pulse' : 'text-rose-500'}`} />
          <span className="text-slate-400">API Status:</span>
          <span className={`font-semibold ${isHealthy ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isHealthy === null ? 'Connecting...' : isHealthy ? 'Online (CatBoost)' : 'Offline'}
          </span>
        </div>
      </div>
    </header>
  );
};
