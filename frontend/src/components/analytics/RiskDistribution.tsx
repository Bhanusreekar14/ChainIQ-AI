import React from 'react';
import { Card } from '../ui/Card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';
import type { RiskDistributionData } from '../../types';

interface RiskDistributionProps {
  data: RiskDistributionData | null;
  loading: boolean;
}

export const RiskDistribution: React.FC<RiskDistributionProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="h-72 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse p-4 space-y-4">
        <div className="h-4 w-40 bg-slate-800 rounded" />
        <div className="h-48 w-full bg-slate-800/40 rounded-full flex items-center justify-center" />
      </div>
    );
  }

  const chartData = [
    { name: `🟢 Low Risk (${data.low_pct}%)`, value: data.low_count, color: '#10B981' },
    { name: `🟡 Medium Risk (${data.medium_pct}%)`, value: data.medium_count, color: '#F59E0B' },
    { name: `🟠 High Risk (${data.high_pct}%)`, value: data.high_count, color: '#F97316' },
    { name: `🔴 Critical Risk (${data.critical_pct}%)`, value: data.critical_count, color: '#EF4444' },
  ];

  return (
    <Card variant="glass" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Risk Category Breakdown</h3>
            <p className="text-[10px] text-slate-400">Total Analyzed: 180,519 Orders</p>
          </div>
        </div>
      </div>

      <div className="h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val: unknown) => [`${Number(val).toLocaleString()} Orders`, 'Shipment Count']}
              contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
