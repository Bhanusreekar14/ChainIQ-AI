import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Sparkles, TrendingUp, ShieldCheck, DollarSign, Clock } from 'lucide-react';
import type { AnalyticsOverview } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface AiAnalyticsBriefProps {
  data: AnalyticsOverview | null;
  loading: boolean;
}

export const AiAnalyticsBrief: React.FC<AiAnalyticsBriefProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="h-32 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse p-4 space-y-3">
        <div className="h-4 w-48 bg-slate-800 rounded" />
        <div className="h-6 w-full bg-slate-700 rounded" />
      </div>
    );
  }

  return (
    <Card variant="indigo" className="space-y-4 border-indigo-500/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">Executive AI Intelligence Summary</h3>
            <p className="text-xs text-slate-300">Monthly CatBoost performance synthesis across 180,519 order vectors</p>
          </div>
        </div>
        <Badge variant="ai">Live AI Insights</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/20 space-y-1">
          <span className="text-slate-400 text-[11px] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" /> Overall Delay Reduction
          </span>
          <p className="text-lg font-extrabold text-emerald-400">{data.overall_delay_reduction_pct}% Drop</p>
          <p className="text-[10px] text-slate-400">vs previous quarter</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/20 space-y-1">
          <span className="text-slate-400 text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SLA Fulfillment
          </span>
          <p className="text-lg font-extrabold text-cyan-400">{data.sla_fulfillment_pct}% On-Time</p>
          <p className="text-[10px] text-slate-400">+7.1% SLA gain</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/20 space-y-1">
          <span className="text-slate-400 text-[11px] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> High-Risk Mitigation
          </span>
          <p className="text-lg font-extrabold text-amber-400">-{data.high_risk_reduction_pct}% Risk Level</p>
          <p className="text-[10px] text-slate-400">via Express mode</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-indigo-500/20 space-y-1">
          <span className="text-slate-400 text-[11px] flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Projected SLA Savings
          </span>
          <p className="text-lg font-extrabold text-emerald-400">{formatCurrency(data.projected_savings_usd)}</p>
          <p className="text-[10px] text-slate-400">↑ 12% this month</p>
        </div>
      </div>
    </Card>
  );
};
