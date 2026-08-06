import React from 'react';
import { Card } from '../ui/Card';
import { ShieldAlert } from 'lucide-react';

interface RootCauseCardProps {
  causes: string[];
}

export const RootCauseCard: React.FC<RootCauseCardProps> = ({ causes }) => {
  return (
    <Card variant="default" className="space-y-3 bg-white border border-slate-200/80 shadow-xs">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-amber-600" />
        <h4 className="text-sm font-bold text-slate-900">Identified Root Cause Factors ({causes.length})</h4>
      </div>

      {causes.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {causes.map((cause, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold"
            >
              {cause}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500 font-medium">No major delay root causes detected for this shipment configuration.</p>
      )}
    </Card>
  );
};
