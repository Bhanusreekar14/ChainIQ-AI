import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  variant?: 'default' | 'glass' | 'indigo' | 'cyan' | 'rose' | 'amber';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = false,
  variant = 'default',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-slate-900/80 border border-slate-800/80',
    glass: 'glass-panel border border-slate-800/80',
    indigo: 'bg-indigo-950/20 border border-indigo-500/30',
    cyan: 'bg-cyan-950/20 border border-cyan-500/30',
    rose: 'bg-rose-950/20 border border-rose-500/30',
    amber: 'bg-amber-950/20 border border-amber-500/30',
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-all duration-300 relative overflow-hidden',
        variantStyles[variant],
        hoverEffect && 'hover:border-slate-700 hover:shadow-xl hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
