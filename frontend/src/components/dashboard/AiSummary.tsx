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
      <div className="h-40 rounded-xl bg-slate-100 border border-slate-200 animate-pulse p-6 space-y-3">
        <div className="h-4 w-40 bg-slate-200 rounded" />
        <div className="h-6 w-3/4 bg-slate-200 rounded" />
      </div>
    );
  }

  return (
    <Card variant="indigo" className="p-6 space-y-4 bg-blue-50/60 border border-blue-200/80 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-200/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-600 text-white">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Executive AI Intelligence Brief <Sparkles className="w-4 h-4 text-blue-600" />
            </h3>
            <p className="text-xs text-slate-700 font-medium">{data.headline}</p>
          </div>
        </div>
        <Badge variant="indigo" size="md">
          {data.confidence}% Confidence
        </Badge>
      </div>

      <div className="space-y-2 text-xs text-slate-700">
        <p className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
          CatBoost Decision Attributions:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {data.top_causes.map((cause, i) => (
            <li key={i} className="p-2.5 rounded-lg bg-white border border-blue-100 font-medium text-[11px] text-slate-800 shadow-2xs">
              • {cause}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <span className="text-xs text-slate-700">
          Prescribed Action ROI: <strong className="text-emerald-700 font-bold">{formatCurrency(data.estimated_savings)} Net Savings</strong>
        </span>
        <button
          onClick={onAnalyzeClick}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Run Single Shipment Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  );
};
