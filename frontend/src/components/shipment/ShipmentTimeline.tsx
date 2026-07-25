import React from 'react';
import { Card } from '../ui/Card';
import { CheckCircle, Clock } from 'lucide-react';

export const ShipmentTimeline: React.FC = () => {
  const steps = [
    { title: 'Order Created', date: 'Jul 24, 09:30 AM', completed: true, active: false },
    { title: 'Feature Vector Extraction', date: 'Jul 24, 09:31 AM', completed: true, active: false },
    { title: 'CatBoost Risk Analysis', date: 'Jul 24, 09:32 AM', completed: true, active: true },
    { title: 'Intervention Dispatch', date: 'Scheduled', completed: false, active: false },
  ];

  return (
    <Card variant="glass" className="space-y-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Inference & Execution Sequence
      </h4>
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-3 text-xs">
            <div className={`p-1.5 rounded-full ${step.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
              {step.completed ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            </div>
            <div className="flex-1 flex justify-between">
              <span className={`font-semibold ${step.active ? 'text-cyan-400' : step.completed ? 'text-white' : 'text-slate-500'}`}>
                {step.title}
              </span>
              <span className="text-[10px] text-slate-400">{step.date}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
