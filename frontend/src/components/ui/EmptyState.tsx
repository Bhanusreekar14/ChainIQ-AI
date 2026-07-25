import React from 'react';
import { Sparkles } from 'lucide-react';
import { Card } from './Card';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Sparkles className="w-8 h-8 text-indigo-400" />,
  title,
  description,
  action,
}) => {
  return (
    <Card variant="glass" className="border-dashed flex flex-col items-center justify-center p-10 text-center space-y-4">
      <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">{icon}</div>
      <div>
        <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </Card>
  );
};
