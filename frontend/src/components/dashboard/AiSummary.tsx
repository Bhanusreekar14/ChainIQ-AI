import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Sparkles, Brain, ArrowRight } from 'lucide-react';
import type { AiSummaryData } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface AiSummaryProps {
  data: AiSummaryData | null;
  loading: boolean;
  onAnalyzeClick: () => void;
}

export const AiSummary: React.FC<AiSummaryProps> = ({ data, loading, onAnalyzeClick }) => {
  if (loading || !data) {
    return (
      <div className="h-40 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse p-6 space-y-3">
        <div className="h-4 w-40 bg-slate-800 rounded" />
        <div className="h-6 w-3/4 bg-slate-700 rounded" />
      </div>
    );
  }

  return (
    <Card variant="indigo" className="p-6 space-y-4 border-indigo-500/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-500/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600 text-white">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
              Executive AI Intelligence Brief <Sparkles className="w-4 h-4 text-cyan-400" />
            </h3>
            <p className="text-xs text-slate-300 font-semibold">{data.headline}</p>
          </div>
        </div>
        <Badge variant="ai" size="md">
          {data.confidence}% Confidence
        </Badge>
      </div>

      <div className="space-y-2 text-xs text-slate-300">
        <p className="font-extrabold text-slate-400 uppercase tracking-wider text-[11px]">
          CatBoost Decision Attributions:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {data.top_causes.map((cause, i) => (
            <li key={i} className="p-2.5 rounded-lg bg-slate-950/80 border border-indigo-500/20 font-medium text-[11px]">
              • {cause}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <span className="text-xs text-slate-300">
          Prescribed Action ROI: <strong className="text-emerald-400">{formatCurrency(data.estimated_savings)} Net Savings</strong>
        </span>
        <button
          onClick={onAnalyzeClick}
          className="text-xs font-extrabold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          <span>Run Single Shipment Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  );
};
