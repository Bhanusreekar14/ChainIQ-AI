import React from 'react';
import logo from '../../assets/logo.svg';
import { cn } from '../../lib/utils';

export interface LoadingProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  label = 'Loading ChainIQ AI...',
  fullScreen = false,
  className,
}) => {
  const content = (
    <div className={cn('flex flex-col items-center justify-center gap-3 text-slate-600', className)}>
      <img src={logo} alt="ChainIQ AI" className="h-16 w-auto animate-pulse" />
      {label && <p className="text-xs font-semibold text-slate-500">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">{content}</div>;
  }

  return <div className="p-8 flex items-center justify-center w-full">{content}</div>;
};
