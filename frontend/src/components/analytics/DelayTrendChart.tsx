import React from 'react';
import { Card } from '../ui/Card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { DelayTrendPointData } from '../../types';

interface DelayTrendChartProps {
  data: DelayTrendPointData[];
  loading: boolean;
}

export const DelayTrendChart: React.FC<DelayTrendChartProps> = ({ data, loading }) => {
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
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Delay Rate vs SLA Threshold Benchmark</h3>
            <p className="text-[10px] text-slate-400">Actual vs CatBoost Prediction vs SLA Target Line</p>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
            <YAxis stroke="#94A3B8" fontSize={11} domain={[10, 25]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
            <Line
              type="monotone"
              name="Actual Delay Rate (%)"
              dataKey="actual"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ r: 4, fill: '#6366F1' }}
            />
            <Line
              type="monotone"
              name="CatBoost Prediction (%)"
              dataKey="predicted"
              stroke="#06B6D4"
              strokeDasharray="4 4"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              name="SLA Threshold Target (15%)"
              dataKey="sla_target"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
