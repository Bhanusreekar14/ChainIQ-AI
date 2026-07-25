import React from 'react';
import { cn } from '../../lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'busy';
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  status,
  className,
  ...props
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
  };

  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-md border border-slate-700 overflow-hidden',
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : getInitials(name)}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-slate-900',
            size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3',
            status === 'online' && 'bg-emerald-400',
            status === 'offline' && 'bg-slate-500',
            status === 'busy' && 'bg-rose-500'
          )}
        />
      )}
    </div>
  );
};
