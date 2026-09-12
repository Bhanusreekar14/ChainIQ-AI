import type { TabType } from '../types';

export interface NavItem {
  id: TabType;
  label: string;
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'operations', label: 'Global Operations', badge: 'Live' },
  { id: 'shipment', label: 'Shipment Analysis' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'scenario', label: 'Simulator' },
  { id: 'copilot', label: 'AI Copilot', badge: 'AI' },
  { id: 'workforce', label: 'Workforce Intelligence', badge: 'v2.0' },
  { id: 'reports', label: 'Executive Reports' },
  { id: 'settings', label: 'Settings' },
];
