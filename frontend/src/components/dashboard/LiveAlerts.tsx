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
    <Card variant="glass" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Live Environmental &amp; Route Alerts</h3>
            <p className="text-[10px] text-slate-400">FastAPI Real-time Event Stream</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
          <Radio className="w-3 h-3 animate-pulse" /> LIVE STREAM
        </span>
      </div>

      <div className="space-y-3 text-xs">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-900/60 animate-pulse" />
          ))
        ) : (
          alerts.map((a) => (
            <div
              key={a.id}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-2.5">
                {a.type === 'Weather' ? (
                  <CloudRain className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold text-slate-200 leading-snug">{a.message}</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">{a.timestamp}</span>
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
