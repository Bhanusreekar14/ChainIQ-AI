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
    <Card variant="default" className="flex flex-col justify-between space-y-4 bg-white border border-slate-200/80 shadow-xs">
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Estimated Business Impact
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Projected Savings</span>
            </div>
            <span className="text-lg font-bold text-emerald-700">
              {formatCurrency(impact.estimated_cost_saving_usd)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Delay Reduction</span>
            </div>
            <span className="text-lg font-bold text-blue-700">
              {impact.estimated_delay_reduction_days} Days
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
        <span className="text-slate-500 font-medium">Operational Priority:</span>
        <span className="font-bold text-slate-900 uppercase">{impact.operational_priority}</span>
      </div>
    </Card>
  );
};
