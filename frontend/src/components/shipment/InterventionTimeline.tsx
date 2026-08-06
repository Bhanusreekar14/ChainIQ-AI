import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ArrowRight, Truck, UserCheck, Activity, Send } from 'lucide-react';
import type { ActionRecommendation } from '../../types';

interface InterventionTimelineProps {
  recommendations?: ActionRecommendation[];
}

export const InterventionTimeline: React.FC<InterventionTimelineProps> = () => {
  const defaultSteps = [
    { title: 'Upgrade Shipping Mode', subtitle: 'Switch Standard Class to First Class Express', icon: <Truck className="w-4 h-4 text-blue-600" />, priority: 'Urgent' as const },
    { title: 'Notify Regional Hub Manager', subtitle: 'Alert LATAM warehouse dispatch team', icon: <UserCheck className="w-4 h-4 text-blue-600" />, priority: 'High' as const },
    { title: 'Monitor Transit Telemetry', subtitle: 'Enable live GPS beacon updates', icon: <Activity className="w-4 h-4 text-amber-600" />, priority: 'Medium' as const },
    { title: 'Proactive Customer Notification', subtitle: 'Send SLA guarantee status email', icon: <Send className="w-4 h-4 text-emerald-600" />, priority: 'Low' as const },
  ];

  return (
    <Card variant="default" className="space-y-4 bg-white border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900">Prescribed AI Intervention Timeline</h4>
        <span className="text-[10px] text-slate-500 font-mono font-semibold">EXECUTION PATHWAY</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {defaultSteps.map((step, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3 relative group hover:border-blue-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-white border border-slate-200">{step.icon}</div>
              <Badge variant={step.priority === 'Urgent' || step.priority === 'High' ? 'critical' : 'low'} size="sm">
                Step {idx + 1}
              </Badge>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">{step.title}</p>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">{step.subtitle}</p>
            </div>

            {idx < 3 && (
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-400">
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
