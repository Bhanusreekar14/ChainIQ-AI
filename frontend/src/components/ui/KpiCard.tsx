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
  const getIconStyles = () => {
    switch (accentColor) {
      case 'cyan':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'emerald':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'rose':
        return 'bg-rose-50 text-rose-600 border border-rose-100';
      case 'amber':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      default:
        return 'bg-blue-50 text-blue-600 border border-blue-100';
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-start justify-between relative overflow-hidden transition-all duration-150 hover:border-slate-300">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        {change && (
          <p
            className={`text-xs font-semibold mt-2 flex items-center gap-1 ${
              isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>{change}</span>
          </p>
        )}
      </div>

      <div className={`p-2.5 rounded-lg ${getIconStyles()}`}>
        {icon}
      </div>
    </div>
  );
};
