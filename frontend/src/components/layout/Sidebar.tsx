import React from 'react';
import {
  LayoutDashboard,
  Globe,
  PackageSearch,
  BarChart3,
  SlidersHorizontal,
  Bot,
  FileText,
  Settings as SettingsIcon,
  Cpu,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import type { TabType } from '../../types';
import { NAV_ITEMS } from '../../constants/navigation';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../auth/AuthContext';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const getIcon = (id: TabType) => {
    switch (id) {
      case 'dashboard':
        return <LayoutDashboard className="w-4 h-4" />;
      case 'operations':
        return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'shipment':
        return <PackageSearch className="w-4 h-4" />;
      case 'analytics':
        return <BarChart3 className="w-4 h-4" />;
      case 'scenario':
        return <SlidersHorizontal className="w-4 h-4" />;
      case 'copilot':
        return <Bot className="w-4 h-4 text-indigo-400" />;
      case 'reports':
        return <FileText className="w-4 h-4" />;
      case 'settings':
        return <SettingsIcon className="w-4 h-4" />;
      default:
        return <LayoutDashboard className="w-4 h-4" />;
    }
  };

  const handleLogout = () => {
    logout();
    setActiveTab('login');
  };

  return (
    <aside className="w-[280px] bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-40">
      <div className="p-5 space-y-6">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 px-2">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 via-cyan-500 to-blue-500 rounded-xl shadow-lg shadow-indigo-500/20 shrink-0">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
                ChainIQ<span className="text-cyan-400">.AI</span>
              </span>
            </div>
            <p className="text-[10px] font-semibold text-slate-400">Enterprise Logistics AI</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
            Enterprise Navigation
          </p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}>
                      {getIcon(item.id)}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                      {item.badge}
                    </span>
                  ) : isActive ? (
                    <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name || 'Bhanu Sreekar'} status="online" size="sm" />
            <div className="text-xs">
              <p className="font-bold text-slate-200 leading-none">{user?.name || 'Bhanu Sreekar'} 👋</p>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> {user?.role || 'Executive Admin'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out Session"
            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
