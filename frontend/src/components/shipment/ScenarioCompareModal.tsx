import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { X, TrendingDown, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatPercent } from '../../lib/utils';
import type { RecommendationResponse } from '../../types';

interface ScenarioCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: RecommendationResponse;
}

export const ScenarioCompareModal: React.FC<ScenarioCompareModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  if (!isOpen) return null;

  const baselineRiskProb = result.prediction.delay_probability;
  const optimizedRiskProb = Math.max(0.12, baselineRiskProb * 0.42);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <Card variant="glass" className="max-w-2xl w-full p-6 space-y-6 border-indigo-500/40 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white tracking-tight">Scenario Comparison Analysis</h3>
            <p className="text-xs text-slate-400">Baseline Standard Transit vs Prescribed Express Route</p>
          </div>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Baseline */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-slate-300">Baseline Scenario</span>
              <Badge variant="critical">Current</Badge>
            </div>
            <div className="space-y-1.5">
              <p className="text-slate-400">Shipping Mode: <strong className="text-white">Standard Class</strong></p>
              <p className="text-slate-400">Delay Probability: <strong className="text-rose-400 font-mono text-sm">{formatPercent(baselineRiskProb)}</strong></p>
              <p className="text-slate-400">Risk Level: <strong className="text-rose-400 uppercase">{result.prediction.risk_level}</strong></p>
              <p className="text-slate-400">SLA Penalty Risk: <strong className="text-slate-200">$450 Avg</strong></p>
            </div>
          </div>

          {/* Express Intervention */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
              <span className="font-bold text-emerald-300">Express Intervention</span>
              <Badge variant="low">Optimized</Badge>
            </div>
            <div className="space-y-1.5">
              <p className="text-slate-400">Shipping Mode: <strong className="text-emerald-300">First Class Express</strong></p>
              <p className="text-slate-400">Delay Probability: <strong className="text-emerald-400 font-mono text-sm">{formatPercent(optimizedRiskProb)}</strong></p>
              <p className="text-slate-400">Risk Level: <strong className="text-emerald-400 uppercase">LOW</strong></p>
              <p className="text-slate-400">Financial Net Savings: <strong className="text-emerald-300 font-bold">{formatCurrency(220)}</strong></p>
            </div>
          </div>
        </div>

        {/* Impact Banner */}
        <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-emerald-400" />
            <span className="text-slate-200">Applying intervention reduces delay probability by <strong className="text-emerald-400 font-bold">{Math.round((baselineRiskProb - optimizedRiskProb) * 100)}%</strong>.</span>
          </div>
          <Button variant="ai" size="sm" onClick={onClose} leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
            Apply Intervention
          </Button>
        </div>
      </Card>
    </div>
  );
};
