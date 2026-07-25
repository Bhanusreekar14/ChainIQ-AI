import React from 'react';
import { Card } from './Card';
import { ACCENT_GRADIENTS } from '../../constants/colors';
import { cn } from '../../lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  accentColor?: keyof typeof ACCENT_GRADIENTS;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon,
  accentColor = 'indigo',
  className,
}) => {
  return (
    <Card hoverEffect variant="default" className={cn('flex items-start justify-between group', className)}>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-extrabold text-white tracking-tight">{value}</h3>
        {change && (
          <p
            className={cn(
              'text-xs font-semibold mt-2.5 flex items-center gap-1',
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            )}
          >
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>{change}</span>
          </p>
        )}
      </div>

      <div className={cn('p-3 rounded-xl bg-gradient-to-br border shrink-0', ACCENT_GRADIENTS[accentColor])}>
        {icon}
      </div>
    </Card>
  );
};
