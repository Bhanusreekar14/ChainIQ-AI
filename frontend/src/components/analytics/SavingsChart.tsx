import React from 'react';
import { Card } from '../ui/Card';
import { DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../lib/utils';

interface SavingsChartProps {
  savingsUSD?: number;
  loading: boolean;
}

export const SavingsChart: React.FC<SavingsChartProps> = ({ savingsUSD = 412850, loading }) => {
  const data = [
    { month: 'Jan', savings: 45000 },
    { month: 'Feb', savings: 52000 },
    { month: 'Mar', savings: 68000 },
    { month: 'Apr', savings: 85000 },
    { month: 'May', savings: 105000 },
    { month: 'Jun', savings: 135000 },
  ];

  if (loading) {
    return (
      <div className="h-72 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse p-4 space-y-4">
        <div className="h-4 w-40 bg-slate-800 rounded" />
        <div className="h-48 w-full bg-slate-800/40 rounded" />
      </div>
    );
  }

  return (
    <Card variant="glass" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Cumulative Cost Savings Trend</h3>
            <p className="text-[10px] text-slate-400">Financial SLA Penalty Prevention ($ USD)</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Total Projected:</span>
          <p className="text-lg font-extrabold text-emerald-400">{formatCurrency(savingsUSD)}</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
            <YAxis stroke="#94A3B8" fontSize={11} />
            <Tooltip
              formatter={(val: any) => [`${formatCurrency(Number(val))}`, 'Monthly Net Savings']}
              contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
            />
            <Bar dataKey="savings" fill="#10B981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
