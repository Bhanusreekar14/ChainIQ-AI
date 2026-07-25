import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface LoadingProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  label = 'Loading data...',
  size = 'md',
  fullScreen = false,
  className,
}) => {
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3 text-slate-400', className)}>
      <Loader2 className={cn('animate-spin text-indigo-500', sizeStyles[size])} />
      {label && <p className="text-xs font-semibold text-slate-400">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center">{content}</div>;
  }

  return <div className="p-8 flex items-center justify-center w-full">{content}</div>;
};
