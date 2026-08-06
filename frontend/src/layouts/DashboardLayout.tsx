import React from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { TopNavbar } from '../components/layout/TopNavbar';
import { PageContainer } from '../components/layout/PageContainer';
import { Footer } from '../components/layout/Footer';
import type { TabType } from '../types';

interface DashboardLayoutProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  setActiveTab,
  children,
}) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex font-sans selection:bg-blue-600 selection:text-white">
      {/* Fixed Vertical Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Right Content Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Header */}
        <TopNavbar />

        {/* Page Main Workspace Container */}
        <PageContainer activeTab={activeTab} setActiveTab={setActiveTab}>
          {children}
        </PageContainer>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};
