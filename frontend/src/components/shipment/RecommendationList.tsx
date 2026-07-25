import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CheckCircle2 } from 'lucide-react';
import type { ActionRecommendation } from '../../types';

interface RecommendationListProps {
  recommendations: ActionRecommendation[];
}

export const RecommendationList: React.FC<RecommendationListProps> = ({ recommendations }) => {
  return (
    <Card variant="glass" className="space-y-4">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-indigo-400" />
        <h4 className="text-sm font-bold text-white">Recommended AI Interventions</h4>
      </div>

      <div className="space-y-2.5">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4"
          >
            <span className="text-xs font-semibold text-slate-200">{rec.action}</span>
            <Badge
              variant={
                rec.priority === 'Urgent' || rec.priority === 'High'
                  ? 'critical'
                  : rec.priority === 'Medium'
                  ? 'medium'
                  : 'low'
              }
              size="sm"
            >
              {rec.priority} Priority
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};
