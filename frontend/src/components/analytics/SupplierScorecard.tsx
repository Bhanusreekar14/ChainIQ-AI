import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ShieldCheck, Truck } from 'lucide-react';
import type { SupplierScorecardData } from '../../types';

interface SupplierScorecardProps {
  suppliers: SupplierScorecardData[];
  loading: boolean;
}

export const SupplierScorecard: React.FC<SupplierScorecardProps> = ({ suppliers, loading }) => {
  return (
    <Card variant="glass" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Enterprise Supplier Scorecard ⭐</h3>
            <p className="text-[10px] text-slate-400">On-Time In-Full (OTIF) &amp; SLA Performance Metrics</p>
          </div>
        </div>
        <Badge variant="indigo">{suppliers.length || 5} Major Carriers Tracked</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase">
              <th className="pb-3">Supplier Name</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">OTIF Rate</th>
              <th className="pb-3">Delay Rate</th>
              <th className="pb-3">Quality Score</th>
              <th className="pb-3">Risk Level</th>
              <th className="pb-3 text-right">Overall Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="py-3.5 bg-slate-900/40 rounded" />
                  </tr>
                ))
              : suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{s.name}</span>
                    </td>
                    <td className="py-3.5 text-slate-300">{s.category}</td>
                    <td className="py-3.5 font-mono font-semibold text-emerald-400">{s.otif_rate}%</td>
                    <td className="py-3.5 font-mono font-semibold text-amber-400">{s.delay_rate}%</td>
                    <td className="py-3.5 font-mono font-semibold text-cyan-400">{s.quality_score}/100</td>
                    <td className="py-3.5">
                      <Badge variant={s.risk_level} size="sm">
                        {s.risk_level.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-right font-extrabold text-white font-mono text-sm">
                      <span
                        className={`px-2.5 py-1 rounded-lg ${
                          s.overall_score >= 90
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : s.overall_score >= 80
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {s.overall_score}
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
