import React from 'react';

export interface RiskGaugeProps {
  probability: number; // 0 to 1
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ probability, riskLevel, confidence }) => {
  const percentage = Math.round(probability * 100);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low':
        return { text: 'text-emerald-700', bg: 'bg-emerald-50', stroke: '#059669', border: 'border-emerald-200/60' };
      case 'Medium':
        return { text: 'text-amber-700', bg: 'bg-amber-50', stroke: '#D97706', border: 'border-amber-200/60' };
      case 'High':
        return { text: 'text-orange-700', bg: 'bg-orange-50', stroke: '#EA580C', border: 'border-orange-200/60' };
      case 'Critical':
        return { text: 'text-rose-700', bg: 'bg-rose-50', stroke: '#DC2626', border: 'border-rose-200/60' };
      default:
        return { text: 'text-blue-700', bg: 'bg-blue-50', stroke: '#2563EB', border: 'border-blue-200/60' };
    }
  };

  const colors = getRiskColor(riskLevel);

  // SVG Gauge Geometry
  const radius = 70;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
        Delay Risk Probability Gauge
      </h4>

      <div className="relative w-48 h-28 flex justify-center items-end">
        <svg className="w-48 h-48 transform -rotate-180" viewBox="0 0 160 160">
          {/* Track Arc */}
          <path
            d="M 10 80 A 70 70 0 0 1 150 80"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Value Arc */}
          <path
            d="M 10 80 A 70 70 0 0 1 150 80"
            fill="none"
            stroke={colors.stroke}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute flex flex-col items-center bottom-2">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {percentage}%
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Delay Prob</span>
        </div>
      </div>

      {/* Risk Badge & Confidence Metrics */}
      <div className="mt-3 flex items-center justify-between w-full pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium">Classification:</span>
          <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${colors.bg} ${colors.text} border ${colors.border}`}>
            {riskLevel} Risk
          </span>
        </div>
        <div className="text-slate-500 text-[11px] font-medium">
          Confidence: <span className="font-bold text-slate-900">{(confidence * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};
