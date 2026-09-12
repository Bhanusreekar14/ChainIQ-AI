import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'low' | 'medium' | 'high' | 'critical' | 'urgent' | 'ai' | 'indigo' | 'slate';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'slate',
  size = 'md',
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantStyles = {
    low: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold',
    medium: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-semibold',
    high: 'bg-orange-50 text-orange-700 border border-orange-200/60 font-semibold',
    critical: 'bg-rose-50 text-rose-700 border border-rose-200/60 font-semibold',
    urgent: 'bg-rose-600 text-white font-semibold uppercase shadow-xs',
    ai: 'bg-blue-50 text-blue-700 border border-blue-200/60 font-semibold',
    indigo: 'bg-blue-50 text-blue-700 border border-blue-200/60 font-semibold',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200/60 font-semibold',
  };

  return (
    <span
      className={cn('inline-flex items-center rounded-md font-sans tracking-tight shrink-0', sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};
