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
    low: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold',
    medium: 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold',
    high: 'bg-orange-500/20 text-orange-400 border border-orange-500/30 font-semibold',
    critical: 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold',
    urgent: 'bg-rose-600 text-white font-extrabold uppercase shadow-sm',
    ai: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold',
    indigo: 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold',
    slate: 'bg-slate-800 text-slate-300 border border-slate-700 font-semibold',
  };

  return (
    <span
      className={cn('inline-flex items-center rounded-full font-sans tracking-wide shrink-0', sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};
