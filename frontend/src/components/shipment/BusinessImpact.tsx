import React from 'react';
import { Card } from '../ui/Card';
import { DollarSign, Clock } from 'lucide-react';
import type { BusinessImpact as BusinessImpactType } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface BusinessImpactProps {
  impact: BusinessImpactType;
}

export const BusinessImpactCard: React.FC<BusinessImpactProps> = ({ impact }) => {
  return (
    <Card variant="glass" className="flex flex-col justify-between space-y-4">
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Estimated Business Impact
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Projected Savings</span>
            </div>
            <span className="text-lg font-extrabold text-emerald-400">
              {formatCurrency(impact.estimated_cost_saving_usd)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Delay Reduction</span>
            </div>
            <span className="text-lg font-extrabold text-cyan-400">
              {impact.estimated_delay_reduction_days} Days
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800">
        <span className="text-slate-400 font-medium">Operational Priority:</span>
        <span className="font-extrabold text-white uppercase">{impact.operational_priority}</span>
      </div>
    </Card>
  );
};
