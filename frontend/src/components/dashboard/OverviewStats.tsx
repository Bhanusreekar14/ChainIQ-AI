import React from 'react';
import { Package, AlertTriangle, DollarSign, Zap } from 'lucide-react';
import { KpiCard } from '../ui/KpiCard';

export const OverviewStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <KpiCard
        title="Total Orders Analyzed"
        value="180,519"
        change="+12.4% vs last month"
        isPositive={true}
        icon={<Package className="w-6 h-6" />}
        accentColor="indigo"
      />
      <KpiCard
        title="High Risk Shipments"
        value="14.2%"
        change="-2.1% delay reduction"
        isPositive={true}
        icon={<AlertTriangle className="w-6 h-6" />}
        accentColor="amber"
      />
      <KpiCard
        title="Projected Cost Savings"
        value="$412,850"
        change="+$34,200 this week"
        isPositive={true}
        icon={<DollarSign className="w-6 h-6" />}
        accentColor="emerald"
      />
      <KpiCard
        title="AI Actions Triggered"
        value="3,840"
        change="98.4% execution rate"
        isPositive={true}
        icon={<Zap className="w-6 h-6" />}
        accentColor="cyan"
      />
    </div>
  );
};
