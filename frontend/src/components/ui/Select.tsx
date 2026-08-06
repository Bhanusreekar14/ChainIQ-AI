import React from 'react';
import { cn } from '../../lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string | number; label: string }>;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full text-xs">
        {label && <label className="block text-slate-700 font-semibold">{label}</label>}
        <select
          ref={ref}
          className={cn(
            'w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all cursor-pointer shadow-xs',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white text-slate-900">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
