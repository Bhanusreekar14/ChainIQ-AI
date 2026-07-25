import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Sparkles } from 'lucide-react';
import type { ForecastPointData } from '../../types';

interface AiForecastChartProps {
  forecast: ForecastPointData[];
  loading: boolean;
}

export const AiForecastChart: React.FC<AiForecastChartProps> = ({ forecast, loading }) => {
  if (loading) {
    return (
      <div className="h-72 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse p-4 space-y-4">
        <div className="h-4 w-40 bg-slate-800 rounded" />
        <div className="h-48 w-full bg-slate-800/40 rounded" />
      </div>
    );
  }

  return (
    <Card variant="glass" className="space-y-4 border-indigo-500/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-bold text-white">AI 30-Day Predictive Forecast</h3>
            <p className="text-[10px] text-slate-400">CatBoost Forward Trajectory: Unmitigated vs Prescribed Pathways</p>
          </div>
        </div>
        <Badge variant="ai" size="sm">Predictive Mode</Badge>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecast}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis dataKey="period" stroke="#94A3B8" fontSize={11} />
            <YAxis stroke="#94A3B8" fontSize={11} domain={[5, 30]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
            <Line
              type="monotone"
              name="Unmitigated Delay Baseline (%)"
              dataKey="baseline_delay"
              stroke="#EF4444"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={{ r: 4, fill: '#EF4444' }}
            />
            <Line
              type="monotone"
              name="Prescribed AI Pathway (%)"
              dataKey="predicted_with_ai"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 5, fill: '#10B981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
