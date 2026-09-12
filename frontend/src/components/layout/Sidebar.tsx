import React from 'react';
import logoIcon from '../../assets/logo-icon.svg';
import {
  LayoutDashboard,
  Globe,
  PackageSearch,
  BarChart3,
  SlidersHorizontal,
  Bot,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  UserCheck,
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
        return <Globe className="w-4 h-4" />;
      case 'shipment':
        return <PackageSearch className="w-4 h-4" />;
      case 'analytics':
        return <BarChart3 className="w-4 h-4" />;
      case 'scenario':
        return <SlidersHorizontal className="w-4 h-4" />;
      case 'copilot':
        return <Bot className="w-4 h-4" />;
      case 'workforce':
        return <UserCheck className="w-4 h-4" />;
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
    <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-40">
      <div className="p-5 space-y-6">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 px-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <img src={logoIcon} alt="ChainIQ AI" className="h-9 w-9 shrink-0" />
          <div>
            <h1 className="text-base font-semibold text-slate-900 leading-tight">
              ChainIQ AI
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">Decision Intelligence</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Navigation
          </p>
          <nav className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}>
                      {getIcon(item.id)}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-blue-100 text-blue-700">
                      {item.badge}
                    </span>
                  ) : isActive ? (
                    <ChevronRight className="w-3.5 h-3.5 opacity-60 text-blue-600" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar name={user?.name || 'Bhanu Sreekar'} status="online" size="sm" />
            <div className="text-xs">
              <p className="font-bold text-slate-900 leading-none">{user?.name || 'Bhanu Sreekar'}</p>
              <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> {user?.role || 'Executive Admin'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out Session"
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
