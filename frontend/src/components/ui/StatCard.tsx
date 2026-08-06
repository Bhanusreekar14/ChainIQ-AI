import React from 'react';
import { Card } from './Card';
import { cn } from '../../lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  accentColor?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon,
  className,
}) => {
  return (
    <Card hoverEffect variant="default" className={cn('flex items-start justify-between group bg-white border border-slate-200 shadow-xs', className)}>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        {change && (
          <p
            className={cn(
              'text-xs font-semibold mt-2 flex items-center gap-1',
              isPositive ? 'text-emerald-600' : 'text-rose-600'
            )}
          >
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>{change}</span>
          </p>
        )}
      </div>

      <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
        {icon}
      </div>
    </Card>
  );
};
