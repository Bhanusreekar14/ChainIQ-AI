import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full text-xs">
        {label && <label className="block text-slate-700 font-semibold">{label}</label>}
        <div className="relative flex items-center">
          {leftIcon && <span className="absolute left-3 text-slate-400 pointer-events-none">{leftIcon}</span>}
          <input
            ref={ref}
            className={cn(
              'w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-xs',
              leftIcon ? 'pl-9' : '',
              rightIcon ? 'pr-9' : '',
              error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : '',
              className
            )}
            {...props}
          />
          {rightIcon && <span className="absolute right-3 text-slate-400">{rightIcon}</span>}
        </div>
        {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
