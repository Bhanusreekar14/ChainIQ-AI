import React from 'react';
import { BarChart2, PieChart, Activity } from 'lucide-react';

export const AnalyticsCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">Delay Risk Distribution by Market</h3>
        </div>
        <div className="space-y-3 pt-2 text-xs">
          {[
            { market: 'LATAM', rate: 78, color: 'bg-rose-600' },
            { market: 'Africa', rate: 65, color: 'bg-orange-600' },
            { market: 'Pacific Asia', rate: 42, color: 'bg-amber-600' },
            { market: 'USCA', rate: 25, color: 'bg-emerald-600' },
            { market: 'Europe', rate: 30, color: 'bg-blue-600' },
          ].map((item) => (
            <div key={item.market} className="space-y-1">
              <div className="flex justify-between text-slate-700">
                <span className="font-medium">{item.market}</span>
                <span className="font-bold text-slate-900">{item.rate}% Delay Rate</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-700`}
                  style={{ width: `${item.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">Shipping Mode Delay Sensitivity</h3>
        </div>
        <div className="space-y-3 pt-2 text-xs">
          {[
            { mode: 'Standard Class', share: '54.2%', impact: 'High Sensitivity' },
            { mode: 'Second Class', share: '24.1%', impact: 'Moderate' },
            { mode: 'First Class', share: '14.5%', impact: 'Low' },
            { mode: 'Same Day', share: '7.2%', impact: 'Minimal' },
          ].map((item) => (
            <div key={item.mode} className="flex justify-between items-center py-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" />
                <span className="text-slate-800 font-semibold">{item.mode}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-blue-600">{item.share}</span>
                <p className="text-[10px] text-slate-500 font-medium">{item.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
