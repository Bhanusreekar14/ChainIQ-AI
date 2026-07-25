import React from 'react';

export interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  accentColor?: 'cyan' | 'indigo' | 'emerald' | 'rose' | 'amber';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon,
  accentColor = 'indigo',
}) => {
  const getGradients = () => {
    switch (accentColor) {
      case 'cyan':
        return 'from-cyan-500/20 to-blue-500/5 text-cyan-400 border-cyan-500/20';
      case 'emerald':
        return 'from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/20';
      case 'rose':
        return 'from-rose-500/20 to-pink-500/5 text-rose-400 border-rose-500/20';
      case 'amber':
        return 'from-amber-500/20 to-orange-500/5 text-amber-400 border-amber-500/20';
      default:
        return 'from-indigo-500/20 to-purple-500/5 text-indigo-400 border-indigo-500/20';
    }
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 flex items-start justify-between relative overflow-hidden group">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        {change && (
          <p
            className={`text-xs font-medium mt-2 flex items-center gap-1 ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>{change}</span>
          </p>
        )}
      </div>

      <div className={`p-3 rounded-xl bg-gradient-to-br border ${getGradients()}`}>
        {icon}
      </div>
    </div>
  );
};
