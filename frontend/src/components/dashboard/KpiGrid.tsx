import React from 'react';
import { StatCard } from '../ui/StatCard';
import { Package, AlertTriangle, TrendingDown, DollarSign, Sparkles, Award } from 'lucide-react';
import type { DashboardSummary } from '../../types';
import { formatCurrency, formatPercent } from '../../lib/utils';

interface KpiGridProps {
  summary: DashboardSummary | null;
  loading: boolean;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ summary, loading }) => {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse p-4 space-y-3">
            <div className="h-3 w-20 bg-slate-800 rounded" />
            <div className="h-6 w-28 bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard
        title="Total Shipments"
        value={summary.total_shipments.toLocaleString()}
        icon={<Package className="w-4 h-4 text-cyan-400" />}
        change="+14.2% MoM"
        isPositive={true}
      />

      <StatCard
        title="High Risk Watchlist"
        value={summary.high_risk_shipments.toString()}
        icon={<AlertTriangle className="w-4 h-4 text-amber-400" />}
        change="-18 orders"
        isPositive={true}
      />

      <StatCard
        title="Avg Delay Risk"
        value={formatPercent(summary.average_delay_probability / 100)}
        icon={<TrendingDown className="w-4 h-4 text-indigo-400" />}
        change="-2.4% vs SLA"
        isPositive={true}
      />

      <StatCard
        title="Projected Cost Savings"
        value={formatCurrency(summary.estimated_cost_savings)}
        icon={<DollarSign className="w-4 h-4 text-emerald-400" />}
        change="+12% ROI"
        isPositive={true}
      />

      <StatCard
        title="AI Recommendations"
        value={summary.ai_recommendations.toLocaleString()}
        icon={<Sparkles className="w-4 h-4 text-cyan-400" />}
        change="94% confidence"
        isPositive={true}
      />

      <StatCard
        title="CatBoost Model AUC"
        value={`${summary.prediction_accuracy}%`}
        icon={<Award className="w-4 h-4 text-indigo-400" />}
        change="v1.5 Enterprise"
        isPositive={true}
      />
    </div>
  );
};
