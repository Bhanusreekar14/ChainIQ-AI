import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import type { TabType } from '../../types';

interface BreadcrumbProps {
  activeTab: TabType;
  setActiveTab?: (tab: TabType) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ activeTab, setActiveTab }) => {
  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'dashboard':
        return 'Executive Overview';
      case 'shipment':
        return 'Shipments & Risk Engine';
      case 'analytics':
        return 'Intelligence Analytics';
      case 'scenario':
        return 'What-If Simulator';
      case 'copilot':
        return 'AI Copilot';
      case 'login':
        return 'Authentication';
      default:
        return 'Overview';
    }
  };

  return (
    <nav className="flex items-center gap-2 text-xs text-slate-400 mb-4">
      <button
        onClick={() => setActiveTab && setActiveTab('dashboard')}
        className="flex items-center gap-1 hover:text-slate-200 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Platform</span>
      </button>
      <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
      <span className="font-semibold text-indigo-400">{getTabLabel(activeTab)}</span>
    </nav>
  );
};
