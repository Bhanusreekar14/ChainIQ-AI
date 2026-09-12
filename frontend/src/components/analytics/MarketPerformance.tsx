import React from 'react';
import { Card } from '../ui/Card';
import { Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import type { MarketPerformanceData } from '../../types';

interface MarketPerformanceProps {
  markets: MarketPerformanceData[];
  loading: boolean;
}

export const MarketPerformance: React.FC<MarketPerformanceProps> = ({ markets, loading }) => {
  if (loading) {
    return (
      <div className="h-72 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse p-4 space-y-4">
        <div className="h-4 w-40 bg-slate-800 rounded" />
        <div className="h-48 w-full bg-slate-800/40 rounded" />
      </div>
    );
  }

  const getBarColor = (val: number) => {
    if (val >= 50) return '#EF4444';
    if (val >= 35) return '#F97316';
    if (val >= 25) return '#F59E0B';
    if (val >= 20) return '#06B6D4';
    return '#10B981';
  };

  return (
    <Card variant="glass" className="space-y-4">
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-cyan-400" />
        <div>
          <h3 className="text-sm font-bold text-white">Regional Market Delay Vulnerability</h3>
          <p className="text-[10px] text-slate-400">Baseline Delay % by Destination Market</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={markets} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis type="number" stroke="#94A3B8" fontSize={11} domain={[0, 80]} />
            <YAxis dataKey="market" type="category" stroke="#94A3B8" fontSize={11} width={90} />
            <Tooltip
              formatter={(val: unknown) => [`${val}% Delay Rate`, 'Market Vulnerability']}
              contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
            />
            <Bar dataKey="delay_probability" radius={[0, 8, 8, 0]}>
              {markets.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.delay_probability)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
