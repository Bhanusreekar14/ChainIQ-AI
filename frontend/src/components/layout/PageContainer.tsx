import React from 'react';
import { Breadcrumb } from './Breadcrumb';
import type { TabType } from '../../types';

interface PageContainerProps {
  activeTab: TabType;
  setActiveTab?: (tab: TabType) => void;
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  activeTab,
  setActiveTab,
  children,
}) => {
  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-6 animate-fadeIn">
      <Breadcrumb activeTab={activeTab} setActiveTab={setActiveTab} />
      {children}
    </div>
  );
};
