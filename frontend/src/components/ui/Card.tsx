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
    default: 'bg-white border border-slate-200/80 shadow-xs',
    glass: 'bg-white border border-slate-200/80 shadow-xs',
    indigo: 'bg-blue-50/50 border border-blue-100',
    cyan: 'bg-sky-50/50 border border-sky-100',
    rose: 'bg-rose-50/50 border border-rose-100',
    amber: 'bg-amber-50/50 border border-amber-100',
  };

  return (
    <div
      className={cn(
        'rounded-xl p-6 transition-all duration-200 relative overflow-hidden',
        variantStyles[variant],
        hoverEffect && 'hover:border-slate-300 hover:shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
