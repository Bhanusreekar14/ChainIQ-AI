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
    { title: 'Upgrade Shipping Mode', subtitle: 'Switch Standard Class to First Class Express', icon: <Truck className="w-4 h-4 text-cyan-400" />, priority: 'Urgent' as const },
    { title: 'Notify Regional Hub Manager', subtitle: 'Alert LATAM warehouse dispatch team', icon: <UserCheck className="w-4 h-4 text-indigo-400" />, priority: 'High' as const },
    { title: 'Monitor Transit Telemetry', subtitle: 'Enable live GPS beacon updates', icon: <Activity className="w-4 h-4 text-amber-400" />, priority: 'Medium' as const },
    { title: 'Proactive Customer Notification', subtitle: 'Send SLA guarantee status email', icon: <Send className="w-4 h-4 text-emerald-400" />, priority: 'Low' as const },
  ];

  return (
    <Card variant="glass" className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white">Prescribed AI Intervention Timeline</h4>
        <span className="text-[10px] text-slate-400 font-mono">EXECUTION PATHWAY</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {defaultSteps.map((step, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3 relative group hover:border-indigo-500/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">{step.icon}</div>
              <Badge variant={step.priority === 'Urgent' || step.priority === 'High' ? 'critical' : 'low'} size="sm">
                Step {idx + 1}
              </Badge>
            </div>

            <div>
              <p className="text-xs font-bold text-white leading-tight">{step.title}</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">{step.subtitle}</p>
            </div>

            {idx < 3 && (
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
