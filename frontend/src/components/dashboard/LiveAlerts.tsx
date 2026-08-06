import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Bell, CloudRain, AlertTriangle, Radio } from 'lucide-react';
import type { LiveAlertData } from '../../types';

interface LiveAlertsProps {
  alerts: LiveAlertData[];
  loading: boolean;
}

export const LiveAlerts: React.FC<LiveAlertsProps> = ({ alerts, loading }) => {
  return (
    <Card variant="default" className="space-y-4 bg-white border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Live Environmental &amp; Route Alerts</h3>
            <p className="text-[10px] text-slate-500 font-medium">FastAPI Real-time Event Stream</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-mono font-semibold">
          <Radio className="w-3 h-3 animate-pulse text-emerald-600" /> LIVE STREAM
        </span>
      </div>

      <div className="space-y-3 text-xs">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
          ))
        ) : (
          alerts.map((a) => (
            <div
              key={a.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start gap-2.5">
                {a.type === 'Weather' ? (
                  <CloudRain className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium text-slate-900 leading-snug">{a.message}</p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">{a.timestamp}</span>
                </div>
              </div>
              <Badge variant={a.severity === 'High' ? 'critical' : 'medium'} size="sm">
                {a.severity}
              </Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
