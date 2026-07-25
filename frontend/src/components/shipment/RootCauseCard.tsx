import React from 'react';
import { Card } from '../ui/Card';
import { ShieldAlert } from 'lucide-react';

interface RootCauseCardProps {
  causes: string[];
}

export const RootCauseCard: React.FC<RootCauseCardProps> = ({ causes }) => {
  return (
    <Card variant="glass" className="space-y-3">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-amber-400" />
        <h4 className="text-sm font-bold text-white">Identified Root Cause Factors ({causes.length})</h4>
      </div>

      {causes.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {causes.map((cause, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold"
            >
              {cause}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400">No major delay root causes detected for this shipment configuration.</p>
      )}
    </Card>
  );
};
