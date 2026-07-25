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
        return { text: 'text-emerald-400', bg: 'bg-emerald-500/20', stroke: '#10B981', border: 'border-emerald-500/30' };
      case 'Medium':
        return { text: 'text-amber-400', bg: 'bg-amber-500/20', stroke: '#F59E0B', border: 'border-amber-500/30' };
      case 'High':
        return { text: 'text-orange-400', bg: 'bg-orange-500/20', stroke: '#F97316', border: 'border-orange-500/30' };
      case 'Critical':
        return { text: 'text-rose-500', bg: 'bg-rose-500/20', stroke: '#EF4444', border: 'border-rose-500/30' };
      default:
        return { text: 'text-cyan-400', bg: 'bg-cyan-500/20', stroke: '#06B6D4', border: 'border-cyan-500/30' };
    }
  };

  const colors = getRiskColor(riskLevel);

  // SVG Gauge Geometry
  const radius = 70;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-panel rounded-2xl border border-slate-800 relative overflow-hidden">
      {/* Background ambient glow */}
      <div
        className="absolute w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none -top-10"
        style={{ backgroundColor: colors.stroke }}
      />

      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        Delay Probability Gauge
      </h4>

      <div className="relative w-48 h-28 flex justify-center items-end">
        <svg className="w-48 h-48 transform -rotate-180" viewBox="0 0 160 160">
          {/* Track Arc */}
          <path
            d="M 10 80 A 70 70 0 0 1 150 80"
            fill="none"
            stroke="#1E293B"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Animated Value Arc */}
          <path
            d="M 10 80 A 70 70 0 0 1 150 80"
            fill="none"
            stroke={colors.stroke}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute bottom-2 text-center">
          <span className={`text-4xl font-extrabold tracking-tight ${colors.text}`}>
            {percentage}%
          </span>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">Delay Probability</p>
        </div>
      </div>

      {/* Risk Badge */}
      <div className="mt-4 flex items-center gap-3">
        <span
          className={`px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
        >
          {riskLevel} Risk
        </span>
        <span className="text-xs text-slate-400 font-medium">
          Confidence: <strong className="text-white">{confidence}%</strong>
        </span>
      </div>
    </div>
  );
};
